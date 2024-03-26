export const fixTooltipIssue = () => {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        // console.log(mutation)
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          // element added to DOM
          var hasClass = [].some.call(mutation.addedNodes, function (el) {
            return el.classList.contains('ui-tooltip')
          });
          if (hasClass) {
            // element has class `ui-tooltip`
            // console.log('element ".ui-tooltip" added');
            /** Remove previous tooltips */
            $('.ui-tooltip:not(:last-child)').remove()
          }
        }
      });
    });
  
    var config = {
      attributes: true,
      childList: true,
      characterData: true
    };
  
    observer.observe(document.body, config);
  }


  export const removeListViewTooltip = () => {
    const obj = Array.from(document.querySelectorAll(".ui-tooltip"));
    obj?.forEach((e) => {
      e.remove();
    });
  };