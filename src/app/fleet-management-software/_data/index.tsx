/* eslint-disable max-len */

import fleetTrackingScreen from '/public/fleet-management-software/fleet-tracking-logiNext-screen.webp'
import routePlanningScreen from '/public/fleet-management-software/route-planning-logiNext-screen.webp'


const fleetManagementSoftwareInformation = [
  {
    id: 'fleet-tracking',
    image: fleetTrackingScreen,
    imagePosition: 'left',
    title:
      'One-stop solution for all your fleet management needs',
    description:
      `Simplify your end-to-end fleet visibility including multiple operations throughout 
      the delivery lifecycle across multiple locations.`,
    features: [
      {
        id: 'driver-shortage',
        label: 'Solve the problem of driver shortage: ',
        description:
          `Make the most of integration with third party carriers and choose the most 
          suitable drivers for your delivery operations conveniently.`,
      },
      {
        id: 'fleet-management',
        label: 'Make the most of AI and ML for fleet management: ',
        description:
          `Gather actionable insights and make necessary decisions to optimize your 
            fleet operations with artificial intelligence.`,
      },
      {
        id: 'timely-manintenance-repairs',
        label: 'Focus on timely maintenance and repairs:',
        description:
          `Utilize the fleet data wisely to maintain regular vehicle servicing and timely delivery 
          without vehicle breakdowns.`,
      },
    ],
  },
  {
    id: 'route-planning-Screen',
    image: routePlanningScreen,
    imagePosition:'right',
    title:
      'Get started with LogiNext’s fleet management software for numerous benefits',
    description:
      `Investing in a suitable fleet management software can help in achieving exponential growth and 
      better customer retention. While LogiNext takes care of the tough part of daily operations, 
      you can focus on business growth while enjoying the top benefits.`,
    features: [
      {
        id: 'cost-efficiency',
        label: 'Cost efficiency: ',
        description:
          `Spend only what’s required by making better decisions to avoid unplanned routes and 
          unnecessary fuel consumption.`,
      },
      {
        id: 'minimized-communication',
        label: 'Minimized communication: ',
        description:
          `Stay updated with timely alerts and notifications to significantly reduce the 
          communication and follow ups with the drivers.`,
      },
      {
        id: 'customer-satisfaction',
        label: 'Customer satisfaction: ',
        description:
          `Offer deliveries across various geographical locations within 
          promised time to make your customers happy.`,
      },
    ],
  },

]

export default fleetManagementSoftwareInformation
