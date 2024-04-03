import { carouselItem } from '@/components/feature-carousel/types'

const carouselItems: carouselItem[] = [
  {
    id: 'visual-territory_delivery-schedule_driver_delivery-trip',
    features: [
      {
        iconName: 'visual-territory-mapping',
        title: 'Visual Territory Mapping (Geocoding)',
        description:
          'Visualize all your territories in an attractive clustered view, clearly defining geocoded areas shown directly or in a heat map.',
      },
      {
        iconName: 'large-home-slider-courier4',
        title: 'Delivery Schedule Planning',
        description:
          'Manage all delivery movements with intelligent schedule planning and effective order allocation.',
      },
      {
        iconName: 'driver-chat',
        title: 'Driver Chat',
        description:
          'Let your customers chat with drivers for the best contactless delivery experience',
      },
      {
        iconName: 'delivery-trip-planning',
        title: 'Delivery Trip Planning',
        description:
          'Get the best trip plans and delivery runs sheets (DRS) according to your configuration on an algorithm trained over billions of location data points.',
      },
    ],
  },
  {
    id: 'automate_easy-carrier_bopis_loginext',
    features: [
      {
        iconName: 'automate-pickup-and-deliveries',
        title: 'Automate Pickup & Deliveries',
        description:
          'Be it picking up goods from the warehouse or last mile deliveries to customers’ homes, plan and automate using the best logistics management software.',
      },
      {
        iconName: 'easy-carrier-management',
        title: 'Easy Carrier Management',
        description:
          'Buy Online, Pickup In Store is a major trend the world over, give your customers the flexibility by automating this on LogiNext’s platform.',
      },
      {
        iconName: 'bopis-enablement',
        title: 'BOPIS Enablement',
        description:
          'Buy Online, Pickup In Store is a major trend the world over, give your customers the flexibility by automating this on LogiNext’s platform.',
      },
      {
        iconName: 'loginext-smart-route',
        title: 'LogiNext Smart Route™',
        description:
          'Get the power of the best route planning software to boost your delivery management.',
      },
    ],
  },
  // Add more items as needed
]

const featureTag = {
  title: 'Get from Warehouse to Customer in a Quick and Efficient Way',
  description: `For retail and e-commerce, everything revolves around the logistics & supply chain visibility, omnichannel experience, 
                customer retention and more which can only be achieved with strong logistics automation. LogiNext equips you with an array of 
                comprehensive cloud-based solutions enabling dynamic route planning, delivery scheduling and live order tracking, end-to-end delivery movement visibility.`,
}

export { carouselItems, featureTag }
