import React, {useEffect,Dispatch, useState} from 'react'
import { useForm } from 'react-hook-form'
import {
    BreadCrumb, Box, Card, Grid,
    SectionHeader,
    IconButton,
    useToast
} from 'ui-library'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import {
    SectionHeaderContainer,
    FormWrapper
} from '../../../utils/components/Form/Form.styles'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import apiMappings from '../../../utils/apiMapping'
import { getBaseCurrency } from '../../../utils/core'
import {useBreadCrumbs , generateFleetTypeFormData ,useGoogleAnalytics} from './FleetTypeForm.utils'
import FormField from '../../../utils/components/Form/FormField'
import { useDispatch } from 'react-redux'
import {IFleetTypeActions} from './FleetTypeForm.actions'
import { withReactOptimized } from '../../../utils/components/withReact'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { hybridRouteTo, getQueryParams, routeContains} from '../../../utils/hybridRouting';
import moment from 'moment-timezone'
import axios from '../../../utils/axios'
import { ILogiAPIResponse } from '../../../utils/api.interfaces'
import { IFleetTypeData } from './FleetTypeForm.models'
import { tGlobalToastActions } from '../../common/GlobalToasts/globalToast.reducer'
import FormLoader from '../../../utils/components/FormLoader'
import useClientProperties from '../../common/ClientProperties/useClientProperties'
import { FormActionButtonWrapper, FormActionButton } from '../StyledFleetTypeView'
import { IMongoField } from '../../../utils/mongo/interfaces'
import { deepCopy } from "../../../utils/helper";

