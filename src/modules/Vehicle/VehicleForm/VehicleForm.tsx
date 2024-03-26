import React, { useEffect, Dispatch, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BreadCrumb,
  Box,
  Card,
  Grid,
  SectionHeader,
  IconButton,
  useToast,
} from "ui-library";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import {
  hybridRouteTo,
  routeContains,
  getQueryParams,
} from "../../../utils/hybridRouting";
import { useDispatch } from "react-redux";
import { IVehicleData, IDropdown } from "./VehicleForm.model";
import { IVehicleFormActions } from "./VehicleForm.actions";

import FormField from "../../../utils/components/Form/FormField";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { ILogiAPIResponse } from "../../../utils/api.interfaces";
import {
  generateVehicleFormData,
  useGoogleAnalytics,
  useBreadCrumbs,
} from "./VehicleForm.utils";
import moment from "moment-timezone";
import {
  SectionHeaderContainer,
  FormWrapper,
} from "../../../utils/components/Form/Form.styles";
import useClientProperties from "../../common/ClientProperties/useClientProperties";
import { tGlobalToastActions } from "../../common/GlobalToasts/globalToast.reducer";
import { useCustomFieldsForm } from "../../../utils/components/Form/useCustomFieldsForm";
import FormLoader from "../../../utils/components/FormLoader";
import { withReactOptimized } from "../../../utils/components/withReact";
import { getBaseCurrency } from "../../../utils/core";
import capacityConversion from "../VehicleListView/utils/capacityConversion";
import { FormActionButtonWrapper, FormActionButton } from "./VehicleForm.styled";
import { IMongoField } from "../../../utils/mongo/interfaces";
import { deepCopy } from "../../../utils/helper";

const currencySymbol = "cur_symbol_" + getBaseCurrency();

