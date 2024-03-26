import moment from "moment";
import store from "../../../../utils/redux/store";

export function transformInputData(data, key) {
    const histogramData: {
        [key: string]: {
            name: string;
            [key: string]: string;
        }[];
    } = {
        overallPerc: [],
        overallCount: [],
        byShipperPerc: [],
        byShipperCount: [],
    };
    switch (key) {
        case "sms": {
            if (data.histogramDateWise) {
                Object.entries(data.histogramDateWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["overallPerc"].push({
                            name: date,
                            smsSent: details.smsSentPerc || 0,
                            smsDelivered: details.smsDeliveredPerc || 0,
                        });
                        histogramData["overallCount"].push({
                            name: date,
                            smsSent: details.smsSentCount || 0,
                            smsDelivered: details.smsDeliveredCount || 0,
                        });
                    }
                );
            }
            if (data.histogramShipperWise) {
                Object.entries(data.histogramShipperWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["byShipperPerc"].push({
                            name: date,
                            smsSent: details.smsSentPerc || 0,
                            smsDelivered: details.smsDeliveredPerc || 0,
                        });
                        histogramData["byShipperCount"].push({
                            name: date,
                            smsSent: details.smsSentCount || 0,
                            smsDelivered: details.smsDeliveredCount || 0,
                        });
                    }
                );
            }
            break;
        }
        case "trackingLink": {
            if (data.histogramDateWise) {
                Object.entries(data.histogramDateWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["overallPerc"].push({
                            name: date,
                            uniqueTrackingLinkOpen: details.uniqueTrackingLinkOpenPerc || 0,
                            totalTrackingLinkOpen: details.totalTrackingLinkOpenPerc || 0,
                        });
                        histogramData["overallCount"].push({
                            name: date,
                            uniqueTrackingLinkOpen: details.uniqueTrackingLinkOpen || 0,
                            totalTrackingLinkOpen: details.totalTrackingLinkOpen || 0,
                        });
                    }
                );
            }
            if (data.histogramShipperWise) {
                Object.entries(data.histogramShipperWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["byShipperPerc"].push({
                            name: date,
                            uniqueTrackingLinkOpen: details.uniqueTrackingLinkOpenPerc || 0,
                            totalTrackingLinkOpen: details.totalTrackingLinkOpenPerc || 0,
                        });
                        histogramData["byShipperCount"].push({
                            name: date,
                            uniqueTrackingLinkOpen: details.uniqueTrackingLinkOpen || 0,
                            totalTrackingLinkOpen: details.totalTrackingLinkOpen || 0,
                        });
                    }
                );
            }
            break;
        }
        case "ivr": {
            if (data.histogramDateWise) {
                Object.entries(data.histogramDateWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["overallPerc"].push({
                            name: date,
                            ivrAnswered: details.ivrAnsweredPerc || 0,
                            ivrSent: details.ivrSentPerc || 0,
                        });
                        histogramData["overallCount"].push({
                            name: date,
                            ivrAnswered: details.ivrAnsweredCount || 0,
                            ivrSent: details.ivrSentCount || 0,
                        });
                    }
                );
            }
            if (data.histogramShipperWise) {
                Object.entries(data.histogramShipperWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["byShipperPerc"].push({
                            name: date,
                            ivrAnswered: details.ivrAnsweredPerc || 0,
                            ivrSent: details.ivrSentPerc || 0,
                        });
                        histogramData["byShipperCount"].push({
                            name: date,
                            ivrAnswered: details.ivrAnsweredCount || 0,
                            ivrSent: details.ivrSentCount || 0,
                        });
                    }
                );
            }
            break;
        }
        case "email": {
            if (data.histogramDateWise) {
                Object.entries(data.histogramDateWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["overallPerc"].push({
                            name: date,
                            emailSent: details.emailSentPerc || 0,
                            emailDelivered: details.emailDeliveredPerc || 0,
                            emailBounced: details.emailBouncedPerc || 0,
                        });
                        histogramData["overallCount"].push({
                            name: date,
                            emailSent: details.emailSentCount || 0,
                            emailDelivered: details.emailDeliveredCount || 0,
                            emailBounced: details.emailBouncedCount || 0,
                        });
                    }
                );
            }
            if (data.histogramShipperWise) {
                Object.entries(data.histogramShipperWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["byShipperPerc"].push({
                            name: date,
                            emailSent: details.emailSentPerc || 0,
                            emailDelivered: details.emailDeliveredPerc || 0,
                            emailBounced: details.emailBouncedPerc || 0,
                        });
                        histogramData["byShipperCount"].push({
                            name: date,
                            emailSent: details.emailSentCount || 0,
                            emailDelivered: details.emailDeliveredCount || 0,
                            emailBounced: details.emailBouncedCount || 0,
                        });
                    }
                );
            }
            break;
        }
        case "whatsapp": {
            if (data?.histogramDateWise) {
                Object.entries(data?.histogramDateWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["overallPerc"].push({
                            name: date,
                            whatsappSent: details.whatsappSentPerc || 0,
                            whatsappDelivered: details.whatsappDeliveredPerc || 0,
                            whatsappRead: details.whatsappReadPerc || 0,
                        });
                        histogramData["overallCount"].push({
                            name: date,
                            whatsappSent: details.whatsappSentCount || 0,
                            whatsappDelivered: details.whatsappDeliveredCount || 0,
                            whatsappRead: details.whatsappReadCount || 0,
                        });
                    }
                );
            }
            if (data?.histogramShipperWise) {
                Object.entries(data?.histogramShipperWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["byShipperPerc"].push({
                            name: date,
                            whatsappSent: details.whatsappSentPerc || 0,
                            whatsappDelivered: details.whatsappDeliveredPerc || 0,
                            whatsappRead: details.whatsappReadPerc || 0,
                        });
                        histogramData["byShipperCount"].push({
                            name: date,
                            whatsappSent: details.whatsappSentCount || 0,
                            whatsappDelivered: details.whatsappDeliveredCount || 0,
                            whatsappRead: details.whatsappReadCount || 0,
                        });
                    }
                );
            }
            break;
        }
        case "feedbackhistogram": {
            if (data.histogramDateWise) {
                Object.entries(data.histogramDateWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["overallPerc"].push({
                            name: date,
                            feedbackCount: details.feedbackPerc || 0,
                            overallRating: details.overallRatingPerc || 0,
                            foodRating: details.foodRatingPerc || 0,
                            productRating: details.productRatingPerc || 0,
                            packagingRating: details.packagingRatingPerc || 0,
                            trackingRating: details.trackingRatingPerc || 0,
                            deliveryRating: details.deliveryRatingPerc || 0,
                            orderingRating: details.orderingRatingPerc || 0,
                            supportRating: details.supportRatingPerc || 0,
                            avgRating: details.percRating || 0,
                        });
                        histogramData["overallCount"].push({
                            name: date,
                            feedbackCount: details.feedbackCount || 0,
                            overallRating: details.overallRating || 0,
                            foodRating: details.foodRating || 0,
                            productRating: details.productRating || 0,
                            packagingRating: details.packagingRating || 0,
                            trackingRating: details.trackingRating || 0,
                            deliveryRating: details.deliveryRating || 0,
                            orderingRating: details.orderingRating || 0,
                            supportRating: details.supportRating || 0,
                            avgRating: details.avgRating || 0,
                        });
                    }
                );
            }
            if (data.histogramShipperWise) {
                Object.entries(data.histogramShipperWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["byShipperPerc"].push({
                            name: date,
                            feedbackCount: details.feedbackPerc || 0,
                            overallRating: details.overallRatingPerc || 0,
                            foodRating: details.foodRatingPerc || 0,
                            productRating: details.productRatingPerc || 0,
                            packagingRating: details.packagingRatingPerc || 0,
                            trackingRating: details.trackingRatingPerc || 0,
                            deliveryRating: details.deliveryRatingPerc || 0,
                            orderingRating: details.orderingRatingPerc || 0,
                            supportRating: details.supportRatingPerc || 0,
                            avgRating: details.percRating || 0,
                        });
                        histogramData["byShipperCount"].push({
                            name: date,
                            feedbackCount: details.feedbackCount || 0,
                            overallRating: details.overallRating || 0,
                            foodRating: details.foodRating || 0,
                            productRating: details.productRating || 0,
                            packagingRating: details.packagingRating || 0,
                            trackingRating: details.trackingRating || 0,
                            deliveryRating: details.deliveryRating || 0,
                            orderingRating: details.orderingRating || 0,
                            supportRating: details.supportRating || 0,
                            avgRating: details.avgRating || 0,
                        });
                    }
                );
            }
            break;
        }
        case "totalFeedback": {
            if (data.histogramDateWise) {
                Object.entries(data.histogramDateWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["overallPerc"].push({
                            name: date,
                            feedbackCount: details.feedbackPerc || 0,
                        });
                        histogramData["overallCount"].push({
                            name: date,
                            feedbackCount: details.feedbackCount || 0,
                        });
                    }
                );
            }
            if (data.histogramShipperWise) {
                Object.entries(data.histogramShipperWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["byShipperPerc"].push({
                            name: date,
                            feedbackCount: details.feedbackPerc || 0,
                        });
                        histogramData["byShipperCount"].push({
                            name: date,
                            feedbackCount: details.feedbackCount || 0,
                        });
                    }
                );
            }
            break;
        }
        case "promotions": {
            if (data.histogramDateWise) {
                Object.entries(data.histogramDateWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["overallPerc"].push({
                            name: date,
                            promotionView: details.promotionViewPerc || 0,
                            promotionClick: details.promotionClickPerc || 0,
                        });
                        histogramData["overallCount"].push({
                            name: date,
                            promotionView: details.promotionViewCount || 0,
                            promotionClick: details.promotionClickCount || 0,
                        });
                    }
                );
            }
            if (data.histogramShipperWise) {
                Object.entries(data.histogramShipperWise).forEach(
                    ([date, details]: [string, any]) => {
                        histogramData["byShipperPerc"].push({
                            name: date,
                            promotionView: details.promotionViewPerc || 0,
                            promotionClick: details.promotionClickPerc || 0,
                        });
                        histogramData["byShipperCount"].push({
                            name: date,
                            promotionView: details.promotionViewCount || 0,
                            promotionClick: details.promotionClickCount || 0,
                        });
                    }
                );
            }
            break;
        }

        default: {
            break;
        }
    }

    return histogramData;
}

const clientProperties = store?.getState()?.clientProperties;

export const filterDateFormatter = (date?: Date) => {
    const timezone = clientProperties?.TIMEZONE?.propertyValue
        ? clientProperties?.TIMEZONE?.propertyValue?.toUpperCase()
        : "";
    return moment.tz(date, timezone).utc().format("YYYY-MM-DD HH:mm:ss");
};
