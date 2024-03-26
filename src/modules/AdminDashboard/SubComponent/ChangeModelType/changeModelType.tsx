import React, { useEffect, Dispatch, useState } from "react"
import {
    Box,
    BreadCrumb,
    Card,
    SectionHeader,
    Grid,
    Radio,
    // InputLabel,
    IconButton,
    useToast
} from "ui-library";
import { FormWrapper, SectionHeaderContainer } from '../../../../utils/components/Form/Form.styles'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux'
import { IChangeModelTypeFormActions } from './ChangeModelType.Model'
import FormLoader from '../../../../utils/components/FormLoader'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import FormField from '../../../../utils/components/Form/FormField'
import { useForm } from 'react-hook-form'
import { RadioDesc } from './ChangeModelTypeStyledComponents'
import { getQueryParams, hybridRouteTo } from '../../../../utils/hybridRouting'
import axios from "../../../../utils/axios";
import apiMappings from '../../../../utils/apiMapping'
import { tGlobalToastActions } from '../../../common/GlobalToasts/globalToast.reducer'
import { withReactOptimized } from '../../../../utils/components/withReact'
import ConfirmationPopup from './ConfirmationPopup'
const ChangeModelType = () => {
    const formInstance = useForm<Record<string, any>>({
        mode: 'all', shouldUnregister: false
    })
    const { handleSubmit } = formInstance
    const toast = useToast()
    const [createNewInstance, setCreateNewInstance] = useState(false)
    const dispatch = useDispatch<Dispatch<IChangeModelTypeFormActions>>()
    const isLoading = useTypedSelector(state => state.adminDashboard.changeModeltype.loading)
    const structure = useTypedSelector(state => state.adminDashboard.changeModeltype.structure)
    const sectionKeys = Object.keys(structure)
    const loaderRef = React.useRef<HTMLDivElement | null>(null)
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.adminDashboard)
    const [confirmationPopup, setConfirmationPopup] = useState<boolean>(false)

    useEffect(() => {
        dispatch({ type: '@@changeModelTypeForm/FETCH_STRUCTURE' })
    }, [])  

    console.log("Inside Change modelType")
    const breadCrumbOptions = React.useMemo(() => [
        { id: 'clientDetails', label: "Client Details", disabled: true },
        { id: 'changeModelType', label: "Update Model Type", disabled: true },
    ], [])
    const { clientId ,modelType, clientName} = getQueryParams()

    dispatch({ type: '@@changeModelTypeForm/SET_CLIENTID', payload: clientId })

    const showPopupBeforeSubmit = (data : any) => {
        setConfirmationPopup(true);
    }

    const onSubmit = async (data: any) => {
        if (!createNewInstance) {
            const { newModelType } = data
            console.log(newModelType.clientRefMasterCd);
            dispatch({ type: '@@changeModelTypeForm/SET_LOADING', payload: true })
            try {
                const { data: response } = await axios.post(apiMappings.adminDashboard.changeModelType.update + "?newModelType="
                    + newModelType.clientRefMasterCd + "&clientId=" + clientId + "&isNewInstance=" + createNewInstance
                    + "&clientName=" + clientName)
                if (response.status === 200) {
                    toastDispatch({
                        type: '@@globalToast/add', payload: {
                            message: dynamicLabels.modelTypeConversionInProcess,
                            icon: 'warning'
                        }
                    })
                    hybridRouteTo("admindashboard");
                }
            } catch (error) {
                dispatch({ type: '@@changeModelTypeForm/SET_LOADING', payload: false })
                toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
                hybridRouteTo("admindashboard");
            }
        }
    }




    return (<>
        <FormWrapper>
            <div id='toast-inject-here'></div>
            <Box py='15px' style={{ fontSize: '17px' }}>
                <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />
            </Box>

            <Box bgColor='white'>
                <Card style={{ paddingRight: '5px', paddingLeft: '15px', marginTop: '15px', position: 'relative' }}>

                    {isLoading && <div ref={loaderRef}><FormLoader /></div>}
                    {sectionKeys.length > 0 && sectionKeys.map((sectionName) =>
                        <div key={sectionName}>
                            {Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) && (createNewInstance || sectionName === 'Preference Details' || sectionName === 'New Model Details') &&
                                <SectionHeaderContainer>
                                    <SectionHeader fontWeight={500} headerTitle={dynamicLabels?.[sectionName] || sectionName} />
                                </SectionHeaderContainer>
                            }
                            {/* {sectionName && sectionName === 'Preference Details' &&
                                <Box mt='15px' pl="15px">
                                    <InputLabel fontSize="12px">How would you like to update your model type</InputLabel>
                                </Box>
                            } */}

                            <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                                {(createNewInstance || sectionName === 'Preference Details' || sectionName === 'New Model Details') && Object.keys(structure[sectionName]).map(fieldName => {
                                    const meta = structure[sectionName][fieldName]
                                    meta.multipleFiles = true
                                    const { permission ,required } = meta

                                    if (!permission) {
                                        return undefined
                                    }

                                    if (fieldName === 'updateExistingInstance') {
                                        return (
                                            <Box mt='17px'>
                                                <Grid item key={fieldName} xs={12} sm={6} md={12} className='grid-item'>
                                                    <Radio className="event-radio" checked={!createNewInstance} radioSize="md" fontWeight={"bold"} label={meta.label} onChange={() => setCreateNewInstance(false)} />
                                                    <RadioDesc>{dynamicLabels.updateExistingInstanceHeader}</RadioDesc>
                                                </Grid>
                                            </Box>
                                        )
                                    }

                                    // if (fieldName === 'createNewInstance') {
                                    //     return (
                                    //         <Box>
                                    //             <Grid item key={fieldName} xs={12} sm={6} md={12} className='grid-item'>
                                    //                 <Radio className="event-radio" checked={createNewInstance} fontWeight={"bold"} radioSize="md" label={meta.label} onChange={() => setCreateNewInstance(true)} />
                                    //                 <RadioDesc>{"This will create another account of the new model type. The master data and settings will be available in the new account. The current account will retain its master data, settings, and transactional data."}</RadioDesc>
                                    //             </Grid>
                                    //         </Box>
                                    //     )
                                    // }

                                    if (fieldName === 'newModelType') {
                                        meta.required= true;
                                    }

                                    return (
                                        <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                                            <FormField
                                                name={fieldName}
                                                meta={meta}
                                                formInstance={formInstance} />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </div>
                    )}

                    <Box horizontalSpacing='15px' display='flex' mt='30px' pb='15px'>
                        <IconButton iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={handleSubmit(showPopupBeforeSubmit)} primary>{dynamicLabels.update}</IconButton>
                        <IconButton iconVariant='icomoon-close' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={() => { hybridRouteTo("admindashboard"); }}>{dynamicLabels.cancel}</IconButton>
                    </Box>
                </Card>
            </Box>
        </FormWrapper >
        {confirmationPopup && <ConfirmationPopup
            confirmationPopup={confirmationPopup}
            setConfirmationPopup={(value: boolean) => setConfirmationPopup(value)}
            submit={handleSubmit(onSubmit)}
            modelType={modelType}
            newModelType={formInstance.getValues("newModelType").clientRefMasterCd} />
        }
    </>
    )
}

export default withReactOptimized(ChangeModelType)