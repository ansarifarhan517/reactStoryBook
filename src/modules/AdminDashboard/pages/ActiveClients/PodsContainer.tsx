import React, { Dispatch, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Grid, PieChartList } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { AdminDashboardActions } from "../../AdminDashboard.actions";
const podColors = ["#82b8e5", "#f0ad48", "#f05548", "#006279", "#9b4848", "#82b8e5", "#f0ad48", "#f05548", "#006279", "#9b4848"];


const PodContainer = () => {
    const dispatch = useDispatch<Dispatch<AdminDashboardActions>>();
    const dynamicLabels = useTypedSelector(state=>state.dynamicLabels);
    useEffect(() => {
        dispatch({
            type: "@@adminDashboard/CLIENT_DETAILS/FETCH_POD_DATA"
        });
    }, []);


    const podData = useTypedSelector(state => state.adminDashboard.adminDashboard?.clientDetails?.podData);

    const newPodData = React.useMemo(() => {
        if (!podData) {
            return;
        }
        return Object.keys(podData).map((value: any) => {
            let payloadData: Array<any> = []
            let keysArray = Object.keys(podData[value].data);
            for(let i = 0; i< keysArray.length; i++){
                let data = {
                    name: dynamicLabels[podData[value].data[keysArray[i]].labelKey] || keysArray[i],
                    value: podData[value].data[keysArray[i]].count || 0,
                    color: podColors[i],
                    active: true,
                    clientIds: podData[value].data[keysArray[i]].clientIds

                }
                payloadData.push(data)
                
            }
            let finalData: any = {
                        title: dynamicLabels[value],
                        total: podData[value].count,
                        //subTitle: 'No. of Delieveries',
                        //subTotal: 1200,
                        selected: false,
                        payload: payloadData
    
                    }
                    return finalData;
           
        })

    }, [podData]) 
    const onPieClick = (value:any) =>{
        dispatch({
            type: "@@adminDashboard/CLIENT_DETAILS/SET_CLIENT_IDS",
            payload: value.clientIds
        });
        let div = document.getElementById('primary_hook_cm');
        if(div){
            div.scrollTop = document?.getElementById('clientDetailsTable')?.offsetTop || 812
        }
    }
    return (<>  
        <Box display="flex" justifyContent="center" style={{ width: "100%" }} m="2em">

            <Grid container style={{ width: "100%" }} spacing="1em" >
                {newPodData?.map((value:any) => {
                    return (
                        <>
                            <Grid spacing="1em" item lg={4}>
                                <div style={{ width: "calc(100vw - 15px)", margin: "-15px" }}>
                                    <PieChartList
                                        height={160}
                                        
                                        isClickable={false}
                                        orderDetails={[value]}
                                        onClick={()=>{alert("CLICKED")}}
                                        onPieClick={onPieClick}
                                        onLegendClick={()=>{alert("LEGEND-CLICK")}}
                                        
                                    />
                                </div>



                            </Grid>
                        </>
                    )
                })}
               
            </Grid>
        </Box>
    </>)
}

export default PodContainer