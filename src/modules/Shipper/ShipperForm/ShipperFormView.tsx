import React, { useEffect, Dispatch, useState  } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Box, Grid, SectionHeader, IconButton, Checkbox, useToast } from 'ui-library'
import { deepCopy } from "../../../utils/helper";
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { hybridRouteTo, routeContains, getQueryParams } from '../../../utils/hybridRouting'
import { useDispatch } from 'react-redux'
import { IShipperFormActions, IShipperData, ILocalStorageEntries } from './ShipperForm.model'
import { IShipperCommonFormActions } from '../ShipperCommon/ShipperCommon.model'
import FormField from '../../../utils/components/Form/FormField'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { generateShipperFormData, generateCustomFieldsFormData, navigationConfirmationPopup } from './ShipperForm.utils'
import { SectionHeaderContainer } from '../../../utils/components/Form/Form.styles'
import { ILogiAPIResponse } from '../../../utils/api.interfaces'
import { tGlobalToastActions } from '../../common/GlobalToasts/globalToast.reducer'
import { useCustomFieldsForm } from '../../../utils/components/Form/useCustomFieldsForm'
import FormLoader from '../../../utils/components/FormLoader'
import withReact from '../../../utils/components/withReact'
import { getBaseCurrency } from '../../../utils/core'
import { getGoogleAPIKey } from '../../../utils/components/Map/MapHelper';
import { tSearchFieldAddressInfo } from "../../../utils/components/Map/interface";
import MapDefault from "../../../utils/components/Map/MapDefault";
import RejectConfirmation from '../ShipperListView/SubComponent/RejectConfirmation';
import { sendGA } from '../../../utils/ga';
import './ShipperFormView.css'
import { debounce } from '../../../utils/commonFunctions/lodashFunctions';

import  ErrorBoundary  from '../../../utils/components/Form/ErrorBoundary'; 
import AdditionalContactsComponent from '../../../utils/components/AdditionalDetails/AdditionalContactsComponent';
import { updateAdditionalDetailsCount } from '../../../utils/components/AdditionalDetails/AdditionalContactHelper';
import { IMongoFormStructure } from '../../../utils/mongo/interfaces';
import { IMongoField } from '../../../utils/mongo/interfaces';
const FALLBACK_CENTER = [37.09024, -95.71289100000001];

const currencySymbol = 'cur_symbol_' + getBaseCurrency()

