import moment from 'moment'
import { IPlansForm, IRowWiseTierData, ISection, ISectionData } from './PlansForm.model'


export const plansMock = {
    "status": 0,
    "message": "Get Plans successfully",
    "moreResultsExists": false,
    "data": {
        "code": "0",
        "message": "success",
        "plans": [
            {
                "account_id": "1348700000000000388",
                "billing_cycles": 1,
                "interval": 1,
                "interval_unit": "months",
                "name": "Mile Mobile Application Evaluation License",
                "plan_code": "TRIAL",
                "product_id": "1348700000000063432",
                "product_type": "none",
                "recurring_price": 0,
                "setup_fee": 0,
                "trial_period": 15,
                "is_taxable": true,
                "tax_exemption_code": "",
                "tax_exemption_id": ""
            },
            {
                "account_id": "1348700000000000388",
                "billing_cycles": -1,
                "interval": 1,
                "interval_unit": "months",
                "name": "Mile Mobile Application Monthly Subscription",
                "plan_code": "BASIC",
                "product_id": "1348700000000063432",
                "product_type": "none",
                "recurring_price": 1300,
                "setup_fee": 0,
                "trial_period": 0,
                "is_taxable": true,
                "tax_exemption_code": "",
                "tax_exemption_id": ""
            },
            {
                "account_id": "1348700000000000388",
                "billing_cycles": -1,
                "interval": 1,
                "interval_unit": "months",
                "name": "Mile Mobile Application Monthly Subscription",
                "plan_code": "PREMIUM",
                "product_id": "1348700000000063432",
                "product_type": "none",
                "recurring_price": 1950,
                "setup_fee": 0,
                "trial_period": 0,
                "is_taxable": true,
                "tax_exemption_code": "",
                "tax_exemption_id": ""
            },
            {
                "account_id": "1348700000000000388",
                "billing_cycles": -1,
                "interval": 1,
                "interval_unit": "months",
                "name": "Mile Mobile Application Monthly Subscription",
                "plan_code": "ADVANCED",
                "product_id": "1348700000000063432",
                "product_type": "none",
                "recurring_price": 2600,
                "setup_fee": 0,
                "trial_period": 0,
                "is_taxable": true,
                "tax_exemption_code": "",
                "tax_exemption_id": ""
            }
        ]
    },
    "hasError": false
}
export const planOrderMock = { "status": 0, "message": "Get Plans successfully", "moreResultsExists": false, "data": { "code": "0", "message": "success", "plans": [{ "account_id": "1922010000000000388", "billing_cycles": -1, "interval": 1, "interval_unit": "months", "name": "Mile Transaction Based Monthly Subscription - Base Plan", "plan_code": "MILETRANSACTION", "product_id": "1922010000000070241", "product_type": "none", "recurring_price": 15000, "setup_fee": 0, "tax_id": "", "tax_percentage": "0", "trial_period": 0 }] }, "hasError": false }
export const addOns = {
    "status": 0,
    "message": "Addons get successfully",
    "moreResultsExists": false,
    "data": [
        {
            "addonCode": "CUSTOMIZATION",
            "name": "One Time Customization",
            "unitName": "Package",
            "pricingScheme": "unit",
            "type": "one_time",
            "intervalUnit": "monthly",
            "description": "%BillingStartDate%.  %BillingEndDate%",
            "price": 20000
        },
        {
            "addonCode": "ONETIMEMILEINTEGRATION",
            "name": "One Time Integration",
            "unitName": "License",
            "pricingScheme": "unit",
            "type": "one_time",
            "intervalUnit": "monthly",
            "price": 25000
        },
        {
            "addonCode": "MILE-WEB-MONTHLY",
            "name": "Mile Web Application Monthly Subscription",
            "unitName": "License",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "Web Application Monthly Subscription for LogiNext Mile",
            "price": 30000
        },
        {
            "addonCode": "DRM",
            "name": "Dedicated Support Monthly Subscription",
            "unitName": "Resource",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "This add on has to be used for a recurring charge for DRM (Dedicate Resource) for a customer.",
            "price": 300000
        },
        {
            "addonCode": "SUPPORTCHANGE",
            "name": "One-time Training Support and Change Management",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "one_time",
            "intervalUnit": "monthly",
            "description": "%BillingStartDate%.  %BillingEndDate%",
            "price": 5000
        },
        {
            "addonCode": "MILE-WEB-ANNUAL",
            "name": "Mile Web Application Annual Subscription",
            "unitName": "License",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "%BillingStartDate%.  %BillingEndDate%",
            "price": 360000
        },
        {
            "addonCode": "MILEWEBHALFYEARLY",
            "name": "Mile Web Application Half Yearly Subscription",
            "unitName": "License",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "%BillingStartDate%.  %BillingEndDate%",
            "price": 60000
        },
        {
            "addonCode": "MILE-WEB-QTRLY",
            "name": "Mile Web Application Quarterly Subscription",
            "unitName": "License",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "%BillingStartDate%.  %BillingEndDate%",
            "price": 30000
        },
        {
            "addonCode": "MILE-WEB-ANNUAL-ADVANCE",
            "name": "Mile Web Application Annual Subscription",
            "unitName": "License",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "yearly",
            "description": "%BillingStartDate%.  %BillingEndDate%",
            "price": 9960
        },
        {
            "addonCode": "AMC",
            "name": "Annual Maintenance Contract",
            "unitName": "Services",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "yearly",
            "price": 8300
        },
        {
            "addonCode": "MILEMONTHLYSMS",
            "name": "Mile Communication Monthly Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "SMS Charges Per Month",
            "price": 0.06
        },
        {
            "addonCode": "MILEHALFYEARLYSMS",
            "name": "Mile Communication Half Yearly Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "SMS Charges For 6 Months",
            "price": 0.06
        },
        {
            "addonCode": "MILEANNUALSMS",
            "name": "Mile Communication Annual Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "yearly",
            "description": "SMS Charges for one year",
            "price": 0.01992
        },
        {
            "addonCode": "MILEQUARTELYSMS",
            "name": "Mile Communication Quarterly Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "SMS Charges Per Quarter",
            "price": 0.06
        },
        {
            "addonCode": "MILEMONTHLYEMAIL",
            "name": "Mile Email Communication Monthly Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "Email Charges Per Month",
            "price": 0.06
        },
        {
            "addonCode": "MILEQUARTERLYEMAIL",
            "name": "Mile Email Communication Quarterly Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "Email Charges Per Quarter",
            "price": 0.06
        },
        {
            "addonCode": "MILEHALFYEARLYEMAIL",
            "name": "Mile Email Communication Half Yearly Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "Email Charges for 6 months",
            "price": 0.06
        },
        {
            "addonCode": "MILEANNUALEMAIL",
            "name": "Mile Email Communication Annual Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "yearly",
            "description": "Email Charges for one year",
            "price": 0.01992
        },
        {
            "addonCode": "MILEMONTHLYIVR",
            "name": "Mile IVR Communication Monthly Subscription",
            "unitName": "pcs",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "IVR Charges Per Month",
            "price": 0.06
        },
        {
            "addonCode": "MILEQUARTERLYIVR",
            "name": "Mile IVR Communication Quarterly Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "IVR Charges Per Quarter",
            "price": 0.06
        },
        {
            "addonCode": "MILEHALFYEARLYIVR",
            "name": "Mile IVR Communication Half Yearly Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "monthly",
            "description": "IVR Charges for 6 months",
            "price": 0.06
        },
        {
            "addonCode": "MILEANNUALIVR",
            "name": "Mile IVR Communication Annual Subscription",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "recurring",
            "intervalUnit": "yearly",
            "description": "IVR Charges for one year",
            "price": 0.01992
        },
        {
            "addonCode": "MILEMONTHLYSMSONETIME",
            "name": "Mile Communication Subscription - One Time",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "one_time",
            "intervalUnit": "monthly",
            "description": "Purchase of extra SMS package",
            "price": 0.02
        },
        {
            "addonCode": "MILEMONTHLYEMAILONETIME",
            "name": "Mile Email Communication Subscription - One Time",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "one_time",
            "intervalUnit": "monthly",
            "description": "Purchase of Email Package",
            "price": 0.02
        },
        {
            "addonCode": "MILETRANSACTIONONETIME",
            "name": "Mile Transaction Based Subscription - Pay As You Go Usage",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "one_time",
            "intervalUnit": "monthly",
            "description": "Additional Purchase of Transactions",
            "price": 0.02
        },
        {
            "addonCode": "MILEMONTHLYIVRONETIME",
            "name": "Mile IVR Communication Subscription - One Time",
            "unitName": "Unit",
            "pricingScheme": "unit",
            "type": "one_time",
            "intervalUnit": "monthly",
            "description": "Purchase of extra IVR package",
            "price": 0.02
        }
    ],
    "hasError": false
}

