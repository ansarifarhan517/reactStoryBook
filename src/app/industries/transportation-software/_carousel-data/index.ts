import { carouselItem } from '@/components/feature-carousel/types'

const carouselItems: carouselItem[] = [
  {
    id: 'real-time_3d-packing_geofencing_fleet',
    features: [
      {
        iconName: 'real-time-live-tracking',
        title: 'Real Time Live Tracking',
        description:
          'Live Screen is the single pane view for all logistical operations with real time visibility.',
      },
      {
        iconName: 'three-d-packing-optimization',
        title: '3D Packing Optimization',
        description:
          'Set location based alerts and notifications to notify operation managers and end customers.',
      },
      {
        iconName: 'geofencing',
        title: 'Geofencing',
        description:
          'Set location based alerts and notifications to notify operation managers and end customers.',
      },
      {
        iconName: 'fleet-performance-monitoring',
        title: 'Fleet Performance Monitoring',
        description:
          'Track performance of your fleet in terms of successful fulfillment, on-time deliveries etc.',
      },
    ],
  },
  {
    id: 'capacity_decrease_carrier_customer',
    features: [
      {
        iconName: 'capacity-utilization',
        title: 'Capacity Utilization',
        description:
          'Increase vehicle capacity utilization by optimizing order management.',
      },
      {
        iconName: 'decrease-loading-unloading-time',
        title: 'Decrease Loading/Unloading Time',
        description:
          'Better visibility and configurables rules allows for efficient operations.',
      },
      {
        iconName: 'carrier-management',
        title: 'Carrier Management',
        description:
          'Onboard carriers with different rate profiles on LogiNext’s comprehensive platform to streamline logistics automation processes.',
      },
      {
        iconName: 'customer-invoicing',
        title: 'Customer Invoicing',
        description:
          'Manage contracts and invoicing of carriers on the digital platform reducing the chances of human error.',
      },
    ],
  },
]

const featureTag = {
  title: 'From Your Warehouse to the Customer\'s Door, LogiNext Optimizes You All the Way',
  description: `Efficient routing solutions coupled with an interactive shipment tracking platform makes 
                LogiNext Mile TM the go-to product for all transport related logistics. 
                Our last mile delivery solutions have effectively reset standards in transportation.`,
}

export { carouselItems, featureTag }