const ShipperForm = (props: any) => {

  /** General Hooks */
  const { handleCancelClick } = navigationConfirmationPopup();
  const userAccessInfo: ILocalStorageEntries = JSON.parse(localStorage.getItem('userAccessInfo') || '{}');
  const toast = useToast()
  const _center = userAccessInfo?.['countryLatLng']?.split(',') || FALLBACK_CENTER;
  const [position, setPosition] = useState<Array<number>>([Number(_center[0]), Number(_center[1])]);
  const [currentCordinates, setCurrentCordinates] = useState<Array<number>>([Number(_center[0]),Number(_center[1])])
  const [isMapSearched, setMapSearched] = useState<boolean>(false);
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.shipper},${currencySymbol}`)
  const formInstance = useForm<Record<string, any>>({
    mode: 'all', shouldUnregister: false, defaultValues: {}
  })
  console.log(formInstance.formState.isDirty)
  const { control, handleSubmit, reset, setValue, getValues, watch, unregister } = formInstance
  const { getCustomFieldsFormData } = useCustomFieldsForm()

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IShipperFormActions>>()
  const commonDispatch = useDispatch<Dispatch<IShipperCommonFormActions>>()
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
  const structure = useTypedSelector(state => state.shipper.form.structure)
  const onBoardingData = useTypedSelector(state => state.shipper.onBoardingStructure.onBoardingData.data)
  const shipperFormData = onBoardingData ? onBoardingData?.configurationSteps[0]?.subSteps[0].answerData : ''
  const isEditMode = useTypedSelector(state => state.shipper.form.isEditMode)
  const [additinalContactDetailsStructure, setAdditinalContactDetailsStructure]= useState<IMongoFormStructure>()
  const shipperStatus = useTypedSelector(state => state.shipper.form.shipperData?.status)
  const isStructureLoading = useTypedSelector(state => state.shipper.form.loading)
  const resetData = useTypedSelector(state => state.shipper.form.resetData)
  const isShipperApproved = useTypedSelector(state => state.shipper.form.isApproved)
  const googleApiKey = getGoogleAPIKey()
  const sectionKeys = Object.keys(structure)
  /** Internal State */
  const { reloadSidebar } = props;
  const clientBranchId = userAccessInfo?.clientBranchId
  const rejectModal = useTypedSelector(state => state.shipper.form.rejectionModal)
  const loaderRef = React.useRef<HTMLDivElement | null>(null)
  const [isSameAddressChecked, setIsSameAddressChecked] = useState<boolean>(false)
  const [isAddressFieldsTouched, setAddressFieldsTouched] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [showAdditionalContacts, setShowAdditionalContacts] = useState<boolean>(false)
  const [listOfContactDetails, setListOfContactDetails] = useState<Array<any>>([])

  const { token } = getQueryParams()
  const isRejected= (shipperStatus && shipperStatus=='REJECTED')
  if (!(watch('moduleKey'))) {
    setValue('moduleKey', 'shipper')
  }
  var clickApproved = false;
  const watchPhoneNumber: string | undefined = useWatch({control, name: 'phoneNumber'});

  /** Utils */
  const setShipperData = async (shipperdata: IShipperData) => {

    if (shipperdata) {
      let prefilledData = shipperdata;
      let urlParam = "?";
      try {
        if(shipperdata?.subClientId){
          urlParam = urlParam + 'subclientId=' + shipperdata?.subClientId;
        }else if(shipperdata?.shipperDetailsId){
          urlParam = urlParam + 'shipperDetailsId=' + shipperdata?.shipperDetailsId;
        }
        const { data: { data, status } } = await axios.get<ILogiAPIResponse<IShipperData>>(`${apiMappings.shipper.form.getShipperDetails}` + (urlParam))
        if (status === 200) {
          prefilledData = { ...prefilledData, ...data.body }
          dispatch({ type: '@@shipperForm/SET_SHIPPER_DATA', payload: prefilledData })
        }
        setSearchText(prefilledData?.shippingAddress)
        setListOfContactDetails(prefilledData?.additionalContactDetails)
      }
      catch (error) { }
      const customFieldsFormData = getCustomFieldsFormData(prefilledData?.customFields)
      const _resetData = {
        ...resetData, ...generateShipperFormData(prefilledData), ...customFieldsFormData,
      }
      reset({ ..._resetData })
      setIsSameAddressChecked(prefilledData.isSameAddressChecked)
      dispatch({ type: '@@shipperForm/SET_FORM_RESET_DATA', payload: _resetData })

    }

  }


  /** Callbacks */
  const onSubmit = async (data: any) => {
    sendGA('Event New',  isEditMode ? 'shipperSettings - shipper save ' : 'shipperSettings - shipper save draft');
    const { shipperLogo,shipperName, branch, shippingCountry, shippingApartment,billingApartment, shippingStreetName, billingStreetName,shippingLocality,billingLocality, shippingCity, billingCity,billingCountry, billingPinCode, billingState, shippingPincode, shippingState, shippingLandmark , billingLandmark, additionalContactDetails} = data
    const customFieldsData = generateCustomFieldsFormData(structure, data);
    const alreadyApproved = data.status === "APPROVED"
    let shippingPinCode= shippingPincode?.name==undefined ? shippingPincode: shippingPincode?.name;
    var shippingDetails = {
      country: shippingCountry?.id,
      countryName: shippingCountry?.name,
      landmark: shippingLandmark || "",
      stateName: shippingState?.name,
      stateId: shippingState?.id,
      apartment: shippingApartment,
      streetName: shippingStreetName,
      locality: shippingLocality,
      city: shippingCity,
      pincode: shippingPinCode
    }
    var billingDetails = {
      countryId: billingCountry?.id,
      countryName: billingCountry?.name,
      landmark: billingLandmark || "",
      state: billingState?.name,
      stateId: billingState?.id,
      apartment: billingApartment,
      streetName: billingStreetName,
      locality: billingLocality,
      city: billingCity,
      pincode: billingPinCode?.name
    }

    let logoData= shipperLogo?.newFiles?.[0] ? shipperLogo?.newFiles?.[0] : shipperLogo?.existingFiles?.[0]
    if (!logoData) {  
       //  for new shipper with empty logo & for delete operation logo empty string should be sent.
      logoData = {}
      logoData.url = ""
      logoData.filename = ""
    }
    let payload = {
      ...data,
      shipperName:shipperName?shipperName.trim():shipperName,
      shipperLogo: logoData?.shortUrl || logoData?.url,
      shipperLogoName: logoData?.filename,
      branchId: branch?.branchId || branch?.id || clientBranchId,
      branch: branch?.name,
      clientBranch: branch?.name,
      clientBranchId: branch?.branchId || branch?.id || clientBranchId,
      additionalContactDetails: additionalContactDetails,
      shippingCountry: shippingCountry?.name,
      shippingCountryId: shippingCountry?.id,
      shippingState: shippingState?.name,
      areaName:shippingLocality,
      shippingStateId: shippingState?.id,
      shippingPincode: shippingPinCode,
      billingCountry: billingCountry?.name,
      billingCountryId: billingCountry?.id,
      billingPinCode: billingPinCode?.name,
      billingState: billingState?.name,
      billingStateId: billingState?.id,
      token: token || onBoardingData?.token || '',
      customFields: customFieldsData,
      isSameAddressChecked: isSameAddressChecked,
      shippingAddressDetails:{latitude:(currentCordinates?.[0]) , longitude: currentCordinates?.[1] },
      ...(alreadyApproved ? { ...shippingDetails } : null),
      ...(alreadyApproved ? { billingAddressDetails: billingDetails } : null),
    }

    Object.keys(payload).map(key => {
      if(Array.isArray(payload[key]) && payload[key].length === 0){
        delete payload[key]
      }
      if (key?.includes('cf_') || payload[key] == undefined) {
        delete payload[key]
      }
    })
    delete payload.moduleKey;
    // about loop deletes all empty strings 
    // as per 57791 removing that condition on logo
    if (logoData && logoData.filename!==undefined && logoData.filename.trim() === "" && logoData.url!==undefined && logoData.url.trim() === "") {
      payload = {
        ...payload,
        shipperLogo: logoData?.shortUrl || logoData?.url,
        shipperLogoName: logoData?.filename,
      }
    }

    onBoardingData['clientId'] = JSON.parse(userAccessInfo.clientId);
    onBoardingData.configurationSteps[0].subSteps[0].answerData = JSON.stringify(payload)

    try {
      const { data: response } = await axios['post'](apiMappings.shipper.form[isShipperApproved ? 'update' : 'onBoarding'] + (isShipperApproved ? ' ' : ('?isDraft=' + (!isEditMode && !clickApproved))), isShipperApproved ? payload : onBoardingData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        if (clickApproved && (!alreadyApproved && !isShipperApproved)) {
          sendGA('Event New',  'shipperSettings - shipper approve');
          try {
            const { data: response } = await axios['post'](`${apiMappings.shipper.form['approve']}` + (token? token : onBoardingData?.token), { token: token || onBoardingData?.token }, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            if (response.status === 200) {
              if(!isEditMode){
                sectionKeys.forEach((key) => {
                  Object.keys(structure[key]).forEach((fieldName) => {
                    unregister(fieldName)
                  })
                })
                dispatch({ type: '@@shipperForm/RESET_INITIAL_STATE' })
                commonDispatch({ type: '@@shipperOnboarding/RESET_STRUCTURE' })
                hybridRouteTo('shipper/settings/profile?token='+onBoardingData?.token)
              }
              commonDispatch({ type: '@@shipperOnboarding/FETCH_STRUCTURE' })
              reloadSidebar();
              toastDispatch({
                type: '@@globalToast/add', payload: {
                  message: response.message,
                  icon: 'check-round'
                }
              })
              clickApproved = false
            }
          }
          catch (error) {
            clickApproved = false
            dispatch({ type: '@@shipperForm/APPROVE_SHIPPER', payload: false })
          }
        }
        else {
          toastDispatch({
            type: '@@globalToast/add', payload: {
              message: response.message,
              icon: 'check-round'
            }
          })
          commonDispatch({ type: '@@shipperOnboarding/RESET_STRUCTURE' })
          hybridRouteTo('shipper')
        }
      }
    } catch (error : any) {
      clickApproved = false
      if (error?.response?.data?.status === 428) {
        return
      }
      toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  const crateModalFlagHandle = () => {
    setShowAdditionalContacts(true)
  }
  
  const handleCopyAddress = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSameAddressChecked(e.target.checked)
    if (e.target.checked) {
      const currentModel = getValues()
      let pincode = typeof(currentModel.shippingPincode) == 'string'?{id: currentModel.shippingPincode,name: currentModel.shippingPincode}:currentModel.shippingPincode;
      setValue('billingCountry', currentModel.shippingCountry)
      setValue('billingState', currentModel.shippingState)
      setValue('billingApartment', currentModel.shippingApartment)
      setValue('billingPinCode', pincode)
      setValue('billingStreetName', currentModel.shippingStreetName)
      setValue('billingLandmark', currentModel.shippingLandmark)
      setValue('billingLocality', currentModel.shippingLocality)
      setValue('billingCity', currentModel.shippingCity)
      setValue('billingPincode', pincode)
    }
    else{
      setValue('billingCountry', '')
      setValue('billingState', '')
      setValue('billingApartment', '')
      setValue('billingPinCode','')
      setValue('billingStreetName', '')
      setValue('billingLandmark', '')
      setValue('billingLocality', '')
      setValue('billingCity', '')
      setValue('billingPincode', '')
    }
  }, [setValue, getValues])

  const setApprovedState = () => {
    clickApproved = true;
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 100)
  }

  const cancelUpdate = () => {
    if (!formInstance.formState.isDirty) {
      commonDispatch({ type: '@@shipperOnboarding/RESET_STRUCTURE' });
      dispatch({ type: '@@shipperForm/RESET_INITIAL_STATE' });
      hybridRouteTo('shipper');
      sendGA('Event New',  'shipperSettings - shipper cancel');
    }
    else {
      handleCancelClick()
    }
  }

  const updateAddressFields = (address: tSearchFieldAddressInfo) => {
    const newStructure = deepCopy(structure);
    setValue('shippingCountry', { 'id': '1', 'name': address?.country });
    setValue('shippingState', { "id": 1, "name": address?.state });
    setValue('shippingApartment', address?.apartment);
    setValue('shippingStreetName', address?.streetName);
    setValue('shippingLandmark', address?.landMark);
    setValue('shippingLocality', address?.locality);
    setValue('shippingCity', address?.city);

    if (Object.keys(newStructure).length) {
      if (Object.keys(newStructure['shippingAddressDetails']?.['addressFields']?.['childNodes'])?.includes('shippingPincode')) {
        if (newStructure?.['shippingAddressDetails']?.['addressFields']?.['childNodes']?.shippingPincode?.fieldType === "text") {
          setValue('shippingPincode', address?.pincode);
        } else if (newStructure?.['shippingAddressDetails']?.['addressFields']?.['childNodes']?.shippingPincode?.fieldType === "select") {
          setValue('shippingPincode', { "id": '1', "pincode": address?.pincode, "name": address?.pincode });
        }
      }
    }
    setMapSearched(false)
  }

  const populateMapAddress = (address: tSearchFieldAddressInfo) => {
    setMapSearched(address?.isPropSearch);
    if (Object.keys(address).length > 0) {
      if (isEditMode && address?.isPropSearch) {
        updateAddressFields(address);
        setCurrentCordinates(address.position);
      } else if (!address?.isPropSearch) {
        if (!isEditMode && !isAddressFieldsTouched && address?.isPropSearch) {
          updateAddressFields(address);
        }
        setCurrentCordinates(address.position);
      } else if (address?.isPropSearch && !isEditMode) {
        updateAddressFields(address);
        setCurrentCordinates(address.position);
      }
      else {
        setCurrentCordinates([_center[0], _center[1]]);
      }
    }
  }

  const getAdditionalDetailsStructure = async() => {
    try {
      const { data: { structure } } = await axios.get(`${apiMappings.common.additonalDetailsStructure}`)
      setAdditinalContactDetailsStructure(structure)
    }
    catch (error) { }
  }

 /** Watchers */
  useEffect(() => {
    if (!onBoardingData || (token && token !== onBoardingData?.token)) {
      commonDispatch({ type: '@@shipperOnboarding/FETCH_STRUCTURE' })
    }
  }, [onBoardingData, onBoardingData?.token])


  useEffect(() => {
    getAdditionalDetailsStructure()
    if (!sectionKeys.length) {
      dispatch({ type: '@@shipperForm/FETCH_STRUCTURE' })
    }
  }, [])

  useEffect(() =>{
    setValue("additionalContactDetails", listOfContactDetails);      
    setValue("additionalContactDetailsCount",updateAdditionalDetailsCount(listOfContactDetails))
  },[listOfContactDetails])
  
  useEffect(() => {
    if(isEditMode) return;
    if (structure && Object.keys(structure).length > 0 && structure['shipper details']?.['whatsappOptin']?.permission) {
      setValue('whatsappOptin', 'N');
    }
  }, [structure])


  useEffect(() => {
    if (shipperFormData) {
      dispatch({ type: '@@shipperForm/SET_SHIPPER_DATA', payload: JSON.parse(shipperFormData) })
      if (routeContains('profile') && token) {
        dispatch({ type: '@@shipperForm/APPROVE_SHIPPER', payload: JSON.parse(shipperFormData).status === 'APPROVED' })
        dispatch({ type: '@@shipperForm/SET_EDIT_MODE', payload: true })
        setShipperData(JSON.parse(shipperFormData))
      } else {
        reset({ ...resetData })
      }
    }
  }, [onBoardingData])

  useEffect(() => {
    return () => {
      sectionKeys.forEach((key) => {
        Object.keys(structure[key]).forEach((fieldName) => {
          unregister(fieldName)
        })
      })
      dispatch({ type: '@@shipperForm/RESET_INITIAL_STATE' })
      commonDispatch({ type: '@@shipperOnboarding/RESET_STRUCTURE' })
    }
  }, [])

  //Ignore few Validations in case of Save as Draft 
  const removeValidations = () => {
    sectionKeys.forEach((key) => {
      Object.keys(structure[key]).forEach((fieldName) => {
        if (fieldName !== 'shipperName' && fieldName !== 'adminName' && fieldName !== 'emailAddress' && fieldName !== 'phoneNumber' && fieldName !== 'additionalContactDetails') {
          unregister(fieldName)
        }
        const meta = structure[key][fieldName];
        const { fieldType, childNodes } = meta;
        if (fieldType === 'address' && childNodes) {
          console.log("childNodes", childNodes);
          Object.keys(childNodes).forEach((key: string) => {
            unregister(key)
          })
        }
      })
    })
    handleSubmit(onSubmit)();
  }
  
  const handleChangeAddressFields = () => {

    const country = (watch('shippingCountry',''));
    const state = (watch('shippingState',''));
    const apartment = (watch('shippingApartment',''));
    const streetName = (watch('shippingStreetName',''));
    const landmark = (watch('shippingLandmark',''));
    const locality = (watch('shippingLocality',''));
    const city = (watch('shippingCity',''));
    const zipCode = (watch('shippingPincode',''))

    const isTextType = structure?.['shippingAddressDetails']?.['addressFields']?.['childNodes']?.zipCode?.fieldType === "text" ? true : false;
    let address = `${apartment} ${streetName} ${landmark} ${locality} ${city} ${state?.name} ${country?.name} ${isTextType ? zipCode : zipCode?.name}`.replaceAll('undefined', '');
    console.log(address,'handleChangeAddressFields called')
    setTimeout(() => {
      setSearchText(address);
    }, 100)

  };
  const debouncingChangeAddressFieldFunction = debounce(handleChangeAddressFields,2000)

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value?.length === 0) {
      setValue('whatsappOptin', 'N')
    }
  }

  return (
    <div className='formWrapper' >
      <div id='toast-inject-here' />
      {
        rejectModal &&
        <RejectConfirmation
          showModal={rejectModal}
          setShowModal={(value: boolean) => dispatch({ type: '@@shipperForm/SET_REJECT_MODAL', payload: value })}
          page="ShipperForm"
        />
      }
      <div >
        {isStructureLoading ? <div ref={loaderRef}><FormLoader /></div>:
        <>
        <div className='formWrapper__mainContainer'>
          {sectionKeys.length > 0 ? Object.keys(structure).map((sectionName) =>{
            return (<div key={sectionName}>
              {Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) &&
                <SectionHeaderContainer>
                  {sectionName === 'billing details' ?
                    <>
                    <SectionHeader headerTitle={dynamicLabels.billingAddress}>
                   <span className='formWrapper__checkboxConatiner' ><Checkbox id='sameAsCurrentAddress' label={dynamicLabels.sameAsShippingAddress} checkboxSize='md' checked={isSameAddressChecked} onChange={handleCopyAddress}  /></span> 
                    </SectionHeader>
                    </>
                    :
                    <SectionHeader headerTitle={dynamicLabels[sectionName] ? dynamicLabels[sectionName] : 'Details'} />}
                </SectionHeaderContainer>}

              <Grid container spacing='10px' className='formWrapper__girdConatiner'>
                <Grid item md={sectionName === 'shippingAddressDetails' ? 6 : 12} xs={12} sm={sectionName === 'shippingAddressDetails' ? 6 : 12} className='grid-item'>
                  <Grid container spacing='10px'>
                    {Object.keys(structure[sectionName]).map(fieldName => {
                      const meta = structure[sectionName][fieldName]
                      meta.multipleFiles = false
                      const { permission, fieldType, childNodes } = meta
                      if (fieldName === 'shipperLogo') {
                        meta.customField = true
                        meta.multipleFiles = false
                      }
                      if ((fieldName == 'shipperName' || fieldName == 'userName' || fieldName == 'branch') && isShipperApproved) {
                        meta.editable = false;
                      }
                      if (!permission || fieldName === 'whatsappOptin') {
                        return undefined
                      }

                      if (fieldType === 'address' && childNodes) {
                        return Object.entries(childNodes).map(([key, value]) => {
                          return (
                            <Grid item key={key} xs={12} sm={6} md={sectionName === 'shippingAddressDetails' ? 6 : 3} className='grid-item'>
                              <FormField
                                name={key}
                                meta={value}
                                formInstance={formInstance}
                                onChange={() => { 
                                  debouncingChangeAddressFieldFunction()
                                  setAddressFieldsTouched(true) }}
                              />
                            </Grid>
                          )
                        })
                      } else if (fieldName === 'additionalContactDetails') {
                        meta['fieldType'] = 'textWithIcon'
                        meta['readOnly'] = true
                        meta['iconVariant'] = 'add'
                        meta['decimalPlaces'] = 10
                        return (
                            <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                                <FormField
                                    name={"additionalContactDetailsCount"}
                                    meta={meta}
                                    handler={crateModalFlagHandle}
                                    formInstance={formInstance} />
                            </Grid>
                        ) 
                      } else if(fieldName === 'phoneNumber') {
                        const whatsAppFieldMeta: IMongoField | undefined = structure[sectionName]?.['whatsappOptin' as string];
                        const editable = (watchPhoneNumber && watchPhoneNumber?.length > 0) as boolean;
                        return (
                            <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                              <FormField
                                name={fieldName}
                                meta={meta}
                                formInstance={formInstance} 
                                onChange={handlePhoneNumberChange}
                              />
                            {whatsAppFieldMeta?.permission ?
                              <Box mt='-5px' mb='8px' className='whatsapp-checkbox-wrapper'>
                                <FormField
                                  name={whatsAppFieldMeta.id}
                                  meta={{ ...whatsAppFieldMeta, editable }}
                                  formInstance={formInstance}
                                />
                              </Box> : null
                            }
                            </Grid>
                          )
                      }
                      return (
                        <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                          <FormField
                            name={fieldName}
                            meta={meta}
                            formInstance={formInstance} />
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
                {sectionName === 'shippingAddressDetails' &&
                  <Grid item md={6} xs={12} sm={6} className='grid-item'>
                    <Grid container >
                      <Grid item md={12} sm={12} className="grid-item">
                        <div className='formWrapper__mapConatainer' >
                        <ErrorBoundary>
                              <MapDefault
                              useFlyTo={false}
                              type='branch'
                              settingAPIParam='addClientBranchMap'
                              geocoding={true}
                              getPositions={setPosition}
                              position={position}
                              searchTextData={searchText}
                              googleApiKey={googleApiKey}
                              sendLocationOutside={(address: tSearchFieldAddressInfo) =>  populateMapAddress(address)}
                              isEditMode={isEditMode}
                          />
                        </ErrorBoundary>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                }
              </Grid>
            </div>)}
            
          ) : null}
        </div> 
        {!isRejected && <Box horizontalSpacing='15px' display='flex' mt='30px' >
          <IconButton id="shipper_configuration_profile--actionbar--save_as_draft" iconVariant='icomoon-save' className='formWrapper__actionButtons' disabled={isStructureLoading} onClick={isEditMode ? handleSubmit(onSubmit) : removeValidations} primary>{isEditMode ? dynamicLabels.save : dynamicLabels.saveAsDraft}</IconButton>
          {!isShipperApproved && <>
            <IconButton id="shipper_configuration_profile--actionbar--approve" iconVariant='icomoon-tick-circled' disabled={isStructureLoading} className='formWrapper__actionButtons'
              onClick={setApprovedState} primary>{dynamicLabels.approve}</IconButton>
            <IconButton id="shipper_configuration_profile--actionbar--reject" iconVariant='icomoon-close' className='formWrapper__actionButtons' disabled={isStructureLoading || !isEditMode}
              onClick={() => {
                dispatch({ type: '@@shipperForm/FETCH_REJECT_REASON_LIST_DATA' });
                dispatch({ type: '@@shipperForm/SET_REJECT_MODAL', payload: true })
                sendGA('Event New',  'shipperSettings - shipper reject');
              }}>{dynamicLabels.REJECT}</IconButton>
          </>}
          <IconButton id="shipper_configuration_profile--actionbar--cancel" iconVariant='icomoon-close' className='formWrapper__actionButtons' onClick={() => { cancelUpdate() }}>Cancel</IconButton>
        </Box>}
        </>}    
      </div>
      {showAdditionalContacts && 
                <AdditionalContactsComponent
                  showAdditionalContacts = {showAdditionalContacts}
                  setShowAdditionalContacts = {setShowAdditionalContacts}
                  addressformInstance = {formInstance}
                  listOfContactDetails = {listOfContactDetails}
                  setListOfContactDetails = {setListOfContactDetails}
                  additinalContactDetailsStructure = {additinalContactDetailsStructure}
                />
            }
    </div>
  )
}

export default withReact(ShipperForm)