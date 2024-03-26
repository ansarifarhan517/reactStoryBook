import React, { Dispatch, useEffect } from 'react'
import { TextInput,DatePicker, DropDown } from 'ui-library'
import { Cell } from 'react-table'
import { useTypedSelector } from '../../redux/rootReducer'
import { useDispatch } from 'react-redux'
import { DriverListViewActions } from '../../../modules/Driver/DriverListView/DriverListView.actions'
import { VEHICLE_EDITABLE_CELL_MAPPING } from '../../../modules/Vehicle/VehicleListView/Cell/index'
import useDebounce from '../../useDebounce'
import CarrierListEditableCellMapping from '../../../modules/Carrier/CarrierListView/CarrierListView.EditableCell'
import { SHIPPER_EDITABLE_CELL_MAPPING } from '../../../modules/Shipper/ShipperListView/Cell'
import DA_EDITABLE_CELL_MAPPING from '../../../modules/DeliveryAssociate/DeliveryAssociateListView/Mongo/DAListViewEditable'
import ORDER_LIST_EDITABLE_CELL_MAPPING from '../../../modules/Order/SubComponent/OrderListEditableCellMapping'
import { ORDERREQUEST_EDITABLE_CELL_MAPPING } from '../../../modules/OrderRequest/OrderRequestListView/Cell'
import { FLEETTYPE_EDITABLE_CELL_MAPPING } from '../../../modules/FleetType/Cell'
import TRIP_LIST_VIEW_EDITABLE_CELL_MAPPING from '../../../modules/Trips/Mile/TripsListView/subComponents/TripListViewEditable'
// import moment from 'moment'
// import useClientProperties from '../../../modules/common/ClientProperties/useClientProperties'
// import { OrderListViewActions } from '../../../modules/Order/OrderListView/OrderListView.actions'

