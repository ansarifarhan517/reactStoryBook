
import fleetTruckManagementScreen from '/public/trucking-management-software/fleet-truck-management-screen.webp'
import fleetTruckTrackingDashboardManagement from '/public/trucking-management-software/fleet-truck-tracking-dashboard-management.webp'

const truckingManagementSoftwareInformation = [
  {
    id: 'fleet-truck-management-screen',
    image: fleetTruckManagementScreen,
    imagePosition: 'left',
    title:
      'A robust trucking management system for daily operations',
    description:
      `LogiNext’s trucking management software is designed to revolutionize your daily operations.
      From efficient fleet tracking to customized reports and analytics, our solution will empower your business for streamlined logistics and unparalleled efficiency.`,
    features: [
      {
        id: 'optimize-delivery-times-with-fleet-tracking',
        label: 'Optimize delivery times with fleet tracking: ',
        description:
          `With real-time tracking of your entire fleet, you get a comprehensive view of your entire operation.
          This feature aids in efficient route planning and on-the-fly adjustments, resulting in optimized delivery times.`,
      },
      {
        id: 'managing-fleet-operations-at-maximum-efficiency',
        label: 'Managing fleet operations at maximum efficiency: ',
        description:
          `Our software helps with planning, scheduling, and routing to ensure the fleet operates at peak efficiency, 
          minimizing downtime and enhancing overall productivity.`,
      },
      {
        id: 'data-driven-decision-making',
        label: 'Data-driven decision-making: ',
        description:
          `With the help of our trucking solution, your operation managers can easily identify trends,
          assess driver performance, and continuously optimize daily operations for better overall efficiency.`,
      },
    ],
  },
  {
    id: 'fleet-truck-tracking-dashboard-management',
    image: fleetTruckTrackingDashboardManagement,
    imagePosition:'right',
    title:
      'Handle entire fleet operations with trucking management software',
    description:
      `Downtimes are dreadful! Our configurable solution ensures you stay connected with your 
      entire trucking fleet operation by managing all of your fleet data on a single screen.`,
    features: [
      {
        id: 'centralized-fleet-tracking',
        label: 'Centralized fleet tracking: ',
        description:
          'Our trucking management software provides real-time fleet tracking, offering a centralized platform to monitor the entire fleet\'s location with a bird-eye view.',
      },
      {
        id: 'comprehensive-route-and-load-management',
        label: 'Comprehensive route and load management: ',
        description:
          `Our software empowers you to maximize delivery schedules with intelligent route planning.
          We maximize fleet capacity utilization, reduce empty miles, and ensure efficient use of your fleet resources.`,
      },
      {
        id: 'power-analytics-and-reporting',
        label: 'Power analytics and reporting: ',
        description:
          `Gain insights about driver performance, fleet usage, and other key parameters to continuously refine operations 
          for optimal results and improved business outcomes.`,
      },
    ],
  },

]

export default truckingManagementSoftwareInformation
