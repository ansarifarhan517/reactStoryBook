
import liveScreenReturnOrders from '/public/reverse-logistics-software/live-screen-return-orders.webp'
import liveDashboardPreviewReverseLogistics from '/public/reverse-logistics-software/live-dashboard-preview-reverse-logistics.webp'

const reverseLogisticsSoftwareInformation = [
  {
    id: 'live-screen-return-orders',
    image: liveScreenReturnOrders,
    imagePosition: 'left',
    title:
      'Turn your return blues to greens!',
    description:
      `The use of reverse logistics software allows you to automate and 
      simplify your order return process. By streamlining order returns, 
      customers remain loyal to the brand while businesses get to improve their operational efficiency.`,
    features: [
      {
        id: 'simplified-returns-processing',
        label: 'Simplified returns processing: ',
        description:
          `Reverse logistics software simplifies returns processing by automating and centralizing the various stages 
          involved in handling returned goods. This includes generating return labels, tracking shipments, etc.`,
      },
      {
        id: 'higher-customer-retention',
        label: 'Higher customer retention: ',
        description:
          `A simplified returns process ensures that customers encounter fewer obstacles when returning products, 
          developing a positive brand image. As a result, satisfied customers are more likely to remain loyal and make repeat purchases.`,
      },
      {
        id: 'better-data-visibility',
        label: 'Better data visibility: ',
        description:
          `Get comprehensive insights into entire logistics operations, especially on order returns. 
          This level of transparency helps businesses make informed decisions, enhancing overall operational effectiveness.`,
      },
    ],
  },
  {
    id: 'live-dashboard-preview-reverse-logistics',
    image: liveDashboardPreviewReverseLogistics,
    imagePosition:'right',
    title:
      'Optimize returns and replacements for cost savings',
    description:
      `LogiNext is one of the top-rated reverse logistics software providers. 
      Our platform excels in providing a comprehensive and efficient system designed 
      to enhance every aspect of the product return process.`,
    features: [
      {
        id: 'route-planning-and-optimization',
        label: 'Route planning and optimization: ',
        description:
          `You can streamline the return journey, minimizing transportation costs and reducing 
          environmental impact. Our platform ensures that returned items are efficiently routed, 
          enhancing overall operational efficiency and resource utilization.`,
      },
      {
        id: 'automated-pickup-and-delivery',
        label: 'Automated pickup and delivery: ',
        description:
          `Say goodbye to manual complexities in reverse logistics with our automated pickup and delivery system.
          Eliminate errors associated with manual handling, providing a hassle-free experience for both dispatchers and customers.`,
      },
      {
        id: 'live-delivery-tracking-and-analysis',
        label: 'Live delivery tracking and analysis: ',
        description:
          `Transparency is key in reverse logistics. Monitor the status of returned items in real-time, gaining valuable 
          insights into the entire return journey. This not only helps customers keep informed but also helps dispatchers address potential issues.`,
      },
    ],
  },

]

export default reverseLogisticsSoftwareInformation
