/* eslint-disable max-len */

import optimizeResource from '/public/products/reverse/optimize-resource-utilization-for-improved-efficiency.webp'
import superiorCustomer from '/public/products/reverse/superior-customer-experience.webp'

const productReverseInformation = [
  {
    id: 'optimize-resource-utilization-for-improved-efficiency',
    image: optimizeResource,
    imagePosition: 'right',
    title:
      'Optimize Resource Utilization for Improved Efficiency',
    description:
      'Every trip that your delivery driver makes is an opportunity to optimize your operations. Improve resource utilization and fleet efficiency with automatic scheduling and effective routing.',
    features: [
      {
        id: 'automatically-allocate-orders',
        label: 'Automatically Allocate Orders: ',
        description:
          'Identify the skill sets, carrying capacities, and local knowledge of all resources to find how to get the most out of them. Automatically allocate pickups and deliveries to the best-suited delivery drivers.',
      },
      {
        id: 'efficiently-utilize-all-resource-capacity',
        label: 'Efficiently utilize all resource capacity: ',
        description:
          'All your delivery drivers and vehicles have limited capacities. Rise above these constraints to optimally utilize all available capacity and direct maximum pickups and deliveries using them.',
      },
      {
        id: 'send-and-receive-timely-notifications',
        label: 'Send and receive timely notifications: ',
        description:
          'Automatically send notifications to customers informing them on their impending order pickup, ETA changes, or any other notifications. You can even configure notifications to be sent based on geofencing, time or distance.',
      },
    ]
  },
  {
    id: 'superior-customer-experience-with-automated-pick-up-scheduling',
    image: superiorCustomer,
    imagePosition:'left',
    title:
      'Superior Customer Experience with Automated Pick-Up Scheduling',
    description:
      'Integrate with your Order Management Systems allowing customers to schedule returns at their convenience, and automatically allocating delivery drivers for pickup.',
    features: [
      {
        id: 'club-multiple-customer-orders',
        label: 'Club multiple customer orders: ',
        description:
          'Improve your operations efficiency and customer experience by clubbing multiple orders from the same customer or same location in a single pickup by auto-allocating these orders to a single trip.',
      },
      {
        id: 'custom-pickup-window',
        label: 'Custom pickup window: ',
        description:
          'Allow customers to choose a pickup window based on their convenience by automatically displaying availability considering customer location, current orders and local traffic conditions analysis.',
      },
      {
        id: 'real-time-notification-and-tracking',
        label: 'Real time notification and Tracking: ',
        description:
          'Provide timely notifications to your customers informing them of impending pickup, ETA, etc, and also a real time tracking link to know delivery driver location in real-time.',
      },
    ],
  },
]


export default productReverseInformation
