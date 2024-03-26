import React from 'react'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import {BreadCrumb}  from 'ui-library'
import { routeContains, hybridRouteTo } from '../../../../utils/hybridRouting'
const BreadCrumbOption= ()=>{

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.tripPlanningScheduler)
    const breadCrumbOptions = React.useMemo(() => {
        const list: any = [
          { id: 'Routes', label: dynamicLabels.route_p || 'Routes', disabled: true },
          { id: 'TripPlanningSchedulers', label: dynamicLabels?.tripPlanningSchedulers || 'Trip Planning Schedulers', disabled: false },
          { id: 'AddScheduler', label: routeContains('updateTripPlanningScheduler')? dynamicLabels?.updateScheduler || 'Update Scheduler': dynamicLabels?.addScheduler || 'Add Scheduler', disabled: true },
        ]
        return list
      }, [dynamicLabels])
    return (
        <BreadCrumb
        options={breadCrumbOptions}
        width='260px'
        onClick={()=>{hybridRouteTo('tripPlanningSchedulers')}}
      />
    )
}
export default  BreadCrumbOption