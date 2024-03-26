import React, { useState, useEffect, Dispatch } from "react";
import { useForm } from "react-hook-form";
import { Modal, ModalHeader, Box, IconButton, Grid,  MultiSelect, tMultiSelectChildren, TextInput, FontIcon, Position, useToast} from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import FormField from "../../../../../utils/components/Form/FormField";
import { IMultiselectEntity } from "../../../../../utils/mongo/interfaces";
import { useDispatch } from "react-redux";
import { BranchConfigurationActions } from "../../BranchConfiguration.actions";
import withRedux from '../../../../../utils/redux/withRedux';
import { GroupFieldsWrapper, StyledIconButton , RateChartModalWrapper} from '../../BranchConfigurationStyledComponents';

const RateChartModal = (props: any) => {
  const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();
  const toast = useToast();
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {},
  });
  const { getValues, setValue, handleSubmit , unregister, clearErrors} = formInstance;
  const rateProfileStructure = useTypedSelector((state) => state.branchConfiguration.form.serviceZonesRateProfile);
  const branchRateProfile = useTypedSelector((state) => state.branchConfiguration.form.branchZoneRateProfiles);
  const serviceTypes = useTypedSelector( (state) => state.branchConfiguration.form.serviceType);
  const dynamicLabels = useTypedSelector( (state) => state.dynamicLabels);
  const formatedServiceTypes = serviceTypes?.map((option: any) => {
    return {
      id: option.id,
      label: option.name,
      value: option.clientRefMasterId,
    };
  });
  const rateProfileList = useTypedSelector((state) => state.branchConfiguration.form.rateProfileList);

  const structure = rateProfileStructure?.["zoneRateProfile"];
  let { open, handleClose , handleOK, isZoneEditMode, isFormEditMode} = props;
  var initialState = {
    isDeleteFl: false,
    serviceType: null,
    rateProfile:null,
    committedSLA:null,
    id: (Math.random() * 10000).toFixed(0)
  };
  const [groupFields, setGroupFields] = useState<any>([initialState]);
  const [rateChartDropdownData, setRateChartDropdownData ]= useState<any>({})
  const [cancelClicked, setIsCancelClicked] = useState<boolean>(false)
 
  structure &&
    Object.keys(structure)?.forEach((objName) => {
      initialState = {
        ...initialState,
        [objName]: undefined,
      };
    });

 
  const handleAddGroupedFields = () => {
    setTimeout(() => {
      setGroupFields((groupFields: any) => [...groupFields, {...initialState, id:(Math.random() * 10000).toFixed(0)}]);
    }, 100);
  };

  const handleDeleteGroupedFields = (index: any) => {
    const newArr = [...groupFields];
    groupFields[index].isDeleteFl = true;
    setGroupFields(newArr);
    resetForm(index);
  };
  
  const resetForm= (index: any) =>{
    setValue("serviceType" + index, null);
    setValue("rateProfile"+index, null);
    setValue("committedSLA" + index, null);
    clearErrors("rateProfile" + index);
    clearErrors("committedSLA" + index);
  }
  useEffect(()=>{
    let dropArr={}
    rateProfileList && rateProfileList.length && rateProfileList?.forEach((option: any) => {
        dropArr[option.id]=option.name
      });
      setRateChartDropdownData(dropArr)
    }, [rateProfileList])
    
    const setInitialState= ()=>{

      if(branchRateProfile?.length>0){
        if(isFormEditMode){
          setGroupFields([])
          branchRateProfile.forEach((profile:any, index:number) => {
            if(profile.serviceTypeRefId){
              setValue("serviceType" + index, [{id: profile.serviceTypeRefId, value: profile.serviceTypeRefId, label: profile.serviceTypeCd, clientRefMasterId: parseInt(profile.serviceTypeRefId)}]);
            }
            else if(profile?.serviceTypes && profile?.serviceTypes.length){
              const serviceTypesList:any[]= []
              profile.serviceTypes.forEach((service:any) => {
                if(Object.keys(service)?.[0]){
                  serviceTypesList.push({id: parseInt(Object.keys(service)?.[0]), label: Object.values(service)?.[0], value: parseInt(Object.keys(service)?.[0]), clientRefMasterId: parseInt(Object.keys(service)[0]) })
                }
               });
               setValue("serviceType" + index, serviceTypesList?.length ? serviceTypesList : undefined);
            }
            setValue("rateProfile" + index, profile?.rateProfileId?.toString());
            setValue("committedSLA" + index, profile.committedSLA);
            setGroupFields((groupFields: any) => [...groupFields, {...initialState, id:(Math.random() * 10000).toFixed(0)}]);
            });
        }
        else{
          setGroupFields([])
          branchRateProfile.forEach((profile:any, index:number) => {
            const serviceTypesList= profile.serviceTypes.map((service:any) => {
             return {id: parseInt(Object.keys(service)[0]), label: Object.values(service)[0], value: parseInt(Object.keys(service)[0]), clientRefMasterId: parseInt(Object.keys(service)[0]) }
            });
            setValue("serviceType" + index, serviceTypesList?.length ? serviceTypesList : undefined);
            setValue("rateProfile" + index, profile.id || profile?.rateProfileId?.toString());
            setValue("committedSLA" + index, profile.committedSLA);
            setGroupFields((groupFields: any) => [...groupFields, {...initialState, id:(Math.random() * 10000).toFixed(0)}]);
            });
        }
        
      }
      else if(branchRateProfile.length == 0){
        groupFields.forEach((group:any,index:number) => {
          Object.keys(group).forEach((field:string) => {
            unregister(field+index)
          });
          resetForm(index)
        })
        setGroupFields([initialState]);
      }
    }
    useEffect(()=>{
      setInitialState()
    },[isZoneEditMode, branchRateProfile])

    useEffect(()=>{
      if(cancelClicked){
        setIsCancelClicked(false)
        groupFields.forEach((element:any, index:number) => {
          resetForm(index);
          console.log(element)  
        });
        setInitialState()
      }
    },[cancelClicked])

    // const clearForm= () =>{
    //   // formInstance.reset()
    //   setIsCancelClicked(true)
    // }


    useEffect(()=>{
      if(rateProfileList?.length==0){
          dispatch({ type: '@@branchConfiguration/FETCH_RATE_PROFILE_DROPDOWNS' });
      }
    }, [])
 

  const getOptions= (serv:any, ser_index:number) =>{
    const srtTypes: any = [];
    groupFields &&
      groupFields?.length &&
      groupFields?.map((fields: any, index: number) => {
        if(index!==ser_index){
        if (
          Object.keys(fields)?.includes("serviceType") &&
          !fields.isDeleteFl
        ) {
          const current = getValues();
          current?.["serviceType" + index]
            ? srtTypes.push(...current?.["serviceType" + index])
            : null;
        }}
      });
    const selectedIds = srtTypes.map((ser: any) => ser?.value);
    return serv.filter((service: any) => !selectedIds.includes(service.id)
    )
  }


   const onSubmit= async(data:any) =>{
    const zoneRateProfile:any[]=[];
    var activeProfileCount = 0;
    var activeServices=0;
    groupFields.forEach((group:any,index:number) => {
      let tempObj={}
      if(!group.isDeleteFl){
       
       Object.keys(group).map(key=>{
        if(key=='serviceType'){
          let tempServiceObj:any[]=[];
          data[key+index]?.map((ser:any)=> {
            var serviceId= ser.id
            let serObj={}
            serObj[serviceId]= ser.label
            tempServiceObj.push(serObj)
          })
          tempObj['serviceTypes']=tempServiceObj ;
          tempObj['serviceTypes'].length>0? activeServices = activeServices + 1 : null
        }
        else if(key=='rateProfile'){
          tempObj['rateProfileId']= data[key+index]?.id ? data[key+index]?.id : data[key+index]
          setValue('rateProfile'+index, data[key+index]?.id ? data[key+index]?.id : data[key+index])
        }
        else if(key=='committedSLA'){
          tempObj['committedSLA']= data[key+index]
        }
      })
    }
      !group.isDeleteFl && zoneRateProfile.push(tempObj)
      !group.isDeleteFl ? activeProfileCount = activeProfileCount +1 : null
    });
    if((activeProfileCount > 1) && activeServices < activeProfileCount-1){
      toast.add("Service type cannot be blank for more than one row", "warning", false);
      activeProfileCount=0
    }
    else{
      activeProfileCount=0;
      activeServices=0
      dispatch({ type: '@@branchConfiguration/SET_BRANCH_ZONE_RATE_PROFILES', payload: zoneRateProfile });
      handleOK({zoneRateProfile:zoneRateProfile})
    }

   }


  return (
    <RateChartModalWrapper>
      <Modal open={open} onToggle={() => {}} size="lg" width="900px">
        {{
          header: (
            <ModalHeader
              width="100%"
              headerTitle={dynamicLabels.zonalRateProfile || "Zonal Rate Profile"}
              imageVariant="icomoon-close"
              handleClose={()=>{clearErrors(); handleClose()}}
            />
          ),

          content: (
            <div style={{maxHeight:"80vh", overflowY:"auto",  padding:"32px 15px 0"}}>
            <div
              style={{ marginBottom: "15px"}}
              key="ServiceAreaZoneWrapper"
              className="ServiceAreaZoneWrapper"
            >

              {structure && groupFields && Object.values(groupFields).map((_group: any, index: number) => {
                  const activeFields = groupFields.filter((row:any) => !row.isDeleteFl)
                  return (
                    <GroupFieldsWrapper key={index+"mainWrapper"}>
                      <Grid container spacing="5px">
                      {!_group.isDeleteFl &&
                        Object.keys(structure).map((fieldName: any) => {
                          const meta = structure[fieldName];
                          if (!meta?.permission) {
                            return undefined;
                          }
                          if (fieldName == "serviceType") {
                            return (
                              <Grid item  key={`${index}-${fieldName}`}  xs={12}  sm={6}  md={3} >
                                <MultiSelect
                                  key={`${index}-${fieldName}`}
                                  options={getOptions(formatedServiceTypes, index)}
                                  onChange={(_event, _value, _isSelected, selectedOptions) => {
                                    selectedOptions?.map(o => formatedServiceTypes[o.value])
                                    setValue('serviceType'+index, selectedOptions)
                                  }}
                                  selected={(getValues()?.['serviceType'+index] && getValues()?.['serviceType'+index] !== undefined)? getValues()?.['serviceType'+index] : []}
                                  style={{ position: "absolute", top: "64px", width: "95%"}}
                                  maximumSelected={10}
                                  menuOpen={false}
                                  allowSelectAll={false}
                                  searchableKeys={["label"]}
                                  isLoading={false}
                                  className="RateProfileMultiselect">
                                  {({ optionSelected, isMenuOpen, openMenu }: tMultiSelectChildren) => {
                                    const value = React.useMemo(
                                      () =>
                                        optionSelected.length && optionSelected?.[0] !==undefined ? optionSelected?.map(({ label }) => label).join(", ")
                                          : meta.customField
                                          ? props?.value
                                          : props?.value?.map( (o: IMultiselectEntity) =>o?.name)?.join(","),
                                      [optionSelected, props.value]
                                    );
                                    return (
                                      <>
                                        <Position type="relative">
                                          <TextInput
                                            title={value}
                                            id={fieldName + index}
                                            name={fieldName + index}
                                            className="multiselct"
                                            label={meta.label}
                                            required={meta.required}
                                            fullWidth
                                            style={{ cursor: "pointer",position: "relative",}}
                                            placeholder="Select"
                                            onClick={() => { openMenu(!isMenuOpen);}}
                                            value={(optionSelected.length || props?.value?.length) ? `${optionSelected.length || props?.value?.length || 0} Selected` : ''}
                                            readOnly
                                          />

                                          {!isMenuOpen && (
                                            <Position type="absolute" right="10px"  top="40%">
                                              <FontIcon variant="triangle-down" size={8} color="black"/>
                                            </Position>
                                          )}
                                        </Position>
                                      </>
                                    );
                                  }}
                                </MultiSelect>
                              </Grid>
                            );
                          }
                          if(fieldName=='rateProfile'){
                            meta.customField=(rateChartDropdownData && Object.keys(rateChartDropdownData)?.length > 0) || false
                            meta.dropdownValues=rateChartDropdownData
                            meta.value= getValues()?.['rateProfile'+index]
                          }
                          return (
                            <>
                              <Grid  item  key={`${index}-${fieldName}`}  xs={12} sm={6} md={3} >
                                <FormField
                                  name={fieldName + index}
                                  meta={meta}
                                  formInstance={formInstance}
                                />
                              </Grid>
                            </>
                          );
                        })}
                      {!_group.isDeleteFl && (
                        <Grid item key={`${index}`+"IconWrapper"} xs={12} sm={6} md={3} className="grid-item" style={{display:"flex", alignItems:"center"}}>
                          {activeFields.length > 1 && <StyledIconButton
                              className="btnCancel"
                              onClick={() => handleDeleteGroupedFields(index)}
                              color="red"
                              disabled={false}
                              iconVariant="icomoon-close"
                              iconSize="md"
                              circle
                              style={{ padding: "5px", borderColor: "red" }}
                            /> }
                          { (activeFields[activeFields.length - 1].id == groupFields[index].id ||
                          groupFields?.length - 1 === index) && 
                            <>
                            <StyledIconButton
                              className="btnAdd"
                              onClick={() => handleAddGroupedFields()}
                              color="white"
                              disabled={false}
                              iconVariant="add"
                              iconSize="xs"
                              primary
                              circle
                              style={{ padding: "5px" }}
                            />
                            </>}
                            
                        </Grid>
                      )}
                      </Grid>
                    </GroupFieldsWrapper>
                  );
                })}
            </div>
            <Box
               horizontalSpacing="10px"
               display="flex"
               justifyContent="flex-end"
               p="15px"
               key="FooterButtons"
             >
               <IconButton
                 iconVariant="icomoon-tick-circled"
                 primary
                 onClick={handleSubmit(onSubmit)}
                 id='rate_chart-actionbar-save'
               >
                 {dynamicLabels.save}
               </IconButton>
               <IconButton
                 iconVariant="icomoon-close"
                 iconSize={11}
                 onClick={()=>{setIsCancelClicked(true);clearErrors(); handleClose()}}
                 id='rate_chart-actionbar-cancel'

               >
                 {dynamicLabels.cancel}
               </IconButton>
             </Box>
           </div>
           )
        }}
      </Modal>
    </RateChartModalWrapper>
  );
};
export default withRedux(RateChartModal);
