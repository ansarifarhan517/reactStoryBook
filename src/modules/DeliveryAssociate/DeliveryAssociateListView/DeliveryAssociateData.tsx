import { IPageLabel } from '../../common/PageLabelStructure/pageLabels.actions'


export const loggedInStatusMapping = (dynamicLabels:Record<string,IPageLabel>) => {
    return {
        LOGGEDIN: dynamicLabels?.LOGIN_DMLOGINSTATUS || 'Logged In',
        LOGOUT: dynamicLabels?.LOGOUT_DMLOGINSTATUS || 'Logged Out',
        NOTLOGEDIN: dynamicLabels?.NOTLOGEDIN_DMLOGINSTATUS || 'Never Logged In',
        LOGIN: dynamicLabels?.LOGIN_DMLOGINSTATUS || 'Logged In',
    }
}

export const isOnBreakStatus = {
    'N': 'No',
    'Y': 'Yes'
}

export const dispatchStatusMapping = {
    Available: 'Available',
    Intransit: 'Dispatched',
    Absent: 'Unavailable',
    Inactive: 'Inactive'
}

