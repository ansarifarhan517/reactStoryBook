import React from 'react'
import { IconButton, Accordion, AccordionHeaderTitle, AccordionHeaderSubTitle, AccordionContent, Box} from 'ui-library'
import { DraggableComponent } from "../../../../utils/components/Draggable/DraggableComponent";
import { GenerateManifestIdWrapper } from './GenerateManifestId.styled'
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import moment from 'moment';
import GenerateManifestTableHeader from './GenerateManifestTableHeader';
import GenerateManifestTableBody from './GenerateManifestTableBody';
import { charOptionList, dateOptionList, intOptionList, deciOptionList } from '../../../../utils/constants';

const GenerateManifestId = (props:any) => {
    const {generateList, sequence, resultValue, expanded} = props;
    //Selectors
    const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.generateManifestConfiguration}`)
    
    const initialState= {
        manifestType: '',
        manifestField: '',
        manifestConfiSelect: [],
        manifestConfiOne:'',
        manifestConfiTwo: '',
        manifestConfiThree: '',
        manifestSampleValue: '',
        manifestConfiOneError: false,
        manifestConfiTwoError: false,
        manifestConfiThreeError: false,
        manifestSampleValueError: false,
        sequence:sequence,
    }
    const lengthValidtions = {
        manifestConfiTwo: {
            originBranchCd: {
                min: 1,
                max: 255
            },
            destBranchCd: {
                min: 1,
                max: 255
            },
            totalOrders: {
                min: 2,
                max: 5
            },
            totalCrates: {
                min: 2,
                max: 5
            },
            serviceTypeCd: {
                min: 1,
                max: 255
            },
            dispatchNum: {
                min: 2
            },
            bagNum: {
                min: 2
            },
            manifestWght: {
                min: 1
            },
            manifestVol: {
                min: 1
            },
        },
        manifestConfiThree: {
            originBranchCd: {
                min: 1,
                max: 20
            },
            destBranchCd: {
                min: 1,
                max: 20
            },
            serviceTypeCd: {
                min: 1,
                max: 255
            }
        },
        manifestSampleValue: {
            String: {
                min: 1,
                max: 255
            },
            Integer: {
                min: 1,
                max: 9999
            },
            Decimal: {
                min: 1
            },
        }
    }

    const handleAddManifestType= ()=>{
        props.setSequence(sequence => sequence+1)
        props.setGenerateList([...generateList,initialState] )
    }

    const handleDrag = (newState: any) => {
        newState.forEach((obj: any, index: number) => {
                obj.fieldSequence = index+1
        });
        props.setGenerateList(newState);
    } 

    const addValuesInDropDown =(val:string, index:number, fieldName:string)=>{
        let { manifestType, manifestField, manifestConfiSelect, manifestConfiOne, manifestConfiTwo, manifestConfiTwoError, manifestConfiTwoErrorType, manifestConfiThree, manifestConfiThreeError, manifestConfiThreeErrorType, manifestSampleValue, manifestSampleValueError, manifestSampleValueErrorType } = generateList[index];
        if(fieldName === 'manifestField') {
            if(val === 'originBranchCd' || val === 'destBranchCd' || val === 'serviceTypeCd') {
                manifestType = 'String';
                manifestConfiSelect = [...charOptionList];
                manifestConfiOne = 'beginning';
                manifestConfiTwo = '';
                manifestConfiThree = '3';
                if(val === 'serviceTypeCd') {
                    manifestSampleValue = 'Express';
                } else {
                    manifestSampleValue = 'NYC - New York Hub';
                }
            } else if (val === 'createdOnDt') {
                manifestType = 'Date';
                manifestConfiSelect = [...dateOptionList];
                manifestConfiOne = 'MMDDYYYY';
                manifestSampleValue = moment(new Date()).format("MM-DD-YYYY");
            } else if (val === 'totalOrders' || val === 'totalCrates' || val === 'dispatchNum' || val === 'bagNum') {
                manifestType = 'Integer';
                manifestConfiSelect = [...intOptionList];
                manifestConfiOne = 'exact';
                manifestConfiTwo = '2';
                manifestSampleValue = '10';
            } else if (val === 'manifestWght' || val === 'manifestVol') {
                manifestType = 'Decimal';
                manifestConfiSelect = [...deciOptionList];
                manifestConfiOne = 'all';
                manifestConfiTwo = '';
                manifestSampleValue = '10.1';
            } else if (val === 'text') {
                manifestType = 'Text';
                manifestConfiOne = '';
                manifestConfiTwo = '';
                manifestConfiThree = '';
                manifestSampleValue = '';
            } else if (val === 'whitespace') {
                manifestType = 'Whitespace';
                manifestConfiOne = '';
                manifestConfiTwo = '';
                manifestConfiThree = '';
                manifestSampleValue = '';
            }
            manifestConfiTwoError = false;
            manifestConfiThreeError = false;
            manifestSampleValueError = false;
            manifestConfiTwoErrorType = '';
            manifestConfiThreeErrorType = '';
            manifestSampleValueErrorType = '';
        }
        if(fieldName === 'manifestConfiOne') {
            if(manifestType === 'String') {
                if(val === 'beginning') {
                    manifestConfiTwo = '';
                    manifestConfiThree = '3';
                } else if(val === 'end') {
                    manifestConfiTwo = '';
                    manifestConfiThree = '3';
                } else if(val === 'all') {
                    manifestConfiTwo = '';
                    manifestConfiThree = '';
                } else if(val === 'inBetween') {
                    manifestConfiTwo = '1';
                    manifestConfiThree = '3';
                }
            }
            else if(manifestType === 'Integer') {
                if(val === 'all') {
                    manifestConfiTwo = '';
                } else {
                    manifestConfiTwo = '2';
                }
            }
            else if(manifestType === 'Decimal') { 
                if(val === 'all') {
                    manifestConfiTwo = '';
                } else {
                    manifestConfiTwo = '2';
                }
            }            
            else if(manifestType === 'Text') {
                manifestSampleValue = val;
            }
            manifestConfiTwoError = false;
            manifestConfiThreeError = false;
            manifestSampleValueError = false;
            manifestConfiTwoErrorType = '';
            manifestConfiThreeErrorType = '';
            manifestSampleValueErrorType = '';
        }
        if(fieldName === 'manifestConfiTwo') {
            if(val && +val < lengthValidtions.manifestConfiTwo?.[manifestField]?.min) {
                manifestConfiTwoError = true;
                manifestConfiTwoErrorType = 'min';
            } else if(val && +val > lengthValidtions.manifestConfiTwo?.[manifestField]?.max) {
                manifestConfiTwoError = true;
                manifestConfiTwoErrorType = 'max';
            } else if(val.includes('.')) {
                manifestConfiTwoError = true;
                manifestConfiTwoErrorType = 'invalid';
            } else {
                manifestConfiTwoError = false;
                manifestConfiTwoErrorType = '';
            }
        }
        if(fieldName === 'manifestConfiThree') {
            if(val && +val < lengthValidtions.manifestConfiThree?.[manifestField]?.min) {
                manifestConfiThreeError = true;
                manifestConfiThreeErrorType = 'min';
            } else if(val && +val > lengthValidtions.manifestConfiThree?.[manifestField]?.max) {
                manifestConfiThreeError = true;
                manifestConfiThreeErrorType = 'max';
            } else if(val.includes('.')) {
                manifestConfiThreeError = true;
                manifestConfiThreeErrorType = 'invalid';
            } else {
                manifestConfiThreeError = false;
                manifestConfiThreeErrorType = '';
            }
        }
        if(fieldName === 'manifestSampleValue') {
            if(val && lengthValidtions.manifestSampleValue?.[manifestType]?.min) {
                const number = manifestType === 'String' ? val.length : +val;
                if(number < lengthValidtions.manifestSampleValue[manifestType].min) {
                    manifestSampleValueError = true;
                    manifestSampleValueErrorType = 'min';
                } else if(number > lengthValidtions.manifestSampleValue[manifestType].max) {
                    manifestSampleValueError = true;
                    manifestSampleValueErrorType = 'max';
                } else {
                    manifestSampleValueError = false;
                    manifestSampleValueErrorType = '';
                }
            } else {
                manifestSampleValueError = false;
                manifestSampleValueErrorType = '';
            }
        }
        const updatedItem = {
            ...generateList[index],
            manifestType, manifestConfiSelect, manifestConfiOne, manifestConfiTwo, manifestConfiTwoError, manifestConfiTwoErrorType, manifestConfiThree, manifestConfiThreeError, manifestConfiThreeErrorType, manifestSampleValue, manifestSampleValueError, manifestSampleValueErrorType,
            [fieldName]: val,
        }
        const newGenerateList = [
            ...generateList.slice(0,index),
            updatedItem,
            ...generateList.slice(index+1)
        ]
        props.setGenerateList(newGenerateList)
    }
    
    return (
        <>
        <Accordion id='2' expanded={expanded === '2'} onToggle={props.handleToggle}>
        {{
          header: (
            <>
              <AccordionHeaderTitle>{dynamicLabels.generateManifestAccordianHeader}</AccordionHeaderTitle>
              <AccordionHeaderSubTitle>{dynamicLabels.generateManifestAccordianDescription}</AccordionHeaderSubTitle>
            </>
          ),
          content: (
            <AccordionContent>
            <GenerateManifestIdWrapper>

                <GenerateManifestTableHeader 
                    dynamicLabels={dynamicLabels}
                />

                <DraggableComponent 
                    sort={true} 
                    list={generateList} 
                    setList={(newState: any) => {handleDrag(newState);}}
                >
                    {generateList?.map((generateRow: any, index:number) => <GenerateManifestTableBody
                        key={generateRow.sequence}
                        generateRow={generateRow}
                        generateList={generateList}
                        index={index}
                        dynamicLabels={dynamicLabels}
                        addValuesInDropDown={addValuesInDropDown}
                        setGenerateList={props.setGenerateList}
                    />)} 
                </DraggableComponent>

                <IconButton
                    className="addDeliveryBtn"
                    intent="table"
                    id="manifest-add"
                    iconVariant="icomoon-add"
                    iconSize={13}
                    onClick={()=>{handleAddManifestType()}}>
                      {dynamicLabels.generateManifestAddParameter}
                </IconButton>

                <Box className="card" style={{wordBreak: 'break-all'}}>
                    {dynamicLabels.generateManifestIdSample}: 
                    <strong> {resultValue !== '' ? resultValue : dynamicLabels.empty}</strong>
                </Box>
            </GenerateManifestIdWrapper>
            </AccordionContent>
          )
        }}
        </Accordion>
        </>
    )
}

export default GenerateManifestId