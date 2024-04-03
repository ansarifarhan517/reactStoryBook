import { carouselItem } from '@/components/feature-carousel/types'

const carouselItems: carouselItem[] = [
  {
    id: 'trip-planning_order_eta_driver',
    features: [
      {
        iconName: 'delivery-trip-planning',
        title: 'Delivery Trip Planning',
        description:
          'Get the best trip plans and delivery runs sheets (DRS) according to your configuration on an algorithm trained over billions of location data points.',
      },
      {
        iconName: 'order-auto-allocation',
        title: 'Order Auto Allocation',
        description:
          'Factor in variables like time of food preparation or loading/unloading time and show precise delivery time to the end customer at the time of placing an order.',
      },
      {
        iconName: 'smart-eta',
        title: 'Smart ETA™',
        description:
          'Factor in variables like time of food preparation or loading/unloading time and show precise delivery time to the end customer at the time of placing an order.',
      },
      {
        iconName: 'gamified-delivery-driver-management',
        title: 'Gamified Delivery Driver Management',
        description:
          'Turn drivers into entrepreneurs with a gamified leaderboard on the driver app to improve delivery driver efficiency.',
      },
    ],
  },
  {
    id: 'route_tracking-link_carrier_access-management',
    features: [
      {
        iconName: 'loginext-smart-route',
        title: 'LogiNext Smart Route™',
        description:
          'Get the power of the best route planning software to power your delivery management.',
      },
      {
        iconName: 'order-tracking-links',
        title: 'Order Tracking Links',
        description:
          'Trigger delivery time communication links to the end customer in your custom branding.',
      },
      {
        iconName: 'third-party-carrier-integration',
        title: '3rd Party Carrier Integration',
        description:
          'Integrate 3rd party delivery riders and carriers at a click of a button with our exhaustive integrations marketplace.',
      },
      {
        iconName: 'user-role-and-access-management',
        title: 'User Role & Access Management',
        description:
          'Configure the features and modules a user can access in the account.',
      },
    ],
  },
  // Add more items as needed
]

const featureTag = {
  title: 'Last Mile Solutions for the Age of Quick Commerce',
  description: `Digital natives have revolutionized the commerce landscape and the speed of delivery has been shrinking every year. 
                Get the edge over competition with the best last mile delivery software that is equipped with the latest features.`,
}

export { carouselItems, featureTag }
