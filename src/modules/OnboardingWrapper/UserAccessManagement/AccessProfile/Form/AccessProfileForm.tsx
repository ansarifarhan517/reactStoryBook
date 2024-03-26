import React, { useState, useEffect, Dispatch } from 'react';
import {
    Card,
    Box,
    TextInput,
    BreadCrumb,
    ButtonGroup,
    IconDropdown,
    IconButton,
    useToast,
    SectionHeader
} from "ui-library";
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { useForm } from 'react-hook-form'
import apiMappings from '../../../../../utils/apiMapping';
import axios from '../../../../../utils/axios';
import AccessForm from './AccessForm'
import { IAddFormData, IAccessProfileFormParams } from './AccessProfileForm.models'
import { IAccessProfileFormActions } from './AccessProfileForm.actions'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useBreadCrumbs } from './AccessProfileForm.utils'
import { QuickActionStyle } from './style'

const AccessProfileForm = () => {
    const dispatch = useDispatch<Dispatch<IAccessProfileFormActions>>();
    const params = useParams<IAccessProfileFormParams>();
    let isEditMode = false
    const [isReady, setIsReady] = useState(false)
    if (params && params.accessProfileId) {
        isEditMode = true
    }
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.accessProfile)
    const [accessMode, setAccessMode] = useState<string>('');
    const [accessRefIds, setAccessRefIds] = useState(new Set())
    const [isAdminProfile, setIsAdminProfile] = useState(false)
    const toast = useToast();
    const history = useHistory();
    const formInstance = useForm<IAddFormData>({
        mode: 'all', shouldUnregister: false
    })
    const handlePreviewMode = (mode: string) => {
        setAccessMode(mode);
    };
    const { breadCrumbOptions, handleBreadCrumbClick } = useBreadCrumbs(formInstance, isEditMode)
    const getAccessProfileData = async () => {
        const { data: response } = await axios.get(apiMappings.accessProfile.form.getAccessProfileData + params.accessProfileId)
        if (response.status === 200) {
            if (response.data) {
                formInstance.setValue('accessProfileName', response.data.accessprofileName)
                formInstance.setValue('accessProfileDesc', response.data.accessprofileDesc ? response.data.accessprofileDesc : '')
                await setAccessRefIds(new Set(response.data.accessReferenceIds))
            }
        }
        const  {data :resp} = await axios.get(apiMappings.accessProfile.form.checkAdminProfile + params.accessProfileId)
        if(resp) {
           await setIsAdminProfile(true)
        }
        setIsReady(true)
    }

    useEffect(() => {
        dispatch({ type: '@@accessProfileForm/FETCH_STRUCTURE', payload: 'DISPATCHER' })
        if (isEditMode) {
            getAccessProfileData()
        }
    }, [])

    const accessProfileStructure = useTypedSelector(state => state.accessProfile.form.structure)
    const DISPATCHER_READONLYACC = useTypedSelector(state => state.accessProfile.form.DISPATCHER_READONLYACC)
    const DISPATCHER_ALLACCESSACC = useTypedSelector(state => state.accessProfile.form.DISPATCHER_ALLACCESSACC)
    const CARRIER_READONLYACC = useTypedSelector(state => state.accessProfile.form.CARRIER_READONLYACC)
    const CARRIER_ALLACCESSACC = useTypedSelector(state => state.accessProfile.form.CARRIER_ALLACCESSACC)
    const SHIPPER_READONLYACC = useTypedSelector(state => state.accessProfile.form.SHIPPER_READONLYACC)
    const SHIPPER_ALLACCESSACC = useTypedSelector(state => state.accessProfile.form.SHIPPER_ALLACCESSACC)


    let tabOptions = React.useMemo(() => {
        if (accessProfileStructure && accessProfileStructure.accessModules) {
            return accessProfileStructure.accessModules.map((accessModule: any) => {
                return {
                    id: accessModule.moduleName,
                    label: dynamicLabels[accessModule.moduleLabelKey],
                    selected: accessMode === accessModule.moduleName,
                    tooltipText: dynamicLabels[accessModule.moduleLabelKey]
                }
            })
        }
    }, [accessProfileStructure, accessMode])

    if (accessProfileStructure && accessProfileStructure.accessModules && accessMode === '') {
        setAccessMode(accessProfileStructure.accessModules[0].moduleName)
    }

    const handleQuickFilter = (id: string) => {
        const tempAccessRefIds = new Set()
        switch (id) {
            case 'DISPATCHER_READONLYACC':
                Object.keys(DISPATCHER_READONLYACC).map((key: string) => {
                    if (DISPATCHER_READONLYACC[key] && DISPATCHER_READONLYACC[key].length > 0) {
                        let accessIdList = DISPATCHER_READONLYACC[key]
                        accessIdList.map((accessId: string) => {
                            if (!tempAccessRefIds.has(accessId)) {
                                tempAccessRefIds.add(accessId)
                            }
                        })
                    }
                })
                setAccessRefIds(tempAccessRefIds)
                break;

            case 'DISPATCHER_ALLACCESSACC':
                Object.keys(DISPATCHER_ALLACCESSACC).map((key: string) => {
                    if (DISPATCHER_ALLACCESSACC[key] && DISPATCHER_ALLACCESSACC[key].length > 0) {
                        let accessIdList = DISPATCHER_ALLACCESSACC[key]
                        accessIdList.map((accessId: string) => {
                            if (!tempAccessRefIds.has(accessId)) {
                                tempAccessRefIds.add(accessId)
                            }
                        })
                    }
                })
                setAccessRefIds(tempAccessRefIds)
                break;

            case 'CARRIER_READONLYACC':
                Object.keys(CARRIER_READONLYACC).map((key: string) => {
                    if (CARRIER_READONLYACC[key] && CARRIER_READONLYACC[key].length > 0) {
                        let accessIdList = CARRIER_READONLYACC[key]
                        accessIdList.map((accessId: string) => {
                            if (!tempAccessRefIds.has(accessId)) {
                                tempAccessRefIds.add(accessId)
                            }
                        })
                    }
                })
                setAccessRefIds(tempAccessRefIds)
                break;

            case 'CARRIER_ALLACCESSACC':
                Object.keys(CARRIER_ALLACCESSACC).map((key: string) => {
                    if (CARRIER_ALLACCESSACC[key] && CARRIER_ALLACCESSACC[key].length > 0) {
                        let accessIdList = CARRIER_ALLACCESSACC[key]
                        accessIdList.map((accessId: string) => {
                            if (!tempAccessRefIds.has(accessId)) {
                                tempAccessRefIds.add(accessId)
                            }
                        })
                    }
                })
                setAccessRefIds(tempAccessRefIds)
                break;

            case 'SHIPPER_READONLYACC':
                Object.keys(SHIPPER_READONLYACC).map((key: string) => {
                    if (SHIPPER_READONLYACC[key] && SHIPPER_READONLYACC[key].length > 0) {
                        let accessIdList = SHIPPER_READONLYACC[key]
                        accessIdList.map((accessId: string) => {
                            if (!tempAccessRefIds.has(accessId)) {
                                tempAccessRefIds.add(accessId)
                            }
                        })
                    }
                })
                setAccessRefIds(tempAccessRefIds)
                break;

            case 'SHIPPER_ALLACCESSACC':
                Object.keys(SHIPPER_ALLACCESSACC).map((key: string) => {
                    if (SHIPPER_ALLACCESSACC[key] && SHIPPER_ALLACCESSACC[key].length > 0) {
                        let accessIdList = SHIPPER_ALLACCESSACC[key]
                        accessIdList.map((accessId: string) => {
                            if (!tempAccessRefIds.has(accessId)) {
                                tempAccessRefIds.add(accessId)
                            }
                        })
                    }
                })
                setAccessRefIds(tempAccessRefIds)
                break;

            default:
                break;
        }
    }

    const handlecancel = () => {
        history.push({ pathname: '/' })
    }

    // const quickActionOption = [
    //     {
    //         id: 'Dispatcher',
    //         value: 'Dispatcher',
    //         label: 'Dispatcher',
    //         color: 'blue',
    //         tooltipText: 'Dispatcher',
    //         options: [
    //             {
    //                 id: 'DISPATCHER_READONLYACC',
    //                 value: 'DISPATCHER_READONLYACC',
    //                 label: 'Read Only',
    //                 color: 'blue',
    //                 tooltipText: 'Read Only'
    //             },
    //             {
    //                 id: 'DISPATCHER_ALLACCESSACC',
    //                 value: 'DISPATCHER_ALLACCESSACC',
    //                 label: 'All Accesses',
    //                 color: 'red',
    //                 tooltipText: 'All Accesses'
    //             }
    //         ]
    //     },
    //     {
    //         id: 'Shipper',
    //         value: 'Shipper',
    //         label: 'Shipper',
    //         color: 'red',
    //         tooltipText: 'Shipper',
    //         options: [
    //             {
    //                 id: 'SHIPPER_READONLYACC',
    //                 value: 'SHIPPER_READONLYACC',
    //                 label: 'Read Only',
    //                 color: 'blue',
    //                 tooltipText: 'Read Only'
    //             },
    //             {
    //                 id: 'SHIPPER_ALLACCESSACC',
    //                 value: 'SHIPPER_ALLACCESSACC',
    //                 label: 'All Accesses',
    //                 color: 'red',
    //                 tooltipText: 'All Accesses'
    //             }
    //         ]
    //     },
    //     {
    //         id: 'Carrier',
    //         value: 'Carrier',
    //         label: 'Carrier',
    //         color: 'purple',
    //         tooltipText: 'Carrier',
    //         options: [
    //             {
    //                 id: 'CARRIER_READONLYACC',
    //                 value: 'CARRIER_READONLYACC',
    //                 label: 'Read Only',
    //                 color: 'blue',
    //                 tooltipText: 'Read Only'
    //             },
    //             {
    //                 id: 'CARRIER_ALLACCESSACC',
    //                 value: 'CARRIER_ALLACCESSACC',
    //                 label: 'All Accesses',
    //                 color: 'red',
    //                 tooltipText: 'All Accesses'
    //             }
    //         ]
    //     }
    // ]

    const prepareArrayObject = (input: any[]) => {
        let output: any[] = []
        input.forEach((obj: any) => {
            let miniObject = {
                id: obj.accessModeKey,
                value: obj.accessModeKey,
                label: obj.accessModeLabelValue,
                tooltipText: obj.accessModeLabelValue
            }

            let keyword = obj.accessModeName.split('_')[0].toLowerCase()
            let index = output.findIndex((obj: any) => {
                return obj.id.toLowerCase() === keyword
            })
            if (index === -1) {

                let new_object = {
                    id: keyword.substr(0, 1).toUpperCase() + keyword.substr(1).toLowerCase(),
                    value: keyword.substr(0, 1).toUpperCase() + keyword.substr(1).toLowerCase(),
                    label: keyword.substr(0, 1).toUpperCase() + keyword.substr(1).toLowerCase(),
                    tooltipText: keyword.substr(0, 1).toUpperCase() + keyword.substr(1).toLowerCase(),
                    options: [
                        { ...miniObject }
                    ]
                }
                output.push(new_object)
            } else {
                output[index].options.push(miniObject)
            }
        })
        return output;
    }

    let quickActionOption = []

    if (accessProfileStructure && accessProfileStructure.accessModules) {
        quickActionOption = prepareArrayObject(accessProfileStructure.accessModules[0].accessModes)
    }

    const onSubmit = async (formData: IAddFormData) => {
        if (accessRefIds.size === 0) {
            toast.add(dynamicLabels?.ONEACCESSVALIDATION, 'warning', false);
            return
        }
        if (isEditMode) {
            const { data: response } = await axios.put(apiMappings.accessProfile.form.update, {
                accessProfileId: params.accessProfileId,
                accessprofileName: formData.accessProfileName,
                accessprofileDesc: formData.accessProfileDesc,
                accessReferenceIds: Array.from(accessRefIds)
            })
            if (response.status === 200) {
                toast.add(dynamicLabels?.update_accessprofile_success, 'check-round', false)
                history.push({ pathname: '/' })
            } else {
                toast.add(response.message, 'warning', false)
            }
        } else {
            const { data: response } = await axios.post(apiMappings.accessProfile.form.create, {
                accessprofileName: formData.accessProfileName,
                accessprofileDesc: formData.accessProfileDesc,
                accessReferenceIds: Array.from(accessRefIds)
            })
            if (response.status === 200) {
                toast.add(dynamicLabels?.accessprofile_add, 'check-round', false)
                history.push({ pathname: '/' })
            } else {
                toast.add(response.message, 'warning', false)
            }
        }
    }

    return (
        <>
            { ((isEditMode && isReady && accessProfileStructure.accessModules && accessProfileStructure.accessModules.length > 0) ||
                (!isEditMode && accessProfileStructure.accessModules && accessProfileStructure.accessModules.length > 0)) &&
                <div>
                    <Box display='flex' justifyContent='space-between' style={{ width: '100%', paddingTop: '10px', height: '60px' }} px='10px' pb='0px'>
                        <BreadCrumb
                            options={breadCrumbOptions}
                            onClick={handleBreadCrumbClick} />
                    </Box>
                    <Card style={{ marginTop: '5px', height: '100%', padding: '15px' }}>
                        <SectionHeader headerTitle={dynamicLabels?.accessProfileDetails} />
                        <div style={{ height: '76px', marginTop: '15px' }}>
                            <div style={{ width: '324px', float: 'left' }}>
                                <TextInput
                                    id='accessProfileName'
                                    name='accessProfileName'
                                    ref={formInstance.register({ required: true })}
                                    required
                                    error={!!formInstance.errors.accessProfileName}
                                    errorMessage={dynamicLabels?.accessProfilNameMandatory}
                                    label={dynamicLabels?.accessprofilename}
                                    placeholder={dynamicLabels?.accessprofilename}
                                    fullWidth
                                />
                            </div>
                            <div style={{ width: '324px', marginLeft: '30px', float: 'left' }}>
                                <TextInput
                                    id='accessProfileDesc'
                                    name='accessProfileDesc'
                                    ref={formInstance.register({ required: false })}
                                    label={dynamicLabels?.accessprofileDesc}
                                    placeholder={dynamicLabels?.accessprofileDesc}
                                    fullWidth
                                />
                            </div>
                        </div>
                        <SectionHeader headerTitle={dynamicLabels?.accessProfileModules} />
                        <Box style={{ marginTop: '15px', height: '30px' }}>
                            <div style={{ float: 'left', marginLeft: '-2px' }}>
                                <ButtonGroup
                                    data={tabOptions}
                                    onChange={(id: string) => handlePreviewMode(id)}
                                />
                            </div>
                            <QuickActionStyle>
                                <IconDropdown
                                    intent={'default'}
                                    variant={'multilevel-button-dropdown'}
                                    optionList={quickActionOption}
                                    menuIsOpen={false}
                                    iconButtonDetails={['icomoon-funnel-options', 'Quick Action', 'angle-down']}
                                    handleClick={(id: string) => handleQuickFilter(id)}
                                    isSingleClickOption={true}
                                    primary
                                    defaultOpen={"right"}
                                />
                            </QuickActionStyle>
                        </Box>
                        <Card>
                            {accessMode && <AccessForm data={accessProfileStructure} Mode={accessMode} setAccessRefIds={setAccessRefIds} accessRefIds={accessRefIds} isAdminProfile={isAdminProfile} isEditMode={isEditMode} />}
                        </Card>
                        <Box horizontalSpacing='10px' display='flex' style={{ marginTop: '50px' }}>
                            <IconButton id='Access-profile-form-actionBar-save' iconVariant='icomoon-save' primary onClick={formInstance.handleSubmit(onSubmit)}>
                                {dynamicLabels.save}
                            </IconButton>
                            <IconButton id='Access-profile-form-actionBar-cancel' iconVariant='icomoon-close' iconSize={11} onClick={handlecancel}>
                                {dynamicLabels.cancel}
                            </IconButton>
                        </Box>
                    </Card>
                </div>
            }
        </>
    )
}

export default AccessProfileForm