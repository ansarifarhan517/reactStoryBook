import moment from "moment"
import { extractDynamicLabelsFromHTML, replaceDynamicLabelWithLabel } from "../../../OrderMiddleMile/PrintAwb/PrintAwb.constants"

export const replacingHtmlTagwithHtmlData = (htmlData) => {
    if (htmlData.orderHTML.includes('<CrateDetails />')) {
        if (htmlData.crateHTML.includes('<ItemDetails />')) {
            htmlData.crateHTML = htmlData.crateHTML.replace('<ItemDetails />', `<ItemDetails>${htmlData.itemHTML}</ItemDetails>`)
        }
        htmlData.orderHTML = htmlData.orderHTML.replace('<CrateDetails />', `<CrateDetails>${htmlData.crateHTML}</CrateDetails>`)
    }
    if (htmlData.orderHTML.includes('<OrderDetails />')) {
        htmlData.orderHTML = htmlData.orderHTML.replace('<OrderDetails />', `<OrderDetails>${htmlData.tripHTML}</OrderDetails>`)
    }
    if (htmlData.orderHTML.includes('<CustomerDetails />')) {
        htmlData.orderHTML = htmlData.orderHTML.replace('<CustomerDetails />', `<CustomerDetails>${htmlData.customerHTML}</CustomerDetails>`)
    }
}

export const handleDynamicLabels = (html, dynamicLabelsToBeFetched, dynamicLabels) => {
    const labelSet = extractDynamicLabelsFromHTML(html)
    if (labelSet.size > 0) {
        dynamicLabelsToBeFetched = [...dynamicLabelsToBeFetched, ...Array.from(labelSet).filter(label => !dynamicLabels[label])]
    }
}

export const replacingDynamicLabelWithLabel = (html, returnTemplate, templateDynamicLabels) => {
    const labelSet = extractDynamicLabelsFromHTML(html)
    if (labelSet.size > 0) {
        Array.from(labelSet).forEach((label) => {
            returnTemplate.htmlData[html] = replaceDynamicLabelWithLabel(returnTemplate.htmlData[html], label, templateDynamicLabels[label] || '')
        })
    }
}

export const handlingCustomField = (tripData, customFieldListEntity, clientProperties, timezoneMode) => {
    customFieldListEntity.forEach(({ field, value, type }) => {
        if (type === 'datetime') {
            tripData[field] = (timezoneMode == "MYTIMEZONE") ? moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z") || '';
        } else if (type === 'time') {
            tripData[field] = (timezoneMode == "MYTIMEZONE") ? moment(value).format("h:mm A") : moment(value).format("h:mm A z") || '';
        } else if (type === 'date') {
            tripData[field] = (timezoneMode == "MYTIMEZONE") ? moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()) : moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()) || '';
        }
        else { tripData[field] = value || '' }
    })
}