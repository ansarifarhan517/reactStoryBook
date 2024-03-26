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
import { IClientMetric, IVehicleData } from './VehicleForm.model';
import { sendGA } from '../../../utils/ga'
import moment from 'moment'
import { IFileEntity } from '../../../utils/mongo/interfaces';
import capacityConversion from '../VehicleListView/utils/capacityConversion';

export const generateVehicleFormData = (data: IVehicleData, clientMetric?: IClientMetric) => {
    
    const {
        registrationCopy,
        pucCopy,
        clientBranchId,
        clientBranchName,
        insuranceCopy,
        vehiclePermit,
        vehicleType,
        fleetTypeId,
        fleetType,
        waitingTimeCost,
        ownership,
        weeklyOffList,
        insuranceValidity,
        pucValidity,
        vehiclePurchaseDate,
        deliveryType,
        shiftStartTime,
        shiftEndTime,
        breakStartTimeWindow,
        breakEndTimeWindow,
        rentStartDate,
        rentEndDate,
        movementType,
        typeOfBody,
        deviceId,
        skillSet,
        minSpeed,
        maxSpeed,
        ...rest
    } = data
 
    return {
        ...rest,
        clientBranchId: {
            id: Number(clientBranchId),
            name: clientBranchName
        },
        vehicleType: {
            id: vehicleType,
            name: vehicleType
        },
        vehiclePermit: vehiclePermit?.split(',').map((m: any) => {
            return {
                id: m,
                name: m
            }
        }),
        deliveryType: deliveryType?.split(',').map((m: any) => {
            return {
                id: m,
                name: m
            }
        }),
       
       
        weeklyOffList: typeof weeklyOffList !== 'string' && weeklyOffList?.map((m: any) => {
            return {
                id: m,
                name: m
            }
        }),
        movementType: {
            id: movementType,
            name: movementType
        },
        typeOfBody: {
            id: typeOfBody,
            name: typeOfBody
        },
        deviceId: Object.keys(deviceId)?.length > 0 && {
            id: deviceId?.deviceId,
            name: deviceId?.barcode
        },
        fleetType: fleetTypeId ? {
            id: Number(fleetTypeId),
            name: fleetType
        } : undefined,
        registrationCopy: {
            existingFiles: registrationCopy?.map((l: IFileEntity) => ({ id: l.mediaId, filename: l.fileName, url: l.finalUrl })) || []
        },
        ownership: {
            id: ownership,
            name: ownership
        },
        pucCopy: {
            existingFiles: pucCopy?.map((a: IFileEntity) => ({ id: a.mediaId, filename: a.fileName, url: a.finalUrl })) || [],
        },
        insuranceValidity: insuranceValidity && new Date(insuranceValidity),
        pucValidity: pucValidity && new Date(pucValidity),
        rentStartDate: rentStartDate && new Date(rentStartDate),
        rentEndDate: rentEndDate && new Date(rentEndDate),
        vehiclePurchaseDate: vehiclePurchaseDate && new Date(vehiclePurchaseDate),
        insuranceCopy: {
            existingFiles: insuranceCopy?.map((l: IFileEntity) => ({ id: l.mediaId, filename: l.fileName, url: l.finalUrl })) || []
        },
        waitingCost: waitingTimeCost,
        shiftStartTime: shiftStartTime ? moment(shiftStartTime, 'HH:mm')?.toDate() : '',
        shiftEndTime: shiftEndTime ? moment(shiftEndTime, 'HH:mm')?.toDate(): '',
        breakStartTimeWindow: breakStartTimeWindow ? moment(breakStartTimeWindow, 'HH:mm')?.toDate(): '',
        breakEndTimeWindow: breakEndTimeWindow ? moment(breakEndTimeWindow, 'HH:mm')?.toDate() :  '',
        minSpeed: minSpeed? capacityConversion(parseFloat(minSpeed), 'GET', clientMetric?.distance?.conversionFactor).toFixed(2) : null,
        maxSpeed: maxSpeed? capacityConversion(parseFloat(maxSpeed), 'GET', clientMetric?.distance?.conversionFactor).toFixed(2) : null,
    }
}


export const useGoogleAnalytics = () => {
    const isEditMode = useTypedSelector(state => state.vehicle.form.isEditMode)
    const gaOnSubmit = () => {
        sendGA('Form Actions',` Vehicle Form Button Click - ${isEditMode ? 'Update' : 'Save'}`)
    }

    const gaOnCancel = () => {
        sendGA('Form Actions',` Vehicle Form Button Click - Cancel`)
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
        { id: 'vehicle', label: dynamicLabels.vehicles, disabled: false },
        { id: 'addvehicles', label: `${isEditMode ? dynamicLabels.update : dynamicLabels.add} ${dynamicLabels?.vehicle}`, disabled: true },
    ], [dynamicLabels, isEditMode])

    const handleBreadCrumbClick = (id: string) => {
        switch (id) {
            case 'vehicle':
                if (!formInstance.formState.isDirty) {
                    hybridRouteTo('vehicle/')
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
                                        hybridRouteTo('vehicle/')
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


// export const Capacityconverter = (value, )