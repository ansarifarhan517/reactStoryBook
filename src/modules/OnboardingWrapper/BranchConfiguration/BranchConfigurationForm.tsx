import React, { useEffect, Dispatch, useState, useRef } from 'react';
import { BranchConfigurationActions } from './BranchConfiguration.actions';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import FormLoader from '../../../utils/components/FormLoader';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { Box, IconButton, useToast } from 'ui-library';
import { IBranchConfigurationTreeDataSubBranchPayload, IBranchManagerStructure, ICreatePayload, IFormInputs, ILocalStorageEntries, IMangerDetails, IOperationTimings, IOperationTimingsStructure, ISelectedShiftDays, IShiftTimingsTouchStatus, IShiftTimingStructure, ISkillSet, IBranchConfigFormProps } from './BranchConfiguration.models';
import { IMongoFormStructure } from '../../../utils/mongo/interfaces';
import { deepCopy } from '../../../utils/helper';
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { preparePayload, useGoogleAnalytics, timeToStringWithoutUtc, check_time_overlap, convertShiftTimingStructure, convertOperationTimingStructure, convertBranchManagerStructure } from './utils';
import BranchConfigurationAddFormModals from "./SubComponents/AddBranchForm/BranchConfigurationAddFormModals";
import BranchConfigurationWatchers from "./SubComponents/BranchConfigurationWatchers";
import AddBranchFormFields from "./SubComponents/AddBranchForm/AddBranchFormFields";
import ServiceArea from "./SubComponents/AddBranchForm/ServiceArea";
import populateBranchData from "./Hooks/populateBranchData";
import useRemoveShiftTimings from "./Hooks/useRemoveShiftTimings";
import { useCustomFieldsForm } from '../../../utils/components/Form/useCustomFieldsForm';
import { addOperationsTiming, addShiftTiming } from './helper';
import useRemoveOperationsTimings from './Hooks/useRemoveOperationsTimings';
import usePopulateShiftTimingsStructure from './Hooks/usePopulateShiftTimingsStructure';
import useWatchShiftTimings from './Hooks/useWatchShiftTimings';
import useWatchOperationTimings from './Hooks/useWatchOperationTimings';
import useHandleRemoveBranchManager from './Hooks/useHandleRemoveBranchManager';
import useHandleAddBranchManager from './Hooks/useHandleAddBranchManager'
import { routeContains } from '../../../utils/hybridRouting';
import { BranchConfigurationFormContainer } from './BranchConfigurationStyledComponents';
import { ILogiAPIResponse } from '../../../utils/api.interfaces';
import { tSearchFieldAddressInfo } from '../../../utils/components/Map/interface';

const FALLBACK_CENTER = [37.09024, -95.71289100000001];

