import React from 'react'
import { Grid, Accordion, AccordionHeaderTitle, AccordionContent } from 'ui-library'
import { StyledAccordionHeaders, HeaderWrapper, SideBarHeader, SideBarHeading, SideBarWrapper, SideBarContent } from './SideBar.styles'

interface ISideBarProps {
    menu: any,
    header: string,
    selectStep: Function
}

const SideBar = ({
    menu,
    header,
    selectStep }: ISideBarProps) => {
    const [expanded, setExpanded] = React.useState('0')
    const handleToggle = (accordionId: string, isExpanded?: boolean) => {
        setExpanded(isExpanded ? accordionId : '')
    }
    const selectNewStep = (step: any) => {
        selectStep(step)
    }
    return (
        <SideBarWrapper>
            <SideBarHeader>
                <Grid container style={{ alignItems: 'center' }}>
                    <Grid item sm={8} xs={8} md={8} lg={8}>
                        <SideBarHeading>
                            {header}
                        </SideBarHeading>
                    </Grid>
                    {/* <Grid item sm={4} xs={4} md={4} lg={4}>
                            <SideBarCollapse>
                                <IconButton
                                    primary
                                    iconVariant='angle-left'
                                    iconSize={11}
                                    circle
                                    style={{ backgroundColor: "#5698d3", color: "#fff", padding: "12px 12px 5px" }}
                                />
                            </SideBarCollapse>

                        </Grid> */}
                </Grid>
            </SideBarHeader>
            <SideBarContent>
                {menu && menu.map((menuItem_Level1: any, index: number) => {
                    return <Accordion key={menuItem_Level1.stepName + index} id={index.toString()} expanded={expanded === index.toString()} onToggle={handleToggle}>
                        {{
                            header: (
                                <HeaderWrapper>
                                    {/* <StyledAccordionHeaders expanded={expanded === index.toString()}> */}
                                        <AccordionHeaderTitle >
                                            {menuItem_Level1.stepNameLabel}
                                        </AccordionHeaderTitle>

                                    {/* </StyledAccordionHeaders> */}

                                </HeaderWrapper>
                            ),
                            content: (
                                <AccordionContent>
                                    {menuItem_Level1.subSteps && menuItem_Level1.subSteps.map((menuItem_Level2: any, index: number) => {
                                        return <> { menuItem_Level2.subSteps && (menuItem_Level2.subSteps.length > 0) ?
                                                <Accordion key={menuItem_Level2.stepName + index} id={menuItem_Level2.id + index.toString()} expanded={expanded === menuItem_Level2.id + index.toString()} onToggle={handleToggle}>
                                                    {{
                                                        header: (
                                                            <HeaderWrapper>
                                                                <StyledAccordionHeaders expanded={expanded === menuItem_Level2.id + index.toString()}>
                                                                    <AccordionHeaderTitle >
                                                                        {menuItem_Level2.stepNameLabel}
                                                                    </AccordionHeaderTitle>

                                                                </StyledAccordionHeaders>
                                                            </HeaderWrapper>
                                                        ),
                                                        content: (
                                                            <AccordionContent>
                                                                {menuItem_Level2.subSteps && menuItem_Level2.subSteps.map((menuItem_Level3: any, index: number) => {
                                                                    return <>
                                                                        {menuItem_Level3.subSteps && (menuItem_Level3.subSteps.length > 0) ?
                                                                            <Accordion key={menuItem_Level3.stepName + index} id={menuItem_Level3.id + index.toString()} expanded={expanded === menuItem_Level3.id + index.toString()} onToggle={handleToggle}>
                                                                                {{
                                                                                    header: (
                                                                                        <HeaderWrapper>
                                                                                            <StyledAccordionHeaders expanded={expanded === menuItem_Level3.id + index.toString()}>
                                                                                                <AccordionHeaderTitle >
                                                                                                    {menuItem_Level3.stepNameLabel}
                                                                                                </AccordionHeaderTitle>
                                                                                            </StyledAccordionHeaders>
                                                                                        </HeaderWrapper>
                                                                                    ),
                                                                                    content: (
                                                                                        <div>

                                                                                        </div>)
                                                                                }}
                                                                            </Accordion> :
                                                                            <AccordionHeaderTitle className={"subLevelMenu " + (menuItem_Level3.isLocked ? " menu-disabled " : '') + (menuItem_Level3.isOpen ? 'active' : '')} onClick={() => selectNewStep(menuItem_Level3)}>
                                                                                {menuItem_Level3.stepNameLabel}
                                                                            </AccordionHeaderTitle>
                                                                        }
                                                                    </>
                                                                })}
                                                            </AccordionContent>)
                                                    }}
                                                </Accordion> :
                                                <AccordionHeaderTitle className={"subLevelMenu " + (menuItem_Level2.isLocked ? " menu-disabled " : '') + (menuItem_Level2.isOpen ? 'active' : '')} onClick={() => selectNewStep(menuItem_Level2)}>
                                                    {menuItem_Level2.stepNameLabel}
                                                </AccordionHeaderTitle>}
                                        </>
                                    })}
                                </AccordionContent>
                            )
                        }}
                    </Accordion>
                }
                )}
            </SideBarContent>
        </SideBarWrapper>

    )
}


export default SideBar;