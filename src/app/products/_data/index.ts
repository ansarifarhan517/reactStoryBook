import OperationsBG from '/public/platform/operations-team-bg.webp'
import Operations from '/public/platform/operations-team-ss.webp'
import DeliveryBG from '/public/platform/delivery-driver-bg.webp'
import Delivery from '/public/platform/delivery-driver-ss.webp'
import CustomerBG from '/public/platform/customer-bg.webp'
import Customer from '/public/platform/customer-ss.webp'
import ShipperBG from '/public/platform/shipper-bg.webp'
import Shipper from '/public/platform/shipper-ss.webp'
import FinanceItBG from '/public/platform/finance-it-bg.webp'
import FinanceIt from '/public/platform/finance-it-ss.webp'
import mileProductImage from '/public/platform/product-logo/logo-mile.webp'
import haulProductImage from '/public/platform/product-logo/logo-haul.webp'
import onDemandProductImage from '/public/platform/product-logo/logo-on-demand.webp'
import reverseProductImage from '/public/platform/product-logo/logo-reverse.webp'
import driverAppImage from '/public/platform/product-logo/logo-driver-app.webp'


const productCards = [
  {
    id: 'slide-0' ,
    products : [
      {
        id: 'slide-0-mile',
        title: 'Mile',
        image: mileProductImage,
        description: 'Optimize delivery pick-up, planning, scheduling and routing to help efficiently run your operations.',
        url: '/products/mile'
      },
      {
        id: 'slide-0-haul' ,
        title: 'Haul',
        image: haulProductImage,
        description: 'Gain real time visibility over your logistical operations, avoid supply chain hiccups and lower overall transportation costs with the best line haul software.',
        url: '/products/haul'
      },
      {
        id: 'slide-0-on-demand',
        title: 'On-Demand',
        image: onDemandProductImage,
        description: 'Manage express deliveries and achieve toughest SLA\'s with our progressive on-demand delivery management software.',
        url: '/products/on-demand'

      },
      {
        id: 'slide-0-reverse',
        title: 'Reverse',
        image: reverseProductImage,
        description: 'Optimize return-to-merchant (RTM) and return-to-origin (RTO) scenarios for your eCommerce logistics while clustering pick-ups with other deliveries.',
        url: '/products/reverse'
      },

    ]
  },
  {
    id: '1' ,
    products : [
      {
        id: 'slide-1-haul',
        image: haulProductImage,
        description: 'Gain real time visibility over your logistical operations, avoid supply chain hiccups and lower overall transportation costs with the best line haul software.',
        url: '/products/haul',
        title: 'Haul',
      },
      {
        id: 'slide-1-on-demand',
        title: 'On-Demand',
        image: onDemandProductImage,
        description: 'Manage express deliveries and achieve toughest SLA\'s with our progressive on-demand delivery management software.',
        url: '/products/on-demand',
      },
      {
        id: 'slide-1-reverse',
        title: 'Reverse' ,
        image: reverseProductImage,
        description: 'Optimize return-to-merchant (RTM) and return-to-origin (RTO) scenarios for your eCommerce logistics while clustering pick-ups with other deliveries.',
        url: '/products/reverse'
      },
      {
        id: 'slide-1-driver-app',
        title: 'Driver-App',
        image: driverAppImage,
        description: `An intuitive driver app to guide and assist drivers on all aspects of deliveries, and 
                      with gamification inbuilt through which you can incentivize drivers to deliver with the maximum efficiency.`,
        url: '/products/driver-app'
      }
    ]
  },
  {
    id: '2' ,
    products : [

      {
        id: 'slide-2-on-demand',
        title: 'On-Demand',
        image: onDemandProductImage,
        description: 'Manage express deliveries and achieve toughest SLA\'s with our progressive on-demand delivery management software.',
        url: '/products/on-demand'
      },
      {
        id: 'slide-2-reverse',
        title: 'Reverse',
        image: reverseProductImage,
        description: 'Optimize return-to-merchant (RTM) and return-to-origin (RTO) scenarios for your eCommerce logistics while clustering pick-ups with other deliveries.',
        url: '/products/reverse'
      },
      {
        id: 'slide-2-driver-app',
        title: 'Driver-App',
        image: driverAppImage,
        description: `An intuitive driver app to guide and assist drivers on all aspects of deliveries, and with gamification inbuilt 
                      through which you can incentivize drivers to deliver with the maximum efficiency.`,
        url: '/products/driver-app'
      },
      {
        id: 'slide-2-mile',
        title: 'Mile',
        image: mileProductImage,
        description: 'Optimize delivery pick-up, planning, scheduling and routing to help efficiently run your operations.',
        url: '/products/mile'
      },
    ]
  },
  {
    id: '3' ,
    products : [

      {
        id: 'slide-3-reverse',
        title: 'Reverse',
        image: reverseProductImage,
        description: `Optimize return-to-merchant (RTM) and return-to-origin (RTO) scenarios for your eCommerce 
                      logistics while clustering pick-ups with other deliveries.`,
        url: '/products/reverse'
      },
      {
        id: 'slide-3-driver-app',
        title: 'Driver-App',
        image: driverAppImage,
        description: `An intuitive driver app to guide and assist drivers on all aspects of deliveries, and with gamification inbuilt through which you can incentivize 
                      drivers to deliver with the maximum efficiency.`,
        url: '/products/driver-app'
      },
      {
        id: 'slide-3-mile',
        title: 'Mile',
        image: mileProductImage,
        description: 'Optimize delivery pick-up, planning, scheduling and routing to help efficiently run your operations.',
        url: '/products/mile'
      },
      {
        id: 'slide-3-haul',
        title: 'Haul',
        image: haulProductImage,
        description: 'Gain real time visibility over your logistical operations, avoid supply chain hiccups and lower overall transportation costs with the best line haul software.',
        url: '/products/haul'
      },
    ]
  },
  {
    id: '4' ,
    products : [
      {
        id: 'slide-4-driver-app',
        title: 'Haul',
        image: driverAppImage,
        description: `An intuitive driver app to guide and assist drivers on all aspects of deliveries, and 
                      with gamification inbuilt through which you can incentivize drivers to deliver with the maximum efficiency.`,
        url: '/products/driver-app'
      },
      {
        id: 'slide-4-mile',
        title: 'Mile',
        image: mileProductImage,
        description: 'Optimize delivery pick-up, planning, scheduling and routing to help efficiently run your operations.',
        url: '/products/mile'
      },
      {
        id: 'slide-4-haul',
        title: 'Haul',
        image: haulProductImage,
        description: 'Gain real time visibility over your logistical operations, avoid supply chain hiccups and lower overall transportation costs with the best line haul software.',
        url: '/products/haul'
      },
      {
        id: 'slide-4-on-demand',
        title: 'On-Demand',
        image: onDemandProductImage,
        description: 'Manage express deliveries and achieve toughest SLA\'s with our progressive on-demand delivery management software.',
        url: '/products/on-demand'
      },
    ]
  }
]

