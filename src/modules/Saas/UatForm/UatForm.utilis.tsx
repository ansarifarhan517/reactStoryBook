import { IUatData } from "./UatForm.model";
import React, {
    Dispatch,
    // useEffect, useState
} from 'react';
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { useDispatch } from 'react-redux';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import { UseFormMethods } from 'react-hook-form';
import { IconButton } from 'ui-library';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import ga from '../../../utils/ga'

export const generateUATFormData = (data : IUatData) => {
    const {clientId, adminName, adminEmailId, adminContactNo, name, accountCount, id} = data
    return {
        ...data,
        adminName: adminName,
        clientId: clientId,
        adminEmailId: adminEmailId,
        adminContactNo: adminContactNo,
        name : name,
        accountCount : accountCount,
        id: id
    }
}


export const useGoogleAnalytics = () => {
    const isEditMode = useTypedSelector(state => state.uat.form.isEditMode)
    const uatData = useTypedSelector(state => state.uat.form.uatData)
    const gaOnSubmit = () => {
        ga.event({
            category: 'Form Actions',
            action: `Button Click - ${isEditMode ? 'Update' : 'Save'}`,
            label: `UAT Form - ${isEditMode ? 'Edit Mode' : 'Add Mode'}`,
            value: isEditMode ? uatData?.clientId : undefined
        })
    }

    const gaOnCancel = () => {
        ga.event({
            category: 'Form Actions',
            action: 'Button Click - Cancel',
            label: `UAT Form - ${isEditMode ? 'Edit Mode' : 'Add Mode'}`,
            value: isEditMode ? uatData?.clientId : undefined
        })
    }
    return { gaOnSubmit, gaOnCancel }
}

export const useBreadCrumbs = (formInstance: UseFormMethods<Record<string, any>>) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    // const pageLabels = useTypedSelector(state => state.pageLabels.driver)
    const isEditMode = useTypedSelector(state => state.driver.form.isEditMode)
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
    const breadcrumbLabel = isEditMode ? `${dynamicLabels?.update} UAT Client` : `${dynamicLabels?.add} UAT Client`
    const breadCrumbOptions = React.useMemo(() => [
        { id: 'settingDashboard', label: dynamicLabels?.clientDetails, disabled: false },
        { id: 'plans', label: breadcrumbLabel, disabled: true },
    ], [dynamicLabels])

    const handleBreadCrumbClick = (id: string) => {
        switch (id) {
          case 'settingDashboard':
            if (!formInstance.formState.isDirty) {
              hybridRouteTo('client')
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
                        hybridRouteTo('client')
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
