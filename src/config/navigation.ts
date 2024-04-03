const navigation = [{
  id: 'products',
  label: 'platform',
  href: '/products',
  displayName: 'products:',
  menu: [{
    id: 'products_mile',
    label: 'LogiNext Mile',
    href: '/products/mile',
    displayName: 'Features:',
    menu: [{
      label: 'Route Planning',
      href: '/products/mile/route-planning-software',
    }, {
      label: 'Schedule Planning',
      href: '/products/mile/delivery-schedule-planning-software',
    }, {
      label: 'Live Tracking',
      href: '/products/mile/live-delivery-tracking-software',
    }, {
      label: 'Delivery Validation',
      href: '/products/mile/delivery-validation-with-electronic-proof-of-delivery',
    }],
  },
  {
    id: 'products_reverse',
    label: 'LogiNext Reverse',
    href: '/products/reverse',
    displayName: 'Features:',
    menu: [{
      label: 'Route Planning',
      href: '/products/reverse/route-planning-software',
    },
    {
      label: 'Pick Up & Delivery Optimization',
      href: '/products/reverse/multiple-pickups-drops-management-software',
    },
    {
      label: 'Schedule Planning',
      href: '/products/reverse/delivery-schedule-planning-software',
    },
    {
      label: 'Live Tracking',
      href: '/products/reverse/live-delivery-tracking-software',
    }],
  },
  {
    id: 'products_on_demand',
    label: 'LogiNext On-Demand',
    href: '/products/on-demand',
    displayName: 'Features:',
    menu: [{
      label: 'Order Sequencing',
      href: '/products/on-demand/auto-order-sequencing-for-ondemand-deliveries',
    },
    {
      label: 'Pickup and Drop Optimization',
      href: '/products/on-demand/multiple-pickups-drops-management-software',
    },
    {
      label: 'Live Tracking',
      href: '/products/on-demand/live-track-ondemand-deliveries-drivers',
    },
    {
      label: 'Delivery Validation',
      href: '/products/on-demand/application-for-delivery-validation-through-epod',
    }]
  },
  {
    id: 'products_haul',
    label: 'LogiNext Haul',
    href: '/products/haul',
    displayName: 'Features:',
    menu: [{
      label: 'Route Planning',
      href: '/products/haul/intercity-longhaul-transport-fleet-route-planning-software',
    },
    {
      label: 'Tracking and Alerts',
      href: '/products/haul/intercity-transort-vehicle-live-tracking-alerts',
    },
    {
      label: 'Driver Behaviour Analysis',
      href: '/products/haul/intercity-longhaul-transport-driver-behaviour-analysis',
    },
    {
      label: 'Hub-Load Balance',
      href: '/products/haul/software-for-capacity-management-and-hub-load-balancing',
    }]
  },
  {
    id: 'products_driver_app',
    label: 'LogiNext Driver app',
    href: '/products/driver-app',
    displayName: 'Features:',
  }],
},
{
  id: 'industries',
  label: 'industries',
  displayName: 'industries:',
  href: '/industries/couriers-express-parcels',
  menu: [{
    id: 'courier_express_and_parcel',
    label: 'Courier, Express and Parcel',
    href: '/industries/couriers-express-parcels',
    displayName: 'solutions:',
    menu: [{
      label: 'First Mile Pickup and Optimization',
      href: '/industries/couriers-express-parcels/first-mile-pickup-optimization-software',
    },
    {
      label: 'On-Demand / Same Day Delivery',
      href: '/industries/couriers-express-parcels/sameday-ondemand-delivery-optimization-software',
    },
    {
      label: 'Middle Mile Movement Optimization',
      href: '/industries/couriers-express-parcels/hub-to-hub-middle-mile-optimization-software',
    },
    {
      label: 'Multiple Pickup and Delivery Optimization',
      href: '/industries/couriers-express-parcels/multiple-pickups-drops-management-software',
    },
    {
      label: 'Special Handling / White Glove Delivery',
      href: '/industries/couriers-express-parcels/special-material-handling-white-glove-delivery-optimization'
    },
    {
      label: 'Last / Final Mile Delivery',
      href: '/industries/couriers-express-parcels/final-mile-delivery-optimization-software'
    }],
  },
  {
    id: 'retail_and_e_commerce',
    label: 'Retail and eCommerce',
    href: '/industries/retail-and-ecommerce',
    displayName: 'solutions:',
    menu: [{
      label: 'Primary Distribution - Capacity Optimization',
      href: '/industries/retail-and-ecommerce/capacity-optimization-software-for-primary-distribution',
    },
    {
      label: 'Warehouse to Store Movement',
      href: '/industries/retail-and-ecommerce/route-planning-for-secondary-distribution',
    },
    {
      label: 'Store to Customer Movement',
      href: '/industries/retail-and-ecommerce/final-mile-delivery-optimization-software',
    },
    {
      label: 'Same Day/Next Day Delivery',
      href: '/industries/retail-and-ecommerce/best-software-for-next-day-or-same-day-delivery-management',
    },
    {
      label: 'Omnichannel Distribution',
      href: '/industries/retail-and-ecommerce/omnichannel-distribution-management-software',
    },
    {
      label: 'End-to-End Order Tracking',
      href: '/industries/retail-and-ecommerce/live-track-ondemand-deliveries-drivers',
    }],
  },
  {
    id: 'consumer_packaged_goods',
    label: 'Consumer Packaged Goods',
    href: '/industries/consumer-package',
    displayName: 'solutions:',
    menu: [{
      label: 'Primary Distribution - Capacity Optimization',
      href: '/industries/consumer-package/capacity-optimization-software-for-primary-distribution',
    },
    {
      label: 'Warehouse to Store Movement',
      href: '/industries/consumer-package/route-planning-for-secondary-distribution',
    },
    {
      label: 'Delivery Associate/Vehicle Management',
      href: '/industries/consumer-package/logistics-software-for-driver-and-vehicle-management',
    },
    {
      label: 'Shipment and Unit Level Tracking',
      href: '/industries/consumer-package/live-delivery-tracking-software',
    },
    {
      label: 'Sales Schedule and Journey Optimization',
      href: '/industries/consumer-package/sales-schedule-and-journey-planning-software',
    },
    {
      label: 'Temperature Controlled Transport',
      href: '/industries/consumer-package/cold-chain-logistics-management-software',
    }],
  },
  {
    id: 'food_and_beverage',
    label: 'Food and Beverage',
    href: '/industries/food-and-beverages',
    displayName: 'solutions:',
    menu: [{
      label: 'Restaurant Supplies and Distribution',
      href: '/industries/food-and-beverages/software-for-restaurant-supplies-and-distribution',
    },
    {
      label: 'On-Demand Pickup Allocation & Dispatch',
      href: '/industries/food-and-beverages/multiple-pickups-drops-management-software',
    },
    {
      label: 'Delivery Associate/Vehicle Management',
      href: '/industries/food-and-beverages/logistics-software-for-driver-and-vehicle-management',
    },
    {
      label: 'Live Order Tracking and Alerts',
      href: '/industries/food-and-beverages/live-track-ondemand-deliveries-drivers',
    },
    {
      label: 'Multiple Payment Options',
      href: '/industries/food-and-beverages/delivery-application-with-multiple-payment-options-for-cod',
    },
    {
      label: 'Fast Home Delivery with Customer Feedback',
      href: '/industries/food-and-beverages/application-for-delivery-validation-through-epod',
    }],
  },
  {
    id: 'transportation_and_logistics',
    label: 'Transportation and Logistics',
    href: '/industries/transportation-software',
    displayName: 'solutions:',
    menu: [{
      label: 'Hub-Load Balancing',
      href: '/industries/transportation-software/software-for-capacity-management-and-hub-load-balancing',
    },
    {
      label: 'FTL and LTL Capacity Optimization',
      href: '/industries/transportation-software/ftl-and-ltl-capacity-optimization',
    },
    {
      label: 'Driver Behavior Management',
      href: '/industries/transportation-software/intercity-longhaul-transport-driver-behaviour-analysis',
    },
    {
      label: 'Middle Mile Management',
      href: '/industries/transportation-software/hub-to-hub-middle-mile-optimization-software',
    },
    {
      label: 'Cold Chain Logistics',
      href: '/industries/transportation-software/cold-chain-logistics-management-software',
    }],
  }]
},
{
  id: 'usecase',
  label: 'Use cases',
  displayName: 'use cases:',
  href: '/usecase/pickup',
  menu: [{
    id: 'use_case_pickup',
    label: 'Pickup',
    href: '/usecase/pickup',
  },
  {
    id: 'use_case_delivery',
    label: 'Delivery',
    href: '/usecase/delivery',
  },
  {
    id: 'use_case_pickup_and_delivery',
    label: 'Pickup and Delivery',
    href: '/usecase/pickup-delivery',
  },
  {
    id: 'use_case_line_haul',
    label: 'Line Haul',
    href: '/usecase/line-haul',
  },
  {
    id: 'use_case_end_to_end',
    label: 'End to End',
    href: '/usecase/end-to-end',
  }]
},
{
  id: 'blog',
  label: 'Blog',
  href: 'https://loginextsolutions.com/blog'
},
{
  id: 'pricing',
  label: 'Pricing',
  href: '/pricing'
},
{
  id: 'resource',
  label: 'resources',
  displayName: 'resources:',
  href: '/resource/casestudy',
  menu: [{
    id: 'resource_case_study',
    label: 'Case Studies',
    href: '/resource/casestudy',
  },
  {
    id: 'resource_white_paper',
    label: 'White Papers',
    href: '/resource/whitepaper',
  },
  // {
  //   id: 'resource_vodcast',
  //   label: 'Vodcast',
  //   href: '/resource/vodcast',
  // },
  {
    id: 'resource_infographics',
    label: 'Infographics',
    href: '/resource/infographic',
  },
  // {
  //   id: 'resource_videos',
  //   label: 'Videos',
  //   href: '/resource/videos',
  // },
  {
    id: 'resource_carbon_emission_calculator',
    label: 'Carbon Emission Calculator',
    href: '/resource/carbonemission',
  },
  // {
  //   id: 'glossary',
  //   label: 'Glossary',
  //   href: '/glossary',
  // }
  ]
},
{
  id: 'join-us',
  label: 'join us',
  href: '/join-us/culture',
  menu: [{
    id: 'join_us_company_culture',
    label: 'Company Culture',
    href: '/join-us/culture'
  },
  {
    id: 'join_us_interview_process',
    label: 'Interview Process',
    href: '/join-us/interview-process'
  },
  {
    id: 'join_us_job_role',
    label: 'Job Roles',
    href: 'https://loginext.hire.trakstar.com'
  }]
},
{
  id: 'company',
  label: 'company',
  displayName: 'company:',
  href: '/company/aboutus',
  menu: [{
    id: 'company_about_us',
    label: 'About Us',
    href: '/company/aboutus',
  },
  // {
  //   id: 'company_awards_recognation',
  //   label: 'Awards and Recognition',
  //   href: '/company/awards-and-recognition',
  // },
  {
    id: 'company_contact_us',
    label: 'Contact Us',
    href: '/company/contact',
  },
  {
    id: 'company_news_media',
    label: 'News and Media',
    href: '/company/newsmedia',
  },
  // {
  //   id: 'company_events_and_conferences',
  //   label: 'Events and Conferences',
  //   href: '/company/events-and-conferences',
  // },
  // {
  //   id: 'company_client_delight_experiences',
  //   label: 'Client Delight Experiences',
  //   href: '/company/client-delight-experiences',
  // },
  {
    id: 'site_map',
    label: 'Site Map',
    href: '/sitemap',
  }
  ]
}]

export default navigation
