const backendKeyMapping = {
    PLANNING_PROFILE: "profileIds",
    AUTO_ASSIGNMENT_PROFILE: "profileIds",
    ETA_PROFILE: "isETAProfile",
    ORGANIZATION_ALERT_PROFILE: "profileIds",
    SHIPPER_ALERT_PROFILE: "profileIds",
    BRANCH_ALERT_PROFILE: "profileIds",
    CUSTOMER_NOTIFICATIONS: "notificationTemplateId",
    ORDER_NOTIFICATIONS: "notificationTemplateId",
    EMAIL_TEMPLATES: "brandingProfileIds",
    BRANDING_PROFILES: "brandingProfileIds"
}

export const fetchRequestObjectKey = (fieldKey : string) => {
    if(fieldKey === undefined) return "";

    if(!backendKeyMapping.hasOwnProperty(fieldKey)) return "";

    return backendKeyMapping[fieldKey];
}