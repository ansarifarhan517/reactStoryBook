import React, { Dispatch } from 'react';
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { useDispatch } from 'react-redux';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import { UseFormMethods } from 'react-hook-form';
import { IconButton } from 'ui-library';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { IAddOn, IPlansForm, IScheduleChanges, IZohoAddon, IDropdown, IBillingFrequency } from './PlansForm.model';
import ga from '../../../utils/ga'
import { EmptyObject } from 'react-hook-form/dist/types/utils';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { IMongoFormStructure } from '../../../utils/mongo/interfaces';

export const accordionStructure = {
  'planDetails': {
    'id': 'planDetails',
    'label': 'Plan Details',
    'labelKey': 'planDetails',
    'addLabel': '',
    'isDelete': false,
    'table': {
      'columns': [
        //   {
        //   'id': 'planName',
        //   'label': 'Plan Name',
        //   'fieldType': 'select',
        //   'readOnly': true
        // },
        // {
        //   'id': 'pricingOption',
        //   'label': 'Pricing Option',
        //   'fieldType': 'select',
        //   'readOnly': true,
        //   'options': [{ label: 'Unit', value: 'unit' }, { label: 'Tier', value: 'tier' }]
        // },
        {
          'id': 'rate',
          'label': 'Rate',
          'fieldType': 'decimal',
          'readOnly': false
        },
        {
          'id': 'tiers',
          'label': 'Rate',
          'fieldType': 'square',
          'readOnly': false
        },
        {
          'id': 'price',
          'label': 'Price',
          'fieldType': 'display',
          'readOnly': true
        }
      ]
    }
  },
  'recurringAddOn': {
    'id': 'recurringAddOn',
    'label': 'Recurring Addon Details',
    'labelKey': 'recurringAddOn',
    'addLabel': '+ Add Recurring Addon',
    'isDelete': true,
    'table': {
      'columns': [
        //   {
        //   'id': 'addOnName',
        //   'label': 'Addon Name',
        //   'fieldType': 'select',
        //   'readOnly': false
        // },
        {
          'id': 'numberOfTransaction',
          'label': 'Number of Units',
          'fieldType': 'number',
          'readOnly': false
        },
        // {
        //   'id': 'pricingOption',
        //   'label': 'Pricing Option',
        //   'fieldType': 'select',
        //   'readOnly': false,
        //   'options': [{ label: 'Unit', value: 'unit' }, { label: 'Tier', value: 'tier' }]
        // },
        {
          'id': 'rate',
          'label': 'Rate',
          'fieldType': 'decimal',
          'readOnly': false
        },
        {
          'id': 'tiers',
          'label': 'Rate',
          'fieldType': 'square',
          'readOnly': false
        },
        {
          'id': 'price',
          'label': 'Price',
          'readOnly': false,
          'fieldType': 'display',
        }
      ]
    }
  },
  'oneTimeAddOn': {
    'id': 'oneTimeAddOn',
    'label': 'One-time Addon Details',
    'labelKey': 'oneTimeAddOn',
    'addLabel': '+ Add One-time Addon',
    'isDelete': true,
    'table': {
      'columns': [
        //   {
        //   'id': 'addOnName',
        //   'label': 'Addon Name',
        //   'fieldType': 'select',
        //   'readOnly': false
        // },
        {
          'id': 'billingDate',
          'label': 'Billing Start - Billing End Date',
          'fieldType': 'calendar',
          'readOnly': false
        },
        // {
        //   'id': 'billingEndDate',
        //   'label': 'Billing End Date',
        //   'fieldType': 'calendar',
        //   'readOnly': false
        // },
        {
          'id': 'numberOfTransaction',
          'label': 'Number of Units',
          'fieldType': 'number',
          'readOnly': false
        },
        // {
        //   'id': 'pricingOption',
        //   'label': 'Pricing Option',
        //   'fieldType': 'select',
        //   'readOnly': false,
        //   'options': [{ label: 'Unit', value: 'unit' }, { label: 'Tier', value: 'tier' }]
        // },
        {
          'id': 'rate',
          'label': 'Rate',
          'fieldType': 'decimal',
          'readOnly': false
        },
        {
          'id': 'tiers',
          'label': 'Rate',
          'fieldType': 'square',
          'readOnly': false
        },
        {
          'id': 'price',
          'label': 'Price',
          'readOnly': false,
          'fieldType': 'display',
        }
      ]
    }
  }
}
export const createPlan = (planName: string, rate?: number, quantity?: number) => {
  return [{
    'id': 'planName',
    'label': 'Plan Name',
    'fieldType': 'select',
    'readOnly': true,
    value: planName,
    options: []
  },
  {
    'id': 'numberOfOrders',
    'label': 'Number of Orders',
    'fieldType': 'number',
    'readOnly': false,
    value: quantity
  },
  // {
  //   'id': 'pricingOption',
  //   'label': 'Pricing Option',
  //   'fieldType': 'select',
  //   'readOnly': true,
  //   'options': [{ label: 'Unit', value: 'unit' }, { label: 'Tier', value: 'tier' }],
  //   value: priceOption
  // },
  {
    'id': 'rate',
    'label': 'Rate',
    'fieldType': 'decimal',
    'readOnly': false,
    value: rate
  },
  {
    'id': 'tiers',
    'label': 'Rate',
    'fieldType': 'square',
    'readOnly': false
  },
  {
    'id': 'price',
    'label': 'Price',
    'fieldType': 'display',
    'readOnly': true,
    value: Number(rate) * Number(quantity)
  }]
}
const keyMapping = {
  email: "billingEmail",
  phoneNumber: "billingContactNo",
  country: 'billingCountry',
  apartment: 'billingApartment',
  streetName: 'billingStreetName',
  landmark: 'billingLandmark',
  locality: 'billingLocality',
  state: 'billingState',
  city: 'billingCity',
  pincode: 'billingPinCode',
  adminContactNo: 'adminPhoneNumber',
  adminEmailId: 'adminEmailId',
  currencyCode: 'billingCurrency',
  billingFequency: 'billingFrequency',
  contactEmailAddress: 'billingEmail',
  zipCode: 'billingPincode'
}
export const summaryKeysWithCurrency = ['smsRecurringAddOnPrice', 'emailRecurringAddOnPrice', 'emailOneTimeAddOnPrice', 'orderOneTimeAddOnPrice', 'smsOneTimeAddOnPrice', 'ivrRecurringAddOnPrice', 'ivrOneTimeAddOnPrice']
export const getPincode = async (name: string) => {
  const { data: pincode } = await axios.get(`${apiMappings.common.lookup.getPincodeDestination}`, {
    data: {},
    params: {
      pincode: name
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
  let currentPincode = undefined
  if (pincode[0]) {
    currentPincode = { ...pincode[0], label: pincode[0]?.name, value: pincode[0]?.pincodeId, id: pincode[0]?.pincodeId }
  }
  return currentPincode
}
export const getSelectedLookup = async (id: number, type: string, dependentId?: number) => {

  try {
    const { data: response } = await axios.get(`${apiMappings.common.lookup?.getStates}`, {
      data: {},
      params: {
        id: dependentId ? dependentId : id,
        type
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.find((entry: { id: number }) => entry.id === id)
  } catch (error) {
    console.log(error)
  }

}

export const getSignUpType = async (name: string) => {
  const {data: response} = await axios.get(`${apiMappings.common.lookup.getSignUpType}`, {
    data: {},
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response?.find((elem: any) => 
    elem?.clientRefMasterCd === name
  )
}

export const getBillingFrequency = async (name: string, dispatch : any) => {
  const { data: billingCycle } = await axios.get(`${apiMappings.common.lookup.billingCycle}`, {
    data: {},
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const tempResp = name
  const billingFreqMap = {}
  billingCycle.map((entry : IBillingFrequency) => billingFreqMap[entry.name] = entry.id)
  dispatch({ type: '@@plansForm/SET_BILLING_FREQUENCY', payload: billingFreqMap })
  const billingFreq = billingCycle.find((cycle: any) => cycle?.name === tempResp)
  return billingFreq
}
export const setPlanData = async (data: IPlansForm, setValue: (key: string, value: any) => void, dispatch: any, storeState: any) => {

  const { billingAddressDTO, businessDevelopmentManager, accountManager, operationManager } = data
  const keys = Object.keys(data)
  const tierAddonData = data?.addonTierData && JSON.parse(data?.addonTierData)
  billingAddressDTO && keys.forEach(async (key) => {
    const watchGeneralKey = keyMapping?.[key] ? keyMapping?.[key] : key
    if (watchGeneralKey === 'businessDevelopmentManager' || watchGeneralKey === 'accountManager' || watchGeneralKey === 'operationManager') {
      setValue(watchGeneralKey, data?.[key])
    } else if (key === 'signUpType') {
      const signUpValue = await getSignUpType(data?.['signUpType']);
      setValue(key, signUpValue)
    }
    else if (key === 'parentName') {
      setValue('linkToParentEntity', 'Y');
      setValue('parentEntityName', { name:data?.['parentName'], id: 1 });
    }
    else if (key==="zohoSubscriptionId") {
      setValue('zohoSubscriptionId', data?.['zohoSubscriptionId']);
      setValue('shareSubscription', data?.['zohoSubscriptionId'] ? 'N' : 'Y');
    }
    else if (key === 'billingFequency') {
      const billingFrequency = await getBillingFrequency(data?.['billingFequency'], dispatch)
      setValue('billingFrequency', billingFrequency)
    } else if (key === 'legalDocsFilledBy') {
      setValue('legalDocs', data?.['legalDocsFilledBy'])
    }
    else if(key==='subscriptionActivationDate'){
      let convertedDate = new Date(data['subscriptionActivationDate'])
      setValue('subscriptionActivationDate',convertedDate);
    }
    else if (watchGeneralKey === 'billingAddressDTO') {
      const billingDTOKeys = billingAddressDTO && Object.keys(billingAddressDTO)
      billingDTOKeys?.forEach(async billingKey => {
        const watchKeys = keyMapping?.[billingKey] ? keyMapping[billingKey] : billingKey
        if (billingKey === 'countryId' && billingAddressDTO.countryId) {
          const countryObj = await getSelectedLookup(billingAddressDTO.countryId, 'country')
          setValue('billingCountry', countryObj)
        }

        if (billingKey === 'stateId' && billingAddressDTO.stateId && billingAddressDTO.countryId) {
          const stateObj = await getSelectedLookup(billingAddressDTO.stateId, 'STATE', billingAddressDTO.countryId)
          console.log("Setting state on")
          setValue('billingState', stateObj)
        }
        if (billingKey === 'pincode' && billingAddressDTO?.['pincode']) {
          const pincode = await getPincode(billingAddressDTO?.['pincode'])
          setValue('billingPinCode', pincode)
        }

        else {
          setValue(watchKeys, billingAddressDTO[billingKey])
        }
      })
    } else if (watchGeneralKey === 'paymentTerms' && data.paymentTerms) {
      setValue('paymentTerms', data.paymentTerms.toString())
    }
    else if (key === 'currencyCode' && data?.currencyCode && storeState?.billingCurrency) {
      setValue('billingCurrency', storeState?.billingCurrency[data?.currencyCode])
    } else if (key === 'subscriptionType' && data?.subscriptionType) {
      setValue('subscriptionType', data?.subscriptionType === 'Orders' ? 'orders' : 'deliveryAssociates')
    } else if (key === 'planType' || key === 'planQuantity' || key === 'planUnitRate' || key === 'planPrice' || key === 'planPricingOption') {
      return
    }
    else if (key === 'planTierData') {
      if (data?.planTierData) {
        const newRowData = { ...storeState.rowWiseData, planDetails: { 1: Object.values(JSON.parse(data?.planTierData))?.[0] } }
        dispatch({ type: '@@plansForm/SET_ROWWISE_TIER_DATA', payload: newRowData })
      }
    }
    else if (key === 'zohoAddonDTOs') {
      const transformedZohoAddon = data?.zohoAddonDTOs?.map((addon: IZohoAddon) => {
        //const tierDataKeys = tierAddonData && Object.keys(tierAddonData)
        const transformedAddonObj: IZohoAddon = {
          "addonCode": addon.addonCode,
          "numberOfTransaction": addon.quantity,
          // as rate is coming as price from backend, while doing create form as well we are sending rate as price
          "rate": addon.price,
          "price": addon?.quantity && addon?.price ? Number(addon.quantity) * Number(addon.price) : 0,
          // "pricingOption": tierDataKeys.includes(addon.addonCode) ? 'tier' : 'unit'
        }
        if (addon.billingStartDate) {
          transformedAddonObj.billingStartDate = addon.billingStartDate
        }
        if (addon.billingEndDate) {
          transformedAddonObj.billingEndDate = addon.billingEndDate
        }
        return transformedAddonObj
      })
      dispatch({ type: '@@plansForm/SET_ZOHO_ADDONS', payload: transformedZohoAddon })
    } else if (key === 'addonTierData') {
      dispatch({ type: '@@plansForm/SET_ADDON_TIER_DATA', payload: tierAddonData })
    }
    else {
        setValue(watchGeneralKey, data[key])
    }

  })

  const selectedPlan = createPlan(data.planType, data?.planUnitRate, data?.planQuantity)
  //plan selection
  dispatch({ type: '@@plansForm/SET_SELECTED_PLAN', payload: selectedPlan })
  setInternalUsers(businessDevelopmentManager, accountManager, operationManager, setValue);
  return data
}

export const setInternalUsers = (businessDevelopmentManager : IDropdown | undefined, accountManager: IDropdown | undefined, operationManager : IDropdown | undefined, setValue: (key: string, value: any) => void) => {
  setValue("businessDevelopmentManager", businessDevelopmentManager ? {
    id: businessDevelopmentManager?.id,
    email: businessDevelopmentManager?.email,
    name: businessDevelopmentManager?.displayName
  } : undefined)

  setValue("accountManager", accountManager ? {
    id: accountManager?.id,
    email: accountManager?.email,
    name: accountManager?.displayName
  } : undefined)

  setValue("operationManager", operationManager ? {
    id: operationManager?.id,
    email: operationManager?.email,
    name: operationManager?.displayName
  } : undefined)
}

export const createOneTimeAddOn = (addon: IAddOn | EmptyObject, oneTimeAddOnList: IAddOn[]) => {
  const { addonCode, price, rate, numberOfTransaction, billingStartDate, billingEndDate } = addon
  return [
    {
      'id': 'addOnName',
      'label': 'Addon Name',
      'fieldType': 'select',
      'readOnly': false,
      value: addonCode,
      options: oneTimeAddOnList
    },
    {
      'id': 'billingDate',
      'label': 'Billing Start - Billing End Date',
      'fieldType': 'calendar',
      'readOnly': false,
      value: billingStartDate ? billingStartDate + ' - ' + billingEndDate : undefined
    },
    {
      'id': 'numberOfTransaction',
      'label': 'Number of Units',
      'fieldType': 'number',
      'readOnly': false,
      value: numberOfTransaction
    },
    // {
    //   'id': 'pricingOption',
    //   'label': 'Pricing Option',
    //   'fieldType': 'select',
    //   'readOnly': false,
    //   'options': [{ label: 'Unit', value: 'unit' }, { label: 'Tier', value: 'tier' }],
    //   value: pricingOption
    // },
    {
      'id': 'rate',
      'label': 'Rate',
      'fieldType': 'decimal',
      'readOnly': false,
      value: rate
    },
    {
      'id': 'tiers',
      'label': 'Rate',
      'fieldType': 'square',
      'readOnly': false,
    },
    {
      'id': 'price',
      'label': 'Price',
      'readOnly': false,
      'fieldType': 'display',
      value: price
    }
  ]
}
export const createRecurringAddOn = (addon: IAddOn | EmptyObject, recurringAddOnList: IAddOn[]) => {
  const { addonCode, price, rate, numberOfTransaction } = addon
  return [
    {
      'id': 'addOnName',
      'label': 'Addon Name',
      'fieldType': 'select',
      'readOnly': false,
      value: addonCode,
      options: recurringAddOnList || []
    },
    {
      'id': 'numberOfTransaction',
      'label': 'Number of Units',
      'fieldType': 'number',
      'readOnly': false,
      value: numberOfTransaction
    },
    // {
    //   'id': 'pricingOption',
    //   'label': 'Pricing Option',
    //   'fieldType': 'select',
    //   'readOnly': false,
    //   'options': [{ label: 'Unit', value: 'unit' }, { label: 'Tier', value: 'tier' }],
    //   value: pricingOption
    // },
    {
      'id': 'rate',
      'label': 'Rate',
      'fieldType': 'decimal',
      'readOnly': false,
      value: rate
    },
    {
      'id': 'tiers',
      'label': 'Rate',
      'fieldType': 'square',
      'readOnly': false,

    },
    {
      'id': 'price',
      'label': 'Price',
      'readOnly': false,
      'fieldType': 'display',
      value: price
    }
  ]

}

export const useGoogleAnalytics = () => {
  const isEditMode = useTypedSelector(state => state.saas.plans.isEditMode)
  const data = useTypedSelector(state => state.saas.plans.plansData)
  const gaOnSubmit = () => {
    ga.event({
      category: 'Form Actions',
      action: `Button Click - ${isEditMode ? 'Update' : 'Save'}`,
      label: `Plans Form - ${isEditMode ? 'Edit Mode' : 'Add Mode'}`,
      value: isEditMode ? Number(data?.clientId) : undefined
    })
  }

  const gaOnCancel = () => {
    ga.event({
      category: 'Form Actions',
      action: 'Button Click - Cancel',
      label: `Plans Form - ${isEditMode ? 'Edit Mode' : 'Add Mode'}`,
      value: isEditMode ? Number(data?.clientId) : undefined
    })
  }

  return { gaOnSubmit, gaOnCancel }
}

export const useBreadCrumbs = (formInstance: UseFormMethods<Record<string, any>>) => {
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const isEditMode = useTypedSelector(state => state.saas.plans.isEditMode)
  // const pageLabels = useTypedSelector(state => state.pageLabels.driver)
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const breadcrumbLabel = isEditMode ? `${dynamicLabels?.update} Client` : `${dynamicLabels?.add} Client`
  const breadCrumbOptions = React.useMemo(() => [
    { id: 'settingDashboard', label: dynamicLabels?.clientDetails, disabled: false },
    { id: 'plans', label: breadcrumbLabel, disabled: true },

  ], [dynamicLabels])

  const handleBreadCrumbClick = (id: string) => {
    switch (id) {
      case 'settingDashboard':
        if (!formInstance.formState.isDirty) {
          hybridRouteTo('admindashboard')
        } else {
          globalPopupDispatch({
            type: '@@globalPopup/SET_PROPS',
            payload: {
              isOpen: true,
              title: dynamicLabels.navigationConfirmation,
              content: dynamicLabels.dataLostWarningMsg,
              footer: (
                <>
                  <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => {
                    globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                    hybridRouteTo('admindashboard')
                  }}>{dynamicLabels.ok}</IconButton>
                  <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
                </>
              )
            }
          })
        }
        break
    }
  }

  return { breadCrumbOptions, handleBreadCrumbClick }
}

export function createSchedulePlan(scheduleChanges: IScheduleChanges) {
  // pricing option should be dynamic, check for tiers logic pending,
  //IF tier based pricing calculate price seperately
  const { planType, subscriptionType, planUnitRate, planQuantity, currencyCode, billingFrequency } = scheduleChanges
  return [{ key: 'planType', label: 'Plan Name', value: planType },
  { key: 'planQuantity', label: `Number of ${subscriptionType}`, value: planQuantity },
  //  { key: 'priceOptions', label: `Pricing Options`, value: 'unit' },
  { key: 'planUnitRate', label: subscriptionType === 'Orders' ? `Rate(${currencyCode})` : `${billingFrequency} Rate(${currencyCode})`, value: planUnitRate },
  { key: 'price', label: subscriptionType === 'Orders' ? `Price(${currencyCode})` : `${billingFrequency} Price(${currencyCode})`, value: Number(planQuantity) * Number(planUnitRate) },
  ]
}

export function createScheduleAddon(addon: IZohoAddon) {
  const { addonCode, price, quantity, billingStartDate, billingEndDate, currencyCode } = addon
  return billingStartDate ?
    [{ key: 'addonName', label: 'Addon Name', value: addonCode },
    { key: 'planQuantity', label: `Number of Units`, value: quantity },
    { key: 'startEndDate', label: `Billing Start - Billing End Date`, value: billingStartDate + ' - ' + billingEndDate },

    // { key: 'priceOptions', label: `Pricing Options`, value: 'unit' },
    { key: 'planUnitRate', label: currencyCode ? `Rate ${currencyCode}` : 'Rate', value: price },
    { key: 'price', label: 'Price', value: Number(quantity) * Number(price) },
    ]
    : [{ key: 'addonName', label: 'Addon Name', value: addonCode },
    { key: 'planQuantity', label: `Number of  Units`, value: quantity },
    // { key: 'priceOptions', label: `Pricing Options`, value: 'unit' },
    { key: 'planUnitRate', label: currencyCode ? `Rate(${currencyCode})` : 'Rate', value: price },
    { key: 'price', label: currencyCode ? `Price(${currencyCode})` : 'Price', value: Number(quantity) * Number(price) },
    ]
}

export const resetAddressFieldOnCountryChange = async (country : any, structure: IMongoFormStructure, setValue: (key: string, value: any) => void, dispatch: Function) => {
  const countryValidationStructure = await getAddressMandatoryFields(country.name)
  Object.keys(structure.billingAddressDetails).map((billingKey) =>  {
    if (billingKey !== 'billingCountry') {
      setValue(billingKey, "")
      let fieldName = structure.billingAddressDetails[billingKey].fieldName;
      if (Object.keys(countryValidationStructure).length && fieldName && countryValidationStructure[fieldName]) {
        if (billingKey === 'billingState') {
          fieldName = 'stateId'
        }
        structure.billingAddressDetails[billingKey].required = countryValidationStructure[fieldName].required;
        structure.billingAddressDetails[billingKey].validation = countryValidationStructure[fieldName].validation;
      }}
  })
  dispatch({ type: '@@plansForm/SET_STRUCTURE', payload: structure })
}

export const getAddressMandatoryFields = async (countryName : string) => {
  try {
    var fieldName = ["apartment","streetName","landmark","locality","stateId","city","zipCode"]
    const { data: response } = await axios.post(`${apiMappings.saas.plans.addressFields}${countryName}`, fieldName);
    return response.addressFields;
  } catch (error) {
    console.log(error)
  }
}