const carouselItems: any = [
  {
    id: 'operations_team',
    imageSrc: OperationsBG,
    title: 'Operations Team',
    features: [
      {
        iconName:
          'livescreen-and-control-tower',
        title: 'Live Screen & Control Tower',
      },
      {
        iconName: 'real-time-fleet-tracking',
        title: 'Real Time Fleet Tracking',
      },
      {
        iconName: 'large-home-slider-food--beverage-delivery-associate-vehicle-management',
        title: '3rd Party Integrations',
      },
      {
        iconName: 'reporting-analytics',
        title: 'Reports & Analytics',
      },
      {
        iconName: 'real-time-fleet-tracking',
        title: 'Fleet Tracking & Management',
      },
      {
        iconName:
          'exception-handling',
        title: 'Exception Handling',
      },
    ],
    description: `Get real-time visibility, 
                  automate shipments manage own and 3rd party fleets`,
    image: Operations
  },
  {
    id: 'delivery_driver',
    imageSrc: DeliveryBG,
    title: 'Delivery Driver',
    description: `Optimize routing with ability to perform most delivery interactions 
                  with operations through a convenient app.`,
    features: [
      {
        iconName: '-parcel-first-mile-pickup',
        title: 'Order Pickup & Delivery',
      },
      {
        iconName: '-parcel-on-demand-same-day-delivery',
        title: 'Order Rescheduling',
      },
      {
        iconName: 'cash-management',
        title: 'Cash Management',
      },
      {
        iconName: 'epod--authentication',
        title: 'ePOD & Authentication',
      },

    ],
    image: Delivery
  },
  {
    id: 'customer',
    imageSrc: CustomerBG,
    title: 'Customer',
    description: `Get full visibility on your order delivery estimate and schedule 
                  deliveries based on your convenience.`,
    features: [
      {
        iconName:
          'notifications-alerts',
        title: 'Notifications & Alerts',
      },
      {
        iconName:
          'large-home-slider-consumer-packaged-goods-warehouse-to-store-movement',
        title: 'Order Rescheduling & Slot Booking',
      },
      {
        iconName:'real-time-order-tracking',
        title: 'Real Time Order Tracking',
      },
      {
        iconName:'delivery-experience-feedback ',
        title: 'Delivery Experience Feedback',
      },
      {
        iconName: 'access-to-promotional-offers',
        title: 'Access to Promotional Offers',
      },
      {
        iconName: 'call-chat-functionality path1 path2 path3 path4 path5 path6',
        title: 'Call & Chat Functionality',
      },
    ],
    image: Customer
  },
  {
    id: 'shipper',
    imageSrc: ShipperBG,
    title: 'Shipper',
    description: `Get full visibility on your order delivery estimate and schedule deliveries 
                    based on your convenience.`,

    features: [
      {
        iconName:
          'large-on-demand-automated-pickup-and-drop-fast-order-dispatch',
        title: 'Dedicated Shipper Portal',
      },
      {
        iconName:
          'large-home-slider-retail--e-commerce-warehouse-to-store-movement',
        title: 'Shipment Request Creation',
      },
      {
        iconName:
          'large-home-slider-retail--e-commerce-store-to-customer-movement',
        title: 'Order Serviceability',
      },
      {
        iconName:
          'large-home-slider-retail--e-commerce-same-day-next-day-delivery',
        title: 'Customer Management',
      },
      {
        iconName:
          'large-home-slider-retail--e-commerce-omnichannel-distribution',
        title: 'Shipment Dimensions & Details',
      },
      {
        iconName:
          'manage-rate-profiles',
        title: 'Service Type & Rate Selection',
      },
    ],
    image: Shipper
  },
  {
    id: 'it_and_finance',
    imageSrc: FinanceItBG,
    title: 'IT and Finance',
    description: `Seamless integrations with your ERP and other systems,
                   and audit compliance.`,
    features: [
      {
        iconName:
          'large-home-slider-logistics--transportation-hub-load-balancing',
        title: 'Integrations Marketplace',
      },
      {
        iconName:
          'reporting-analytics ',
        title: 'Reporting & Analytics',
      },
      {
        iconName:
          'secure-information-exchange',
        title: 'Secure Information Exchange',
      },
      {
        iconName: 'audit-logs',
        title: 'Audit Logs',
      },
      {
        iconName: 'driver-wallets',
        title: 'Driver Wallets',
      },
      {
        iconName: 'manage-rate-profiles',
        title: 'Manage Rate Profiles',
      },
    ],
    image: FinanceIt
  },
]

export { carouselItems ,productCards }
