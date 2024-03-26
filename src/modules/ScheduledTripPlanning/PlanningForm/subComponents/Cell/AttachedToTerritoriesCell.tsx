import React from 'react'
import { StyledSquare } from '../../../../../utils/components/CellMapping/StyledCellMapping';
import store from '../../../../../utils/redux/store'
import {useToast} from 'ui-library'

export default ({ value ,row,column, data}: any) => {
    // const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.tripPlanningScheduler)
    const toast= useToast()
    const rowsSelector = store.getState().tripPlanningScheduler.form.data?.outSourcedFleet.results
    const editedRow = store.getState().tripPlanningScheduler.form.formData?.attachedTerritories
    const editedRowGeofences = store.getState().tripPlanningScheduler.form.formData?.attachedTerritoriesFinal
    const selectedValueRow = editedRow? editedRow?.[row?.original?.index] : rowsSelector[row.index]
    const territoryList= store.getState().tripPlanningScheduler.form?.data?.territories?.geofenceMasterDTOs
    let countGeofences= 0
    editedRowGeofences?.[row?.original?.index]?.geofences &&  Object.values(editedRowGeofences?.[row?.original?.index]?.geofences)?.map((value:any)=>{
        countGeofences= countGeofences+parseInt(value)
    }) 
    console.log("editedRow", editedRow)
    return <StyledSquare
        disabled={false}
        onClick={() => {
            if(territoryList && territoryList.length){
                column?.['cellCallback']( value ,{...row.original,selectedFleetCount: selectedValueRow?.selectedFleetCount, attachedTerritories:selectedValueRow?.selectedFleetCount }, row.index)
            }
            else{
                toast.add('Territory profile needs to be selected for attaching fleet to territories.' ,'warning', false )
            }
               
        }}
    >
        { countGeofences +` / `+ (selectedValueRow?.selectedFleetCount || row?.original?.selectedFleetCount)}
    </StyledSquare>
}




