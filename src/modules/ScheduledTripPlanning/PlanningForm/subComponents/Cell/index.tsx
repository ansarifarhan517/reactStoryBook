
import DefaultCell from '../../../../../utils/components/CellMapping/DefaultCell'
import SquareCell from './SquareCell'
import NumberSelectCell from './NumberSelectCell'
import StatusMappedCell from './StatusMappedCell'
import ToggleCell from './ToggleCell'
import DropdownCell from './OriginSelectCell'
import AttachedToTerritoriesCell from './AttachedToTerritoriesCell'
// import { Cell } from 'react-table'
// import { useDispatch } from 'react-redux'
// import { TripPlanningScheduler } from '../../PlanningForm.actions'
// import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
// import useDebounce from '../../../../../utils/useDebounce'
//  import NumberCount from '../../../../../utils/components/CellMapping/NumberCountCell'



export const TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING = {
  default: DefaultCell,
  noOfUsers: SquareCell,
  isActiveFl: ToggleCell,
  // status: StatusMappedCell,
  availableFleetCount:NumberSelectCell,
  attachedTerritories:AttachedToTerritoriesCell,
  origin: DropdownCell
}
