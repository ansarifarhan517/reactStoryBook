import React,{Dispatch} from 'react'
import { UseFormMethods } from 'react-hook-form';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { useDispatch } from 'react-redux';
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import { IconButton } from 'ui-library';
import {IClientMetricData, IFleetTypeData} from './FleetTypeForm.models'
import moment from 'moment'
import { sendGA } from '../../../utils/ga'
import capacityConversion from '../../Vehicle/VehicleListView/utils/capacityConversion';




export const useGoogleAnalytics = () => {
    const isEditMode = useTypedSelector(state => state.fleet.form.isEditMode)
    const gaOnSubmit = () => {
        sendGA('Form Actions', ` Fleet Type Form Button Click - ${isEditMode ? 'Update' : 'Save'}`)
    }
    const gaOnCancel = () => {
        sendGA('Form Actions', ` Fleet Type Form Button Click - Cancel`)
    }
    return { gaOnSubmit, gaOnCancel }
}



export const generateFleetTypeFormData = (data: IFleetTypeData, clientMetric? : IClientMetricData) => {

    const {
        waitingTimeCost,
        weeklyOffList,
        shiftStartTime,
        shiftEndTime,
        breakStartTimeWindow,
        breakEndTimeWindow,
        skillSet,
        compartmentList,
        minSpeed,
        maxSpeed,
        ...rest
    } = data
 
    return {
        ...rest,
        weeklyOffList: typeof weeklyOffList !== 'string' && weeklyOffList?.map((m: any) => {
            return {
                id: m,
                name: m
            }
        }),
        rateProfile: { id: data?.rateProfileId, name: data?.rateProfileName },
        payoutProfile: { id: data?.payoutProfileId, name: data?.payoutProfileName },
        waitingCost: waitingTimeCost,
        shiftStartTime: shiftStartTime ? moment(shiftStartTime, 'HH:mm')?.toDate() : '',
        shiftEndTime: shiftEndTime ? moment(shiftEndTime, 'HH:mm')?.toDate(): '',
        breakStartTimeWindow: breakStartTimeWindow ? moment(breakStartTimeWindow, 'HH:mm')?.toDate(): '',
        breakEndTimeWindow: breakEndTimeWindow ? moment(breakEndTimeWindow, 'HH:mm')?.toDate() :  '',
        addCompartmentDetails: compartmentList?.length ? 'Y' : 'N',
        minSpeed: minSpeed? capacityConversion(minSpeed, 'GET', clientMetric?.speed?.conversionFactor).toFixed(2) : null,
        maxSpeed: maxSpeed? capacityConversion(maxSpeed, 'GET', clientMetric?.speed?.conversionFactor).toFixed(2) : null,
    }
}

export const useBreadCrumbs = (formInstance :UseFormMethods<Record<string, any>>) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const isEditMode = useTypedSelector(state => state.fleet.form.isEditMode)
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

    const breadCrumbOptions = React.useMemo(() => [
        { id: 'fleet', label: dynamicLabels.Resources, disabled: true },
        { id: 'fleettype', label: `${dynamicLabels?.fleet_p}`, disabled: false },
        { id: 'addfleettypes', label: `${isEditMode ? dynamicLabels.update : dynamicLabels.add} ${dynamicLabels?.fleet_s}`, disabled: true },
    ], [dynamicLabels, isEditMode])

    const handleBreadCrumbClick = (id: string) => {
        switch (id) {
            case 'fleettype':
                if (!formInstance.formState.isDirty) {
                    hybridRouteTo('fleetTypeMaster/')
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
                                        hybridRouteTo('fleetTypeMaster/')
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