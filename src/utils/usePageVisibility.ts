import React from "react";
export const getBrowserVisibilityProp = () => {
    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      return "visibilitychange"
    } else {
        return;
    }
    // else if (typeof document?.msHidden !== "undefined") {
    //   return "msvisibilitychange"
    // } else if (typeof document?.webkitHidden !== "undefined") {
    //   return "webkitvisibilitychange"
    // }
  }
  
  export const getBrowserDocumentHiddenProp = () => {
    if (typeof document.hidden !== "undefined") {
      return "hidden"
    } else {
        return;
    }
    // else if (typeof document?.msHidden !== "undefined") {
    //   return "msHidden"
    // } else if (typeof document?.webkitHidden !== "undefined") {
    //   return "webkitHidden"
    // }
  }
  
  export function getIsDocumentHidden() {
    return !document[getBrowserDocumentHiddenProp() as string]
  }

export function usePageVisibility() {
    const [isVisible, setIsVisible] = React.useState(getIsDocumentHidden())
    const onVisibilityChange = () => setIsVisible(getIsDocumentHidden())
  
    React.useEffect(() => {
      const visibilityChange = getBrowserVisibilityProp()
  
      document.addEventListener(String(visibilityChange), onVisibilityChange, false)
  
      return () => {
        document.removeEventListener(String(visibilityChange), onVisibilityChange)
      }
    })
  
    return isVisible
  }