export const PlanList = {
    'MILEMONTHLYEMAIL': 'email',
    'MILEQUARTERLYEMAIL': 'email',
    'MILEHALFYEARLYEMAIL': 'email',
    'MILEANNUALEMAIL': 'email',
    'MILE-EMAIL-ANNUAL-ONETIMEADDON': 'email',
    'MILE-EMAIL-HALFYEARLY-ONETIMEADDON': 'email',
    'MILE-EMAIL-QUARTERLY-ONETIMEADDON': 'email',
    'MILE-EMAIL-MONTHLY-ONETIMEADDON': 'email',
    'MILEMONTHLYSMS': 'sms',
    'MILEHALFYEARLYSMS': 'sms',
    'MILEANNUALSMS': 'sms',
    'MILEQUARTELYSMS': 'sms',
    'MILEMONTHLYEMAILONETIME': 'email',
    'MILEMONTHLYSMSONETIME': 'sms',
    'MILEANNUALSMS-ONETIMEADDON': 'sms',
    'MILEHALFYEARLYSMS-ONETIMEADDON': 'sms',
    'MILEMONTHLYSMS-ONETIMEADDON': 'sms',
    'MILETRANSACTIONONETIME': 'order',
    'MILEQUARTELYSMS-ONETIMEADDON': 'sms',
    'MILE-TRANSACTION-ANNUAL-ONETIMEADDON' : 'order',
    'MILE-TRANSACTION-HALFYEARLY-ONETIMEADDON': 'order',
    'MILE-TRANSACTION-QUARTERLY-ONETIMEADDON': 'order',
    'MILE-TRANSACTION-MONTHLY-ONETIMEADDON': 'order',
    'MILEMONTHLYIVR': 'ivr',
    'MILEHALFYEARLYIVR': 'ivr',
    'MILEANNUALIVR': 'ivr',
    'MILEQUARTELYIVR': 'ivr',
    'MILE-CALLS-ANNUAL-RECURRINGADDON': 'ivr',
    'MILE-CALLS-ANNUAL-ONETIMEADDON':'ivr',
    'MILE-CALLS-HALFYEARLY-RECURRINGADDON': 'ivr',
    'MILE-CALLS-HALFYEARLY-ONETIMEADDON': 'ivr',
    'MILE-CALLS-QUARTERLY-RECURRINGADDON':'ivr',
    'MILE-CALLS-QUARTERLY-ONETIMEADDON':'ivr',
    'MILE-CALLS-MONTHLY-RECURRINGADDON': 'ivr',
    'MILE-CALLS-MONTHLY-ONETIMEADDON':'ivr',
    'MILEMONTHLYIVRONETIME':'ivr'
}

