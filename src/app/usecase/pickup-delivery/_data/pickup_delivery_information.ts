import foodDeliveryCarrier from '/public/use-case/pickup-delivery/food-delivery-carrier.webp'
import pointToPointDeliveries from '/public/use-case/pickup-delivery/point-to-point-deliveries.webp'

const useCasePickupDelivery = [{
  id: 'food-delivery-carrier',
  image: foodDeliveryCarrier,
  imagePosition: 'right',
  title: 'Food Delivery Carrier',
  description: 'Easily setup and scale your food delivery business with easy management of orders, drivers and delivery operations.',
  features: [
    {
      id: 'route-ptimization',
      label: 'Route Optimization: ',
      description:'Get the best trip plans according through an algorithm trained over billions of location data points.',
    },
    {
      id: 'automatic-order-allocation',
      label: 'Automatic Order Allocation: ',
      description:'Assign orders into trips at the click of a button according to your chosen constraints.',
    },
    {
      id: 'gamified-driver-app',
      label: 'Gamified Driver App: ',
      description:'Incentivise delivery drivers with a simple to use and gamified app to increase driver efficiency.',
    },
  ]
},{
  id: 'point-to-point-deliveries',
  image: pointToPointDeliveries,
  imagePosition: 'left',
  title: 'Point-To-Point Deliveries',
  description: 'Efficiently schedule, route and track order deliveries with seamless integration with your ordering app or portal.',
  features: [
    {
      id: 'easy-order-management',
      label: 'Easy Order Management: ',
      description:'Schedule orders and reduce manual work along with increasing accountability.',
    },
    {
      id: 'map-based-visualization',
      label: 'Map Based Visualization:: ',
      description:'Get complete visibility over delivery drivers, trips and orders on a single map layout in real time.',
    },
    {
      id: 'geofence-and-timefence',
      label: 'Geofence & Timefence: ',
      description: 'Get notified about an event as per your configurations.',
    },
  ]
}]

export default useCasePickupDelivery
