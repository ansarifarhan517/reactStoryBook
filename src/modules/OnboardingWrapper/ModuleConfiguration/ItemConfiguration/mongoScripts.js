db.getCollection("dynamicStructure").insert({
    "pageName": "ITEM_MASTER",
    "sectionName": "ITEM_MASTER_LISTVIEW",
    "clientId": NumberInt(0),
    "userGroupId": NumberInt(0),
    "userId": NumberInt(0),
    "isMandatory": true,
    "structure": {
        "columns": {
            "itemCode": {
                "_id": "itemCode",
                "label": "Item Code",
                "fieldName": "itemCode",
                "fieldType": "text",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": true,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "childNodes": {

                },
                "validation": {

                },
                "labelKey": "itemCode",
                "isInfoFlag": false,
                "isAllowed": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemName": {
                "_id": "itemName",
                "label": "Item Name",
                "fieldName": "itemName",
                "fieldType": "text",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": true,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "childNodes": {

                },
                "validation": {

                },
                "labelKey": "itemName",
                "isInfoFlag": false,
                "isAllowed": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemType": {
                "_id": "itemType",
                "label": "Type",
                "fieldName": "itemType",
                "fieldType": "text",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "childNodes": {

                },
                "validation": {

                },
                "labelKey": "itemType",
                "isInfoFlag": false,
                "isAllowed": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemPrice": {
                "_id": "itemPrice",
                "label": "item Price",
                "fieldName": "itemPrice",
                "fieldType": "text",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "childNodes": {

                },
                "validation": {

                },
                "labelKey": "itemPrice",
                "isInfoFlag": false,
                "isAllowed": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemLength": {
                "_id": "itemLength",
                "label": "Item Length",
                "fieldName": "itemLength",
                "fieldType": "number",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "validation": {

                },
                "labelKey": "itemLength",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemBreadth": {
                "_id": "itemBreadth",
                "label": "Item Breadth",
                "fieldName": "itemBreadth",
                "fieldType": "number",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "validation": {

                },
                "labelKey": "itemBreadth",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemHeight": {
                "_id": "itemHeight",
                "label": "Item Height",
                "fieldName": "itemHeight",
                "fieldType": "number",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "validation": {

                },
                "labelKey": "itemHeight",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemWeight": {
                "_id": "itemWeight",
                "label": "Item Weight",
                "fieldName": "itemWeight",
                "fieldType": "number",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "validation": {

                },
                "labelKey": "itemWeight",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemVolume": {
                "_id": "itemVolume",
                "label": "Item Volume",
                "fieldName": "itemVolume",
                "fieldType": "number",
                "permission": false,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "validation": {

                },
                "labelKey": "itemVolume",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "temperatureCategoryCd": {
                "_id": "temperatureCategoryCd",
                "label": "Temperature Category",
                "fieldType": "select",
                "permission": false,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "options": [],
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "lookupType": "temperatureCategory",
                "validation": {

                },
                "labelKey": "Temperature Category",
                "isInfoFlag": false,
                "isAllowed": true,
                "excelFieldType": "",
                "excelDataType": "",
                "excelHiddenKey": "",
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "minTemperature": {
                "_id": "minTemperature",
                "label": "Minimum Temperature ",
                "fieldName": "minTemperature",
                "fieldType": "tel",
                "permission": false,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "validation": {

                },
                "labelKey": "minTemperature",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "maxTemperature": {
                "_id": "maxTemperature",
                "label": "Maximum Temperature",
                "fieldName": "maximumTemperature",
                "fieldType": "number",
                "permission": false,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "validation": {

                },
                "labelKey": "maximumTemperature",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "prepTime": {
                "_id": "prepTime",
                "label": "Preparation Time",
                "fieldName": "prepTime",
                "fieldType": "number",
                "permission": false,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "validation": {

                },
                "labelKey": "preparationTime",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "incrementalPrepTime": {
                "_id": "incrementalPrepTime",
                "label": "Incremental Preparation Time",
                "fieldName": "incrementalPrepTime",
                "fieldType": "number",
                "permission": false,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": 0,
                "rowSpan": 0,
                "colSpan": 0,
                "validation": {

                },
                "labelKey": "incrementalPrepTime",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "_class": "com.loginext.commons.mongo.model.Field"
            }
        },
        "buttons": {
            "delete": {
                "_id": "delete",
                "label": "Delete",
                "fieldName": "button",
                "fieldType": "button",
                "permission": false,
                "isSearchable": false,
                "isCustomField": false,
                "isEditable": false,
                "isSortable": false,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "labelKey": "Delete",
                "isInfoFlag": false,
                "isAllowed": false,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            }
        }
    },
    "isActiveFl": true,
    "isDeleteFl": false,
    "createdOnDt": ISODate("2021-07-06T19:45:17.609+05:30"),
    "createdByUserId": NumberInt(314002),
    "_class": "com.loginext.commons.mongo.model.DynamicStructure"
})


db.getCollection("dynamicStructure").insert({
    "pageName": "ITEM_MASTER",
    "sectionName": "ADD_ITEM_MASTER_FORM",
    "clientId": 0,
    "userGroupId": 0,
    "userId": 0,
    "isMandatory": true,
    "structure": {
        "General Details": {
            "itemCode": {
                "_id": "itemCode",
                "label": "Item Code",
                "fieldName": "itemCode",
                "fieldType": "text",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": true,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "childNodes": {

                },
                "validation": {

                },
                "labelKey": "itemCode",
                "isInfoFlag": true,
                "isAllowed": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemName": {
                "_id": "itemName",
                "label": "Item Name",
                "fieldName": "itemName",
                "fieldType": "text",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": true,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "childNodes": {

                },
                "validation": {

                },
                "labelKey": "itemName",
                "isInfoFlag": false,
                "isAllowed": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemType": {
                "_id": "itemType",
                "label": "Type",
                "fieldName": "itemType",
                "fieldType": "text",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "childNodes": {

                },
                "validation": {

                },
                "labelKey": "itemType",
                "isInfoFlag": false,
                "isAllowed": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemPrice": {
                "_id": "itemPrice",
                "label": "Type",
                "fieldName": "itemPrice",
                "fieldType": "text",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "childNodes": {

                },
                "validation": {

                },
                "labelKey": "itemType",
                "isInfoFlag": false,
                "isAllowed": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            }
        },
        "Item Dimensions": {
            "itemLength": {
                "_id": "itemLength",
                "label": "Item Length",
                "fieldName": "itemLength",
                "fieldType": "number",
                "permission": true,
                "isSearchable": false,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": false,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "validation": {

                },
                "labelKey": "itemLength",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemBreadth": {
                "_id": "itemBreadth",
                "label": "Item Breadth",
                "fieldName": "itemBreadth",
                "fieldType": "number",
                "permission": true,
                "isSearchable": false,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": false,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "validation": {

                },
                "labelKey": "itemBreadth",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemHeight": {
                "_id": "itemHeight",
                "label": "Item Height",
                "fieldName": "itemHeight",
                "fieldType": "number",
                "permission": true,
                "isSearchable": false,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": false,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "validation": {

                },
                "labelKey": "itemHeight",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemWeight": {
                "_id": "itemWeight",
                "label": "Item Weight",
                "fieldName": "itemWeight",
                "fieldType": "number",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "validation": {

                },
                "labelKey": "itemWeight",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "itemVolume": {
                "_id": "itemVolume",
                "label": "Item Volume",
                "fieldName": "itemVolume",
                "fieldType": "number",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "validation": {

                },
                "labelKey": "itemVolume",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            }
        },
        "Additional Details": {
            "temperatureCategory": {
                "_id": "temperatureCategory",
                "label": "Temperature Category",
                "fieldType": "multiselect",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "options": [],
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "lookupType": "temperatureCategory",
                "validation": {

                },
                "labelKey": "Temperature Category",
                "isInfoFlag": false,
                "isAllowed": true,
                "excelDataType": "",
                "excelHiddenKey": "",
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "minTemperature": {
                "_id": "minTemperature",
                "label": "Minimum Temperature ",
                "fieldName": "minTemperature",
                "fieldType": "number",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "validation": {

                },
                "labelKey": "minTemperature",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "maxTemperature": {
                "_id": "maxTemperature",
                "label": "Maximum Temperature",
                "fieldName": "maximumTemperature",
                "fieldType": "tel",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "validation": {

                },
                "labelKey": "maximumTemperature",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "preparationTime": {
                "_id": "preparationTime",
                "label": "Preparation Time (Min)",
                "fieldName": "preparationTime",
                "fieldType": "tel",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "validation": {

                },
                "labelKey": "preparationTime",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            },
            "incrementalPrepTime": {
                "_id": "incrementalPrepTime",
                "label": "Incremental Prep Time (Min)",
                "fieldName": "incrementalPrepTime",
                "fieldType": "tel",
                "permission": true,
                "isSearchable": true,
                "isCustomField": false,
                "isEditable": true,
                "isSortable": true,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "validation": {

                },
                "labelKey": "incrementalPrepTime",
                "isInfoFlag": false,
                "isAllowed": true,
                "isLocked": true,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            }
        },
        "buttons": {
            "delete": {
                "_id": "delete",
                "label": "Delete",
                "fieldName": "button",
                "fieldType": "button",
                "permission": true,
                "isSearchable": false,
                "isCustomField": false,
                "isEditable": false,
                "isSortable": false,
                "required": false,
                "childLength": NumberInt(0),
                "rowSpan": NumberInt(0),
                "colSpan": NumberInt(0),
                "labelKey": "Delete",
                "isInfoFlag": false,
                "isAllowed": false,
                "excelDropDownHidden": false,
                "_class": "com.loginext.commons.mongo.model.Field"
            }
        }
    },
    "isActiveFl": true,
    "isDeleteFl": false,
    "isPublished": true,
    "templateName": "Default Template",
    "isTemplate": true,
    "isEditable": false,
    "version": 1,
    "isFavorite": true,
    "isFavourite": true
})

db.getCollection("validation").insert({
    "_class": "com.loginext.commons.mongo.model.Validation",
    "modelName": "ITEM_MASTER",
    "clientId": NumberInt(0),
    "data": {
        "itemCode": [
            {
                "type": "MANDATORY",
                "error": {
                    "code": "10001",
                    "message": "itemCode_MANDATORY"
                }
            },
            {
                "type": "MIN",
                "value": "3",
                "error": {
                    "code": "10001",
                    "message": "itemCode_MIN"
                }
            },
            {
                "type": "MAX",
                "value": "200",
                "error": {
                    "code": "10001",
                    "message": "itemCode_MAX"
                }
            }
        ],
        "itemName": [
            {
                "type": "MANDATORY",
                "error": {
                    "code": "10001",
                    "message": "itemName_MANDATORY"
                }
            },
            {
                "type": "MIN",
                "value": "3",
                "error": {
                    "code": "10001",
                    "message": "itemName_MIN"
                }
            },
            {
                "type": "MAX",
                "value": "255",
                "error": {
                    "code": "10001",
                    "message": "itemName_MAX"
                }
            }
        ],
        "itemType": [
            {
                "type": "MIN",
                "value": "3",
                "error": {
                    "code": "10001",
                    "message": "itemType_MIN"
                }
            },
            {
                "type": "MAX",
                "value": "100",
                "error": {
                    "code": "10001",
                    "message": "itemType_MAX"
                }
            }
        ],
        "itemPrice": [
            {
                "type": "MANDATORY",
                "error": {
                    "code": "10001",
                    "message": "itemPrice_MANDATORY"
                }
            },
            {
                "type": "MAX_LENGTH",
                "value": "8",
                "error": {
                    "code": "10001",
                    "message": "itemPrice_MAXLENGTH"
                }
            }
        ],
        "itemWeight": [
            {
                "type": "MAX_LENGTH",
                "value": "8",
                "error": {
                    "code": "10001",
                    "message": "itemWeight_MAXLENGTH"
                }
            }
        ],
        "itemVolume": [
            {
                "type": "MAX_LENGTH",
                "value": "8",
                "error": {
                    "code": "10001",
                    "message": "itemVolume_MAXLENGTH"
                }
            }
        ],
        "itemLength": [
            {
                "type": "MAX_LENGTH",
                "value": "8",
                "error": {
                    "code": "10001",
                    "message": "itemLength_MAXLENGTH"
                }
            }
        ],
        "itemBreadth": [
            {
                "type": "MAX_LENGTH",
                "value": "8",
                "error": {
                    "code": "10001",
                    "message": "itemBreadth_MAXLENGTH"
                }
            }
        ],
        "itemHeight": [
            {
                "type": "MAX_LENGTH",
                "value": "8",
                "error": {
                    "code": "10001",
                    "message": "itemHeight_MAXLENGTH"
                }
            }
        ],
        "maxTemperature": [
            {
                "type": "MAX_LENGTH",
                "value": "8",
                "error": {
                    "code": "10001",
                    "message": "maxTemperature_MAXLENGTH"
                }
            }
        ],
        "minTemperature": [
            {
                "type": "MAX_LENGTH",
                "value": "8",
                "error": {
                    "code": "10001",
                    "message": "minTemperature_MAXLENGTH"
                }
            }
        ],

    },
    "isActiveFl": true,
    "isDeleteFl": false,
    "isDraft": false
})


  
  db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "Additional Details",
    "value": "Additional Details",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "LABEL"
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "Item Dimensions",
    "value": "${item_s} Dimensions",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "LABEL"
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemCode_MANDATORY",
    "value": "${item_s} Code is mandatory.",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "LABEL"
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemName_MANDATORY",
    "value": "${item_s} Name is mandatory.",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "LABEL"
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemUpdatedSuccessfully",
    "value": "Item Updated Successfully.",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "LABEL"
})

