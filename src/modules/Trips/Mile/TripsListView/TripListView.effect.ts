import { all, call, put, select, takeLatest, takeLeading } from 'redux-saga/effects'
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { AppState } from '../../../../utils/redux/rootReducer';
import store from '../../../../utils/redux/store';
import { IListViewRequestPayload } from '../../../../utils/common.interface';
// import store from '../../../../utils/redux/store';
import { ITripsListMile_FetchData, ITripsListMile_FetchStructure, tTripsListMileActions } from './TripsListView.actions'
import { AdvancedFilterComponentActions } from '../../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions';
import { capacityConversion } from './helper';
import { AxiosResponse } from 'axios';
import { IDynamicLabelsAction } from '../../../common/DynamicLabels/dynamicLabels.actions';
import {handleDynamicLabels ,replacingDynamicLabelWithLabel} from '../../../OnboardingWrapper/ModuleConfiguration/DRSTemplateConfiguration/DRSTemplateConfiguration.utils'

function* fetchData(action: ITripsListMile_FetchData) {
    yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_LOADING', payload: { listView: true } });

    try {

        const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
        const viewMode = store.getState().trips.listView.mile.viewMode;


        if (!!advFilterLoader || viewMode == 'mapview') {

            const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
            const data = filterListPayload || undefined

            // adv filter
            let filter: IListViewRequestPayload = action.payload ? { ...action.payload } : yield select((state: AppState) => state.trips.listView.mile.filters)

            try {
                delete filter?.isLoading
                const { data: { data: payload } } = yield call(axios.post, apiMappings.trips.mile.listview.data, data,
                    {
                        params: {
                            ...filter,
                        },
                    }
                )
                let finalResult: any[] = [];
                payload.results.forEach((element: { milkRun: string; trips: any[]; }) => {
                    element.trips.forEach((row, index) => {
                        if (index == 0) row['milkRun'] = element['milkRun'];
                        if (row.volumeCapacity) {
                            const clientObj = store?.getState().globals.metrics && store?.getState().globals.metrics['volume'];
                            const val = capacityConversion(row.volumeCapacity.toFixed(4), 'GET', clientObj?.conversionFactor)
                            row['volumeCapacity'] = val;
                        }
                        if (row.weightCapacity) {
                            const clientObj = store?.getState().globals.metrics && store?.getState().globals.metrics['weight'];
                            const val = capacityConversion(row.weightCapacity.toFixed(4), 'GET', clientObj?.conversionFactor)
                            row['weightCapacity'] = val;
                        }
                        if (row.utilizedCapacityInVolume) {
                            const clientObj = store?.getState().globals.metrics && store?.getState().globals.metrics['volume'];
                            const val = capacityConversion(row.utilizedCapacityInVolume, 'GET', clientObj?.conversionFactor)
                            row['utilizedCapacityInVolume'] = val;
                        }
                        if (row.utilizedCapacityInWeight) {
                            const clientObj = store?.getState().globals.metrics && store?.getState().globals.metrics['weight'];
                            const val = capacityConversion(row.utilizedCapacityInWeight, 'GET', clientObj?.conversionFactor)
                            row['utilizedCapacityInWeight'] = val;
                        }
                        finalResult.push(row);
                    })
                })
                let totalRows = payload.totalCount;

                const clientProperties = yield select(state => state.clientProperties)
                payload.clientProperties = clientProperties

                /********* CHECK WHETHER PAYLOAD AND PARAMS ARE BOTH EMPTY THEN NO DATA *************/

                let isParamsEmpty = (Object.keys(filter).length > 1) && !filter['searchBy'] && !filter['searchText'] && !filter['sortBy'] && !filter['sortOrder'];

                if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
                    yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });
                    yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_LOADING', payload: { listView: false } })
                } else {
                    yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_DATA', payload: finalResult });
                    yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_DATA_FROM_API', payload: payload });
                    yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_DATA_COUNT', payload: totalRows });
                    yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });
                    yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_LOADING', payload: { listView: false } })

                }




            } catch (error) {
                console.log('Failed to fetch data for Trip List View: ', error)
                yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_LOADING', payload: { listView: false } })
            }
        }
        // const { data: { data: payload } } = yield call(axios.post, apiMappings.trips.mile.listview.data, {}, { params: storedfilters });
        // console.log('tripListView.ts', payload);



    } catch (e) {
        yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_LOADING', payload: { listView: false } });
    }

}

function* fetchStructure(action: ITripsListMile_FetchStructure) {
    yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_LOADING', payload: { tableGrid: true, columnList: true } });
    try {
        const viewMode = action.payload ? action.payload : store.getState().trips.listView.mile.viewMode;
        const breadcrumbFilter = store.getState().trips.listView.mile.breadcrumbFilter

        const { data: payload } = yield call(axios.get, apiMappings.trips.mile[viewMode].structure[breadcrumbFilter]);

        yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_STRUCTURE', payload });
        yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_LOADING', payload: { tableGrid: false, columnList: false } });
    } catch (e) {
        yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_LOADING', payload: { tableGrid: false, columnList: false } });
    }
}

function* watchTripListData() {
    yield takeLatest<ITripsListMile_FetchData>('@@tripsListViewMile/FETCH_DATA', fetchData)

}


