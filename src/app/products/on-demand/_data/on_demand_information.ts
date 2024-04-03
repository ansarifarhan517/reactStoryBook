/* eslint-disable max-len */

import planForAllOrdersAndAvailable from '/public/products/on-demand/plan-for-all-orders-and-available.webp'
import automaticallyAllocateRightOrderToRightDriverOnTheBestDeliveryManagementSoftware from '/public/products/on-demand/automatically-allocate-right-order-to-right-driver-on-the-best-delivery-management-software.webp'
import dispatchSchedulingSoftwareToTrackAndValidateAllDeliveriesInRealTime from '/public/products/on-demand/dispatch-scheduling-software-to-track-and-validate-all-deliveries-in-real-time.webp'

const productOnDemandInformation = [
  {
    id: 'plan-for-all-orders-and-available',
    image: planForAllOrdersAndAvailable,
    imagePosition: 'right',
    title:
      'Plan for All Orders and Available Delivery Drivers on the Best Fleet Management System',
    description:
      'Identify the carrying capacity of all delivery drivers while mapping deliverable areas with accurate addresses for faster processing and quicker allocation.',
    features: [
      {
        id: 'capacity-optimization',
        label: 'Capacity optimization: ',
        description:
          'Increase utilization of all delivery drivers by optimizing carrying capacities. With advanced 3D packing assistance, plan various load sizes to be efficiently loaded on available fleets.',
      },
      {
        id: 'accurate-addresses',
        label: 'Accurate addresses: ',
        description:
          'Avoid delays due to searching for wrong receiver addresses fed into the system using machine-learning backed algorithms to validate or fix all addresses.',
      },
      {
        id: 'quicker-turnaround-time',
        label: 'Quicker turnaround time: ',
        description:
          'Reduce overall turnaround time by employing optimized delivery sequences and routes for faster deliveries. Fulfill more orders on-time in every trip.',
      },
    ]
  },
  {
    id: 'automatically-allocate-right-order-to-right-driver-on-the-best-delivery-management-software',
    image: automaticallyAllocateRightOrderToRightDriverOnTheBestDeliveryManagementSoftware,
    imagePosition:'left',
    title:
      'Automatically Allocate Right Order to Right Driver on the Best Delivery Management Software',
    description:
      'Identify all nearby delivery drivers with carrying capacity and skills ideal for an order pickup and timely delivery and automatically allocate the order to them.',
    features: [
      {
        id: 'faster-order-allocation',
        label: 'Faster order allocation: ',
        description:
          'Automated allocation of all orders to the right delivery driver ensures faster processing and dispatch scheduling for eventual on-time deliveries for the Recipients.',
      },
      {
        id: 'optimized-delivery',
        label: 'Optimized delivery: ',
        description:
          'Delivery sequence planning while allocation of orders ensures that the timelines of all existing orders are met. The new order is placed in the sequence accordingly.',
      },
      {
        id: 'increased-resource-utilization',
        label: 'Increased resource utilization: ',
        description:
          'Ensure higher deliveries per trip for each delivery driver and increase overall resource utilization and reduce delivery movement costs without affecting efficiency.',
      },
    ],
  },
  {
    id: 'dispatch-scheduling-software-to-track-and-validate-all-deliveries-in-real-time',
    title: 'Dispatch Scheduling Software to Track and Validate All Deliveries in Real-Time',
    image: dispatchSchedulingSoftwareToTrackAndValidateAllDeliveriesInRealTime,
    imagePosition: 'right',
    description:
      'Ensure complete visibility and control over all delivery movement by tracking driver\'s right from allocation to delivery fulfillment and validation.',
    features: [
      {
        id: 'live-delivery-tracking',
        label: 'Live delivery tracking: ',
        description:
          'Track delivery drivers as they move on their trips for heightened control and responsiveness to overcome any sudden delays or disruptions.',
      },
      {
        id: 'dynamic-eta-and-notification',
        label: 'Dynamic eta and notification: ',
        description:
          'Ensure dynamic calculation of estimated time of arrivals (ETAs). Send notifications to the receiver and other stakeholders about incoming deliveries.',
      },
      {
        id: 'secure-delivery-validation',
        label: 'Secure delivery validation: ',
        description:
          'Authenticate all deliveries using the in-app camera and validation mechanisms for error-free invoicing. Record receiver feedback at the point of exchange.',
      },
    ],
  },
]

export default productOnDemandInformation
