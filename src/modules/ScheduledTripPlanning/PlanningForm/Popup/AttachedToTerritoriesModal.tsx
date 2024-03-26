import React ,{useState, useEffect, useMemo, Dispatch} from 'react'
import { Box, Modal, ModalHeader, IconButton , useToast} from 'ui-library'
// import { IActivationModalButtonGroup } from '../../../PlanningForm.model.ts'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import Table from "./Table";
import store from '../../../../utils/redux/store'
import {AttactToTerritoriesModalWrapper, RowSummary, TableWrapper} from '../PlanningStyledComponents'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux'
import {TripPlanningScheduler} from '../PlanningForm.actions'

const AttachToTerritories = ({ attachTerritoriesRowId,isShowAttachToTerritories, handleClose, attachTerritoriesRowIndex }: any) => {
    const dispatch = useDispatch<Dispatch<TripPlanningScheduler>>()
    const territoryList= useTypedSelector(state=>state.tripPlanningScheduler.form?.data?.territories?.geofenceMasterDTOs)
    const territoryData= store.getState().tripPlanningScheduler.form?.formData?.attachedTerritories?.[attachTerritoriesRowId]
    const territoryDataOg= store.getState().tripPlanningScheduler.form?.data?.outSourcedFleet?.results?.[attachTerritoriesRowIndex]
    const editedRowGeofences = store.getState().tripPlanningScheduler.form.formData?.attachedTerritoriesFinal
    let countGeofences= 0
    editedRowGeofences?.[attachTerritoriesRowId]?.geofences &&  Object.values(editedRowGeofences?.[attachTerritoriesRowId]?.geofences)?.map((value:any)=>{
        countGeofences= countGeofences+parseInt(value)
    }) 
    const [data, setData] = useState(territoryList||[]);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.tripPlanningScheduler)
    const [fleetCount, setFleetCount]= useState(territoryData?.attachedTerritories? territoryData?.attachedTerritories: (territoryDataOg?.availableFleetCount))
    const [ vehicleToTerritory , setVehicletoTerritory ]= useState<any>(countGeofences)
    const toast = useToast()
    function add(accumulator:any, a:any) {
        return accumulator + (a? parseInt(a):0);
    }
    useEffect(()=>{
      setData(territoryList)
    },[territoryList])

    useEffect(()=>{
        setFleetCount(territoryData?.attachedTerritories? territoryData?.attachedTerritories : territoryDataOg?.availableFleetCount)
    },[territoryData, territoryDataOg])

    useEffect(()=>{
        if(vehicleToTerritory>fleetCount){
            toast.add(`Total ${dynamicLabels.resource_s} count exceeded` ,'warning', false )
        }
    }, [vehicleToTerritory,fleetCount])

    useEffect(()=>{
        territoryData?.geofences ? setVehicletoTerritory(Object.values(territoryData?.geofences)?.reduce(add,0)): setVehicletoTerritory(countGeofences)
    },[territoryData?.geofences, editedRowGeofences])

    const columns = useMemo(
        () => [
              {
                Header: "Sr no",
                Cell: ({ cell: {row} }:any) => <div>{row.index+1}</div>,
                style: {
                    fontWeight: 'bolder',
                },
              },
              {
                Header: dynamicLabels.geofence_s || "Territory Name",
                accessor: "geofenceName"
              },
              {
                Header: (dynamicLabels.resource_s|| 'Fleet ')+"Type Count",
                Cell: ({ cell: {row} }:any) =>{
                  
                 const editMOdeRowId = store.getState().tripPlanningScheduler.form?.outsourcedFleetEditModeId
                 const attachedTerritories= store.getState().tripPlanningScheduler.form?.formData.attachedTerritories
                 const [number, setNumber] = useState(attachedTerritories[editMOdeRowId]?.geofences?.[row.original?.geofenceId] || 0) 
                 return <div className="attachToTerritoriesInput">
                    <input type="number" value={number} min={0}
                    onChange={(e:any)=>{
                        const newData= data
                        newData[row.index]={...data[row.index], count:e?.target?.value}
                        // setData(newData)
                        setNumber(e?.target?.value)
                        dispatch({type:'@@planningForm/ATTACH_FLEET_TO_TERRITORIES', payload:{
                           rowId:editMOdeRowId,
                           geoFence:{...attachedTerritories[editMOdeRowId]?.geofences, [row.original.geofenceId]:e?.target?.value}
                        }})
                    }}/>
                    </div>
                }
                 
              }
            
          
        ],
        []
      );
    return <Modal open={!!isShowAttachToTerritories} onToggle={() => { }} size='md'>
        {{
            header: <ModalHeader
                headerTitle={`Attach ${dynamicLabels.resource_s} Type to ${dynamicLabels.geofence_p}`}
                imageVariant='icomoon-close'
                handleClose={handleClose}
            />,
            content: (
                <>
                <AttactToTerritoriesModalWrapper>
                    <RowSummary>
                        <div>{dynamicLabels.resource_s || 'Fleet' } Type: {territoryData?.fleetTypeName}</div>
                        <div>{dynamicLabels.vehicle|| 'Vehicle'} assigned to {dynamicLabels.geofence_p || 'Territories'} : <span className={vehicleToTerritory>fleetCount?'red': ''} style={{fontSize:'12px'}}>{vehicleToTerritory}</span> / {fleetCount}</div>
                        </RowSummary>
                        <TableWrapper>
                    <Table columns={columns} data={data} setVehicletoTerritory={setVehicletoTerritory} vehicleToTerritory={vehicleToTerritory} attachTerritoriesRowId={attachTerritoriesRowId} selectedGeofences={territoryData?.geofences} />
                    </TableWrapper>
                    {/* <ActionButton>
                  
                            </ActionButt> */}
                            </AttactToTerritoriesModalWrapper>
                            
                </>),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    {
                       <> 
                       <IconButton id='planningForm-AttachedToTerritories-Modal-Apply' iconVariant='icomoon-save' primary
                       onClick={()=>{
                        dispatch({
                            type:'@@planningForm/HIDE_ATTACH_TERRITORIES_MODAL', 
                            payload:{
                                rowId: attachTerritoriesRowId
                            }
                        })
                        setVehicletoTerritory(0)
                       }}
                       disabled={vehicleToTerritory>fleetCount}
                       >{dynamicLabels.apply}
                       </IconButton>
                      <IconButton 
                      id='planningForm-AttachedToTerritories-Modal-close'
                      iconVariant='icomoon-close'
                       onClick={handleClose}
                       >{dynamicLabels.cancel}
                       </IconButton>
                       </>
                    }
                </Box>
            )
        }}
    </Modal>

}
export default AttachToTerritories