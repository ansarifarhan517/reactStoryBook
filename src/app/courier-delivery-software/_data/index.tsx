
import courierManagementScreen from '/public/courier-delivery-software/courier-management-screen.webp'
import courierDeliveryManagementLiveMap from '/public/courier-delivery-software/courier-delivery-management-live-map.webp'

const courierDeliverySoftwareInformation = [
  {
    id: 'courier-management-screen',
    image: courierManagementScreen,
    imagePosition: 'left',
    title:
      'Proactively determine the best way to deliver and enhance critical processes',
    description:
      `Shortage of drivers and the cost involved in hiring new ones is a real challenge 
        with increasing deliveries. An ideal solution is a courier software that offers 
        multiple affordable options without hampering the delivery time.`,
    features: [
      {
        id: 'digitized-rate-charts',
        label: 'Digitized rate charts: ',
        description:
          `Choose the most suitable carrier partner from a set of options to ensure faster deliveries
          as well as cost efficiency.`,
      },
      {
        id: 'automatic-driver-allocation',
        label: 'Automatic driver allocation: ',
        description:
          'Allocate the most suitable drivers for every courier delivery automatically with the courier software.',
      },
    ],
  },
  {
    id: 'courier-delivery-management-live-map',
    image: courierDeliveryManagementLiveMap,
    imagePosition:'right',
    title:
      'Significantly reduce courier management hassle and save costs with LogiNext',
    description:
      `With LogiNext’s user-friendly courier software,meet all the customer expectations 
      and work seamlessly to ensure that your delivery process is effective and boosts customer retention.`,
    features: [
      {
        id: 'end-to-end-courier-visibility',
        label: 'End-to-end courier visibility: ',
        description:
          'Get a bird’s eye view of the entire order lifecycle for every courier and stay updated about the status of delivery.',
      },
      {
        id: 'customer-retention-with-satisfactory-deliveries',
        label: 'Customer retention with satisfactory deliveries: ',
        description:
          'Offer a seamless experience to the customers with timely and convenient deliveries for every courier.',
      },
    ],
  },

]

export default courierDeliverySoftwareInformation
