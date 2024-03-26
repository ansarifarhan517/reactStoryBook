import React, { useEffect } from "react";
import { BranchManagerStructureContainer, OperationFieldContainer, FormActionButtonWrapper, FormActionButton  } from "../../BranchConfigurationStyledComponents";
import { Grid, Box } from "ui-library";
import { IBranchManagerStructure } from "../../BranchConfiguration.models";
import FormField from '../../../../../utils/components/Form/FormField';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { UseFormMethods, useWatch } from "react-hook-form";
import { deepCopy } from '../../../../../utils/helper';
import useWatchShiftTimings from "../../Hooks/useWatchShiftTimings";

export interface IAddBranchFormManagerDetailsProps {
    formInstance: UseFormMethods<Record<string, any>>;
    handleShiftTimings: Function;
    handleRemoveBranchManager: Function;
    handleAddBranchManager: Function;
    dispatchBranchManagerStructure: Function;
    dispatchShiftTimingsStructure: Function;
    setBranchManagerTouched: Function;
    setManagerDetails: Function;
    handleAddShiftTimings: Function;
}


export const AddBranchFormManagerDetails = (props: IAddBranchFormManagerDetailsProps) => {
    const branchManagerList = useTypedSelector((state) => state.branchConfiguration.form.branchManagerList);
    const shiftTimingsStructureList = useTypedSelector((state) => state.branchConfiguration.form.shiftTimingsStructureList);
  const { formInstance, handleShiftTimings, handleRemoveBranchManager, handleAddBranchManager, dispatchBranchManagerStructure, setBranchManagerTouched, handleAddShiftTimings,dispatchShiftTimingsStructure } = props;
  const { watch, clearErrors,control, setValue } = formInstance;
  const structure = useTypedSelector(state => state.branchConfiguration.form.structure)


  const watcher = useWatch({control});

  useEffect(() => {
    if (structure && Object.keys(structure).length > 0 && structure['branchManagerDetails']?.['managerWhatsappOptin']?.permission) {
      if(watch('managerWhatsappOptin') === undefined){
        setValue('managerWhatsappOptin', 'N');
      }
    }
  }, [structure])


  const handleAddValidation = (fieldName: string) => {
    var index = fieldName.replace( /^\D+/g, '');
    const value = watch(fieldName)
    const branchManagerList1 =deepCopy(branchManagerList)
   
    if(fieldName.includes('managerMobileNumber') || fieldName.includes('managerWhatsappOptin') || fieldName.includes('managerEmailAddress')){
      if(value){
        index && parseInt(index) > 0 ? branchManagerList1[index]['managerContactName-'+index].required = true : branchManagerList1[0]['managerContactName'].required = true;
        dispatchBranchManagerStructure(branchManagerList1)
      }
      else {
          if(!(watch('managerMobileNumber'+ (index ? '-'+index : ''))) && !(watch('managerWhatsappOptin'+ (index ? '-'+index : ''))) && !(watch('managerEmailAddress'+ (index ? '-'+index : ''))) && !(watch('shiftTiming'+ (index ? '-'+index : '')))){
            branchManagerList1[index ? index : 0]['managerContactName'+ (index ? '-'+index : '')].required = false;
            branchManagerList1[index ? index : 0]['shiftTiming'+ (index ? '-'+index : '')].required = false;
            clearErrors(['managerContactName'+ (index ? '-'+index : ''),'shiftTiming'+ (index ? '-'+index : '') ])
            dispatchBranchManagerStructure(branchManagerList1)
          }
      }
      
    }
    if(fieldName.includes('managerContactName')){
      if(value){
        index && parseInt(index) > 0 ? branchManagerList1[index]['shiftTiming-'+index].required = true : branchManagerList1[0]['shiftTiming'].required = true;
        dispatchBranchManagerStructure(branchManagerList1)
      }
      else{
        if(watch('managerMobileNumber'+ (index ? '-'+index : '')) || watch('managerWhatsappOptin'+ (index ? '-'+index : '')) || watch('managerEmailAddress'+ (index ? '-'+index : '')) || watch('shiftTiming'+ (index ? '-'+index : ''))){
          branchManagerList1[index ? index : 0]['managerContactName'+ (index ? '-'+ index : '')].required = true;
          dispatchBranchManagerStructure(branchManagerList1)
        }
        else {
          index && parseInt(index) > 0 ? branchManagerList1[index]['shiftTiming-'+index].required = false : branchManagerList1[0]['shiftTiming'].required = false;
          clearErrors(['shiftTiming'+ (index ? '-'+index : '') ])
          dispatchBranchManagerStructure(branchManagerList1)
        }
      }
    }
  };
  const { managerWhatsappOptin } = branchManagerList.find(manager => manager.hasOwnProperty('managerWhatsappOptin')) || {};

  const handleWhatsappOptin = (_,index: number) => {
      setBranchManagerTouched(true);
      const value = (watch('managerWhatsappOptin'+ (index ? '-'+index : ''))) === 'Y' ? 'N' : 'Y'
      setValue('managerWhatsappOptin'+ (index ? '-'+index : ''), value)
      useWatchShiftTimings(branchManagerList, shiftTimingsStructureList, formInstance, props.setManagerDetails)
  }
  

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>,index: number) => {
    setBranchManagerTouched(true); 
    const { value } = e.target;
    if (value?.length === 0) {
      setValue('managerWhatsappOptin'+ (index ? '-'+index : ''), 'N')
    }
  }


    return(
        <BranchManagerStructureContainer>
        {branchManagerList && branchManagerList.filter(item =>
          item[Object.keys(item)[Object.keys(item).length - 1]]?.permission
        ).map((opField: IBranchManagerStructure, index: number) => {
                      let key = Object.keys(opField)[0];
                      return (
                        <>
                          <Grid
                            container
                            spacing='15px'
                          >
                            {Object.keys(opField).map((fieldName) => {
                              
                              if(fieldName !== 'branchManagerId') {
                              const meta = opField[fieldName];
                              meta.multipleFiles = false;
                              const {
                                permission
                              } = meta;

                              if (fieldName.includes('shiftTiming')) {
                                meta['fieldType'] = 'textWithIcon';
                                meta['iconVariant'] = 'icomoon-add';
                                meta['iconSize'] = 13;
                                meta['readOnly'] = true;
                              }

                              if (!permission || fieldName.startsWith('managerWhatsappOptin')) {
                                return undefined;
                              }

                              const editable = watcher?.["managerMobileNumber" + (index ? '-'+index : '')]?.length > 0;
                              
                              return (
                                <>
                                  <Grid
                                    item
                                    key={fieldName}
                                    xs={12}
                                    sm={2}
                                    md={2}
                                    className='grid-item operation-fields'
                                    >
                                    <OperationFieldContainer>
                                      {fieldName.includes('shiftTiming') ? (
                                        <>
                                          <FormField
                                            name={fieldName}
                                            meta={meta}
                                            key={key}
                                            formInstance={formInstance}
                                            handler={handleShiftTimings}
                                          />
                                        </>
                                      ) : fieldName.startsWith('managerMobileNumber') ? (
                                        <>
                                        <FormField
                                            name={fieldName}
                                            meta={meta}
                                            onChange={(e) => { handlePhoneNumberChange(e,index); handleAddValidation(fieldName) }}
                                            formInstance={formInstance}
                                          />
                                           {'managerWhatsappOptin'+ (index ? '-'+index : '') && managerWhatsappOptin?.permission ?
                                                <Box mt='-5px' mb='8px' className='whatsapp-checkbox-wrapper'>
                                                    <FormField
                                                        name={'managerWhatsappOptin'+ (index ? '-'+index : '')}
                                                        meta={{ ...managerWhatsappOptin, editable }}
                                                        handler = {(e) => { handleWhatsappOptin(e,index)}}
                                                        formInstance={formInstance} 
                                                    />
                                                </Box> : null
                                            }
                                        </>
                                      ) : (
                                        <>
                                          <FormField
                                            name={fieldName}
                                            meta={meta}
                                            onChange={() => { setBranchManagerTouched(true); handleAddValidation(fieldName) }}
                                            formInstance={formInstance}
                                          />
                                        </>
                                      )}
                                    </OperationFieldContainer>

                                  </Grid>
                                </>
                              );
                              } else {
                                return;
                              } 
                            })}
                            <Grid
                              item
                              xs={1}
                              sm={1}
                              md={1}
                              lg={1}
                              className='btn-grid'
                            >
                              <FormActionButtonWrapper>
                                {(index > 0 || (index == 0 && branchManagerList.filter(item =>
                                  item[Object.keys(item)[Object.keys(item).length - 1]]?.permission).length > 1)) && (
                                  <FormActionButton
                                    iconVariant='icomoon-close'
                                    iconSize={10}
                                    circle
                                    className='deletePromotion'
                                    onClick={() =>
                                      handleRemoveBranchManager(
                                        branchManagerList,
                                        dispatchBranchManagerStructure,
                                        setBranchManagerTouched,
                                        opField,
                                        shiftTimingsStructureList,
                                        dispatchShiftTimingsStructure
                                      )
                                    }
                                  />
                                )}
                                {(index === branchManagerList.length - 1 || index === branchManagerList.filter(item =>
                                  item[Object.keys(item)[Object.keys(item).length - 1]]?.permission
                                ).length - 1) && (
                                  <FormActionButton
                                    iconVariant='icomoon-add'
                                    iconSize={10}
                                    circle
                                    primary
                                    onClick={() =>
                                      handleAddBranchManager(
                                        branchManagerList,
                                        dispatchBranchManagerStructure,
                                        setBranchManagerTouched,
                                        shiftTimingsStructureList,
                                        handleAddShiftTimings
                                      )
                                    }
                                  />
                                )}
                              </FormActionButtonWrapper>
                            </Grid>
                          </Grid>
                        </>
                      );
                    })}
                </BranchManagerStructureContainer>
    )
}

export default AddBranchFormManagerDetails;