// access profile labels

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "ITEM_MASTER_LABEL_KEY",
    "value": "${item_s} Master",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "ITEM_MASTER_DESC_LABEL_KEY",
    "value": "This provides you access to manage and configure ${item_s}.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "ITEM_MASTER_READ_LABEL_KEY",
    "value": "Read",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "ITEM_MASTER_READ_LABEL_KEY_DESC",
    "value": "Access to ${item_s} Configuration list view",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "ITEM_MASTER_CREATE_LABEL_KEY_DESC",
    "value": "Access to create ${item_p}",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "ITEM_MASTER_UPDATE_LABEL_KEY_DESC",
    "value": "Access to update ${item_p}",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "ITEM_MASTER_DELETE_LABEL_KEY_DESC",
    "value": "Access to delete ${item_p}",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})


// columns and listview

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemCode",
    "value": "${item_s} Code",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})
db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemName",
    "value": "${item_s} Name",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})
db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemType",
    "value": "${item_s} Type",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemPrice",
    "value": "${item_s} Price ",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})
db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemLength",
    "value": "${item_s} Length (#@#dimension#@#)",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemBreadth",
    "value": "${item_s} Breadth (#@#dimension#@#)",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemHeight",
    "value": "${item_s} Height (#@#dimension#@#)",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemVolume",
    "value": "${item_s} Volume (#@#volume#@#)",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemWeight",
    "value": "${item_s} Weight (#@#weight#@#)",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "incrementalPrepTime",
    "value": "Incremental Prep Time (Min)",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "preparationTime",
    "value": "Preparation Time (Min)",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "maxTemperature",
    "value": "Maximum Temperature (#@#temperature#@#)",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0
})
db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "maximumTemperature",
    "value": "Maximum Temperature (#@#temperature#@#)",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0
})




