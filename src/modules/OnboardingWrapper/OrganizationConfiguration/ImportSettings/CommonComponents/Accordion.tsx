import React, { useEffect } from 'react';
import { Accordion, AccordionHeaderTitle, AccordionHeaderSubTitle, AccordionContent } from 'ui-library';

interface IAccordionModal {
    id: string,
    headerTitle: string,
    headerSubTitle?: string,
    showToggleSwitch?: boolean,
    hideChevron?: boolean,
    isToggleChecked?: boolean,
    renderAccordionChilds?: Function,
    accordionToggle?: any,
    expanded?: any,
    setExpanded?: any
}

const AccordionComponent = ({ 
    id, 
    headerTitle, 
    headerSubTitle, 
    showToggleSwitch = false,
    hideChevron = false,
    isToggleChecked = false,
    renderAccordionChilds = () => {},
    accordionToggle,
    expanded,
    setExpanded
}: IAccordionModal) => {
  const [toggle, setToggle] = React.useState(isToggleChecked);

  const handleToggle = (accordianId: string, isExpanded?: boolean) => {
      console.log(accordianId, isExpanded);
    if(hideChevron) return;

    setExpanded(isExpanded ? accordianId : '');
  }

  const handleOnToggleSwitch = () => {
    if(!showToggleSwitch) return;

    setToggle(!toggle);

    const {key, accordionToggles, setAccordionToggles} = accordionToggle;

    setAccordionToggles({ ...accordionToggles, [key]: !toggle });
  }

  useEffect(() => {
    if(accordionToggle !== undefined) {
        const {key, accordionToggles, setAccordionToggles} = accordionToggle;

        if(!accordionToggles.hasOwnProperty(key)) {
            setAccordionToggles({ ...accordionToggles, [key]: false });
        }
    }
  }, []);

  return (
    <Accordion 
        id={id} 
        expanded={id === expanded} 
        showToggleSwitch={showToggleSwitch} 
        onToggle={handleToggle}
        hideChevron={hideChevron}
        onToggleSwitch={handleOnToggleSwitch}
        isToggleChecked={toggle}
    >
        {{
            header: (
                <>
                    {headerTitle ? <AccordionHeaderTitle>{headerTitle}</AccordionHeaderTitle> : <></>}
                    {headerSubTitle ? <AccordionHeaderSubTitle>{headerSubTitle}</AccordionHeaderSubTitle> : <></>}
                </>
            ),
            content: (
                <AccordionContent>
                    {renderAccordionChilds()}
                </AccordionContent>
            )
        }}
    </Accordion>
  )
}

export default AccordionComponent;