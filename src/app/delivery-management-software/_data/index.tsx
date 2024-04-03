import deliveryManagementSoftwareScreen from '/public/delivery-management-software/delivery-management-software-screen.webp'
import deliverytTackingSoftwareManagement from '/public/delivery-management-software/delivery-tracking-software-management.webp'

const deliveryManagementSoftwareInformation = [
  {
    id: 'delivery-management-software-screen',
    image: deliveryManagementSoftwareScreen,
    imagePosition: 'left',
    title:
      'Streamline delivery management for multiple business opportunities',
    description:
      `Keep the dispatchers, drivers and customers in sync with each other in real-time using delivery software 
      across various industries. Focus on better planning and strategizing while the efficiency in delivery management is taken care of.`,
    features: [
      {
        id: 'manage-all-your-deliveries-at-one place',
        label: 'Manage all your deliveries at one place: ',
        description:
          'Get a bird’s eye view of every delivery while conveniently tracking and managing them on a single screen.',
      },
      {
        id: 'increase-average-deliveries-per-driver',
        label: 'Increase average deliveries per driver: ',
        description:
          'Optimize smartly to deliver more with limited resources to grow customer retention exponentially.',
      },
    ],
  },
  {
    id: 'delivery-tracking-software-management',
    image: deliverytTackingSoftwareManagement,
    imagePosition:'right',
    title:
      'Elevate customer experience with LogiNext’s all-in-one delivery software',
    description:
      `With optimization and convenience at its core, LogiNext’s delivery software ensures that 
        businesses find ease meeting their customer expectations. Plethora of features available 
        in the software helps you scale seamlessly and work on getting better.`,
    features: [
      {
        id: 'take-control-of-your-deliveries',
        label: 'Take control of your deliveries: ',
        description:
          `Enhance overall efficiency, leverage real-time delivery tracking and seamless coordination 
          of deliveries with end-to-end transparency.`,
      },
      {
        id: 'offer-an-engaging-delivery-experience',
        label: 'Offer an engaging delivery experience: ',
        description:
          'Deliver more than just products with a reliable delivery software that helps you analyze delivery patterns and prioritize customer expectations.',
      },
    ],
  },

]

export default deliveryManagementSoftwareInformation
