
import React from "react";
import { Box, Accordion, Grid } from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
// import useMetricsConversion from "../../common/ClientProperties/useMetricsConversion";
// import axios from "../../../utils/axios";
// import { getFormattedDate } from '../OrderListOptionData/utils';
// import apiMappings from "../../../utils/apiMapping";

// import moment from 'moment';
// import DAListView from './DAListView';
import useMetricsConversion from '../../../modules/common/ClientProperties/useMetricsConversion';

const EstimateActualCostContent = (props: any) => {
    const { structure, data } = props
    const { convertMetricsForDisplay } = useMetricsConversion()
    
    const dynamicLabel = useTypedSelector(state => state.dynamicLabels);
    const clientProperties = useTypedSelector(state => state.clientProperties);
    const [expanded, setExpanded] = React.useState('1')
    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        setExpanded(isExpanded ? accordianId : '')
    }
    return <Box p='1em' style={{height:"500px",overflow:"auto"}}>
        <Grid container spacing={'1em'}>
            <Grid item xs={9}>
                <h4>Total Estimated Cost</h4>
            </Grid>
            <Grid item xs={3}>
                <h4 style={{ color: '#5698d3', textAlign:"right" }}>{data.shippingCost_total? parseFloat(data.shippingCost_total).toFixed(2): 0.00 } 
                <span> {dynamicLabel[`cur_symbol_${clientProperties?.BASECURRENCY?.propertyValue}`]}</span>
                </h4>
            </Grid>
        </Grid>
        <hr></hr>
        {
            Object.keys(structure).map((section: string) => {
                return section !== "finalCost" ? <Accordion id={section} expanded={expanded === section} onToggle={handleToggle}>
                    {{
                        header: (
                            <>
                                <Grid container>
                                    <Grid item xs={10}>
                                        <h4>{dynamicLabel[section] ? dynamicLabel[section] : section}</h4>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <h4 style={{textAlign:"right"}}>{data[section + "_total"] ? parseFloat(data[section + "_total"]).toFixed(2) : '0.00'} {dynamicLabel[`cur_symbol_${clientProperties?.BASECURRENCY?.propertyValue}`]}</h4>
                                    </Grid>
                                </Grid>
                            </>
                        ),
                        content: (
                            <Box p='1em' style={{padding:"15px 45px 15px 15px"}}>{
                                Object.keys(structure[section]).map((key: string) => {
                                    return section == "handlingFees"?
                                    data[section] && Object.values(data[section]).map((key:any)=>{
                                           return  <Grid container spacing='1em'>
                                                <Grid item xs={6}>
                                                    {key.skillType}
                                                </Grid>
                                                <Grid item xs={3}>

                                                </Grid>
                                                <Grid item xs={3} style={{textAlign:"right"}}>
                                                    { parseFloat(key.skillTypeCost).toFixed(2) || 0.00} {dynamicLabel[`cur_symbol_${clientProperties?.BASECURRENCY?.propertyValue}`]}
                                                </Grid>
                                            </Grid>
                                        })
                                    : section == "insurance"?
                                        
                                            <Grid container spacing='1em'>
                                                <Grid item xs={6}>
                                                    Insurance {data.insurancePercent? `Insurance (${data.insurancePercent}%)`:""}
                                                </Grid>
                                                <Grid item xs={3}>

                                                </Grid>
                                                <Grid item xs={3} style={{textAlign:"right"}}>
                                                    { data.insurance_total?parseFloat(data.insurance_total).toFixed(2) : 0.00} {dynamicLabel[`cur_symbol_${clientProperties?.BASECURRENCY?.propertyValue}`]}
                                                </Grid>
                                            </Grid>
                                        
                                    : <Grid container spacing='1em' >
                                        <Grid item xs={6}>
                                            {structure[section][key].label}
                                        </Grid>
                                        <Grid item xs={3}>
                                            {key == "distance"? convertMetricsForDisplay(0,'distance')+" "+dynamicLabel.distance :key=="weight"? convertMetricsForDisplay(0,'weight')+" "+ dynamicLabel.weight: key=="piece"? 0: "" }
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div style={{textAlign:"right"}}>{data[key]? parseFloat(data[key]).toFixed(2): 0.00} {dynamicLabel[`cur_symbol_${clientProperties?.BASECURRENCY?.propertyValue}`]} </div>
                                        </Grid>
                                    </Grid>

                                })
                            }
                            </Box>
                        )
                    }}
                </Accordion>: <Box style={{padding: "20px 15px",boxShadow: "0px 2px 20px -10px #000",border: "1px solid lightgrey"}}>
                        {Object.keys(structure["finalCost"]).map((key: string) => {
                            return <div>
                                {(key=="shippingCost_total" && <hr></hr>)}
                                <Grid container spacing='1em' style={{fontWeight: key == "totalSum"  || key=="shippingCost_total"? 800:400,fontSize: key == "totalSum"  || key=="shippingCost_total"? "16px":"12px"}}>
                            <Grid item xs={6}>
                                {structure[section][key].label}
                            </Grid>
                            <Grid item xs={3}>

                            </Grid>
                            <Grid item xs={3}>
                                <div style={{textAlign:"right"}}>{data[key]? parseFloat(data[key]).toFixed(2): 0.00} {dynamicLabel[`cur_symbol_${clientProperties?.BASECURRENCY?.propertyValue}`]} </div>
                            </Grid>
                        </Grid>
                        
                        </div>
                        
                })}
                </Box>
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

export default EstimateActualCostContent