import { carouselItem } from '@/components/feature-carousel/types'

const carouselItems: carouselItem[] = [
  {
    id: 'service-area_geofencing_fleet_customer',
    features: [
      {
        iconName: 'serviceability-apis',
        title: 'Serviceability APIs (Service Area Profiles)',
        description:
          'Configure pin code based serviceability rules for dynamic order scheduling.',
      },
      {
        iconName: 'geofencing',
        title: 'Geofencing',
        description:
          'Track performance of your fleet in terms of successful fulfillment, on-time deliveries etc.',
      },
      {
        iconName: 'fleet-performance-monitoring',
        title: 'Fleet Performance Monitoring',
        description:
          'Track performance of your fleet in terms of successful fulfillment, on-time deliveries etc.',
      },
      {
        iconName: 'customer-segmentation',
        title: 'Customer Segmentation',
        description:
          'Create multiple customer segments and map hubs based on pickup location.',
      },
    ],
  },
  {
    id: 'zone_eta_control-tower_live-tracking',
    features: [
      {
        iconName: 'zone-mapping',
        title: 'Zone & Tier Mapping',
        description:
          'Tag customer segments to zones on the basis of pickup location, Configuring costing of a service by mapping tiers to service area profiles.',
      },
      {
        iconName: 'smart-eta',
        title: 'Smart ETA™',
        description:
          'Factor in time of wait time, transit location holidays, route conditions to show a precise delivery time to the end customer at the time of placing an order.',
      },
      {
        iconName: 'control-tower',
        title: 'Control Tower',
        description:
          'Dashboard view of key critical KPIs like real-time status update on all orders, in-transit delayed orders and the reason for not delivered or missed orders.',
      },
      {
        iconName: 'live-tracking',
        title: 'Live Tracking™',
        description:
          ' Track the status updates on orders, drivers & trips on a single map in real-time along with auto allocation of orders and controlling routes and drivers in real time.',
      },
    ],
  },
  // Add more items as needed
]

const featureTag = {
  title: `From Your Warehouse to the Customer's Door,
           LogiNext has You Covered`,
  description: `Next or same day delivery, on-time, with effective last mile delivery optimization, 
                this is the prime need for the CEP industry. Improve your customer delivery experience 
               with automated allocation of all parcels to the right courier with fast dispatch, 
                delivery route optimization considering live traffic analysis, customer preferred time windows and secure delivery validation.  , and end-customers.`,
}

export { carouselItems, featureTag }
