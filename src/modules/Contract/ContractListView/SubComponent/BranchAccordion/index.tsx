import React from 'react'
import { Accordion, AccordionHeaderTitle, AccordionContent, Box, Card, Typography } from 'ui-library'
import styled from 'styled-components'

const StyledBox = styled(Box)`
    padding: 10px;
    border: 1px solid #dfdfdf;
    background-color: #fafafsa;
    margin:10px 0px;
    min-height: 100px;
`


const BranchAccordion = ({ data }: any) => {
    const [expanded, setExpanded] = React.useState('1')
    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        setExpanded(isExpanded ? accordianId : '')
    }

    return (
        <>
            {data?.map((d: any, index: any) =>
                <Accordion id={index} expanded={expanded === index} onToggle={handleToggle}>
                    {{
                        header: (
                            <>
                                <AccordionHeaderTitle>
                                    {index + 1}. {d?.branchName}
                                </AccordionHeaderTitle>
                            </>
                        ),
                        content: (
                            <AccordionContent   >
                                <Typography
                                    fontSize='14px'
                                    align='left'
                                    fontWeight={400}
                                    color='grey'
                                > Fleet Types </Typography>

                                <StyledBox>
                                    {d?.fleetTypeMasterDTOs?.map((ft: any, index: number) =>
                                        <Card style={{
                                            display: 'inline-block', margin: '5px',
                                            padding: '5px 10px',
                                            border: '1px solid #e4e4e4',
                                            boxShadow: 'grey 2px 2px 10px -5px'
                                        }}>{index + 1}. {ft?.type}</Card>
                                    )}
                                </StyledBox>

                            </AccordionContent>
                        )
                    }}
                </Accordion>

            )}
        </>
    )
}

export default BranchAccordion