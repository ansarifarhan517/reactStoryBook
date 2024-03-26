// search button tooltip
db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "webhook_search",
    "value": "Click here to get the webhook history based on the search options.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "type": "LABEL"
})


// retry button

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "webhook_retry",
    "value": "Click here to retry the webhook.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "type": "LABEL"
})

// eventType
db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "eventType",
    "value": "Event type",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "type": "LABEL"
})

// http status

db.getCollection("label").insert({
    "key": "http_status",
    "value": "HTTP Status",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "_class": "com.loginext.commons.model.Label"
})

// requested Time

db.getCollection("label").insert({
    "key": "requested_time",
    "value": "Requested Time",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "_class": "com.loginext.commons.model.Label"
})