db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "minTemperature",
    "value": "Minimum Temperature (#@#temperature#@#)",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0
})
// form labels and infotips and validations


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemCode_MIN",
    "value": "${item_s} Code length must be more than 3 characters.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemCode_MAX",
    "value": "${item_s} Code length must be less than 200 characters.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemName_MIN",
    "value": "${item_s} Name length must be more than 3 characters.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemName_MAX",
    "value": "${item_s} Name length must be less than 255 characters.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemType_MIN",
    "value": "${item_s} Type length must be more than 3 characters.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemType_MAX",
    "value": "${item_s} Type length must be less than 100 characters.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemPrice_MANDATORY",
    "value": "${item_s} Price is mandatory.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "incrementalPrepTime_INFOTIP",
    "value": "This is the incremental time applied for additional quantities of the same ${item_s}",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0)
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "incrementalPreparationTimePlaceholder",
    "value": "Incremental Preparation Time",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "LABEL"
})


// validation labels for max length

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemPrice_MAXLENGTH",
    "value": "${item_s} Price length not greater than %s",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "VALIDATION"
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemWeight_MAXLENGTH",
    "value": "${item_s} Weight length not greater than %s",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "VALIDATION"
})


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemVolume_MAXLENGTH",
    "value": "${item_s} Volume length not greater than %s",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "VALIDATION"
})


