
import React, { useState, useEffect, Dispatch } from "react"
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";
import {useHistory} from 'react-router-dom'
import {Accordion, useToast, InputField, AccordionHeaderTitle, AccordionHeaderSubTitle,AccordionContent,BreadCrumb,Grid,IconButton,Box } from 'ui-library'
import {InputFiledInAccordian } from "../Pdpa.style";
import PdpaMangementTableComponent from "./PdpaMangementTableComponent";
import {StyledCard, FormButtonContainer} from './PdpaManagementStyledComponent'
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { IConsentManagementListData } from "./ConsentManagement.models";
import { useDispatch } from "react-redux";
import { ConsentManagementActions } from "./ConsentManagement.action";

const PdpaManagementAcc = () => {
    const history = useHistory();
    const [toggle, setShowToggle] = useState(false)
    const [numberOfDays, setNumberOfDays] = useState<number|null>(null)
    const [loginConsent, setLoginConsent] = useState(false);
    const [logoutConsent, setLogoutConsent] = useState(false);
    const [expanded, setExpanded] = useState('1')
    const toast = useToast();
    const [dropDownOptions, setDropDownOptions] = useState([{}])
    const [allDropdownOptions, setAllDropdownOptions] = useState<Array<string>>([]);
    const [tableData, setTableData] = useState<Array<string>>([]);
    const dispatch = useDispatch<Dispatch<ConsentManagementActions>>();
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.consentManagement)
    const commonLabel = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0])
    const consentData = useTypedSelector(state => state.consentManagement.listview.activeConsentData);
    const isAddConsentEnabled = useTypedSelector(state => state.consentManagement.listview.isAddConsentEnabled);


    useEffect(() => {
        //cleanup function for resetting the data
        return () => { dispatch({type: "@@consentManagement/RESET_ACTIVE_FIELD_DATA"}); }
    }, []);
    
    useEffect(() => {
        if(Object.keys(consentData).length > 0){
            getTriggerFields();
            //set toggle to true even if user enters 0 while submitting/updating the consent
            setShowToggle(!!(consentData?.options?.expiryDays || consentData?.options?.expiryDays === 0))
            setNumberOfDays(consentData?.options?.expiryDays ?? null);
            setLoginConsent(consentData?.options?.showConsentOnLogin);
            setLogoutConsent(consentData?.options?.logout);
        }
    }, [consentData]);

    const getTriggerFields = async() => {
        try {
            const response = await axios.get(`${ apiMappings.consent?.management?.getTriggedFields}${consentData?.persona}`);
            if (response.status === 200) {
                //convert the response into dropdown supported values
                const values = response?.data?.reduce((acc,item) => {
                    const val = item?.fieldName
                    return [...acc, {value: val, label: val, title: val, fieldName: item?.fieldId}]
                },[])

                if(isAddConsentEnabled) {
                    setDropDownOptions(values);
                } else {
                    const tableData = values.reduce((acc, obj) => {
                        if (consentData.options.triggerFields.includes(obj.fieldName)) acc.push(obj.value);
                        return acc;
                    }, []);
                    setTableData([...tableData]);
                    setDropDownOptions([...values.filter((c:IConsentManagementListData) => !consentData.options.triggerFields.includes(c.fieldName))]);
                }
                setAllDropdownOptions(values);
            }
          } catch (error) {
            console.log(error);
            toast.add(
                error?.response?.data?.message ||
                dynamicLabels?.somethingWentWrong,
              "warning",
              false
            );
          }
    }
    
    const breadCrumbOptions = React.useMemo(() => [
        {
            id: 'Consent',
            label: dynamicLabels?.consentManagement,
            disabled: false,
          },
        { id:consentData.name, label:  consentData.name, disabled: true },
    ], [])

    const handleBreadCrumbClick = (id: string) => {
        if(id === 'Consent') {
           history.goBack();
        }
    }

    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        setExpanded(isExpanded ? accordianId : '')
    }

    const handleToggleSwitch = () => {
        //if toggle is disabled number of days for expiry would null(expectation from backend)
        toggle && setNumberOfDays(null);
        setShowToggle(!toggle)
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value.slice(0, 3));
        setNumberOfDays(value);
    }

    const createConsent = async() => { 
        const fieldNameValues = tableData.reduce((acc, label) => {
            const option = allDropdownOptions.find((item) => item?.label === label);
            option && acc.push(option?.fieldName);
            return acc;
          }, []);

        const payload = {
            name: consentData?.name,
            ...(!isAddConsentEnabled && {id: consentData?.id }),
            persona: consentData?.persona, 
            options: {
                 triggerFields: fieldNameValues,
                 showConsentOnLogin: loginConsent,
                 logout: logoutConsent,
                 expiryDays: numberOfDays && +numberOfDays
            }
           }
        
       if(isAddConsentEnabled){
        try {
            const response = await axios.post(apiMappings.consent?.management?.createConsent , payload);
            if (response.status === 200) {
               toast.add(response?.data?.message ? response?.data?.message : dynamicLabels?.sucessfulConsentAddition,'check-round', false);
                //navigate to home page 
               history.goBack();
            }
          } catch (error) {
             toast.add(error?.message ||  dynamicLabels?.somethingWentWrong,"warning",false)
          }
       }else{
        try {
            const response = await axios.put(apiMappings.consent?.management?.updateConsent , payload);
            if (response.status === 200) {
                toast.add(response?.data?.message ? response?.data?.message : dynamicLabels?.sucessfulConsentUpdation,'check-round', false);
               //navigate to home page 
               history.goBack();
            }
          } catch (error) {
            toast.add(error?.message ||  dynamicLabels?.somethingWentWrong,"warning",false)
          }
       }
        
    }

    const handleDropdown = (value) => {
        const filteredDropdown = dropDownOptions.filter(item => item.value !== value)
        setDropDownOptions(filteredDropdown)
    }
      
      const handleDelete = (item :string, index: number) => {
         const field = [{ value:item, label:item, title:item }]
         setDropDownOptions([...dropDownOptions,...field]);
         const clonedTableValue  = [...tableData];
         clonedTableValue.splice(index, 1);
         setTableData(clonedTableValue);
      }

      const pasteHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData?.getData("text");

        // Check if the pasted text is a number between 0 and 999
        if (/^\d{1,3}$/.test(pastedText) && Number(pastedText) <= 999) {
            // Allow the input
            return;
        }
        // Prevent the input
        event.preventDefault();
    };

    return (
        <>
        <Box style={{display:"flex", flexDirection:"column", minHeight:"inherit"}}> 
            <Box display="flex" justifyContent="space-between" style={{ width: "100%" }} py="15px"><BreadCrumb options={breadCrumbOptions} onClick={handleBreadCrumbClick} /></Box>
            <StyledCard>
            <Box style={{display:"flex", flexDirection:"column", flexGrow: 1 ,justifyContent:"space-between"}}>
            <Box>
              <Accordion id='1' expanded={expanded === '1'} onToggle={handleToggle}>
                {{
                    header: (
                        <>
                            <AccordionHeaderTitle>
                            {dynamicLabels.triggerFieldTitle}
                            </AccordionHeaderTitle>
                            <AccordionHeaderSubTitle>
                            {dynamicLabels.triggerFieldSubtitle}
                            </AccordionHeaderSubTitle>
                        </>
                    ),
                    content: (
                        <AccordionContent>
                         <PdpaMangementTableComponent dropDownOptions={dropDownOptions} tableArray={tableData} setTableData={setTableData} handleDropdown={handleDropdown} handleDelete={handleDelete} />
                        </AccordionContent>
                    )
                }}
            </Accordion>
            <Accordion id='2'  hideChevron={true} showToggleSwitch={true} onToggleSwitch={handleToggleSwitch} isToggleChecked={toggle} >
                {{
                    header: (
                        <>
                            <InputFiledInAccordian>
                                {toggle && (<InputField
                                    onChange={handleValueChange}
                                    type='number'
                                    placeholder={dynamicLabels.numberOfDays}
                                    onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>) => {
                                        const invalidChars = [".","e",'-'];
                                        if(invalidChars.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onPaste={pasteHandler}
                                    fullWidth={false}
                                    value={numberOfDays as number}
                                />)
                                }
                            </InputFiledInAccordian>
                            <AccordionHeaderTitle>
                                {dynamicLabels.expiryCheckTitle}
                            </AccordionHeaderTitle>
                            <AccordionHeaderSubTitle>
                            {dynamicLabels.expiryCheckSubtitle}
                            </AccordionHeaderSubTitle>
                        </>
                    ),
                    content: (
                        <div />
                    )
                }}
            </Accordion>
            <Accordion id='3' hideChevron={true} showToggleSwitch={true} onToggleSwitch={() => setLogoutConsent(!logoutConsent)} isToggleChecked={logoutConsent} >
                {{
                    header: (
                        <>
                            <AccordionHeaderTitle>
                            {dynamicLabels.logoutIfRejectedTitle}
                            </AccordionHeaderTitle>
                            <AccordionHeaderSubTitle>
                            {dynamicLabels.logoutIfRejectedSubtitle}
                            </AccordionHeaderSubTitle>
                        </>
                    ),
                    content: (
                        <div />
                    )
                }}
            </Accordion>
            <Accordion id='4' hideChevron={true} showToggleSwitch={true} onToggleSwitch={()=> setLoginConsent(!loginConsent)} isToggleChecked={loginConsent} >
                {{
                    header: (
                        <>
                            <AccordionHeaderTitle>
                            {dynamicLabels.enableOnLoginTitle}
                            </AccordionHeaderTitle>
                            <AccordionHeaderSubTitle>
                            {dynamicLabels.enableOnLoginSubtitle}
                            </AccordionHeaderSubTitle>
                        </>
                    ),
                    content: (
                        <div />
                    )
                }}
            </Accordion>
            </Box>
            <Grid container spacing='15px'>
                    <FormButtonContainer item xs={6} sm={6} md={6}>
                    <IconButton 
                    primary 
                    id='ConsentForm-actionBar-save'
                    iconVariant="icomoon-save" onClick={() => createConsent()}>{commonLabel.save}</IconButton>
                    <IconButton 
                    id='ConsentForm-actionBar-cancel'
                    iconVariant='icomoon-close' onClick={() => history.goBack()}>{commonLabel.cancel}</IconButton>
                    </FormButtonContainer>
                </Grid>
                </Box>
        </StyledCard>
        </Box>
        </>
    )
}

export default PdpaManagementAcc