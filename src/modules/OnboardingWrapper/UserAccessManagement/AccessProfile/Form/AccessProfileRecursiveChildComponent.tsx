import React, { useState } from 'react'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import { Box, Accordion, AccordionContent, AccordionHeaderTitle, AccordionHeaderSubTitle } from 'ui-library'

const AccessFormRecursiveChildComponent = (props: any) => {
    const flatObject = useTypedSelector(state => state.accessProfile.form.flatObject)
    const { accessSections, accessRefIds, AccessSection, handleToggleSwitch, isAdminProfile } = props
    const [expandedAccordionID, setExpandedAccordionID] = useState<string>('')
    const handleAccordionToggle = React.useCallback((id: string, isExpanded?: boolean) => {
        setExpandedAccordionID(isExpanded ? id : '')
    }, [setExpandedAccordionID])

    return (
        <div>
            { Object.values(accessSections).map((accessSection: any) => {
                let isToggleChecked: boolean = false
                if (accessSection.accessRefId) {
                    isToggleChecked = accessRefIds.has(accessSection.accessRefId)
                } else {
                    Object.keys(flatObject).forEach((key) => {
                        if (key.includes(accessSection.sectionNameLabelKey)) {
                            if (flatObject[key] && flatObject[key].length) {
                                let accessIdList = flatObject[key]
                                accessIdList.map((accessId: string) => {
                                    if (accessRefIds.has(accessId)) {
                                        isToggleChecked = true
                                    }
                                })
                            }
                        }
                    })
                }
                return (
                    <Accordion key={accessSection.sectionNameLabelKey} id={accessSection.sectionNameLabelKey} toggleSwitchDisable={(isAdminProfile && accessSection.sectionNameLabelKey==='SETTINGS_ACCESSPROFILES_LABEL_KEY')} showToggleSwitch={true} isToggleChecked={isToggleChecked} onToggleSwitch={(e: boolean) => handleToggleSwitch(e, accessSection)} expanded={expandedAccordionID === accessSection.sectionNameLabelKey && (accessSection.accessSections || accessSection.accesses)} onToggle={handleAccordionToggle} hideChevron={!(accessSection.accessSections || accessSection.accesses)} toggleSwitchStyle={!(accessSection.accessSections || accessSection.accesses) ? { paddingRight: '30px' } : { paddingRight: '0px' }}>
                        {{
                            header: (
                                <Box display='flex'>
                                    <Box>
                                        <AccordionHeaderTitle style={{ fontWeight: 'bold' }}>{accessSection.sectionNameLabelValue}</AccordionHeaderTitle>
                                        <AccordionHeaderSubTitle style={{ paddingRight: '10px' }}>{accessSection.sectionNameDescLabelValue}</AccordionHeaderSubTitle>
                                    </Box>
                                </Box>
                            ),
                            content: (
                                (expandedAccordionID === accessSection.sectionNameLabelKey && (accessSection.accessSections || accessSection.accesses)) &&
                                <AccordionContent>
                                    {accessSection.accessSections && accessSection.accessSections.length && 
                                    <AccessFormRecursiveChildComponent accessSections={accessSection.accessSections} accessRefIds={accessRefIds} AccessSection={AccessSection} handleToggleSwitch={handleToggleSwitch} isAdminProfile={isAdminProfile}/>}
                                    {accessSection.accesses && <AccessSection accesses={accessSection.accesses} />}
                                </AccordionContent>
                            ),
                        }}
                    </Accordion>
                )
            })
            }
        </div>
    )

}
export default AccessFormRecursiveChildComponent