db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemLength_MAXLENGTH",
    "value": "${item_s} Length length not greater than %s",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "VALIDATION"
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemBreadth_MAXLENGTH",
    "value": "${item_s} Breadth length not greater than %s",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "VALIDATION"
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "itemHeight_MAXLENGTH",
    "value": "${item_s} Height length not greater than %s",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "VALIDATION"
})



db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "maxTemperature_MAXLENGTH",
    "value": "Maximum Temperature length not greater than %s",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "VALIDATION"
})

db.getCollection("label").insert({
    "_class": "com.loginext.commons.model.Label",
    "key": "minTemperature_MAXLENGTH",
    "value": "Minimum Temperature length not greater than %s",
    "locale": "en-GB",
    "userGroupId": 0,
    "clientId": 0,
    "type": "VALIDATION"
})

db.getCollection("label").insert({
    "key": "maxTempGreaterThanMinTemp",
    "value": "Minimum Temperature should not be greater than Maximum Temperature.",
    "locale": "en-GB",
    "userGroupId": NumberInt(0),
    "clientId": NumberInt(0),
    "_class": "com.loginext.commons.model.Label"
})

    db.AccessProfileStructure.update(
        { "modelType" : "FMLM", 	"persona" : "DISPATCHER",
      },
      { $push: {
             "accessModules.0.accessSections.8.accessSections.2.accessSections": {
            $each: [	{
                   "sectionName" : "ITEM_MASTER",
                   "sectionNameLabelKey" : "ITEM_MASTER_LABEL_KEY",
                   "sectionNameLabelValue" : "Item Master",
                   "sectionNameDescLabelKey" : "ITEM_MASTER_DESC_LABEL_KEY",
                   "sectionNameDescLabelValue" : "This provides you access to manage and configure Item.",
                   "accesses" : [
                     {
                       "accessName" : "READ",
                       "accessNameLabelKey" : "ITEM_MASTER_READ_LABEL_KEY",
                       "accessNameDescLabelKey" : "ITEM_MASTER_READ_LABEL_KEY_DESC",
                       "accessNameLabelValue" : "Read",
                       "accessNameDescLabelValue" : "Access to Item master list view",
                       "accessRefId" : "03ea73471c8e4ea5bdb3190d9bfeaf7c",
                       "linkedAccessMode" : [
                         "DISPATCHER_READONLYACC",
                         "CARRIER_READONLYACC",
                         "DISPATCHER_ALLACCESSACC",
                         "CARRIER_ALLACCESSACC"
                       ]
                     },
                     {
                       "accessName" : "CREATE",
                       "accessNameLabelKey" : "ITEM_MASTER_CREATE_LABEL_KEY",
                       "accessNameDescLabelKey" : "ITEM_MASTER_CREATE_LABEL_KEY_DESC",
                       "accessNameLabelValue" : "Create",
                       "accessNameDescLabelValue" : "Access to create Item",
                       "accesses" : [
                         {
                           "accessName" : "ADD",
                           "accessNameLabelKey" : "ITEM_MASTER_ADD_LABEL_KEY",
                           "accessNameDescLabelKey" : "ITEM_MASTER_ADD_LABEL_KEY_DESC",
                           "accessNameLabelValue" : "Add",
                           "accessRefId" : "13ad8a8762fa4ef58fb90e8414cb6768",
                           "linkedAccessMode" : [
                             "DISPATCHER_ALLACCESSACC",
                             "CARRIER_ALLACCESSACC"
                           ]
                         }
                       ]
                     },
                     {
                       "accessName" : "UPDATE",
                       "accessNameLabelKey" : "ITEM_MASTER_UPDATE_LABEL_KEY",
                       "accessNameDescLabelKey" : "ITEM_MASTER_UPDATE_LABEL_KEY_DESC",
                       "accessNameLabelValue" : "Update",
                       "accessNameDescLabelValue" : "Access to update Item",
                       "accesses" : [
                         {
                           "accessName" : "UPDATE",
                           "accessNameLabelKey" : "ITEM_MASTER_UPDATE_BUTTON_LABEL_KEY",
                           "accessNameDescLabelKey" : "ITEM_MASTER_UPDATE_BUTTON_LABEL_KEY_DESC",
                           "accessNameLabelValue" : "Update",
                           "accessRefId" : "1b3accb34f9749eabbd73cbe5698abc5",
                           "linkedAccessMode" : [
                             "DISPATCHER_ALLACCESSACC",
                             "CARRIER_ALLACCESSACC"
                           ]
                         }
                       ]
                     },
                     {
                       "accessName" : "DELETE",
                       "accessNameLabelKey" : "ITEM_MASTER_DELETE_LABEL_KEY",
                       "accessNameDescLabelKey" : "ITEM_MASTER_DELETE_LABEL_KEY_DESC",
                       "accessNameLabelValue" : "Delete",
                       "accessNameDescLabelValue" : "Access to delete Item",
                       "accessRefId" : "53553fe7c63c49edafcdd699e7be0ed1",
                       "linkedAccessMode" : [
                         "DISPATCHER_ALLACCESSACC",
                         "CARRIER_ALLACCESSACC"
                       ]
                     }
                   ]
                 }],
               $position: 1
             }
         }
      }
      );
    