export const hubSpotDetails = {
    "isActiveFl": true,
    "organization": "Sample organization",
    "billingAddressDTO": {
        "isActiveFl": true,
        "apartment": "Sample Apartment",
        "streetName": "Sample Street",
        "landmark": "Sample Landmark",
        "city": "Mumbai",
        "country": "India",
        "pincode": "410210",
        "name": "Billing Name",
        "geocodeLevel": "ALL"
    },
    "hubspotDealId": 4162067687,
    "entityName": "sample entity name",
    "billingEmail": "billingemail@email.com",
    "billingContactNo": "123456789",
    "businessDevelopmentManager": {
        "id": 123,
        "name": "Sample BDM"
    },
    "accountManager": {
        "id": 123,
        "name": "Sample AM"
    },
    "operationManager": {
        "id": 123,
        "name": "Sample ONM"
    },
    "region": "ap-southeast-1",
    "tin": "Sample tin"

}
export const getSaasData = {
    "orderOneTimeAddOnLimit": 0,
    "orderOneTimeAddOnPrice": 0,
    "refresh": false,
    "businessType": "",
    "phoneNumber": "6325465236",
    "hubspotDealId": "4676700672",
    "legalDocs": "LogiNext",
    "entityName": "Sample legal entity name 49",
    "taxIdentification": "Sample TIN 49",
    "adminName": "Test First Name 49",
    "sendActivationLink": "After Payment",
    "smsOneTimeAddOnLimit": "0",
    scheduledChanges: {
        zohoAddonDTOs: [{
            "addonCode": "ONETIMEMILEINTEGRATION",
            "billingStartDate": "2021-03-27",
            "billingEndDate": "2021-03-27",
            "quantity": 1,
            "price": 20000
        },
        {
            "addonCode": "MILEQUARTERLYIVR",
            "quantity": 1,
            "price": 4
        },
        {
            "addonCode": "MILETRANSACTIONONETIME",
            "quantity": 1,
            "price": 100000
        },],
        "planQuantity": 1,
        "planUnitRate": 1950,
        "planType": "MILETRANSACTION",
        "subscriptionType": "Orders"
    },
    "businessDevelopmentManager": {
        "id": 297851,
        "name": "Sandesh (support@loginextsolutions.com)"
    },
    "accountManager": {
        "id": 297851,
        "name": "Sandesh (support@loginextsolutions.com)"
    },
    "operationManager": {
        "id": 297851,
        "name": "Sandesh (support@loginextsolutions.com)"
    },
    // "billingFequency": {
    //     "name": "Monthly",
    //     "id": 591
    // },
    billingFequency: 'Monthly',
    "subscriptionType": "Delivery Associates",
    "planType": "PREMIUM",
    "resourceCount": 1,
    "planQuantity": 1,
    "planPricingOption": "unit",
    "planUnitRate": 1950,
    "productActivationDate": 1616417068000,
    "subscriptionActivationDate": 1616417068000,
    "zohoAddonDTOs": [
        {
            "addonCode": "MILE-WEB-MONTHLY",
            "billingStartDate": "2021-03-27",
            "billingEndDate": "2021-03-27",
            "quantity": 1,
            "price": 20000
        },
        {
            "addonCode": "FORCE-WEB-MONTHLY",
            "quantity": 1,
            "price": 4
        },
        {
            "addonCode": "FIELDWEBQTRLY",
            "quantity": 1,
            "price": 100000
        },
        {
            "addonCode": "AMC",
            "quantity": 1,
            "price": 4
        }
    ],
    "nextBillingDate": 1624300200000,
    "organization": "LogiNext",
    "planTierData": "{}",
    "addonTierData": "{\"FORCE-WEB-MONTHLY\":[{\"id\":\"1\",\"startingNoOfTransaction\":1,\"endingNoOfTransaction\":4,\"price\":4}],\"AMC\":[{\"id\":\"1\",\"startingNoOfTransaction\":1,\"endingNoOfTransaction\":4,\"price\":4}]}",
    "currencyCode": "USD",
    "paymentTerms": 45,
    "lockInPeriod": 0,
    "billingAddressDTO": {
        "locality": "updated locality",
        "streetName": "Street Address",
        "phoneNumber": "6325465236",
        "contactEmailAddress": "abcpreethi49@mailinator.com",
        "apartment": "updated apartment",
        "landMark": "",
        "state": "Tamil Nadu",
        "country": "INDIA",
        "stateId": 100,
        "countryId": 100,
        "pincode": "410218",
        "city": "Chennai"
    },
    "adminContactNo": "72364872834",
    "billingName": "Billing First Name 49",
    "adminEmailId": "adminemail49@mailinator.com",
    "email": "adminemail49@mailinator.com"
}

