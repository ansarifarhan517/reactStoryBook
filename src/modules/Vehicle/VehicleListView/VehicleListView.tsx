import React, { useEffect, Dispatch, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ColumnInstance } from 'react-table';
import {
  Card,
  Box,
  ListView,
  IListViewColumn,
  IFetchDataOptions,
  withPopup,
  Modal,
  ModalHeader,
  IconButton,
  withToastProvider,
  useToast,
  ISelectedRows,
  ButtonGroup,
  Grid,
  BreadCrumb,
  Tooltip,
  IFilterOptions,
  ISortOptions,
} from 'ui-library';
import { SortingRule } from 'react-table'
import FileSaver from 'file-saver';
import { ListViewWrapper, StyledGrid, NoDataWrapper } from './VehicleListView.styled'
import breadcrumbOptions from './utils/breadcrumbState'
import { VehicleListViewActions, ISetViewMode } from './VehicleListView.actions';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import withRedux from '../../../utils/redux/withRedux';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { withThemeProvider } from '../../../utils/theme';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { IRowData, tBreadcrumbState } from './VehicleListView.models';
import { hybridRouteTo, getQueryParams, } from '../../../utils/hybridRouting';
import UploadExcel from '../../../utils/wrapper/uploadExcel';
import VehcileListViewMap from './VehicleListViewMap';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import EmptyData from '../../../utils/components/EmptyData'
import { IStateService } from 'angular-ui-router';
import { sendGA } from '../../../utils/ga';
import capacityConversion from './utils/capacityConversion'
import {
  AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper, FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel,
  //  SectionHeader, Accordion
} from '../../OrderRequest/OrderRequestListView/StyledOrderRequestListView';
import CreateActionBarButton from '../../common/ActionBar/CreateActionBarButton';
import DeleteConfirmationModal from '../../../utils/components/DeleteConfirmationModal';
import DownloadMessage from '../../../utils/components/DownloadMessage'
import InlineEditConfirmationModal from '../../../utils/components/InlineEditConfirmationModal';
import {AdvancedFilterComponentActions} from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import AdvancedFilterComponent from '../../common/AdvancedFilterComponent'
import { throwError, validateRows } from '../../common/InlineEdit/InlineEdit';
import { handleCustomColumnSort } from '../../../utils/helper';
import CompartmentListViewModal from '../../OnboardingWrapper/ModuleConfiguration/CompartmentConfiguration/Components/CompartmentListViewModal';
import TrackerListViewModal from './TrackersListViewModal'
import moment from 'moment';

