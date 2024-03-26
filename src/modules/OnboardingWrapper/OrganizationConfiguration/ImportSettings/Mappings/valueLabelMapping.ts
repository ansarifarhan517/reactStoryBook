const MultiSelectDropDownMapping = {
    PLANNING_PROFILE: {
        valueKey: "profileId",
        labelKey: "profileName",
    },
    AUTO_ASSIGNMENT_PROFILE: {
        valueKey: "profileId",
        labelKey: "profileName", 
    },
    ORGANIZATION_ALERT_PROFILE: {
        valueKey: "profileId",
        labelKey: "profileName", 
    },
    SHIPPER_ALERT_PROFILE: {
        valueKey: "profileId",
        labelKey: "profileName", 
    },
    BRANCH_ALERT_PROFILE: {
        valueKey: "profileId",
        labelKey: "profileName", 
    },
    CUSTOMER_NOTIFICATIONS: {
        valueKey: "id",
        labelKey: "name",
    },
    ORDER_NOTIFICATIONS: {
        valueKey: "id", 
        labelKey: "name",
    },
    EMAIL_TEMPLATES: {
        valueKey: "id",
        labelKey: "name",
    },
    BRANDING_PROFILES: {
        valueKey: "id",
        labelKey: "name",
    }
}

export const fetchValueLabel = (fieldKey : string, option : any) => {
    if(fieldKey === undefined || option === undefined) return {};

    if(MultiSelectDropDownMapping.hasOwnProperty(fieldKey) === undefined) return {};

    return {
        value: option[MultiSelectDropDownMapping[fieldKey]?.valueKey],
        label: option[MultiSelectDropDownMapping[fieldKey]?.labelKey],
    }
}