// export const getSaasData = {
//     "hubspotDealId": 4162067687,
//     "organization": "Loginext",
//     "entityName": "Sample legal entity name",
//     "taxIdentification": "Sample TIN",
//     billingFrequency: { name: "Monthly", id: 591 },
//     "billingAddressDTO": {
//         "streetName": "Street Address",
//         "city": "Test City",
//         "state": "State",
//         "country": "INDIA",
//         "pincode": "410210",
//         // "phoneNumber": "+91-8454025432",
//         //  "geocodeLevel": "ALL"
//     },
//     "businessDevelopmentManager": {
//         "id": 990758,
//         "name": "Anees bla bla bla"
//     },
//     "accountManager": {
//         "id": 990665,
//         "name": "am01 something"
//     },
//     "operationManager": {
//         "id": 990723,
//         "name": "Anees OM "
//     },
//     addonTierData: '',
//     "adminName": "Test Admin Name",
//     "adminContactNo": "72364872834",
//     "adminEmailId": "adminEmail@abc.in",
//     "email": "adminEmail@abc.in",
//     "currencyCode": "USD",
//     "paymentTerms": 60,
//     "lockInPeriod": 2,
//     "sendActivationLink": "Before Payment",
//     "subscriptionType": "Delivery Associates",
//     "planType": 'TRIAL',
//     "planQuantity": 10,
//     "planUnitRate": 100,
//     "planPrice": 1000,
//     "planPricingOption": "unit",
//     "customFieldsEntity": [],
//     "zohoAddonDTOs": [
//         {
//             "addonCode": "ONETIMEMILEINTEGRATION",
//             "billingStartDate": "2021-03-03",
//             "billingEndDate": "2021-03-04",
//             "numberOfTransaction": 1,
//             "rate": 25000,
//             "price": 10,
//             "pricingOption": "unit"
//         },
//         {
//             "addonCode": "MILE-WEB-ANNUAL",
//             "numberOfTransaction": "10",
//             "pricingOption": "unit",
//             "rate": 120000,
//             "price": 1200000
//         }
//     ]
// }

