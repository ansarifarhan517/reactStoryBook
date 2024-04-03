import { carouselItem } from '@/components/feature-carousel/types'

const carouselItems: carouselItem[] = [
  {
    id: 'geofencing_easy-order_automate_analytics',
    features: [
      {
        iconName: 'geofencing',
        title: 'Geofencing',
        description:
          'Set location based alerts and notifications to notify operation managers and end customers.',
      },
      {
        iconName: 'easy-order-scanning',
        title: 'Easy Order Scanning',
        description:
          'Reduce manual labor and accurately inscan and outscan orders including single scan for bulk orders.',
      },
      {
        iconName: 'automate-customer-invoicing',
        title: 'Automate Customer Invoicing',
        description:
          'Eliminate the hassle of manually accounting for extra distance traveled or extra trips made; let the LogiNext Pay™ module take care of all the invoicing related requirements.',
      },
      {
        iconName: 'analytics-insights',
        title: 'Analytics & Insights',
        description:
          'Comprehensive KPI reports with actionable insights on a single screen.',
      },
    ],
  },
  {
    id: 'order_intuitive-digital_order_resource',
    features: [
      {
        iconName: 'order-tracking-links',
        title: 'Order Tracking Links',
        description:
          'Trigger delivery time communication links to the end customer in your custom branding.',
      },
      {
        iconName: 'intuitive-digital-cx',
        title: 'Intuitive Digital CX',
        description:
          'Deliver a clean and simple user experience with precise ETA communication and contextual alerts and notifications.',
      },
      {
        iconName: 'order-analytics1',
        title: 'Order Analytics',
        description:
          'Analyze the order level on time vs delayed performance; analyze the pattern of delivered, not delivered, missed and canceled orders.',
      },
      {
        iconName: 'resource-analytics',
        title: 'Resource Analytics',
        description:
          'Analyze the real-time and historical performance efficiency & utilization of drivers or fleet.',
      },
    ],
  },
  {
    id: 'live-tracking_capacity_reverse_end',
    features: [
      {
        iconName: 'live-tracking',
        title: 'Live Tracking™',
        description:
          'Live Screen is the single pane view for all logistical operations with real time visibility.',
      },
      {
        iconName: 'capacity-utilization',
        title: 'Capacity Utilization',
        description:
          'Automatically allocate reverse delivery orders to be picked from stores and warehouses during the time of delivery of goods from distribution centers.',
      },
      {
        iconName: 'reverse-logistics',
        title: 'Reverse logistics',
        description:
          'Automatically allocate reverse delivery orders to be picked from stores and warehouses during the time of delivery of goods from distribution centers.',
      },
      {
        iconName: 'end-to-end-visibility',
        title: 'End to End Visibility',
        description:
          'Keep a track over the entire delivery operations on a single dashboard and take action at the click of a button.',
      },
    ],
  },
  // Add more items as needed
]

const featureTag = {
  title: 'Effective Last Mile Delivery Optimization for On-Time Deliveries',
  description: `LogiNext Mile has changed how the CPG industry handles last mile deliveries. Complete control over the live movement of all shipments
                with automated allocation to the right drivers, optimized vehicle capacities and high fleet utilization means that you do more with fewer resources, with high profitability.`,
}

export { carouselItems, featureTag }
