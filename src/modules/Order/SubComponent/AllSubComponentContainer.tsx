import React from "react";
import AssignDAModal from "./AssignDAModal";
import TripDateChangeModal from "./TripDateChangeModal";
import ReasonModal from "./ReasonModal";
import ConfirmationModal from "./ConfirmationModal";
import BulkUploadModal from "./BulkUploadModal";
import DeliveryProofModal from "./DeliveryProofModal";
import EstimateCostModal from "./EstimateCostModal";
import NotifyCustomerModal from "./NotifyCustomerModal";
import GeocodingMapModal from "./GeocodeMapModal";
import DLCModal from "./DLCModal";
import Notify from "../../DeliveryAssociate/DeliveryAssociateListView/SubComponent/Popups/Notify";
import TripDateChangePopupMarkIntransitModal from "./TripDateChangePopupMarkIntransitModal"
import DownloadInformationModal from "./DownloadInformationModal"
import DeleteConfirmationModal from "../../../utils/components/DeleteConfirmationModal";
import RaiseExceptionModal from './RaiseExceptionModal'
import BulkUpdateFmlmModal from "./BulkUpdateFmlmModal";
import ReactAddressPopup from "../../../../order/partial/order-middle-mile/order-list-middle-mile/ReactAddressPopup";

interface IAllSubComponentContainer {
    showAssignDAModal: any,
    setAssignDAModal: any,
    manualAssign:any,
    manualAssignClick: any,
    showDeletionConfirmation: any,
    setShowDeletionConfirmation: any,
    deleteSelectedRows: any,
    showTripDateChangeModal:any,
    setShowTripDateChangeModal: any,
    tripData: any,
    neverShowTripDateChangePopup:any,
    setNeverShowTripDateChangePopup:any,
    selectedRows: any,
    isShowReasonModal: any,
    fetchOptions: any,
    selectedStatus:any,
    setIsShowReasonModal:any,
    reasonMessage:any,
    setReasonOtherMessage:any,
    reasonOtherMessage:any,
    setShowConfirmationModal:any,
    setReasonSelectedValue:any,
    reasonSelectedValue:any,
    showConfirmationModal:any,
    setIsConfirmed:any,
    showBulkUploadModal:any,
    setShowBulkUploadModal:any,
    showBulkUploadModalFmlm: any,
    setShowBulkUploadModalFmlm: any
    handleFetchData:any,
    successCallBack:any,
    showDeliveryProofModal:any,
    setShowDeliveryProofModal:any,
    deliveryProofStructure: any,
    showEstimateCostModal:any,
    setShowEstimateCostModal:any,
    handleEstimatedCostStructure:any,
    handleEstimatedCostData:any,
    customerNotifyType:any,
    setSelectedRows:any,
    notifyTemplateData:any,
    isGeocodeModal:any,
    setIsGeocodeModal:any,
    showDLCModal:any,
    setShowDLCModal:any,
    showNotifyFleetModal:any,
    setShowNotifyFleetModal:any,
    notifyList:any,
    showTripDateChangePopupMarkIntransitModal:any,
    setShowTripDateChangePopupMarkIntransitModal:any,
    setCustomerNotifyType: any,
    showInformationModal:any,
    setShowInformationModal:any,
    isMarkAsIntransit:any,
    tripDate:any, setTripDate:any,setRescheduledDate:any,
    isAttemtedDate:boolean,
    isShowRaiseExceptionModal: boolean,
    setIsShowRaiseExceptionModal: any,
    selectedOrderStatus: string,
    showAddressUpdateModal: any,
    setShowAddressUpdateModal: any,
    updateAddressStructure : any,
    displayPickup: boolean,
    displayDeliver: boolean,
    updateAddressData: any,
    updateAddressOrderData: any
    updateAddressOrderListStructure: any
    saveUpdatedAddress: any
}
const AllSubComponentContainer =(props:IAllSubComponentContainer)=>{
 const { showAssignDAModal,
    setAssignDAModal,
    manualAssign,
    manualAssignClick,
    showDeletionConfirmation,
    setShowDeletionConfirmation,
    deleteSelectedRows,
    showTripDateChangeModal,
    setShowTripDateChangeModal,
    tripData,
    neverShowTripDateChangePopup,
    setNeverShowTripDateChangePopup,
    selectedRows,
    isShowReasonModal,
    fetchOptions,
    selectedStatus,
    setIsShowReasonModal,
    reasonMessage,
    setReasonOtherMessage,
    reasonOtherMessage,
    setShowConfirmationModal,
    setReasonSelectedValue,
    reasonSelectedValue,
    showConfirmationModal,
    setIsConfirmed,
    showBulkUploadModal,
    setShowBulkUploadModal,
    showBulkUploadModalFmlm,
    setShowBulkUploadModalFmlm,
    handleFetchData,
    successCallBack,
    showDeliveryProofModal,
    setShowDeliveryProofModal,
    deliveryProofStructure,
    showEstimateCostModal,
    setShowEstimateCostModal,
    handleEstimatedCostStructure,
    handleEstimatedCostData,
    customerNotifyType,
    setSelectedRows,
    notifyTemplateData,
    isGeocodeModal,
    setIsGeocodeModal,
    showDLCModal,
    setShowDLCModal,
    showNotifyFleetModal,
    setShowNotifyFleetModal,
    notifyList,
    showTripDateChangePopupMarkIntransitModal,
    setShowTripDateChangePopupMarkIntransitModal,
    setCustomerNotifyType,
    showInformationModal,
    setShowInformationModal,
    isMarkAsIntransit,
    tripDate, setTripDate,setRescheduledDate,
    isAttemtedDate,
    isShowRaiseExceptionModal,
    setIsShowRaiseExceptionModal,
    selectedOrderStatus,
    showAddressUpdateModal,
    setShowAddressUpdateModal,
    updateAddressStructure,
    displayPickup,
    displayDeliver,
    updateAddressData,
    updateAddressOrderData,
    updateAddressOrderListStructure,
    saveUpdatedAddress
 } = props;
return (
    <>
<AssignDAModal
        showAssignDAModal={showAssignDAModal}
        setAssignDAModal={setAssignDAModal}
        manualAssignFunc={manualAssign}
        manualAssignClick={manualAssignClick}
        isMarkAsIntransit={isMarkAsIntransit}
        tripDate={tripDate}
        setTripDate={setTripDate}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
        deleteSelectedRows={deleteSelectedRows}
      />
      <TripDateChangeModal
        showTripDateChangeModal={showTripDateChangeModal}
        setShowTripDateChangeModal={(value: boolean) => setShowTripDateChangeModal(value)}
        tripData={tripData}
        neverShowTripDateChangePopup={neverShowTripDateChangePopup}
        setNeverShowTripDateChangePopup={(value: boolean) => setNeverShowTripDateChangePopup(value)}
      />
      
      <ReasonModal
        selectedRows={selectedRows}
        isShowReasonModal={isShowReasonModal}
        fetchOptions={fetchOptions}
        selectedStatus={selectedStatus}
        setIsShowReasonModal={(value: boolean) => setIsShowReasonModal(value)}
        reasonMessage={reasonMessage}
        setReasonOtherMessage={setReasonOtherMessage}
        reasonOtherMessage={reasonOtherMessage}
        setShowConfirmationModal={(value: boolean) => setShowConfirmationModal(value)}
        setReasonSelectedValue={(value: any) => setReasonSelectedValue(value)}
        reasonSelectedValue={reasonSelectedValue}
        onRescheduleDateChange={(value: Date) => setRescheduledDate(value)}
        isAttemtedDate={isAttemtedDate}
      />
      <ConfirmationModal
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={(value: boolean) => setShowConfirmationModal(value)}
        setIsConfirmed={(value: boolean) => setIsConfirmed(value)}
      />
      <BulkUploadModal
        showBulkUploadModal={showBulkUploadModal}
        setShowBulkUploadModal={(value: boolean) => setShowBulkUploadModal(value)}
        selectedRows={selectedRows}
        handleFetchData={handleFetchData}
        successCallBack={successCallBack}
      />
      <DeliveryProofModal
        showDeliveryProofModal={showDeliveryProofModal}
        setShowDeliveryProofModal={(value: boolean) => setShowDeliveryProofModal(value)}
        deliveryProofStructure={deliveryProofStructure}
        selectedRows={selectedRows}
      />
      <EstimateCostModal
        showEstimateCostModal={showEstimateCostModal}
        setShowEstimateCostModal={(value: boolean) => setShowEstimateCostModal(value)}
        handleEstimatedCostStructure={handleEstimatedCostStructure}
        handleEstimatedCostData={handleEstimatedCostData}
      />
      <NotifyCustomerModal
        selectedRows={selectedRows}
        showNoitfyCustomer={customerNotifyType}
        setSelectedRows={setSelectedRows}
        selectedOption={customerNotifyType}
        notifyTemplateData={notifyTemplateData}
        setCustomerNotifyType={(value: boolean) => setCustomerNotifyType(value)}
        selectedNotificationData={notifyTemplateData}
        fetchOptions={fetchOptions}
        
      />
      <GeocodingMapModal
        isGeocodeModal={isGeocodeModal}
        setIsGeocodeModal={(value: boolean) => setIsGeocodeModal(value)}
        selectedRows={selectedRows}>
      </GeocodingMapModal>
      <div id="printBarcode" style={{ 'display': 'none' }}>
        <svg id="rahul"></svg>
      </div>
      <DLCModal
        showDLCModal={showDLCModal}
        setShowDLCModal={(value: boolean) => setShowDLCModal(value)}
        selectedRows={selectedRows}
      />
      <Notify
        showNotify={showNotifyFleetModal}
        setShowNotify={setShowNotifyFleetModal}
        selectedRows={selectedRows}
        notifyList={notifyList}
        originatedFrom="ORDERLISTVIEW"
      />
      <TripDateChangePopupMarkIntransitModal
        showTripDateChangePopupMarkIntransitModal={showTripDateChangePopupMarkIntransitModal}
        setShowTripDateChangePopupMarkIntransitModal={setShowTripDateChangePopupMarkIntransitModal}
        selectedRows={selectedRows}
        handleFetchData={handleFetchData}
        fetchOptions={fetchOptions}
      />
      <DownloadInformationModal showModal={showInformationModal} setShowModal={(value:boolean)=>setShowInformationModal(value)} />
      <RaiseExceptionModal
        handleFetchData={handleFetchData} 
        fetchOptions={fetchOptions}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        isShowRaiseExceptionModal={isShowRaiseExceptionModal}
        setIsShowRaiseExceptionModal={(value: boolean) => setIsShowRaiseExceptionModal(value)}
        listViewType='Orders'
      />
      <BulkUpdateFmlmModal
        showBulkUploadModalFmlm={showBulkUploadModalFmlm}
        setShowBulkUploadModalFmlm={(value: boolean) => setShowBulkUploadModalFmlm(value)}
        selectedRows={selectedRows}
        handleFetchData={handleFetchData}
        successCallBack={successCallBack}
        selectedOrderStatus={selectedOrderStatus}
      />
      <ReactAddressPopup
        showPopup={showAddressUpdateModal}
        closePopup={() => setShowAddressUpdateModal()}
        modalTitle={'Update Address'}
        addressData={updateAddressData}
        addressCols= {updateAddressStructure}
        displayPickup={displayPickup}
        displayDeliver={displayDeliver}
        orderData={updateAddressOrderData}
        columnData={updateAddressOrderListStructure}
        saveUpdatedAddress={saveUpdatedAddress}
      />
    </>
)

}

export default AllSubComponentContainer