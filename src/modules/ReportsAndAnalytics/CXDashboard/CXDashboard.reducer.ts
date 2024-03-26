import { ICXDashboardState, tActionCard } from "./CXDashboard.model";
import { CXDashboardActions } from "./CXDashboard.actions";
import moment from "moment-timezone";

export const dummyFeedbackStructure: any = {
  columns: {
    orderNo: {
      label: "Invoice",

      permission: true,
    },
    shipper: {
      label: "Shipper",

      permission: true,
    },
    branch: {
      label: "Hub",

      permission: true,
    },
    deliveryboy: {
      label: "DA",

      permission: true,
    },
    trip: {
      label: "Run",

      permission: true,
    },
    feedback: {
      label: "Feedback",

      permission: true,
    },
    ratingReceived: {
      label: "Rating Received",

      permission: true,
    },
  },
};
export const dummyPromotionsStructure: any = {
  columns: {
    orderNo: {
      label: "Invoice",

      permission: true,
    },
    shipper: {
      label: "Shipper",

      permission: true,
    },
    branch: {
      label: "Hub",

      permission: true,
    },
    deliveryboy: {
      label: "DA",

      permission: true,
    },
    trip: {
      label: "Run",

      permission: true,
    },
    feedback: {
      label: "Feedback",

      permission: true,
    },
    ratingReceived: {
      label: "Rating Received",

      permission: true,
    },
  },
};
export const dummyResult: any = Array(15)
  .fill(0)
  .map((_, i) => ({ orderNo: i + 1 }));
const currentDate = new Date();
const initialState: ICXDashboardState = {
  loading: {
    DATACARDS: true,
    LISTVIEW: true,
    COUNTHISTOGRAM: true,
  },
  breadcrumb: "",
  calendar: {
    from: moment(currentDate).subtract(7, "days").startOf("day").toDate(),
    to: moment(currentDate).endOf("day").toDate(),
  },
  groupBy: "DAY",
  listCount : 0,
  filterOptions: {},
  selectedDataCard: "trackinglinkhistogram",
  selectedDetailCard: "feedbackhistogram",
  cardData: {},
  trackingCardDetails: {},
  trackingLink: {
    feedback: {
      histogram: {
        mode: "OVERALL",
        data: {
          histogramDateWise: [],
          histogramShipperWise: [],
        },
      },
      listview: {
        data: dummyResult,
        structure: dummyFeedbackStructure,
      },
      tagCloud: {
        data: [],
      },
    },

    promotions: {
      histogram: {
        mode: "OVERALL",
        data: {
          histogramDateWise: [],
          histogramShipperWise: [],
        },
      },
      listview: {
        data: dummyResult,
        structure: dummyPromotionsStructure,
      },
    },
  },
  dropdownOptions: {
    shipper: [],
    branch: [],
    alertList: [],
  },
};