const BranchConfigurationForm = ({ closeAddBranchForm, onCancel, vendorData }: IBranchConfigFormProps) => {
  
  const { getCustomFieldsFormData, generateCustomFieldsFormDataAllSection } = useCustomFieldsForm();
  /* miscellaneous */
  const userAccessInfo: ILocalStorageEntries = JSON.parse(localStorage.getItem('userAccessInfo') || '{}');
  const toast = useToast();
  const _center = userAccessInfo?.['countryLatLng']?.split(',') || FALLBACK_CENTER;
  const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.branchConfiguration);
  const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
  const { handleSubmit, watch, setValue , getValues} = formInstance;
  const { gaOnSubmit, gaOnCancel } = useGoogleAnalytics();
  /* Local state Declarations*/
  const [position, setPosition] = useState<Array<number>>([_center[0], _center[1]]);
  const [currentCordinates, setCurrentCordinates] = useState<Array<number>>([_center[0], _center[1]])
  const [isOperationTimingsVisible, setOperationTimingsVisible] = useState<boolean>(false);
  const [isShiftTimingsVisible, setShiftTimingsVisible] = useState<boolean>(false);
  // const [advancedFields, setAdvanceFieldsVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [operationTimings, setOperationTimings] = useState<IOperationTimings[] | IOperationTimingsStructure[]>([]);
  const [managerDetails, setManagerDetails] = useState<IMangerDetails[] | IBranchManagerStructure[]>([]);
  const [editModeShfitList, setEditModeShiftList] = useState<IShiftTimingStructure[]>([]);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [isOperationTimingTouched, setOperationTimingTouched] = useState<boolean>(false);
  const [isShiftTimingsTouched, setShiftTimingsTouched] = useState<Array<IShiftTimingsTouchStatus>>([]);
  const [rowKey, setKey] = useState<string>('shiftTiming');
  const [isBranchManagerTouched, setBranchManagerTouched] = useState<boolean>(false);
  const [isAddressFieldsTouched, setAddressFieldsTouched] = useState<boolean>(false);
  const [isMapSearched, setMapSearched] = useState<boolean>(false);
  /* Store Subscriptions */
  const [hiddenstructure, sethiddneStructure] = useState({});
  const isStructureLoading = useTypedSelector((state) => state.branchConfiguration.isStructureLoading);
  const structure = useTypedSelector((state) => state.branchConfiguration.form.structure);
  const operationTimingsStructureList = useTypedSelector((state) => state.branchConfiguration.form.operationTimingsStructureList);
  const shiftTimingsStructureList = useTypedSelector((state) => state.branchConfiguration.form.shiftTimingsStructureList);
  const shiftTimingsStructure = useTypedSelector((state) => state.branchConfiguration.form.shiftTimingsStructure.columns);
  const operationTimingsFormStructure = useTypedSelector((state) => state.branchConfiguration.form.operationTimingsFormStructure);
  const branchManagerList = useTypedSelector((state) => state.branchConfiguration.form.branchManagerList);
  const clientBranchDetails = useTypedSelector((state) => state.branchConfiguration.clientBranchDetails);
  const isEditClientBranch = useTypedSelector(state => state.branchConfiguration.isEditClientBranch);
  const skillList = useTypedSelector((state) => state.branchConfiguration.skillSetList);
  const countryList = useTypedSelector((state) => state.branchConfiguration.localeData);

  const sectionKeys = Object.keys(structure);  

  const dispatchFormStructure = (newStructure: IMongoFormStructure) => {
    dispatch({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });
  }

  const dispatchShiftTimingsStructure = (payload: IShiftTimingStructure[]) => {
    dispatch({ type: '@@branchConfiguration/SET_SHIFT_TIMINGS_STRUCTURE', payload: payload });
  }

  const dispatchClientDetails = (payload: IBranchConfigurationTreeDataSubBranchPayload) => {
    dispatch({ type: '@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA_SUCCESS', payload: payload });
  }

  const dispatchOperationTimingsStructure = (payload: IOperationTimingsStructure[]) => {
    dispatch({ type: '@@branchConfiguration/SET_OPERATION_TIMINGS_STRUCTURE', payload: payload });
  }

  const dispatchBranchManagerStructure = (payload: IBranchManagerStructure[]) => {
    dispatch({ type: '@@branchConfiguration/SET_BRANCH_MANAGER_STRUCTURE', payload: payload });
  }

  const resetClientDetails = () => {
    dispatchShiftTimingsStructure(convertShiftTimingStructure([shiftTimingsStructure]));
    dispatchOperationTimingsStructure(convertOperationTimingStructure([operationTimingsFormStructure]));
    dispatchBranchManagerStructure(convertBranchManagerStructure([structure.branchManagerDetails]));
    dispatch({ type: "@@branchConfiguration/RESET_BRANCH_DATA" });
    // setValue('walletEnabled', "No")
  }


  const [loadMultiplierRequiredError, setLoadMultiplierRequiredError] = useState(false)

  const handleLoadMultiplierError = () => {
    const isRequired = structure?.['ETA details']?.['loadMultipliers']?.['permission'] && structure?.['ETA details']?.['loadMultipliers']?.['required']
    const LM = getValues()
    if(isRequired && !LM?.loadMultipliers) {
      setLoadMultiplierRequiredError(true)
    } else {
      setLoadMultiplierRequiredError(false)
    }
  }

  /* wtachers for address fields */
  const country = watch('country', '');
  const watchSkillSet = watch('skillSet', '')
  if (!(watch('moduleKey'))) {
    setValue('moduleKey', 'CLIENTBRANCH_ADD_FORM')
  }

  const walletEnabled = watch('walletEnabled', "No")

  const loaderRef = React.useRef<HTMLDivElement | null>(null);

  const handleOperationTimings = () => { setOperationTimingTouched(true); setOperationTimingsVisible(true); };

  const handleShiftTimings = (key: string) => {
    var index = key.replace( /^\D+/g, '');
    var name = index && parseInt(index) > 0 ? watch('managerContactName-'+index) : watch('managerContactName')
    if(!name){
      const label = branchManagerList[index ? index : 0]['managerContactName'+(index ? '-'+index : '')].label
      toast.add(dynamicLabels.pleaseAddDetails + ' ' + label, "info", false)
      return
    }
    setShiftTimingsVisible(true);
    setBranchManagerTouched(true)
    setKey(key);
    let newShiftTouched = [{ key: true }];
    let touchedShiftTimings = [...isShiftTimingsTouched, ...newShiftTouched];
    setShiftTimingsTouched(touchedShiftTimings);
    if (!isBranchManagerTouched) {
      usePopulateShiftTimingsStructure(clientBranchDetails.managerDetails, key, formInstance, shiftTimingsStructureList, branchManagerList, isEditMode, isBranchManagerTouched)
    }
  };

  const handleAddOperationsTimings = (operationTimingsList: IOperationTimingsStructure[]) => {
    setOperationTimingTouched(true);
    let lastField = operationTimingsList.length > 1 ? [operationTimingsList[operationTimingsList.length - 1]] : operationTimingsList;
    let newList = addOperationsTiming(lastField, operationTimingsList.length);
    let newOperationTimingsStructure = [...operationTimingsList, ...newList];
    dispatchOperationTimingsStructure(newOperationTimingsStructure);
  };

  const handleCancelOperationTimings = (operationsTimelist: Array<IMongoFormStructure>) => {
    let updatedList = deepCopy(operationsTimelist)
    updatedList.forEach((item: { [x: string]: { permission: boolean; label: string; isSaved: boolean }; }) => {
      Object.keys(item).forEach(key => {
        if (item[key] && item[key].label) {
          if (!item.isSaved) {
            setValue(key, null)
          }
          item[key].permission = true
        }
      })
    })

    updatedList = updatedList.filter((item: { isSaved: boolean }) => item.isSaved);

    if (!updatedList.length) {
      updatedList = convertOperationTimingStructure([operationTimingsFormStructure])
    }
    dispatchOperationTimingsStructure(updatedList);
  }

  const handleSaveOperationTimings = (operationsTimelist: Array<IMongoFormStructure>) => {
    const updatedList = deepCopy(operationsTimelist)
    const filteredUpdatedList = updatedList.filter((item: { [x: string]: { permission: boolean; }; }) =>
      item[Object.keys(item)[Object.keys(item).length - 2]]?.permission
    )

    filteredUpdatedList.forEach((listItem: { isSaved: boolean; }) => {
      listItem.isSaved = true
    })

    const deletedUpdatedList = updatedList.filter((item: { [x: string]: { permission: boolean; }; }) =>
      !item[Object.keys(item)[Object.keys(item).length - 2]]?.permission
    )
    deletedUpdatedList.forEach((listItem: {}) => {
      Object.keys(listItem).forEach(field => {
        setValue(field, null)
      })
    })
    useWatchOperationTimings(filteredUpdatedList, formInstance, validateOperationTimings, setOperationTimings)
    dispatchOperationTimingsStructure(filteredUpdatedList);
  }

  const handleAddShiftTimings = (oldShiftList: IShiftTimingStructure[], key: string) => {
    let managerDetailList = isEditMode ? clientBranchDetails.managerDetails.length ? clientBranchDetails.managerDetails : branchManagerList : branchManagerList
    managerDetailList.map(() => {
      let lastField = oldShiftList.length > 1 ? [oldShiftList[oldShiftList.length - 1]] : oldShiftList;
      let newList = addShiftTiming(lastField, key, oldShiftList.length, isBranchManagerTouched);
      let fields = [...oldShiftList, ...newList];
      dispatchShiftTimingsStructure(fields)
    });
  };

  const handleCancelShiftTimings = (shiftTimelist: Array<IMongoFormStructure>) => {
    let updatedList = deepCopy(shiftTimelist)
    updatedList.forEach((item: { [x: string]: { permission: boolean; label: string; }; }) => {
      Object.keys(item).forEach(key => {
        if (item[key] && item[key].label) {
          if (!item.isSaved) {
            setValue(key, null)
          }
          item[key].permission = true
        }
      })
    })

    updatedList = updatedList.filter((item: { isSaved: boolean }) => item.isSaved);

    if (!updatedList.length) {
      updatedList = convertShiftTimingStructure([shiftTimingsStructure])
    }

    dispatch({
      type: '@@branchConfiguration/SET_SHIFT_TIMINGS_STRUCTURE',
      payload: updatedList,
    });
  }

  const handleSaveShiftTimings = (branchManagers: IBranchManagerStructure[], shiftTimelist: Array<IMongoFormStructure>) => {
    const updatedList = deepCopy(shiftTimelist)
    const filteredUpdatedList = updatedList.filter((item: { [x: string]: { permission: boolean; }; }) =>
      item[Object.keys(item)[Object.keys(item).length - 3]]?.permission
    )

    filteredUpdatedList.forEach((listItem: { isSaved: boolean; }) => {
      listItem.isSaved = true
    })

    const deletedUpdatedList = updatedList.filter((item: { [x: string]: { permission: boolean; }; }) =>
      !item[Object.keys(item)[Object.keys(item).length - 3]]?.permission
    )

    deletedUpdatedList.forEach((listItem: {}) => {
      Object.keys(listItem).forEach(field => {
        setValue(field, null)
      })
    })

    useWatchShiftTimings(branchManagers, filteredUpdatedList, formInstance, setManagerDetails)
    dispatch({
      type: '@@branchConfiguration/SET_SHIFT_TIMINGS_STRUCTURE',
      payload: filteredUpdatedList,
    });
  }

  useEffect(() => {
    dispatch({ type: '@@branchConfiguration/GOOGLE_API_KEY' });
    if (structure !== undefined) {
      if (Object.keys(structure).length > 0 && structure?.['general details']?.vendorName) {
        const newStructure = deepCopy(structure);
        setTimeout(() => {
          newStructure['general details']['vendorName'].editable = true;
          dispatchFormStructure(newStructure);
        }, 100);
      }
    }
    if (isEditClientBranch && isEditClientBranch?.clientBranchId) {
      dispatch({ type: '@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA', payload: { clientBranchId: isEditClientBranch.clientBranchId } });
      setEditMode(true);
    }
    if(!isEditMode) {
      setValue('walletEnabled', "No");
    }
  }, []);

  useEffect(() => {
    if (isEditClientBranch?.clientBranchId === undefined) {
      // Then by default set autoAllocateFl to true which inturn will set deliveryMediumAutoAllocateFl to true.
      setValue("autoAllocateFl", "Y");
    }
  }, []);

  useEffect(() =>{
    if(!isEditClientBranch && !isEditClientBranch?.['clientBranchId']){
      setValue("signatureVerificationFl", "N")
      setValue("cashTransactionFl", "Y");
    }
  },[])


  const validateOperationTimings = (operationalDays: Array<string>) => {

    const uniqueOperationDays = operationalDays.filter((item: string, index: number) => operationalDays.indexOf(item) === index);

    let duplicates = [...operationalDays]
    uniqueOperationDays.forEach((item) => {
      const i = duplicates.indexOf(item)
      duplicates = duplicates.slice(0, i).concat(duplicates.slice(i + 1, duplicates.length));
    })
    duplicates.length > 0 && toast.add(dynamicLabels.operationTimingCannotOverlapMsg, "info", false)
    isEditMode && duplicates.length > 0 && setOperationTimingsVisible(duplicates.length > 0);
    return duplicates.length > 0 ? false : true
  }

  const validateShiftTimings = (shiftList: IShiftTimingStructure[]) => {
    let selectedDays = [];
    shiftList.forEach((shift: IShiftTimingStructure) => {
      let shiftKeys = Object.keys(shift);
      if (watch(String([shiftKeys[1]]), '') === null || watch(shiftKeys[2], '') === null || watch(shiftKeys[3], '') === null) {
        return false;
      } else {
        return;
      }
    })
    shiftList = shiftList.filter((shift: IShiftTimingStructure) => {
      let shiftKeys = Object.keys(shift);
      if(shift[shiftKeys[1]].permission)
        return shift
      else
      return false
    })
    selectedDays = shiftList.map((shift: IShiftTimingStructure) => {
      let shiftKeys = Object.keys(shift);
      let selectedDay = watch(String([shiftKeys[1]]), '') ? watch(String([shiftKeys[1]]), '').name : "";
      let field = {
        "day": selectedDay,
        "startTime": timeToStringWithoutUtc(watch(shiftKeys[2], '')),
        "endTime": timeToStringWithoutUtc(watch(shiftKeys[3], ''))
      }
      return field
    })

    let weekdays = selectedDays.map((day: ISelectedShiftDays) => { return day.day });
    let duplcates = weekdays.filter((value, index) => weekdays.indexOf(value) !== index);
    let dupllcateObjects = selectedDays.filter((day) => duplcates.includes(day.day) && day.endTime !== "Invalid date");
    dupllcateObjects.forEach((day) => {
      let duplicateObjects = dupllcateObjects.filter((obj) =>  obj.day === day.day);
      duplicateObjects.forEach((currentDay, index) => {
        if(index !== duplicateObjects.length-1){
          if (check_time_overlap(currentDay.startTime, currentDay.endTime, duplicateObjects[index+1].startTime, duplicateObjects[index+1].endTime)) {
            toast.add(dynamicLabels.shiftTimingCannotOverlapMsg, "info", false)
            useWatchShiftTimings(branchManagerList, shiftTimingsStructureList, formInstance, setManagerDetails);
            return true;
          } else {
            useWatchShiftTimings(branchManagerList, shiftTimingsStructureList, formInstance, setManagerDetails)
            return false;
          }
        }
        else{
          return true
        }
      });
    })
  }

  const createBranch = async (payload: ICreatePayload[]) => {
    try {
      dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: true });
      const { data } = await axios.post(apiMappings.branchConfiguration.form.create, payload);
      if (data.hasError) {
        dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: false });
        dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
        toast.add(data.message, 'warning', false);
      } else {
        dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: false });
        dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
        toast.add(dynamicLabels.clientBranchCreatedSuccess ? dynamicLabels.clientBranchCreatedSuccess : 'Client branch created successfully.', 'success', false);
        if (routeContains('vendorForm')) {
          let request = {}
          request['name'] = payload[0].name;
          request['id'] = data.data[0];
          setTimeout(()=>{
            closeAddBranchForm && closeAddBranchForm(request)
          },1000)
        }
        else {
          onCancel && onCancel();
        }
        dispatch({ type: '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA', payload: { key: 'isEditClientBranch', value: '' } });
      }
    } catch (error: any) {
      dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: false });
      dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
      if(error?.response?.data){
        let message = (error?.response?.data?.error?.message[0]) ? (error?.response?.data?.error?.message[0]).includes('ClientBranchName') ? dynamicLabels.clientBranchNameExist : error?.response?.data?.error?.message[0] ? error?.response?.data?.error?.message[0] : error?.response?.data?.message : error?.response?.data?.message;
        toast.add(message, 'warning', false);
      } else {  
      toast.add(dynamicLabels.somethingWendWrong, 'success', false);
      console.log(error);
    }
  }
  }

  const onSubmit = async (formInputs: IFormInputs, editMode: boolean, operationTimingsList: IOperationTimings[] | IOperationTimingsStructure[], managerDetailsList: IMangerDetails[] | IBranchManagerStructure[]) => {
    const customFieldsData = generateCustomFieldsFormDataAllSection(structure, formInputs);

    formInputs['customFieldsEntity'] = [];
    if (customFieldsData) {
      Object.keys(customFieldsData).forEach(function (key) {
        if (customFieldsData[key] !== '' && customFieldsData[key] !== undefined && key !== 'autoAllocateProfileName' && customFieldsData[key].val != undefined) {
          formInputs['customFieldsEntity'].push({ field: key, value: customFieldsData[key].val, type: customFieldsData[key].type });
        }
      });
    }
    if (editMode) {
      let managerDetailsPayload = [];
      if (isBranchManagerTouched) {
        managerDetailsPayload = useWatchShiftTimings(branchManagerList, shiftTimingsStructureList, formInstance, setManagerDetails)
      } else {
        managerDetailsPayload = managerDetailsList
      }
   
      const payload = preparePayload(formInputs, currentCordinates, operationTimingsList, managerDetailsPayload);
      payload[0]['clientBranchId'] = clientBranchDetails.clientBranchId;
      payload[0]['clientParentBranchName'] = clientBranchDetails.isSuperFl === 'Y' ? clientBranchDetails.superClientParentBranch : null
      payload[0]['isSuperFl'] = clientBranchDetails.isSuperFl
      payload[0]['skillSet'] = watchSkillSet.map((skill: ISkillSet) => { if(skill && skill.clientRefMasterCd){
        return skill.clientRefMasterCd;
      } else { return }}).join().replace(/^,|,$/g, '');
      payload[0]['branchDescription'] = watch('description', '');
      payload[0]['coloaderId'] = clientBranchDetails.coloaderId;
      payload[0]['coloaderName'] = clientBranchDetails.coloaderName;
      payload[0]['countryShortCode'] = country.googleCountryCode;
      payload[0]['gmtoffset'] = clientBranchDetails.gmtoffset;
      payload[0]['subClientParentBranchId'] = clientBranchDetails.isSuperFl === 'N' ? clientBranchDetails.subClientParentBranchId && clientBranchDetails.subClientParentBranchId.id : null
      payload[0]['superClientParentBranchId'] = clientBranchDetails.isSuperFl === 'Y' ? clientBranchDetails.superClientParentBranchId && clientBranchDetails.superClientParentBranchId.id : null
      payload[0]['clientBranchAccountDTO']['branchAccountId'] = clientBranchDetails?.clientBranchAccountDTO?.branchAccountId
      payload[0]['hasGeofenceUpdated'] = clientBranchDetails?.lat !== currentCordinates[0] &&  clientBranchDetails?.lng !== currentCordinates[1] ? 'Y' : 'N'
      /* validation for walled id*/
      if (formInputs.walletEnabled === 'Yes' && formInputs.walletId !== '' && formInputs.walletId !== clientBranchDetails.clientBranchAccountDTO.walletId) {
        const { data } = await axios.get<ILogiAPIResponse<ICreatePayload>>(`${apiMappings.branchConfiguration.form.validateWallet}?walletId=${formInputs.walletId}`);
        if (data.hasError) {
          toast.add(data.message[0], 'warning', false);
        }
        if (data.data) {
          /* updating branch here */
          gaOnSubmit(editMode);
            try {
              dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: true });
              dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: true });
              const { data } = await axios.put<ILogiAPIResponse<ICreatePayload>>(apiMappings.branchConfiguration.form.update, payload);
              if (data.hasError) {
                dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: false });
                dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
                toast.add(data.message, 'warning', false);
              }
              else if (data.status === 400) {
                toast.add(dynamicLabels.shiftTimingCannotOverlapMsg, 'warning', false);
                dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
              } else if (data.status === 200) {
                dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: false });
                dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
                toast.add(dynamicLabels.clientBranchUpdatedSuccess ? dynamicLabels.clientBranchUpdatedSuccess : 'Client branch updated successfully.', 'success', false);
                onCancel && onCancel()
                dispatch({ type: '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA', payload: { key: 'isEditClientBranch', value: '' } });
                resetClientDetails();
              }
            } catch (error: any) {
              dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: false });
              dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
              if(error?.response?.data){
                let message = (error?.response?.data?.error?.message[0]).includes('ClientBranchName') ? dynamicLabels.clientBranchNameExist : error?.response?.data?.error?.message[0];
                toast.add(message, 'warning', false);
              } else {
              toast.add(dynamicLabels.somethingWendWrong, 'success', false);
              }
              console.log(error);
            }
        } else {
          toast.add(data.message, 'warning', false);
        }
      } else {

        gaOnSubmit(editMode);
        try {
          dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: true });
          dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: true });
          const { data } = await axios.put<ILogiAPIResponse<ICreatePayload>>(apiMappings.branchConfiguration.form.update, payload);
          if (data.hasError) {
            dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: false });
            dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
            toast.add(data.message, 'warning', false);
          }
          else if (data.status === 400) {
            toast.add(dynamicLabels.shiftTimingCannotOverlapMsg, 'warning', false);
            dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
          } else if (data.status === 200) {
            dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: false });
            dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
            toast.add(dynamicLabels.clientBranchUpdatedSuccess ? dynamicLabels.clientBranchUpdatedSuccess : 'Client branch updated successfully.', 'success', false);
            onCancel && onCancel()
            dispatch({ type: '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA', payload: { key: 'isEditClientBranch', value: '' } });
            resetClientDetails();
          }
        } catch (error: any) {
          dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: false });
          dispatch({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false });
          toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'success', false);
        }
      }
    } else {
      //  useWatchShiftTimings(branchManagerList, shiftTimingsStructureList, formInstance, setManagerDetails)
      const payload = preparePayload(formInputs, currentCordinates, operationTimings, managerDetails);
      gaOnSubmit(editMode);
      try {
        dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: true });

        if (formInputs.walletEnabled === 'Yes' && formInputs.walletId !== '') {
          const { data } = await axios.get<ILogiAPIResponse<ICreatePayload>>(`${apiMappings.branchConfiguration.form.validateWallet}?walletId=${formInputs.walletId}`);
          if (data.status === 400) {
            toast.add(data.message[0], 'warning', false);
          }
          if (data.data) {
            createBranch(payload)
          } else {
            toast.add(data.message, 'warning', false);
          }
        } else {
          createBranch(payload)
        }
      } catch (error: any) {
        dispatch({ type: '@@branchConfiguration/SET_API_LOADING', payload: false });
        toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'success', false);
      }
    }
  };


  useEffect(() => {
    return setAddressFieldsTouched(false);
  }, []);

  useEffect(()=>{
    return ()=> {
      dispatch({ type: '@@branchConfiguration/RESET_ZONE_DETAILS' });
      resetClientDetails()
    }
  },[])
  const handleCancel = () => {
    setAddressFieldsTouched(false);
    if (routeContains('vendorForm')) {
      closeAddBranchForm && closeAddBranchForm()
    } else {
      if (!formInstance.formState.isDirty) {
        onCancel && onCancel();
        gaOnCancel();
      } else {
        globalPopupDispatch({
          type: '@@globalPopup/SET_PROPS',
          payload: {
            isOpen: true, title: dynamicLabels.navigationConfirmation,
            content: dynamicLabels.dataLostWarningMsg,
            footer: (<>
              <IconButton
                iconVariant='icomoon-tick-circled' primary onClick={() => {
                  globalPopupDispatch({
                    type: '@@globalPopup/CLOSE_POPUP',
                  });
                  onCancel && onCancel();
                  gaOnCancel();
                }}> {dynamicLabels.ok}
              </IconButton>
              <IconButton iconVariant='icomoon-close' onClick={() =>
                globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
              }> {dynamicLabels.cancel}
              </IconButton>
            </>
            ),
          },
        });
      }
    }
  };

  useEffect(() => {
    if (isEditMode && Object.keys(clientBranchDetails).length && operationTimingsStructureList.length) {
      const customFieldsFormData = getCustomFieldsFormData(clientBranchDetails?.customFieldsEntity)
      if (!isAddressFieldsTouched && !isMapSearched) {
        if(clientBranchDetails?.lat && clientBranchDetails?.lng) {
          setPosition([clientBranchDetails.lat, clientBranchDetails.lng]);
        } else {
          setPosition([_center[0], _center[1]]);
        }
      }
      setCurrentCordinates([clientBranchDetails.lat, clientBranchDetails.lng]);
      populateBranchData(clientBranchDetails, operationTimingsStructureList, branchManagerList, editModeShfitList, structure, formInstance, isOperationTimingTouched, dispatchFormStructure, customFieldsFormData, isBranchManagerTouched, skillList)
    }
  }, [clientBranchDetails, isEditMode, operationTimingsStructureList, branchManagerList, editModeShfitList]);

  useEffect(() => {
    if ((Object.keys(clientBranchDetails).length && clientBranchDetails.operationTimings.length) || isEditMode){
      useWatchOperationTimings(operationTimingsStructureList, formInstance, validateOperationTimings, setOperationTimings);
    }
  }, [operationTimingsStructureList, branchManagerList, clientBranchDetails, isEditMode])


  const updateAddressFields = (address: tSearchFieldAddressInfo) => {
    const newStructure = deepCopy(structure);

    const selectedCountry = countryList?.find((o) => {return o['name'] === address.country?.toUpperCase()});
    setValue('country', { 'id':  selectedCountry && selectedCountry?.['id'], 'name': address?.country });
    setValue('state', { "id": 1, "name": address?.state });
    setValue('apartment', address?.apartment);
    setValue('streetName', address?.streetName);
    setValue('landmark', address?.landMark);
    setValue('locality', address?.locality);
    setValue('city', address?.city);
    if(newStructure !== undefined) {
      if(Object.keys(newStructure?.['address']?.['addressFields']?.['childNodes'])?.includes('zipCode')) {
        if(newStructure?.['address']?.['addressFields']?.['childNodes']?.zipCode?.fieldType === "text") {
          setValue('zipCode',  address?.pincode );
        } else if(newStructure?.['address']?.['addressFields']?.['childNodes']?.zipCode?.fieldType === "select") {
          setValue('zipCode', { "id": selectedCountry && selectedCountry?.['id'], "pincode": address?.pincode, "name": address?.pincode });
        }
      }
    }
  }

  const populateMapAddress = (address: tSearchFieldAddressInfo) => {

    setMapSearched(address?.isPropSearch);
    if (Object.keys(address).length > 0) {
      if (isEditMode && address?.isPropSearch) {
        updateAddressFields(address);
        setCurrentCordinates(address.position);
      } else if (!address?.isPropSearch) {
        // in add mode, if address field touched and
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

  useEffect(() => {
    const newStructure = deepCopy(structure);
    if(Object.keys(newStructure).length > 0) {
    setTimeout(() => {
        newStructure['wallet details']['walletId'].permission = walletEnabled === "Yes" ? true : false;
        newStructure['wallet details']['minBalance'].permission = walletEnabled === "Yes" ? true : false;
        newStructure['wallet details']['minWithdrawableAmount'].permission = walletEnabled === "Yes" ? true : false;
        dispatchFormStructure(newStructure);
    }, 100);
  }
},[walletEnabled])

useEffect(() => {
  if(isEditMode && clientBranchDetails && clientBranchDetails?.clientBranchAccountDTO && Object.keys(clientBranchDetails.clientBranchAccountDTO).includes('walletEnabled')) {
    const newStructure = deepCopy(structure);
    if(Object.keys(newStructure).length > 0) {
    setTimeout(() => {
        newStructure['wallet details']['walletId'].permission = clientBranchDetails?.clientBranchAccountDTO?.walletEnabled;
        newStructure['wallet details']['minBalance'].permission = clientBranchDetails?.clientBranchAccountDTO?.walletEnabled;
        newStructure['wallet details']['minWithdrawableAmount'].permission = clientBranchDetails?.clientBranchAccountDTO?.walletEnabled;
        dispatchFormStructure(newStructure);
    }, 100);
    }
  }
},[isEditMode, clientBranchDetails])


  return (
    <>
      {isStructureLoading || !sectionKeys.length ? (
        <div ref={loaderRef}>
          <FormLoader />
        </div>
      ) :
        <>
          <BranchConfigurationFormContainer>
            <BranchConfigurationWatchers formInstance={formInstance} dispatchFormStructure={dispatchFormStructure} setSearchText={setSearchText} isOperationTimingTouched={isOperationTimingTouched} isBranchManagerTouched={isBranchManagerTouched} isEditMode={isEditMode} setEditModeShiftList={setEditModeShiftList} dispatchShiftTimingsStructure={dispatchShiftTimingsStructure} rowKey={rowKey} setManagerDetails={setManagerDetails} isAddressFieldsTouched={isAddressFieldsTouched} isMapSearched={isMapSearched} />
            <AddBranchFormFields formInstance={formInstance} handleShiftTimings={handleShiftTimings} handleRemoveBranchManager={useHandleRemoveBranchManager} handleAddBranchManager={useHandleAddBranchManager} handleOperationTimings={handleOperationTimings} searchText={searchText} dispatchBranchManagerStructure={dispatchBranchManagerStructure} dispatchShiftTimingsStructure={dispatchShiftTimingsStructure} setBranchManagerTouched={setBranchManagerTouched} setManagerDetails={setManagerDetails} handleAddShiftTimings={handleAddShiftTimings} populateMapAddress={populateMapAddress} position={position} setPosition={setPosition} setAddressFieldsTouched={setAddressFieldsTouched} setMapSearched={setMapSearched} isEditMode={isEditMode} loadMultiplierRequiredError={loadMultiplierRequiredError} vendorData={vendorData} setCurrentCordinates={setCurrentCordinates} currentCordinates={currentCordinates}/>
           
            {((isEditMode && clientBranchDetails && clientBranchDetails?.coloaderId) || (!isEditMode && window.location.href.includes('vendorForm'))) && <ServiceArea dynamicLabels={dynamicLabels} isEditMode={isEditMode}></ServiceArea> }
            <Box horizontalSpacing='15px' display='flex' mt='30px' >
              <span onClick={handleLoadMultiplierError}>
              <IconButton iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={false}
              onClick={
                handleSubmit((data) =>
                onSubmit(data, isEditMode, operationTimings, managerDetails)
                )
              }
              primary
              id={`branch_form-actionbar-${isEditMode ? 'update': 'save'}`}
              >{isEditMode ? dynamicLabels.update : dynamicLabels.save}</IconButton>
              </span>

              <IconButton id='branch_form-actionbar-cancel' iconVariant='icomoon-close' style={{ padding: '0px 15px' }} onClick={() => { handleCancel(); dispatch({ type: '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA', payload: { key: 'isEditClientBranch', value: '' } }); setEditMode(false); resetClientDetails(); }}>{dynamicLabels.cancel}</IconButton>
            </Box>
            <BranchConfigurationAddFormModals
              handleRemoveOperationsTimings={useRemoveOperationsTimings}
              watchOperationTimings={useWatchOperationTimings}
              handleAddShiftTimings={handleAddShiftTimings}
              watchShiftTimings={useWatchShiftTimings}
              handleRemoveShiftTimings={useRemoveShiftTimings}
              dispatchClientDetails={dispatchClientDetails}
              handleAddOperationsTimings={handleAddOperationsTimings}
              validateShiftTimings={validateShiftTimings}
              rowKey={rowKey}
              isEditMode={isEditMode}
              setShiftTimingsVisible={setShiftTimingsVisible}
              isShiftTimingsVisible={isShiftTimingsVisible}
              isOperationTimingsVisible={isOperationTimingsVisible}
              setOperationTimingsVisible={setOperationTimingsVisible}
              formInstance={formInstance}
              handleCancelOperationTimings={handleCancelOperationTimings}
              handleSaveOperationTimings={handleSaveOperationTimings}
              dispatchShiftTimingsStructure={dispatchShiftTimingsStructure}
              dispatchOperationTimingsStructure={dispatchOperationTimingsStructure}
              setOperationTimingTouched={setOperationTimingTouched}
              setManagerDetails={setManagerDetails}
              handleSaveShiftTimings={handleSaveShiftTimings}
              handleCancelShiftTimings={handleCancelShiftTimings}
            />
          </BranchConfigurationFormContainer>
        </>}
    </>
  );
};
export default BranchConfigurationForm;

