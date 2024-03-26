import React, { Dispatch } from 'react';
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { useDispatch } from 'react-redux';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import { IMongoFormStructure } from '../../../utils/mongo/interfaces';
import { IconButton } from 'ui-library';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { IShipperData } from './ShipperForm.model';
export const generateShipperFormData = (data: IShipperData) => {
  const {
    branchId, branch, shippingCountryId, shippingCountry,
    shippingState, shippingStateId, billingCountry, billingCountryId, billingState, billingStateId, shipperLogoName, shipperLogo, billingPinCode, shippingPincode
  } = data

  const shipperLogoData = {
    existingFiles: [{ id: '', filename: shipperLogoName, url: shipperLogo || shipperLogoName }]
  }

  const branchData = {
    id: branchId,
    name: branch
  }
  const shippingStateData = {
    id: shippingStateId,
    name: shippingState
  }
  const shippingCountryData = {
    id: shippingCountryId,
    name: shippingCountry
  }
  const billingStateData = {
    id: billingStateId,
    name: billingState
  }
  const billingCountryData = {
    id: billingCountryId,
    name: billingCountry
  }
  const billingPincodeData = {
    id: billingPinCode,
    name: billingPinCode
  }
  const shippingPincodeData = {
    id: shippingPincode,
    name: shippingPincode
  }
  return {
    ...data,
    ...(shippingStateId && shippingState ? { shippingState: shippingStateData } : null),
    ...(shippingCountryId && shippingCountry ? { shippingCountry: shippingCountryData } : null),
    ...(billingStateId && billingState ? { billingState: billingStateData } : null),
    ...(billingCountryId && billingCountry ? { billingCountry: billingCountryData } : null),
    ...(billingPinCode  ? { billingPinCode: billingPincodeData } : null),
    ...(shippingPincode  ? { shippingPincode: shippingPincodeData } : null),
    ...(branch && branchId ? { branch: branchData } : null),
    ...(shipperLogoName || shipperLogo ? { shipperLogo: shipperLogoData } : null)
  }
}


export const generateCustomFieldsFormData = (structure: IMongoFormStructure, data: any): Record<string, any> => {
  const customFieldsSection = structure?.['additional information']
  const payload: any = []

  if (!customFieldsSection) {
    return payload
  }
  Object.keys(customFieldsSection).forEach(async (fieldKey) => {
    const fieldType = customFieldsSection[fieldKey].fieldType

    switch (fieldType) {
      case 'file':

        if (data[fieldKey]?.existingFiles.length) {
          payload.push({ field: fieldKey, value: data[fieldKey]?.existingFiles[0]?.shortUrl || '', type: fieldType })
        }

        if (data[fieldKey]?.newFiles.length) {
          payload.push({ field: fieldKey, value: data[fieldKey]?.newFiles[0]?.shortUrl || '', type: fieldType })
        }
        break

      default:
        payload.push({ field: fieldKey, value: data[fieldKey], type: fieldType })
    }
  })
  return payload;
}


export const navigationConfirmationPopup = () => {
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

  const handleCancelClick = () => {
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
              hybridRouteTo('shipper')
            }}>{dynamicLabels.ok}</IconButton>
            <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
          </>
        )
      }
    })
  }
  return { handleCancelClick }

}