function* watchTripListStructure() {
    yield takeLatest<ITripsListMile_FetchStructure>('@@tripsListViewMile/FETCH_STRUCTURE', fetchStructure)
}

function* fetchDRSHTMLTemplates() {
    try {
      yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/FETCH_DRS_HTML_TEMPLATES_SUCCESS', payload: [] })
      let { data: { data } }
        = yield call(axios.get, apiMappings.drsTemplateConfiguration.listView.getDrsHTMLTemplates)
     
  
      data = data?.map((template: any) => {
        const returnTemplate = { ...template }
        const { orderHTML, crateHTML, itemHTML, tripHTML, customerHTML } = template.htmlData
        if (orderHTML) {
          replacingDynamicLabelWithLabel(orderHTML,returnTemplate,templateDynamicLabels)
        }
        if (crateHTML) {
          replacingDynamicLabelWithLabel(orderHTML,returnTemplate,templateDynamicLabels)
        }
        if (itemHTML) {
          replacingDynamicLabelWithLabel(orderHTML,returnTemplate,templateDynamicLabels)
        }
        if (tripHTML) {
          replacingDynamicLabelWithLabel(orderHTML,returnTemplate,templateDynamicLabels)
        }
        if (customerHTML) {
          replacingDynamicLabelWithLabel(orderHTML,returnTemplate,templateDynamicLabels)
        }
        return returnTemplate
      })
      
      yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/FETCH_DRS_HTML_TEMPLATES_SUCCESS', payload: data })
  
  
      /** Replace Dynamic Labels with actual data */
      const dynamicLabels = store.getState().dynamicLabels
      let dynamicLabelsToBeFetched: unknown[] = []
      data.forEach((template: { htmlData: { orderHTML: any; crateHTML: any; itemHTML: any; tripHTML: any; customerHTML: any; }; }) => {
        const { orderHTML, crateHTML, itemHTML, tripHTML, customerHTML } = template.htmlData 
        if (orderHTML) {
        handleDynamicLabels(orderHTML,dynamicLabelsToBeFetched,dynamicLabels)
        }
        if (crateHTML) {
        handleDynamicLabels(crateHTML,dynamicLabelsToBeFetched,dynamicLabels)
        }
        if (itemHTML) {
          handleDynamicLabels(itemHTML,dynamicLabelsToBeFetched,dynamicLabels) 
        }
        if (tripHTML) {
          handleDynamicLabels(tripHTML,dynamicLabelsToBeFetched,dynamicLabels)
        }
        if (customerHTML) {
         handleDynamicLabels(customerHTML,dynamicLabelsToBeFetched,dynamicLabels)
        }
      })
  
      let templateDynamicLabels = { ...dynamicLabels }
      let dataSet = {}
  
      if (dynamicLabelsToBeFetched.length > 0) {
        const { data }: AxiosResponse<Record<string, string>> = yield call(axios.get, apiMappings.common.dynamicLabels, { params: { labels: dynamicLabelsToBeFetched.join(',') } })
        dataSet = data
        templateDynamicLabels = { ...templateDynamicLabels, ...dataSet }
      }
     
     
      yield put<IDynamicLabelsAction>({ type: '@@dynamicLabels/FETCH_DATA_SUCCESS', payload: dataSet })
    } catch (error:any) {
      console.log('Failed to fetch Print DRS HTML Templates: ', error, error?.response)
    }
  }

function*  watchFetchDRSHTMLTemplates(){
  yield takeLatest('@@tripsListViewMile/FETCH_DRS_HTML_TEMPLATES', fetchDRSHTMLTemplates)

}

function* fetchLookupData() {
  try {
    yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_LOADING', payload: { listView: true } })
    const { data } = yield call(
      axios.get,
      apiMappings.trips.mile.listview.updateTripLookups,
      {
        data: {},
      }
    );

    const dmList = data?.deliveryMediums?.map((entry: any) => {
      return {
        label: entry?.deliveryMediumMasterName,
        value: entry?.deliveryMediumMasterName,
        id: entry?.deliveryMediumMasterId,
        title: entry?.deliveryMediumMasterName,
      };
    });

    let vehiclesList = data?.vehicles?.map((entry: any) => {
      return {
        label: entry?.vehicleNumber,
        value: entry?.vehicleNumber,
        id: entry?.vehicleId,
        title: entry?.vehicleNumber,
        status: entry?.status,
      };
    });

    let driversList = data?.drivers?.map((entry: any) => {
      return {
        label: entry?.guid,
        value: entry?.guid,
        id: entry?.driverId,
        title: entry?.guid,
      };
    });

    yield put({
      type: "@@tripsListViewMile/SET_FLEETDETAILS_DROPDOWN",
      payload: {
        vehicles: vehiclesList,
        drivers: driversList,
        deliveryAssociateName: dmList,
      },
    });

    yield put<tTripsListMileActions>({ type: '@@tripsListViewMile/SET_LOADING', payload: { listView: false } })
  } catch (error) {}
}

function* watchFetchLookup() {
  yield takeLeading("@@tripsListViewMile/FETCH_LOOKUP_DATA", fetchLookupData);
}

export function* watchTripList() {
  yield all([
    watchTripListStructure(),
    watchTripListData(),
    watchFetchDRSHTMLTemplates(),
    watchFetchLookup(),
  ]);
}