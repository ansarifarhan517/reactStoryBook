import React, { Dispatch } from 'react';
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { useDispatch } from 'react-redux';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import { UseFormMethods } from 'react-hook-form';
import { IconButton } from 'ui-library';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { IDriverData } from './DriverForm.model';
import { sendGA } from '../../../utils/ga'

export const generateDriverFormData = (data: IDriverData) => {
  const {
    clientBranchId, clientBranchName, defaultVehicle, vehicleNumber,
    previousCompanyName, licenseIssueBy,
    licenseProof, addressProofId,
    languageList,
    addressList,
    licenseType,
    branchName
  } = data
  const addressData = {}

  addressList?.forEach((address) => {
    const prefix = address.isCurrentAddress ? 'cur_' : 'per_'

    addressData[`${prefix}country`] = address.country && {
      id: Number(address.country),
      name: address.countryName
    }
    addressData[`${prefix}state`] = address.state && {
      id: Number(address.state),
      name: address.stateName
    }
    addressData[`${prefix}streetName`] = address.streetName
    addressData[`${prefix}locality`] = address.areaName
    addressData[`${prefix}landmark`] = address.landmark
    addressData[`${prefix}city`] = address.city
    addressData[`${prefix}apartment`] = address.apartment
    addressData[`${prefix}pincode`] = address.pincode && {
      id: Number(address.pincode),
      name: address.pincode
    }

  })

  return {
    ...data,
    ...addressData,
    companyName: previousCompanyName,
    licenseIssuedBy: licenseIssueBy,
    clientBranchId: {
      id: Number(clientBranchId),
      name: branchName
    },
    assignVehicle: {
      id: Number(defaultVehicle),
      name: vehicleNumber
    },
    // languagelist: {
    //   id: Number(languagelist),
    //   name: languagelist
    // },
    licenseFileUpload: {
      existingFiles: licenseProof?.map(l => ({ id: l.mediaId, filename: l.fileName, url: l.finalUrl })) || []
    },
    idProofUpload: {
      existingFiles: addressProofId?.map(a => ({ id: a.mediaId, filename: a.fileName, url: a.finalUrl })) || [],
    },
    languagelist: languageList?.map(l => ({ ...l, id: l.name, _id: l.id })),
    licenseType: licenseType === 'Both' ? '2 Wheeler,4 Wheeler' : typeof licenseType === 'string' && licenseType.charAt(0) == '{' ? JSON.parse(licenseType) : licenseType
  }
}


export const useGoogleAnalytics = () => {
  const isEditMode = useTypedSelector(state => state.driver.form.isEditMode)
  const gaOnSubmit = () => {
    sendGA('Form Actions',`Driver Form Button Click - ${isEditMode ? 'Update' : 'Save'}`)
  }

  const gaOnCancel = () => {
    sendGA('Form Actions','Driver Form Button Click - Cancel')
  }

  return { gaOnSubmit, gaOnCancel }
}

export const useBreadCrumbs = (formInstance: UseFormMethods<Record<string, any>>) => {
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  // const pageLabels = useTypedSelector(state => state.pageLabels.driver)
  const isEditMode = useTypedSelector(state => state.driver.form.isEditMode)
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

  const breadCrumbOptions = React.useMemo(() => [
    { id: 'fleet', label: dynamicLabels.Resources, disabled: true },
    { id: 'drivers', label: dynamicLabels.drivers, disabled: false },
    { id: 'adddriver', label: `${isEditMode ? dynamicLabels.update : dynamicLabels.add} ${dynamicLabels?.driver}`, disabled: true },
  ], [dynamicLabels, isEditMode])

  const handleBreadCrumbClick = (id: string) => {
    switch (id) {
      case 'drivers':
        if (!formInstance.formState.isDirty) {
          hybridRouteTo('driver/')
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
                    hybridRouteTo('driver/')
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