import apiMappings from "../../../../../utils/apiMapping"
import axios from "../../../../../utils/axios"
import store from "../../../../../utils/redux/store"

const apiCallsPending = {
    airportList: false,
    deliveryMediumName: false,
    deliveryMediumBranch: false

}
const TripListViewDropdown = {
    origAirportName: async () => {


        let airportsList = store.getState().trips.listView.mile.dropdownMapping.airports || []
        
        // //const landingPage = localStorage.getItem('landingPage')
        if (airportsList.length === 0 && !apiCallsPending.airportList) {
            apiCallsPending.airportList = true;
            try {
                const { data } = await axios.get(apiMappings.trips.mile.listview.getAirports);
                apiCallsPending.airportList = false;
                airportsList = data.data.map((entry: any) => {
                    return {
                        label: entry?.airportName,
                        value: entry?.airportName,
                        id: entry?.airportId,
                        title: entry?.airportName
                    }
                })

                store.dispatch({ type: '@@tripsListViewMile/SET_FLEETDETAILS_DROPDOWN', payload: { 'airports': airportsList } })

            } catch (e) {
                apiCallsPending.airportList = false;
            }
        }
        if (airportsList && airportsList?.length > 0) {
            return airportsList
        } else {
            return []
        }
    },
    destAirportName: async () => {

        let airportsList = store.getState().trips.listView.mile.dropdownMapping.airports || [];
        
        // //const landingPage = localStorage.getItem('landingPage')
        if (airportsList.length == 0 && !apiCallsPending.airportList) {
            apiCallsPending.airportList = true;
            try {
                const { data } = await axios.get(apiMappings.trips.mile.listview.getAirports)
                apiCallsPending.airportList = false;
                airportsList = data?.data?.map((entry: any) => {
                    return {
                        label: entry?.airportName,
                        value: entry?.airportName,
                        id: entry?.airportId,
                        title: entry?.airportName
                    }
                })
                store.dispatch({ type: '@@tripsListViewMile/SET_FLEETDETAILS_DROPDOWN', payload: { 'airports': airportsList } })
            } catch (e) {
                apiCallsPending.airportList = false;
            }

        }

        if (airportsList && airportsList?.length > 0) {
            return airportsList
        } else {
            return []
        }
    },
    deliveryMediumName: async () => {
        let dmList = store.getState().trips.listView.mile.dropdownMapping.deliveryAssociateName || []

        if (dmList.length === 0) {
            store.dispatch({type: "@@tripsListViewMile/FETCH_LOOKUP_DATA"})
        }
        return dmList && dmList?.length > 0 ? dmList : []
    },
    tripStatus: () => {
        let tripStatus = store.getState().trips.listView.mile.dropdownMapping.tripStatus;
        let dynamicLabels = store.getState().dynamicLabels;
        tripStatus.forEach(status => {
            status.label = dynamicLabels[status.id];
            // status.value = dynamicLabels[status.id];
        })
        return tripStatus;

    },
    deliveryMediumBranch: async () => {
        let branches = store.getState().trips.listView.mile.dropdownMapping.branches

        // //const landingPage = localStorage.getItem('landingPage')
        if (!(branches && branches.length > 0)) {
            const { data } = await axios.get(apiMappings.common.lookup.getDistributionCenterBranch, {
                data: {}
            })

            branches = data?.map((entry: any) => {
                return {
                    label: entry?.name,
                    value: entry?.name,
                    id: entry?.branchId,
                    title: entry?.name
                }
            })
            store.dispatch({
                type: '@@tripsListViewMile/SET_FLEETDETAILS_DROPDOWN', payload: {
                    branches
                }
            })
        }

        if (branches && branches?.length > 0) {

            return branches
        } else {
            return []
        }
    },
    driverName: async () => {
        let driversList = store.getState().trips.listView.mile.dropdownMapping.drivers || []

        if (driversList && driversList?.length > 0) {
            return driversList
        } else {
            return []
        }
    },
    vehicleNo: async () => {
        let vehiclesList = store.getState().trips.listView.mile.dropdownMapping.vehicles || [];
        if (vehiclesList && vehiclesList?.length > 0) {
            return vehiclesList
        } else {
            return []
        }
    },
    
}


export default TripListViewDropdown