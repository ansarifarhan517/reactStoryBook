import { useRef, useEffect, useState } from 'react'

const useElementInView = (options: Record<string, any>) => {
  const containerRef = useRef(null)
  const [ isVisible, setIsVisible ] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries: any) => {
      const [ entry ] = entries
      setIsVisible(entry.isIntersecting)
      if (isVisible) {
        observer.disconnect()
      }
    }, options)
    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [containerRef, options])

  return [containerRef, isVisible]
}

export default useElementInView
