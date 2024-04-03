import { StaticImageData } from 'next/image'

import caseStudySample from '/public/case-study-sample.webp'

import postalServices from '/public/industries-navigation/postal-services.svg'
import packageDelivery from '/public/industries-navigation/package-delivery.svg'
import eCommerceDelivery from '/public/industries-navigation/e-commerce-delivery.svg'
import hyperLocalDelivery from '/public/industries-navigation/hyper-local-delivery.svg'

import fashionAccessories from '/public/industries-navigation/fashion-accessories.svg'
import electronicsAppliancesWhiteGoods from '/public/industries-navigation/electronics-appliances-white-goods.svg'
import furnitureLargeItems from '/public/industries-navigation/furniture-large-items.svg'
import sports from '/public/industries-navigation/sports.svg'

import supermarkets from '/public/industries-navigation/super-markets.svg'
import pharmacy from '/public/industries-navigation/pharmacy.svg'
import foodProducts from '/public/industries-navigation/food-products.svg'
import wineSpirits from '/public/industries-navigation/wine-spirits.svg'

import restraurants from '/public/industries-navigation/restaurants.svg'
import dairyFreshProduce from '/public/industries-navigation/dairy-fresh-produce.svg'

import retailDistribution from '/public/industries-navigation/retail-distribution.svg'
import cpgDistribution from '/public/industries-navigation/cpg-distribution.svg'
import brokersAggregators from '/public/industries-navigation/brokers-aggregators.svg'

type indutriesPresentationConfigProps = {
  [any: string]: {
    caseStudy: {
      image: StaticImageData;
      caption: string;
      href: string;
    },
    business: {
      label: string;
      icon: StaticImageData;
    }[]
  }
}

const indutriesPresentationConfig: indutriesPresentationConfigProps = {
  courier_express_and_parcel: {
    caseStudy: {
      image: caseStudySample,
      caption: 'Large delivery service company optimizes its final mile',
      href: 'https://info.loginextsolutions.com/last-mile-optimization-for-large-delivery-service-company',
    },
    business: [{
      label: 'Postal Services',
      icon: postalServices,
    },
    {
      label: 'Package Delivery',
      icon: packageDelivery,
    },
    {
      label: 'Electronics, Appliances & White Goods',
      icon: eCommerceDelivery,
    },
    {
      label: 'Hyperlocal Delivery',
      icon: hyperLocalDelivery,
    },]
  },
  retail_and_e_commerce: {
    caseStudy: {
      image: caseStudySample,
      caption: 'Leading home goods company streamlines all logistics movement',
      href: 'https://info.loginextsolutions.com/home-goods-logistics-management-carrier-movement-efficiency',
    },
    business: [{
      label: 'Fashion & Accessories',
      icon: fashionAccessories
    },
    {
      label: 'Electronics, Appliances & White Goods',
      icon: electronicsAppliancesWhiteGoods
    },
    {
      label: 'Furniture & Large Items',
      icon: furnitureLargeItems
    },
    {
      label: 'Sports',
      icon: sports
    }]
  },
  consumer_packaged_goods: {
    caseStudy: {
      image: caseStudySample,
      caption: 'Consumer packaged goods stalwart boosts logistics efficiency',
      href: 'https://info.loginextsolutions.com/hubfs/Case_Studies/Case%20Study_CPG_PDF/Case%20Study_CPG_Mile.pdf',
    },
    business: [{
      label: 'Supermarkets',
      icon: supermarkets
    },
    {
      label: 'Pharmacy',
      icon: pharmacy
    },
    {
      label: 'Food Products',
      icon: foodProducts
    },
    {
      label: 'Wine & Spirits',
      icon: wineSpirits
    }]
  },
  food_and_beverage: {
    caseStudy: {
      image: caseStudySample,
      caption: 'Large QSR company quickens food deliveries with LogiNext',
      href: 'https://info.loginextsolutions.com/quick-service-restaurant-case-study-for-on-demand-delivery-management',
    },
    business: [{
      label: 'Restaurants',
      icon: restraurants
    },
    {
      label: 'Dairy & Fresh Produce',
      icon: dairyFreshProduce
    },
    {
      label: 'Food Products',
      icon: foodProducts
    },
    {
      label: 'Wine & Spirits',
      icon: wineSpirits
    }]
  },
  transportation_and_logistics: {
    caseStudy: {
      image: caseStudySample,
      caption: 'Large CPG player improves carrier movement and end-to-end visibility',
      href: 'https://info.loginextsolutions.com/logistics-distribution-optimization-consumer-packaged-goods',
    },
    business: [{
      label: 'Retail Distribution',
      icon: retailDistribution
    },
    {
      label: 'CPG Distribution',
      icon: cpgDistribution
    },
    {
      label: '4PL, Brokers & Aggregators',
      icon: brokersAggregators
    }]
  },
}

export default indutriesPresentationConfig
