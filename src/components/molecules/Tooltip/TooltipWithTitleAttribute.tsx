const TitleTooltip = () => {
  const delta = 5
  const toTitle = document.querySelectorAll('[title]')

  const span = document.createElement('span')
  span.classList.add('createdTooltip')
  let parent: HTMLElement | null

  const textProp = 'textContent' in document ? 'textContent' : 'innerText'
  let spanClone
  ;[].forEach.call(toTitle, (elem: HTMLElement) => {
    /* reference to the element's parentNode: */
    parent = elem.parentElement

    /* cloning the span, to avoid creating multiple elements: */
    spanClone = span.cloneNode()

    /* setting the text of the cloned span to the text of the attribute from which the text should be taken: */
    spanClone[textProp] = elem.getAttribute('title')

    /* inserting the created/cloned span into the document, after the element: */
    parent && parent.insertBefore(spanClone, elem.nextSibling)

    /* binding the reposition function to the mousemove. event: */
    elem.addEventListener('mousemove', reposition)

    /* we're setting 'title' attribute to an empty string so that css apply */
    elem.setAttribute('title', '')
  })

  function reposition(this: HTMLElement, e: MouseEvent) {
    const tooltip: HTMLElement = this.nextElementSibling as HTMLElement
    tooltip.style.top = e.pageY + delta + 'px'
    tooltip.style.left = e.pageX + delta + 'px'
  }
}
export default TitleTooltip
