import React, { useEffect, Dispatch, useState } from 'react'
import {useToast, IconButton, Typography,Grid, Box, Accordion, AccordionHeaderTitle, AccordionContent} from 'ui-library'
import { useDispatch } from "react-redux";
import { ManifestConfigurationActions} from './ManifestConfiguration.actions'
import { DraggableComponent } from "../../../../utils/components/Draggable/DraggableComponent";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { ManifestTypeList, GenerateManifestPayload, GenerateManifestList } from './ManifestConfiguration.model'
import { ManifestConfigurationWrapper } from './ManifestConfiguration.styled'
import { IUserAccessInfo } from '../../../../utils/common.interface';
import moment from 'moment';
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import apiMappings from '../../../../utils/apiMapping';
import axios from "../../../../utils/axios";
import GenerateManifestId from './GenerateManifestId';
import { sendGA } from '../../../../utils/ga';
// import ManifestList from '../../../Manifest/ManifestListView/ManifestList';

const ManifestConfiguration = () =>{
    const toast= useToast()
     // Dispatcher
    const dispatch = useDispatch<Dispatch<ManifestConfigurationActions>>();
    //Selectors
    const manifestTypeList= useTypedSelector(state=> state.manifestConfiguration.maifestTypeList)    
    const generateManifestPayload:GenerateManifestPayload= useTypedSelector(state=> state.manifestConfiguration.generateManifestPayload)

    const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.maifestTypeList}`)
    //Constants
    const [expanded, setExpanded] = React.useState('1')
    const [dropdownValues, setDropDownValues] = useState<ManifestTypeList[]>([])

    const [sequence, setSequence] = React.useState(1)
    const [resultValue, setResultValue]  = React.useState('')
    const [generateList, setGenerateList] = useState<GenerateManifestList[]>([]);
    const userAccessInfo: IUserAccessInfo = JSON.parse(localStorage.getItem('userAccessInfo') || '{}');
    
    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        setExpanded(isExpanded ? accordianId : '')
    } 
    const initialState= {
        clientRefMasterType:'MILEMANIFESTTYPE',
        clientRefMasterCd: "",
        clientRefMasterDesc: "",
        sequence:dropdownValues.length+1,
        add:true,
    }

    const handleAddManifestType= ()=>{
        setDropDownValues([...dropdownValues,initialState] )
    }

    useEffect(()=>{
        dispatch({
            type: "@@manifestonfiguration/FETCH__MANIFEST_TYPE"
          });
    },[])

    // fetch generate manifest data
    useEffect(()=>{
        dispatch({
                type: "@@manifestonfiguration/FETCH__GENERATE_MANIFEST"
        });
    },[])

    // get sample value
    useEffect(()=>{
        let updatedResultValue = '';
        generateList.forEach(data => {
            if(data.manifestType === 'String') {
                if(data.manifestConfiOne === 'all') {
                    updatedResultValue += data.manifestSampleValue;
                } else if(data.manifestConfiOne === 'beginning') {
                    updatedResultValue += data.manifestSampleValue.slice(0,+data.manifestConfiThree);
                } else if(data.manifestConfiOne === 'end') {
                    updatedResultValue += data.manifestSampleValue.slice(-(+data.manifestConfiThree));
                } else {                    
                    updatedResultValue += data.manifestSampleValue.substr(+data.manifestConfiTwo-1,+data.manifestConfiThree);
                }
            } else if(data.manifestType === 'Date') {
                if(data.manifestConfiOne === 'M') {
                    let value = moment(new Date(data.manifestSampleValue)).format('MM');
                    updatedResultValue += value.slice(-1);
                } else if(data.manifestConfiOne === 'Y') {
                    let value = moment(new Date(data.manifestSampleValue)).format('YY');
                    updatedResultValue += value.slice(-1);
                } else {
                    updatedResultValue += moment(new Date(data.manifestSampleValue)).format(data.manifestConfiOne);
                }
            } else if(data.manifestType === 'Integer') {
                let value = data.manifestSampleValue.split('.')[0];
                if(data.manifestConfiOne === 'all') {
                    updatedResultValue += value;
                } else {
                    if(+data.manifestConfiTwo > value.length) {
                        updatedResultValue += value.padStart(data.manifestConfiTwo, '0');
                    } else {
                        updatedResultValue += value.slice(-(+data.manifestConfiTwo));
                    }
                }
            } else if(data.manifestType === 'Decimal') {
                if(data.manifestConfiOne === 'all') {
                    updatedResultValue += data.manifestSampleValue;
                } else {
                    let value = data.manifestSampleValue.split('.');
                    if(data.manifestConfiOne === 'int') {
                        if(+data.manifestConfiTwo > value[0].length) {
                            updatedResultValue += value[0].padStart(data.manifestConfiTwo, '0');
                        } else {
                            updatedResultValue += value[0].slice(-(+data.manifestConfiTwo));
                        }
                    } else {
                        if(value[1]) {
                            if(+data.manifestConfiTwo > value[1].length) {
                                updatedResultValue += value[1].padEnd(data.manifestConfiTwo, '0');
                            } else {
                                updatedResultValue += value[1].slice(0,+data.manifestConfiTwo);
                            }
                        }
                    }
                }
            } else if (data.manifestType === 'Text') {
                updatedResultValue += data.manifestSampleValue;
            } else if (data.manifestType === 'Whitespace') {
                updatedResultValue += ' ';
            }
        });
        setResultValue(updatedResultValue);
    },[generateList]);

    // add db formula in UI rows
    useEffect(()=>{
        if(typeof generateManifestPayload !== 'undefined' && generateManifestPayload.generatedSample !== '' && typeof generateManifestPayload.fieldData !== 'undefined' && generateList.length === 0) {
            const updateData = generateManifestPayload.fieldData?.map((data,index) => {
                return{
                    ...data,
                    sequence:index+1
                }
            })
            setResultValue(generateManifestPayload.generatedSample);
            setGenerateList(updateData);
            setSequence(updateData.length+1);
        }     
    },[generateManifestPayload])

    // validate form
    const validateForm = () => {
        let isFormValid = true;
        const newGenerateList:GenerateManifestList[] = [];
        generateList.forEach((data,index) => {
            let manifestConfiOneError = false, manifestConfiTwoError = false, manifestConfiThreeError = false, manifestSampleValueError = false;
            let { manifestConfiTwoErrorType, manifestConfiThreeErrorType, manifestSampleValueErrorType } = data;
            if(typeof manifestConfiTwoErrorType === 'string' && manifestConfiTwoErrorType !== '') {
                isFormValid = false;
                manifestConfiTwoError = true;
            }
            if(typeof manifestConfiThreeErrorType === 'string' && manifestConfiThreeErrorType !== '') {
                isFormValid = false;
                manifestConfiThreeError = true;
            }
            if(typeof manifestSampleValueErrorType === 'string' && manifestSampleValueErrorType !== '') {
                isFormValid = false;
                manifestSampleValueError = true;
            }
            if(data.manifestType === 'String') {
                if((data.manifestConfiOne === 'beginning' && data.manifestConfiThree === '') || (data.manifestConfiOne === 'end' && data.manifestConfiThree === '')) {
                    manifestConfiThreeError = true;
                    manifestConfiThreeErrorType = 'required';
                    isFormValid = false;
                } else if(data.manifestConfiOne === 'inBetween') {
                    if(data.manifestConfiTwo === '') {
                        manifestConfiTwoError = true;
                        manifestConfiTwoErrorType = 'required';
                        isFormValid = false;
                    }
                    if(data.manifestConfiThree === '') {
                        manifestConfiThreeError = true;
                        manifestConfiThreeErrorType = 'required';
                        isFormValid = false;
                    }
                }
            } else if(data.manifestType === 'Integer') {
                if(data.manifestConfiTwo === '' && data.manifestConfiOne !== 'all') {
                    manifestConfiTwoError = true;
                    manifestConfiTwoErrorType = 'required';
                    isFormValid = false;
                }
            } else if(data.manifestType === 'Decimal') {
                if(data.manifestConfiTwo === '' && data.manifestConfiOne !== 'all') {
                    manifestConfiTwoError = true;
                    manifestConfiTwoErrorType = 'required';
                    isFormValid = false;
                }
            } else if (data.manifestType === 'Text') {
                if(data.manifestConfiOne === '') {
                    manifestConfiOneError = true;
                    isFormValid = false;
                }
            }
            if(data.manifestField !== 'whitespace' && data.manifestSampleValue === '') {
                manifestSampleValueError = true;
                manifestSampleValueErrorType = 'required';
                isFormValid = false;
            }
            newGenerateList[index] = {...data, manifestConfiOneError, manifestConfiTwoError, manifestConfiThreeError, manifestSampleValueError, manifestConfiTwoErrorType, manifestConfiThreeErrorType, manifestSampleValueErrorType}
        });
        setGenerateList(newGenerateList)
        return isFormValid;
    }

    // get formula from values 
    const getFormula = () => {
        let formula = '';
        generateList.forEach((data,i) => {
            if(i===0) {
                formula += 'concat(';
            }
            if(data.manifestType === 'String') {
                if(data.manifestConfiOne === 'all') {
                    formula += `valueOf(${data.manifestField})`;
                } else if(data.manifestConfiOne === 'beginning') {
                    formula += `prefix(valueOf(${data.manifestField}),${data.manifestConfiThree})`;
                } else if(data.manifestConfiOne === 'end') {
                    formula += `suffix(valueOf(${data.manifestField}),${data.manifestConfiThree})`;
                } else {
                    formula += `subString(valueOf(${data.manifestField}),${data.manifestConfiTwo},${data.manifestConfiThree})`;
                }
            } else if(data.manifestType === 'Date') {
                const dateValue = data.manifestConfiOne.replace("DD", "dd")
                formula += `dateFormat(valueOf(${data.manifestField},now()),${dateValue})`;
            } else if(data.manifestType === 'Integer') {
                if(data.manifestConfiOne === 'all') {
                    if(data.manifestField === 'dispatchNum') {
                        formula += `uniqueDispatchNumber()`;
                    } else {
                        formula += `valueOf(${data.manifestField})`;
                    }
                } else {
                    if(data.manifestField === 'dispatchNum') {
                        formula += `intFormat(uniqueDispatchNumber(),${data.manifestConfiTwo})`;
                    } else {
                        formula += `intFormat(valueOf(${data.manifestField}),${data.manifestConfiTwo})`;
                    }
                }
            } else if(data.manifestType === 'Decimal') {
                let format = 'fractionFormat';
                if(data.manifestConfiOne === 'int') {
                    format = 'intFormat';
                }
                if(data.manifestConfiOne === 'all') {
                    formula += `valueOf(${data.manifestField})`;
                } else {
                    formula += `${format}(valueOf(${data.manifestField}),${data.manifestConfiTwo})`;
                }
            } else if (data.manifestType === 'Text') {
                formula += `${data.manifestConfiOne}`;
            } else if (data.manifestType === 'Whitespace') {
                formula += 'space()';
            }
            if((i+1) < generateList.length) {
                formula += ', ';
            } else {
                formula += ')';
            }
        });
        return formula;
    }

    const saveGenerateManifest = async () => {
        if(!validateForm()) {
            toast.add('Validation error', 'warning', false)
            return false;
        }; 
        sendGA('Manifest Configuration',  'Save Manifest Configuration');
        const formula = getFormula();
        const apiBody:GenerateManifestPayload = {
            formula: formula,
            generatedSample: resultValue,
            clientId: userAccessInfo?.clientId,
            fieldData: generateList
        }
        try{
            const { data: { message , status} }  = await axios.post(apiMappings.manifestConfiguration.saveManifestFormula, apiBody)

            if (status === 200) {
                toast.add(message, 'check-round', false)
                dispatch({
                    type: "@@manifestonfiguration/SET__GENERATE_MANIFEST",
                    payload: apiBody
                });
                return
            }
        } catch (errorMessage) {
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, 'warning', false)
        }
    }

    useEffect(()=>{
        if(manifestTypeList?.length>0){
         let transformedList=  manifestTypeList.map((list:ManifestTypeList, index:number)=> { 
             return{
                 ...list,
                 index:index
             }
         })  
         setDropDownValues(transformedList)
        }
    },[manifestTypeList])

    const handleDrag = (newState: any) => {
        newState.forEach((obj: any, index: number) => {
                obj.fieldSequence = index+1,
                obj.sequence = index+1
        });
        setDropDownValues(newState);
    }

    const addValuesInDropDown =(val:string,index:number, fieldName:string)=>{
       let newDropDownValues = dropdownValues
        newDropDownValues[index]={
            ...newDropDownValues[index],
            [fieldName]: val
        }
        setDropDownValues(newDropDownValues)
    }

    const saveManifestTypes =async () =>{
        const uniQueManifestArray= dropdownValues.map((value:ManifestTypeList)=>{
            return value.clientRefMasterCd
        })
        const isDuplicate= new Set(uniQueManifestArray).size !== dropdownValues.length
        if(!isDuplicate){
        const { data: { message , status} }  = await axios.put(apiMappings.manifestConfiguration.saveManifestTypes+'&CLIENT_SECRET_KEY='+userAccessInfo.CLIENT_SECRET_KEY+'access_token='+userAccessInfo.accessToken, dropdownValues)
       try{
        if (status === 200) {
          toast.add(message, 'check-round', false)
          setDropDownValues(dropdownValues.map((dropdownValue:ManifestTypeList)=>{
              return {...dropdownValue,add:false}
          }))
          return
        }
      } catch (errorMessage) {
        toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
      }
    }
        else{
            toast.add('Duplicates not allowed.', 'warning', false)
        }
    }

    const handleSave = () => {
        console.log({dropdownValues})
        const uniQueManifestArray= dropdownValues.map((value:ManifestTypeList)=>{
            return value.clientRefMasterCd.toLowerCase()
        })
        const isDuplicate= new Set(uniQueManifestArray).size !== uniQueManifestArray.length
        if(!isDuplicate) {
            saveManifestTypes();
            saveGenerateManifest()
        } else {
            toast.add('Duplicates not allowed.', 'warning', false)
        }
    }

    return (
       <ManifestConfigurationWrapper>
      <Box display='block' style={{ minHeight: 'calc(100vh - 130px)', height: 'auto', backgroundColor: '#fff', boxShadow: "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)" ,display:'flex', flexDirection: "column",width: "-webkit-fill-available", alignItems: "inherit", justifyContent: "space-between"}} py='15px' px="15px">
        <div>
            <Accordion id="1" expanded={expanded === '1'} onToggle={handleToggle}>
                {{
                    header: (
                        <>
                            <AccordionHeaderTitle>{dynamicLabels.manifest_s} Category</AccordionHeaderTitle>
                        </>
                    ),
                    content: (
                        <AccordionContent style={{paddingTop:"30px"}}  >
                            <div className="dropdownOptionsWrapper">
                                <Grid  container style={{ margin: '0px', padding: '10px 0px', display: 'flex', alignItems: 'center', borderBottom: "1px solid #eeeeee" }}>
                                    <Grid item md={3} className='grid-item' style={{paddingLeft: '20px'}} >
                                        <Typography fontWeight={600}>Sequence</Typography> 
                                    </Grid>
                                    <Grid item md={3} className='grid-item'>
                                    <Typography fontWeight={600}>{dynamicLabels.manifest_s} Category</Typography>
                                    </Grid>
                                    <Grid item md={3} className='grid-item'>
                                    <Typography fontWeight={600}>Description</Typography>
                                    </Grid>
                                    <Grid item md={3} className='grid-item'>
                                    <Typography fontWeight={600}>Action</Typography>
                                    </Grid>
                                </Grid>
                            </div>
                            <DraggableComponent sort={true} list={dropdownValues} setList={(newState: any) => {
                                handleDrag(newState);
                            }}>                
                                {dropdownValues?.map((dropdownRow: any, index:number) => {
                                    return <div className="dropdownOptionsWrapper" key={dropdownRow.id}>
                                        <Grid key={dropdownRow.id} container style={{ margin: '0px', padding: '10px 0px', display: 'flex', alignItems: 'center', borderBottom: "1px solid #eeeeee" }}>
                                            <Grid item md={3} className='grid-item' style={{display:'flex'}}>
                                                <img src="images/Drag_Drop-Gray.svg" className="item-img" height="20px"  style={{marginRight: '20px'}} />
                                                <Typography>{index+1}</Typography>
                                            </Grid>
                                            <Grid item md={3} className='grid-item'>
                                            { dropdownRow?.add ? 
                                            <>
                                            <input defaultValue={dropdownRow.clientRefMasterCd} type="text" className="dotted-input" onChange={(e:any)=>{
                                                addValuesInDropDown(e.target.value,index,'clientRefMasterCd')
                                                }}/>
                                            </> 
                                            : dropdownRow.clientRefMasterCd }
                                            </Grid>
                                            <Grid item md={3} className='grid-item'> 
                                            { dropdownRow?.add ? 
                                            <>
                                            <input defaultValue={dropdownRow.clientRefMasterDesc} type="text" className="dotted-input" onChange={(e:any)=>{
                                                    addValuesInDropDown(e.target.value,index,'clientRefMasterDesc')}
                                                    }/>
                                            </> 
                                            : dropdownRow.clientRefMasterDesc}
                                            </Grid>
                                            <Grid item md={3} className='grid-item'>
                                            <IconButton
                                                iconVariant="delete-thin"
                                                onClick={() => {setDropDownValues(dropdownValues.filter((list:ManifestTypeList , i:number) =>i!==index ))}}
                                                onlyIcon
                                                iconSize='sm'
                                            >
                                                
                                            </IconButton>
                                            </Grid>
                                        </Grid>
                                    </div>
                                })}
                            </DraggableComponent>
                            <IconButton
                                className="addDeliveryBtn"
                                intent="table"
                                id="manifest-add"
                                iconVariant="icomoon-add"
                                iconSize={13}
                                onClick={()=>{handleAddManifestType()}}>
                                    Add {dynamicLabels.manifest_s} Category
                            </IconButton>
                        </AccordionContent>
                    )
                }}
            </Accordion>
                { userAccessInfo && userAccessInfo['superType'] === 'MIDDLEMILE' &&
                    <GenerateManifestId
                    generateList={generateList}
                    sequence={sequence}
                    resultValue={resultValue}
                    setSequence={setSequence}
                    setGenerateList={setGenerateList}
                    handleToggle={handleToggle}
                    expanded={expanded}
                />
                }
        </div>

        <IconButton
            intent="table"
            id="manifest-actionBar-save"
            iconVariant="icomoon-save"
            iconSize={19}
            primary
            onClick={() =>{ handleSave();}}>Save</IconButton>
        </Box>
       </ManifestConfigurationWrapper>
    )
}

export default ManifestConfiguration;
