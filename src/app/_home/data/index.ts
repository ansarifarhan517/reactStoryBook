import FoodAndBeverage from '/public/industy-tab/food-beverage.webp'
import CourierExpress from '/public/industy-tab/courier-express-parcel.webp'
import ConsumerPackage from '/public/industy-tab/consumer-packaged-goods.webp'
import ReatilAndEcommerce from '/public/industy-tab/retail-e-commerce.webp'
import TransportAndLogistics from '/public/industy-tab/logistics-transportation.webp'
import { carouselItem } from '@/components/carousel/carousal-props-type'

const carouselItems: carouselItem[] = [
  {
    id: 'food_beverage',
    imageSrc: FoodAndBeverage,
    title: 'FOOD AND BEVERAGE',
    features: [
      {
        iconName:
          'large-home-slider-food--beverage-restaurant-supplies-and-distribution',
        title: 'Restaurant Supplies & Distribution',
      },
      {
        iconName:
          'large-home-slider-food--beverage-on-demand-pickup-allocation--dispatch',
        title: 'On-Demand Pickup Allocation & Dispatch',
      },
      {
        iconName:
          'large-home-slider-food--beverage-delivery-associate-vehicle-management',
        title: 'Delivery Associate / Vehicle Management',
      },
      {
        iconName:
          'large-home-slider-food--beverage-live-order-tracking-and-alerts',
        title: 'Live Order Tracking & Alerts',
      },
      {
        iconName: 'large-home-slider-food--beverage-multiple-payment-options',
        title: 'Multiple Payment Options',
      },
      {
        iconName:
          'large-home-slider-food--beverage-fast-home-delivery-with-customer-feedback',
        title: 'Fast Home Delivery with Customer Feedback',
      },
    ],
    description: `Fast deliveries with live order tracking are moving millennials and everyone else towards home deliveries of groceries and food leveraged by efficient route planning, 
            order sequencing, and auto-pickup and delivery allocation.`,
    buttons: [
      {
        id: 'food_beverage_learn_more',
        children: 'Learn More',
        url: '/industries/food-and-beverages',
        category: 'secondary',
      },
      {
        id: 'food_beverage_download_case_study',
        children: 'Download Case Study',
        url: 'https://info.loginextsolutions.com/hubfs/Case_Studies_2022/CaseStudy_Delivery%20Driver%20Performance.pdf',
        category: 'primary',
      },
    ],
  },
  {
    id: 'courier_express',
    imageSrc: CourierExpress,
    title: 'COURIER, EXPRESS AND PARCEL',
    description: `Fast deliveries with live order tracking are moving millennials and everyone else towards home deliveries of groceries and food leveraged by efficient route planning, 
    order sequencing, and auto-pickup and delivery allocation.`,
    features: [
      {
        iconName: '-parcel-first-mile-pickup',
        title: 'First Mile Pickup',
      },
      {
        iconName: '-parcel-on-demand-same-day-delivery',
        title: 'On-Demand / Same Day Delivery',
      },
      {
        iconName: '-parcel-middle-mile-management',
        title: 'Middle Mile Management',
      },
      {
        iconName: '-parcel-multiple-pickup-and-delivery-optimization',
        title: 'Multiple Pickup Delivery Optimization',
      },
      {
        iconName: '-parcel-special-handling-white-glove-delivery',
        title: 'Special Handling / White Glove Delivery',
      },
      {
        iconName: '-parcel-last-final-mile-delivery',
        title: 'Last/Final Mile Delivery',
      },
    ],
    buttons: [
      {
        id: 'courier_express_learn_more',
        children: 'Learn More',
        url: '/industries/couriers-express-parcels',
        category: 'secondary',
      },
      {
        id: 'courier_express_download_case_study',
        children: 'Download Case Study',
        url: 'https://info.loginextsolutions.com/hubfs/Case_Studies/CS_LN+CargoExpreso.pdf',
        category: 'primary',
      },
    ],
  },
  {
    id: 'consumer_package',
    imageSrc: ConsumerPackage,
    title: 'CONSUMER PACKAGED GOODS',
    description: `Seamless logistics movement across primary and secondary distribution with machine-learning 
                  enabled route planning, SKU movement tracking, proper scan-in and scan-out mechanisms, and delivery validation.`,
    features: [
      {
        iconName:
          'large-home-slider-consumer-packaged-goods-primary-distribution-capacity-optimization',
        title: 'Primary Distribution Capacity Optimization',
      },
      {
        iconName:
          'large-home-slider-consumer-packaged-goods-warehouse-to-store-movement',
        title: 'Warehouse to Store Movement',
      },
      {
        iconName:
          'large-home-slider-consumer-packaged-goods-delivery-associate-vehicle-management',
        title: 'Delivery Associate / Vehicle Management',
      },
      {
        iconName:
          'large-home-slider-consumer-packaged-goods-shipment-and-unit-level-tracking',
        title: 'Shipment & Unit Level Tracking',
      },
      {
        iconName:
          'large-home-slider-consumer-packaged-goods-sales-schedule-and-journey-optimization',
        title: 'Sales Schedule & Journey Optimization',
      },
      {
        iconName:
          'large-home-slider-consumer-packaged-goods-temperature-controlled-transport',
        title: 'Temperature Controlled Transport',
      },
    ],
    buttons: [
      {
        id: 'consumer_package_learn_more',
        children: 'Learn More',
        url: '/industries/consumer-package',
        category: 'secondary',
      },
      {
        id: 'consumer_package_download_case_study',
        children: 'Download Case Study',
        url: 'https://info.loginextsolutions.com/hubfs/Case_Studies_2022/CaseStudy_Delivery%20Driver%20Performance.pdf',
        category: 'primary',
      },
    ],
  },
  {
    id: 'reatil_and_ecommerce',
    imageSrc: ReatilAndEcommerce,
    title: 'RETAIL AND eCOMMERCE',
    description: `Rapidly increasing market preferences require fast, even same-day shipments,
                 enabled through efficient last mile delivery optimization between wholesalers, depots, retailers, and end-customers.`,

    features: [
      {
        iconName:
          'large-home-slider-consumer-packaged-goods-primary-distribution-capacity-optimization',
        title: 'Primary Distribution Capacity Optimization',
      },
      {
        iconName:
          'large-home-slider-retail--e-commerce-warehouse-to-store-movement',
        title: 'Warehouse to Store Movement',
      },
      {
        iconName:
          'large-home-slider-retail--e-commerce-store-to-customer-movement',
        title: 'Store to Customer Movement',
      },
      {
        iconName:
          'large-home-slider-retail--e-commerce-same-day-next-day-delivery',
        title: 'Same Day / Next Day Delivery',
      },
      {
        iconName:
          'large-home-slider-retail--e-commerce-omnichannel-distribution',
        title: 'Omnichannel Distribution',
      },
      {
        iconName:
          'large-home-slider-retail--e-commerce-end-to-end-package-tracking',
        title: 'End-To-End Package Tracking',
      },
    ],
    buttons: [
      {
        id: 'reatil_and_ecommerce_learn_more',
        children: 'Learn More',
        url: '/industries/retail-and-ecommerce',
        category: 'secondary',
      },
      {
        id: 'reatil_and_ecommerce_download_case_study',
        children: 'Download Case Study',
        url: 'https://info.loginextsolutions.com/hubfs/Case_Studies_2022/Case%20Study_Decathlon_Haul.pdf',
        category: 'primary',
      },
    ],
  },
  {
    id: 'transport_and_logistics',
    imageSrc: TransportAndLogistics,
    title: 'TRANSPORTATION AND LOGISTICS',
    description: `High capacity and resource utilization is the key to create value in freight and transport management with 
                competitive rates, better route planning, driver behavior tracking, SLA compliance, and error-free invoicing.`,
    features: [
      {
        iconName:
          'large-home-slider-logistics--transportation-hub-load-balancing',
        title: 'Hub-Load Balancing',
      },
      {
        iconName:
          'large-home-slider-logistics--transportation-ftl-and-ltl-capacity-optimization',
        title: 'Warehouse to Store Movement',
      },
      {
        iconName:
          'large-home-slider-logistics--transportation-rate-and-contract-management',
        title: 'Rate & Contract Management',
      },
      {
        iconName:
          'large-home-slider-logistics--transportation-driver-behavior-management',
        title: 'Driver Behavior Management',
      },
      {
        iconName:
          'large-home-slider-logistics--transportation-middle-mile-management',
        title: 'Middle Mile Management',
      },
      {
        iconName:
          'large-home-slider-logistics--transportation-cold-chain-logistics-management-previousnext',
        title: 'Cold Chain Logistics Management',
      },
    ],
    buttons: [
      {
        id: 'reatil_and_ecommerce_learn_more',
        children: 'Learn More',
        url: '/industries/transportation-software',
        category: 'secondary',
      },
      {
        id: 'reatil_and_ecommerce_download_case_study',
        children: 'Download Case Study',
        url: 'https://info.loginextsolutions.com/hubfs/Case_Studies_2022/CSLite_LN+Trucking.pdf',
        category: 'primary',
      },
    ],
  }, // Add more items as needed
]
const whyLoginextCardsData = [
  {
    id: 'slide-0',
    data: [
      {
        id: 'slide-0-route-dispatch',
        title: 'Comprehensive Route Planning and Dispatch Scheduling',
        icon: 'comprehensive-route-planning',
        description: `Traditional methods of dispatch scheduling and routing cannot support 
                      today’s customer expectations or your business growth aspirations. 
                          You need the best routing software to improve delivery times and reduce operational delays while efficiently managing your fleet and driver resources.`,
        url: '/route-planning-software'
      },
      {
        id: 'slide-0-customer-experience',
        title: 'The Best Customer Experience',
        icon: 'the-best-customer-experience',
        description: `Customers’ expectations from brands have evolved significantly. 
                      They expect real time notifications and updates on their orders along with flexibility in terms of 
                      choosing a preferred delivery time window. Achieve competitive advantage by providing a comprehensive range of delivery options and precise ETA communication.`,
        url: '/application-for-delivery-validation-through-ePOD'
      },
      {
        id: 'slide-0-real-time-tracking',
        title: 'Easy Real Time Tracking of Order Lifecycle',
        icon: 'easy-real-time-tracking-of-order-lifecyle',
        description: `Operations teams cannot deliver on your brand experience unless they have real time visibility across all aspects of the order lifecycle. 
                      Empower them with a flexible and comprehensive platform 
                        to meet your customer SLAs and your business KPIs.`,
        url: '/live-delivery-tracking-software'
      },
    ]
  },
  {
    id: 'slide-1',
    data: [
      {
        id: 'slide-1-customer-experience',
        title: 'The Best Customer Experience',
        icon: 'the-best-customer-experience',
        description: `Customers’ expectations from brands have evolved significantly. 
                      They expect real time notifications and updates on their orders along with flexibility in terms of choosing a preferred delivery time window. 
                      Achieve competitive advantage by providing a comprehensive range of delivery options and precise ETA communication.`,
        url: '/application-for-delivery-validation-through-ePOD'
      },
      {
        id: 'slide-1-real-time-tracking',
        title: 'Easy Real Time Tracking of Order Lifecycle',
        icon: 'easy-real-time-tracking-of-order-lifecyle',
        description: `Operations teams cannot deliver on your brand experience unless they have real time visibility across all aspects of the order lifecycle. 
                      Empower them with a flexible and comprehensive platform 
                      to meet your customer SLAs and your business KPIs.`,
        url: '/live-delivery-tracking-software'
      },
      {
        id: 'slide-1-simply-carrier-management ',
        title: 'Simplify Carrier Management',
        icon: 'simply-carrier-management',
        description: `Your business relies on multiple carriers to deliver orders, but managing them can be stressful. 
                      Allow your teams to manage their jobs efficiently by automating order management, integrated operational 
                      dashboards and analytics across 3rd party carriers.`,
        url: '/'
      },
    ]
  },
  {
    id: 'slide-2',
    data: [

      {
        id: 'slide-2-real-time-tracking',
        title: 'Easy Real Time Tracking of Order Lifecycle',
        icon: 'easy-real-time-tracking-of-order-lifecyle',
        description: `Operations teams cannot deliver on your brand experience unless they have real time visibility across all aspects of the order lifecycle.
                     Empower them with a flexible and comprehensive platform 
                      to meet your customer SLAs and your business KPIs.`,
        url: '/live-delivery-tracking-software'
      },
      {
        id: 'slide-2-simply-carrier-management ',
        title: 'Simplify Carrier Management',
        icon: 'simply-carrier-management',
        description: `Your business relies on multiple carriers to deliver orders, but managing them can be stressful. 
                      Allow your teams to manage their jobs efficiently by automating order management, integrated operational 
                      dashboards and analytics across 3rd party carriers.`,
        url: '/'
      },
      {
        id: 'slide-2-tracker-software-delivery',
        title: 'Tracker Software for Delivery',
        icon: 'tracker-software-delivery-driver-management',
        description: `Real time visibility over vehicles and orders gives you information about 
                      overall operations and provides you with the ability to make changes on the fly. 
                      Analyze delivery driver performance and improve location based services to deliver the best end customer experience.`,
        url: '/route-planning-software'
      }
    ]
  },
  {
    id: 'slide-3',
    data: [

      {
        id: 'slide-3-simply-carrier-management ',
        title: 'Simplify Carrier Management',
        icon: 'simply-carrier-management',
        description: `Your business relies on multiple carriers to deliver orders, but managing them can be stressful. 
                      Allow your teams to manage their jobs efficiently by automating order management, integrated operational 
                      dashboards and analytics across 3rd party carriers.`,
        url: '/'
      },
      {
        id: 'slide-3-tracker-software-delivery',
        title: 'Tracker Software for Delivery',
        icon: 'tracker-software-delivery-driver-management',
        description: `Real time visibility over vehicles and orders gives you information about 
                      overall operations and provides you with the ability to make changes on the fly. 
                      Analyze delivery driver performance and improve location based services to deliver the best end customer experience.`,
        url: '/route-planning-software'
      },
      {
        id: 'slide-3-route-dispatch',
        title: 'Comprehensive Route Planning and Dispatch Scheduling',
        icon: 'comprehensive-route-planning',
        description: `Traditional methods of dispatch scheduling and routing cannot support 
                      today’s customer expectations or your business growth aspirations. 
                      You need the best routing software to improve delivery times and reduce operational 
                      delays while efficiently managing your fleet and driver resources.`,
        url: '/route-planning-software'
      },
    ]
  },
  {
    id: 'slide-4',
    data: [

      {
        id: 'slide-4-tracker-software-delivery',
        title: 'Tracker Software for Delivery',
        icon: 'tracker-software-delivery-driver-management',
        description: `Real time visibility over vehicles and orders gives you information about 
                      overall operations and provides you with the ability to make changes on the fly. 
                      Analyze delivery driver performance and improve location based services to deliver the best end customer experience.`,
        url: '/route-planning-software'
      },
      {
        id: 'slide-4-route-dispatch',
        title: 'Comprehensive Route Planning and Dispatch Scheduling',
        icon: 'comprehensive-route-planning',
        description: `Traditional methods of dispatch scheduling and routing cannot support 
                      today’s customer expectations or your business growth aspirations. 
                      You need the best routing software to improve delivery times and reduce operational 
                      delays while efficiently managing your fleet and driver resources.`,
        url: '/route-planning-software'
      },
      {
        id: 'slide-4-customer-experience',
        title: 'The Best Customer Experience',
        icon: 'the-best-customer-experience',
        description: `Customers’ expectations from brands have evolved significantly. 
                      They expect real time notifications and updates on their orders along with flexibility in terms of choosing a preferred delivery time window.
                       Achieve competitive advantage by providing a comprehensive range of delivery options and precise ETA communication.`,
        url: '/application-for-delivery-validation-through-ePOD'
      },
    ]
  },

]

export { carouselItems ,whyLoginextCardsData }
