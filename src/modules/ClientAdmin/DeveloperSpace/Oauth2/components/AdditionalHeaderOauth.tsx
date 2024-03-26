import React, { useEffect, useState } from "react";
import { Box, Grid, TextInput, IconButton } from "ui-library";
import { theme } from "../../../../../utils/theme";
import { FontIconContainer, IncrementDecrementGrid } from "../../WebhookProfile/subComponents/styledComponents";
import { findAllDuplicateIndices } from "../../../../../utils/helper";
export interface IAdditionalWebhookRecord {
  key: string  ,
   value : string ;
}

interface IAdditionalHeaderProps {
    slabs?: any
    setSlabs?: any
    formInstance?: any
    dynamicLabels?: any 
}

const AdditionalHeaders = (props: IAdditionalHeaderProps) => {

    const { slabs ,setSlabs ,formInstance ,dynamicLabels} = props;
    const { errors ,setError ,clearErrors }  = formInstance
    const handleAddSlab = (currentIndex) => {
        const lastSlab = slabs[slabs.length - 1]
        if(lastSlab.key === '' || lastSlab.value === ''  ){
            lastSlab.key === '' && setError(`header-${currentIndex}`,{type :'required' })
            lastSlab.value === '' &&  setError(`value-${currentIndex}`,{type :'required'})
        }
        else{
         setSlabs([...slabs, { key: '', value: '' }]);
        } 
    };

    const handleDeleteSlab = (index) => {
        debugger
        const updatedSlabs = [...slabs];
        updatedSlabs.splice(index, 1);
        setSlabs(updatedSlabs);
    };


    const [duplicatedIndices ,setDuplicateIndices] = useState([])

    const handleChange = (index, field, value) => {
        const updatedSlabs = [...slabs];
        updatedSlabs[index][field] = value;
        setSlabs(updatedSlabs);
        if(field === 'key'){
           const headers = slabs.map((item)=>item.key)
            const allDuplicateIndices = findAllDuplicateIndices(headers)
            setDuplicateIndices(allDuplicateIndices)
            if(allDuplicateIndices.length > 0 ){
                allDuplicateIndices.forEach((index)=>{
                    setError(`header-${index}`,{type :'duplicated' })
                })
            }else{
                duplicatedIndices.forEach((index)=>{
                clearErrors(`header-${index}`)
                })
            }
            if(value==''){
                setError(`header-${index}`,{type :'required' })
            }else{
                clearErrors(`header-${index}`)
            }
        }
        if(field === 'value'){
            if(value==''){
                setError(`value-${index}`,{type :'required' })
            }else{
                clearErrors(`value-${index}`)
            }
        }
    };
    useEffect(() => {
        if (slabs?.length) {
          setSlabs(slabs);
        } else {
          setSlabs([{ key : '', value: '' }]);
        }
      }, [slabs]);

      const additionalHeaderErrorMessages = {
        required: dynamicLabels?.headerMandatory ||   "Header cannot be blank.",
        pattern:  dynamicLabels?.invalidHeaderName ||  'Invalid Header Name.',
        duplicated: dynamicLabels?.uniqueHeaderValidation ||  "Header name must be unique."
    }

    const additionalHeaderValueErrorMessages = {
        required:  dynamicLabels?.valueMandatory || "Value cannot be blank.",
        pattern:  dynamicLabels?.invalidHeaderValue ||'Invalid Header Value.'
    }

    return (
        <Box display='flex' flexDirection='column' style={{ width: '100%' }} justifyContent="space-between">

            {slabs.length > 0 ?
                slabs.map((header: IAdditionalWebhookRecord, index: number) => {
                    return <Grid key={index} container spacing='15px'>

                        <Grid item xs={6} sm={6} md={4} lg={3}>
                            <TextInput
                                id={`header-${index}`}
                                name={`header-${index}`}
                                className={`header-${index}`}
                                label={'Header'}
                                labelColor={theme.colors.text.inputLabel.default}
                                placeholder={ 'Header'}
                                maxLength={255}
                                error= {errors[`header-${index}`]}
                                errorMessage ={errors[`header-${index}`] &&  additionalHeaderErrorMessages[errors[`header-${index}`].type]}
                                required={false}
                                onChange={(e) => handleChange(index, 'key', e.target.value)}
                                fullWidth={true}
                                onBlur={(e) => handleChange(index, 'key', e.target.value)}
                                arrowPlacement='center'
                                messagePlacement='start'
                                tooltipDirection='bottom'
                                disabled={false}
                                width="100%"
                                value={header.key}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={3}>
                            <TextInput
                                id= {`value-${index}`}
                                name= {`value-${index}`}
                                className= {`value-${index}`}
                                label={'Value'}
                                labelColor={theme.colors.text.inputLabel.default}
                                placeholder={ 'Value'}
                                maxLength={1024}
                                onChange={(e) => handleChange(index, 'value', e.target.value)}
                                error= {errors[`value-${index}`]}
                                errorMessage ={errors[`value-${index}`] &&  additionalHeaderValueErrorMessages[errors[`value-${index}`].type]}
                                required={false}
                                fullWidth={true}
                                onBlur={(e) => handleChange(index, 'value', e.target.value)}
                                arrowPlacement='center'
                                messagePlacement='start'
                                tooltipDirection='bottom'
                                disabled={false}
                                width="100%"
                                value={header.value}
                               
                            />
                        </Grid>
                        <IncrementDecrementGrid item xs={6} sm={6} md={1} lg={1}>
                            {(slabs.length > 1 ? true : index > 0) && <FontIconContainer className="danger"><IconButton onClick={() => handleDeleteSlab(index)} circle iconSize={11} iconVariant='icomoon-close' className="deleteWebhookHeader" /> </FontIconContainer>}
                            {index < 9 && <FontIconContainer><IconButton onClick={() => handleAddSlab(index)} circle primary iconSize={11} iconVariant='icomoon-add' /></FontIconContainer>}
                        </IncrementDecrementGrid>
                    </Grid>
                })
            : "No Additional Headers"}
        </Box>
    )
}

export default AdditionalHeaders;