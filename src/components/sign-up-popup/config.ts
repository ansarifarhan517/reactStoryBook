import productMile from '/public/product-mile.svg'
import productReverse from '/public/product-reverse.svg'
import productOnDemand from '/public/product-on-demand.svg'
import productHaul from '/public/product-haul.svg'

const signUpPopupConfig = [{
  id: 'product_mile',
  name: 'mile',
  description: 'Optimize and automate pick-up, planning, scheduling and routing for efficient delivery operations.',
  image: productMile
},
{
  id: 'product_reverse',
  name: 'reverse',
  description: 'Reliably optimize reverse pickups including return-to-merchant (RTM) and return-to-origin (RTO) scenarios with the best reverse logistics solutions.',
  image: productReverse
},
{
  id: 'product_on_demand',
  name: 'on-demand',
  description: 'Faster and better on-time pickups and deliveries using our enhanced route planning and auto delivery allocation software.',
  image: productOnDemand
},
{
  id: 'product_haul',
  name: 'haul',
  description: 'Get the best Transportation Optimization platform to gain end to end visibility over your logistical operations, avoid supply chain hiccups and lower overall transportation costs.',
  image: productHaul
}]

export default signUpPopupConfig
