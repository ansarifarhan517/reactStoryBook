/* eslint-disable max-len */


import dispatchedGoodsDeliveryTruck from '/public/dispatch-software/dispatched-goods-delivery-truck.webp'
import dispatchingOrderDelivery from '/public/dispatch-software/dispatching-order-delivery.webp'

const dispatchSoftwareInformation = [
  {
    id: 'dispatched-goods-delivery-truck',
    image: dispatchedGoodsDeliveryTruck,
    imagePosition: 'left',
    title:
      'Transform the way your delivery operations take place with a single platform',
    description:
      `Witness significant improvements in response time and on-ground actions for all
      the operations with the ideal dispatch software. Stay informed about every single delivery taking place and maintain a clear focus on operational activities.`,
    features: [
      {
        id: 'streamline-your-dispatch-planning',
        label: 'Streamline your dispatch planning: ',
        description:
          `Utilizing the power of algorithms in better planning for each of the 1000s of deliveries
           across fleet types and various locations.`,
      },
      {
        id: 'track-and-trace-conveniently',
        label: 'Track and trace conveniently: ',
        description:
          'Stay informed, act, analyze and plan for better customer service and efficient deliveries for cost efficiency.',
      },
    ],
  },
  {
    id: 'dispatching-order-delivery',
    image: dispatchingOrderDelivery,
    imagePosition:'right',
    title:
      'Optimize your last-mile deliveries smoothly with LogiNext’s dispatch software',
    description:
      `LogiNext helps you get a bird's eye view into deliveries, allocate resources effectively 
        and scale efficiently. With the web as well as mobile-interface, you can make the most of countless features offered for speedy deliveries.`,
    features: [
      {
        id: 'analytics-and-reporting',
        label: 'Make better decisions with analytics and reporting: ',
        description:
          `Get in-depth and timely reports about various activities that include fleet movement, 
            driver’s behaviour, routes taken and more.`,
      },
      {
        id: 'prioritize-smart-carrier-planning-and-optimization',
        label: 'Prioritize smart carrier planning and optimization: ',
        description:
          'Utilize your resources smartly for faster and timely deliveries with the help of machine learning to ensure better vehicle optimization.',
      },
    ],
  },

]

export default dispatchSoftwareInformation
