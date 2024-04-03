import foodOrderManagementScreen from '/public/food-delivery-software/food-order-management-screen.webp'
import foodDeliveryMapOrderManagement from '/public/food-delivery-software/food-delivery-map-order-management.webp'

const foodDeliverySoftwareInformation = [
  {
    id: 'food-order-management-screen',
    image: foodOrderManagementScreen,
    imagePosition: 'left',
    title:
      'Prioritize timely updates with for every order with an advanced food delivery system',
    description:
      `Every minute is crucial in the food delivery business and every update is essential to 
      develop a feeling of trust with the customers.`,
    features: [
      {
        id: 'dynamic-ETA-prediction',
        label: 'Dynamic ETA prediction: ',
        description:
          'With accurate ETA prediction, let your customers know that their food is on the way.',
      },
      {
        id: 'instant-delivery-updates',
        label: 'Instant delivery updates: ',
        description:
          'No matter what is the order status, keep the customers informed in case of any update in the order delivery time or unusual situation.',
      },
    ],
  },
  {
    id: 'food-delivery-map-order-management',
    image: foodDeliveryMapOrderManagement,
    imagePosition:'right',
    title:
      'Deliver a satisfactory customer experience with a promising food delivery system',
    description:
      `A feature-rich food delivery system will allow you to keep your customers informed and 
      satisfied throughout the delivery process. With LogiNext, deliver what your customers crave for.`,
    features: [
      {
        id: 'offer-instant-update-about-every-order-status',
        label: 'Offer Instant update about every order status: ',
        description:
          'Stay in touch with your customers with the live chat feature to keep them updated about their order status.',
      },
      {
        id: 'deliver-in-time-with-the-fastest-routes',
        label: 'Deliver in-time with the fastest routes: ',
        description:
          'Make every delivery possible without taking longer routes for multiple deliveries. With the route optimization feature, save fuel and deliver faster.',
      },
    ],
  },

]

export default foodDeliverySoftwareInformation
