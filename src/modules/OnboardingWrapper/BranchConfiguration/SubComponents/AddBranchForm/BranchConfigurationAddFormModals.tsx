import React from 'react';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import FormField from '../../../../../utils/components/Form/FormField';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { Grid, Modal, ModalHeader, Box, IconButton } from 'ui-library';
import { OperationFieldContainer, OperationStructureContainer, FormActionButton, FormActionButtonWrapper, ShiftTimingNoteWrapper, ModalContentContainer, ModalContainer, OverNightShiftContent } from '../../BranchConfigurationStyledComponents';
import { IShiftTimingStructure } from '../../BranchConfiguration.models';
import { UseFormMethods } from 'react-hook-form';
import moment from 'moment';
import { isOvernightShift } from '../../utils';
export interface IBranchConfigurationModalProps {
    handleRemoveOperationsTimings: Function;
    watchOperationTimings: Function;
    handleAddShiftTimings: Function;
    validateShiftTimings: Function;
    handleSaveOperationTimings: Function;
    handleCancelOperationTimings: Function;
    watchShiftTimings: Function;
    handleRemoveShiftTimings: Function;
    handleAddOperationsTimings: Function;
    handleCancelShiftTimings: Function;
    handleSaveShiftTimings: Function;
    rowKey: string;
    isEditMode: boolean;
    isShiftTimingsVisible: boolean;
    setShiftTimingsVisible: Function;
    isOperationTimingsVisible: boolean;
    setOperationTimingsVisible: Function;
    formInstance: UseFormMethods<Record<string, any>>;
    dispatchClientDetails: Function;
    dispatchShiftTimingsStructure: Function;
    dispatchOperationTimingsStructure: Function;
    setOperationTimingTouched: Function;
    setManagerDetails: Function;
  
}
const BranchConfigurationAddFormModals = (props: IBranchConfigurationModalProps) => {
  const operationTimingsStructureList = useTypedSelector((state) => state.branchConfiguration.form.operationTimingsStructureList);
  const shiftTimingsStructureList = useTypedSelector((state) => state.branchConfiguration.form.shiftTimingsStructureList);
  const branchManagerList = useTypedSelector((state) => state.branchConfiguration.form.branchManagerList);
  const clientBranchDetails = useTypedSelector((state) => state.branchConfiguration.clientBranchDetails);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.branchConfiguration);
  const { handleRemoveOperationsTimings, handleAddShiftTimings, watchShiftTimings, handleAddOperationsTimings, rowKey, isEditMode, isShiftTimingsVisible, setShiftTimingsVisible, setOperationTimingsVisible, isOperationTimingsVisible, formInstance, handleSaveOperationTimings, handleCancelOperationTimings, validateShiftTimings, dispatchClientDetails, dispatchShiftTimingsStructure, handleRemoveShiftTimings, dispatchOperationTimingsStructure, setOperationTimingTouched, handleCancelShiftTimings, handleSaveShiftTimings } = props;
  const {watch} = formInstance; 

  return (
    <>
    {/* OPERATION TIMINGS MODAL */}
      <ModalContainer className="custom-modal-container">    
      <Modal open={isOperationTimingsVisible}  onToggle={() => {}}  width='810px'>
        {{
          header: (
            <ModalHeader headerTitle={dynamicLabels?.operationTimings} imageVariant='icomoon-close' width='810px' handleClose={() => { handleCancelOperationTimings(operationTimingsStructureList); setOperationTimingsVisible(false) }} />
          ),
          content: (
            <ModalContentContainer>
            <OperationStructureContainer>
                {operationTimingsStructureList && operationTimingsStructureList.filter(item =>
                  item[Object.keys(item)[Object.keys(item).length - 2]]?.permission
                ).map((opField: object, index: number) => {
                    return (
                      <>
                        <Grid key={'OperationTime'+index} container spacing='15px' style={{ marginBottom: '15px' }}>
                          {Object.keys(opField).map((fieldName) => {
                            if (fieldName != 'operationsTimingId' && fieldName != 'isSaved') {
                                const meta = opField[fieldName];
                                meta.multipleFiles = false;
                                const { permission } = meta;
                                if (!permission) {
                                  return undefined;
                                }

                              if (fieldName.includes('operationsStartTime') || fieldName.includes('operationsEndTime') || fieldName.includes('shiftEndTime') || fieldName.includes('shiftStartTime')) {
                                if(fieldName.includes('operationsEndTime') || fieldName.includes('shiftEndTime')) {
                                  return (
                                    <>
                                      <Grid item key={fieldName+meta?.id} xs={12} sm={3} md={3} className='grid-item operation-fields'>
                                        <OperationFieldContainer>
                                          <FormField name={fieldName} meta={meta} formInstance={formInstance} timeInterval={15} iconVariant="clock-outlined"/>
                                          <OverNightShiftContent>
                                            {watch(Object.keys(opField)[Object.keys(opField).length - 3]) !== undefined && watch(fieldName) !== undefined &&
                                              isOvernightShift(moment(watch(Object.keys(opField)[Object.keys(opField).length - 3])).format("HH:mm"), moment(watch(fieldName)).format("HH:mm")) &&
                                              dynamicLabels.overnight
                                            }
                                          </OverNightShiftContent>                                          
                                        </OperationFieldContainer>
                                      </Grid>
                                    </>
                                  );
                                } else {
                                return (
                                  <>
                                    <Grid item key={fieldName+meta?.id} xs={12} sm={3} md={3} className='grid-item operation-fields'>
                                      <OperationFieldContainer>
                                        <FormField name={fieldName} meta={meta} formInstance={formInstance} timeInterval={15} iconVariant="clock-outlined"/>
                                      </OperationFieldContainer>
                                    </Grid>
                                  </>
                                );
                              }
                              } else {
                                if(fieldName.includes('operationsEndTime') || fieldName.includes('shiftEndTime')) {
                                  return (
                                    <>
                                      <Grid item key={fieldName+meta?.id} xs={12} sm={3} md={3} className='grid-item operation-fields'>
                                        <OperationFieldContainer>
                                          <FormField name={fieldName} meta={meta} formInstance={formInstance} timeInterval={15} onChange={(e:any) => console.log(e, formInstance)} iconVariant="clock-outlined"/>
                                          <OverNightShiftContent>
                                            {watch(Object.keys(opField)[Object.keys(opField).length - 3]) !== undefined && watch(fieldName) !== undefined &&
                                            isOvernightShift(moment(watch(Object.keys(opField)[Object.keys(opField).length - 3])).format("HH:mm"), moment(watch(fieldName)).format("HH:mm")) &&
                                            dynamicLabels.overnight
                                          }
                                          </OverNightShiftContent>
                                        </OperationFieldContainer>
                                      </Grid>
                                    </>
                                  );
                                } else {
                                return (
                                  <>
                                    <Grid item key={fieldName+meta?.id} xs={12} sm={3} md={3} className='grid-item operation-fields'>
                                      <OperationFieldContainer>
                                        <FormField name={fieldName} timeInterval={15}  meta={meta} formInstance={formInstance}/>
                                      </OperationFieldContainer>
                                    </Grid>
                                  </>
                                );
                              }
                              }
                            } else {
                              return;
                            }
                          })}
                          <Grid item xs={1} sm={1} md={1} lg={1} className='btn-grid'>
                            <FormActionButtonWrapper>
                            {(index > 0 || (index == 0 && operationTimingsStructureList.filter(item =>
                              item[Object.keys(item)[Object.keys(item).length - 2]]?.permission).length > 1)) && (
                                <FormActionButton iconVariant='icomoon-close' iconSize={10} circle className='deletePromotion' onClick={() => handleRemoveOperationsTimings(index, operationTimingsStructureList, isEditMode, dispatchClientDetails, dispatchOperationTimingsStructure, clientBranchDetails, setOperationTimingTouched, opField)} />
                              )}
                              {(index === operationTimingsStructureList.length - 1 || index === operationTimingsStructureList.filter(item =>
                                item[Object.keys(item)[Object.keys(item).length - 2]]?.permission
                              ).length - 1) && (
                                <FormActionButton iconVariant='icomoon-add' iconSize={10} circle primary onClick={() => handleAddOperationsTimings(operationTimingsStructureList)}/>
                              )}
                            </FormActionButtonWrapper>
                          </Grid>
                        </Grid>
                      </>
                    );
                  }
                )}
            </OperationStructureContainer>
            </ModalContentContainer>
          ),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton id='AddBranchForm-Modal-Ok' iconVariant='icomoon-tick-circled' iconSize={11} primary onClick={() => { handleSaveOperationTimings(operationTimingsStructureList); setOperationTimingsVisible(false) }}>
                {dynamicLabels.ok}
              </IconButton>
              <IconButton id='AddBranchForm-Modal-Cancel' iconVariant='icomoon-close' iconSize={11} onClick={() => { handleCancelOperationTimings(operationTimingsStructureList); setOperationTimingsVisible(false) }}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      </Modal>
      </ModalContainer>
      {/* OPERATION TIMINGS MODAL */}
      {/* SHIFT TIMINGS MODAL */}
      <ModalContainer className="custom-modal-container">
      <Modal open={isShiftTimingsVisible} onToggle={() => {}} width='810px'>
        {{
          header: (
            <ModalHeader headerTitle={dynamicLabels?.shiftTimings} imageVariant='icomoon-close' width='810px' handleClose={() => { handleCancelShiftTimings(shiftTimingsStructureList); setShiftTimingsVisible(false) }} />
          ),
          content: (
            <ModalContentContainer>
            <OperationStructureContainer>
            {shiftTimingsStructureList && shiftTimingsStructureList.length > 0 &&
                  shiftTimingsStructureList.filter((shift: IShiftTimingStructure) => shift.branchManagerId === rowKey && shift[Object.keys(shift)[2]].permission).map(
                  (opField: IShiftTimingStructure, index: number) => {
                    return (
                      <>
                        <Grid key={'shiftTiming'+index} container  spacing='15px' style={{ marginBottom: '15px' }}>
                          {Object.keys(opField).map((fieldName) => {
                            if (fieldName !== 'shiftTimingId' && fieldName !== 'branchManagerId' && fieldName !== 'isSaved') {
                            const meta = opField[fieldName];
                            meta.multipleFiles = false;
                            const { permission } = meta;
                            if (!permission) {
                              return undefined;
                            }                  
                            if(fieldName.includes('shiftEndTime')) {     
                            return (
                              <>
                                <Grid item key={fieldName+meta?.id} xs={12} sm={3} md={3} className='grid-item operation-fields'>
                                  <OperationFieldContainer>
                                    <FormField name={fieldName} meta={meta} timeInterval={15}  formInstance={formInstance} iconVariant="clock-outlined"/>
                                  </OperationFieldContainer>
                                  <OverNightShiftContent>
                                  {watch(Object.keys(opField)[Object.keys(opField).length - 4]) !== undefined && watch(fieldName) !== undefined &&
                                    isOvernightShift(moment(watch(Object.keys(opField)[Object.keys(opField).length - 4])).format("HH:mm"), moment(watch(fieldName)).format("HH:mm")) &&
                                    dynamicLabels.overnight
                                  }
                                  </OverNightShiftContent>
                                </Grid>
                              </>
                            );
                          } else {
                            return (
                              <>
                              <Grid item key={fieldName+meta?.id} xs={12} sm={3} md={3} className='grid-item operation-fields'>
                                <OperationFieldContainer>
                                  <FormField name={fieldName} meta={meta} timeInterval={15} formInstance={formInstance} iconVariant="clock-outlined"/>
                                </OperationFieldContainer>
                              </Grid>
                            </>
                            )
                          }
                          } else {
                            return;
                          }
                          })}
                          <Grid item xs={1} sm={1} md={1} lg={1} className='btn-grid'>
                            <FormActionButtonWrapper>
                              {(shiftTimingsStructureList.filter((shift: IShiftTimingStructure) => shift.branchManagerId === rowKey && shift[Object.keys(shift)[2]].permission).length > 1) && (
                                <FormActionButton iconVariant='icomoon-close' iconSize={10} circle className='deletePromotion' onClick={() => handleRemoveShiftTimings(opField, shiftTimingsStructureList, isEditMode, branchManagerList, dispatchShiftTimingsStructure, dispatchClientDetails, watchShiftTimings)} />
                              )}
                              {index === shiftTimingsStructureList.filter((shift: IShiftTimingStructure) => shift.branchManagerId === rowKey && shift[Object.keys(shift)[2]].permission).length - 1 && (
                                <FormActionButton iconVariant='icomoon-add' iconSize={10}  circle  primary  onClick={() => handleAddShiftTimings(shiftTimingsStructureList,rowKey)}/>
                              )}
                            </FormActionButtonWrapper>
                          </Grid>
                        </Grid>
                      </>
                    );
                  }
                )}
            </OperationStructureContainer>
            </ModalContentContainer>
          ),

          footer: (
            <Box
              horizontalSpacing='10px'
              display='flex'
              justifyContent='flex-end'
              p='15px'
            >
              <ShiftTimingNoteWrapper><b>Note: </b>{dynamicLabels.shiftTimingCannotOverlapMsg}</ShiftTimingNoteWrapper>
              <IconButton id='AddBranchForm-ShiftTime-Modal-Ok' iconVariant='icomoon-tick-circled' iconSize={11} primary onClick={() => {
                   if(validateShiftTimings(shiftTimingsStructureList)) {
                        handleSaveShiftTimings(branchManagerList, shiftTimingsStructureList)
                        setShiftTimingsVisible(false);
                    } else {
                        handleSaveShiftTimings(branchManagerList, shiftTimingsStructureList)
                        setShiftTimingsVisible(false)
                  }
                }}
              >
                {dynamicLabels.ok}
              </IconButton>
              <IconButton id='AddBranchForm-ShiftTime-Modal-Cancel' iconVariant='icomoon-close' iconSize={11} onClick={() => { handleCancelShiftTimings(shiftTimingsStructureList); setShiftTimingsVisible(false) }}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      </Modal>
      </ModalContainer>
      {/* SHIFT TIMINGS MODAL */}
    </>
  );
};
export default BranchConfigurationAddFormModals;