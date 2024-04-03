import foodDelivery from '/public/use-case/delivery/food-delivery.webp'
import eCommerceDeliveries from '/public/use-case/delivery/e-commerce-deliveries.webp'
import storeDelivery from '/public/use-case/delivery/store-delivery.webp'

const useCaseDelivery = [{
  id: 'food-delivery',
  image: foodDelivery,
  imagePosition: 'right',
  title: 'Food Delivery',
  description: 'Enable quick deliveries for food orders to ensure your customers enjoy a hot meal.',
  features: [
    {
      id: 'loginext-auto-route',
      label: 'LogiNext Auto Route™: ',
      description:'Assign orders into trips at the click of a button according to your chosen constraints.',
    },
    {
      id: 'smart-eta',
      label: 'Smart ETA™: ',
      description:'Factor in time of food preparation and show precise delivery time to the end customer at the time of placing an order.',
    },
    {
      id: 'gamified-driver-app',
      label: 'Gamified Driver App: ',
      description:'Incentivise delivery drivers with a simple to use and gamified app to increase driver efficiency.',
    },
  ]
},{
  id: 'e-commerce-deliveries',
  image: eCommerceDeliveries,
  imagePosition: 'left',
  title: 'eCommerce Deliveries',
  description: 'Get the best fleet management software to gain competitive advantage by delivering all types of orders fast - be it big & bulky items or the smallest of the products.',
  features: [
    {
      id: 'quick-deliveries',
      label: 'Quick Deliveries: ',
      description:'Easily integrate carriers, take advantage of a hybrid fleet management solution and deliver fast.',
    },
    {
      id: 'logiNext-pay',
      label: 'LogiNext Pay™: ',
      description:'Handle online transaction and cash on delivery through the payment capabilities on driver app.',
    },
    {
      id: 'easy-returns',
      label: 'Easy Returns: ',
      description: 'Enable returns at the click of a button and setup your system for reverse logistics.',
    },
  ]
},{
  id: 'store-delivery',
  image: storeDelivery,
  imagePosition: 'right',
  title: 'Store Delivery',
  description: 'Enable timely delivery of online grocery orders to nearby pickup store locations or mailboxes.',
  features: [
    {
      id: 'live-screen',
      label: 'Live Screen: ',
      description:'Map based view in real time of your end to end delivery operations.',
    },
    {
      id: 'service-area-profiling',
      label: 'Service Area Profiling: ',
      description:'Configure geographical constraints that result into better order allocation.',
    },
    {
      id: 'driver-skill-sets',
      label: 'Driver Skill Sets: ',
      description:'Flawlessly delivery big & bulky items, temperature sensitive goods, etc. by mapping driver skill set.',
    },
  ]
}]

export default useCaseDelivery
