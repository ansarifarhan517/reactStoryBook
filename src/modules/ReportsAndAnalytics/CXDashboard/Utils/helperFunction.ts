import moment from "moment";
import store from "../../../../utils/redux/store";

export function transformInputData(data, key) {
  const dynamicLabels = store?.getState()?.dynamicLabels;
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
      const smsSent = dynamicLabels["smsSent"] || "Sent";
      const smsDelivered = dynamicLabels["smsDelivered"] || "Delivered";
      const createPayload = (date, details) => {
        let countPayload = { name: date };
        let percentPayload = { name: date };
        percentPayload[smsSent] =
          (!isNaN(details.smsSentPerc) &&
            Number(details.smsSentPerc?.toFixed(1))) ||
          0;
        percentPayload[smsDelivered] =
          (!isNaN(details.smsDeliveredPerc) &&
            Number(details.smsDeliveredPerc?.toFixed(1))) ||
          0;
        countPayload[smsSent] =
          (!isNaN(details.smsSentCount) &&
            Number(details.smsSentCount?.toFixed(1))) ||
          0;
        countPayload[smsDelivered] =
          (!isNaN(details.smsDeliveredCount) &&
            Number(details.smsDeliveredCount?.toFixed(1))) ||
          0;
        return [countPayload, percentPayload];
      };
      if (data?.histogramDateWise) {
        Object.entries(data.histogramDateWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["overallPerc"].push(percentPayload);
            histogramData["overallCount"].push(countPayload);
          }
        );
      }
      if (data?.histogramShipperWise) {
        Object.entries(data.histogramShipperWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["byShipperPerc"].push(percentPayload);
            histogramData["byShipperCount"].push(countPayload);
          }
        );
      }
      break;
    }
    case "whatsapp" : {
      const whatsappSent = dynamicLabels["whatsappSent"] || "Whatsapp Sent";
      const whatsappDelivered = dynamicLabels["whatsappDelivered"] || "Whatsapp Delivered";
      const whatsappRead = dynamicLabels["whatsappRead"] || "Whatsapp Read";
      const createPayload = (date, details) => {
        let countPayload = { name: date };
        let percentPayload = { name: date };
        percentPayload[whatsappSent] =
          (!isNaN(details.whatsappSentPerc) &&
            Number(details.whatsappSentPerc?.toFixed(1))) ||
          0;
        percentPayload[whatsappDelivered] =
          (!isNaN(details.whatsappDeliveredPerc) &&
            Number(details.whatsappDeliveredPerc?.toFixed(1))) ||
          0;
        percentPayload[whatsappRead] =
          (!isNaN(details.whatsappReadPerc) &&
            Number(details.whatsappReadPerc?.toFixed(1))) ||
          0;
          
        countPayload[whatsappSent] =
          (!isNaN(details.whatsappSentCount) &&
            Number(details.whatsappSentCount?.toFixed(1))) ||
          0;
        countPayload[whatsappDelivered] =
          (!isNaN(details.whatsappDeliveredCount) &&
            Number(details.whatsappDeliveredCount?.toFixed(1))) ||
          0;
          countPayload[whatsappRead] =
          (!isNaN(details.whatsappReadCount) &&
            Number(details.whatsappReadCount?.toFixed(1))) ||
          0;
        return [countPayload, percentPayload];
      };
      if (data?.histogramDateWise) {
        Object.entries(data.histogramDateWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["overallPerc"].push(percentPayload);
            histogramData["overallCount"].push(countPayload);
          }
        );
      }
      if (data?.histogramShipperWise) {
        Object.entries(data.histogramShipperWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["byShipperPerc"].push(percentPayload);
            histogramData["byShipperCount"].push(countPayload);
          }
        );
      }
      break;
    }
    case "trackingLink": {
      const uniqueTrackingLinkOpen =
        dynamicLabels["uniqueTrackingLinkOpen"] || "Unique Tracking Link Open";
      const totalTrackingLinkOpen =
        dynamicLabels["totalTrackingLinkOpen"] || "Total Tracking Link Open";
      const createPayload = (date, details) => {
        let countPayload = { name: date };
        let percentPayload = { name: date };
        percentPayload[uniqueTrackingLinkOpen] =
          details.uniqueTrackingLinkOpenPerc || 0;
        percentPayload[totalTrackingLinkOpen] =
          details.totalTrackingLinkOpenPerc || 0;
        countPayload[uniqueTrackingLinkOpen] =
          details.uniqueTrackingLinkOpen || 0;
        countPayload[totalTrackingLinkOpen] =
          details.totalTrackingLinkOpen || 0;
        return [countPayload, percentPayload];
      };
      if (data?.histogramDateWise) {
        Object.entries(data.histogramDateWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["overallPerc"].push(percentPayload);
            histogramData["overallCount"].push(countPayload);
          }
        );
      }
      if (data?.histogramShipperWise) {
        Object.entries(data.histogramShipperWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["byShipperPerc"].push(percentPayload);
            histogramData["byShipperCount"].push(countPayload);
          }
        );
      }
      break;
    }
    case "ivr": {
      const ivrAnswered = dynamicLabels["ivrAnswered"] || "Answered";
      const ivrSent = dynamicLabels["ivrSent"] || "Sent";
      const createPayload = (date, details) => {
        let countPayload = { name: date };
        let percentPayload = { name: date };
        countPayload[ivrAnswered] =
          (!isNaN(details.ivrAnsweredCount) &&
            Number(details.ivrAnsweredCount?.toFixed(1))) ||
          0;
        countPayload[ivrSent] =
          (!isNaN(details.ivrSentCount) &&
            Number(details.ivrSentCount?.toFixed(1))) ||
          0;
        percentPayload[ivrAnswered] =
          (!isNaN(details.ivrAnsweredPerc) &&
            Number(details.ivrAnsweredPerc?.toFixed(1))) ||
          0;
        percentPayload[ivrSent] =
          (!isNaN(details.ivrSentPerc) &&
            Number(details.ivrSentPerc?.toFixed(1))) ||
          0;
        return [countPayload, percentPayload];
      };
      if (data?.histogramDateWise) {
        Object.entries(data.histogramDateWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["overallPerc"].push(percentPayload);
            histogramData["overallCount"].push(countPayload);
          }
        );
      }
      if (data?.histogramShipperWise) {
        Object.entries(data.histogramShipperWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["byShipperPerc"].push(percentPayload);
            histogramData["byShipperCount"].push(countPayload);
          }
        );
      }
      break;
    }
    case "email": {
      const emailSent = dynamicLabels["emailSent"] || "Sent";
      const emailDelivered = dynamicLabels["emailDelivered"] || "Delivered";
      const emailBounced = dynamicLabels["emailBounced"] || "Bounced";
      const createPayload = (date, details) => {
        let countPayload = { name: date };
        let percentPayload = { name: date };
        percentPayload[emailSent] =
          (!isNaN(details.emailSentPerc) &&
            Number(details.emailSentPerc?.toFixed(1))) ||
          0;
        percentPayload[emailDelivered] =
          (!isNaN(details.emailDeliveredPerc) &&
            Number(details.emailDeliveredPerc?.toFixed(1))) ||
          0;
        percentPayload[emailBounced] =
          (!isNaN(details.emailBouncedPerc) &&
            Number(details.emailBouncedPerc?.toFixed(1))) ||
          0;
        countPayload[emailSent] =
          (!isNaN(details.emailSentCount) &&
            Number(details.emailSentCount?.toFixed(1))) ||
          0;
        countPayload[emailDelivered] =
          (!isNaN(details.emailDeliveredCount) &&
            Number(details.emailDeliveredCount?.toFixed(1))) ||
          0;
        countPayload[emailBounced] =
          (!isNaN(details.emailBouncedCount) &&
            Number(details.emailBouncedCount?.toFixed(1))) ||
          0;

        return [countPayload, percentPayload];
      };
      if (data?.histogramDateWise) {
        Object.entries(data.histogramDateWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["overallPerc"].push(percentPayload);
            histogramData["overallCount"].push(countPayload);
          }
        );
      }
      if (data?.histogramShipperWise) {
        Object.entries(data.histogramShipperWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["byShipperPerc"].push(percentPayload);
            histogramData["byShipperCount"].push(countPayload);
          }
        );
      }
      break;
    }

    case "feedbackhistogram": {
      const overallRating = dynamicLabels["overallRating"] || "Overall";
      const foodRating = dynamicLabels["foodRating"] || "Food";
      const productRating = dynamicLabels["productRating"] || "Product";
      const packagingRating = dynamicLabels["packagingRating"] || "Packaging";
      const trackingRating = dynamicLabels["trackingRating"] || "Tracking";
      const deliveryRating = dynamicLabels["deliveryRating"] || "Delivery";
      const orderingRating = dynamicLabels["orderingRating"] || "Ordering";
      const supportRating = dynamicLabels["supportRating"] || "Support";
      const avgRating = dynamicLabels["avgRating"] || "Average";
      const createPayload = (date, details) => {
        let countPayload = { name: date };
        let percentPayload = { name: date };

        percentPayload[overallRating] =
          (!isNaN(details.overallRatingPerc) &&
            Number(details.overallRatingPerc?.toFixed(1))) ||
          0;
        percentPayload[foodRating] =
          (!isNaN(details.foodRatingPerc) &&
            Number(details.foodRatingPerc?.toFixed(1))) ||
          0;
        percentPayload[productRating] =
          (!isNaN(details.productRatingPerc) &&
            Number(details.productRatingPerc?.toFixed(1))) ||
          0;
        percentPayload[packagingRating] =
          (!isNaN(details.packagingRatingPerc) &&
            Number(details.packagingRatingPerc?.toFixed(1))) ||
          0;
        percentPayload[trackingRating] =
          (!isNaN(details.trackingRatingPerc) &&
            Number(details.trackingRatingPerc?.toFixed(1))) ||
          0;
        percentPayload[deliveryRating] =
          (!isNaN(details.deliveryRatingPerc) &&
            Number(details.deliveryRatingPerc?.toFixed(1))) ||
          0;
        percentPayload[orderingRating] =
          (!isNaN(details.orderingRatingPerc) &&
            Number(details.orderingRatingPerc?.toFixed(1))) ||
          0;
        percentPayload[supportRating] =
          (!isNaN(details.supportRatingPerc) &&
            Number(details.supportRatingPerc?.toFixed(1))) ||
          0;
        percentPayload[avgRating] =
          (!isNaN(details.percRating) &&
            Number(details.percRating?.toFixed(1))) ||
          0;

        countPayload[overallRating] =
          (!isNaN(details.overallRating) &&
            Number(details.overallRating?.toFixed(1))) ||
          0;
        countPayload[foodRating] =
          (!isNaN(details.foodRating) &&
            Number(details.foodRating?.toFixed(1))) ||
          0;
        countPayload[productRating] =
          (!isNaN(details.productRating) &&
            Number(details.productRating?.toFixed(1))) ||
          0;
        countPayload[packagingRating] =
          (!isNaN(details.packagingRating) &&
            Number(details.packagingRating?.toFixed(1))) ||
          0;
        countPayload[trackingRating] =
          (!isNaN(details.trackingRating) &&
            Number(details.trackingRating?.toFixed(1))) ||
          0;
        countPayload[deliveryRating] =
          (!isNaN(details.deliveryRating) &&
            Number(details.deliveryRating?.toFixed(1))) ||
          0;
        countPayload[orderingRating] =
          (!isNaN(details.orderingRating) &&
            Number(details.orderingRating?.toFixed(1))) ||
          0;
        countPayload[supportRating] =
          (!isNaN(details.supportRating) &&
            Number(details.supportRating?.toFixed(1))) ||
          0;
        countPayload[avgRating] =
          (!isNaN(details.avgRating) &&
            Number(details.avgRating?.toFixed(1))) ||
          0;

        return [countPayload, percentPayload];
      };
      if (data?.histogramDateWise) {
        Object.entries(data.histogramDateWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["overallPerc"].push(percentPayload);
            histogramData["overallCount"].push(countPayload);
          }
        );
      }
      if (data?.histogramShipperWise) {
        Object.entries(data.histogramShipperWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["byShipperPerc"].push(percentPayload);
            histogramData["byShipperCount"].push(countPayload);
          }
        );
      }
      break;
    }
    case "totalFeedback": {
      const feedbackCount = dynamicLabels["feedbackCount"] || "Feedback Count";

      const createPayload = (date, details) => {
        let countPayload = { name: date };
        let percentPayload = { name: date };
        percentPayload[feedbackCount] =
          (!isNaN(details.feedbackPerc) &&
            Number(details.feedbackPerc?.toFixed(1))) ||
          0;
        countPayload[feedbackCount] =
          (!isNaN(details.feedbackCount) &&
            Number(details.feedbackCount?.toFixed(1))) ||
          0;
        return [countPayload, percentPayload];
      };
      if (data?.histogramDateWise) {
        Object.entries(data.histogramDateWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["overallPerc"].push(percentPayload);
            histogramData["overallCount"].push(countPayload);
          }
        );
      }
      if (data?.histogramShipperWise) {
        Object.entries(data.histogramShipperWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["byShipperPerc"].push(percentPayload);
            histogramData["byShipperCount"].push(countPayload);
          }
        );
      }
      break;
    }
    case "promotions": {
      const promotionView = dynamicLabels["promotionView"] || "View";
      const promotionClick = dynamicLabels["promotionClick"] || "Click";

      const createPayload = (date, details) => {
        let countPayload = { name: date };
        let percentPayload = { name: date };
        percentPayload[promotionView] =
          (!isNaN(details.promotionViewPerc) &&
            Number(details.promotionViewPerc?.toFixed(1))) ||
          0;
        percentPayload[promotionClick] =
          (!isNaN(details.promotionClickPerc) &&
            Number(details.promotionClickPerc?.toFixed(1))) ||
          0;
        countPayload[promotionView] =
          (!isNaN(details.promotionViewCount) &&
            Number(details.promotionViewCount?.toFixed(1))) ||
          0;
        countPayload[promotionClick] =
          (!isNaN(details.promotionClickCount) &&
            Number(details.promotionClickCount?.toFixed(1))) ||
          0;
        return [countPayload, percentPayload];
      };
      if (data?.histogramDateWise) {
        Object.entries(data.histogramDateWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["overallPerc"].push(percentPayload);
            histogramData["overallCount"].push(countPayload);
          }
        );
      }
      if (data?.histogramShipperWise) {
        Object.entries(data.histogramShipperWise).forEach(
          ([date, details]: [string, any]) => {
            const [countPayload, percentPayload] = createPayload(date, details);
            histogramData["byShipperPerc"].push(percentPayload);
            histogramData["byShipperCount"].push(countPayload);
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

export const filterCXDateFormatter = (date?: Date, daytime?: string) => {
  if(daytime === "startdate") {
    return moment(date).format("YYYY-MM-DD")+ " " +"00:00:00";
  } else {
    return moment(date).format("YYYY-MM-DD")+ " " +"23:59:59";
  }                       
};