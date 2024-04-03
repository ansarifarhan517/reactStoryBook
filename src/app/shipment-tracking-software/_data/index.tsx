
import liveScreenShipmentLocations from '/public/shipment-tracking-software/live-screen-shipment-locations.webp'
import liveScreenShipmentMovementLocation from '/public/shipment-tracking-software/live-screen-shipment-movement-location.webp'

const shipmentTrackingSoftwareInformation = [
  {
    id: 'live-screen-shipment-locations',
    image: liveScreenShipmentLocations,
    imagePosition: 'left',
    title:
      'Enhance shipper experience with the power of analytics',
    description:
      `Boost order volumes and timely deliveries with automation, analytics and 
      artificial intelligence embedded in a suitable shipment tracking software.`,
    features: [
      {
        id: 'capture-every-moment-of-your-delivery',
        label: 'Capture every moment of your delivery: ',
        description:
          `Visualize data through an interactive dashboard to understand the on-road 
           movement of every shipment.`,
      },
      {
        id: 'make-better-decisions-with-advanced-analytics',
        label: 'Make better decisions with advanced analytics: ',
        description:
          'Optimize routes, automate shipments and make timely deliveries based on analytics for past shipments.',
      },
    ],
  },
  {
    id: 'live-screen-shipment-movement-location',
    image: liveScreenShipmentMovementLocation,
    imagePosition:'right',
    title:
      'Address various shipment issues with LogiNext before they affect the customer',
    description:
      `LogiNext offers a reliable shipment tracking software that offers easy shipment tracking 
      and allows you to fix the blocker issues related to on-road movement. Learn from 
      LogiNext’s shipment stats and overall visibility for smoother deliveries.`,
    features: [
      {
        id: 'take-complete-control-of-your-deliveries',
        label: 'Take complete control of your deliveries: ',
        description:
          'Simplify incident management for your logistics management with a single source of truth for shipments.',
      },
      {
        id: 'offer-real-time-visibility-with-automated-notifications',
        label: 'Offer real-time visibility with automated notifications: ',
        description:
          'Give an in-depth clarity to your customers with timely alerts, notifications, SMS and more.',
      },
    ],
  },

]

export default shipmentTrackingSoftwareInformation
