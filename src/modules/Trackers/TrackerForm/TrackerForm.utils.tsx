import React,{Dispatch} from 'react'
import { hybridRouteTo } from '../../../utils/hybridRouting'
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { IconButton } from 'ui-library';
import { UseFormMethods } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export const preparePayload = (formInputs: any) => {
    const {
        trackerDescription,
        barcode,
        clientBranchId,
        imei,
        isActiveFl,
        supplierRefId,
        trackeeId,
        trackerConfigId,
        trackerTypeRefId
    } = formInputs


    const payload = {
    trackerConfigId: trackerConfigId?trackerConfigId['id'] : null ,
    trackerName: trackerConfigId?trackerConfigId['name'] : null ,
    clientBranchId: clientBranchId ? clientBranchId['branchId'] : null,
    clientBranchName: clientBranchId ? clientBranchId['name'] : null,
    barcode: barcode,
    trackeeId: trackeeId,
    trackerDescription: trackerDescription,
    imei: imei,
    isActiveFl: isActiveFl === "Y"?true:false
    }


    return payload;
}


export const useBreadCrumbs = (formInstance :UseFormMethods<Record<string, any>>) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)


    const isFormEditable = useTypedSelector(state => state.tracker.trackers.form.isFormEditable)
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
   
    const breadCrumbOptions = React.useMemo(() => [
        { id: 'fleets', label: dynamicLabels.Resources || 'Fleets', disabled: true },
        { id: 'trackers', label: dynamicLabels.tracker_p || 'Trackers', disabled: false },
        { id: 'addtracker', label: `${isFormEditable ? dynamicLabels.update : dynamicLabels.add} ${dynamicLabels?.tracker_s}`, disabled: true },
    ], [dynamicLabels,isFormEditable])

    const handleBreadCrumbClick = (id: string) => {
        switch (id) {
            case 'trackers':
                if (!formInstance.formState.isDirty) {
                    hybridRouteTo('trackers')
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
                                        hybridRouteTo('trackers')
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

