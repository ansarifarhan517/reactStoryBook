import React, { useState, useEffect, useCallback } from 'react'
import { Controller } from 'react-hook-form'
import { DropDown } from 'ui-library'
import { ISpecificFormFieldProps } from './interface'
import { fetchDropdownOptions, fetchPostDropdownOptions, prepareDataFromDropdownValue } from './utils'
import { errorTypeMapping } from './FormField'
import { useTypedSelector } from '../../redux/rootReducer'
import store from '../../redux/store'
import { debounce } from '../../commonFunctions/lodashFunctions'


const zeroTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0)

const DropdownFormField = ({
  name,
  meta,
  defaultValue,
  validationRules,
  options,
  formInstance: { control, errors, watch, register },
  onChange,
  isSetSearchValue = false,
  requiredError,
  scrollToRef = false,
  isSortable = true
}: ISpecificFormFieldProps) => {
  
  return (<Controller
    name={name}
    control={control}
    rules={validationRules}
    formInstance
    render={props => {
      const [optionList, setOptionList] = React.useState<{ value: any, label: string, title?: any, description?: any }[]>([])
      const [editModeOptionList, setEditModeOptionList] = React.useState<{ value: any, label: string }[]>([])
      const [isDropdownLoading, setIsDropdownLoading] = useState<boolean>(false)
      const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(undefined)  
      const [optionsMapping, setOptionsMapping] = useState<Record<string, any>>({})
      const [cacheValue, setCacheValue] = useState<string>('')
      const [isManuallyAdded, setIsManuallyAdded] = useState<boolean>(false)
      const country = watch(meta.countryFieldName || '')
      const clientBranch = watch(meta.clientBranchName || '')
      const selectedCustomerId = useTypedSelector(state => state.orderForm.selectedCustomerId)
      const thisDDComponentRef = scrollToRef ? React.useRef<HTMLDivElement>() : null;
      const clientId = useTypedSelector(state=> state.adminDashboard.changeModeltype.clientId)
      const deviationReportDateRange = useTypedSelector(state => state.deviationReports.form.dateRange);
      useEffect(() => {
        if(options && options?.length > 0){
          setOptionList(options)
          const mapping = {}
          options?.forEach((option:any )=> {
            mapping[`${option.id}`] = option
          })
          setOptionsMapping(mapping)
        }
       
      },[options])

      const userGroup = watch('userGroupId' || '')
      const baseCountry = watch('BASECOUNTRY' || '');
      const baseCountry1 = watch('baseCountry' || '');
      const Client = watch('clientId' || '');
      const subClient = watch('distributionCenter' || '')
      const stateWatcher = watch('pickupState')
      const returnStateWatch = watch('returnState')
      const deliverStateWatch = watch('deliverState') 
      const customerIdWatcher = watch('pickupAddressId')
      const returnWatcher = watch('returnAddressId')
      const deliverWatch = watch('deliverAddressId')
      const serviceAreaProfileName = watch('serviceAreaProfileName' || '')
      const fieldArray = ['pickupAddressId', 'returnAddressId', 'getCustomerIds', 'deliverAddressId']
      const deliveryAssociate = watch('selectDm' || '')
      const branch = watch('branch' || '');
      const tripSingle = watch('tripSingle' || '');
      const deviationReportLookups = ['getVehiclesList', 'getDAList', 'getDriversList', 'getBranchVehiclesList', 'getBranchDAList', 'getBranchDriversList'];
      const stateLookup = ['getStates']
      const AddressIdLookup = ['pickupAddressId', 'deliverAddressId', 'returnAddressId']

      useEffect(() => {
        if (meta.lookupType === 'getStates' && meta.countryFieldName) {
          setOptionList([])
        }
      }, [country,isMenuOpen])

      
      useEffect(() => {
        if (meta.lookupType === 'getClient' ) {
          setOptionList([])
          setEditModeOptionList([])
        }
      }, [Client,Client?.id])


      useEffect(() => {
        if (meta.lookupType === 'getDistributionCenter') { 
          setOptionList([])
          setEditModeOptionList([])
        }
      }, [subClient])

      useEffect(() => {
        if(!defaultValue && !props?.value){
          if (stateLookup.includes(meta.lookupType as string)) {
            setOptionList([]);
            setEditModeOptionList([])
          }
        }
      }, [stateWatcher, returnStateWatch, deliverStateWatch])

      useEffect(() => {
        if(!defaultValue && !props?.value){
          if (AddressIdLookup.includes(meta.lookupType as string)) {
            setOptionList([]);
            setEditModeOptionList([])
          }
        }
      }, [customerIdWatcher, returnWatcher, deliverWatch ])

      useEffect(() => {
        if (meta.lookupType === 'getDistributionCenterUserForm') { 
          setOptionList([])
          setEditModeOptionList([])
        }
      }, [subClient])
      
      useEffect(() => {
        if (meta.lookupType === 'getSuperClientParentBranch' && meta.clientBranchName) {
          setOptionList([])
        }
        if (meta.lookupType === 'getSubClientParentBranch' && meta.clientBranchName) {
          setOptionList([])
        }
      }, [clientBranch])


      useEffect(() => {
        if (meta.lookupType === 'getReportingManagerList' && userGroup) {
          setOptionList([])
        }
      }, [userGroup])
      
       useEffect(()=>{
        if (meta.lookupType === 'getRateChartNames') {
          //check length so know if the value is selected from dropdown
          if(serviceAreaProfileName && Object.keys(serviceAreaProfileName).length > 1){
            const setRtChEditble = (Object.keys(serviceAreaProfileName).length === 2 && serviceAreaProfileName.name!=="") || (Object.keys(serviceAreaProfileName).length > 2 && serviceAreaProfileName.serviceAreaProfileName!=="")
            meta.editable = setRtChEditble
            if (Object.keys(serviceAreaProfileName).length === 2 && serviceAreaProfileName.name==="") {
              control.setValue("serviceAreaProfileName",{})
            }
            setOptionList([])
            setEditModeOptionList([])
          } else {
            meta.editable = false
            control.setValue("rateChartName",undefined)
          }
        }
       }, [serviceAreaProfileName, serviceAreaProfileName?.serviceAreaProfileName])
     
       useEffect(()=>{
        if (meta.lookupType === 'getTimeZone') {
          setOptionList([])
        }
       }, [baseCountry, baseCountry?.name, baseCountry1])

       useEffect(() => {
        if (meta.lookupType === 'getOrdersByTrips' && deliveryAssociate) {
          setOptionList([]);
        }
      }, [deliveryAssociate])

      useEffect(() => {
        // Reset dropdowns in deviation reports form for branch selection
        if (deviationReportLookups.includes(meta.lookupType as string)) {
          setOptionList([]);
        }
      },[branch]);

      useEffect(() => {
        if (meta.lookupType === "getAttachedTrackerIds") {
          setOptionList([]);
        }
      }, [tripSingle]);

      useEffect(() => {
        if (meta.lookupType === "getTripsBetweenDates") {
          setOptionList([]);
        }
      }, [deviationReportDateRange]);

      React.useEffect(() => {
        if (props?.value?.id && (props?.value?.name || props?.value?.value)) {
            setEditModeOptionList([{ value: props.value.id, label: props.value.name || props.value.value }])
        } else if  (defaultValue?.id && (defaultValue?.name || defaultValue?.value)) {
          setEditModeOptionList([{ value: defaultValue.id, label: defaultValue.name || defaultValue.value }])
        }
        
        
        if (meta.customField) {
          setOptionList(
            Object.keys(meta.dropdownValues || {})
              .map(key => ({ value: key, label: meta?.dropdownValues?.[key] || key }))
          )
        }
      }, [props.value, meta.dropdownValues, defaultValue])

      const makeProfileTypeOptions = (dropDownData: any) => {
        const mapping = {};
        return {
          options: dropDownData?.map((properties: any) => {
            mapping[`${properties.id}`] = {
              ...properties
            }
            return {
              label: `${properties.name}`,
              value: properties.id,
              title: properties.label,
              description: properties.description || ""
            }
          }) || [],
          mapping
        }
      };


      const handleMenuOpen = async () => {  
        setIsMenuOpen(true)
        if (meta.lookupType === 'pickupAddressId' || meta.lookupType === 'returnAddressId' || meta.lookupType === 'getCustomerIds') {

          setIsDropdownLoading(true)
          const { options, mapping } = prepareDataFromDropdownValue(meta.dropdownOptions)
          setOptionsMapping(mapping)
          setOptionList(options)
          setIsDropdownLoading(false)

        }
        else if (optionList?.length === 0 && !((meta.lookupType === 'getStates' || meta.lookupType === 'getSuperClientParentBranch' || meta.lookupType === 'getReportingManagerList' || meta.lookupType === 'selectTrip' || meta.lookupType === 'getOrdersByTrip') && !(country?.id || clientBranch?.id || userGroup?.id))) {
          setIsDropdownLoading(true)
          let optionParam = undefined
          if (meta.lookupType === 'getSuperClientParentBranch') {
            optionParam = meta.clientBranchName ? clientBranch : undefined
          }
          if (meta.lookupType === 'getSubClientParentBranch') {
            optionParam = meta.clientBranchName ? clientBranch : undefined
          }
          if (meta.lookupType === 'getStates') {
            optionParam = meta.countryFieldName ? country.id : undefined
          }
          if (meta.lookupType === 'getReportingManagerList') {
            optionParam = userGroup ? userGroup.id : undefined
          }
          if (meta.lookupType === 'getRateChartNames') {
            optionParam = control.getValues('serviceAreaProfileName')? control.getValues('serviceAreaProfileName'): undefined
          }
          if (meta.lookupType === 'getTimeZone') {
            optionParam = control.getValues('BASECOUNTRY') ? control.getValues('BASECOUNTRY'): control.getValues('baseCountry') ? control.getValues('baseCountry') : undefined 
          }
          if (meta.lookupType === 'getProfileList') {
            optionParam = 'SHIPPER'
          }

          if (meta.lookupType === 'getDistributionCenter') {
            optionParam = control.getValues('clientId')? control.getValues('clientId'): undefined
          }

          if (meta.lookupType === 'getDistributionCenterUserForm') {
            optionParam = control.getValues('clientId')? control.getValues('clientId'): undefined
          }

          if (meta.lookupType === 'accessProfileIds') {
            optionParam = 'MOBILE_ROLE'
          }
          if (meta.lookupType === 'getServiceTypeDetails') {
            optionParam = meta.branchId ? meta.branchId : undefined
          }
          if(meta.lookupType === 'getOrdersByTrips') {
            optionParam = control.getValues('selectDm') ? control.getValues('selectDm') : undefined
          }
          if(meta.lookupType === 'getModelTypes') {
            optionParam = clientId
          }
          if (meta.lookupType === 'getAttachedTrackerIds') {
            optionParam = { tripId: tripSingle.tripId }
          }
          try {
            let options, mapping;
            if(meta.httpMethod === "POST") {
              const values = await fetchPostDropdownOptions(meta.lookupType || '', meta.lookUpOptionParam, meta.httpPostPayload)
              options = values.options; mapping = values.mapping;
            } else {
              const values = await fetchDropdownOptions(meta.lookupType || '', optionParam)
              options = values.options; mapping = values.mapping;
            }
            if (meta.lookupType === 'getCountries') {
              store.dispatch({
                type: "@@shipperPreferenceForm/SET_COUNTRIES",
                payload: Object.values(mapping)
              })
            } 
            if(meta.lookupType ==='getDateFormats'){
              store.dispatch({
                type: "@@shipperPreferenceForm/SET_DATEFORMAT",
                payload: mapping
              })
            }
            if(meta.lookupType ==='getBaseLanguage'){
              store.dispatch({
                type: "@@shipperPreferenceForm/SET_BASELANGUAGE",
                payload: mapping
              })
            }
            setOptionsMapping(mapping)
            if (meta['orderType'] && meta.lookupType === "paymentMode") { // To filter option list for payment mode depends on selected order type
              let paymentModeOptions;
              if (meta['orderType'] === 'FM') {
                paymentModeOptions = options.filter(option => option.label !== 'COD')
              } else if (meta['orderType'] === 'LM') {
                paymentModeOptions = options.filter(option => option.label !== 'COP')
              } else {
                paymentModeOptions = options
              }
              setOptionList(paymentModeOptions)
            } else {
              if (options?.length > 20) {
                // To improve UX and start displaying 20 records immediately
                setOptionList([...options].splice(0, 20))
                setTimeout(() => {
                  setOptionList(options)
                }, 300)
              } else {
                setOptionList(options)
              }
            }
            setIsDropdownLoading(false)
           } catch (loaderExp) {
              setIsDropdownLoading(false)
           }
        }
      }

      const handleMenuClose = () => {
        setIsMenuOpen(undefined)
        props.onBlur()
        if (cacheValue) {
          setIsManuallyAdded(true)
        } else {
          setIsManuallyAdded(false)
        }
      }

      const handleCrossReset = (inputValue: string) => {
        if (inputValue === null || inputValue === undefined) {
          if (meta.lookupType === "getServiceAreaProfileNames") {
            control.setValue("rateChartName",undefined)
            control.setValue('serviceAreaProfileName',undefined)
          } else if (meta.lookupType === "getRateChartNames") {
            control.setValue("rateChartName",{})
            setOptionList([])
          } else if (meta.lookupType === 'pickupAddressId' || meta.lookupType === 'returnAddressId' || meta.lookupType === 'getCustomerIds' ||
            meta.lookupType === 'getDistributionCenter' || meta.lookupType === 'getDistributionCenterSubBranch' || meta.lookupType === 'getVehiclesList' || 
            meta.lookupType === 'getDAList' || meta.lookupType === 'getDriversList') {
            resetDropDownOptions()
          } else if (meta.lookupType === 'fleetType') {
            if (control?.defaultValuesRef?.current?.moduleKey === "vehicle") {
              control.setValue('capacityInUnits', undefined);
              control.setValue('capacityInWeight', undefined);
              control.setValue('capacityInVolume', undefined);
              control.setValue('minCapacityUtilizationInUnits', undefined);
              control.setValue('minCapacityUtilizationInVolume', undefined);
              control.setValue('minCapacityUtilizationInWeight', undefined);
              control.setValue('vehicleMake', undefined);
              control.setValue('fixedCost', undefined);
              control.setValue('variableCost', undefined);
              control.setValue('transportTimeCost', undefined);
              control.setValue('waitingTimeCost', undefined);
              control.setValue('shiftEndTime', zeroTime);
              control.setValue('shiftStartTime', zeroTime);
              control.setValue('breakDurationInMins', 0);
              control.setValue('breakEndTimeWindow', zeroTime);
              control.setValue('breakStartTimeWindow', zeroTime);
              control.setValue('deliveryType', undefined)
            }
          }
        }
      }

      const handleOnInputChange = (inputValue: string) => {
        if (inputValue && (meta?.shouldRemoveOnBlur && (['pickupAddressId', 'deliverAddressId', 'returnAddressId', 'AddressId'].includes(meta?.id)))){
          setCacheValue(inputValue)
        } else {
          setCacheValue("")
        }
        getDropDownOptions(inputValue)
      }
      const resetDropDownOptions = async () => {
        const checkLookup = meta.lookupType === 'pickupAddressId' || meta.lookupType === 'deliverAddressId' || meta.lookupType === 'returnAddressId'
        setIsDropdownLoading(!checkLookup)
        let options, mapping;
        if (meta.httpMethod === "POST") {
          const values = await fetchPostDropdownOptions(meta.lookupType || '', meta.lookUpOptionParam, meta.httpPostPayload)
          options = values.options; mapping = values.mapping;
        } else {
          const values = await fetchDropdownOptions(meta.lookupType || '', selectedCustomerId)
          options = values.options; mapping = values.mapping;
        }
        setOptionsMapping(mapping)
        setOptionList(options)
        setIsDropdownLoading(false)
      }

      const getDropDownOptions = debounce (async (inputValue: string) => {
        if (meta.lookupType === 'pickupAddressId' || meta.lookupType === 'returnAddressId' || meta.lookupType === 'getCustomerIds'
          || meta.lookupType === 'getBranches' || meta.lookupType === 'getDistributionCenter' || meta.lookupType === 'getDistributionCenterSubBranch'
          || meta.lookupType === 'getVehiclesList' || meta.lookupType === 'getDAList' || meta.lookupType === 'getDriversList' || meta.lookupType === 'getTripsBetweenDates') {
          if (inputValue.length >= 3) {
            setIsDropdownLoading(true)
            let values;
            if(meta.httpMethod === "POST") {
              values = await fetchPostDropdownOptions(meta.lookupType || '', { ...meta.lookUpOptionParam, value: inputValue}, meta.httpPostPayload);
            } else {
              values = await fetchDropdownOptions(meta.lookupType || '', inputValue, selectedCustomerId);
            }
            setOptionsMapping(values.mapping)
            setOptionList(values.options)
            setIsDropdownLoading(false)
          }
        }
      }, 500)
       
      const handleBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        if (isSetSearchValue && cacheValue !== '') {
          setOptionList(o => [...o, { value: cacheValue, label: cacheValue, name: cacheValue, id: cacheValue }])
          props.onChange({ name: cacheValue, id: cacheValue, clientNodeAddressCd: cacheValue })
        }
        setCacheValue('')
        event.stopPropagation()
      }, [cacheValue])

      const scrollToRefFn = (thisDDComponentRef: any) => {
        if (scrollToRef && thisDDComponentRef) {
          {ref: {register({ name: meta.id, focus: ()=>{
            thisDDComponentRef?.current?.scrollIntoView({behavior: "smooth"});  
          }}, validationRules)}}
        } else {
          {}
        }
      }

      return (
        <>
          { scrollToRef && <span ref={thisDDComponentRef} style={{position: 'absolute', top: -100, left: 0}} /> }
          {isSetSearchValue ? (
            <div onBlur={(event) => handleBlur(event)}>
              {/* {console.log(`value-${meta.lookupType}`, meta.customField ? props?.value : props?.value?.id)} */}
              <DropDown
                required={meta.required}
                placeholder={meta.label}
                label={meta.label}
                variant='form-select'
                onChange={(value: string) => {
                  setIsMenuOpen(undefined)
                  if (value) {
                    value && meta?.handleBlurEvent && meta?.handleBlurEvent(optionsMapping[value].name, meta.id)
                    value && props.onChange(meta.customField ? value : optionsMapping[value])
                    value && onChange && onChange(optionsMapping[value])
                  } else {
                    meta?.handleBlurEvent && meta?.handleBlurEvent(undefined , meta.id)
                    props.onChange(undefined)
                    onChange && onChange(optionsMapping[value])
                    handleCrossReset(value)
                  }
                }}
                optionList= {optionList.length === 0 ? editModeOptionList : optionList}
                loading={isDropdownLoading}
                isMenuOpen={isMenuOpen}
                disabled={!meta.editable}
                onMenuOpen={handleMenuOpen}
                onMenuClose={handleMenuClose}
                showDropdownIndicator={fieldArray.indexOf(meta.id) !== -1 ? false : true}
                showNoDataText={fieldArray.indexOf(meta.id) !== -1 ? false : true}
                showCrossIcon={fieldArray.indexOf(meta.id) !== -1 && isManuallyAdded ? false : true}
                showDescription={(meta.lookupType === 'pickupAddressId' || meta.lookupType === 'returnAddressId' || meta.lookupType === 'getCustomerIds') ? true : false}
                value={meta.customField ? props?.value : props?.value?.id}
                error={requiredError || errors[name]}
                errorMessage={requiredError ? `${meta.label} is mandatory` : meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
                onInputChange={handleOnInputChange}
                isSortable={isSortable}
              />
            </div>) : (
            <DropDown
              required={meta.required}
              placeholder={defaultValue?.value ? defaultValue.value : meta.label}
              isSortable={isSortable}
              label={meta.label}
              variant='form-select'
              onChange={(value: string) => {
                setIsMenuOpen(undefined)
                  if (value) {
                    value && meta?.handleBlurEvent && meta?.handleBlurEvent(optionsMapping[value].name, meta.id)
                    value && props.onChange(meta.customField ? value : optionsMapping[value])
                    value && onChange && onChange(optionsMapping[value])
                  } else {
                    meta?.handleBlurEvent && meta?.handleBlurEvent(undefined, meta.id)
                    props.onChange(undefined)
                    onChange && onChange(optionsMapping[value])
                    handleCrossReset(value)
                  }
                }}
                optionList={optionList.length === 0 ? editModeOptionList : optionList}
                loading={isDropdownLoading}
                isMenuOpen={isMenuOpen}
                disabled={!meta.editable}
                onMenuOpen={handleMenuOpen}
                onMenuClose={handleMenuClose}
                {...scrollToRefFn(thisDDComponentRef)}
                showDescription={(meta.lookupType === 'pickupAddressId' || meta.lookupType === 'returnAddressId' || meta.lookupType === 'getCustomerIds') ? true : false}
                value={defaultValue?.value ? defaultValue?.value :meta.customField ? props?.value : props?.value?.id}
                error={requiredError || errors[name] || meta['customValidationError']}
                errorMessage={requiredError ? `${meta.label} is mandatory` : meta['customValidationError'] ? meta['customValidationErrorMessage'] : meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
                defaultValue={defaultValue?.value}
                tooltipMessage={meta.infoFlag && meta['infoTool'] ? meta['infoTool']?.[0]?.message : ''}
                align={meta['align'] || 'center'}
              />
          )}
        </>
      )
    }}
  />)

}

export default DropdownFormField