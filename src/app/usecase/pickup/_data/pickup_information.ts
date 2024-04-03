import sendProductsToDistributionCenter from '/public/use-case/pickup/send-products-to-distribution-center.webp'
import scheduledPickups from '/public/use-case/pickup/scheduled-pickups.webp'
import pickupDocumentsFromCustomers from '/public/use-case/pickup/pickup-documents-from-customers.webp'

const useCasePickup = [{
  id: 'send-products-to-distribution-center',
  image: sendProductsToDistributionCenter,
  imagePosition: 'right',
  title: 'Send Products to Distribution Center',
  description: 'Easily ship your finished products from factory to your distribution center with the best 3PL software.',
  features: [
    {
      id: 'easy-order-scanning',
      label: 'Easy Order Scanning: ',
      description:'Reduce manual labor, accurately inscan and outscan orders that reflects on the digital dashboard.',
    },
    {
      id: 'awb-label-and-manifest-configuration',
      label: 'AWB Label and Manifest Configuration: ',
      description:'AWB Label and manifest template configuration, show the information the way the operation demands.',
    },
    {
      id: '3d-packing-optimization',
      label: '3D Packing Optimization: ',
      description:'Optimally load vehicles to optimize capacity utilization.',
    },
  ]
},{
  id: 'scheduled-pickups',
  image: scheduledPickups,
  imagePosition: 'left',
  title: 'Scheduled Pickups',
  description: 'Plan and pickup return orders from customers.',
  features: [
    {
      id: 'logiNext-return',
      label: 'LogiNext Return™: ',
      description:'Setup processes at the click of a button to efficiently collect returns from a customers home.',
    },
    {
      id: 'driver-skill-sets',
      label: 'Driver Skill Sets: ',
      description:'Collect big & bulky items, temperature sensitive goods, etc. by mapping driver skill set.',
    },
    {
      id: 'smart-eta',
      label: 'Smart ETA™: ',
      description: 'Accurate ETA communication for everyone involved for end to end visibility and better customer experience.',
    },
  ]
},{
  id: 'pickup-documents-from-customers',
  image: pickupDocumentsFromCustomers,
  imagePosition: 'right',
  title: 'Pickup Documents from Customers',
  description: 'Schedule pickup of customer identification documents or banking instruments from customer to deliver to your branch.',
  features: [
    {
      id: 'simplified-order-scanning',
      label: 'Simplified Order Scanning: ',
      description:'Reduce manual labor, accurately inscan and outscan orders that reflects on the digital dashboard.',
    },
    {
      id: 'delivery-driver-management',
      label: 'Delivery Driver Management: ',
      description:'An easy to use Driver\'s App lets you have complete visibility over vehicle movement.',
    },
    {
      id: 'tracking-links',
      label: 'Tracking Links: ',
      description:'Trigger delivery time communication links to the end customer in your custom branding.',
    },
  ]
}]

export default useCasePickup
