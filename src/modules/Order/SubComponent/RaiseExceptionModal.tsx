import React, { Dispatch, useState, useEffect } from 'react';
import { Box, IconButton, Modal, ModalHeader, DropDown, useToast, IFetchDataOptions, ISelectedRows } from "ui-library";
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping'
import { StageMessageFieldWrapper } from './StyleSubComponent';
import { IExceptionData } from './SubCompoenent.models';
import { useDispatch } from "react-redux";
import { OrderListViewActions } from "../OrderListView/OrderListView.actions";

interface IRaiseExceptionProps {
    setSelectedRows?: Function
    fetchOptions: IFetchDataOptions
    selectedRows: Array<IExceptionData> | ISelectedRows | []
    isShowRaiseExceptionModal: boolean
    setIsShowRaiseExceptionModal?: Function
    listViewType: string
    onClose?: Function
    handleFetchData?: Function
}
const RaiseExceptionModal = (props: IRaiseExceptionProps) => {
    const { setSelectedRows, fetchOptions, selectedRows, isShowRaiseExceptionModal, setIsShowRaiseExceptionModal, listViewType, onClose } = props
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    const dispatch = useDispatch<Dispatch<OrderListViewActions>>();
    const toast = useToast();
    const exceptionList = useTypedSelector((state) => state.order.listView.exceptionList);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const [selectedException, setSelectedException] = useState<string>('');

    const getOptions = (searchText?: string) => {
        if (exceptionList.length > 0) {
            if (searchText && searchText?.length > 0) {
                return Object.keys(exceptionList).filter(key => {
                    if (exceptionList[key].exceptionCode === searchText || exceptionList[key].exceptionName.includes(searchText)) {
                        return { value: exceptionList[key], label: exceptionList[key].exceptionCode + ": " + exceptionList[key].exceptionName }
                    } else {
                        return {}
                    }
                });
            } else {
                return Object.keys(exceptionList).map(key => {
                    return { value: exceptionList[key], label: exceptionList[key].exceptionCode + ": " + exceptionList[key].exceptionName }
                })
            }
        } else {
            return [];
        }
    }

    const saveApiCall = async () => {
        const ids = listViewType === 'Orders' ? Object.keys(selectedRows) : listViewType === 'Manifest' ? Object.values(selectedRows).map((row) => {
            return row.manifestNo
        }) : selectedRows
        const payload = {}
        payload['moduleIds'] = ids
        payload['moduleName'] = listViewType === 'Manifest' ? 'Manifests' : 'Orders'
        payload['exceptionCode'] = selectedException['exceptionCode']
        setIsBtnDisable(true)
        try {
            const { data: { status, message } } = await axios.post(apiMappings.exceptionHandling.listview.raisedExceptions.saveRaiseException, payload)
            if (status === 200) {
                toast.add(message, 'check-round', false)
                if (listViewType === 'MiddlemileOrders') {
                    onClose && onClose(true)
                    setSelectedException('');
                } else {
                    setIsShowRaiseExceptionModal && setIsShowRaiseExceptionModal(false)
                    fetchOptions.apis?.resetSelection();
                    fetchOptions.apis?.setSelection({});
                    setSelectedRows && setSelectedRows({});
                    props.handleFetchData &&  props.handleFetchData(fetchOptions) 
                    setIsBtnDisable(false)
                    setSelectedException('');
                }
                return
            }
            throw message

        }
        catch (error) {
            setIsBtnDisable(false)
            listViewType === 'MiddlemileOrders' ? onClose && onClose() : setIsShowRaiseExceptionModal && setIsShowRaiseExceptionModal(false)
            setSelectedException('');
            return toast.add(typeof error === 'string' ? error : error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)

        }
    }
    const closeExceptionModal = () => {
        listViewType === 'MiddlemileOrders' ? onClose && onClose() : setIsShowRaiseExceptionModal && setIsShowRaiseExceptionModal(false)
        setSelectedException('')
    }
    useEffect(() => {
        if (isShowRaiseExceptionModal) {
            dispatch({ type: "@@orderListView/FETCH_EXCEPTION_DATA", listViewType });
        }
    }, [isShowRaiseExceptionModal])

    return <><Modal
        open={isShowRaiseExceptionModal}
        onToggle={() => {
        }}
        size='md'
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels.raiseException}
                    handleClose={() => closeExceptionModal()}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px", justifyContent: 'left' }}
                    width='100%'
                />
            ),
            content: (
                <>
                    <Box horizontalSpacing='30px' display='flex' >
                        <DropDown style={{ width: '45%' }}
                            optionList={getOptions()}
                            label={dynamicLabels.enterNameCode}
                            onChange={(e: string) => {
                                setSelectedException(e);
                                setIsBtnDisable(false);
                            }}
                            onInputChange={(e: string) => getOptions(e)}
                            placeholder={dynamicLabels.enterNameCode}
                            value={selectedException}
                        />
                    </Box>
                    {(selectedException?.['exceptionStage']) && (
                        <div style={{ display: 'flex' }}>
                            <StageMessageFieldWrapper>
                                <p style={{ marginBottom: '10px' }}><strong>{dynamicLabels.exceptionStageLabel || 'Stage'}</strong></p>
                                <span>
                                    <span>
                                        {selectedException?.['exceptionStage']?.join(', ')}
                                    </span>
                                </span>
                            </StageMessageFieldWrapper>
                        </div>
                    )}
                    {(selectedException?.['exceptionMessage']) && (
                        <div style={{ display: 'flex' }}>
                            <StageMessageFieldWrapper>
                                <p style={{ marginBottom: '10px' }}><strong>{dynamicLabels.exceptionMessageLabel || 'Message'}</strong></p>
                                <span>
                                    <span>
                                        {selectedException?.['exceptionMessage']}
                                    </span>
                                </span>
                            </StageMessageFieldWrapper>
                        </div>
                    )}
                </>
            ),
            footer: (<>
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    style={{ paddingRight: '15px', paddingBottom: '15px' }}
                    justifyContent="flex-end"
                >
                    <IconButton
                        id='RaiseException-OrderModal-button-Save'
                        iconVariant="icomoon-save"
                        disabled={(!selectedException) || isBtnDisable}
                        iconSize={11}
                        primary
                        onClick={() => (saveApiCall())}
                    >
                        {dynamicLabels.save || "Save"}
                    </IconButton>
                    <IconButton
                        id='RaiseException-OrderModal-button-Close'
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => closeExceptionModal()}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            </>
            )
        }}

    />
    </>
}

export default RaiseExceptionModal;