const VehicleForm = () => {
  const toast = useToast();

  const dynamicLabels = useDynamicLabels(
    `${DYNAMIC_LABELS_MAPPING.vehicle},${currencySymbol},dist_symbol_MILE,dist_symbol_KM`
  );
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {},
  });
  const { handleSubmit, reset, setValue, watch, unregister, clearErrors } = formInstance;
  const { getCustomFieldsFormData, generateCustomFieldsFormData } =
    useCustomFieldsForm();
  const { gaOnSubmit, gaOnCancel } = useGoogleAnalytics();
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  const { breadCrumbOptions, handleBreadCrumbClick } =
    useBreadCrumbs(formInstance);
  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IVehicleFormActions>>();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();
  const structure = useTypedSelector((state) => state.vehicle.form.structure);
  const isEditMode = useTypedSelector((state) => state.vehicle.form.isEditMode);
  let onLoad:boolean = isEditMode ? true : false;
  const isStructureLoading = useTypedSelector(
    (state) => state.vehicle.form.loading
  );
  const resetData = useTypedSelector((state) => state.vehicle.form.resetData);
  const vehicleData = useTypedSelector(
    (state) => state.vehicle.form.vehicleData
  );
  const fleetType = useTypedSelector((state) => state.vehicle.form.fleetType);
  const systemMetric = useTypedSelector(
    (state) => state.vehicle.form.systemMetric
  );
  const clientMetric = useTypedSelector(
    (state) => state.vehicle.form.clientMetric
  );
  const compartmentMasterList = useTypedSelector(state => state.vehicle.form.compartmentMasterList)
  const sectionKeys = Object.keys(structure);
  /** Internal State */
  const [isVehicleDataLoading, setIsDriverDataLoading] =
    useState<boolean>(false);
  const isLoading = React.useMemo(
    () => isStructureLoading || isVehicleDataLoading,
    [isStructureLoading, isVehicleDataLoading]
  );
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const watchFleet = watch("fleetType");
  const clientBranchId = watch("clientBranchId");
  const deviceIds = watch("deviceIds");
  const compartmentStructure = useTypedSelector(state => state.vehicle.form.compartmentStructure)
  const watchAddCompartmentDetails = watch('addCompartmentDetails', '')
  const [istouched, setistouched] = useState<boolean>(true)
  const [fleetTypeMinSpeed,setFleetTypeMinSpeed] = useState<number>()
  const [fleetTypeMaxSpeed,setFleetTypeMaxSpeed] = useState<number>()
  const [isCompartmentStructuretouched, setIsCompartmentStructuretouched] = useState<boolean>(false)
  const [disableAddRemoveButtons, setDisableAddRemoveButtons] =  useState<boolean>(false)
  const compartmentBaseStructure = useTypedSelector(state => state.vehicle.form.compartmentBaseStructure)
  const trackerMasterList = useTypedSelector(state => state.vehicle.form.trackerMasterList)
  const pageName = "update_vehicle"

  useEffect(() => {
    if (watchFleet?.make) {
      handleChange(watchFleet); 
    } else {
      if (watchFleet?.id) {
        let obj = fleetType?.find((f: any) => f.id === watchFleet?.id);
        handleChange(obj);
      } else {
        handleChange(undefined);
      }
    }
  }, [watchFleet, watchFleet?.id]);

  useEffect(() => {
    if(isEditMode && clientBranchId?.id == vehicleData?.clientBranchId){
      handleSetTrackerData(trackerMasterList, vehicleData)
    }
    else if(deviceIds && deviceIds.length && !onLoad){
      setValue("deviceIds",[])
      toast.add(dynamicLabels.delinkTrackers || 'Change of branch delinks all the trackers associated with the vehicle', "warning", false);
    }
  }, [clientBranchId ,clientBranchId?.id]);

  useEffect(() => {
    if (watchAddCompartmentDetails && watchAddCompartmentDetails === 'N') {
        compartmentStructure.map((comp: any) => {
            let keys = Object.keys(comp);
            clearErrors(keys)
      })
    } else if(watchAddCompartmentDetails && watchAddCompartmentDetails === 'Y'){
      dispatch({ type: '@@vehicleForm/FETCH_COMPARTMENT_MASTER_DATA' })
    }
  },[watchAddCompartmentDetails])


  useEffect(() => {
    if (vehicleData && compartmentStructure && compartmentStructure.length && istouched && structure?.['fleet details']?.['addCompartmentDetails']?.permission) {
        if(vehicleData.compartmentList && vehicleData.compartmentList.length){
          setValue("addCompartmentDetails", 'Y');
          if(vehicleData.fleetTypeId){
            setDisableAddRemoveButtons(true)
          }
            const compartmentArray: any = []
            compartmentArray.push(compartmentStructure[0])
            vehicleData.compartmentList.forEach((comp: any, index) => {
                let keys = Object.keys(compartmentStructure[0]);
                    if(index >= 1)
                    {
                        let newField = {
                            compartmentId: null,
                            [`compartmentName-${index}`]: { ...compartmentStructure[0][keys[1]], id: `compartmentName-${index}`, fieldName: `compartmentName-${index}`, labelKey: `compartmentName-${index}`, permission: true, required: true},
                            [`noOfUnits-${index}`]: { ...compartmentStructure[0][keys[2]], id: `noOfUnits-${index}`, fieldName: `noOfUnits-${index}`, labelKey: `noOfUnits-${index}`, permission: true},
                          };
                        compartmentArray.push(newField)
                    }
                    setValue('compartmentName'+ (index ? '-'+index : ''), {title:comp['compartmentName'] ,label:comp['compartmentName'], name: comp['compartmentName'], value: comp['compartmentId'], id:comp['compartmentId'] });
                    setValue('noOfUnits'+ (index ? '-'+index : ''), comp.noOfUnits);
              });
              setistouched(false)
              dispatch({ type: '@@vehicleForm/SET_COMPARTMENT_STRUCTURE', payload: compartmentArray })
        }
    }
}, [vehicleData, compartmentStructure])

