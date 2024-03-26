import React, {useEffect, Dispatch, useState} from 'react';
import { useDispatch } from 'react-redux';
import { AdminDashboardActions } from "../../AdminDashboard.actions";
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import { Modal, ModalHeader, ModalFooter, IconButton, DropDown, useToast } from "ui-library";
import { IDropDownOptions } from '../../AdminDashboard.reducer';
import apiMappings from "../../../../utils/apiMapping";
import axios from '../../../../utils/axios';

const OffboardModal = (props : any) => {
    const {rowData, showOffBoardModal, setShowOffboardModal, fetchDataSilenty} = props;
    const dispatch = useDispatch<Dispatch<AdminDashboardActions>>();
    const toast = useToast();
    const offBoardOptions = useTypedSelector(state =>state.adminDashboard.adminDashboard?.clientDetails?.offboardDropdownOptions);
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [value, setValue] = useState<any>("true");
    const optionList =  offBoardOptions ? offBoardOptions.map((o: IDropDownOptions) => ({ label: o.clientRefMasterDesc, value: o.clientRefMasterCd })) : [];
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    useEffect(() => {
        dispatch({type: "@@adminDashboard/CLIENT_DETAILS/OFFBOARD/FETCH_OPTIONS"})
    }, []);
    
    const handleSubmit = async  () => {
        try {
            setIsLoading(true)
            const url = apiMappings.adminDashboard.clientDetails.offboard;
            const response = await axios.post(`${url}?cancelAtEnd=${value}&clientId=${rowData.clientId}`);
            if (response && response.status === 200) {
                toast.add(response.data.message, 'check-round', false);
                setShowOffboardModal(false);
                fetchDataSilenty()
            }
        } catch (error) {
            toast.add(dynamicLabels.somethingWendWrong, "warning", false);
        } finally {
            setIsLoading(false)
        }
    }

    return (<>
            <Modal open = {showOffBoardModal} onToggle={() => {}} width='600px' size='lg'
            children = {{
                header: (<ModalHeader headerTitle={`${dynamicLabels.offboard} Confirmation`} handleClose={() => {setShowOffboardModal(false)}} imageVariant="icomoon-close" headerStyle={{ fontSize: "15px" }} width='100%' />),
                content: (<div onClick={() => setIsMenuOpen(o => !o)} style={{ position: 'relative' }}>
                        <DropDown label="Subscription Cancellation" variant='form-select'
                        optionList={optionList}
                        placeholder={`${dynamicLabels.offboard} Options`}
                        onChange={setValue}
                        value={value}
                        isMenuOpen={isMenuOpen}/>
                    </div>),
                footer: (<ModalFooter>
                        <IconButton id='offboard-Modal-button-Offboard' iconVariant='icomoon-tick-circled' primary
                        disabled={!value || isLoading}
                        onClick={() => {handleSubmit()}}> {dynamicLabels.offboard} </IconButton>
                        <IconButton id='offboard-Modal-button-close' iconVariant='icomoon-close' onClick={() => {setShowOffboardModal(false)}} iconSize={11} disabled={!value || isLoading}> {dynamicLabels.cancel} </IconButton>
                    </ModalFooter>),
                }}
        /></>)
}

export default OffboardModal;