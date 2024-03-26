import React, { Dispatch, useEffect } from "react";
import TableContainer from "./TableContainer";
import { useDispatch } from 'react-redux';
import { AdminDashboardActions } from './../../AdminDashboard.actions';
import ChartContainer from "./ChartContainer";


const NoUsageWrapper = (props: any) => {
  console.log(props, "Props of noUsage");
  
  const dispatch = useDispatch<Dispatch<AdminDashboardActions>>();
  useEffect(() => {
    dispatch({
      type: "@@adminDashboard/CLIENT_ACTIVITY/FETCH_STRUCTURE",
      payload: { status: "" },
    });


  }, []);

  return (
    <>
      <ChartContainer region={props.region}></ChartContainer>
      <TableContainer impersonateUser={props.impersonateUser}></TableContainer>
    </>
  )
}
export default NoUsageWrapper