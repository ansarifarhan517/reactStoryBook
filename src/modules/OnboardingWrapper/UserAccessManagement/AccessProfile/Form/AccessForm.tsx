import React, { Dispatch } from 'react'
import AccessFormRecursiveComponent from './AccessFormRecursiveComponent'
import { IAccessProfileFormActions } from './AccessProfileForm.actions'
import { useDispatch } from 'react-redux'

var flatObject = {}
var DISPATCHER_READONLYACC = {}
var DISPATCHER_ALLACCESSACC = {}
var CARRIER_READONLYACC = {}
var CARRIER_ALLACCESSACC = {}
var SHIPPER_READONLYACC = {}
var SHIPPER_ALLACCESSACC = {}
const AccessForm = (props: any) => {
    const dispatch = useDispatch<Dispatch<IAccessProfileFormActions>>();
    const { data, Mode, setAccessRefIds, accessRefIds, isAdminProfile, isEditMode } = props
    
    return (
        <>
            { data && data.accessModules && Object.values(data.accessModules).map((row: any) => {                
                if (row.moduleName === Mode) {
                    flattenObj(row.accessSections)
                    dispatch({ type: '@@accessProfileForm/SET_FLATOBJECT', payload: flatObject })
                    dispatch({ type: '@@accessProfileForm/SET_DISPATCHER_READONLYACC', payload: DISPATCHER_READONLYACC })
                    dispatch({ type: '@@accessProfileForm/SET_DISPATCHER_ALLACCESSACC', payload: DISPATCHER_ALLACCESSACC })
                    dispatch({ type: '@@accessProfileForm/SET_CARRIER_READONLYACC', payload: CARRIER_READONLYACC })
                    dispatch({ type: '@@accessProfileForm/CARRIER_ALLACCESSACC', payload: CARRIER_ALLACCESSACC })
                    dispatch({ type: '@@accessProfileForm/SHIPPER_READONLYACC', payload: SHIPPER_READONLYACC })
                    dispatch({ type: '@@accessProfileForm/SHIPPER_ALLACCESSACC', payload: SHIPPER_ALLACCESSACC })
                    return (
                        <>
                            <AccessFormRecursiveComponent accessSections={row.accessSections} accordionWidth={'1142px'} setAccessRefIds={setAccessRefIds} accessRefIds={accessRefIds} isAdminProfile={isAdminProfile} />
                        </>
                    )
                }
                return (<></>)
            })
            }
        </>
    )

    function flattenObj(accessSections: any) {
        var path = ""
        accessSections.forEach((accesSection: any) => {
            processAccessSection(accesSection, path);
        });
        return flatObject;
    }

    function processAccessSection(section: any, path: any) {
        var tempPath = path ? path : ""
        var accessRefId: string[] = []
        if(section?.sectionNameLabelKey == "ORDERMGMT_LABEL_KEY" && section?.defaultAccessRefId){
            section.defaultAccessRefId.forEach((accessId: any) => {
                accessRefId.push(accessId);
            });
        }      
        if (isEditMode && isAdminProfile) {
            if (section.sectionNameLabelKey === 'SETTINGS_LABEL_KEY' || section.sectionNameLabelKey === 'SETTINGS_ACCESSPROFILES_LABEL_KEY') {
                if (!accessRefIds.has(section.accessRefId)) {
                    const tempaccessIdsSet = new Set(accessRefIds)
                    tempaccessIdsSet.add(section.accessRefId)
                    setAccessRefIds(tempaccessIdsSet)
                }
            }
        }
        if (section.accessRefId) {
            accessRefId.push(section.accessRefId)
        }
        if (section.linkedAccessRefIdList) {
            accessRefId = accessRefId.concat(section.linkedAccessRefIdList)
        }
        tempPath = tempPath ? tempPath + '.' + section.sectionNameLabelKey : section.sectionNameLabelKey
        if (section.linkedAccessMode) {
            section.linkedAccessMode.map((accessMode: string) => {
                if (accessMode === 'DISPATCHER_READONLYACC') {
                    DISPATCHER_READONLYACC[tempPath] = accessRefId
                } else if (accessMode === 'DISPATCHER_ALLACCESSACC') {
                    DISPATCHER_ALLACCESSACC[tempPath] = accessRefId
                } else if (accessMode === 'CARRIER_READONLYACC') {
                    CARRIER_READONLYACC[tempPath] = accessRefId
                } else if (accessMode === 'CARRIER_ALLACCESSACC') {
                    CARRIER_ALLACCESSACC[tempPath] = accessRefId
                } else if (accessMode === 'SHIPPER_READONLYACC') {
                    SHIPPER_READONLYACC[tempPath] = accessRefId
                } else if (accessMode === 'SHIPPER_ALLACCESSACC') {
                    SHIPPER_ALLACCESSACC[tempPath] = accessRefId
                }
            })
        }
        flatObject[tempPath] = accessRefId
        if (section.accessSections) {
            section.accessSections.forEach((accessSection: any) => {
                processAccessSection(accessSection, tempPath)
            });
        }
        if (section.accesses) {
            processAccesses(section.accesses, tempPath)
        }

    }

    function processAccesses(accesses: any, path: any) {
        accesses.forEach((access: any) => {
            recursiveAccessFunction(access, path)
        });
    }

    function recursiveAccessFunction(access: any, path: any) {
        var tempPath = path ? path : ""
        var accessRefId: string[] = []
        if (access.accessRefId) {
            accessRefId.push(access.accessRefId)
        }
        if (access.linkedAccessRefIdList) {
            accessRefId = accessRefId.concat(access.linkedAccessRefIdList)
        }
        tempPath = tempPath ? tempPath + '.' + access.accessNameLabelKey : access.accessNameLabelKey
        if (access.linkedAccessMode) {
            access.linkedAccessMode.map((accessMode: string) => {
                if (accessMode === 'DISPATCHER_READONLYACC') {
                    DISPATCHER_READONLYACC[tempPath] = accessRefId
                } else if (accessMode === 'DISPATCHER_ALLACCESSACC') {
                    DISPATCHER_ALLACCESSACC[tempPath] = accessRefId
                } else if (accessMode === 'CARRIER_READONLYACC') {
                    CARRIER_READONLYACC[tempPath] = accessRefId
                } else if (accessMode === 'CARRIER_ALLACCESSACC') {
                    CARRIER_ALLACCESSACC[tempPath] = accessRefId
                } else if (accessMode === 'SHIPPER_READONLYACC') {
                    SHIPPER_READONLYACC[tempPath] = accessRefId
                } else if (accessMode === 'SHIPPER_ALLACCESSACC') {
                    SHIPPER_ALLACCESSACC[tempPath] = accessRefId
                }
            })
        }
        flatObject[tempPath] = accessRefId
        if (access.accesses) {
            access.accesses.forEach((childAccess: any) => {
                recursiveAccessFunction(childAccess, tempPath)
            });
        }
    }

}


export default AccessForm