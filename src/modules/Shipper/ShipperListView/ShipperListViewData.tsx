
export const loggedInStatusMapping = {
    LOGGEDIN: 'Logged In',
    LOGOUT: 'Logged Out',
    NOTLOGEDIN: 'Never Logged In'

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

export const breadcrumbState = {
    ALL: {
        searchBy: 'status',
        searchText: 'ALL'
    },
    EMAIL_VERIFICATION_PENDING: {
        searchBy: "status",
        searchText: "EMAIL_VERIFICATION_PENDING"
    },
    APPROVAL_PENDING: {
        searchBy: "status",
        searchText: "APPROVAL_PENDING"
    },
    REJECTED: {
        searchBy: "status",
        searchText: "REJECTED"
    },
    APPROVED: {
        searchBy: "status",
        searchText: "APPROVED"
    }
}