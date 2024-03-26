import React, { Dispatch, useEffect } from "react";
import PodContainer from "./PodsContainer";
import TableContainer from "./TableContainer";
import { useDispatch } from 'react-redux';
import { AdminDashboardActions } from './../../AdminDashboard.actions';
const ActiveClientWrapper = ()=>{
    const dispatch = useDispatch<Dispatch<AdminDashboardActions>>();
    useEffect(() => {
        dispatch({
            type: "@@adminDashboard/FETCH_STRUCTURE",
            payload: { status: "" },
        });
    }, []);

    return(
        <>
        <PodContainer></PodContainer>
        <TableContainer></TableContainer>
        </>
    )
}
export default ActiveClientWrapper