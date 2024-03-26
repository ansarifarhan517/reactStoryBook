import React , { useEffect, Dispatch, useState }from 'react'
import { useForm } from 'react-hook-form'
import {
    useToast, Box,
    Grid, IconButton, Modal, ModalHeader
} from 'ui-library'
import { useDispatch } from 'react-redux'
import { withReactOptimized } from '../.././../../utils/components/withReact'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { IUatData, IUatFormActions } from './../../../Saas/UatForm/UatForm.model'
import { tGlobalToastActions } from '../../../common/GlobalToasts/globalToast.reducer'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import { generateUATFormData } from './../../../Saas/UatForm/UatForm.utilis'
import FormField from '../../../../utils/components/Form/FormField'
import UatAccountCountPopup from './UatAccountCountPopup'

const UatFormModal = (props : any) => {
    const { rowData, isUpdate , showAddUatAcccountPop, setShowAddUatAccountPopup } = props
    const toast = useToast()
    const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.saas.uat}`)
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false})
    const { handleSubmit, reset } = formInstance;

    const dispatch = useDispatch<Dispatch<IUatFormActions>>()
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    
    const resetData = useTypedSelector(state => state.uat.form.resetData)
    const structure = useTypedSelector(state => state.uat.form.structure)
    const isEditMode = useTypedSelector(state => state.uat.form.isEditMode)
    const isStructureLoading = useTypedSelector(state => state.uat.form.loading)
    const uatData = useTypedSelector(state => state.uat.form.uatData)

    const [isUatDataLoading, setIsUatDataLoading] = useState<boolean>(false)
    const [uatAccountCountPopup, setUatAccountCountPopup] = useState<boolean>(false)
    const isLoading = React.useMemo(() => isStructureLoading || isUatDataLoading, [isStructureLoading, isUatDataLoading])
    
    console.log(formInstance.formState.isDirty) // make sure formState is read before render to enable the Proxy
    const fetchAccountDetails = async (clientId : number | string | undefined, saasId : number | string | undefined) => {
        setIsUatDataLoading(true)
        try {
            const params = clientId ? `?clientId=${clientId}` : `?saasId=${saasId}`
            const { data: { data: res } }: any = await axios.get<any>(`${apiMappings.saas.uat.getUatDetails}${params}`);
            const response: IUatData = { ...res }
            dispatch({ type: '@@uatForm/SET_UAT_DATA', payload: response })
            const _resetData = {...resetData, ...generateUATFormData(response)}
            reset({..._resetData})
            dispatch({ type: '@@uatForm/SET_FORM_RESET_DATA', payload: _resetData })
            setIsUatDataLoading(false)
        } catch (error) {
            setIsUatDataLoading(false)
            toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
        }
    }

    const addAccountForParentAccount = async (clientId : string | undefined, saasId : string | undefined) => {
        setIsUatDataLoading(true)
        try {
            const params = clientId ? `?clientId=${clientId}` : `?saasId=${saasId}`
            const { data : response }: any = await axios.get<any>(`${apiMappings.saas.uat.getUatAccountCount}${params}`)
            if (response?.hasError) {
                toastDispatch({  type: '@@globalToast/add', payload: { message: response.message, icon: 'warning'}})
                setShowAddUatAccountPopup(false);
                setIsUatDataLoading(false);
                return
            } else {
                const data: IUatData = { ...response.data }
                const _resetData = { ...resetData, ...generateUATFormData(data) }
                reset({ ..._resetData })
                dispatch({ type: '@@uatForm/SET_UAT_DATA', payload: data })
                dispatch({ type: '@@uatForm/SET_FORM_RESET_DATA', payload: _resetData })
                setIsUatDataLoading(false)
            }
        } catch(error) {
            toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
            resetDefaultValues();
        }
    }

    const resetDefaultValues = () => {
        dispatch({type: '@@uatForm/RESET_INITIAL_STATE'})
        setShowAddUatAccountPopup(false)
        setUatAccountCountPopup(false)
    }

    useEffect(() => {
        if (showAddUatAcccountPop) {
            dispatch({ type: '@@uatForm/FETCH_STRUCTURE' })
            if (isUpdate) {
                dispatch({ type: '@@uatForm/SET_EDIT_MODE', payload: true })
                fetchAccountDetails(rowData.clientId, rowData.id)
            } else {
                addAccountForParentAccount(rowData.clientId, rowData.id)
            }
        }
    }, [showAddUatAcccountPop])

    const onSubmit = async (data : any) => {
        if (!formInstance.formState.isDirty) {return}
        const payload = {  ...data }
        dispatch({ type: '@@uatForm/SET_LOADING', payload: true })
        try {
            const { data: response } = await axios.post(apiMappings.saas.uat[isEditMode ? 'update' : 'create'], payload)
            if (!response.hasError) {
                dispatch({ type: '@@uatForm/SET_LOADING', payload: false })
                setShowAddUatAccountPopup(false)
                dispatch({type: '@@uatForm/RESET_INITIAL_STATE'})
                toastDispatch({  type: '@@globalToast/add', payload: { message: response.message, icon: 'check-round'}})
                if (!isEditMode && rowData?.clientId) {
                    window.location.reload();
                }
            } else {
                dispatch({ type: '@@uatForm/SET_LOADING', payload: false })
                toastDispatch({  type: '@@globalToast/add', payload: { message: response.message, icon: 'warning'}})
            }
        } catch(error) {
            dispatch({ type: '@@uatForm/SET_LOADING', payload: false })
            toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
        } finally {
            setIsUatDataLoading(false)
        }
    }

    const showPopupBeforeSubmit = (data : any) => {
        if (!formInstance.formState.isDirty) { return }
        uatData?.accountCount && uatData?.accountCount > 0 ? setUatAccountCountPopup(true) : onSubmit(data);
    }

    return (<><Modal 
        open = {!isUatDataLoading && showAddUatAcccountPop} onToggle={() => {}} width='400px' size='lg'
            children={{
                header: (<ModalHeader
                    headerTitle={isEditMode ? "Update UAT" :  "Add UAT"}
                    handleClose={() => {resetDefaultValues()}}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'/>
                ),
                content: (<>
                    <div>
                    {Object.keys(structure).length > 0 && Object.keys(structure).map((sectionName:string)=>{
                    return (<div key={sectionName}>
                        {Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission)}
                                {Object.keys(structure[sectionName]).map(fieldName => {
                                    const meta = structure[sectionName][fieldName]
                                    meta.multipleFiles = false
                                    const { permission} = meta
                                    if (!permission) { return undefined }
                                    if (isEditMode && fieldName == 'adminEmailId') { meta.editable = false}
                                    return (
                                        <Grid item key={fieldName} xs={12} sm={12} md={12} className='grid-item uatForm'>
                                            <FormField
                                                name={fieldName}
                                                meta={meta}
                                                formInstance={formInstance} />
                                        </Grid>)})}
                            </div>)})}
                    </div></>),
                footer: (
                    <Box horizontalSpacing="10px" display="flex" justifyContent="flex-end" p="15px">
                        <IconButton id='UATform-modal-button-save' iconVariant="icomoon-save" style={{ padding: '0px 15px' }} disabled={isLoading} onClick={isEditMode ? handleSubmit(onSubmit) : handleSubmit(showPopupBeforeSubmit)} primary>
                            {isEditMode ? dynamicLabels.update : dynamicLabels.save}
                        </IconButton>
                        <IconButton id='UATform-modal-button-close' iconVariant="icomoon-close" style={{ padding: '0px 15px' }} disabled={isLoading} onClick={() => {resetDefaultValues()}}>
                            {dynamicLabels.cancel}
                        </IconButton>
                    </Box>
                ),
            }}/>
            {uatAccountCountPopup && showAddUatAcccountPop  && <UatAccountCountPopup
            uatAccountCountPopup={uatAccountCountPopup}
            setUatAccountCountPopup={(value: boolean) => setUatAccountCountPopup(value)}
            submit={handleSubmit(onSubmit)}/>}
        </>
    )
}

export default withReactOptimized(UatFormModal)
