
import supplyChainVisibilityScreen from '/public/supply-chain-visibility/supply-chain-visibility-screen.webp'
import supplyChainVisibilityDashboardManagement from '/public/supply-chain-visibility/supply-chain-visibility-dashboard-management.webp'

const dispatchSoftwareInformation = [
  {
    id: 'supply-chain-visibility-screen',
    image: supplyChainVisibilityScreen,
    imagePosition: 'left',
    title:
      'Make proactive decisions for various supply chain operations',
    description:
      `Monitor the necessary factors related to demand, supply, order fulfillment,
      and production across the supply chain to make proactive decisions for the future. 
      Focus on better end-to-end services, reducing disruptions, and minimizing costs.`,
    features: [
      {
        id: 'simplify-supply-chain-complexities',
        label: 'Simplify supply chain complexities: ',
        description:
          `Integrate operations and analytics capabilities to optimize and 
            automate supply chain complexities.`,
      },
      {
        id: 'develop-resilient-supply-chain-planning',
        label: 'Develop resilient supply chain planning: ',
        description:
          `Utilize the real-time data analysis to understand various loopholes in 
          your supply chain planning and fix them.`,
      },
    ],
  },
  {
    id: 'supply-chain-visibility-dashboard-management',
    image: supplyChainVisibilityDashboardManagement,
    imagePosition:'right',
    title:
      'Offer memorable customer experience in the ever-changing supply chain world',
    description:
      `Be the one to deliver on-time, on budget, without any damage and with access to load status 
      throughout the journey while ensuring end-to-end supply chain visibility. Understand what 
      can be done better by talking to your customers and use the supply chain management software features to implement it.`,
    features: [
      {
        id: 'reduce-operational-costs-significantly',
        label: 'Reduce operational costs significantly: ',
        description:
          `Lesser number of errors, calculated expenditures and timely end-to-end deliveries 
          helps in saving operational costs.`,
      },
      {
        id: 'deliver-superior-customer-experience',
        label: 'Deliver superior customer experience: ',
        description:
          `Give a reason to your customers to choose your business for every shipment and relax without 
          worrying about the timely delivery.`,
      },
    ],
  },

]

export default dispatchSoftwareInformation