export const checkValidationInEditMode = (getPlanData?: IPlansForm, planDetails?: { [key: string]: ISection }, data?: { [key: string]: any }, planNameMapping?: { [key: string]: string }, revisedZohoAddon?: any) => {
    console.log(planNameMapping);
    let planError = ''
    let planQuantityError = ''
    // if end of term is (current billing cycle), and user tries to change plan then throw exception - current billing cycle error
    if (getPlanData?.planType !== planDetails?.planType && !(data?.endOfTerm === 'Y') && getPlanData?.planType !== "TRIAL") {
        planError = `You cannot change the plan for the current billing period. The Plan can only be changed from the next billing period onwards.`
    } else if (Number(getPlanData?.planQuantity) < Number(planDetails?.planQuantity)
        && Number(getPlanData?.planUnitRate) < Number(planDetails?.planUnitRate)
        && !(data?.endOfTerm === 'Y')) {
        //do nothing

    } else if (Number(getPlanData?.planQuantity) > Number(planDetails?.planQuantity) && !(data?.endOfTerm === 'Y') && planDetails?.planType) {
        //planQuantityError = `You have decreased the number of ${data?.subscriptionType === 'orders' ? 'orders' : 'delivery associates'} for the plan ${planNameMapping?.[planDetails?.planType?.toString()]}.These changes cannot be applied in the current billing cycle. Apply these changes from the next billing cycle to proceed further.`
        // planQuantityError = `The rate changes done on the plan ${planNameMapping?.[planDetails?.planType?.toString()]} cannot be applied in the current billing cycle.  Please apply these changes from the next billing cycle to proceed further.`
        planQuantityError = `The subscription changes cannot be applied in the current billing cycle. Please apply these changes from the next billing cycle to proceed further.`

    } else if (Number(getPlanData?.planUnitRate) !== Number(planDetails?.planUnitRate) && !(data?.endOfTerm === 'Y') && planDetails?.planType) {
        // planQuantityError = `You have decreased the number of units for the plan ${planNameMapping?.[planDetails?.planType?.toString()]}.These changes cannot be applied in the current billing cycle. Apply these changes from the next billing cycle to proceed further.`
        // planQuantityError = `The rate changes done on the plan ${planNameMapping?.[planDetails?.planType?.toString()]} cannot be applied in the current billing cycle.  Please apply these changes from the next billing cycle to proceed further.`
        planQuantityError = `The subscription changes cannot be applied in the current billing cycle. Please apply these changes from the next billing cycle to proceed further.`

    }

    if (getPlanData?.zohoAddonDTOs?.length) {
        // Allowed -  Increace Quantity only
        // Allowed - Both Price and Quantity


        // for (let i = 0; i < getPlanData?.zohoAddonDTOs?.length; i++) {
        //     if (revisedZohoAddon[i]?.type !== "one_time") {
        //         if (Number(revisedZohoAddon[i]?.quantity) > Number(getPlanData?.zohoAddonDTOs[i]?.quantity)
        //             && Number(revisedZohoAddon[i]?.price) > Number(getPlanData?.zohoAddonDTOs[i]?.price)
        //             && !(data?.endOfTerm === 'Y')) {
        //             //do nothing 
        //         } else if (Number(revisedZohoAddon[i]?.quantity) > Number(getPlanData?.zohoAddonDTOs[i]?.quantity)
        //             && Number(revisedZohoAddon[i]?.price) === Number(getPlanData?.zohoAddonDTOs[i]?.price)
        //         ) {
        //             //do nothing
        //             // planQuantityError = `The subscription changes cannot be applied in the current billing cycle. Please apply these changes from the next billing cycle to proceed further.`
        //         }
        //         else if (Number(revisedZohoAddon[i]?.quantity) < Number(getPlanData?.zohoAddonDTOs[i]?.quantity) && !(data?.endOfTerm === 'Y')) {
        //             console.log(Number(revisedZohoAddon[i]?.quantity), " ", Number(getPlanData?.zohoAddonDTOs[i]?.quantity))
        //             planQuantityError = `The subscription changes cannot be applied in the current billing cycle. Please apply these changes from the next billing cycle to proceed further.`
        //         } else if (Number(revisedZohoAddon[i]?.price) !== Number(getPlanData?.zohoAddonDTOs[i]?.price) && !(data?.endOfTerm === 'Y')) {
        //             planQuantityError = `The subscription changes cannot be applied in the current billing cycle. Please apply these changes from the next billing cycle to proceed further.`
        //         }
        //     }
        // }
        let i = 0;
        let j = 0;
        let count = getPlanData?.zohoAddonDTOs?.length > revisedZohoAddon?.length ? getPlanData?.zohoAddonDTOs?.length : revisedZohoAddon?.length;
        while (count > 0) {
            if (getPlanData?.zohoAddonDTOs[j] !== undefined && revisedZohoAddon[i] !== undefined && (revisedZohoAddon[i]?.addonCode === getPlanData?.zohoAddonDTOs[j]?.addonCode)) {
                if (Number(revisedZohoAddon[i]?.quantity) > Number(getPlanData?.zohoAddonDTOs[j]?.quantity)
                    && Number(revisedZohoAddon[i]?.price) > Number(getPlanData?.zohoAddonDTOs[j]?.price)
                    && !(data?.endOfTerm === 'Y')) {
                    //do nothing 
                } else if (Number(revisedZohoAddon[i]?.quantity) > Number(getPlanData?.zohoAddonDTOs[j]?.quantity)
                    && Number(revisedZohoAddon[i]?.price) === Number(getPlanData?.zohoAddonDTOs[j]?.price)
                ) {
                    //do nothing
                    // planQuantityError = `The subscription changes cannot be applied in the current billing cycle. Please apply these changes from the next billing cycle to proceed further.`
                }
                else if (Number(revisedZohoAddon[i]?.quantity) < Number(getPlanData?.zohoAddonDTOs[j]?.quantity) && !(data?.endOfTerm === 'Y')) {
                    console.log(Number(revisedZohoAddon[i]?.quantity), " ", Number(getPlanData?.zohoAddonDTOs[j]?.quantity))
                    planQuantityError = `The subscription changes cannot be applied in the current billing cycle. Please apply these changes from the next billing cycle to proceed further.`
                } else if (Number(revisedZohoAddon[i]?.price) !== Number(getPlanData?.zohoAddonDTOs[j]?.price) && !(data?.endOfTerm === 'Y')) {
                    planQuantityError = `The subscription changes cannot be applied in the current billing cycle. Please apply these changes from the next billing cycle to proceed further.`
                }
                j = j++;
                i = i++;
            } else if(getPlanData?.zohoAddonDTOs?.length > revisedZohoAddon?.length) {
                j = j++;
            } else {
                i = i++;
            }
            count--;
        }
    }

    return {
        planError,
        planQuantityError
    }

}


