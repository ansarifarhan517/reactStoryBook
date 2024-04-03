
import carrierManagementScreen from '/public/carrier-management-software/carrier-management-screen.webp'
import carrierDashboardDeliveryManagement from '/public/carrier-management-software/carrier-dashboard-delivery-management.webp'

const carrierManagementSoftwareInformation = [
  {
    id: 'carrier-management-screen',
    image: carrierManagementScreen,
    imagePosition: 'left',
    title:
      'Handle last mile delivery demand efficiently with carrier management software',
    description:
      'LogiNext’s Carrier management solution helps dispatchers centralize and automate their delivery processes with ease.',
    features: [
      {
        id: 'auto-allocation-with-driver-skillset',
        label: 'Auto allocation with driver skillset: ',
        description:
          'No manual intervention. Assign orders to carriers based on geolocation, and skillset to ensure on-time deliveries.',
      },
      {
        id: 'lower-delivery-costs',
        label: 'Lower delivery costs: ',
        description:
          'Introducing rate charts so that dispatchers can set allocation priorities for carriers which helps save money and control delivery costs.',
      },
      {
        id: 'package-tracking-with-notifications',
        label: 'Package tracking with notifications: ',
        description:
          'Our carrier management software provides real-time tracking updates and custom notifications to dispatchers and your customers.',
      },
    ],
  },
  {
    id: 'carrier-dashboard-delivery-management',
    image: carrierDashboardDeliveryManagement,
    imagePosition:'right',
    title:
      'Optimize logistics excellence with carrier management software',
    description:
      'Optimize logistics excellence, enhance visibility, and drive operational efficiency with greater insights into carrier performance.',
    features: [
      {
        id: 'real-time-visibility',
        label: 'Real-time visibility: ',
        description:
          'Utilize the real-time tracking capabilities of our carrier management software to gain full visibility into the location and status of each vehicle in your fleet.',
      },
      {
        id: 'route-optimization-algorithms',
        label: 'Route optimization algorithms: ',
        description:
          'Implementing advanced routing algorithms ensures your carriers take the most effective route for every delivery.',
      },
      {
        id: 'scalability-for-business-growth',
        label: 'Scalability for business growth: ',
        description:
          'Grow your logistics business confidently with our scalable solution that offers flexibility to expand and customize features as your business grows.',
      },
    ],
  },

]

export default carrierManagementSoftwareInformation
