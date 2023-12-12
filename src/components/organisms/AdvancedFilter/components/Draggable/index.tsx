const Draggable = (elementId: string, headerId: string) => {
  const element = document.getElementById(elementId)
  let pos1 = 0
  let pos2 = 0
  let pos3 = 0
  let pos4 = 0

  const dragMouseDown = (e: MouseEvent) => {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  const elementDrag = (e: MouseEvent) => {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    if (element !== null) {
      element.style.top = element.offsetTop - pos2 + 'px'
      element.style.left = element.offsetLeft - pos1 + 'px'
    }
  }

  const closeDragElement = () => {
    /* stop moving when mouse button is released: */
    document.onmouseup = null
    document.onmousemove = null
  }

  if (document.getElementById(headerId)) {
    /* if present, the header is where you move the DIV from: */
    const obj = document.getElementById(headerId)
    if (obj !== null) {
      obj.onmousedown = dragMouseDown
    }
    /* otherwise, move the DIV from anywhere inside the DIV: */
  } else {
    if (element !== null) {
      element.onmousedown = dragMouseDown
    }
  }
}

export default Draggable