function CXDashboardReducer(
  state: ICXDashboardState = initialState,
  action: CXDashboardActions
) {
  switch (action.type) {
    case "@@CXDashboard/SET_LOADING": {
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };
    }

    case "@@CXDashboard/SET_CARD_DATA": {
      return {
        ...state,
        cardData: {
          ...state.cardData,
          ...action.payload.data,
        },
      };
    }
    case "@@CXDashboard/SET_TRACKINGCARD_DATA": {
      return {
        ...state,
        trackingCardDetails: {
          ...state.trackingCardDetails,
          ...action.payload.data,
        },
      };
    }

    case "@@CXDashboard/SET_FEEDBACK_STRUCTURE": {
      return {
        ...state,
        trackingLink: {
          ...state.trackingLink,
          feedback: {
            ...state.trackingLink.feedback,
            listview: {
              ...state.trackingLink.feedback.listview,
              structure: action.payload,
            },
          },
        },
      };
    }

    case "@@CXDashboard/SET_DROPDOWN_OPTIONS": {
      return {
        ...state,
        dropdownOptions: {
          ...state.dropdownOptions,
          ...action.payload,
        },
      };
    }
    case "@@CXDashboard/SET_FILTER": {
      return {
        ...state,
        filterOptions: {
          ...action.payload,
        },
      };
    }
    case "@@CXDashboard/SET_TAGCLOUD_DATA": {
      return {
        ...state,
        trackingLink: {
          ...state.trackingLink,
          feedback: {
            ...state.trackingLink.feedback,
            tagCloud: {
              ...state.trackingLink.feedback.tagCloud,
              data: action.payload,
            },
          },
        },
      };
    }

    case "@@CXDashboard/SET_GROUPBY": {
      return {
        ...state,
        groupBy: action.payload,
      };
    }

    case "@@CXDashboard/SET_PROMOTION_STRUCTURE": {
      return {
        ...state,
        trackingLink: {
          ...state.trackingLink,
          promotions: {
            ...state.trackingLink.promotions,
            listview: {
              ...state.trackingLink.promotions.listview,
              structure: action.payload,
            },
          },
        },
      };
    }

    case "@@CXDashboard/SET_FEEDBACK_DATA": {
      return {
        ...state,
        trackingLink: {
          ...state.trackingLink,
          feedback: {
            ...state.trackingLink.feedback,
            listview: {
              ...state.trackingLink.feedback.listview,
              data: action.payload,
            },
          },
        },
      };
    }

    case "@@CXDashboard/SET_PROMOTION_DATA": { //xxx
  
      return {
        ...state,
        trackingLink: {
          ...state.trackingLink,
          promotions: {
            ...state.trackingLink?.promotions,
            listview: {
              ...state.trackingLink?.promotions.listview,
              data: action.payload ,
            },
          },
        },
      };
    }

    case "@@CXDashboard/SET_DATERANGE_FILTER": {
      return {
        ...state,
        calendar: {
          to: action.payload.to,
          from: action.payload.from,
        },
      };
    }

    case "@@CXDashboard/SET_FEEDBACK_COUNT" :{
      return {
        ...state,
        listCount: action.payload,
      };
  }

    case "@@CXDashboard/SET_CHART_DATA": {
      const chartData = action.payload.data;

      switch (action.payload.chart) {
        case "smshistogram": {
          return {
            ...state,
            smsSent: {
              ...state.smsSent,
              data: {
                histogramDateWise: chartData.histogramDateWise,
                histogramShipperWise: chartData.histogramShipperWise,
              },
            },
          };
        }
        case "emailhistogram": {
          return {
            ...state,
            emailSent: {
              ...state.emailSent,
              data: {
                histogramDateWise: chartData.histogramDateWise,
                histogramShipperWise: chartData.histogramShipperWise,
              },
            },
          };
        }
        case "whatsapphistogram": {
          return {
            ...state,
            whatsappSent: {
              ...state.whatsappSent,
              data: {
                histogramDateWise: chartData.histogramDateWise,
                histogramShipperWise: chartData.histogramShipperWise,
              },
            },
          };
        }
        case "ivrhistogram": {
          return {
            ...state,
            ivrSent: {
              ...state.ivrSent,
              data: {
                histogramDateWise: chartData.histogramDateWise,
                histogramShipperWise: chartData.histogramShipperWise,
              },
            },
          };
        }
        case "trackinglinkhistogram": {
          return {
            ...state,
            trackingLink: {
              ...state.trackingLink,
              data: {
                histogramDateWise: chartData.histogramDateWise,
                histogramShipperWise: chartData.histogramShipperWise,
              },
            },
          };
        }

        case "feedbackhistogram": {
          return {
            ...state,
            trackingLink: {
              ...state.trackingLink,
              feedback: {
                ...state.trackingLink.feedback,
                histogram: {
                  ...state.trackingLink.feedback.histogram,
                  data: {
                    histogramDateWise: chartData.histogramDateWise,
                    histogramShipperWise: chartData.histogramShipperWise,
                  },
                },
              },
            },
          };
        }
        case "promotionhistogram": {
          return {
            ...state,
            trackingLink: {
              ...state.trackingLink,
              promotions: {
                ...state.trackingLink.promotions,
                histogram: {
                  ...state.trackingLink.promotions.histogram,
                  data: {
                    histogramDateWise: chartData.histogramDateWise,
                    histogramShipperWise: chartData.histogramShipperWise,
                  },
                },
              },
            },
          };
        }

        case "totalFeedback": {
          return {
            ...state,
            trackingLink: {
              ...state.trackingLink,
              promotions: {
                ...state.trackingLink.promotions,
                histogram: {
                  ...state.trackingLink.promotions.histogram,
                  data: {
                    histogramDateWise: chartData.histogramDateWise,
                    histogramShipperWise: chartData.histogramShipperWise,
                  },
                },
              },
            },
          };
        }

        default: {
          return { ...state };
        }
      }
    }

    default: {
      return { ...state };
    }
  }
}

export default CXDashboardReducer;
