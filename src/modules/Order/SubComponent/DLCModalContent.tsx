
import React from "react";
import { Box, Accordion, Grid } from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import TabComponent from '../SubComponent/TabComponent';
// import axios from "../../../utils/axios";
// import { getFormattedDate } from '../OrderListOptionData/utils';
// import apiMappings from "../../../utils/apiMapping";

// import moment from 'moment';
// import DAListView from './DAListView';
const DLCModalContent = (props: any) => {
    const { structure, data } = props
    const dynamicLabel = useTypedSelector(state => state.dynamicLabels);
    // const clientProperties = useTypedSelector(state => state.clientProperties);
    console.log(structure, "FROM CONTENT");
    console.log(data, "FROM CONTENT");

    const [expanded, setExpanded] = React.useState(structure?.sections?.["pickup"]?.isActive ? "pickup": "deliver");
    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        setExpanded(isExpanded ? accordianId : '')
    }

    return <Box p='1em'>

        {
            Object.keys(structure?.sections).map((section: string) => {
                return !structure?.sections[section].isLocked && <Accordion id={section} expanded={expanded === expanded} onToggle={handleToggle}>
                    {{
                        header: (
                            <>
                                <Grid container>
                                    <Grid item xs={10}>
                                        <h4>{dynamicLabel[section] ? dynamicLabel[section] : "section123456"}</h4>
                                    </Grid>
                                    <Grid item xs={2}>
                                        {/* <h4>{data[section + "_total"] ? data[section + "_total"] : '0.00'}</h4> */}
                                    </Grid>
                                </Grid>
                            </>
                        ),
                        content: (
                            <Box p='1em'>
                                  <TabComponent step={structure?.sections[section].steps}/>
                            </Box>
                        )
                    }}
                </Accordion>
            })

        }

        {/* {(

            Object.keys(structure.columns).map(function (value) {
                return <Grid item md={3} spacing={10}>
                    <InputLabel fontSize="14" lineHeight="1.5" bold={true}>{structure.columns[value].label}</InputLabel>
                    <Typography fontSize="14">
                        {(
                            value === 'completePartial' ? row['isPartialDeliveredFl'] ? "PARTIAL" : "COMPLETE"
                                : value === 'podList' || value === 'esignList' ? row[value] ? row[value].length : "Not Available"
                                    : value === 'checkInTime' || value === 'checkOutTime' ? row[value] ? getFormattedDate(row[value]) : "Not Available"
                                        : row[value] ? row[value] : "Not Available"
                        )}</Typography>
                </Grid>
            })
        )} */}

    </Box>


}

export default DLCModalContent