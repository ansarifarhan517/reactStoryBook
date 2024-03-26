import React, { useState } from 'react'
import { Box, Toggle, Accordion, AccordionContent, AccordionHeaderTitle, AccordionHeaderSubTitle } from 'ui-library'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import AccessProfileRecursiveChildComponent from './AccessProfileRecursiveChildComponent'

const AccessFormRecursiveComponent = (props: any) => {
    const flatObject = useTypedSelector(state => state.accessProfile.form.flatObject)
    const { accessSections, setAccessRefIds, accessRefIds,isAdminProfile } = props
    const [expandedAccordionID, setExpandedAccordionID] = useState<string>('')
    const handleAccordionToggle = React.useCallback((id: string, isExpanded?: boolean) => {
        setExpandedAccordionID(isExpanded ? id : '')
    }, [setExpandedAccordionID])

    const AccordionToggle = (props: any) => {
        const { access } = props
        let active: boolean = false
        if (access.accessRefId) {
            active = accessRefIds.has(access.accessRefId)
        } else {
            Object.keys(flatObject).forEach((key) => {
                if (key.includes(access.accessNameLabelKey)) {
                    if (flatObject[key] && flatObject[key].length) {
                        let accessIdList = flatObject[key]
                        accessIdList.map((accessId: string) => {
                            if (accessRefIds.has(accessId)) {
                                active = true
                            }
                        })
                    }
                }
            })
        }
        const isActive = active
        return <Toggle
            checked={isActive}
            onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => handleChildAccessToggle(checked, access)}
        />
    }

    const handleChildAccessToggle = (isToggled: boolean, access: any) => {
        const tempaccessIdsSet = new Set(accessRefIds)
        if (isToggled) {
            let parentToggleKeys: string[] = []
            let accessKey: string = ''
            if (!accessRefIds.has(access.accessRefId)) {
                if (access.accessRefId) {
                    tempaccessIdsSet.add(access.accessRefId)
                }
                Object.keys(flatObject).forEach((key) => {
                    if (key.includes(access.accessNameLabelKey)) {
                        parentToggleKeys = key.split(".")
                    }
                })

                let toggleKeys: string[] = []
                while (parentToggleKeys.length > 0) {
                    toggleKeys = parentToggleKeys
                    toggleKeys.pop()
                    accessKey = toggleKeys.join(".")
                    // turn on parent access toggles
                    Object.keys(flatObject).forEach((key) => {
                        if (key === accessKey) {
                            if (flatObject[key] && flatObject[key].length) {
                                let accessIdList = flatObject[key]
                                accessIdList.map((accessId: string) => {
                                    if (!tempaccessIdsSet.has(accessId)) {
                                        tempaccessIdsSet.add(accessId)
                                    }
                                })
                            }
                        }
                    })
                    // turn on child accesses toggle
                    Object.keys(flatObject).forEach((key) => {
                        if (key.includes(access.accessNameLabelKey)) {
                            if (flatObject[key] && flatObject[key].length) {
                                let accessIdList = flatObject[key]
                                accessIdList.map((accessId: string) => {
                                    if (!tempaccessIdsSet.has(accessId)) {
                                        tempaccessIdsSet.add(accessId)
                                    }
                                })
                            }
                        }
                    })
                }
            }
            setAccessRefIds(tempaccessIdsSet)
        } else {
            Object.keys(flatObject).forEach((key) => {
                if (key.includes(access.accessNameLabelKey)) {
                    if (flatObject[key] && flatObject[key].length) {
                        let accessIdList = flatObject[key]
                        accessIdList.map((accessId: string) => {
                            if (tempaccessIdsSet.has(accessId)) {
                                tempaccessIdsSet.delete(accessId)
                            }
                        })
                    }
                }
            })
            if (tempaccessIdsSet.has(access.accessRefId)) {
                tempaccessIdsSet.delete(access.accessRefId)
            }
            let parentToggleKeys: string[] = []
            let accessKey: string = ''
            let removeParentAccessRefId: boolean = true
            Object.keys(flatObject).forEach((key) => {
                if (key.includes(access.accessNameLabelKey)) {
                    parentToggleKeys = key.split(".")
                }
            })

            let toggleKeys: string[] = []
            while (parentToggleKeys.length > 0) {
                toggleKeys = parentToggleKeys
                toggleKeys.pop()
                accessKey = toggleKeys.join(".")
                Object.keys(flatObject).forEach((key) => {
                    if (key.includes(accessKey + '.')) {
                        if (flatObject[key] && flatObject[key].length) {
                            let accessIdList = flatObject[key]
                            accessIdList.map((accessId: string) => {
                                if (tempaccessIdsSet.has(accessId)) {
                                    removeParentAccessRefId = false
                                }
                            })
                        }
                    }
                })
                if (removeParentAccessRefId) {
                    let accessIdList = flatObject[accessKey]
                    accessIdList.map((accessId: string) => {
                        if (tempaccessIdsSet.has(accessId)) {
                            tempaccessIdsSet.delete(accessId)
                        }
                    })

                }
            }
            setAccessRefIds(tempaccessIdsSet)
        }
    }

    const handleToggleSwitch = (isActive: boolean, accessSection: any) => {
        const tempaccessIdsSet = new Set(accessRefIds)
        if (isActive) {
            let parentToggleKeys: string[] = []
            let accessKey: string = ''
            if (accessSection.accessRefId) {
                if (!accessRefIds.has(accessSection.accessRefId)) {
                    tempaccessIdsSet.add(accessSection.accessRefId)
                }
            }
            Object.keys(flatObject).forEach((key) => {
                if (key.includes(accessSection.sectionNameLabelKey)) {
                    parentToggleKeys = key.split(".")
                }
            })

            let toggleKeys: string[] = []
            if (parentToggleKeys.length > 1) {
                while (parentToggleKeys.length > 0) {
                    toggleKeys = parentToggleKeys
                    toggleKeys.pop()
                    accessKey = toggleKeys.join(".")
                    // turn on parent access toggles
                    Object.keys(flatObject).forEach((key) => {
                        if (key === accessKey) {
                            if (flatObject[key] && flatObject[key].length) {
                                let accessIdList = flatObject[key]
                                accessIdList.map((accessId: string) => {
                                    if (!tempaccessIdsSet.has(accessId)) {
                                        tempaccessIdsSet.add(accessId)
                                    }
                                })
                            }
                        }
                    })
                }
            }
            // turn on child accesses toggle
            Object.keys(flatObject).forEach((key) => {
                if (key.includes(accessSection.sectionNameLabelKey)) {
                    if (flatObject[key] && flatObject[key].length) {
                        let accessIdList = flatObject[key]
                        accessIdList.map((accessId: string) => {
                            if (!tempaccessIdsSet.has(accessId)) {
                                tempaccessIdsSet.add(accessId)
                            }
                        })
                    }
                }
            })
            setAccessRefIds(tempaccessIdsSet)
        } else {
            Object.keys(flatObject).forEach((key) => {
                if (key.includes(accessSection.sectionNameLabelKey)) {
                    if (flatObject[key] && flatObject[key].length) {
                        let accessIdList = flatObject[key]
                        accessIdList.map((accessId: string) => {
                            if (tempaccessIdsSet.has(accessId)) {
                                tempaccessIdsSet.delete(accessId)
                            }
                        })
                    }
                }
            })
            if (accessSection.accessRefId) {
                if (tempaccessIdsSet.has(accessSection.accessRefId)) {
                    tempaccessIdsSet.delete(accessSection.accessRefId)
                }
            }
            let parentToggleKeys: string[] = []
            let accessKey: string = ''
            let removeParentAccessRefId: boolean = true
            Object.keys(flatObject).forEach((key) => {
                if (key.includes(accessSection.sectionNameLabelKey)) {
                    parentToggleKeys = key.split(".")
                }
            })

            let toggleKeys: string[] = []
            if (parentToggleKeys.length > 1) {
                while (parentToggleKeys.length > 0) {
                    toggleKeys = parentToggleKeys
                    toggleKeys.pop()
                    accessKey = toggleKeys.join(".")
                    Object.keys(flatObject).forEach((key) => {
                        if (key.includes(accessKey + '.')) {
                            if (flatObject[key] && flatObject[key].length) {
                                let accessIdList = flatObject[key]
                                accessIdList.map((accessId: string) => {
                                    if (tempaccessIdsSet.has(accessId)) {
                                        removeParentAccessRefId = false
                                    }
                                })
                            }
                        }
                    })
                    if (removeParentAccessRefId) {
                        let accessIdList = flatObject[accessKey]
                        if (accessIdList) {
                            accessIdList.map((accessId: string) => {
                                if (tempaccessIdsSet.has(accessId)) {
                                    tempaccessIdsSet.delete(accessId)
                                }
                            })
                        }
                    }
                }
            }
            setAccessRefIds(tempaccessIdsSet)
        }
    }


    const AccessSection = (props: any) => {
        const { accesses } = props

        return (
            <div>
                {Object.values(accesses).map((access: any) => {
                    return (
                        <>
                            <Box display='flex'>
                                <Box style={{ width: '45px' }}>
                                    <AccordionToggle access={access} />
                                </Box>
                                <Box style={{ paddingLeft: '15px' }}>
                                    <AccordionHeaderTitle style={{ fontWeight: 'bold' }}>{access.accessNameLabelValue}</AccordionHeaderTitle>
                                    <AccordionHeaderSubTitle>{access.accessNameDescLabelValue}</AccordionHeaderSubTitle>
                                </Box>
                            </Box>
                            {access.accesses && access.childAccessMode && <Access childAccesses={access.accesses} />}
                            <div style={{ borderTop: '1px', borderTopStyle: 'solid', borderTopColor: '#eee', marginTop: '10px', marginBottom: '10px' }}></div>
                        </>
                    )
                })
                }
            </div>
        )
    }


    const Access = (props: any) => {
        const { childAccesses } = props

        return (
            <div>
                {Object.values(childAccesses).map((access: any) => {
                    return (
                        <>
                            <Box style={{ padding: '5px 0 5px 55px' }}>
                                <Box display='flex'>
                                    <Box style={{ width: '45px' }}> <AccordionToggle access={access} /> </Box>
                                    <Box style={{ paddingLeft: '15px' }}>
                                        <AccordionHeaderTitle style={{ fontWeight: 'bold' }}>{access.accessNameLabelValue}</AccordionHeaderTitle>
                                        <AccordionHeaderSubTitle>{access.accessNameDescLabelValue}</AccordionHeaderSubTitle>
                                    </Box>
                                </Box>
                                {access.accesses && <Access childAccesses={access.accesses} />}
                            </Box>

                        </>
                    )
                })
                }
            </div>
        )
    }

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
                    <Accordion key={accessSection.sectionNameLabelKey} id={accessSection.sectionNameLabelKey} showToggleSwitch={true} isToggleChecked={isToggleChecked} onToggleSwitch={(e: boolean) => handleToggleSwitch(e, accessSection)} expanded={expandedAccordionID === accessSection.sectionNameLabelKey && (accessSection.accessSections || accessSection.accesses)} onToggle={handleAccordionToggle} hideChevron={!(accessSection.accessSections || accessSection.accesses)} toggleSwitchStyle={!(accessSection.accessSections || accessSection.accesses) ? { paddingRight: '30px' } : { paddingRight: '0px' }}>
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
                                        <AccessProfileRecursiveChildComponent accessSections={accessSection.accessSections} accessRefIds={accessRefIds} AccessSection={AccessSection} handleToggleSwitch={handleToggleSwitch} isAdminProfile={isAdminProfile} />
                                    }
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

export default AccessFormRecursiveComponent