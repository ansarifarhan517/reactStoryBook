db.getCollection("label").insert({
    "key": "CustomerReport",
    "value": "Customer Report.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "_class": "com.loginext.commons.model.Label"
})

db.getCollection("label").insert({
    "key": "customerNotify",
    "value": "Click here to send a notification message to the selected ",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "_class": "com.loginext.commons.model.Label"
})

db.getCollection("label").insert({
    "key": "customerUpdate",
    "value": "Click here to update the selected ",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "_class": "com.loginext.commons.model.Label"
})
db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "noCustomerAddedYet",
    "value": "No ${customer_s} added yet. Click on the below button to add ${customer_s}.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "type": "LABEL"
})


// ------------------------------------------------------------------------------

db.label.update({ key: 'CustomerReport' }, {
    $set: {
        "key": "CustomerReport",
        "value": "${customer_p} Report",
        "locale": "en-GB",
        "userGroupId": NumberInt(0),
        "clientId": NumberInt(0),
        "_class": "com.loginext.commons.model.Label"
    }
})

db.getCollection("label").insert({
    "key": "filterRemovedSuccessfully",
    "value": "Filter Removed Successfully.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "_class": "com.loginext.commons.model.Label"
})

// accountCode
db.dynamicStructure.update(
    {
        "sectionName": "CUSTOMER_LIST_VIEW", "pageName": "CUSTOMER", "isDeleteFl": false, "structure": { $exists: true }, "structure.columns.accountCode": { $exists: true },
        "structure.columns.accountCode.isSortable": false
    },
    { $set: { "structure.columns.accountCode.isSortable": true } },
    { multi: true });


// accountName
db.dynamicStructure.update(
    {
        "sectionName": "CUSTOMER_LIST_VIEW", "pageName": "CUSTOMER", "isDeleteFl": false, "structure": { $exists: true }, "structure.columns.accountCode": { $exists: true },
        "structure.columns.accountCode.isSortable": false
    },
    { $set: { "structure.columns.accountCode.isSortable": true } },
    { multi: true });


// customerType
db.dynamicStructure.update(
    {
        "sectionName": "CUSTOMER_LIST_VIEW", "pageName": "CUSTOMER", "isDeleteFl": false, "structure": { $exists: true }, "structure.columns.customerType": { $exists: true },
        "structure.columns.customerType.isSortable": false
    },
    { $set: { "structure.columns.customerType.isSortable": true } },
    { multi: true });

// mobileNumber
db.dynamicStructure.update(
    {
        "sectionName": "CUSTOMER_LIST_VIEW", "pageName": "CUSTOMER", "isDeleteFl": false, "structure": { $exists: true }, "structure.columns.mobileNumber": { $exists: true },
        "structure.columns.mobileNumber.isSortable": false
    },
    { $set: { "structure.columns.mobileNumber.isSortable": true } },
    { multi: true });


// emailAddress
db.dynamicStructure.update(
    {
        "sectionName": "CUSTOMER_LIST_VIEW", "pageName": "CUSTOMER", "isDeleteFl": false, "structure": { $exists: true }, "structure.columns.emailAddress": { $exists: true },
        "structure.columns.emailAddress.isSortable": false
    },
    { $set: { "structure.columns.emailAddress.isSortable": true } },
    { multi: true });

// nodeCount
db.dynamicStructure.update(
    {
        "sectionName": "CUSTOMER_LIST_VIEW", "pageName": "CUSTOMER", "isDeleteFl": false, "structure": { $exists: true }, "structure.columns.nodeCount": { $exists: true },
        "structure.columns.nodeCount.isSortable": false
    },
    { $set: { "structure.columns.nodeCount.isSortable": true } },
    { multi: true });

// address
db.dynamicStructure.update(
    {
        "sectionName": "CUSTOMER_LIST_VIEW", "pageName": "CUSTOMER", "isDeleteFl": false, "structure": { $exists: true }, "structure.columns.address": { $exists: true },
        "structure.columns.address.isSortable": false
    },
    { $set: { "structure.columns.address.isSortable": true } },
    { multi: true });

// isActiveFl
db.dynamicStructure.update(
    {
        "sectionName": "CUSTOMER_LIST_VIEW", "pageName": "CUSTOMER", "isDeleteFl": false, "structure": { $exists: true }, "structure.columns.isActiveFl": { $exists: true },
        "structure.columns.isActiveFl.isSortable": false
    },
    { $set: { "structure.columns.isActiveFl.isSortable": true } },
    { multi: true });


// clientCode
db.dynamicStructure.update(
    {
        "sectionName": "CUSTOMER_LIST_VIEW", "pageName": "CUSTOMER", "isDeleteFl": false, "structure": { $exists: true }, "structure.columns.clientCode": { $exists: true },
        "structure.columns.clientCode.isSortable": false
    },
    { $set: { "structure.columns.clientCode.isSortable": true } },
    { multi: true });



    // new labels

    db.getCollection("label").insert({
        "_class": "com.loginext.commons.model.Label",
        "key": "primaryContactNumberNotAvailable",
        "value": "Primary contact number not available for ${customer_p}",
        "locale": "en-GB",
        "userGroupId": NumberInt(0),
        "clientId": NumberInt(0),
        "type": "LABEL"
    })

    // new labels

    db.getCollection("label").insert({
        "_class": "com.loginext.commons.model.Label",
        "key": "emailIdNotAvailable",
        "value": "Email Id not available for ${customer_p}",
        "locale": "en-GB",
        "userGroupId": NumberInt(0),
        "clientId": NumberInt(0),
        "type": "LABEL"
    })

    // type @ to enter messsages
    db.getCollection("label").insert({
        "_class": "com.loginext.commons.model.Label",
        "key": "typetoEnterMessages",
        "value": "Type '@' to enter in messages ",
        "locale": "en-GB",
        "userGroupId": NumberInt(0),
        "clientId": NumberInt(0),
        "type": "LABEL"
    })
    
    db.getCollection("label").insert({
        "_class": "com.loginext.commons.model.Label",
        "key": "dynamicTags",
        "value": "@dynamic Tags",
        "locale": "en-GB",
        "userGroupId": NumberInt(0),
        "clientId": NumberInt(0),
        "type": "LABEL"
    })