import ALL_ADDRESSES_INLINE_EDITABLE_CELL_MAPPING from '../../../modules/customer-master/address/pages/list-view/config/inline-edit-mappings'
import CUSTOMER_LIST_VIEW_EDITABLE_CELL_MAPPING from '../../../modules/Customer/CustomerListView/SubComponent/EditableCellMapping/index'
import TERRITORY_EDITABLE_CELL_MAPPING from '../../../modules/Terriotory/TerritoryListView/Cell/TerritoryListViewEditable'
import CONTRACT_LIST_VIEW_EDITABLE_CELL_MAPPING from '../../../modules/Contract/ContractListView/SubComponent/EditableCellMapping/index'
import { MOBILE_ROLES_EDITABLE_CELL_MAPPING } from "../../../modules/OnboardingWrapper/MobileRoles/Cell";
import { MOBILE_TEMPLATES_EDITABLE_CELL_MAPPING } from "../../../modules/OnboardingWrapper/MobileTemplates/Cell";
import RATE_PROFILE_LIST_VIEW_EDITABLE_CELL_MAPPING from '../../../modules/RateProfile/RateProfileListView/SubComponent/EditableCellMapping/index'
import { TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING }from '../../../modules/ScheduledTripPlanning/PlanningForm/subComponents/Cell/index'
import { AdminDashboardActions } from '../../../modules/AdminDashboard/AdminDashboard.actions'
import useClientProperties from '../../../modules/common/ClientProperties/useClientProperties'
import moment from 'moment'
import { ALL_EXCEPTIONS_EDITABLE_CELL_MAPPING, MANIFEST_EXCEPTION_EDITABLE_CELL_MAPPING, ORDER_EXCEPTIONS_EDITABLE_CELL_MAPPING } from '../../../modules/OnboardingWrapper/ExceptionHandling/Cell'
const EDITABLE_CELL_MAPPING = {
  driver: {
    default: ({ row, column, value }: Cell<any>) => {
      const dispatch = useDispatch<Dispatch<DriverListViewActions>>()
      const editDetails = useTypedSelector(state => state.driver.listView.editDetails)
      const lastUpdatedCell = useTypedSelector(state => state.driver.listView.lastUpdatedCell)
      const columnStructure = useTypedSelector(state => state.driver.listView.structure.columns)
      const [inputVal, setInputVal] = React.useState(value)
      const debouncedValue = useDebounce(inputVal, 300)

      useEffect(() => {
        if (value === debouncedValue) {
          // dispatch({
          //   type: '@@driverListView/REMOVE_EDIT_DETAILS',
          //   payload: {
          //     rowId: row?.original?.driverId,
          //     columnId: column.id
          //   }
          // })
        } else {
          dispatch({
            type: '@@driverListView/SET_EDIT_DETAILS',
            payload: {
              rowId: row?.original?.driverId,
              columnId: column.id,
              value: debouncedValue,
              hasError: false
            }
          })
        }
      }, [debouncedValue])

      return <TextInput id={`editableCell-${row.id}-${column.id}`}
        autoFocus={`${row.original.driverId}-${column.id}` === lastUpdatedCell}
        defaultValue={
          editDetails?.[row.original.driverId]?.[column.id] ?
            editDetails?.[row.original.driverId]?.[column.id]?.value || ''
            : value
        }
        error={editDetails?.[row.original.driverId]?.[column.id]?.hasError}
        variant='inline-edit'
        maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
        onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value
          setInputVal(value)
        }, [setInputVal])} />
    },

    customDropdown: ({ row, column, value }: Cell<any>) => {
      const editDetailsValue = useTypedSelector(state => state.driver.listView.editDetails?.[row.original.id]?.[column.id]?.value)
      const dropdown = useTypedSelector(state => state.driver.listView.structure.columns[column.id].dropdownValues);
      // const lastUpdatedCell = useTypedSelector(state => state.order.listView.lastUpdatedCell)

      
  
      const dispatch = useDispatch<Dispatch<DriverListViewActions>>()
      const optionList = React.useMemo(() => {
  
        return Object.values(dropdown).map(function(key){
          return {
            value: key,
            label: key,
          }
          })
      }, [dropdown])
  
      return <DropDown
        value={editDetailsValue || value}
        onChange={(val: any) => {
          console.log("data", row.original, column.id, val);
          dispatch({
            type: '@@driverListView/SET_EDIT_DETAILS',
            payload: {
              rowId: row?.original?.id,
              columnId: column.id,
              value: val,
              hasError: false
            }
          })
        }}
        variant='inline-edit'
        optionList={optionList}
        width='100%'
      />
    }
  },
  outSourcedFleet: TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING,
  ownedFleet: TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING,
  carrier: CarrierListEditableCellMapping,
  vehicle: VEHICLE_EDITABLE_CELL_MAPPING,
  deliveryMedium: DA_EDITABLE_CELL_MAPPING,
  fleet: FLEETTYPE_EDITABLE_CELL_MAPPING,
  shipper: SHIPPER_EDITABLE_CELL_MAPPING,
  orderRequest: ORDERREQUEST_EDITABLE_CELL_MAPPING,
  order: ORDER_LIST_EDITABLE_CELL_MAPPING,
  customer: CUSTOMER_LIST_VIEW_EDITABLE_CELL_MAPPING,
  contract: CONTRACT_LIST_VIEW_EDITABLE_CELL_MAPPING,
  trips: TRIP_LIST_VIEW_EDITABLE_CELL_MAPPING,
  territory: TERRITORY_EDITABLE_CELL_MAPPING,
  rateProfile: RATE_PROFILE_LIST_VIEW_EDITABLE_CELL_MAPPING,
  adminDashboard: {
    clientExpiryDt: ({ row, column, value }: Cell<any>) => {
      const dispatch = useDispatch<Dispatch<AdminDashboardActions>>()
    const editDetails = useTypedSelector(state => state.adminDashboard.adminDashboard.clientDetails.editDetails)
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const [isPartialSelection, setIsPartialSelection] = React.useState<boolean>(false)

    const setDate = (date: any) => {
      dispatch({
        type: '@@adminDashboard/CLIENT_DETAILS/SET_EDIT_DETAILS',
        payload: {
          rowId: row?.original?.clientId,
          columnId: column.id,
          value: date
        }
      })
    }
      
    return <DatePicker
    onChange={(e: any) => {
      if (isPartialSelection) {
        setDate(e);
        setIsPartialSelection(false)
      }
      setIsPartialSelection(true)
    }}
      variant='datetime'
      timeFormat={24}
      style={{ zIndex: 1 }}
    >
      {({ open, setOpen }) => (
        <div onClick={() => setOpen(!open)}>
          <TextInput
            id='expiryDate'
            name='expiryDate'
            labelColor='text.inputLabel.default'
            className='expiryDate  '
            variant='withIcon'
            iconVariant='calendar'
            value={
              editDetails?.[row.original.clientId]?.[column.id] ?
                editDetails?.[row.original.clientId]?.[column.id]?.value || ''
                : moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)
            }
            iconSize='md'
            // required
            //   error={transactionDateError}
            // errorMessage='Mandatory field'
            // defaultValue={
            //   editDetails?.[row.original.clientId]?.[column.id] ?
            //     editDetails?.[row.original.clientId]?.[column.id]?.value || ''
            //     : moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)
            // }
            // value={startDate}
            onChange={() => { }}
            iconStyle={{ padding: '8px 8px 8px 8px' }}
          />
        </div>
      )}
    </DatePicker>
    },
    default: ({ row, column, value }: Cell<any>) => {
      const dispatch = useDispatch<Dispatch<AdminDashboardActions>>()
      const editDetails = useTypedSelector(state => state.adminDashboard.adminDashboard.pendingActivation.editDetails)
      const columnStructure = useTypedSelector(state => state.adminDashboard.adminDashboard.pendingActivation.structure.columns)
      const lastUpdatedCell = useTypedSelector(state => state.adminDashboard.adminDashboard.pendingActivation.lastUpdatedCell)
      const [inputVal, setInputVal] = React.useState(value)
      const debouncedValue = useDebounce(inputVal, 300)

      useEffect(() => {
        if (value === debouncedValue) {
        } else {
          dispatch({
            type: '@@adminDashboard/PENDING_ACTIVATION/SET_EDIT_DETAILS',
            payload: {
              saasRowId: row?.original?.id,
              saasColumnId: column.id,
              saasValue: debouncedValue,
              saasHasError: false
            }
          })
        }
      }, [debouncedValue])

      return <TextInput id={`editableCell-${row.id}-${column.id}`}
      autoFocus={`${row.original.id}-${column.id}` === lastUpdatedCell}
        defaultValue={
          editDetails?.[row.original.id]?.[column.id] ?
            editDetails?.[row.original.id]?.[column.id]?.saasValue || ''
            : value
        }
        error={editDetails?.[row.original.id]?.[column.id]?.hasError}
        variant='inline-edit'
        maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
        onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value as string
            setInputVal(value)
          // }
        }, [setInputVal])}
      />
    }
  },
  mobileRoles: MOBILE_ROLES_EDITABLE_CELL_MAPPING,
  all_addresses: ALL_ADDRESSES_INLINE_EDITABLE_CELL_MAPPING,
  mobileTemplates: MOBILE_TEMPLATES_EDITABLE_CELL_MAPPING,
  allExceptions: ALL_EXCEPTIONS_EDITABLE_CELL_MAPPING,
  orderExceptions: ORDER_EXCEPTIONS_EDITABLE_CELL_MAPPING,
  manifestExceptions: MANIFEST_EXCEPTION_EDITABLE_CELL_MAPPING
}

export default EDITABLE_CELL_MAPPING

// isActiveFl(pin):true
// customerId(pin):12848660
// accountCode(pin):"FGVCD0023211"
// accountName(pin):"asfjkagsf"
// address(pin):"Rocks,Business,Park,6576,Mumbai,Maharashtra,INDIA,400076"
// mobileNumber(pin):"7506322223107"
// emailAddress(pin):"bhavesh1@mailinator.com"
// clientCode(pin):"Vendor Demo"
