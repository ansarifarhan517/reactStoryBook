/* eslint-disable max-len */


import logisticsManagementSoftwareScreen from '/public/logistics-management-software/logistics-management-software-screen.webp'
import logisticsTrackingSoftwareManagement from '/public/logistics-management-software/logistics-tracking-software-management.webp'

const logisticsManagementSystemInformation = [
  {
    id: 'logistics-management-software-screen',
    image: logisticsManagementSoftwareScreen,
    imagePosition: 'left',
    title:
      'Future-proof your logistics operations and boost customer satisfaction for every delivery',
    description:
      `A suitable logistics management software offers all the features to keep up with the latest 
      logistics and technology trends. Simplify critical processes, maximize order fulfillment and 
      always keep a tab on your regular operations conveniently.`,
    features: [
      {
        id: 'best-solution-for-on-demand-deliveries',
        label: 'Best solution for on-demand deliveries: ',
        description:
          'With the dynamic nature of orders and delivery requirements, leveraging on-demand logistics requests has become possible.',
      },
      {
        id: 'reliable-option-for-overall-driver-behaviour-analysis',
        label: 'Reliable option for overall driver behaviour analysis: ',
        description:
          'Monitor the on road behaviour of the driver to ensure safety, timely deliveries and avoid mishaps with a crystal clear view.',
      },
    ],
  },
  {
    id: 'logistics-tracking-software-management',
    image: logisticsTrackingSoftwareManagement,
    imagePosition:'right',
    title:
      'Focus on logistics operational priorities and seamless alignment to business objectives with LogiNext',
    description:
      `Meet the customer expectations of faster, reliable and safe deliveries without worrying about factors 
      like cost, fleet, delivery location and more. LogiNext’s full-fledged logistics management software 
      offers a one stop solution for all your logistics problems.`,
    features: [
      {
        id: 'capacity-utilization-with-fleet-planning',
        label: 'Capacity utilization with fleet planning: ',
        description:
          'Maximize the overall utilization of the fleet’s capacity with calculated load balancing.',
      },
      {
        id: 'pickup-and-delivery-optimization',
        label: 'Pickup and delivery optimization: ',
        description:
          'Conveniently automate the allocation and dispatch of all pickups and drops for the required deliveries.',
      },
    ],
  },

]

export default logisticsManagementSystemInformation
