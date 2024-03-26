import React, {useEffect, useState} from 'react';
import { IconButton, Modal, ModalHeader, Box, Grid, useToast } from 'ui-library'
import { useForm } from 'react-hook-form';
import moment from "moment";
import FormField from '../../../../utils/components/Form/FormField';
import { withReactOptimized } from '../../../../utils/components/withReact';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { FormActionButton, FormActionButtonWrapper, OperationFieldContainer, SpanCSS, ServiceTypeRuleTitle, ServiceTypeRuleIndex, ServiceTypeRuleWrapper, ModalContainer } from './ServiceAreaMasterFormStyledComponents';

interface IServiceTypeRules {
    formData: any,
    formStructure: any,
    ruleIndex: number,
}

interface IServiceAreaMasterFormProps {
    isOpen: boolean,
    branchId: number,
    onClose: Function,
    serviceTypeRulesProps: IServiceTypeRules[],
    formStructure: object,
    addRule: Function,
    getServiceTypeData: Function,
}

const ServiceAreaMasterFormModals = ({ isOpen, branchId, onClose, serviceTypeRulesProps, formStructure, addRule, getServiceTypeData }: IServiceAreaMasterFormProps) => {
    const [ serviceTypeRules, setServiceTypeRules ] = useState<IServiceTypeRules[]>(serviceTypeRulesProps);
    const [ pickupEndTimeError, setPickupEndTimeError ] = useState<boolean[]>([false]);
    const [ serviceTypeDuplicateError, setServiceTypeDuplicateError] = useState<boolean[]>([false]);
    const [ pickupUnitError, setPickupUnitError] = useState<boolean[]>([false]);
    const [ deliveryUnitError, setDeliveryUnitError] = useState<boolean[]>([false]);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.serviceTypeRules)
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
    const toast = useToast();

    const {handleSubmit, reset, errors, watch, setValue, clearErrors } = formInstance;    
    const watchAllFields = watch();
    
    useEffect(() => {
      setServiceTypeRules(serviceTypeRulesProps);
    },[serviceTypeRulesProps]);

    useEffect(() => {
      if(isOpen) {
          const _resetData = {}
          serviceTypeRules.forEach((serviceTypeRule, ruleIndex) => {
              serviceTypeRule.formData && Object.entries(serviceTypeRule.formData).forEach(([key, value]) => {
                  if((key === 'pickupLeadTimeFormat' || key === 'deliveryLeadTimeFormat') && value === undefined) {
                    value = 'Mins';
                  }
                  _resetData[`serviceTypeData[${ruleIndex}].${key}`] = value;          
              })
          });
          reset(_resetData)
      } else {
        setServiceTypeRules(serviceTypeRulesProps);
      }
    }, [isOpen])

    const handleAddRule = () => {
      const ruleIndex = addRule();
      const updatedServiceTypeRules = [...serviceTypeRules, { formStructure: formStructure, formData: {}, ruleIndex: ruleIndex }]
      setServiceTypeRules(updatedServiceTypeRules)
      const serviceTypeRule = updatedServiceTypeRules[updatedServiceTypeRules.length-1];
      setValue(`serviceTypeData[${serviceTypeRule.ruleIndex}].pickupLeadTimeFormat`, 'Mins');
      setValue(`serviceTypeData[${serviceTypeRule.ruleIndex}].deliveryLeadTimeFormat`, 'Mins');
    }

    const handleRemoveRule = (index:number) => {
      if(errors.serviceTypeData?.length && errors.serviceTypeData[index]) {
        clearErrors([`serviceTypeData[${index}].serviceTypeDetailsId`, `serviceTypeData[${index}].operationType`])
      }
      const updatedServiceTypeRules = serviceTypeRules.filter(function (rule) { return index !== rule.ruleIndex });
      const updatedPickupEndTimeError = pickupEndTimeError.filter((_, i) => index !== i);
      const updatedServiceTypeDuplicateError = serviceTypeDuplicateError.filter((_, i) => index !== i);
      const updatedPickupUnitError = pickupUnitError.filter((_, i) => index !== i);
      const updatedDeliveryUnitError = deliveryUnitError.filter((_, i) => index !== i);
      setServiceTypeRules(updatedServiceTypeRules);
      setTimeout(() => {
        setPickupEndTimeError(updatedPickupEndTimeError);
        setServiceTypeDuplicateError(updatedServiceTypeDuplicateError);
        setPickupUnitError(updatedPickupUnitError);
        setDeliveryUnitError(updatedDeliveryUnitError);
      },0)
    }

    const onSubmit = (data:any) => {
        let decimalError = false;
        data.serviceTypeData?.forEach((serviceTypeRule:any) => {
          if (serviceTypeRule?.deliveryLeadTime && serviceTypeRule?.deliveryLeadTime % 1 != 0) {
            toast.add((dynamicLabels && dynamicLabels.deliveryTimeError) ? dynamicLabels.deliveryTimeError : 'Delivery Lead Time cannot be decimal.', 'warning', false);
            decimalError = true;
          }
          if (serviceTypeRule?.pickupLeadTime && serviceTypeRule?.pickupLeadTime % 1 != 0) {
            toast.add((dynamicLabels && dynamicLabels.pickupTimeError) ? dynamicLabels.pickupTimeError : 'Pickup Lead Time cannot be decimal.', 'warning', false);
            decimalError = true;
          }
        })
        
        if(pickupEndTimeError.filter(error => error === true).length === 0 && serviceTypeDuplicateError.filter(error => error === true).length === 0 && pickupUnitError.filter(error => error === true).length === 0 && deliveryUnitError.filter(error => error === true).length === 0 && !decimalError) {
            const serviceTypeData = data.serviceTypeData.filter((a:any) => typeof a !== 'undefined')
            getServiceTypeData(serviceTypeData, serviceTypeRules);
            onClose();
        }
    }
    
    const getErrors = (index: number, field: string) => {
      let isError = false;
      if (errors.serviceTypeData?.[index]?.[field]) {
        isError = true
      }
      return isError;
    };
    
    const getUnitError = (index: number, field: string) => {
      const error = {
          customValidationError: false,
          customValidationErrorMessage: ''
      }
      const newErrors = field === 'pickupLeadTimeFormat' ? [...pickupUnitError] : [...deliveryUnitError];
      const copiedErrors = [...newErrors];
      const data = watchAllFields?.serviceTypeData || [];
      if(data.length > 0 && (field === 'pickupLeadTimeFormat' || field === 'deliveryLeadTimeFormat') && index !== undefined) {
        newErrors[index] = false;
        const serviceType = data[index];
        if(serviceType) {
          if(field === 'pickupLeadTimeFormat') {
            if(serviceType?.pickupLeadTime !== '' && serviceType?.pickupLeadTimeFormat === undefined) {
              error.customValidationError = true;
              error.customValidationErrorMessage= dynamicLabels.pickupUnitError;
              newErrors[index] = true;
            } 
          } else {
            if(serviceType?.deliveryLeadTime !== '' && serviceType?.deliveryLeadTimeFormat === undefined) {
              error.customValidationError = true;
              error.customValidationErrorMessage= dynamicLabels.deliveryUnitError;
              newErrors[index] = true;
            } 
          }
        }
      }
      if(copiedErrors[index] !== newErrors[index]) {
        if(field === 'pickupLeadTimeFormat') setPickupUnitError(newErrors);
        else setDeliveryUnitError(newErrors);
      }
      return error;
    };

    const getTimeValidationError = (index: number, field: string) => {
        const newErrors = [...pickupEndTimeError];
        const error = {
            customValidationError: false,
            customValidationErrorMessage: ''
        }
        const data = watchAllFields?.serviceTypeData || [];
        if(data.length > 0 && field === 'pickupEndTime' && index !== undefined) {
            newErrors[index] = false;
            const serviceType = data[index];
            if(serviceType?.pickupStartTime !== undefined && serviceType?.pickupEndTime !== undefined && (moment(serviceType.pickupStartTime).diff(moment(serviceType.pickupEndTime), 'minutes') >= 0)) {
                error.customValidationError = true;
                newErrors[index] = true;
                error.customValidationErrorMessage= dynamicLabels.pickupEndTimeError;
            } else if(serviceType?.cutOffTime !== undefined && serviceType?.pickupEndTime !== undefined && (moment(serviceType.cutOffTime).diff(moment(serviceType.pickupEndTime), 'minutes') > 0)) {
                error.customValidationError = true;
                newErrors[index] = true;
                error.customValidationErrorMessage= dynamicLabels.pickupEndCutOffTimeError;
            }
        }
        if(pickupEndTimeError[index] !== newErrors[index]) {
            setPickupEndTimeError(newErrors);
        }
        return error;
    }

    const getDuplicateServiceTypeError = (index: number, field: string) => {
      const newErrors = [...serviceTypeDuplicateError];
      const error = {
          customValidationError: false,
          customValidationErrorMessage: ''
      }
      const data = watchAllFields?.serviceTypeData || [];
      if(data.length > 0 && field === 'serviceTypeDetailsId' && index !== undefined) {
        newErrors[index] = false;
        const serviceType = data[index]?.serviceTypeDetailsId?.id;
        if(serviceType) {
          data.forEach((d:any, i:number)=> {
            if(d.serviceTypeDetailsId?.id === serviceType && index !== i) {
              error.customValidationError = true;
              newErrors[index] = true;
              error.customValidationErrorMessage= dynamicLabels.serviceTypeDuplicateError;
            }
          })
        }
      }
      if(serviceTypeDuplicateError[index] !== newErrors[index]) {
        setServiceTypeDuplicateError(newErrors);
      }
      return error;
    }

    return (
    <ModalContainer className="custom-modal-container">  
        <Modal
          open={isOpen}
          onToggle={() => {
              onClose();
          }}
          width='1200px'
          children={{
              header: (
                  <ModalHeader
                      headerTitle={dynamicLabels?.addServiceTypeRules}
                      handleClose={() => onClose()}
                      imageVariant="icomoon-close"
                      headerStyle={{ fontSize: "15px" }}
                      width='100%'
                  />
              ),
              content: (
                  <Box>
                      <ServiceTypeRuleWrapper>
                        {serviceTypeRules && serviceTypeRules.map((serviceTypeRule, index) => {
                          return (
                          <React.Fragment key={'serviceTypeRules-'+serviceTypeRule.ruleIndex}>
                          <ServiceTypeRuleTitle>
                          {index===0 && serviceTypeRule.formStructure && Object.keys(serviceTypeRule.formStructure).length && <Grid container>
                              <Grid item xs={12} sm={12} md={12} lg={12} className='main-title'>
                                  {dynamicLabels?.[Object.keys(serviceTypeRule.formStructure)[0]] || Object.keys(serviceTypeRule.formStructure)[0]}
                              </Grid>
                              <Grid item xs={3} sm={3} md={3} lg={3} className='title-main-border'></Grid>
                              <Grid item xs={9} sm={9} md={9} lg={9} className='title-sub-border'></Grid>
                          </Grid>}
                          </ServiceTypeRuleTitle>

                          <Grid container style={{ marginBottom: '15px' }}>
                          {serviceTypeRule.formStructure && Object.values(serviceTypeRule.formStructure).map((opField:any) => {
                          return (
                            <React.Fragment key={'serviceTypeRule-'+serviceTypeRule.ruleIndex}>
                              <Grid item xs={1} sm={1} md={1} lg={1} style={{width: '40px', maxWidth: '40px'}}>
                                  <ServiceTypeRuleIndex>{index+1}</ServiceTypeRuleIndex>
                              </Grid>

                              <Grid container spacing='10px' style={{width: 'calc(100% - 105px)'}}>
                                {Object.keys(opField).map((fieldName) => {
                                  const meta = opField[fieldName];
                                  meta['branchId'] = branchId;
                                  if(fieldName === 'pickupLeadTime' || fieldName === 'deliveryLeadTime'){
                                      return (
                                      <React.Fragment key={fieldName+meta?.id}>
                                      <Grid item xs={2} sm={2} md={2} className='grid-item operation-fields' style={{maxWidth: '150px'}}>
                                        <OperationFieldContainer>
                                          <FormField 
                                              meta={meta} 
                                              formInstance={formInstance}
                                              name={`serviceTypeData[${serviceTypeRule.ruleIndex}].${fieldName}`}/>
                                        </OperationFieldContainer>
                                      </Grid>
                                      <SpanCSS>-</SpanCSS>
                                      </React.Fragment>
                                      )
                                  } else if(fieldName === 'pickupLeadTimeFormat' || fieldName === 'deliveryLeadTimeFormat'){
                                      const {customValidationError, customValidationErrorMessage} = getUnitError(serviceTypeRule.ruleIndex, fieldName);
                                      const customMeta = {...meta, customValidationError, customValidationErrorMessage};
                                      return (
                                      <Grid item key={fieldName+meta?.id} xs={2} sm={2} md={2} className='grid-item operation-fields' style={{maxWidth: '110px'}}>
                                        <OperationFieldContainer>
                                          <FormField 
                                              meta={customMeta} 
                                              formInstance={formInstance}
                                              name={`serviceTypeData[${serviceTypeRule.ruleIndex}].${fieldName}`}/>
                                        </OperationFieldContainer>
                                      </Grid>
                                      )
                                  } else if(fieldName === 'serviceTypeDetailsId' || fieldName === 'operationType') {
                                    const requiredError = getErrors(serviceTypeRule.ruleIndex, fieldName);
                                    const {customValidationError, customValidationErrorMessage} = getDuplicateServiceTypeError(serviceTypeRule.ruleIndex, fieldName);
                                    const customMeta = {...meta, customValidationError, customValidationErrorMessage};
                                    return (
                                    <Grid item key={fieldName+meta?.id} xs={12} sm={3} md={3} className='grid-item operation-fields'>
                                      <OperationFieldContainer>
                                        <FormField 
                                        meta={customMeta} 
                                        formInstance={formInstance} 
                                        requiredError={requiredError}
                                        name={`serviceTypeData[${serviceTypeRule.ruleIndex}].${fieldName}`}/>
                                      </OperationFieldContainer>
                                    </Grid>
                                    )
                                  } else {
                                      const {customValidationError, customValidationErrorMessage} = getTimeValidationError(serviceTypeRule.ruleIndex, fieldName);
                                      const customMeta = {...meta, customValidationError, customValidationErrorMessage};
                                      return (
                                      <Grid item key={fieldName+meta?.id} xs={12} sm={3} md={3} className='grid-item operation-fields'>
                                        <OperationFieldContainer>
                                          <FormField 
                                          meta={customMeta} 
                                          formInstance={formInstance} 
                                          timeInterval={30} 
                                          iconVariant="clock-outlined"
                                          name={`serviceTypeData[${serviceTypeRule.ruleIndex}].${fieldName}`}/>
                                        </OperationFieldContainer>
                                      </Grid>
                                      )
                                  }
                                })
                              }                            
                              </Grid>

                              <Grid item xs={1} sm={1} md={1} lg={1} style={{marginTop: '18px', paddingLeft: '26px', width: '90px', maxWidth: '80px'}}>
                                <FormActionButtonWrapper>
                                  {(serviceTypeRules.length > 1) && (
                                    <FormActionButton iconVariant='icomoon-close' iconSize={10} circle className='deletePromotion' onClick={() => handleRemoveRule(serviceTypeRule.ruleIndex)} />
                                  )}
                                  {(index === serviceTypeRules.length - 1) && (
                                    <FormActionButton iconVariant='icomoon-add' iconSize={10} circle primary onClick={()=>handleAddRule()}/>
                                  )}
                                </FormActionButtonWrapper>
                              </Grid>
                            </React.Fragment>
                          )
                          })}
                          </Grid>
                          </React.Fragment>
                        )
                        })}
                      </ServiceTypeRuleWrapper>
                  </Box>
              ),

              footer: (
                  <Box
                      horizontalSpacing="10px"
                      display="flex"
                      justifyContent="flex-end"
                      p="15px"
                  >
                      <IconButton
                         id='ServiceAreaForm-Modal-button-Ok'
                          iconVariant="icomoon-tick-circled"
                          iconSize={11}
                          onClick={handleSubmit((data)=>onSubmit(data))}
                          primary={true}
                      >
                          {dynamicLabels?.ok}
                      </IconButton>
                      <IconButton 
                      id='ServiceAreaForm-Modal-button-Cancel'
                        iconVariant='icomoon-close'
                        onClick={() => onClose()}
                      >
                          {dynamicLabels?.cancel}
                      </IconButton>
                  </Box>
              ),

          }}
        />
    </ModalContainer>
    )
};

export default withReactOptimized(ServiceAreaMasterFormModals);