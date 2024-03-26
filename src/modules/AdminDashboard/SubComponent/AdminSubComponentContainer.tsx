import React from 'react';
import OffboardModal from "./OffboardModal/OffboardModal";
import SendActivationLink from "./SendActivationLink/SendActivationLink";
import UatFormModal from "./UatFormModal/UatFormModal";


// interface IAdminDashboardSubComponentContainer {
//     isUpdate: boolean,
//     rowData: any,
//     showAddUatAcccountPop: boolean,
//     setShowAddUatAccountPopup: Function,
//     setEditUatAccount: Function,
//     showOffBoardModal: boolean, 
//     setShowOffboardModal: Function
//     reloadListView: boolean, 
//     setReloadListView: Function
//     sendActivationLink: boolean
//     setSendActivationLink: Function
// }

const AdminSubComponentContainer = (props : any) => {
    const {isUpdate, rowData, showAddUatAcccountPop, setShowAddUatAccountPopup, showOffBoardModal, setShowOffboardModal, sendActivationLink, setSendActivationLink, fetchDataSilenty } = props;

    return (
        <>
        {showAddUatAcccountPop && <UatFormModal
          isUpdate={isUpdate}
          rowData={rowData}
          showAddUatAcccountPop={showAddUatAcccountPop}
          setShowAddUatAccountPopup = {(value: boolean) => setShowAddUatAccountPopup(value)}
          fetchDataSilenty  = {() => fetchDataSilenty()}/>}

        {showOffBoardModal && <OffboardModal
            rowData = {rowData}
            showOffBoardModal = {showOffBoardModal}
            setShowOffboardModal = {(value: boolean) => setShowOffboardModal(value)}
            fetchDataSilenty  = {() => fetchDataSilenty()}/>}

        {sendActivationLink && <SendActivationLink
            rowData = {rowData}
            sendActivationLink = {sendActivationLink}
            setSendActivationLink = {(value: boolean) => setSendActivationLink(value)}
            fetchDataSilenty  = {() => fetchDataSilenty()}
            />}
        </>
        

    )

}

export default AdminSubComponentContainer;