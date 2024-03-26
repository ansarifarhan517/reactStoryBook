import React from "react";
import {
    Box,
    IconButton,
    ISelectedRows,
    useToast,
    Tooltip,
    InlinePopup
} from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import DownloadOrder from "../SubComponent/DownloadOrder"
import moment from "moment";
import { useState } from "react";
import AdvancedFilterComponent from "../../common/AdvancedFilterComponent";

interface IOrderListViewIconBar {
    selectedRows: ISelectedRows,
    fetchOptions: any,
    selectedStatus: string,
    showInformationModal: any,
    setShowInformationModal: any,
    handleFetchFilters: (callBackAdvanceFilter: boolean) => void
    handleRemoveFilter: (showToast: boolean) => void,
    handleFetchData:(fetchOptions : any) => void,
    AdvanceFilterData : any
}

const pageName="orders"
const OrderListViewIconBar = (props: IOrderListViewIconBar) => {
    const { selectedRows, fetchOptions, selectedStatus, setShowInformationModal , handleFetchData , handleFetchFilters, handleRemoveFilter  , AdvanceFilterData} = props;
    const startDate = useTypedSelector(state => state.order.listView.dateRange.startDate);
    const endDate = useTypedSelector(state => state.order.listView.dateRange.endDate);
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    const columnsSelector = useTypedSelector((state) => state.order.listView.structure.columns);
    const toast = useToast();
    const [isShowDowloadModal, setIsShowDowloadModal] = useState<boolean>(false);
 

    const handleDownloadReport = () => {
        if (moment(endDate).diff(moment(startDate), 'days') > 30) {
            setIsShowDowloadModal(false);
            toast.add(dynamicLabels.dateRange31DayValidationMsg, 'warning', false);
        } else {
            setIsShowDowloadModal(true);
        }
    };

    return (
        <>
            {
                columnsSelector &&
                <Box display="flex" horizontalSpacing="5px" style={{ marginTop: "2px" }}>
                    <span >
                        <InlinePopup id='link-popup' title="Download Report" isOpen={isShowDowloadModal} width={600} height={300}
                            style={{ margin: '5px 0px' }}
                            content={
                                <DownloadOrder
                                    setShowInformationModal={setShowInformationModal}
                                    selectedRows={selectedRows}
                                    isShowDowloadModal={isShowDowloadModal}
                                    fetchOptions={fetchOptions}
                                    selectedStatus={selectedStatus}
                                    startDate={startDate}
                                    endDate={endDate}
                                    setIsShowDowloadModal={(value: boolean) => setIsShowDowloadModal(value)}
                                />
                            }
                            className=''
                        >
                            <Tooltip message={dynamicLabels?.downloadAllOrdersReport} hover>
                                <IconButton
                                    iconVariant="icomoon-download"
                                    iconSize={16}
                                    onlyIcon
                                    style={{ color: "inherit" }}
                                    onClick={handleDownloadReport}
                                    id='download'
                                />
                            </Tooltip>
                        </InlinePopup>
                    </span>
                    <AdvancedFilterComponent
                              pageName={pageName}
                              handleFetchFilters={handleFetchFilters}
                              handleRemoveFilter={handleRemoveFilter}
                              handleFetchData={handleFetchData}
                              data={AdvanceFilterData}
                              needsFetchDataCall={false}
                              />
                </Box>
            }
        </>

    )
}

export default OrderListViewIconBar;