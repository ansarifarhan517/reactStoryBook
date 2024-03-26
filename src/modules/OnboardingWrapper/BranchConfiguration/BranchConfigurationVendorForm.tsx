import React, {useEffect, Dispatch} from 'react';
import { useDispatch } from 'react-redux';
import { withReactOptimized } from '../../../utils/components/withReact';
import { BranchConfigurationActions } from './BranchConfiguration.actions';
import BranchConfigurationForm from "./BranchConfigurationForm";
export interface IReactAddressPopupProps {
  closeAddBranchForm: Function;
  vendorData: any;
  }
const BranchConfigurationVendorForm = ({closeAddBranchForm, vendorData}: IReactAddressPopupProps) => {  
  const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();
  useEffect(() => {
    dispatch({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_SHIFT_TIMINGS_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_DELIVERY_TYPE'});
    dispatch({ type: '@@branchConfiguration/FETCH_LOCALE' });
    dispatch({ type: '@@branchConfiguration/FETCH_ZONE_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_ZONE_PROFILE_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_RATE_PROFILE_DROPDOWNS' });
    dispatch({ type: '@@branchConfiguration/FETCH_ZONES_LISTVIEW_STRUCTURE' });

    return ()=> {
      dispatch({ type: '@@branchConfiguration/RESET_ZONE_DETAILS' });
    }
  },[])

  return (
    <>
    <BranchConfigurationForm closeAddBranchForm={closeAddBranchForm} vendorData={vendorData}></BranchConfigurationForm>
    </>
  );
};

export default withReactOptimized(BranchConfigurationVendorForm);
