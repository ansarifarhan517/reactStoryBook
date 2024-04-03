/* eslint-disable max-len */

import multiRoutePlanner from '/public/products/mile/improve-delivery-routing-to-deliver-faster-on-the-most-comprehensive-multi-route-planner.webp'
import effectiveRoutes from '/public/products/mile/a-comprehensive-route-management-software-to-create-fast-and-effective-routes.webp'
import deliveryProcess from '/public/products/mile/title-in-depth-analysis-of-entire-delivery-process.webp'

const productMileInformation = [
  {
    id: 'multi-route',
    image: multiRoutePlanner,
    imagePosition: 'right',
    title:
      'Improve Delivery Routing to Deliver Faster on the Most Comprehensive Multi Route Planner',
    description:
      'Leverage the power of a delivery route optimization software delivery scheduling software to increase resource utilization, cut down on costs, and  deliver faster.',
    features: [
      {
        id: 'custom-preferences',
        label: 'Deliver based on customer preferences: ',
        description:
          'Integrate your customer profiles to understand customer preferences for delivery times, locations, weekly schedule, etc to provide a superior customer experience',
      },
      {
        id: 'third-party-integration',
        label: 'Grow scale easily with 3rd party integrations: ',
        description:
          'You have finite vehicles and drivers. Grow faster by leveraging 3rd party logistics providers and carriers by integrating them at a click of a button. ',
      },
      {
        id: 'auto-allocation',
        label: 'Automatically Allocate Orders: ',
        description:
          'Map vehicle and driver skill sets, carrying capacities, and local knowledge of all resources, to your delivery objectives and automatically allocate orders with delivery route optimization software.',
      },
    ]
  },
  {
    id: 'fast-route',
    image: effectiveRoutes,
    imagePosition:'left',
    title:
      'A Comprehensive Route Management Software to Create Fast and Effective Routes',
    description:
      'Ensure all order pickups and deliveries are on-time with clear tracking and visibility by planning fast routes optimized for traffic patterns, weather conditions, KPIs and other constraints.',
    features: [
      {
        id: 'predict-eta',
        label: 'Predict delivery ETA, even before ordering: ',
        description:
          'Know the exact time when a client or customer would receive a shipment or delivery by evaluating live traffic conditions, preferred delivery time-slots, service time required to fulfill a delivery, etc.',
      },
      {
        id: 'resource-capacity',
        label: 'Efficiently utilize all resource capacity: ',
        description:
          'All your delivery drivers and vehicles have limited capacities. Rise above these constraints to optimally utilize all available capacity and direct maximum pickups and deliveries using them. ',
      },
      {
        id: 'timely-notification',
        label: 'Send and receive timely notifications: ',
        description:
          'Automatically send notifications to customers informing them on their impending pickup or delivery, ETA changes, or any other notifications. You can even configure notifications to be sent based on geofencing, time or distance on our delivery routing software.',
      },
    ],
  },
  {
    id: 'analysis-delivery-process',
    title: 'In-Depth Analysis of Entire Delivery Process',
    image: deliveryProcess,
    imagePosition: 'right',
    description:
      'Analyze every planned, active, and completed trip with an in-built logistics analytics dashboard designed to deliver actionable insights and detailed reports.',
    features: [
      {
        id: 'reports',
        label: 'Analyze comprehensive reports: ',
        description:
          'Get comprehensive reports to understand exactly which areas within the delivery process are working well and identify areas that need to improve. ',
      },
      {
        id: 'trends',
        label: 'Visually compare trends: ',
        description:
          'Easily compare the performance of multiple resources, vehicles, vendors, and logistics partners to identify what created the most value. Identify the top performers and utilize them to increase delivery efficiency with our delivery routing software.',
      },
      {
        id: 'analysis',
        label: 'Get deep insights with historical analysis: ',
        description:
          'Analyze delivery movement patterns to know exactly how many resources would be required and what strategies should be used. Plan better for future trips and find opportunities to improve distribution processes.',
      },
    ],
  },
]

export default productMileInformation