export const gerateAccordionData = (sectionData: ISectionData | undefined, rowWiseTierData: IRowWiseTierData, planNameMapping?: { [key: string]: string }, addonNameMapping?: { [key: string]: string }) => {
    const planDetails: { [key: string]: ISection[] } | undefined = sectionData?.['planDetails']
    const oneTimeAddOn: { [key: string]: ISection[] } | undefined = sectionData?.['oneTimeAddOn']
    const recurringAddOn: { [key: string]: ISection[] } | undefined = sectionData?.['recurringAddOn']
    const planDetailsTier = rowWiseTierData?.['planDetails']
    const oneTimeAddOnTier = rowWiseTierData?.['oneTimeAddOn']
    const recurringAddOnTier = rowWiseTierData?.['recurringAddOn']
    const plansKey = planDetails && Object.keys(planDetails)
    const oneTimeAddOnKey = oneTimeAddOn && Object.keys(oneTimeAddOn)
    const recurringAddOnKey = recurringAddOn && Object.keys(recurringAddOn)
    let billingError = ''
    let planTierData = {}
    let planObj: { [key: string]: ISection } = {}
    let planError: string[] = []
    const addonErrorAddonName: string[] = []
    const timeZone = JSON.parse(localStorage.getItem('userAccessInfo') || '""').timezone
    const currentTimeStamp = moment().tz(timeZone).toDate().getTime()
    planDetails && Object.values(planDetails)?.forEach((plan, index) => {
        const tierData = plansKey && planDetailsTier?.[plansKey?.[index]]
        let priceSchema = 'unit'
        let addOnName = ''
        let price = undefined
        let tierRate = undefined
        plan.forEach(planElement => {
            const value = planElement?.value
            if (value !== undefined) {
                if (planElement.id === 'planName') {
                    planObj.planType = planElement?.value
                    addOnName = planElement?.value
                } else if (planElement.id === 'numberOfOrders') {
                    planObj.orderLimit = planElement?.value
                    planObj.planQuantity = planElement?.value
                } else if (planElement.id === 'numberOfDeliveryAssociates') {
                    planObj.resourceCount = planElement?.value
                    planObj.planQuantity = planElement?.value
                } else if (planElement.id === 'pricingOption') {
                    priceSchema = planElement?.value
                    planObj.planPricingOption = planElement?.value
                } else if (planElement.id === 'rate') {
                    planObj.planUnitRate = planElement?.value
                } else if (planElement.id === 'tierRate') {
                    tierRate = planElement?.value
                }
                else if (planElement.id === 'price') {
                    price = planElement?.value
                }
                else {
                    planObj[planElement.id] = planElement?.value
                }
            }
        })
        if (priceSchema !== 'unit' && tierData && tierRate) {
            if (price === undefined && planNameMapping) {
                planError = [planNameMapping?.[addOnName]]
                // error = `${planNameMapping?.[addOnName]} Plan is not falling tiers provided. provide appropriate tiers.`
            } else {
                planTierData = {
                    [currentTimeStamp]: {
                        [addOnName]: Object.values(Object.values(tierData))
                    }
                }
                planObj.planUnitRate = tierRate

            }
        } else if (priceSchema !== 'unit' && !tierData && price === undefined && addonNameMapping && planNameMapping) {
            planError = [planNameMapping?.[addOnName]]
        }

    })
    let addonTierData = {}
    let zohoAddonObj = {}
    let isAddonAddedTwice = false
    const zOneTimeAddOn = oneTimeAddOn && Object.values(oneTimeAddOn)?.map((oneTime, index) => {
        const tierData = oneTimeAddOnKey && oneTimeAddOnTier?.[oneTimeAddOnKey?.[index]]
        const oneTimeAddonObj: any = {}
        let priceSchema = 'unit'
        let addOnName = ''
        let tierRate = undefined
        let price = undefined

        oneTime.forEach(oneTimeElement => {
            const value = oneTimeElement?.value
            if (value !== undefined) {
                if (oneTimeElement.id === 'addOnName') {
                    oneTimeAddonObj.addonCode = value
                    addOnName = value
                    //to find intervalUnit key from options of addon
                    const obj = oneTimeElement?.options?.find(option => option.value === value)
                    oneTimeAddonObj.intervalUnit = obj?.intervalUnit
                    oneTimeAddonObj.type = obj?.type
                } else if (oneTimeElement.id === 'pricingOption') {
                    priceSchema = value
                } else if (oneTimeElement.id === 'rate') {
                    // as per old dto
                    oneTimeAddonObj.price = value
                } else if (oneTimeElement.id === 'tierRate') {
                    tierRate = oneTimeElement?.value
                }
                else if (oneTimeElement.id === 'numberOfTransaction') {
                    // as per old dto
                    oneTimeAddonObj.quantity = value
                }
                else if (oneTimeElement.id === 'price') {
                    price = value
                } else if (oneTimeElement.id === 'billingDate' && value) {
                    const todaysDate = moment().format('YYYY-MM-DD')
                    const dateArray = value.split(' - ')
                    const billingStartDate = moment(dateArray[0], 'MM-DD-YYYY').format('YYYY-MM-DD')
                    const billingEndDate = moment(dateArray[1], 'MM-DD-YYYY').format('YYYY-MM-DD')
                    oneTimeAddonObj.billingStartDate = billingStartDate
                    oneTimeAddonObj.billingEndDate = billingEndDate
                    if (billingStartDate < todaysDate && addonNameMapping) {
                        billingError = `For ${addonNameMapping[addOnName]} Billing Start - Billing End Date should be future date.`
                    }
                }
                else {
                    oneTimeAddonObj[oneTimeElement.id] = value
                }
            }
        })
        if (priceSchema !== 'unit' && tierData) {
            if (price === undefined && addonNameMapping && tierRate === undefined) {
                addonErrorAddonName.push(addonNameMapping[addOnName])
                // error = `${addOnName} Addon is not falling tiers provided. provide appropriate tiers.`
            } else {
                //dont send tierdata for onetime addon
                // addonTierData[addOnName] = Object.values(Object.values(tierData))
                oneTimeAddonObj.price = tierRate
            }

        } else if (priceSchema !== 'unit' && !tierData && price === undefined && addonNameMapping) {
            addonErrorAddonName.push(addonNameMapping[addOnName])
        }
        if (addOnName !== "") {
            if (zohoAddonObj[addOnName] && !isAddonAddedTwice) {
                isAddonAddedTwice = true
            } {
                zohoAddonObj[addOnName] = oneTimeAddonObj
            }
        }
        return oneTimeAddonObj
    }).filter(entry => Object.keys(entry).length !== 0)

    const zRecurringAddOn = recurringAddOn && Object.values(recurringAddOn)?.map((recurringAddon, index) => {
        const tierData = recurringAddOnKey && recurringAddOnTier?.[recurringAddOnKey?.[index]]
        const recurringAddonObj: any = {}
        let priceSchema = 'unit'
        let addOnName = ''
        let price = undefined
        let tierRate = undefined
        addonTierData = {
            [currentTimeStamp]: {
            }
        }
        recurringAddon.forEach(recurringAddonElement => {
            const value = recurringAddonElement?.value
            if (value !== undefined) {
                if (recurringAddonElement.id === 'addOnName') {
                    recurringAddonObj.addonCode = value
                    addOnName = value
                    //to find intervalUnit key from options of addon
                    const obj = recurringAddonElement?.options?.find(option => option.value === value)
                    recurringAddonObj.intervalUnit = obj?.intervalUnit
                    recurringAddonObj.type = obj?.type
                } else if (recurringAddonElement.id === 'pricingOption') {
                    priceSchema = value
                } else if (recurringAddonElement.id === 'rate') {
                    // as per old dto
                    recurringAddonObj.price = value
                } else if (recurringAddonElement.id === 'numberOfTransaction') {
                    // as per old dto
                    recurringAddonObj.quantity = value
                } else if (recurringAddonElement.id === 'tierRate') {
                    tierRate = recurringAddonElement?.value
                }
                else if (recurringAddonElement.id === 'price') {
                    price = value
                } else {
                    recurringAddonObj[recurringAddonElement.id] = value
                }
            }
        })
        if (priceSchema !== 'unit' && tierData) {
            if (price === undefined && addonNameMapping && tierRate === undefined) {
                addonErrorAddonName.push(addonNameMapping[addOnName])
                // error = `${addOnName} Addon is not falling tiers provided.Please provide appropriate tiers.`
            } else {
                addonTierData[currentTimeStamp][addOnName] = Object.values(Object.values(tierData))
                //addonTierData[addOnName] = Object.values(Object.values(tierData))
                recurringAddonObj.price = tierRate

            }
        } else if (priceSchema !== 'unit' && !tierData && price === undefined && addonNameMapping) {
            addonErrorAddonName.push(addonNameMapping[addOnName])

        }
        if (addOnName !== "") {
            if (zohoAddonObj[addOnName] && !isAddonAddedTwice) {
                isAddonAddedTwice = true
            } {
                zohoAddonObj[addOnName] = recurringAddonObj
            }
        }
        return recurringAddonObj
    }).filter(entry => Object.keys(entry).length !== 0)
    const zohoAddonDTOs = zOneTimeAddOn && zRecurringAddOn && [...zOneTimeAddOn, ...zRecurringAddOn]
    return {
        planDetails: planObj,
        zohoAddonDTOs,
        planTierData,
        addonTierData,
        billingError,
        isAddonAddedTwice,
        error: {
            plan: planError?.length > 0 ? `For the Plan - ${planError?.join('')}, the number of transactions is not falling in any tiers. Please define the tiers appropriately to proceed further.` : '',
            addon: addonErrorAddonName.length > 0 ? `For the Addon(s) - ${addonErrorAddonName?.join(',')}, the number of transactions is not falling in any tiers. Please define the tiers appropriately to proceed further.` : '',
        }
    }

}
