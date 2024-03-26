import React, { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { BranchConfigurationActions } from '../../BranchConfiguration.actions';
import { transformMongoListViewToColumns } from '../../../../../utils/mongo/ListView';
import { handleLoadMultiplierSearch, handleOperationTimingSearch } from '../../../../../utils/helper';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { ListView, IListViewColumn, Box, Modal, ModalHeader, IconButton, Accordion, AccordionHeaderTitle, AccordionContent} from 'ui-library';
import { AccordianWrapper, SetWrapperForContent,RemoveScroll, ManagerDetailsValue,ManagerDetailsValueEmpty, ManagerDetailsContainer, ManagerDetailsLabel } from '../../BranchConfigurationStyledComponents';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import { IMongoField } from '../../../../../utils/mongo/interfaces';
import axios from '../../../../../utils/axios';
import apiMappings from '../../../../../utils/apiMapping';
import { stringToTime } from '../../utils';
export interface IBranchConfigurationListViewModalsProps {
    isOpertaionTimingModalVisible: boolean;
    setOperationTimingModalVisible: Function;
    isManagerListModalVisible: boolean;
    setManagerListModalVisible: Function;
    isLoadMultiplierModalVisible: boolean;
    setLoadMultiplierModalVisible: Function;
    expanded: string;
    setExpanded: Function;
    selectedBranch: number;
    handleToggle: (accordianId: string, isExpanded?: boolean | undefined) => void;
}

export interface ILoadMultiplier {
  [key:string]: IMongoField
}

const BranchConfigurationListViewModals = (props: IBranchConfigurationListViewModalsProps) => {
  const {isOpertaionTimingModalVisible, setOperationTimingModalVisible, isManagerListModalVisible, setManagerListModalVisible, expanded, selectedBranch, handleToggle, isLoadMultiplierModalVisible, setLoadMultiplierModalVisible } = props;
  const [operationTimingsColumns, setOperationTimingsColumns] = useState<IListViewColumn[]>([]);
  const [branchManagersColumns, setBranchManagersColumns] = useState<IListViewColumn[]>([]);
  const [loadMultiplierColumns, setLoadMultiplierColumns] = useState<IListViewColumn[]>([]);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.branchConfiguration);
  const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();

  const operationTimingsColumnSelector = useTypedSelector((state) => state.branchConfiguration.operationTimingsStructure?.columns);
  const operationTimingsRowSelector = useTypedSelector((state) => state.branchConfiguration.operationTimings);
  const branchManagerColumnSelector = useTypedSelector((state) => state.branchConfiguration.branchManagerStructure?.columns);
  const branchManagerRowSelector = useTypedSelector((state) => state.branchConfiguration.branchManagers);
  const branchManagerList = [...branchManagerRowSelector];
  const operationListLoading = useTypedSelector((state) => state.branchConfiguration.listview.operationTimings);
  const branchManagerListLoading = useTypedSelector((state) => state.branchConfiguration.listview.branchManagers);
  const branchTimezone = useTypedSelector((state) => state.branchConfiguration.branchTimezone);
  const loadMultiplierData = useTypedSelector((state) => state.branchConfiguration.loadMultiplierData);
  const loadMultiplierColumnsSelector = useTypedSelector((state) => state.branchConfiguration.loadMultiplierStructure?.columns);

  const handleOperationListFetchData = React.useCallback(
    ({ filterOptions }) => {
      if (!Object.keys(filterOptions).length) {
        dispatch({ type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LIST', payload: selectedBranch });
      } else {
        const result = handleOperationTimingSearch(filterOptions);
        dispatch({ type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LIST_SUCCESS', payload: result });
      }
    },
    [selectedBranch]
  );

  useEffect(() => {
    const mongoStructure = operationTimingsColumnSelector;
    if (mongoStructure && Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'branchConfiguration', {});
      setOperationTimingsColumns(newColumns);
    }
  }, [operationTimingsColumnSelector]);



  useEffect(() => {
    const mongoStructure = branchManagerColumnSelector;
    if (mongoStructure && Object.keys(mongoStructure).length && branchTimezone) {
      const newColumns = transformMongoListViewToColumns(mongoStructure,'branchConfiguration', {});
      setBranchManagersColumns(newColumns);
    }
  }, [branchManagerColumnSelector, branchTimezone]);

  
  useEffect(() => {
    
    const mongoStructure = loadMultiplierColumnsSelector;
    if (mongoStructure && Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure,'branchConfiguration', {});
      setLoadMultiplierColumns(newColumns);
    }

  },[loadMultiplierColumnsSelector])

  const loadMultiplierConvertedData = loadMultiplierData?.map((obj:any) => {
    let startTime = stringToTime(obj?.startTime)
    let stTime = `${startTime.getHours() < 10 ? '0'+startTime.getHours() : startTime.getHours()}:${startTime.getMinutes() < 10 ? '0'+startTime.getMinutes() : startTime.getMinutes()}`
    let endTime = stringToTime(obj?.endTime)
    let etTime = `${endTime.getHours() < 10 ? '0'+endTime.getHours() : endTime.getHours()}:${endTime.getMinutes() < 10 ? '0'+endTime.getMinutes() : endTime.getMinutes()}`
    return {
      ...obj,
      startTime:stTime,
      endTime: etTime
    }
  })

  
  const handleLoadMultiplierFetch = React.useCallback(
    async ({ filterOptions }) =>  {
      if (!Object.keys(filterOptions).length) {
        try {
          const data = await axios.get(
            apiMappings.branchConfiguration.listView.getLoadMultipliers+`?clientBranchId=${selectedBranch}`);
  
          if (data.status === 200) {
            dispatch({ type: '@@branchConfiguration/GET_LOADMULTIPLIER_DATA', payload: data?.data});
            return;
          }
        } catch (errorMessage) {
          const message = errorMessage?.response?.data?.message;
          console.log(message)
        }
        
      } else {
        const result = handleLoadMultiplierSearch(filterOptions)
        dispatch({ type: '@@branchConfiguration/GET_LOADMULTIPLIER_DATA', payload: result});
      }

    },[selectedBranch]
  );

 
  
  return (
    <>
      {/* OPERATION TIMINGS MODAL */}
      <Modal open={isOpertaionTimingModalVisible} onToggle={() => setOperationTimingModalVisible(false)} width='810px'>
        {{
          header: (
            <ModalHeader headerTitle={dynamicLabels?.operationTimings} imageVariant='icomoon-close' width='810px' handleClose={() => setOperationTimingModalVisible(false)}/>
          ),
          content:
            operationTimingsColumns.length > 0 ? (
              <ListView
                rowIdentifier='operationsTimingId'
                hasRowSelectionWithEdit={false}
                columns={operationTimingsColumns}
                data={operationTimingsRowSelector}
                totalRows={operationTimingsRowSelector?.length}
                onFetchData={handleOperationListFetchData}
                loading={operationListLoading}
                isColumnLoading={operationListLoading}
                hideColumnSettings={true}
                hidePaginationBar={true}
                hideRefresh={true}
                hideToolbar={true}
                hasSelectAllRows={false}
                style={{ height: '45vh', width: '100%' }}
              />
            ) : null,
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px' >
              <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => setOperationTimingModalVisible(false)}>{dynamicLabels.cancel}</IconButton>
            </Box>
          ),
        }}
      </Modal>
      {/* OPERATION TIMINGS MODAL */}

      {/* BRANCH MANGER LIST MODAL */}
      <Modal open={isManagerListModalVisible} onToggle={() => setManagerListModalVisible(false)} width='810px'>
        {{
          header: (
            <ModalHeader headerTitle={dynamicLabels?.branchManagers} imageVariant='icomoon-close' width='810px' handleClose={() => setManagerListModalVisible(false)}/>
          ),
          content: (
            <SetWrapperForContent id="etWrapperForContent">
            <Box style={{ height: "300px"}}>
                {branchManagerList.map(
                    (branchManager: any, index: number) => {
                      return (                        
                      <AccordianWrapper>
                        <Accordion key={index} id={String(index + 1)} expanded={expanded === String(index + 1)}  onToggle={handleToggle}>
                          {{
                            header: (
                                <AccordionHeaderTitle>
                                  {branchManager.managerContactName}
                                </AccordionHeaderTitle>                                
                            ),
                            content: (
                              <AccordionContent>
                                <Box display="flex">
                                  <ManagerDetailsContainer>
                                    <ManagerDetailsLabel>{dynamicLabels.managerName}</ManagerDetailsLabel>
                                    <ManagerDetailsValue>{branchManager.managerContactName}</ManagerDetailsValue>
                                  </ManagerDetailsContainer>
                                  <ManagerDetailsContainer>
                                    <ManagerDetailsLabel>{dynamicLabels.driverPhoneNumber}</ManagerDetailsLabel>
                                    <ManagerDetailsValue>{branchManager.mobileNumber}</ManagerDetailsValue>
                                  </ManagerDetailsContainer>
                                  <ManagerDetailsContainer>
                                  <ManagerDetailsLabel>{dynamicLabels.emailId}</ManagerDetailsLabel>
                                    {branchManager.emailAddress? 
                                    <ManagerDetailsValue>{branchManager.emailAddress}</ManagerDetailsValue>:
                                    <ManagerDetailsValueEmpty>{branchManager.emailAddress}</ManagerDetailsValueEmpty>}
                                  </ManagerDetailsContainer>
                                </Box>
                                {branchManagersColumns.length > 0 && (
                                  <RemoveScroll>
                                  <ListView
                                    id={branchManager.branchManagerId}
                                    rowIdentifier='shiftTimingId'
                                    hasRowSelectionWithEdit={false}
                                    columns={branchManagersColumns}
                                    data={branchManager.shifts}
                                    totalRows={branchManager.shifts?.length}
                                    loading={branchManagerListLoading}
                                    isColumnLoading={branchManagerListLoading}
                                    hidePaginationBar={true}
                                    hideRefresh={true}
                                    hideToolbar={true}
                                    hasSelectAllRows={false}
                                    style={{ height: '25vh', width: '100%' }}
                                  />
                                  </RemoveScroll>
                                )}
                              </AccordionContent>
                            ),
                          }}
                        </Accordion>
                        </AccordianWrapper>
                      );
                    }
              )}
            </Box>
            </SetWrapperForContent>
          ),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => setManagerListModalVisible(false)}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      </Modal>
      {/* BRANCH MANGER LIST MODAL */}


      
      {/* LOAD MULITIPLIER  LIST MODAL */}
      <Modal open={isLoadMultiplierModalVisible} onToggle={() => setLoadMultiplierModalVisible(false)} width='810px'>
        {{
          header: (
            <ModalHeader headerTitle={dynamicLabels?.loadMultiplier || 'Load Multipliers'} imageVariant='icomoon-close' width='810px' handleClose={() => setLoadMultiplierModalVisible(false)}/>
          ),
          content:
          loadMultiplierColumns.length > 0 ? (
              <ListView
                rowIdentifier='loadMultiplierId'
                hasRowSelectionWithEdit={false}
                columns={loadMultiplierColumns}
                data={loadMultiplierConvertedData}
                totalRows={loadMultiplierData?.length}
                onFetchData={handleLoadMultiplierFetch}
                loading={!loadMultiplierData}
                isColumnLoading={!loadMultiplierColumnsSelector}
                hideColumnSettings={true}
                hidePaginationBar={true}
                hideRefresh={true}
                hideToolbar={true}
                hasSelectAllRows={false}
                style={{ height: '45vh', width: '100%' }}
              />
            ) : null
            ,
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px' >
              <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => setLoadMultiplierModalVisible(false)}>{dynamicLabels.cancel}</IconButton>
            </Box>
          ),
        }}
      </Modal>
      {/* LOAD MULITIPLIER  LIST MODAL */}

    </>
  );
};

export default BranchConfigurationListViewModals;