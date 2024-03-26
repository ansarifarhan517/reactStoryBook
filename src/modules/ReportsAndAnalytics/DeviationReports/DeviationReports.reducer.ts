import { IMongoFormStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces"
import { DeviationReportsActions } from "./DeviationReports.actions"
import { IFilterParams, IListViewResponsePayload, ISelectedDateRange, ReportType } from "./DeviationReports.models"

export interface IDeviationReportsState {
    form: {
        structure: IMongoFormStructure;
        loading: boolean;
        filters: IFilterParams;
        reportType: ReportType | "";
        dateRange?: ISelectedDateRange;
    },
    listView: {
        structure: IMongoListViewStructure;
        data: IListViewResponsePayload;
        loading: boolean;
    }
}

const initialState: IDeviationReportsState = {
    form: {
        structure: {},
        loading: false,
        filters: {} as IFilterParams,
        reportType: "",
        dateRange: {} as ISelectedDateRange
    },
    listView: {
        structure: { columns: {}, buttons: {} },
        data: { totalCount: 0, results: [] },
        loading: false
    }
}

const DeviationReportsReducer = (state = initialState, action: DeviationReportsActions): IDeviationReportsState => {
    switch (action.type) {
        case '@@deviationReports/FETCH_FILTER_STRUCTURE':
        case '@@vehicleReports/FETCH_FILTER_STRUCTURE':
            return {
                ...state,
                form: { ...state.form, loading: true }
            }
        case '@@deviationReports/FETCH_FILTER_STRUCTURE_SUCCESS':
        case '@@vehicleReports/FETCH_FILTER_STRUCTURE_SUCCESS':
            return {
                ...state,
                form: { ...state.form, structure: action?.payload, loading: false }
            }
        case '@@deviationReports/FETCH_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                listView: { ...state.listView, structure: action?.payload }
            }
        case '@@deviationReports/FETCH_LISTVIEW_DATA':
            return {
                ...state,
                listView: { ...state.listView, loading: true }
            }
        case '@@deviationReports/FETCH_LISTVIEW_DATA_SUCCESS':
            return {
                ...state,
                listView: { ...state.listView, data: { results: action.payload.results, totalCount: action.payload.totalCount }, loading: false }
            }
        case '@@deviationReports/SAVE_FILTERS':
            return {
                ...state,
                form: { ...state.form, reportType: action.payload.reportType, filters: action.payload.filters }
            }
        case '@@deviationReports/SAVE_DATE_RANGE':
            return {
                ...state,
                form: { ...state.form, dateRange: action.payload }
            }
        case '@@deviationReports/RESET_INITIAL_STATE':
            return {
                ...state,
                form: { structure: {}, loading: false, filters: {} as IFilterParams, reportType: "" },
                listView: { structure: { columns: {}, buttons: {} }, data: { totalCount: 0, results: [] }, loading: false }
            }
            case '@@deviationReports/RESET_LISTVIEW_STATE':
                return {
                ...state,    
                form: { ...state.form, filters: {} as IFilterParams, reportType: "" },
                listView: { structure: { columns: {}, buttons: {} }, data: { totalCount: 0, results: [] }, loading: false }
            }
        default:
            return state
    }
}
export default DeviationReportsReducer;