const handleSetTrackerData = (trackerMasterList, vehicleData) => {
  if(trackerMasterList && trackerMasterList.length && vehicleData?.deviceIds){
    const selectedTrackerArray = vehicleData?.deviceIds.map((id: string) => {
      return trackerMasterList.find((tracker) => tracker.id == id)
    });
    setValue('deviceIds', selectedTrackerArray)
  }
}
useEffect(() => {
  handleSetTrackerData(trackerMasterList, vehicleData);
},[trackerMasterList, vehicleData])

  console.log(watchFleet?.id, watchFleet);
  /** Utils */
  const fetchVehicleData = async (vehicleId: string | number) => {
    setIsDriverDataLoading(true);
    try {
      const {
        data: { data, status },
      } = await axios.get<ILogiAPIResponse<IVehicleData>>(
        `${apiMappings.vehicle.form.getVehicle}/${vehicleId}?path_param_url=1729`
      );
      if (status === 200) {
        if(data?.deviceIds && data.deviceIds.length){
          dispatch({ type: '@@vehicleForm/FETCH_TRACKER_MASTER_DATA', payload: {vehicleId: vehicleId,clientBranchId: data.clientBranchId}})
        }
        
        //handle minSpeed in case the value is 0
        if(data?.minSpeed !== undefined){
          data["minSpeed"] = parseFloat(data?.minSpeed).toString();
        }
        if (data?.capacityInVolume) {
          const val = capacityConversion(
            data.capacityInVolume,
            "GET",
            clientMetric?.volume?.conversionFactor
          );
          data["capacityInVolume"] = parseFloat(val.toFixed(2));
        }

        if (data?.capacityInWeight) {
          const val = capacityConversion(
            data.capacityInWeight,
            "GET",
            clientMetric?.weight?.conversionFactor
          );
          data["capacityInWeight"] = parseFloat(val.toFixed(2));
        }

        if (data?.minCapacityUtilizationInVolume) {
          const val = capacityConversion(
            data.minCapacityUtilizationInVolume,
            "GET",
            clientMetric?.volume?.conversionFactor
          );
          data["minCapacityUtilizationInVolume"] = val.toFixed(2);
        }

        if (data?.minCapacityUtilizationInWeight) {
          const val = capacityConversion(
            data.minCapacityUtilizationInWeight,
            "GET",
            clientMetric?.weight?.conversionFactor
          );
          data["minCapacityUtilizationInWeight"] = val.toFixed(2);
        }

        dispatch({ type: "@@vehicleForm/SET_VEHICLE_DATA", payload: data });
        const customFieldsFormData = getCustomFieldsFormData(
          data.customFieldsEntity
        );

        const _resetData = {
          ...resetData,
          ...generateVehicleFormData(data,clientMetric),
          ...customFieldsFormData,
        };
        reset({ ..._resetData });
        dispatch({
          type: "@@vehicleForm/SET_FORM_RESET_DATA",
          payload: _resetData,
        });
        setIsDriverDataLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsDriverDataLoading(false);
      toast.add(
        error?.response?.data?.message || dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    }
  };
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

  /** Watchers */
  useEffect(() => {
    if (!sectionKeys.length) {
      dispatch({ type: "@@vehicleForm/FETCH_STRUCTURE" });
    }

    if (
      Object.keys(clientMetric).length > 0 &&
      clientProperties?.TIMEZONE &&
      !vehicleData
    ) {
      const { vid } = getQueryParams();

      if (routeContains("updatevehicle") && vid) {
        dispatch({ type: "@@vehicleForm/SET_EDIT_MODE", payload: true });
        fetchVehicleData(vid);
      } else {
        reset({ ...resetData });
      }
    }
  }, [clientProperties, clientMetric]);

  useEffect(() => {
    dispatch({ type: "@@vehicleForm/INITIAL_DROPDOWN_LOAD" });
    return () => {
      sectionKeys.forEach((key) => {
        Object.keys(structure[key]).forEach((fieldName) => {
          unregister(fieldName);
        });
      });
      dispatch({ type: "@@vehicleForm/RESET_INITIAL_STATE" });
    };
  }, []);

  useEffect(() => {
    if (vehicleData?.fleetTypeId && fleetType) {
      let obj = fleetType.find((f: any) => f.id === vehicleData?.fleetTypeId);
      handleChange(obj);
      // setValue('minCapacityUtilizationInUnits', obj?.minCapacityUtilizationInUnits);
      // setValue('minCapacityUtilizationInVolume', obj?.minCapacityUtilizationInVolume);
      // setValue('minCapacityUtilizationInWeight', obj?.minCapacityUtilizationInWeight);

      // setValue('capacityInUnits', obj?.capacityInUnits);
      // setValue('capacityInWeight', obj?.capacityInWeight);
      // setValue('capacityInVolume', obj?.capacityInVolume);

      // setValue('vehicleMake', obj?.make);
      // let skillsSets = obj?.skillSet?.map((s: any) => {
      //     return {
      //         id: s,
      //         name: s
      //     }
      // })
      // setValue('skillSet', skillsSets)
    }
  }, [vehicleData?.fleetTypeId, fleetType]);

  const getSpeedDetails = (type:string , fleetTypeId: number, speed :string) => {
    const value = type === "maxSpeed" ? fleetTypeMaxSpeed : fleetTypeMinSpeed 
    if(fleetTypeId && value){
      return capacityConversion(parseFloat(value), 'POST', clientMetric?.speed?.conversionFactor).toString() 
    }
    return speed? capacityConversion(parseFloat(speed), 'POST', clientMetric?.speed?.conversionFactor).toString() : null

  }
  /** Callbacks */
  const onSubmit = async (data: any) => {
    gaOnSubmit();

    if (!formInstance.formState.isDirty && !isCompartmentStructuretouched) {
      hybridRouteTo("vehicle/");
      return;
    }

    if(data?.minTemperature && data?.maxTemperature) {
      if(parseFloat(data?.minTemperature) >= parseFloat(data?.maxTemperature)){
          toast.add(dynamicLabels?.['invalid.vehicle.mintemperature.maxtemperature'], 'warning', false);
          return
      }
    }
    if(data?.minSpeed && data?.maxSpeed) {
      if(parseFloat(data?.minSpeed) >= parseFloat(data?.maxSpeed)){
          toast.add(dynamicLabels?.['invalid.vehicle.minspeed.maxspeed'], 'warning', false);
          return
      }
    }
   
    const {
      vehicleType,
      clientBranchId,
      registrationCopy,
      pucCopy,
      insuranceCopy,
      insuranceValidity,
      licenseType,
      pucValidity,
      vehiclePurchaseDate,
      vehiclePermit,
      ownership,
      weeklyOffList,
      fleetType,
      waitingCost,
      ownerName,
      rentStartDate,
      rentEndDate,
      // skillSet,
      deliveryType,
      shiftStartTime,
      shiftEndTime,
      breakStartTimeWindow,
      breakEndTimeWindow,
      movementType,
      typeOfBody,
      deviceId,
      capacityInVolume,
      capacityInWeight,
      minCapacityUtilizationInVolume,
      minCapacityUtilizationInWeight,
      deviceIds,
      minSpeed,
      maxSpeed
    } = data;

    const customFieldsData = generateCustomFieldsFormData(structure, data);
    let licenseTypes;
    if (
      licenseType &&
      typeof licenseType === "string" &&
      licenseType.charAt(0) != "{"
    ) {
      licenseTypes = licenseType.split(",").length > 1 ? "Both" : licenseType;
    } else if (licenseType && typeof licenseType === "object") {
      licenseTypes = JSON.stringify(licenseType);
    } else {
      licenseTypes = licenseType;
    }

    delete data["customFieldsEntity"];
    if (!deviceId) {
      delete data["deviceId"];
    }
    if(data?.vehicleId && data?.referenceId){
      delete data["vehicleId"];
      delete data["referenceId"];
    }
    const payload = {
      ...data,
      previousVehicleNumber: vehicleData?.vehicleNumber,
      clientBranchId: clientBranchId?.id,
      vehicleType: vehicleType?.clientRefMasterCd,
      registrationCopy: registrationCopy?.newFiles?.[0]?.data,
      pucCopy: pucCopy?.newFiles?.[0]?.data,
      insuranceCopy: insuranceCopy?.newFiles?.[0]?.data,
      licenseTypes,
      fleetTypeId: fleetType?.id,
      fleetType: fleetType?.make,
      insuranceValidity:
        insuranceValidity && moment(insuranceValidity).format("DD-MMM-YYYY"),
      pucValidity: pucValidity && moment(pucValidity).format("DD-MMM-YYYY"),
      vehiclePurchaseDate:
        vehiclePurchaseDate &&
        moment(vehiclePurchaseDate).format("DD-MMM-YYYY"),
      vehiclePermit: vehiclePermit
        ? vehiclePermit.map((d: any) => d.name).join(",")
        : [],
      ownership: ownership?.id,
      ownerName: ownerName,
      rentStartDate:
        rentStartDate && moment(rentStartDate).format("DD-MMM-YYYY"),
      rentEndDate: rentEndDate && moment(rentEndDate).format("DD-MMM-YYYY"),
      deliveryType: deliveryType
        ? deliveryType.map((d: any) => d.name).join(",")
        : "",
      // skillSet: skillSet ? skillSet.map((d: any) => d.name).join(',') : '',
      weeklyOffList: weeklyOffList
        ? weeklyOffList.map((d: any) => d.name).join(",")
        : "",
      waitingTimeCost: waitingCost,
      shiftStartTime: shiftStartTime
        ? moment(shiftStartTime).format("HH:mm:ss")
        : "",
      shiftEndTime: shiftEndTime ? moment(shiftEndTime).format("HH:mm:ss") : "",
      breakStartTimeWindow: breakStartTimeWindow
        ? moment(breakStartTimeWindow).format("HH:mm:ss")
        : "",
      breakEndTimeWindow: breakEndTimeWindow
        ? moment(breakEndTimeWindow).format("HH:mm:ss")
        : "",
      movementType: movementType?.id,
      typeOfBody: typeOfBody?.id,
      deviceId: deviceId?.id,
      capacityInVolume: capacityConversion(
        parseFloat(capacityInVolume),
        "POST",
        clientMetric?.volume?.conversionFactor
      )?capacityConversion(
        parseFloat(capacityInVolume),
        "POST",
        clientMetric?.volume?.conversionFactor
      ).toFixed(4) : "",
      capacityInWeight: capacityConversion(
        parseFloat(capacityInWeight),
        "POST",
        clientMetric?.weight?.conversionFactor
      )?capacityConversion(
        parseFloat(capacityInWeight),
        "POST",
        clientMetric?.weight?.conversionFactor
      ).toFixed(4) : "",
      minCapacityUtilizationInVolume: capacityConversion(
        parseFloat(minCapacityUtilizationInVolume),
        "POST",
        clientMetric?.volume?.conversionFactor
      ),
      minCapacityUtilizationInWeight: capacityConversion(
        parseFloat(minCapacityUtilizationInWeight),
        "POST",
        clientMetric?.weight?.conversionFactor
      ),
      maxSpeed: getSpeedDetails("maxSpeed",fleetType?.id,maxSpeed),
      minSpeed: getSpeedDetails("minSpeed",fleetType?.id,minSpeed),
      deviceIds: deviceIds && deviceIds.length > 0 ? deviceIds.map((device: IDropdown) => device.deviceId) : [],
      ...customFieldsData,
    };
    if(watchAddCompartmentDetails === 'Y' && formInstance.getValues("fleetType") === undefined && structure?.['fleet details']?.['addCompartmentDetails']?.permission){
      const compartmentList = compartmentStructure.filter(item =>
          item[Object.keys(item)[Object.keys(item).length - 1]]?.permission
        ).map((comp: any) => {
              let keys = Object.keys(comp);
              delete payload[keys[1]]
              delete payload[keys[2]]
              return {
                      ['compartmentId']: watch(String([keys[1]]), '')?.id,
                      ['noOfUnits']: parseInt(watch(String([keys[2]]), ''))
                      }
                  })
      const transformedCompartmentArray = groupCompartmentsById(compartmentList)
      const capacitiesInvalid = formInstance.getValues("fleetType") !== undefined ? false : validateCapacities(transformedCompartmentArray, data)
      if(capacitiesInvalid){
          return;
      }
      payload['compartmentList'] =  JSON.stringify(transformedCompartmentArray);
    }
    else if(watchAddCompartmentDetails === 'Y' && formInstance.getValues("fleetType") !== undefined){
      compartmentStructure.map((comp: any) => {
            let keys = Object.keys(comp);
            delete payload[keys[1]]
            delete payload[keys[2]]
      })
      payload['compartmentList'] = "[]"}
    else{
        payload['compartmentList'] = "[]"
    }
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key] || "");
    });
    if (isEditMode) {
      var {vid} = getQueryParams()
    }
    dispatch({ type: "@@vehicleForm/SET_LOADING", payload: true });
    try {
      const contructURL = isEditMode
        ? apiMappings.vehicle.form.update + `/${vid}`
        : apiMappings.vehicle.form.create;

      const { data: response } = isEditMode
        ? await axios.put(contructURL, formData, {
            params: {
              path_param_url: 1729,
            },

            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await axios.post(contructURL, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

      if (!response.hasError) {
        dispatch({ type: "@@vehicleForm/SET_LOADING", payload: false });
        toastDispatch({
          type: "@@globalToast/add",
          payload: {
            message: response.message,
            icon: "check-round",
          },
        });
        hybridRouteTo("vehicle/");
      }
    } catch (error) {
      dispatch({ type: "@@vehicleForm/SET_LOADING", payload: false });
      if (error?.response?.data?.status === 428) {
        return;
      }

      toast.add(
        error?.response?.data?.error?.message?.[0] ||
          error?.response?.data?.message ||
          dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    }
  };

  console.log(formInstance.formState.isDirty);
 
  const handleChange = (e: any) => {
    let deepCopyCompartmentStructure = deepCopy(compartmentStructure)
    let deepCopyCompartmentBaseStructure = deepCopy(compartmentBaseStructure)
    
    if (e) {
      const minSpeed = capacityConversion(e?.minSpeed,"GET",clientMetric?.speed?.conversionFactor);
      const maxSpeed = capacityConversion(e?.maxSpeed,"GET",clientMetric?.speed?.conversionFactor);
      setFleetTypeMinSpeed(minSpeed);
      setFleetTypeMaxSpeed(maxSpeed);
      setValue("minSpeed",parseFloat(minSpeed.toFixed(2)));
      setValue("maxSpeed",parseFloat(maxSpeed.toFixed(2)));
      setValue("capacityInUnits", e?.capacityInUnits);
      setValue("capacityInWeight", e?.capacityInWeight);
      setValue("capacityInVolume", e?.capacityInVolume);
      setValue(
        "minCapacityUtilizationInUnits",
        e?.minCapacityUtilizationInUnits
      );
      setValue(
        "minCapacityUtilizationInVolume",
        e?.minCapacityUtilizationInVolume
      );
      setValue(
        "minCapacityUtilizationInWeight",
        e?.minCapacityUtilizationInWeight
      );
      setValue("vehicleMake", e?.make);
      setValue("fixedCost", e?.fixedCost);
      setValue("variableCost", e?.variableCost);
      setValue("transportTimeCost", e?.transportTimeCost);
      setValue("waitingTimeCost", e?.waitingTimeCost);
      setValue("minTemperature",e?.minTemperature);
      setValue("maxTemperature",e?.maxTemperature);
      
      setValue(
        "shiftEndTime",
        e.shiftEndTime ? new Date(moment(e.shiftEndTime, "HH:mm")) : ""
      );
      setValue(
        "shiftStartTime",
        e.shiftStartTime ? new Date(moment(e.shiftStartTime, "HH:mm")) : ""
      );
      setValue("breakDurationInMins", e?.breakDurationInMins);
      setValue(
        "breakEndTimeWindow",
        e.breakEndTimeWindow ? moment(e.breakEndTimeWindow, "HH:mm") : ""
      );
      setValue(
        "breakStartTimeWindow",
        e.breakStartTimeWindow ? moment(e.breakStartTimeWindow, "HH:mm") : ""
      ); 

      let skillsSets = e?.skillSet?.map((s: any) => {
        return {
          id: s,
          name: s,
        };
      });
      // setValue('skillSet', skillsSets)
      setValue("deliveryType", skillsSets);
      if (e && compartmentStructure && compartmentStructure.length && structure?.['fleet details']?.['addCompartmentDetails']?.permission) {
        if(e.compartmentList && e.compartmentList.length){
          setValue('addCompartmentDetails', 'Y')
            const comArr: any = []
            comArr.push(compartmentStructure[0])
            e.compartmentList.forEach((manager: any, index) => {
                let keys = Object.keys(compartmentStructure[0]);
                    if(index >= 1)
                    {
                        let newField = {
                            compartmentId: null,
                            [`compartmentName-${index}`]: { ...compartmentStructure[0][keys[1]], id: `compartmentName-${index}`, fieldName: `compartmentName-${index}`, labelKey: `compartmentName-${index}`, permission: true, required: true},
                            [`noOfUnits-${index}`]: { ...compartmentStructure[0][keys[2]], id: `noOfUnits-${index}`, fieldName: `noOfUnits-${index}`, labelKey: `noOfUnits-${index}`, permission: true},
                          };
                        comArr.push(newField)
                    }
                    setValue('compartmentName'+ (index ? '-'+index : ''), {title:manager['compartmentName'] ,label:manager['compartmentName'], name: manager['compartmentName'], value: manager['compartmentId'], id:manager['compartmentId'] });
                    setValue('noOfUnits'+ (index ? '-'+index : ''), manager.noOfUnits);
              });
              dispatch({ type: '@@vehicleForm/SET_COMPARTMENT_STRUCTURE', payload: comArr })
              setDisableAddRemoveButtons(true)
              
        }
        else {
          setValue('addCompartmentDetails', 'N')
          dispatch({ type: '@@vehicleForm/SET_COMPARTMENT_STRUCTURE', payload: compartmentBaseStructure })
        }
    }
    } else {
      const zeroTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        0,
        0,
        0,
        0
      );

      setValue("capacityInUnits", undefined);
      setValue("capacityInWeight", undefined);
      setValue("capacityInVolume", undefined);
      setValue("minCapacityUtilizationInUnits", undefined);
      setValue("minCapacityUtilizationInVolume", undefined);
      setValue("minCapacityUtilizationInWeight", undefined);
      setValue("minTemperature",undefined);
      setValue("maxTemperature",undefined);
      setValue("minSpeed",undefined);
      setValue("maxSpeed",undefined);
      setValue("vehicleMake", undefined);
      setValue("fixedCost", undefined);
      setValue("variableCost", undefined);
      setValue("transportTimeCost", undefined);
      setValue("waitingTimeCost", undefined);
      setValue("shiftEndTime", zeroTime);
      setValue("shiftStartTime", zeroTime);
      setValue("breakDurationInMins", 0);
      setValue("breakEndTimeWindow", zeroTime);
      setValue("breakStartTimeWindow", zeroTime);
      setValue("deliveryType", undefined);
      deepCopyCompartmentStructure?.map((comp: any) => {
        let keys = Object.keys(comp);
        setValue(keys[1], null);
        setValue(keys[2], null);
        clearErrors(keys[1])
        clearErrors(keys[2])
      })
      setValue("addCompartmentDetails", 'N');
      setDisableAddRemoveButtons(false)
      dispatch({ type: '@@vehicleForm/SET_COMPARTMENT_STRUCTURE', payload: deepCopyCompartmentBaseStructure })
    }
  };
  const handleAddCompartment = () => {
    let lastField = compartmentStructure.length > 1 ? [compartmentStructure[compartmentStructure.length - 1]] : compartmentStructure;
    let newList = addCompartment(lastField, compartmentStructure.length)
    let fields = [...compartmentStructure, ...newList];
    dispatch({ type: '@@vehicleForm/SET_COMPARTMENT_STRUCTURE', payload: fields })
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
    dispatch({ type: '@@vehicleForm/SET_COMPARTMENT_STRUCTURE', payload: updatedList })
}
  return (
    <FormWrapper formName="Vehicle">
      <div id="toast-inject-here"></div>

      <Box py="15px">
        <BreadCrumb
          options={breadCrumbOptions}
          onClick={handleBreadCrumbClick}
        />
      </Box>
      <Box bgColor="white">
        <Card style={{ minHeight: "80vh", position: "relative" }}>
          {/* {isLoading && <Loader center fadeBackground />} */}
          {isLoading && (
            <div ref={loaderRef}>
              <FormLoader />
            </div>
          )}

          <div style={isLoading ? { display: "none" } : {}}>
            {sectionKeys.length > 0 &&
              sectionKeys.map((sectionName) => (
                <div key={sectionName}>
                  {Object.keys(structure[sectionName]).some(
                    (fieldKey) => structure[sectionName][fieldKey]?.permission
                  ) && (
                    <SectionHeaderContainer>
                      <SectionHeader
                        headerTitle={
                          dynamicLabels?.[sectionName] || sectionName
                        }
                      />
                    </SectionHeaderContainer>
                  )}

                  <Grid
                    container
                    spacing="10px"
                    style={{ marginBottom: "15px" }}
                  >
                    {Object.keys(structure[sectionName]).map((fieldName) => {
                      const meta = structure[sectionName][fieldName];
                      const { vid } = getQueryParams();
                      if (
                        vid !== undefined &&
                        formInstance.getValues("fleetType") !== undefined &&
                        (meta.id === "shiftStartTime" ||
                          meta.id === "shiftEndTime")
                      ) {
                        meta.ShiftStartEndTimeVisiblity = true;
                      } else {
                        meta.ShiftStartEndTimeVisiblity = false;
                      }
                      meta.multipleFiles = true;
                      const {
                        permission,
                        // fieldType,
                        // childNodes
                      } = meta;


                      const fleetTypeValue = formInstance.getValues("fleetType");
                      const isMinMaxSpeedOrTemperature = ["minSpeed", "maxSpeed", "minTemperature", "maxTemperature"].includes(meta.id);

                      if (fleetTypeValue === undefined) {
                        meta.disabled = false;
                        if (isMinMaxSpeedOrTemperature) {
                          meta.editable = true;
                        }
                      } else {
                        meta.disabled = true;
                        if (isMinMaxSpeedOrTemperature) {
                          meta.editable = false;
                        }
                      }
                    
                      if (fieldName === "maxDistance") {
                        if (
                          systemMetric?.propertyValue === "MILE" &&
                          !meta["label"].includes("(in Ml)")
                        ) {
                          meta["label"] = `${meta["label"]} (in Ml)`;
                        } else if (
                          systemMetric?.propertyValue === "KM" &&
                          !meta["label"].includes("(in Km)")
                        ) {
                          meta["label"] = `${meta["label"]} (in Km)`;
                        }
                      }

                      if (
                        localStorage.userAccessInfo &&
                        JSON.parse(localStorage.userAccessInfo).modelType ===
                          "LH" &&
                        fieldName === "capacity"
                      ) {
                        // meta.validation = undefined
                        // if (meta.childNodes) {
                        //     Object.values(meta.childNodes)?.forEach((child: any) =>
                        //         child.validation = undefined
                        //     )
                        // }
                      }
                      if (
                        localStorage.userAccessInfo &&
                        JSON.parse(localStorage.userAccessInfo).modelType !==
                          "LH" &&
                        fieldName === "vehicleMake" &&
                        vehicleData &&
                        vehicleData.status !== "Available"
                      ) {
                        meta.editable = false;
                      }
                      if (
                        localStorage.userAccessInfo &&
                        JSON.parse(localStorage.userAccessInfo).modelType !==
                          "LH" &&
                        fieldName === "capacity" &&
                        vehicleData &&
                        vehicleData.status !== "Available"
                      ) {
                        meta.validation = undefined;
                        meta.disabled = true;
                      }

                      if (!!vehicleData && fieldName === "movementType") {
                        meta.editable = false;
                      }
                      if (!permission) {
                        return undefined;
                      }
                      let activatedScroll = {};
                      if (
                        meta.fieldType === "select" ||
                        meta.fieldType === "dropdown"
                      ) {
                        activatedScroll = {
                          scrollToRef: true,
                        };
                      }
                      onLoad = false
                      if(meta.id === 'addCompartmentDetails'){
                        meta.editable = watchFleet?.id && formInstance.getValues("fleetType") !== undefined ? false : true
                        return (
                            <Grid item key={fieldName} xs={12} sm={12} md={12} style={{paddingTop: '15px',paddingBottom:'15px'}} className='input-grid grid-item'>
                                <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                            </Grid>
                        )
                    }
                    if(meta.id === 'deviceIds'){
                      const { vid } = getQueryParams();
                        meta.lookUpOptionParam = vid
                        meta.onLoad = onLoad
                        meta.matchParamLookup = meta.lookupType === 'getUnlinkedTrackers' ? true : false
                        meta.lookUpOptionParam = {
                          clientBranchId : clientBranchId?.id,
                          vehicleId: vid
                        }
                    }
                    if(meta.id === 'compartmentName' && watchAddCompartmentDetails === 'Y'){
                        return(
                            <>
                            {compartmentStructure && compartmentStructure.filter(item =>
                              item[Object.keys(item)[Object.keys(item).length - 1]]?.permission
                            ).map((opField: any, index: number) => {
                                return (
                                <>
                                    <Grid container spacing="10px">
                                        {Object.keys(opField).map((fieldName) => {
                                            if(fieldName !== 'compartmentId') {
                                                const meta = opField[fieldName];
                                                meta.multipleFiles = false;
                                                const { permission } = meta;
                                                if (!permission) {
                                                    return undefined;
                                                }
                                                if(formInstance.getValues("fleetType") === undefined){
                                                  meta.editable = true;
                                                }
                                                else {
                                                  meta.editable = false
                                                }
                                                if(meta.fieldName.includes('noOfUnits')){
                                                    meta.removeDecimal = true
                                                }
                                                    return (
                                                    <>
                                                        <Grid item key={fieldName} xs={12} sm={2} md={2} className='grid-item'>
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
                                                <FormActionButton disabled={disableAddRemoveButtons && formInstance.getValues("fleetType") !== undefined} iconVariant='icomoon-close' iconSize={10} circle className='deletePromotion'
                                                    onClick={() => handleRemoveCompartment(opField)}/>
                                            )}
                                            {(index === compartmentStructure.length - 1 || index === compartmentStructure.filter(item =>
                                                item[Object.keys(item)[Object.keys(item).length - 1]]?.permission
                                            ).length - 1) && (
                                                <FormActionButton disabled={disableAddRemoveButtons  && formInstance.getValues("fleetType") !== undefined} iconVariant='icomoon-add' iconSize={10} circle primary
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
                        <Grid
                          item
                          key={fieldName}
                          xs={12}
                          sm={6}
                          md={3}
                          className="grid-item vehicleForm"
                        >
                          <div style={{paddingBottom:`${fieldName === 'registrationCopy' || fieldName === 'insuranceCopy' || fieldName === 'pucCopy' ? "19px" : "0px"}`}}>
                          <FormField
                            name={fieldName}
                            meta={meta}
                            formInstance={formInstance}
                            {...activatedScroll}
                            />
                            </div>
                        </Grid>
                      );
                    }
                    })}
                  </Grid>
                </div>
              ))}
          </div>
          <Box horizontalSpacing="15px" display="flex" mt="30px">
            <IconButton
             id = {`vehicleForm--actionbar--${isEditMode ? 'update' : 'save'}`}
              iconVariant="icomoon-save"
              style={{ padding: "0px 15px" }}
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
              primary
            >
              {isEditMode ? dynamicLabels.update : dynamicLabels.save}
            </IconButton>
            <IconButton
            id = {`vehicleForm--actionbar--cancel`}
              iconVariant="icomoon-close"
              style={{ padding: "0px 15px" }}
              disabled={isLoading}
              onClick={() => {
                gaOnCancel();
                handleBreadCrumbClick("vehicle");
              }}
            >
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
        </Card>
      </Box>
    </FormWrapper>
  );
};

export default withReactOptimized(VehicleForm);
