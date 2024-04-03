/* eslint-disable max-len */

import driverAppOrderList from '/public/products/driver-app/driver-app-order-list.webp'
import driverApp from '/public/products/driver-app/driver-app.webp'

const productHaulInformation = [
  {
    id: 'driver-app-order-list',
    image: driverAppOrderList,
    imagePosition: 'right',
    title: '',
    description: '',
    features: [
      {
        id: 'real-time-tracking-system',
        label: 'Real time tracking system: ',
        description: 'Get an overview of all vehicle movement on a single screen and take necessary action at the click of a button.',
      },
      {
        id: 'order-list-and-status',
        label: 'Order list and status: ',
        description: 'Generate delivery run sheets (DRS) for pickups and delivery with the best route optimization software to ensure efficient operations.',
      },
      {
        id: 'delivery-proof',
        label: 'Delivery proof: ',
        description: 'Once the parcel or the courier is handed over to the customer, a delivery proof will ensure the completion of the task.',
      },
      {
        id: 'bulk-pickup-and-deliveries',
        label: 'Bulk pickup and deliveries: ',
        description: 'Getting a custom delivery done at the same place? Bulk pickup (multiple items) and deliveries can be convenient for the driver to deliver the product with just a single sign from the warehouse manager or the place of delivery.',
      },
      {
        id: 'order-transfer',
        label: 'Order transfer: ',
        description: 'Be it for vehicular breakdown or location-based deliveries, an order transfer will help the driver transfer goods to a nearby driver to ensure efficient deliveries, in case of emergencies.',
      },
      {
        id: 'online-offline-status',
        label: 'Online/ offline status: ',
        description: 'Getting to know when your driver is available would be of importance to help schedule your deliveries accordingly.',
      },
    ]
  },
  {
    id: 'driver-app',
    image: driverApp,
    imagePosition: 'left',
    title: '',
    description: '',
    features: [
      {
        id: 'hotspots',
        label: 'Hotspots: ',
        description: 'Get the maximum number of orders delivered from your limited resources by assigning drivers to areas where demand is more and driver supply is less.',
      },
      {
        id: 'gamification',
        label: 'Gamification: ',
        description: 'Incentivise the drivers through a gamified leaderboard on the app which creates a healthy competition amongst drivers to deliver with the highest efficiency.',
      },
      {
        id: 'digital-scanning-of-orders',
        label: 'Digital Scanning of Orders: ',
        description: 'Giving the driver the ability to scan AWB (air waybills), crates, and other items when loading and unloading will ensure smoother and faster operations for last mile delivery.',
      },
      {
        id: 'accept-and-reject-orders',
        label: 'Accept and Reject Orders: ',
        description: 'One of the best ways a dispatcher can improve the efficiency of their carriers is by giving drivers the ability to accept and reject orders when en route.',
      },
      {
        id: 'payments',
        label: 'Payments: ',
        description: 'Integrated payments module to manage cash on delivery and credit card payments during delivery or pickup.',
      },
      {
        id: 'awb-label-printing',
        label: 'AWB Label Printing: ',
        description: 'Print AWB labels using linked printers to ensure complete tracking of pickup orders throughout their lifecycle.',
      },
    ]
  },
]

export default productHaulInformation
