'use client'

import './style.scss'
import { useRef } from 'react'

const blk = 'clock-container'

type clockContainerProps = {
  dataAutoId?: string
}

const ClockContainer = ({ dataAutoId }: clockContainerProps) => {

  const hourArrowRef = useRef<HTMLDivElement>(null)
  const minuteArrowRef = useRef<HTMLDivElement>(null)
  const secondArrowRef = useRef<HTMLDivElement>(null)

  const updateClock = () => {
    const now = new Date()
    const hours = now.getHours() % 12
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()

    const hourRotation = (360 / 12) * hours + (360 / 12) * (minutes / 60)
    const minuteRotation = (360 / 60) * minutes + (360 / 60) * (seconds / 60)
    const secondRotation = (360 / 60) * seconds
    if (hourArrowRef.current) {
      hourArrowRef.current.style.transform = `translateX(-2px) translateY(-50%) rotate(${hourRotation}deg)`
    }

    if (minuteArrowRef.current) {
      minuteArrowRef.current.style.transform = `translateX(-1px) translateY(-50%) rotate(${minuteRotation}deg)`
    }

    if (secondArrowRef.current) {
      secondArrowRef.current.style.transform = `translateX(-0.5px) translateY(-50%) rotate(${secondRotation}deg)`
    }
  }

  setInterval(updateClock, 1000)

  updateClock()

  const array = Array(59)
    .fill(undefined)
    .map((_, index) => index + 1)
  return (
    <>
      <div className="clock-bg" data-auto-id={dataAutoId}>
        <div className={blk}>
          <div className="clock">
            <div className="tick h12"></div>

            <div className="tick h1 small"></div>

            <div className="tick h2 small"></div>

            <div className="tick h3"></div>

            <div className="tick h4 small"></div>

            <div className="tick h5 small"></div>

            <div className="tick h6"></div>

            <div className="tick h7 small"></div>

            <div className="tick h8 small"></div>

            <div className="tick h9"></div>

            <div className="tick h10 small"></div>

            <div className="tick h11 small"></div>

            {array.map(item => (
              <div key={item} className= {`min m${item}`}
              >
              </div>
            ))}

            <div className="arrow-hour" ref={hourArrowRef}></div>

            <div className="arrow-minute" ref={minuteArrowRef}></div>

            <div className="arrow-second" ref={secondArrowRef}></div>

            <div className="arrow-dot"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ClockContainer
