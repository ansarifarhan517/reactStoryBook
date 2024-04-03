/** @type {import('next').NextConfig} */

const CompressionPlugin  = require('compression-webpack-plugin')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: false,
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'info.loginextsolutions.com',
    },
    {
      protocol: 'https',
      hostname: 'www.loginextsolutions.com',
    }]
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: 'https://products.loginextsolutions.com/login',
        permanent: false,
        basePath: false
      },
      {
        source: '/route-planning-software',
        destination: '/products/mile/route-planning-software',
        permanent: true,
      },
      {
        source: '/delivery-schedule-planning-software',
        destination: '/products/mile/delivery-schedule-planning-software',
        permanent: true,
      },
      {
        source: '/live-delivery-tracking-software',
        destination: '/products/mile/live-delivery-tracking-software',
        permanent: true,
      },
      {
        source: '/delivery-validation-with-electronic-proof-of-delivery',
        destination: '/products/mile/delivery-validation-with-electronic-proof-of-delivery',
        permanent: true,
      },
      {
        source: '/multiple-pickups-drops-management-software',
        destination: '/products/reverse/multiple-pickups-drops-management-software',
        permanent: true,
      },
      {
        source: '/auto-order-sequencing-for-ondemand-deliveries',
        destination: '/products/on-demand/auto-order-sequencing-for-ondemand-deliveries',
        permanent: true,
      },
      {
        source: '/live-track-ondemand-deliveries-drivers',
        destination: '/products/on-demand/live-track-ondemand-deliveries-drivers',
        permanent: true,
      },
      {
        source: '/application-for-delivery-validation-through-ePOD',
        destination: '/products/on-demand/application-for-delivery-validation-through-epod',
        permanent: true,
      },
      {
        source: '/intercity-longhaul-transport-fleet-route-planning-software',
        destination: '/products/haul/intercity-longhaul-transport-fleet-route-planning-software',
        permanent: true,
      },
      {
        source: '/intercity-transort-vehicle-live-tracking-alerts',
        destination: '/products/haul/intercity-transort-vehicle-live-tracking-alerts',
        permanent: true,
      },
      {
        source: '/intercity-longhaul-transport-driver-behaviour-analysis',
        destination: '/products/haul/intercity-longhaul-transport-driver-behaviour-analysis',
        permanent: true,
      },
      {
        source: '/software-for-capacity-management-and-hub-load-balancing',
        destination: '/products/haul/software-for-capacity-management-and-hub-load-balancing',
        permanent: true,
      },
      {
        source: '/first-mile-pickup-optimization-software',
        destination: '/industries/couriers-express-parcels/first-mile-pickup-optimization-software',
        permanent: true,
      },
      {
        source: '/sameday-ondemand-delivery-optimization-software',
        destination: '/industries/couriers-express-parcels/sameday-ondemand-delivery-optimization-software',
        permanent: true,
      },
      {
        source: '/hub-to-hub-middle-mile-optimization-software',
        destination: '/industries/couriers-express-parcels/hub-to-hub-middle-mile-optimization-software',
        permanent: true,
      },
      {
        source: '/special-material-handling-white-glove-delivery-optimization',
        destination: '/industries/couriers-express-parcels/special-material-handling-white-glove-delivery-optimization',
        permanent: true,
      },
      {
        source: '/final-mile-delivery-optimization-software',
        destination: '/industries/couriers-express-parcels/final-mile-delivery-optimization-software',
        permanent: true,
      },
      {
        source: '/capacity-optimization-software-for-primary-distribution',
        destination: '/industries/retail-and-ecommerce/capacity-optimization-software-for-primary-distribution',
        permanent: true,
      },
      {
        source: '/best-software-for-next-day-or-same-day-delivery-management',
        destination: '/industries/retail-and-ecommerce/best-software-for-next-day-or-same-day-delivery-management',
        permanent: true,
      },
      {
        source: '/omnichannel-distribution-management-software',
        destination: '/industries/retail-and-ecommerce/omnichannel-distribution-management-software',
        permanent: true,
      },
      {
        source: '/route-planning-for-secondry-distribution',
        destination: '/industries/consumer-package/route-planning-for-secondary-distribution',
        permanent: true,
      },
      {
        source: '/logistics-software-for-driver-and-vehicle-management',
        destination: '/industries/consumer-package/logistics-software-for-driver-and-vehicle-management',
        permanent: true,
      },
      {
        source: '/sales-schedule-and-journey-planning-software',
        destination: '/industries/consumer-package/sales-schedule-and-journey-planning-software',
        permanent: true,
      },
      {
        source: '/cold-chain-logistics-management-software',
        destination: '/industries/consumer-package/cold-chain-logistics-management-software',
        permanent: true,
      },
      {
        source: '/software-for-restaurant-supplies-and-distribution',
        destination: '/industries/food-and-beverages/software-for-restaurant-supplies-and-distribution',
        permanent: true,
      },
      {
        source: '/delivery-application-with-multiple-payment-options-for-COD',
        destination: '/industries/food-and-beverages/delivery-application-with-multiple-payment-options-for-cod',
        permanent: true,
      },
      {
        source: '/ftl-and-ltl-capacity-optimization',
        destination: '/industries/transportation-software/ftl-and-ltl-capacity-optimization',
        permanent: true,
      },
      {
        source: '/field-workforce-schedule-planning-software',
        destination: '/feature/field-workforce-schedule-planning-software',
        permanent: true,
      },
      {
        source: '/automate-work-order-allocation-software',
        destination: '/feature/automate-work-order-allocation-software',
        permanent: true
      },
      {
        source: '/field-workforce-route-planning-optimization',
        destination: '/feature/field-workforce-route-planning-optimization',
        permanent: true,
      },
      {
        source: '/software-for-field-agents-live-tracking',
        destination: '/feature/software-for-field-agents-live-tracking',
        permanent: true,
      },
      {
        source: '/companyculture',
        destination: '/join-us/culture',
        permanent: true,
      },
      {
        source: '/interview',
        destination: '/join-us/interview-process',
        permanent: true,
      },
      {
        source: '/integrationdetail/:path*',
        destination: '/integration/:path*',
        permanent: true
      },
      {
        source: '/pricingnew',
        destination: '/pricing',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/pricing/signup',
        permanent: true,
      },
      {
        source: '/pricingform',
        destination: '/pricing/form',
        permanent: true,
      },
      {
        source: '/pricingsuccess',
        destination: '/pricing/success',
        permanent: true,
      },
      {
        source: '/pricingfailure',
        destination: '/pricing/failure',
        permanent: true,
      }
    ]
  },
}

module.exports = {
  webpack (config) {
    config.plugins.push(
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
        algorithm: 'brotliCompress'
      }),
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
        algorithm: 'gzip'
      }),
    );
    return config;
  },
  ...nextConfig
}
