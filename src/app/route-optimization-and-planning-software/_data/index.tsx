import deliveryGoodsPlannedRoute from '/public/route-optimization-and-planning-software/delivery-goods-planned-route.webp'
import routePlanningDelivery from '/public/route-optimization-and-planning-software/route-planning-delivery.webp'

const dispatchSoftwareInformation = [
  {
    id: 'delivery-goods-planned-route',
    image: deliveryGoodsPlannedRoute,
    imagePosition: 'left',
    title:
      'Increase capacity utilization and decrease dispatch time with a suitable Route Optimization',
    description:
      `Understand the grassroot level issues with smart insights and develop high-level strategic views 
        over your business to plan time saving, cost efficient and feasible routes.`,
    features: [
      {
        id: 'optimize-driver-utilization-for-deliveries',
        label: 'Optimize driver utilization for deliveries: ',
        description:
          `Analyze traffic, delivery priorities and driver availability to save costs and meet 
          sustainability goals with optimized routes.`,
      },
      {
        id: 'reduce-unnecessary-fuel-consumption',
        label: 'Reduce unnecessary fuel consumption: ',
        description:
          'Eliminate extra miles by planning better routes to ensure maximum utilization per vehicle.',
      },
    ],
  },
  {
    id: 'route-planning-delivery',
    image: routePlanningDelivery,
    imagePosition:'right',
    title:
      'Prioritize accurate ETAs and faster deliveries with LogiNext’s route planning software',
    description:
      `Invest in a software that cares about efficiency, driver’s convenience and faster delivery times.
       With LogiNext, delivery businesses can easily identify the most suitable routes, track driver progress 
      in real-time and keep the customer informed.`,
    features: [
      {
        id: 'analytics-and-reporting',
        label: 'Capitalize on intelligent route optimization: ',
        description:
          `Cut your delivery costs by at least 20% by creating optimized routes based on driver availability, 
          traffic patterns, and delivery priorities.`,
      },
      {
        id: 'achieve-delivery-excellence-with-AI-driven-insights',
        label: 'Achieve delivery excellence with AI driven insights: ',
        description:
          `Optimize working times with the route optimization software, adjust vehicle count, and fulfill various demand patterns 
          with efficient resource utilization.`,
      },
    ],
  },

]

export default dispatchSoftwareInformation