interface IVehicleListViewProps {
  ngStateRouter: IStateService
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const VehicleListView = ({ ngStateRouter }: IVehicleListViewProps) => {
  /** General Hooks */
  console.log(ngStateRouter);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.vehicle + ',Resources');
  useDynamicLabels(DYNAMIC_LABELS_MAPPING.vehicleTripReport);
  useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0])
  // const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.driver)
  const toast = useToast();

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<VehicleListViewActions>>();
  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
  const structure = useTypedSelector(state => state.vehicle.listView.structure);
  const columnsSelector = useTypedSelector(state => state.vehicle.listView.structure.columns);
  const rowsSelector = useTypedSelector(state => state.vehicle.listView.data.results);
  const totalRowsSelector = useTypedSelector(state => state.vehicle.listView.data.totalCount);
  const pageLabels = useTypedSelector(state => state.pageLabels.vehicle);
  const actionBarButtons = useTypedSelector(state => state.vehicle.listView.structure.buttons);
  const viewMode = useTypedSelector(state => state.vehicle.listView.viewMode);
  const editDetails = useTypedSelector(state => state.vehicle.listView.editDetails);
  const loading = useTypedSelector(state => state.vehicle.listView.loading.listView);
  const columnsLoading = useTypedSelector(state => state.vehicle.listView.loading.columns);
  const breadcrumbState = useTypedSelector(state => state.vehicle.listView.breadcrumbState);
  const clientMetric = useTypedSelector(state => state.vehicle.listView.clientMetric)
  // adv filter
  const emptyData = useTypedSelector(state => state.vehicle.listView.emptyData);
  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
  const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
  const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
  const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)


  const [columns, setColumns] = useState<IListViewColumn[]>([]);

  const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);

  const [vehicleActivationRequest, setVehicleActivationRequest] = useState<
    | { activeRequest: boolean; vehicleIds: Record<number, boolean>; failureCallback?: React.Dispatch<React.SetStateAction<boolean>> }
    | undefined
  >();
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false);
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState<boolean>(false)
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [isDownloadReportDisabled, setDownloadReportDisabled] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false)
  const [filters, setFilters] = useState<Record<string, string>>()
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  const [sort, setSort] = useState<SortingRule<object>[]>()
  const [selectedVehicle, setSelectedVehicle] = useState<IRowData>();
  const [isCompartmentListModalVisible, setCompartmentListModalVisible] = useState<boolean>(false);
  const [isTrackerListModalVisible, setTrackerListModalVisible] = useState<boolean>(false);
  const AdvanceFilterData = { 
    sectionName : 'vehicle' 
}
const pageName="vehicle"

  /** Variables */
  const ButtonGroupData = React.useMemo(
    () =>
      pageLabels?.viewOptions
        ? Object.keys(pageLabels?.viewOptions).map((key: string) => ({
          id: key,
          label: pageLabels?.viewOptions[key].toUpperCase(),
          selectecd: key === viewMode,
          icon: key === 'mapview' ? 'default-marker' : 'menu',
          tooltipText:
            key === 'mapview'
              ? `${dynamicLabels.showsTheCurrentLocationOfThe} ${dynamicLabels.Resources} ${dynamicLabels.onAMap}`
              : `${dynamicLabels.showsTheListViewOfAllThe} ${dynamicLabels.Resources}`,
        }))
        : [],
    [pageLabels, viewMode, dynamicLabels],
  );

  const breadCrumbOptions = React.useMemo(
    () => [
      { id: 'fleet', label: dynamicLabels.Resources, disabled: true },
      { id: 'vehicle', label: dynamicLabels.vehicles, disabled: true },
      {
        id: breadcrumbState, label: `${dynamicLabels[breadcrumbState.toLowerCase()] || 'All'} ${dynamicLabels.vehicles}`, value: breadcrumbState, disabled: false, toolTipMessage: `${dynamicLabels.ClickHereToSortTheListOfVehicleOnTheBasisOfStatus}`
      },
    ],
    [pageLabels, dynamicLabels, breadcrumbState],
  );

  const vechileBreadcrumbOptionList = React.useMemo(() => [
    {
      id: 'All', label: `${dynamicLabels.all} ${dynamicLabels.vehicles}`, value: 'All',
    },
    {
      id: 'Available', label: `${dynamicLabels.available} ${dynamicLabels.vehicles}`, value: 'Available'
    },
    {
      id: 'Inactive', label: `${dynamicLabels.inactive} ${dynamicLabels.vehicles}`, value: 'Inactive'
    },
    {
      id: 'Intransit', label: `${dynamicLabels.intransit} ${dynamicLabels.vehicles}`, value: 'Intransit'
    },
  ], [pageLabels, dynamicLabels])

  // const MoreButtonOptionList = React.useMemo(
  //   () => {
  //     return [
  //       { value: 'active', label: `${dynamicLabels.markAsActive}`, tooltipText: `${dynamicLabels.markStatusAsActive}` },
  //       { value: 'inactive', label: `${dynamicLabels.markAsInactive}`, tooltipText: `${dynamicLabels.markStatusAsInactive}` },
  //     ]
  //   },
  //   [dynamicLabels, actionBarButtons],
  // );




  // HANDLE QUERY PARAMS FOR HISTORY RENTENTION
  const handleQueryParams = () => {
    const filterData: Record<string, string> = getQueryParams();

    /** Initialize Sort Options from Query Params */
    let sortBy = filterData?.sortBy?.split('#@#')
    let sortOrder = filterData?.sortOrder?.split('#@#')

    let sort: SortingRule<object>[] = [];
    sortBy?.forEach((element: string, index: number) => {
      let temp = {
        id: element,
        desc: sortOrder[index] === 'DESC'
      }
      sort.push(temp)
    });
    sort && setSort(sort)

    /** Initialize Filter from Query Params */
    let searchBy = filterData?.searchBy?.split('#@#');
    let searchText = filterData?.searchText?.split('#@#');

    let temp: Record<string, string> = {}
    searchBy && searchText &&
      searchBy?.forEach((s, index) => {
        temp[s] = searchText[index]
      })

    setFilters(temp)

    let breadcrumb: tBreadcrumbState = filterData?.page as tBreadcrumbState

    dispatch({
      type: '@@vehicleListView/SET_BREADCRUMB_STATE',
      payload: breadcrumb || 'All',
    });
  }


  /** Watchers */
  useEffect(() => {
    handleQueryParams()
    fetchBranchName()
    handleFetchFilters()
    advanceFilterdispatch({
      type: "@@advanceFilter/UPDATE_FIRST_LOAD",
      payload: false,
    });
    dispatch({ type: '@@vehicleListView/FETCH_STRUCTURE' });
    dispatch({ type: '@@vehicleListView/SET_INTRANSIT_MESSAGE', payload: dynamicLabels.inTransitMessage })
    handleFetchData(fetchOptions);
    return () => { 
            advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
            advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
            advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false }); 
          }
  }, []);

  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'vehicle', cellCallbackMapping);
      const transformedColumn = newColumns.map((column: any) => {
        const newcolumn = column;
        if(column.accessor === 'tripNumber'){
          newcolumn.hrefdata ="`#/tripHst/tripDetails?tripId=${row?.original?.tripDetail?.tripId}`";
          newcolumn.columnDisplayVal = "`${row?.original?.tripDetail?.tripNumber}`"
        }
        return newcolumn;
      });
      setColumns(transformedColumn);
    }
    advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
  }, [columnsSelector]);

  const fetchBranchName = async () => {
    // const userAccessInfo:string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')

    try {
      const data = await axios.get(
        apiMappings.vehicle.listView.branchNames, {
        data: {},
        params: {
          //  ...getParams()
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (data.status === 200) {
        dispatch({ type: '@@vehicleListView/SET_BRANCH_NAME', payload: data.data });
        return;
      }
    } catch (errorMessage) {
      const message = errorMessage?.response?.data?.message;
      toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false);
    }
  }
  /** Cell Callbacks */
  const handleVehicleActivation = async () => {
    if (!vehicleActivationRequest) {
      return;
    }
    setVehicleActivationRequest(undefined);

    if (Object.keys(vehicleActivationRequest.vehicleIds).length === 1) {
      const vehicleId = Number(Object.keys(vehicleActivationRequest.vehicleIds)[0]);
      dispatch({
        type: '@@vehicleListView/UPDATE_DATA',
        payload: {
          vehicleId,
          isActiveFl: vehicleActivationRequest.activeRequest,
        },
      });
    }

    const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
    try {
      const {
        data: { message, status },
      } = await axios.put(
        apiMappings.vehicle.listView.activationRequest + '?access_token=' + userAccessInfo['accessToken'].split('BASIC ')[1] + '&CLIENT_SECRET_KEY=' + userAccessInfo['CLIENT_SECRET_KEY'],
        Object.keys(vehicleActivationRequest.vehicleIds).map(id => ({
          vehicleId: Number(id),
          isActiveFl: vehicleActivationRequest.activeRequest,
        })),
      );
      if (status === 200) {
        toast.add(dynamicLabels.statusUpdatedSuccessfully, 'check-round', false);
        handleFetchData(fetchOptions);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        return;
      }
      throw message;
    } catch (errorMessage) {
      vehicleActivationRequest.failureCallback && vehicleActivationRequest.failureCallback(!vehicleActivationRequest.activeRequest);
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false);
    }
  };

  const handleActiveFlChange = (
    isChecked: boolean,
    { vehicleId }: IRowData,
    failureCallback: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const vehicleIds = {
      [vehicleId]: true,
    };
    setVehicleActivationRequest({ activeRequest: isChecked, vehicleIds, failureCallback });
  };

  const handleNumberOfCompartments = (row: IRowData) => {
    dispatch({ type: '@@vehicleListView/FETCH_COMPARTMENT_LIST_STRUCTURE'});
    setSelectedVehicle(row)
    setCompartmentListModalVisible(true);
  }
  const handleNumberOfTrackers = (row: IRowData) => {
    dispatch({ type: '@@vehicleListView/FETCH_TRACKER_LIST_STRUCTURE'});
    setSelectedVehicle(row)
    setTrackerListModalVisible(true);
  }
  const cellCallbackMapping = {

    isActiveFl: handleActiveFlChange,
    compartmentCount: handleNumberOfCompartments,
    trackerCount: handleNumberOfTrackers
  };

  /** Inline Edit */
  const validateSelectedRows = () => {
    const columnStructure = columnsSelector;
    try {
      validateRows(editDetails,columnStructure);
      
    } catch (error) {
      throwError(error);

      if (error.message) {
        toast.add(error.message, '', false);
      }
      return false;
    }

    return true;
  };

  const handleSaveRows = async () => {
    const isValid = validateSelectedRows();

    if (isValid) {
      const payload: Partial<IRowData>[] = [];
      Object.values(selectedRows).forEach(row => {

        if (editDetails[row.vehicleId]) {
          const obj: Partial<IRowData> = {
            vehicleId: row.vehicleId,
          };
          Object.keys(columnsSelector).forEach(columnId => {
            if (columnsSelector?.[columnId]?.editable && !columnsSelector?.[columnId]?.customField) {
              switch (columnId) {
                case 'branchName': {

                  if (editDetails?.[row.vehicleId]?.[columnId]?.value) {
                    obj['clientBranchId'] = editDetails?.[row.vehicleId]?.[columnId]?.value || row[columnId];

                  } else {
                    obj[columnId] = row[columnId];

                  }
                  break;
                }
                case 'minCapacityUtilizationInVolume':
                case 'capacityInVolume': {
                  const clientObj = clientMetric.find(c => c.name === 'volume')
                  const emptyValue = editDetails?.[row.vehicleId]?.[columnId]?.value

                  const val = emptyValue !== undefined && capacityConversion(parseFloat(editDetails?.[row.vehicleId]?.[columnId]?.value), 'POST', clientObj?.conversionFactor)

                  const val2 = capacityConversion(parseFloat(row[columnId]), 'POST', clientObj?.conversionFactor)
                  obj[columnId] = emptyValue === undefined ? val2 : val ? val : 0

                  break;
                }
                case 'minCapacityUtilizationInWeight':
                case 'capacityInWeight': {

                  const clientObj = clientMetric.find(c => c.name === 'weight')
                  const emptyValue = editDetails?.[row.vehicleId]?.[columnId]?.value

                  const val = emptyValue !== undefined && capacityConversion(parseFloat(editDetails?.[row.vehicleId]?.[columnId]?.value), 'POST', clientObj?.conversionFactor)

                  const val2 = capacityConversion(parseFloat(row[columnId]), 'POST', clientObj?.conversionFactor)
                  obj[columnId] = emptyValue === undefined ? val2 : val ? val : 0

                  break;
                }
                case 'minSpeed' :
                case 'maxSpeed': {
                  const clientObj = clientMetric.find(c => c.name === 'speed')
                  const emptyValue = editDetails?.[row.vehicleId]?.[columnId]?.value
                  const val = emptyValue !== undefined && capacityConversion(parseFloat(emptyValue), 'POST', clientObj?.conversionFactor)
                  const val2 = capacityConversion(parseFloat(row[columnId]), 'POST', clientObj?.conversionFactor)
                  obj[columnId] = emptyValue === undefined ? val2 : val ? val : undefined
                  break;
                }
                default: {

                  obj[columnId] = editDetails?.[row.vehicleId]?.[columnId]?.value || row[columnId];
                }

              }

            }
          });

          payload.push(obj);
        }
      });

      if (!payload.length) {
        handleCancelRows();
        return;
      }

      try {
        const {
          data: { message, status },
        } = await axios.put(apiMappings.vehicle.listView.inlineUpdate, payload);
        if (status === 200) {
          handleFetchData(fetchOptions);
          setEditMode(false);
          fetchOptions.apis?.resetSelection();
          setSelectedRows({});
          dispatch({ type: '@@vehicleListView/CLEAR_EDIT_DETAILS' });
          toast.add(dynamicLabels.vehicleUpdatedSuccessfully, 'check-round', false);
          return;
        }
        throw message;
      } catch (errorMessage) {
        const message = errorMessage?.response?.data?.message;        
        toast.add(message? message :dynamicLabels.vehicleUpdateFailed, 'warning', false);
      }
    }
  };

  const handleCancel = () => {
    if (!Object.keys(editDetails).length) {
      setEditMode(false);
      fetchOptions.apis?.resetSelection();
      setSelectedRows({});
    } else {
      setShowCancelConfirmationModal(true)
    }

  }

  const handleCancelRows = React.useCallback(() => {
    setShowCancelConfirmationModal(false)
    dispatch({ type: '@@vehicleListView/CLEAR_EDIT_DETAILS' });
    setEditMode(false);
    fetchOptions.apis?.resetSelection();
    setSelectedRows({});
  }, [fetchOptions]);

  /** Delete Request */
  const deleteSelectedRows = async () => {


    setShowDeletionConfirmation(false);
    try {
      const {
        data: data,
      } = await axios.delete(apiMappings.vehicle.listView.deleteRequest, {
        data: Object.values(selectedRows).map(row => row.referenceId),
      });

      if (data.status === 200) {
        toast.add(`${dynamicLabels.vehicleDeletedSuccessfully}`, 'check-round', false);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        handleFetchData(fetchOptions);
        return;
      }
      throw data?.message;
    } catch (errorMessage) {
      toast.add(dynamicLabels.vehicleFailedToBeDeleted, 'warning', false);
    }
  };

  const handleMoreOptions = React.useCallback(


    async (id: string) => {
      const selectedRowValues = Object.values(selectedRows);

      switch (id) {
        case 'inActive':
        case 'active':
          {
            /** Validate for marking already Active or Inactive vehicle*/
            const hasInvalidRequest = selectedRowValues.some(row => {
              if ((id === 'inActive' && !row.isActiveFl) || (id === 'active' && row.isActiveFl)) {
                return true;
              }
              return false;
            });

            if (hasInvalidRequest) {
              toast.add(dynamicLabels?.[id === 'active' ? 'vehicleAlreadyActive' : 'vehicleAlreadyInActive'], 'warning', false);
              return;
            }
            const vehicleIds = {};
            selectedRowValues.forEach(row => (vehicleIds[row.vehicleId] = true));
            setVehicleActivationRequest({
              activeRequest: id === 'active',
              vehicleIds,
            });

            break;
          }
      }
    },
    [selectedRows, dynamicLabels],
  );

  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    sortOptions = handleCustomColumnSort(sortOptions)
    dispatch({
      type: '@@vehicleListView/SET_LOADING',
      payload: { listView: true },
    });
    console.log('[Vehiclelisview.tsx] ====>', filterOptions);
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });

    dispatch({
      type: '@@vehicleListView/FETCH_DATA',
      payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
      },
    });
  }, [filterListPayload]);

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
  }, []);


  const handleActionBarButtonClick = React.useCallback((id: string) => {


    switch (id) {
      case 'delete':
        setShowDeletionConfirmation(true);
        break;

      case 'update':
        setEditMode(true);
        break;

      case 'more':
        break;
    }
  }, []);

  const handleDownloadReport = async () => {
    sendGA('Vehicle action button','Vehicle List View Download Report')

    setShowDownloadModal(true)
    setDownloadReportDisabled(true);
    // let payload = breadcrumbOptions[breadcrumbState]
    let filterOptions = fetchOptions.filterOptions
    let temp = {
      ...fetchOptions,
      searchBy: filterOptions?.searchBy,
      searchText: filterOptions?.searchText
    }
    delete temp.filterOptions


    // new logic


    const breadCrumbValue = breadcrumbState;
    let actionPayload = { ...fetchOptions }
    let filter = {
      ...fetchOptions,
      searchBy: filterOptions?.searchBy,
      searchText: filterOptions?.searchText
    }
    delete temp.filterOptions

    if (breadCrumbValue && breadCrumbValue !== 'All') {
      if (actionPayload?.filterOptions?.searchBy && actionPayload?.filterOptions?.searchText) {
        filter = {
          ...filter,
          searchBy: breadcrumbOptions[breadCrumbValue]?.searchBy + '#@#' + actionPayload?.filterOptions.searchBy,
          searchText: breadcrumbOptions[breadCrumbValue].searchText + '#@#' + actionPayload?.filterOptions.searchText,
        }
      } else {
        filter = {
          ...filter,
          searchBy: breadcrumbOptions[breadCrumbValue]?.searchBy,
          searchText: breadcrumbOptions[breadCrumbValue]?.searchText,
        }
      }
    }
    // new logic ends

    try {
      console.log('Download   Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      const { data } = await axios.get(apiMappings.vehicle.listView.vehicleExcelDownload, {
        params: filter,
        responseType: 'arraybuffer',
      });
      console.log('Download   Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      FileSaver.saveAs(new Blob([data], { type: 'application/vnd.ms-excel xlsx' }), `${dynamicLabels.VehicleReport}.xlsx`);
      setDownloadReportDisabled(false);
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
    }
  };

  const onSaveColumnPreferences = React.useCallback(

    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {

      sendGA('Column Preference Action','Vehicle List View Save & Apply column')

      const columns = { ...columnsSelector };
      Object.keys(columns).forEach(columnKey => {
        columns[columnKey].permission = !!visibleColumns[columnKey];
      });

      const payload = {
        ...structure,
        columns,
      };

      try {
        const {
          data: { message },
        } = await axios.put(apiMappings.vehicle.listView.structure[breadcrumbState], payload);
        message && toast.add(`${dynamicLabels.columnPreferenceSuccess}`, 'check-round', false);
      } catch (error) {
        console.log(error, error?.response);
      }
    },
    [columnsSelector],
  );

  /*************** handle breadcrumb change *************** */
  const handleBreadCrumbChange = (value: string) => {
    let status = breadcrumbOptions[value]
    const _breadcrumbState = value as tBreadcrumbState
    console.log('[Vehiclelisview.tsx] ====>', status);
    dispatch({
      type: '@@vehicleListView/SET_BREADCRUMB_STATE',
      payload: _breadcrumbState || 'All',
    })

    /** Clear other filters & sorts when Breadcrumb Filter changes */
    setTimeout(() => {
      ngStateRouter.go('Vehicle', { page: status?.searchText || 'All' },
        ngStateRouterOptions)
    }, 2000)

    dispatch({ type: '@@vehicleListView/SET_LOADING', payload: { listView: true } })
    dispatch({ type: '@@vehicleListView/SET_COLUMNS_LOADING', payload: { columns: true } })
    dispatch({ type: '@@vehicleListView/FETCH_STRUCTURE' })
    dispatch({ type: '@@vehicleListView/FETCH_DATA' })
  }

  /********  FILTER CHANGE **************/
  const handleFilterChange = (combinedFilters: IFilterOptions) => {

    let existingParams = getQueryParams()

    /** Do not push to history when there is no change. */
    if ((!combinedFilters.searchBy && !existingParams.searchBy) || (combinedFilters.searchBy === existingParams.searchBy && combinedFilters.searchText === existingParams.searchText)) {
      return
    }

    const newParams = {
      page: breadcrumbState,
      ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
      ...(combinedFilters.searchBy ? { searchBy: combinedFilters.searchBy, searchText: combinedFilters.searchText } : {})
    }

    setTimeout(() => {
      ngStateRouter.go('Vehicle', newParams, ngStateRouterOptions)
    }, 2000)
  }

  /********  SORT  CHANGE **************/
  const handleSortChange = (sortOptions: ISortOptions) => {
    const existingParams = getQueryParams()

    /** Do not push to history when there is no change. */
    if ((!sortOptions.sortBy && !existingParams.sortBy) || (sortOptions.sortBy === existingParams.sortBy && sortOptions.sortOrder === existingParams.sortOrder)) {
      return
    }

    /** Construct new set of Query Params */
    const newParams = {
      page: breadcrumbState,
      ...(sortOptions.sortBy ? { sortBy: sortOptions.sortBy, sortOrder: sortOptions.sortOrder } : {}),
      ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {})
    }

    setTimeout(() => {
      ngStateRouter.go('Vehicle', newParams, ngStateRouterOptions)
    }, 2000)
  }

  /*********** Vehicle add Form ***********/
  const handleAddVehicle = () => {
    // Vehicle - Add button
    sendGA('Navigation','Vehicle List View Add button')
    hybridRouteTo('addvehicle');
    ngStateRouter.go('vehicleForm')
  }


  // handle fetch Filters
  const handleFetchFilters = async (callBackAdvanceFilter=false) => {

    if(( !isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'VEHICLE_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter){
      setIsFilterDataCalled(true)
      try {
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            modelName: 'VEHICLE',
            pageName: 'VEHICLE',
            sectionName: `VEHICLE_LIST_VIEW`
          }
        });
        if (data) {
          setIsFilterDataCalled(false)
          const isFavouriteFilter = data.find((filter: { isFavourite: boolean; }) => filter?.isFavourite);
          if (isFavouriteFilter) {
            advanceFilterdispatch({ type: '@@advanceFilter/SET_APPLIED_ADV_FILTER_DATA', payload: isFavouriteFilter?.filters });
          }
          advanceFilterdispatch({ type: '@@advanceFilter/SET_ADV_FILTER_DATA', payload: data });
        }
        return;
      } catch (errorMessage) {
        toast.add(dynamicLabels.updateFilterFailed, 'warning', false);
      }
    }
  }

  // handle remove filter
  const handleRemoveFilter = (showToast: boolean) => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, 'check-round', false);
  }
 
  const handleToggleAdvancedFilter = () => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: !openAdvFilter });
  }

  return (
    <>
      <div id='toast-inject-here'></div>
      <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100vh', paddingTop: '64px' }} px='15px' pb='15px'>
        {/* Header */}
        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px'>
          {/* <div title='breadcrumbs' className='cursor'>Bread crumbs come here</div> */}
          {/* <BreadCrumb options={breadCrumbOptions} onClick={() => {}} /> */}
          <div>
            <BreadCrumb
              options={breadCrumbOptions}
              onClick={handleBreadCrumbChange}
              optionList={vechileBreadcrumbOptionList}
              width='100px'

            />
            {filterListPayload &&
              <Tooltip maxWidth={700} tooltipDirection='bottom' messagePlacement='end' hover message={
                <div style={{ textAlign: 'left', fontSize: 12 }}>
                  <Box mb='10px'>Filters are applied on {filterListPayload.operationLogic === 'AND' ? 'ALL' : 'ANY'} of the the following conditions:</Box>
                  {currentFilter && currentFilter?.filters && currentFilter?.filters.map((f: any, i) => {
                    return <Box mb='5px'>{`${i + 1}. ${f.fieldLabelKey} ${f?.labelValue || f?.operationLabelKey} ${f.filterDataLabel ? f.filterDataLabel :f.filterData}`}</Box>
                  })}
                  <div>{currentFilter?.sortCriteria && currentFilter?.sortCriteria[0] && (
                    <Box mb='5px'>{currentFilter?.sortCriteria[0]?.fieldLabelKey + ' ' + currentFilter?.sortCriteria[0]?.operationSymbol}</Box>
                  )}</div>
                </div>
              }>

                <FilterAppliedTag>
                  <FilterAppliedTagLabel onClick={handleToggleAdvancedFilter}>{(currentFilter?.filterName?.trim()) || 'Filter Applied'}</FilterAppliedTagLabel>
                  <FilterAppliedTagButtonWrapper>
                    <IconButton
                      onClick={() => handleRemoveFilter(true)}
                      onlyIcon
                      iconVariant='close'
                      iconSize={10}
                      color='error.main'
                    />
                  </FilterAppliedTagButtonWrapper>
                </FilterAppliedTag>
              </Tooltip>
            }
          </div>




          {/* Page Action Buttons */}
          <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
            {pageLabels?.buttons.add && (
              <Tooltip message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels.vehicle}`} hover={true}>
                <IconButton
                  id = "vehicle--actionbar--add"
                  intent='page'
                  iconVariant='icomoon-add'
                  onClick={handleAddVehicle}
                  id="vehicle--actionbar--add"
                >
                  {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
                </IconButton>
              </Tooltip>
            )}

            {pageLabels?.buttons.upload && (
              <Tooltip message={`${dynamicLabels.clickHereToUploadAListOf} ${dynamicLabels.vehicles}`} hover={true} messagePlacement='end'>
                <IconButton
                  id="vehicle--actionbar--upload"
                  intent='page'
                  style={{ marginRight: 0 }}
                  iconVariant='icomoon-upload'
                  onClick={() => {
                    sendGA('Vehicle button action','Vehicle List View Upload excel')
                    setShowUploadPopup(true)
                  }}
                  id='vehicle--add--upload'
                >
                  {dynamicLabels[pageLabels?.buttons.upload] || dynamicLabels.Upload}
                </IconButton>
              </Tooltip>
            )}

            {ButtonGroupData.length > 0 && (
              <ButtonGroup
                data={ButtonGroupData}
                onChange={id => dispatch({ type: '@@vehicleListView/SET_VIEW_MODE', payload: id } as ISetViewMode)}
              />
            )}
          </Box>
        </Box>

        {/* LIST VIEW CONTAINER */}
        <StyledGrid
          container
          spacing={5}
          style={{ boxShadow: viewMode === 'listview' ? '0 2px 20px -10px #000' : '' }}
        >
          {!emptyData ?
            <>
              <Grid className='grid-customised-scroll-bar' item md={viewMode === 'listview' ? 12 : 4} style={{ display: 'flex', overflow: 'hidden' }}>
                {filterListPayload &&
                  <AppliedFilterStrip>
                    <AdvancedFilterLabel>Advanced Filter Applied</AdvancedFilterLabel>
                    <ButtonWrapper onClick={() => handleRemoveFilter(true)}>
                      <IconButton
                        onlyIcon
                        iconVariant='close'
                        iconSize={8}
                        color='grey'
                      />
                      <span>Clear Filter</span>
                    </ButtonWrapper>
                  </AppliedFilterStrip>
                }

                <Card
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    width: '100%',
                    paddingRight: 0,
                    paddingBottom: 0,

                  }}
                >
                  {columns.length > 0 && (
                    <ListViewWrapper className='VehicleListViewWrapper'>
                      <ListView
                        rowIdentifier='vehicleId'
                        style={{ height: '100%', overflow: 'visible' }}
                        columns={columns}
                        data={rowsSelector}
                        onFetchData={handleFetchData}
                        hideRefresh={loading || columnsLoading}
                        hasRowSelection={viewMode === 'listview' && !actionBarButtons?.['InlineEdit']?.permission}
                        hasRowSelectionWithEdit={viewMode === 'listview' && actionBarButtons?.['InlineEdit']?.permission}
                        onRowSelect={onRowSelect}
                        onSaveColumnPreferences={onSaveColumnPreferences}
                        totalRows={totalRowsSelector}
                        loading={loading || columnsLoading}
                        isEditMode={isEditMode}
                        onRowEditClick={row => {
                          hybridRouteTo(`updatevehicle/?vid=${row.referenceId}`);
                        }}
                        permanentColumns={{
                          vehicleNumber: true,
                          vehicleType: true,
                          branchName: true
                        }}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        sorts={sort}
                        onSortChange={handleSortChange}
                        isColumnLoading={columnsLoading}
                      >
                        {viewMode === 'listview'
                          ? {
                            IconBar: (
                              <Box display='flex' style={{ position: 'relative' }}>
                                <Tooltip message={`${dynamicLabels.download} ${dynamicLabels.VehicleReport}`} hover messagePlacement='end'>
                                  <IconButton
                                    id={'vehicle--actionbar--download'}
                                    key={'tt_DownloadVehicle'}
                                    disabled={isDownloadReportDisabled}
                                    iconVariant='icomoon-download'
                                    iconSize={16}
                                    onlyIcon
                                    style={{ color: 'inherit' }}
                                    onClick={handleDownloadReport}
                                  />
                                </Tooltip>
                                <AdvancedFilterComponent
                                  pageName={pageName}
                                  handleFetchFilters={handleFetchFilters}
                                  handleRemoveFilter={handleRemoveFilter}
                                  handleFetchData={handleFetchData}
                                  data={AdvanceFilterData}
                                  needsFetchDataCall={false}
                              />
                              </Box>
                            ),
                            ActionBar: (
                              <Box display='flex' horizontalSpacing='10px'>
                                {isEditMode ? (
                                  <>
                                    <Tooltip message={`${dynamicLabels.save} ${dynamicLabels.vehicle}`} hover>
                                      <IconButton
                                        intent='table'
                                        id='listView-actionBar-save'
                                        iconVariant='icomoon-save'
                                        onClick={handleSaveRows}
                                        disabled={!Object.keys(selectedRows).length}
                                      >
                                        {dynamicLabels.save}
                                      </IconButton>

                                    </Tooltip>
                                    <Tooltip message={`${dynamicLabels.cancel} ${dynamicLabels.vehicle}`} hover>
                                      <IconButton
                                        intent='table'
                                        id='listView-actionBar-cancel'
                                        iconVariant='icomoon-close'
                                        onClick={handleCancel}
                                        disabled={!Object.keys(selectedRows).length}
                                      >
                                        {dynamicLabels.cancel}
                                      </IconButton>

                                    </Tooltip>
                                  </>
                                ) : (
                                    Object.keys(actionBarButtons).map(
                                      (buttonKey, index) => {

                                        switch (buttonKey) {
                                          case 'InlineEdit': {
                                            return null;
                                          }
                                          case 'more': {
                                            // <IconDropdown

                                            //   key={index}
                                            //   variant={'button-dropdown'}
                                            //   optionList={MoreButtonOptionList}
                                            //   width='120px'
                                            //   iconButtonDetails={[
                                            //     'icomoon-funnel-options',
                                            //     actionBarButtons[buttonKey].label,
                                            //     'icomoon-angle-bottom',
                                            //   ]}
                                            //   tooltipMessage={`${dynamicLabels.vehicleMore} ${dynamicLabels.vehicles}.`}
                                            //   disabled={!Object.keys(selectedRows).length}
                                            //   intent='table'
                                            //   onChange={handleMoreOptions}
                                            //   isSingleClickOption
                                            //   style={{ zIndex: '99' }}
                                            // />
                                            return <CreateActionBarButton
                                              id="Vehicle-List-actionbar-{{buttonKey}}"
                                              pageName={pageName}
                                              buttonKey={buttonKey}
                                              actionBarButton={actionBarButtons[buttonKey]}
                                              buttonIndex={index}
                                              selectedRows={selectedRows}
                                              handleActionBarButtonClick={handleMoreOptions}
                                              isButtonDisabled={!Object.keys(selectedRows).length && actionBarButtons[buttonKey].permission}
                                              buttonToolTipTextList={`${dynamicLabels.vehicleMore} ${dynamicLabels.vehicles}.`} />
                                          }

                                          default: {
                                            return <CreateActionBarButton
                                              buttonKey={buttonKey}
                                              actionBarButton={actionBarButtons[buttonKey]}
                                              buttonIndex={index}
                                              selectedRows={selectedRows}
                                              handleActionBarButtonClick={handleActionBarButtonClick}
                                              isButtonDisabled={!Object.keys(selectedRows).length && actionBarButtons[buttonKey].permission}
                                              buttonToolTipTextList={buttonKey === 'update' ? `${dynamicLabels.vehicleupdate} ${dynamicLabels.vehicles}` : buttonKey === 'delete' ? `${dynamicLabels.vehicledelete} ${dynamicLabels.vehicles}` : `tt_${actionBarButtons[buttonKey].label}`} />
                                          }

                                          // default: {
                                          //   return <Tooltip message={buttonKey === 'update' ? `${dynamicLabels.vehicleupdate} ${dynamicLabels.vehicles}` : buttonKey === 'delete' ? `${dynamicLabels.vehicledelete} ${dynamicLabels.vehicles}` : `tt_${actionBarButtons[buttonKey].label}`}
                                          //     hover
                                          //     messagePlacement={index === 0 ? 'start' : 'center'}
                                          //   >
                                          //     {console.log(index)}
                                          //     <IconButton
                                          //       key={buttonKey}
                                          //       disabled={!Object.keys(selectedRows).length}
                                          //       intent='table'
                                          //       iconVariant={iconsMapping[buttonKey]}
                                          //       id={`listView-actionBar-${buttonKey}`}
                                          //       onClick={() => {
                                          //         ga.event({
                                          //           category: 'vehicle action button',
                                          //           action: `vehicle - ${actionBarButtons[buttonKey].label}`,
                                          //           label: 'Vehicle List View'
                                          //         })
                                          //         handleActionBarButtonClick(buttonKey)
                                          //       }}
                                          //     >
                                          //       {actionBarButtons[buttonKey].label}
                                          //     </IconButton>

                                          //   </Tooltip>
                                          //   break;
                                          // }

                                        }

                                      }

                                    ))}
                              </Box>
                            ),
                          }
                          : undefined}
                      </ListView>
                    </ListViewWrapper>
                  )}
                </Card>
              </Grid>
              {viewMode === 'mapview' &&
                <Grid item md={8} style={{ paddingLeft: '15px' }}>
                  <VehcileListViewMap selectedRows={selectedRows} />
                </Grid>}
            </> :
            <NoDataWrapper>
              <div>
                <EmptyData message={dynamicLabels.noVehicleAddedYet} imgSrc="images/VehicleListView/emptyVehiclesList.png" />
                <Box display='flex' justifyContent='center' fullWidth>
                  <Tooltip message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels.vehicle}`} hover={true}>
                    <IconButton
                      primary
                      iconVariant='icomoon-add'
                      onClick={handleAddVehicle}
                    >
                      {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add} {dynamicLabels.vehicle}
                    </IconButton>
                  </Tooltip>
                </Box>
              </div>
            </NoDataWrapper>}
        </StyledGrid>
      </Box>

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
        deleteSelectedRows={deleteSelectedRows}
        featureName='vehicle'
      />
      
      {/* ACTIVATION CONFIRMATION MODAL */}
      <Modal open={!!vehicleActivationRequest} onToggle={() => { }} size='md'>
        {{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels?.statusConfirmation}
              imageVariant='icomoon-close'
              handleClose={() => {
                vehicleActivationRequest?.failureCallback &&
                  vehicleActivationRequest?.failureCallback(!vehicleActivationRequest.activeRequest);
                setVehicleActivationRequest(undefined);
              }}
            />
          ),

          content: (
            <>
              <div style={{ fontSize: '14px' }}>
                {vehicleActivationRequest?.activeRequest
                  ? dynamicLabels.areYouSureYouWantToMarkAsAcitve
                  : dynamicLabels.areYouSureYouWantToMarkAsInactive}
              </div>
            </>
          ),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton id={`vehicle-${vehicleActivationRequest?.activeRequest ? 'Active' : 'InActive'}-Modal-Ok`} iconVariant='icomoon-tick-circled' primary onClick={handleVehicleActivation}>
                {dynamicLabels.ok}
              </IconButton>
              <IconButton
                id={`vehicle-${vehicleActivationRequest?.activeRequest ? 'Active' : 'InActive'}-Modal-Cancel`}
                iconVariant='icomoon-close'
                iconSize={11}
                onClick={() => {
                  vehicleActivationRequest?.failureCallback &&
                    vehicleActivationRequest?.failureCallback(!vehicleActivationRequest.activeRequest);
                  setVehicleActivationRequest(undefined);
                }}
              >
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          ),
        }}
      </Modal>
      
      {/* VEHICLE UPLOAD MODAL */}
      <UploadExcel
        isOpen={showUploadPopup}
        featureName='vehicle'
        onSuccess={() => {
          setShowUploadPopup(false);
          handleFetchData(fetchOptions);
        }}
        onClose={() => setShowUploadPopup(false)}
      />

      {/* INLINE EDIT CANCEL CONFIRMATION MODAL */}
      <InlineEditConfirmationModal
         showCancelConfirmationModal={showCancelConfirmationModal}
         setShowCancelConfirmationModal={(value: boolean) => setShowCancelConfirmationModal(value)}
         handleCancelRows={handleCancelRows} 
      />

      {/* DOWNLOAD RESPONSE MODAL */}
       <DownloadMessage
            showInfoModal={showDownloadModal}
            onToggle={setShowDownloadModal}
        />
      <CompartmentListViewModal
        isCompartmentListModalVisible={isCompartmentListModalVisible}
        setCompartmentListModalVisible={setCompartmentListModalVisible}
        selectedRow={selectedVehicle}
        moduleName={'VEHICLE'}
      />
      <TrackerListViewModal
        isTrackerListModalVisible={isTrackerListModalVisible}
        setTrackerListModalVisible={setTrackerListModalVisible}
        selectedRow={selectedVehicle}
      />
    </>
  );
};


export default withThemeProvider(withToastProvider(withRedux(withPopup(VehicleListView)), 'toast-inject-here'));