const currencySymbol = 'cur_symbol_' + getBaseCurrency()
const FleetTypeForm = () => {
    const toast = useToast()
    const [isfleetTypeDataLoading, setFleetTypeDataLoading] = useState<boolean>(false)
    const structure = useTypedSelector(state => state.fleet.form.structure)
    const compartmentStructure = useTypedSelector(state => state.fleet.form.compartmentStructure)
    const sectionKeys = Object.keys(structure)
    const isStructureLoading = useTypedSelector(state => state.fleet.form.loading)
    const dispatch = useDispatch<Dispatch<IFleetTypeActions>>()
    const isLoading = React.useMemo(() => isStructureLoading || isfleetTypeDataLoading, [isStructureLoading, isfleetTypeDataLoading])
    const loaderRef = React.useRef<HTMLDivElement | null>(null)
    const isEditMode = useTypedSelector(state => state.fleet.form.isEditMode)
    const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.fleet},${currencySymbol}`)
    const clientMetric = useTypedSelector(state => state.fleet.form.clientMetric)
    const formInstance = useForm<Record<string, any>>({
        mode: 'all', shouldUnregister: false
    })
    console.log(formInstance.formState.isDirty)
    const { handleSubmit, reset, setValue, unregister, watch, clearErrors } = formInstance
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const fleetTypeData = useTypedSelector(state => state.fleet.form.fleetTypeData)
    const resetData = useTypedSelector(state => state.fleet.form.resetData)
    const { gaOnSubmit, gaOnCancel } = useGoogleAnalytics()
    const clientProperties = useClientProperties(['TIMEZONE'])
    const watchAddCompartmentDetails = watch('addCompartmentDetails', '')
    const [istouched, setistouched] = useState<boolean>(true)
    const [isCompartmentStructuretouched, setIsCompartmentStructuretouched] = useState<boolean>(false)
    const compartmentMasterList = useTypedSelector(state => state.fleet.form.compartmentMasterList)
    useEffect(() => {
        if (!sectionKeys.length) {
            dispatch({ type: '@@fleetTypeForm/FETCH_STRUCTURE' })
        }

        if (Object.keys(clientMetric).length > 0  && !fleetTypeData) {
            const { fleetId } = getQueryParams()

            if (routeContains('updateFleetType') && fleetId) {
                dispatch({ type: '@@fleetTypeForm/SET_EDIT_MODE', payload: true })
                fetchFleetTypeData(fleetId)
            } else {
                reset({ ...resetData })
            }
        }
        
    },[clientMetric])
    useEffect(() => {
        if (watchAddCompartmentDetails && watchAddCompartmentDetails === 'N') {
            compartmentStructure.map((comp: any) => {
                let keys = Object.keys(comp);
                clearErrors(keys)
            })
        }
        else if(watchAddCompartmentDetails && watchAddCompartmentDetails === 'Y'){
            dispatch({ type: '@@fleetTypeForm/FETCH_COMPARTMENT_MASTER_DATA' })
        }
    },[watchAddCompartmentDetails])

    useEffect(() => {
        return () => {
            sectionKeys.forEach((key) => {
                Object.keys(structure[key]).forEach((fieldName) => {
                    unregister(fieldName)
                })
            })
            dispatch({ type: '@@fleetTypeForm/RESET_INITIAL_STATE' })
        }
    }, [])

    useEffect(() => {
        if (fleetTypeData) {
            handleChange(fleetTypeData)
        }
    }, [fleetTypeData])

    useEffect(() => {
        if (fleetTypeData && compartmentStructure && compartmentStructure.length && istouched) {
            if(fleetTypeData.compartmentList && fleetTypeData.compartmentList.length){
                const compartmentArray: any = []
                compartmentArray.push(compartmentStructure[0])
                fleetTypeData.compartmentList.forEach((comp: any, index) => {
                    let keys = Object.keys(compartmentStructure[0]);
                        if(index >= 1)
                        {
                            let newField = {
                                compartmentId: null,
                                [`compartmentName-${index}`]: { ...compartmentStructure[0][keys[1]], id: `compartmentName-${index}`, fieldName: `compartmentName-${index}`, labelKey: `compartmentName-${index}`, permission: true, required: true },
                                [`noOfUnits-${index}`]: { ...compartmentStructure[0][keys[2]], id: `noOfUnits-${index}`, fieldName: `noOfUnits-${index}`, labelKey: `noOfUnits-${index}`, permission: true },
                              };
                            compartmentArray.push(newField)
                        }
                        setValue('compartmentName'+ (index ? '-'+index : ''), {title:comp['compartmentName'] ,label:comp['compartmentName'], name: comp['compartmentName'], value: comp['compartmentId'], id:comp['compartmentId'] });
                        setValue('noOfUnits'+ (index ? '-'+index : ''), comp.noOfUnits);
                  });
                  setistouched(false)
                  dispatch({ type: '@@fleetTypeForm/SET_COMPARTMENT_STRUCTURE', payload: compartmentArray })
            }
        }
    }, [fleetTypeData, compartmentStructure])

    const { breadCrumbOptions, handleBreadCrumbClick } = useBreadCrumbs(formInstance)


    const fetchFleetTypeData = async (fleetId: string | number) => {
        setFleetTypeDataLoading(true)
        try {
            const { data: { data, status } } = await axios.get<ILogiAPIResponse<IFleetTypeData>>(`${apiMappings.fleet.form.getData}?id=`+fleetId)

            if (status === 200) {
                if (data?.capacityInVolume) {
                    const val = capacityConversion(data.capacityInVolume, 'GET', clientMetric?.volume?.conversionFactor)
                    data['capacityInVolume'] = parseFloat(val.toFixed(2))
                }

                if (data?.capacityInWeight) {
                    const val = capacityConversion(data.capacityInWeight, 'GET', clientMetric?.weight?.conversionFactor)
                    data['capacityInWeight'] = parseFloat(val.toFixed(2))
                }

                if (data?.minCapacityUtilizationInVolume) {
                    const val = capacityConversion(data.minCapacityUtilizationInVolume, 'GET', clientMetric?.volume?.conversionFactor)
                    data['minCapacityUtilizationInVolume'] = parseFloat(val.toFixed(2))
                }

                if (data?.minCapacityUtilizationInWeight) {
                    const val = capacityConversion(data.minCapacityUtilizationInWeight, 'GET', clientMetric?.weight?.conversionFactor)
                    data['minCapacityUtilizationInWeight'] = parseFloat(val.toFixed(2))
                }
                if(data?.minSpeed){
                    const val = capacityConversion(data.minSpeed, 'GET', clientMetric?.speed?.conversionFactor)
                    data['minSpeed'] = parseFloat(val.toFixed(2))
                }
                if(data?.maxSpeed){
                    const val = capacityConversion(data.maxSpeed, 'GET', clientMetric?.speed?.conversionFactor)
                    data['maxSpeed'] = parseFloat(val.toFixed(2))
                }

                dispatch({ type: '@@fleetTypeForm/SET_FLEETTYPE_DATA', payload: data })

                const _resetData = {
                    ...resetData,
                    ...generateFleetTypeFormData(data,clientMetric),
                }
                reset({ ..._resetData })
                dispatch({ type: '@@fleetTypeForm/SET_FORM_RESET_DATA', payload: _resetData })
                setFleetTypeDataLoading(false)
            }
        } catch (error) {
            console.log(error)
            setFleetTypeDataLoading(false)
            toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
        }

    }


    const capacityConversion = (value: number, type:string, conversionFactor: any,) => {
        if(type === 'GET') {
          return value * conversionFactor
        } else if (type === 'POST') {
          return value / conversionFactor
        }
        return 0
      }

    const groupCompartmentsById = (arr = []) => {
        const res:any = [];
        const map = {};
        let i, j, curr;
        for (i = 0, j = arr.length; i < j; i++) {
           curr = arr[i];
           if (!(curr.compartmentId in map)) {
              map[curr.compartmentId] = {compartmentId: curr.compartmentId, noOfUnits: null};
              res.push(map[curr.compartmentId]);
           };
           map[curr.compartmentId].noOfUnits += curr.noOfUnits;
        };
        return res;
     };
    const validateCapacities = (compartments, data) => {
        let capacityInUnits = 0; 
        let capacityInWeight = 0; 
        let capacityInVolume = 0;
        compartments.forEach((compartment) => {
            const masterComparment = compartmentMasterList?.find(comp => comp.id === compartment.compartmentId)
            capacityInUnits += compartment.noOfUnits * masterComparment?.capacityInUnits
            capacityInWeight += compartment.noOfUnits * parseFloat(capacityConversion(masterComparment?.capacityInWeight, 'GET', clientMetric?.weight?.conversionFactor)?.toFixed(2)) 
            capacityInVolume += compartment.noOfUnits * parseFloat(capacityConversion(parseFloat(masterComparment?.capacityInVolume), 'GET', clientMetric?.volume?.conversionFactor)?.toFixed(2))
        });
        if (capacityInUnits > data.capacityInUnits) {
            toast.add(dynamicLabels?.['compartment.capacityInUnits.exceeds'], 'warning', false);
            return true;
        }
        data.capacityInWeight = !data.capacityInWeight ? 0 : data.capacityInWeight
        data.capacityInVolume = !data.capacityInVolume ? 0 : data.capacityInVolume
        if ((parseFloat(capacityInWeight.toFixed(2)) > parseFloat(data.capacityInWeight))) {
            toast.add(dynamicLabels?.['compartment.capacityInWeight.exceeds'], 'warning', false);
            return true;
        }
        if ((parseFloat(capacityInVolume.toFixed(2)) > parseFloat(data.capacityInVolume))) {
            toast.add(dynamicLabels?.['compartment.capacityInVolume.exceeds'], 'warning', false);
            return true;
        }
        return false;
    }
    const onSubmit = async (data: any) => {
        gaOnSubmit()
        if (!formInstance.formState.isDirty && !isCompartmentStructuretouched) {
            hybridRouteTo('fleetTypeMaster/')
            return
        }

        if(isEditMode) {
            data.id = fleetTypeData?.id
        }

        const {
            type,
            make,
            waitingTimeCost,
            fixedCost,
            variableCost,
            transportTimeCost,
            deliveryType,
            weeklyOffList,
            shiftStartTime,
            shiftEndTime,
            breakStartTimeWindow,
            breakEndTimeWindow,
            breakDurationInMins,
            capacityInUnits,
            capacityInVolume,
            capacityInWeight,
            minCapacityUtilizationInUnits,
            minCapacityUtilizationInVolume,
            minCapacityUtilizationInWeight,
            maxDistance,
            loadingTimeInMins,
            rateProfile,
            payoutProfile
        } = data

        if(breakStartTimeWindow && breakEndTimeWindow ) {
            if(!shiftStartTime || !shiftEndTime) {
                toast.add(dynamicLabels?.pleaseEnterShiftTimingsIfBreakTimingsAreThere, 'warning', false);
                return
            }
        }
        if(data?.minSpeed && data?.maxSpeed) {
            if(parseFloat(data?.minSpeed) >= parseFloat(data?.maxSpeed)){
                toast.add(dynamicLabels?.['invalid.vehicle.minspeed.maxspeed'], 'warning', false);
                return
            }
        }
        if(data?.minTemperature && data?.maxTemperature) {
            if(parseFloat(data?.minTemperature) >= parseFloat(data?.maxTemperature)){
                toast.add(dynamicLabels?.['invalid.vehicle.mintemperature.maxtemperature'], 'warning', false);
                return
            }
        }
        const payload = isEditMode ? {
            id: data.id ? data.id : null,
            type : type,
            make: make,
            waitingTimeCost :waitingTimeCost? waitingTimeCost : null,
            fixedCost: fixedCost ? fixedCost : null,
            variableCost: variableCost ? variableCost : null,
            transportTimeCost : transportTimeCost ? transportTimeCost : null,
            breakDurationInMins: breakDurationInMins ? parseInt(breakDurationInMins) : null,
            loadingTimeInMins: loadingTimeInMins ? loadingTimeInMins : null,
            skillSet : deliveryType ? deliveryType.map((d: any) => {return d.name}) : [],
            weeklyOffList: weeklyOffList ? weeklyOffList.map((d: any) => { return d.name}) : [],
            shiftStartTime: shiftStartTime ? moment(shiftStartTime).format('HH:mm:ss') : null,
            shiftEndTime: shiftEndTime ? moment(shiftEndTime).format('HH:mm:ss') : null,
            breakStartTimeWindow: breakStartTimeWindow ? moment(breakStartTimeWindow).format('HH:mm:ss') : null,
            breakEndTimeWindow: breakEndTimeWindow ? moment(breakEndTimeWindow).format('HH:mm:ss') : null,
            capacityInUnits : capacityInUnits ? capacityInUnits : 0,
            capacityInVolume: capacityInVolume ? capacityConversion(parseFloat(capacityInVolume), 'POST', clientMetric?.volume?.conversionFactor) : 0,
            capacityInWeight: capacityInWeight ? capacityConversion(parseFloat(capacityInWeight), 'POST', clientMetric?.weight?.conversionFactor) : 0,
            minCapacityUtilizationInUnits : minCapacityUtilizationInUnits ? minCapacityUtilizationInUnits : 0,
            minCapacityUtilizationInVolume: minCapacityUtilizationInVolume ? capacityConversion(parseFloat(minCapacityUtilizationInVolume), 'POST', clientMetric?.volume?.conversionFactor) : 0,
            minCapacityUtilizationInWeight: minCapacityUtilizationInWeight ? capacityConversion(parseFloat(minCapacityUtilizationInWeight), 'POST', clientMetric?.weight?.conversionFactor) : 0,
            maxDistance: maxDistance ? capacityConversion(parseFloat(maxDistance), 'POST', clientMetric?.distance?.conversionFactor) : null,
            rateProfileId: rateProfile ? rateProfile.id : null,
            payoutProfileId: payoutProfile ? payoutProfile.id : null,
            maxSpeed: data?.maxSpeed ? capacityConversion(parseFloat(data?.maxSpeed), 'POST', clientMetric?.speed?.conversionFactor) : null,
            minSpeed: data?.minSpeed ? capacityConversion(parseFloat(data?.minSpeed), 'POST', clientMetric?.speed?.conversionFactor) : null,
            maxTemperature: data?.maxTemperature ? parseFloat(data.maxTemperature) : null,
            minTemperature: data?.minTemperature ? parseFloat(data.minTemperature) : null,

        } :
        {
            type : type,
            make: make,
            waitingTimeCost :waitingTimeCost? waitingTimeCost : null,
            fixedCost: fixedCost ? fixedCost : null,
            variableCost: variableCost ? variableCost : null,
            transportTimeCost : transportTimeCost ? transportTimeCost : null,
            breakDurationInMins: breakDurationInMins ? parseInt(breakDurationInMins) : null,
            loadingTimeInMins: loadingTimeInMins ? loadingTimeInMins : null,
            skillSet : deliveryType ? deliveryType.map((d: any) => {return d.name}) : [],
            weeklyOffList: weeklyOffList ? weeklyOffList.map((d: any) => { return d.name}) : [],
            shiftStartTime: shiftStartTime ? moment(shiftStartTime).format('HH:mm:ss') : null,
            shiftEndTime: shiftEndTime ? moment(shiftEndTime).format('HH:mm:ss') : null,
            breakStartTimeWindow: breakStartTimeWindow ? moment(breakStartTimeWindow).format('HH:mm:ss') : null,
            breakEndTimeWindow: breakEndTimeWindow ? moment(breakEndTimeWindow).format('HH:mm:ss') : null,
            capacityInUnits : capacityInUnits ? capacityInUnits : 0,
            capacityInVolume: capacityInVolume ? capacityConversion(parseFloat(capacityInVolume), 'POST', clientMetric?.volume?.conversionFactor) : 0,
            capacityInWeight: capacityInWeight ? capacityConversion(parseFloat(capacityInWeight), 'POST', clientMetric?.weight?.conversionFactor) : 0,
            minCapacityUtilizationInUnits : minCapacityUtilizationInUnits ? minCapacityUtilizationInUnits : 0,
            minCapacityUtilizationInVolume: minCapacityUtilizationInVolume ? capacityConversion(parseFloat(minCapacityUtilizationInVolume), 'POST', clientMetric?.volume?.conversionFactor) : 0,
            minCapacityUtilizationInWeight: minCapacityUtilizationInWeight ? capacityConversion(parseFloat(minCapacityUtilizationInWeight), 'POST', clientMetric?.weight?.conversionFactor) : 0,
            maxDistance: maxDistance ? capacityConversion(parseFloat(maxDistance), 'POST', clientMetric?.distance?.conversionFactor) : null,
            rateProfileId: rateProfile ? rateProfile.id : null,
            payoutProfileId: payoutProfile ? payoutProfile.id : null,
            maxSpeed: data?.maxSpeed ? capacityConversion(parseFloat(data?.maxSpeed), 'POST', clientMetric?.speed?.conversionFactor) : null,
            minSpeed: data?.minSpeed ? capacityConversion(parseFloat(data?.minSpeed), 'POST', clientMetric?.speed?.conversionFactor) : null,
            maxTemperature: data?.maxTemperature ? parseFloat(data.maxTemperature) : null,
            minTemperature: data?.minTemperature ? parseFloat(data.minTemperature) : null,
        }
        if(watchAddCompartmentDetails === 'Y'){
            const compartmentList = compartmentStructure.filter(item =>
                item[Object.keys(item)[Object.keys(item).length - 1]]?.permission
              ).map((comp: any) => {
                    let keys = Object.keys(comp);
                    return {
                            ['compartmentId']: watch(String([keys[1]]), '')?.id,
                            ['noOfUnits']: parseInt(watch(String([keys[2]]), ''))
                            }
                        })
            const transformedCompartmentArray = groupCompartmentsById(compartmentList)
            const capacitiesInvalid = validateCapacities(transformedCompartmentArray, data)
            if(capacitiesInvalid){
                return;
            }
            payload['compartmentList'] = transformedCompartmentArray;
        }
        else{
            payload['compartmentList'] = []
        }
        dispatch({ type: '@@fleetTypeForm/SET_LOADING', payload: true })
        try {
            const contructURL = isEditMode ? apiMappings.fleet.form.update : apiMappings.fleet.form.create;
            const { data: response } = isEditMode ? await axios.put(contructURL, [payload], {
            }) : await axios.post(contructURL, [payload], {
            })

            if (response.status === 200) {
                dispatch({ type: '@@fleetTypeForm/SET_LOADING', payload: false })
                toastDispatch({
                    type: '@@globalToast/add', payload: {
                        message: isEditMode ? dynamicLabels?.fleettypeupdate :dynamicLabels?.fleettypeadd ,
                        icon: 'check-round'
                    }
                })
                hybridRouteTo('fleetTypeMaster/')
            }
        } catch (error) {
            dispatch({ type: '@@fleetTypeForm/SET_LOADING', payload: false })
            toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
        }
    }

    const handleChange = (e: any) => {
        if (e) {
            setValue('capacityInUnits', e?.capacityInUnits);
            setValue('capacityInWeight', e?.capacityInWeight);
            setValue('capacityInVolume', e?.capacityInVolume);
            setValue('minCapacityUtilizationInUnits', e?.minCapacityUtilizationInUnits);
            setValue('minCapacityUtilizationInVolume', e?.minCapacityUtilizationInVolume);
            setValue('minCapacityUtilizationInWeight', e?.minCapacityUtilizationInWeight);
            setValue('fixedCost', e?.fixedCost);
            setValue('make',e?.make);
            setValue('type',e?.type);
            setValue('variableCost', e?.variableCost);
            setValue('transportTimeCost', e?.transportTimeCost);
            setValue('waitingTimeCost', e?.waitingTimeCost);
            setValue('shiftEndTime', e.shiftEndTime ? new Date(moment(e.shiftEndTime ,'HH:mm')): '');
            setValue('shiftStartTime', e.shiftStartTime ? new Date (moment(e.shiftStartTime ,'HH:mm')) : '');
            setValue('breakDurationInMins', e?.breakDurationInMins);
            setValue('breakEndTimeWindow', e.breakEndTimeWindow ? new Date(moment(e.breakEndTimeWindow ,'HH:mm')) : '');
            setValue('breakStartTimeWindow', e.breakStartTimeWindow ? new Date(moment(e.breakStartTimeWindow ,'HH:mm')) : '');
            setValue('maxDistance',e?.maxDistance);
            setValue('loadingTimeInMins',e?.loadingTimeInMins);;
            setValue('minSpeed',e?.minSpeed);
            setValue('maxSpeed',e?.maxSpeed);
            let skillsSets = e?.skillSet?.map((s: any) => {
                return {
                    id: s,
                    name: s
                }
            })
            setValue('deliveryType', skillsSets);
            let weeklyOffList = e?.weeklyOffList?.map((s: any) => {
                return {
                    id: s,
                    name: s
                }
            })
            setValue('weeklyOffList', weeklyOffList);
        } 
    }

    const handleAddCompartment = () => {
        let lastField = compartmentStructure.length > 1 ? [compartmentStructure[compartmentStructure.length - 1]] : compartmentStructure;
        let newList = addCompartment(lastField, compartmentStructure.length)
        let fields = [...compartmentStructure, ...newList];
        dispatch({ type: '@@fleetTypeForm/SET_COMPARTMENT_STRUCTURE', payload: fields })
    } 
    
    const addCompartment = (lastField:any[], length: number) => {
        let newList = lastField.map((field: any) => {
            let keys = Object.keys(field);
            let newField = {
              compartmentId: field.compartmentId ? field.compartmentId === lastField[0].compartmentId ? null : field.compartmentId : null,
              [`compartmentName-${length}`]: { ...field[keys[1]], id: `compartmentName-${length}`, fieldName: `compartmentName-${length}`, labelKey: `compartmentName-${length}`, permission: true, required: true },
              [`noOfUnits-${length}`]: { ...field[keys[2]], id: `noOfUnits-${length}`, fieldName: `noOfUnits-${length}`, labelKey: `noOfUnits-${length}`, permission: true },
            };
            return newField;
          });
          return newList;
    }
    const handleRemoveCompartment = (deletedField: IMongoField) => {
        if(isEditMode){
            setIsCompartmentStructuretouched(true)
        }
        const updatedList = deepCopy(compartmentStructure)
        updatedList.forEach((opItem: {}) => {
            if (Object.keys(opItem)[Object.keys(opItem).length - 2] === Object.keys(deletedField)[Object.keys(deletedField).length - 2]) {
            Object.keys(opItem).forEach(field => {
                if (opItem[field] && opItem[field].label) {
                    opItem[field].permission = false
                    clearErrors(opItem[field].fieldName)
                }
            })
            }
        });
        dispatch({ type: '@@fleetTypeForm/SET_COMPARTMENT_STRUCTURE', payload: updatedList })
    }

    return (
        <FormWrapper formName="FleetType">
            <div id='toast-inject-here'></div>

            <Box py='15px'>
                <BreadCrumb options={breadCrumbOptions} onClick={handleBreadCrumbClick} />
            </Box>
            <Box bgColor='white'>
            <Card style={{ minHeight: '80vh', position: 'relative' }}>
                
            {isLoading && <div ref={loaderRef}><FormLoader /></div>}
            <div style={isLoading ? { display: 'none' } : {}}>
                        {sectionKeys.length > 0 && sectionKeys.map((sectionName) =>
                            <div key={sectionName}>
                                {Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) &&
                                    <SectionHeaderContainer>
                                        <SectionHeader headerTitle={dynamicLabels?.[sectionName] || sectionName} />
                                    </SectionHeaderContainer>}

                                <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                                    {Object.keys(structure[sectionName]).map(fieldName => {
                                        const meta = structure[sectionName][fieldName]
                                        meta.multipleFiles = true
                                        const { permission
                                        } = meta

                                        if (!permission) {
                                            return undefined
                                        }
                                        if(meta.id === 'addCompartmentDetails'){
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={12} md={12} style={{paddingTop: '15px',paddingBottom:'15px'}} className='input-grid grid-item'>
                                                    <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                </Grid>
                                            )
                                        }
                                        if(meta.id === 'compartmentName' && watchAddCompartmentDetails === 'Y'){
                                            return(
                                                <>
                                                {compartmentStructure && compartmentStructure.filter(item =>
                                                  item[Object.keys(item)[Object.keys(item).length - 1]]?.permission
                                                ).map((opField: any, index: number) => {
                                                    return (
                                                    <>
                                                        <Grid container spacing='10px'>
                                                            {Object.keys(opField).map((fieldName) => {
                                                                if(fieldName !== 'compartmentId') {
                                                                    const meta = opField[fieldName];
                                                                    meta.multipleFiles = false;
                                                                    const { permission } = meta;
                                                                    if (!permission) {
                                                                        return undefined;
                                                                    }
                                                                    if(meta.fieldName.includes('noOfUnits')){
                                                                        meta.removeDecimal = true
                                                                    }
                                                                        return (
                                                                        <>
                                                                            <Grid item key={fieldName} xs={12} sm={2} md={2} className='grid-item operation-fields'>
                                                                                <FormField
                                                                                    name={fieldName}
                                                                                    meta={meta}
                                                                                    formInstance={formInstance}
                                                                                />
                                                                            </Grid>
                                                                        </>
                                                                        );
                                                                } else {
                                                                return;
                                                                }
                                                            })}
                                                            <Grid item xs={1} sm={1} md={1} lg={1} className='btn-grid' style={{marginTop: '1%'}}>
                                                                <FormActionButtonWrapper>
                                                                {(index > 0 || (index == 0 && compartmentStructure.filter(item =>
                                                                    item[Object.keys(item)[Object.keys(item).length - 1]]?.permission).length > 1)) && (
                                                                    <FormActionButton iconVariant='icomoon-close' iconSize={10} circle className='deletePromotion'
                                                                        onClick={() => handleRemoveCompartment(opField)}/>
                                                                )}
                                                                {(index === compartmentStructure.length - 1 || index === compartmentStructure.filter(item =>
                                                                    item[Object.keys(item)[Object.keys(item).length - 1]]?.permission
                                                                ).length - 1) && (
                                                                    <FormActionButton iconVariant='icomoon-add' iconSize={10} circle primary
                                                                        onClick={() => handleAddCompartment()}/>
                                                                )}
                                                                </FormActionButtonWrapper>
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                    );
                                                })}
                                            </>
                                            )
                                        }
                                        else if(meta.id !== 'addCompartmentDetails' && meta.id !== 'compartmentName' && meta.id !== 'noOfUnits'){
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item fleetTypeForm'>
                                                    <FormField
                                                        name={fieldName}
                                                        meta={meta}
                                                        formInstance={formInstance} />
                                                </Grid>
                                            )
                                        }
                                    })}
                                </Grid>
                            </div>
                        )}
                    </div>

                    <Box horizontalSpacing='15px' display='flex' mt='30px'>
                        <IconButton id='addFleetForm-actionbar-save' iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={handleSubmit(onSubmit)} primary>{isEditMode ? dynamicLabels.update : dynamicLabels.save}</IconButton>
                        <IconButton id='addFleetForm-actionbar-cancel' iconVariant='icomoon-close' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={() => {
                            gaOnCancel()
                            handleBreadCrumbClick('fleettype')
                        }}>{dynamicLabels.cancel}</IconButton>
                    </Box>

            </Card>
            </Box>
        </FormWrapper>
    )
}

export default withReactOptimized(FleetTypeForm)