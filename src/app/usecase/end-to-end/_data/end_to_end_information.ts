import postalNetworksAndCourierCompaniesRevampingOps from '/public/use-case/end-to-end/postal-networks-and-courier-companies-revamping-ops.webp'
import aComprehensiveTransportationPlanningSystemWithARoundedView from '/public/use-case/end-to-end/a-comprehensive-transportation-planning-system-with-a-rounded-view.webp'
import improveCustomerSatisfaction from '/public/use-case/end-to-end/improve-customer-satisfaction.webp'

const useCaseEndToEndDelivery = [{
  id: 'postal-networks-and-courier-companies-revamping-ops',
  image: postalNetworksAndCourierCompaniesRevampingOps,
  imagePosition: 'right',
  title: 'Postal Networks and Courier Companies Revamping Ops',
  description: 'Postal delivery services and courier companies transforming from a small packet delivery company to delivering large parcels.',
  features: [{
    id: 'open-up-new-services',
    label: 'Open Up New Services: ',
    description: 'Based on your service areas, open up same day deliveries and special services.',
  },
  {
    id: 'automate-processes',
    label: 'Automate Processes: ',
    description: 'Leverage the platform and digitally transform your operations.',
  },
  {
    id: 'detailed-reporting',
    label: 'Detailed Reporting: ',
    description: 'Generate reports and get automated emails about your chosen KPIs to track.',
  }]
}, {
  id: 'a-comprehensive-transportation-planning-system-with-a-rounded-view',
  image: aComprehensiveTransportationPlanningSystemWithARoundedView,
  imagePosition: 'left',
  title: 'A Comprehensive Transportation Planning System with a Rounded View',
  description: 'Integrate fleet, TMS, WMS and shipment data to get a single unified view of your operations.',
  features: [
    {
      id: 'live-screen',
      label: 'Live Screen: ',
      description: 'Map based view in real time of your end to end delivery operations.',
    },
    {
      id: 'alerts-and-Notifications',
      label: 'Alerts & Notifications: ',
      description: 'Get instant alerts regarding any disruption in operations.',
    },
    {
      id: 'easy-api-Integration',
      label: 'Easy API Integration: ',
      description: 'Seamless data flow between your existing systems and LogiNext through APIs.',
    }]
}, {
  id: 'improve-customer-satisfaction',
  image: improveCustomerSatisfaction,
  imagePosition: 'right',
  title: 'Improve Customer Satisfaction',
  description: 'Provide realistic ETA estimates to your customers and their end-customers even before an order is placed, factoring route conditions, branch holidays, etc.',
  features: [
    {
      id: 'loginext-pay',
      label: 'LogiNext Pay™: ',
      description: ' Handle online transaction and cash on delivery through the finance capabilities on driver app.',
    },
    {
      id: 'smart-sta',
      label: 'Smart ETA™: ',
      description: 'Factor in hundreds of variables and show precise delivery time to the end customer.',
    },
    {
      id: 'easy-returns',
      label: 'Easy Returns: ',
      description: 'Enable returns at the click of a button and setup your system for reverse logistics.',
    },
  ]
}]

export default useCaseEndToEndDelivery
