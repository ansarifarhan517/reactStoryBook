import React from 'react'
import { Grid, DatePicker, TextInput, IconButton, Tooltip } from 'ui-library'
import { GenerateManifestList } from './ManifestConfiguration.model'
import moment from 'moment';
import Select from 'react-select';

const GenerateManifestTableBody = (props:any) => {
    const { dynamicLabels, generateList, generateRow, index } = props;
    const FieldoptionList = [
        { value: 'originBranchCd', label: dynamicLabels.manifestOriginBranchCode},
        { value: 'destBranchCd', label: dynamicLabels.manifestNextBranchCode },
        { value: 'createdOnDt', label: dynamicLabels.date },
        { value: 'totalOrders', label: dynamicLabels.manifestCountOfOrder},
        { value: 'totalCrates', label: dynamicLabels.manifestCountOfCrate},
        { value: 'serviceTypeCd', label: dynamicLabels.manifestServiceType },
        { value: 'dispatchNum', label: dynamicLabels.manifestUniqueDispatchNumber },
        { value: 'bagNum', label:  dynamicLabels.manifestBagNumber },
        { value: 'manifestWght', label: dynamicLabels.manifestWeight },
        { value: 'manifestVol', label: dynamicLabels.manifestVolume },
        { value: 'whitespace', label: dynamicLabels.manifestWhitespace },
        { value: 'text', label: dynamicLabels.manifestText }
    ];
    const descriptions = {
        manifestField: dynamicLabels.descriptionManifestField,
        originBranchCd: {
            manifestConfiOne: dynamicLabels.descriptionOriginBranchCdOne,
            manifestConfiTwo: dynamicLabels.descriptionOriginBranchCdTwo,
            manifestConfiThree: dynamicLabels.descriptionOriginBranchCdThree,
            manifestSampleValue: dynamicLabels.descriptionOriginBranchCdSample
        },
        destBranchCd: {
            manifestConfiOne: dynamicLabels.descriptionOriginBranchCdOne,
            manifestConfiTwo: dynamicLabels.descriptionOriginBranchCdTwo,
            manifestConfiThree: dynamicLabels.descriptionOriginBranchCdThree,
            manifestSampleValue: dynamicLabels.descriptionOriginBranchCdSample
        },
        createdOnDt: {
            manifestConfiOne: dynamicLabels.descriptionCreatedOnDtOne,
            manifestSampleValue: dynamicLabels.descriptionCreatedOnDtSample
        },
        totalOrders: {
            manifestConfiOne: dynamicLabels.descriptionTotalOrdersOne,
            manifestConfiTwo: dynamicLabels.descriptionTotalOrdersTwo,
            manifestSampleValue: dynamicLabels.descriptionTotalOrdersSample,
        },
        totalCrates: {
            manifestConfiOne: dynamicLabels.descriptionTotalOrdersOne,
            manifestConfiTwo: dynamicLabels.descriptionTotalCratesTwo,
            manifestSampleValue: dynamicLabels.descriptionTotalCratesSample,
        },
        serviceTypeCd: {
            manifestConfiOne: dynamicLabels.descriptionServiceTypeCdOne,
            manifestConfiTwo: dynamicLabels.descriptionServiceTypeCdTwo,
            manifestConfiThree: dynamicLabels.descriptionServiceTypeCdThree,
            manifestSampleValue: dynamicLabels.descriptionServiceTypeCdSample
        },
        dispatchNum: {
            manifestConfiOne: dynamicLabels.descriptionTotalOrdersOne,
            manifestConfiTwo: dynamicLabels.descriptionDispatchNumTwo,
            manifestSampleValue: dynamicLabels.descriptionDispatchNumSample,
        },
        bagNum: {
            manifestConfiOne: dynamicLabels.descriptionTotalOrdersOne,
            manifestConfiTwo: dynamicLabels.descriptionBagNumTwo,
            manifestSampleValue: dynamicLabels.descriptionBagNumSample
        },
        manifestWght: {
            manifestConfiOne: dynamicLabels.descriptionManifestWghtOne,
            manifestConfiTwo: dynamicLabels.descriptionManifestWghtTwo,
            manifestSampleValue: dynamicLabels.descriptionManifestWghtSample
        },
        manifestVol: {
            manifestConfiOne: dynamicLabels.descriptionManifestWghtOne,
            manifestConfiTwo: dynamicLabels.descriptionManifestVolTwo,
            manifestSampleValue: dynamicLabels.descriptionManifestVolSample,
        },
        text: {
            manifestConfiOne: dynamicLabels.descriptioTextOne,
            manifestSampleValue: dynamicLabels.descriptionTextSample
        }
    }
    const errors = {
        manifestConfiOne: {
            Text: dynamicLabels.errorText
        },
        manifestConfiTwo: {
            originBranchCd: {
                'required': dynamicLabels.errorCountStart,
                'min': dynamicLabels.errorCountStartMinZero,
                'max': dynamicLabels.errorCountStartMaxTFS,
                'invalid': dynamicLabels.errorCountStartValid
            },
            destBranchCd: {
                'required': dynamicLabels.errorCountStart,
                'min': dynamicLabels.errorCountStartMinZero,
                'max': dynamicLabels.errorCountStartMaxTFS,
                'invalid': dynamicLabels.errorCountStartValid
            },
            totalOrders: {
                'required': dynamicLabels.errorNumberOfCharacter,
                'min': dynamicLabels.errorNumberOfCharacterMinOne,
                'max': dynamicLabels.errorNumberOfCharacterMaxSix,
                'invalid': dynamicLabels.errorNumberOfCharacterValid
            },
            totalCrates: {
                'required': dynamicLabels.errorNumberOfCharacter,
                'min': dynamicLabels.errorNumberOfCharacterMinOne,
                'max': dynamicLabels.errorNumberOfCharacterMaxSix,
                'invalid': dynamicLabels.errorNumberOfCharacterValid
            },
            serviceTypeCd: {
                'required': dynamicLabels.errorCountStart,
                'min': dynamicLabels.errorCountStartMinZero,
                'max': dynamicLabels.errorCountStartMaxTFS,
                'invalid': dynamicLabels.errorCountStartValid
            },
            dispatchNum: {
                'required': dynamicLabels.errorNumberOfCharacter,
                'min': dynamicLabels.errorNumberOfCharacterMinOne,
                'invalid': dynamicLabels.errorNumberOfCharacterValid
            },
            bagNum: {
                'required': dynamicLabels.errorNumberOfCharacter,
                'min': dynamicLabels.errorNumberOfCharacterMinOne,
                'invalid': dynamicLabels.errorNumberOfCharacterValid
            },
            manifestWght: {
                'required': dynamicLabels.errorNumberOfCharacter,
                'min': dynamicLabels.errorNumberOfCharacterMinZero,
                'invalid': dynamicLabels.errorNumberOfCharacterValid
            },
            manifestVol: {
                'required': dynamicLabels.errorNumberOfCharacter,
                'min': dynamicLabels.errorNumberOfCharacterMinZero,
                'invalid': dynamicLabels.errorNumberOfCharacterValid
            },
        },
        manifestConfiThree: {
            originBranchCd: {
                'required': dynamicLabels.errorNumberOfCharacter,
                'min': dynamicLabels.errorNumberOfCharacterMinZero,
                'max': dynamicLabels.errorNumberOfCharacterMaxTwenty,
                'invalid': dynamicLabels.errorNumberOfCharacterValid
            },
            destBranchCd: {
                'required': dynamicLabels.errorNumberOfCharacter,
                'min': dynamicLabels.errorNumberOfCharacterMinZero,
                'max': dynamicLabels.errorNumberOfCharacterMaxTwenty,
                'invalid': dynamicLabels.errorNumberOfCharacterValid
            },
            serviceTypeCd: {
                'required': dynamicLabels.errorNumberOfCharacter,
                'min': dynamicLabels.errorNumberOfCharacterMinZero,
                'max': dynamicLabels.errorNumberOfCharacterMaxTFS,
                'invalid': dynamicLabels.errorNumberOfCharacterValid
            },
        },
        manifestSampleValue: {
            String: {   
                'required': dynamicLabels.errorSampleValue,
                'min': dynamicLabels.errorSampleValueMinZero,
                'max': dynamicLabels.errorSampleValueMaxTFS
            },
            Integer: {   
                'required': dynamicLabels.errorSampleValue,
                'min': dynamicLabels.errorSampleValueMinZero,
                'max': dynamicLabels.errorSampleValueMaxTH
            },
            Decimal: {                
                'required': dynamicLabels.errorSampleValue,
                'min': dynamicLabels.errorSampleValueMinZero
            },
            Text: {
                'required': dynamicLabels.errorSampleValue
            }
        },
    }
    const placeholders = {
        String : {
            manifestConfiTwo: dynamicLabels.placeholderCountStartsFrom,
            manifestConfiThree: dynamicLabels.placeholderCharacterCount
        },
        Integer: {
            manifestConfiTwo: dynamicLabels.placeholderCharacterCount
        },
        Decimal: {
            manifestConfiTwo: dynamicLabels.placeholderCharacterCount
        },
        Text: dynamicLabels.placeholderText,
        SampleValue: dynamicLabels.placeholderSampleValue
    }

    return (
        <Grid container style={{ margin: '0px', padding: '10px 0px', display: 'flex', alignItems: 'center', borderBottom: "1px solid #eeeeee", flexWrap: 'nowrap' }}>

            <Grid item style={{width:'30px'}} className='grid-item grid-item-drag'>
                <img src="images/Drag_Drop-Gray.svg" className="item-img" height="20px" />
            </Grid>

            <Grid item className='grid-item grid-item-select'>
              <Tooltip
                message={FieldoptionList.find(item => item.value === generateRow.manifestField)?.label}
                hover
                hide={!FieldoptionList.find(item => item.value === generateRow.manifestField)?.label}
                tooltipDirection={'top'}
              >
                <Select
                    className='custom-select-box'
                    placeholder={'Select'}
                    maxMenuHeight={180}
                    menuPlacement={'auto'}
                    classNamePrefix={"react-select"}
                    value={FieldoptionList.find(item => item.value === generateRow.manifestField)}
                    options={FieldoptionList}
                    onChange = {(e:any)=>props.addValuesInDropDown(e.value, index, 'manifestField')}
                />
                </Tooltip>
            </Grid>

            <Grid item className='grid-item grid-item-select'>
            {(generateRow.manifestField !== '' && generateRow.manifestField !== 'whitespace') ?
            (
                (generateRow.manifestType === 'Text') ?
                <TextInput 
                    value={generateRow.manifestConfiOne} 
                    type="text" 
                    className={generateRow?.manifestConfiOneError ? 'hasError dashed' : 'dashed'} 
                    placeholder={placeholders[generateRow.manifestType]}
                    title={descriptions?.[generateRow.manifestField]?.manifestConfiOne}
                    error={generateRow?.manifestConfiOneError}
                    errorMessage={errors?.['manifestConfiOne']?.[generateRow.manifestType]}
                    onChange={(e:any)=>props.addValuesInDropDown(e.target.value,index,'manifestConfiOne')} 
                /> :
                <Tooltip
                  message={descriptions?.[generateRow.manifestField]?.manifestConfiOne}
                  hover
                  hide={!descriptions?.[generateRow.manifestField]?.manifestConfiOne}
                  tooltipDirection={'top'}
                >
                <Select
                    className='custom-select-box'
                    placeholder={'Select'}
                    maxMenuHeight={180}
                    classNamePrefix={"react-select"}
                    value={generateRow.manifestConfiSelect.find(item => item.value === generateRow.manifestConfiOne)}
                    options={generateRow.manifestConfiSelect}
                    onChange = {(e:any)=>props.addValuesInDropDown(e.value, index, 'manifestConfiOne')}
                />
                </Tooltip>
            )
            : null }
            </Grid>

            <Grid item className='grid-item grid-item-select'>
            {(generateRow.manifestType === 'String' || generateRow.manifestType === 'Integer' || generateRow.manifestType === 'Decimal') ?
            <TextInput 
                value={generateRow.manifestConfiTwo} 
                type="number" 
                className={generateRow?.manifestConfiTwoError ? 'hasError dashed' : 'dashed'}  
                title={descriptions?.[generateRow.manifestField]?.manifestConfiTwo}
                disabled={(generateRow.manifestType === 'String' && generateRow.manifestConfiOne !== 'inBetween') || (generateRow.manifestType === 'Integer' && generateRow.manifestConfiOne === 'all') || (generateRow.manifestType === 'Decimal' && generateRow.manifestConfiOne === 'all')}
                placeholder={placeholders[generateRow.manifestType].manifestConfiTwo}
                error={generateRow?.manifestConfiTwoError}
                errorMessage={errors?.['manifestConfiTwo']?.[generateRow.manifestField]?.[generateRow.manifestConfiTwoErrorType]}
                onChange={(e:any)=>props.addValuesInDropDown(e.target.value,index,'manifestConfiTwo')}
            />
            : null }
            </Grid>

            <Grid item className='grid-item grid-item-select'>
            {(generateRow.manifestType === 'String') ?
            <TextInput 
                value={generateRow.manifestConfiThree} 
                type="number" 
                className={generateRow?.manifestConfiThreeError ? 'hasError dashed' : 'dashed'}  
                title={descriptions?.[generateRow.manifestField]?.manifestConfiThree}
                disabled={generateRow.manifestConfiOne === 'all'} 
                placeholder={placeholders[generateRow.manifestType].manifestConfiThree}
                error={generateRow?.manifestConfiThreeError}
                errorMessage={errors?.['manifestConfiThree']?.[generateRow.manifestField]?.[generateRow.manifestConfiThreeErrorType]}
                onChange={(e:any)=> props.addValuesInDropDown(e.target.value,index,'manifestConfiThree')}
            />
            : null }
            </Grid>

            <Grid item className='grid-item grid-item-select grid-item-select-auto'>
            {(generateRow.manifestField === 'createdOnDt') ?
            <DatePicker
                onChange={(date: any) => {
                    const formattedDate = moment(date).format('MM-DD-YYYY')
                    props.addValuesInDropDown(formattedDate,index,'manifestSampleValue')
                }}
                variant='date'
                style={{ zIndex: 1 }}
            >
                {({ open, setOpen }) => (
                    <div onClick={() => setOpen(!open)}>
                        <TextInput
                            id='sampleDate'
                            name='sampleDate'
                            variant='withIcon'
                            iconVariant='calendar'
                            iconSize='sm'
                            value={generateRow.manifestSampleValue}
                            iconStyle={{ padding: '5px' }}
                            title={descriptions?.[generateRow.manifestField]?.manifestSampleValue}
                        />
                    </div>
                )}
            </DatePicker> :
            <>
            {(generateRow.manifestField !== '' && generateRow.manifestField !== 'whitespace') ? 
            <TextInput 
                value={generateRow.manifestSampleValue} 
                type={(generateRow.manifestType === 'String' || generateRow.manifestType === 'Text') ? 'text' : 'number'}
                maxLength={256}
                className={generateRow?.manifestSampleValueError ? 'hasError dashed' : 'dashed'} 
                title={descriptions?.[generateRow.manifestField]?.manifestSampleValue}
                placeholder={placeholders.SampleValue}
                error={generateRow?.manifestSampleValueError}
                errorMessage={errors?.['manifestSampleValue']?.[generateRow.manifestType]?.[generateRow.manifestSampleValueErrorType]}
                onChange={(e:any)=> props.addValuesInDropDown(e.target.value,index,'manifestSampleValue')} 
            /> 
            : null }
            </> }
            </Grid>

            <Grid item className='grid-item grid-item-action'>
                <IconButton
                    iconVariant="delete-thin"
                    onClick={() => {props.setGenerateList(generateList.filter((list:GenerateManifestList , i:number) =>i!==index ))}}
                    onlyIcon
                    iconSize='sm'>
                </IconButton>
            </Grid>
        </Grid>
    )
}
export default GenerateManifestTableBody;