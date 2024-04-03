import { StaticImageData } from 'next/image'

import momoe from '/public/integration/momoe.webp'
import midtrans from '/public/integration/midtrans.webp'
import aws from '/public/integration/aws.webp'
import alibaba from '/public/integration/alibaba.webp'
import ibmCloud from '/public/integration/ibm-cloud.webp'
import azure from '/public/integration/azure.webp'
import zoho from '/public/integration/zoho.webp'
import shopify from '/public/integration/shopify.webp'
import capillary from '/public/integration/capillary-2.webp'
import sendGrid from '/public/integration/sendgrid.webp'
import oracle from '/public/integration/oracle.webp'
import otm from '/public/integration/otm.webp'
import google from '/public/integration/google.webp'
import here from '/public/integration/here.webp'
import osm from '/public/integration/osm.webp'
import concox from '/public/integration/concox.webp'
import trimble from '/public/integration/trimble.webp'
import twilio from '/public/integration/twilio.webp'
import solutionsInfini from '/public/integration/solutions-infini.webp'
import paytm from '/public/integration/paytm.webp'
import mSwipe from '/public/integration/mswipe.webp'
import mosambee from '/public/integration/mosambee.webp'
import greyOrange from '/public/integration/grey-orange.webp'
import jda from '/public/integration/jda.webp'
import salesforce from '/public/integration/salesforce.webp'
import microsoft from '/public/integration/microsoft.webp'
import magento from '/public/integration/magento.webp'
import ibmWatson from '/public/integration/ibm-watson.webp'
import sapHybris from '/public/integration/sap-hybris.webp'
import webJaguar from '/public/integration/web-jaguar.webp'
import grab from '/public/integration/grab.webp'
import pandago from '/public/integration/pandago.webp'
import uberEats from '/public/integration/uber-eats.webp'
import orderIn from '/public/integration/orderin.webp'
import fedex from '/public/integration/fedex.webp'
import dhl from '/public/integration/dhl.webp'
import sap from '/public/integration/sap.webp'

type intregrationData = {
    id:string
    category: string
    name: string
    url: string
    image?: StaticImageData,
    color1?: string
    color2?: string
    content: string
    meta?: string
}

const data : intregrationData[] = [
  {
    id: 'mome',
    category: 'payment',
    name: 'Momoe',
    url: 'integrationdetail/momoe',
    image: momoe,
    color1: '#fbce33',
    color2: '#8b8b8b',
    content: `Want to give the end-customer multiple payment options at the time of delivery? 
    Momoe integration with LogiNext helps shippers, receivers, and customers make online payments easy and streamlined.`,
  },
  {
    id: 'midtrans',
    category: 'payment',
    name: 'Midtrans',
    url: 'integrationdetail/midtrans',
    image: midtrans,
    color1: '#46baf4',
    color2: '#062f6e',
    content: `With very-high internet penetration and adaptability within Southeast Asia, 
      LogiNext’s Midrans integrations help companies put the best payment options in from of all customers. 
      LogiNext’s Midtrans integration has helped cut down invoicing errors and improve customer satisfaction.`,
  },
  {
    id: 'aws',
    category: 'cloud',
    name: 'Amazon Web Services (AWS)',
    url: 'integrationdetail/amazon-web-services',
    image: aws,
    content:
      'Our cloud-partnership with Amazon Web Services brings the best in delivery route planning, analytics, stability, security, scalability, and manageability for all types of global enterprises.',
    color1: '#e9602e',
    color2: '#b55431',
  },
  {
    id: 'alibaba',
    category: 'cloud',
    name: 'Alibaba Cloud',
    url: 'integrationdetail/alibaba-cloud',
    image: alibaba,
    content:
      `We seamlessly integrate with Alibaba Cloud, fast-growing with more than a million customers and $669 million in revenue. 
      LogiNext leverages elastic cloud computing through Alibaba Cloud integration along with benchmarking scalability, reliability, availability, and core computing power.`,
    color1: '#343b41',
    color2: '#6b7076',
  },
  {
    id:'ibm',
    category: 'cloud',
    name: 'IBM Cloud',
    url: 'integrationdetail/IBM-cloud',
    image: ibmCloud,
    content: `We are fully integrated with full-stack IBM Cloud tools right from IBM Watson to complete mobile device management services. 
              High-scale analytics with complete load balancing and artificial intelligence capabilities, 
              the combination of LogiNext’s tech with IBM cloud offers cutting-edge solutions.`,
    color1: '#46baf4',
    color2: '#062f6e',
  },
  {
    id: 'azure' ,
    category: 'cloud',
    name: 'Microsoft Azure',
    url: 'integrationdetail/microsoft-azure',
    image: azure,
    content: `Extending the full-circle of cloud-platforms, we have partnered with 
              Microsoft Azure’s complete stack with top-class analytics, cloud computing, database solutions, scalability, and security to name a few of the front liners.`,
    color1: '#005ae8',
    color2: '#0b5de1',
  },
  {
    id:'zoho',
    category: 'crm',
    name: 'Zoho',
    url: 'integrationdetail/zoho',
    image: zoho,
    content:
      'We have partnered with the full-suite of Zoho products to give complete business process automation. The result is a streamlined and consistent sequence of analytics, reports, and invoices.',
    color1: '#d63e2d',
    color2: '#6bc36d',
  },
  {
    id:'shopify',
    category: 'oms',
    name: 'Shopify',
    url: 'integrationdetail/Shopify',
    image: shopify,
    content: `We have the full Shopify platform integrated with our system to give complete point-of-sale support for retail, 
              e-commerce, and any other industry. LogiNext can thus optimize each aspect of the shipment movement process right from placing the order, 
              secure payment processing, to tracking its exact location and movement (with instant notifications) while it reaches the customer on-time.` ,
    color1: '#9abd45',
    color2: '#5d8e3a',
  },
  {
    id:'capillary',
    category: 'oms',
    name: 'Capillary Martjack',
    url: 'integrationdetail/Capillary-Martjack',
    image: capillary,
    content: `We raise the omnichannel landscape with complete integration with Capillary MartJack. This enables and optimizes omnichannel package and shipment movement 
              creating a great delivery experience for all customers, everywhere.`,
    color1: '#478111',
    color2: '#0e4f8e',
  },
  {
    id:'send_grid',
    category: 'email',
    name: 'SendGrid',
    url: 'integrationdetail/sendgrid',
    image: sendGrid,
    content: `We have tied up with SendGrid’s superior cloud-based email automation platform 
              to ensure that all transactional emails and alerts (such as order status updates) are instantly sent to all relevant stakeholders.`,
    color1: '#1b81e4',
    color2: '#45b5e4',
  },
  {
    id:'oracle',
    category: 'erp',
    name: 'Oracle',
    url: 'integrationdetail/oracle',
    image: oracle,
    content: `One of the leading ERPs in the world, the entire suite of Oracle comes completely 
              integrable and compatible with LogiNext’s system. With seamless integrations across platforms and applications, companies can go live quickly.`,
    color1: '#ed4630',
    color2: '#5f0803',
  },
  {
    id:'otm',
    category: 'tms',
    name: 'Oracle Transportation Management (OTM)',
    url: 'integrationdetail/oracle-transportation-management',
    image: otm,
    content: `OTM is a system used to streamline high-level transportation processes. 
              LogiNext can easily integrate with OTM with a host of different API offerings creating a smooth transition bringing in the power route planning to your transportation management.`,
    color1: '#145183',
    color2: '#28628d',
  },
  {
    id:'google',
    category: 'map',
    name: 'Google',
    url: 'integrationdetail/google',
    image: google,
    content: `Integrating with the entire scale of Google APIs, Google Maps being the most notable of them. 
              LogiNext builds on Google’s accurate map data with live traffic analysis, accurate ETAs, and pinpoint location information.` ,
    color1: '#4c87ea',
    color2: '#406ce6',
  },
  {
    id:'here',
    category: 'map',
    name: 'Here Maps',
    url: 'integrationdetail/here-map',
    image: here,
    content: `LogiNext comes pre-integrated and compatible with Here Maps for every business and use case specific map interface. 
              Instant mapping connectivity and location analytics built along with Here Maps gives LogiNext the edge in on-ground visibility.`,
    color1: '#43464f',
    color2: '#64c1bd',
  },
  {
    id:'osm',
    category: 'map',
    name: 'OpenStreetMap',
    url: 'integrationdetail/osm',
    image: osm,
    content:
      'Integrating with the largest open format mapping interface, Open Street Maps, LogiNext comes preset with fast and easy location identification and mapping, even at the very localized level.',
    color1: '#8ecb38',
    color2: '#396b14',
    meta: 'LogiNext offers integration with an Open Street Map that offers a free map view which can help with transportation visibility for your logistics operations.',
  },
  {
    id:'concox',
    category: 'hardware',
    name: 'Concox',
    url: 'integrationdetail/concox',
    image: concox,
    content: `One of the largest location tracking hardware integrates easily with LogiNext’s hardware-agnostic system providing consistent, 
              accurate, and live location data to run through LogiNext’s machine learning backed route planning.`,
    color1: '#3697cc',
    color2: '#3492c5',
  },
  {
    id:'trimble',
    category: 'hardware',
    name: 'Trimble',
    url: 'integrationdetail/trimble',
    image: trimble,
    content: `For better visibility and tracking of your long Haul movements, LogiNext provides out of the box integrations with Trimble trackers. 
              If you are using Trimble trackers to track your Long Haul Movements, LogiNext can integrate these trackers seamlessly right within its application.`,
    color1: '#011d65',
    color2: '#00297f',
  },
  {
    id:'twilio',
    category: 'sms',
    name: 'Twilio',
    url: 'integrationdetail/twilio',
    image: twilio,
    content: `One of the world's leading API based messaging platforms, 
              Twilio allows to send SMSs alerts and notifications through its APIs. 
              LogiNext can directly integrate with your existing Twilio account to directly send messages without any additional intervention required.`,
    color1: '#380406',
    color2: '#ed473f',
  },
  {
    id:'solutions-infini',
    category: 'sms',
    name: 'Solutions Infini',
    url: 'integrationdetail/solutions-infini',
    image: solutionsInfini,
    content: `This platform, also functional as Kaleyra, offers many channels for communicating with your customers, 
              primarily through SMSs. LogiNext’s instant alerts can be readily integrated with Soultions Infini, to be up and running in no time.`,
    color1: '#2c8acf',
    color2: '#6bc36d',
  },
  {
    id:'paytm',
    category: 'payment',
    name: 'Paytm',
    url: 'integrationdetail/paytm',
    image: paytm,
    content: `This leading payment wallet option is the most widely accepted platform and fastest 
              scaling payment solution in the market. LogiNext is readily integratable with Paytm giving a complete delivery experience to the customers.`,
    color1: '#46baf4',
    color2: '#062f6e',
  },
  {
    id:'mswipe',
    category: 'payment',
    name: 'MSwipe',
    url: 'integrationdetail/mswipe',
    image: mSwipe,
    content: `One of the largest point of sale terminals for all card payments integrates seamlessly with LogiNext to offer safe and secure
               payment options to customers at the point of delivery. LogiNext’s fast network syncing gives real-time visibility of all on-ground car payments.`,
    color1: '#060606',
    color2: '#41afe9',
  },
  {
    id: 'mosambee',
    category: 'payment',
    name: 'Mosambee',
    url: 'integrationdetail/mosambee',
    image: mosambee,
    content: `LogiNext integrates with leading end-to-end point of sale payment systems, Mosambee. 
            With fast payment processing and network syncing, coupled LogiNext’s TrackNext app’s zero crash record, a company can give multiple safe payment options to its customers.`,
    color1: '#fbce33',
    color2: '#8b8b8b',
  },
  {
    id: 'grey-orange',
    category: 'wms',
    name: 'GreyOrange',
    url: 'integrationdetail/grey-orange',
    image: greyOrange,
    content: `Fast-scaling warehouse automation company, GreyOrange, integrates readily with LogiNext’s shipment optimization to completely streamline sorting, 
              loading, and dispatch at warehouses. LogiNext’s IoT enabled algorithms make for a cutting-edge match with all process automation at warehouses.`,
    color1: '#ffcb0f',
    color2: '#f38e31',
  },
  {
    id:'jda',
    category: 'wms',
    name: 'JDA Warehouse Management',
    url: 'integrationdetail/jda-warehoues-management',
    image: jda,
    content:`Optimizing operations and processes at the warehouse takes a new upgrade with LogiNext’s auto-allocation, vehicle capacity optimization, and schedule planning. 
              LogiNext readily integrates with JDA warehouse management to ensure that all shipments flow seamlessly from warehouse to delivery.`,
    color1: '#19699e',
    color2: '#36a0ea',
  },
  {
    id: 'sales-force',
    category: 'crm',
    name: 'Salesforce',
    url: 'integrationdetail/salesforce',
    image: salesforce,
    content: `Enhance your last mile deliveries with LogiNext’s industry benchmarking software. 
              If you have Salesforce multiple CRM applications, you can be assured of their smooth integration with LogiNext’s systems.`,
    color1: '#359ee5',
    color2: '#2778af',
  },
  {
    id: 'microsoft',
    category: 'crm',
    name: 'Microsoft Dynamics',
    url: 'integrationdetail/microsoft-dynamics',
    image: microsoft,
    content: `You can scale your business by integrating your Microsoft Dynamics’ CRM with LogiNext’s multiple APIs and core system. 
            With easy and quick interactions, get your processes streamlined with real-time shipment movement information, driver behavior analysis, and live on-ground customer feedback.`,
  },
  {
    id: 'magento',
    category: 'oms',
    name: 'Magento',
    url: 'integrationdetail/Magento',
    image: magento,
    content: `Getting your order management system (OMS) in line with your delivery route planning system is critical. With Magento’s OMS, you can easily integrate with 
              LogiNext and get real-time syncing through our many APIs and exhaustive customer profiling capabilities.`,
    color1: '#e9602e',
    color2: '#b55431',
  },
  {
    id:'ibm_watson.',
    category: 'oms',
    name: 'IBM Watson Commerce',
    url: 'integrationdetail/IBM-Watson-Commerce',
    image: ibmWatson,
    content:  `One of the leading order management systems (OMS), IBM Watson Commerce integrates with LogiNext to give a complete end-to-end streamlined process for all order management. 
                LogiNext’s auto order allocation based on a driver’s individual skill set and the vehicle’s specifications (type, capacity, etc.) gives total control in the hands of the client.`,
    color1: '#083255',
    color2: '#86c217',
  },
  {
    id:'sap-hybris',
    category: 'oms',
    name: 'SAP Hybris',
    url: 'integrationdetail/SAP-Hybris',
    image: sapHybris,
    content: `Giving the end-customer a great delivery experience requires the order management system (OSM) and delivery route planning engine to 
              integrate seamlessly. LogiNext integrates with SAP Hybris to ensure that all your customers get the deliveries on time with streamline order management processes, 
              especially for omnichannel enablement of retail and e-commerce.`,
    color1: '#eeac30',
    color2: '#086fd6',
  },
  {
    id:'web-jaguar',
    category: 'fms',
    name: 'Web Jaguar',
    url: 'integrationdetail/web-jaguar',
    image: webJaguar,
    content: `Getting your on-ground driver and workforce movement optimized is easy, just integrate your
               Web Jaguar system with LogiNext and have all shipments and tasks planned to perfection along short and fast routes.`,
    color1: '#d63e2a',
    color2: '#000',
  },
  {
    id :'grab' ,
    category: 'cim',
    name: 'Grab',
    url: 'integrationdetail/Grab',
    image: grab,
    content:
      'GrabExpress is a delivery service that helps you to send items such as documents, parcels, and gifts to your business partners, family and friends.',
    color1: '#64d44c',
    color2: '#64d44c',

  },
  {
    id: 'pandago',
    category: 'cim',
    name: 'Pandago',
    url: 'integrationdetail/Pandago',
    image: pandago,
    content:
      'PandaGo is a delivery service that helps you to send items such as documents, parcels, and gifts to your business partners, family and friends.',
    color1: '#df4184',
    color2: '#e95e99',
  },
  {
    id: 'uber-eats',
    category: 'cim',
    name: 'Uber Eats',
    url: 'integrationdetail/Uber-Eats',
    image: uberEats,
    content: `Uber Eats is an online food ordering and delivery platform launched by Uber in 2014. 
              Users can read menus, reviews and ratings, order, and pay for food from participating restaurants using an application on the iOS or Android platforms, or through a web browser.`,
    color1: '#64d44c',
    color2: '#666666',
  },
  {
    id: 'order-in' ,
    category: 'cim',
    name: 'Orderin',
    url: 'integrationdetail/Orderin',
    image: orderIn,
    content: `Orderin is a South Africa based leading B2B on-demand delivery network. 
              With a network of 450+ drivers across 50 hubs, they ensure prioritised collection and delivery. They offer On-demand and scheduled same-day delivery service to their customers.`,
    color1: '#df4184',
    color2: '#e95e99',
  },
  {
    id:'fedex',
    category: 'cim',
    name: 'FedEx',
    url: 'integrationdetail/FedEx',
    image: fedex,
    content:  `FedEx is one of the world's largest express transportation companies, providing fast and reliable delivery to every 
              U.S. address and to more than 220 countries and territories. FedEx uses a global air-and-ground network 
                to speed delivery of time-sensitive shipments, usually in one to two business days with the delivery time guaranteed.`,
    color1: '#d37641',
    color2: '#7940ab',
  },
  {
    id: 'dhl',
    category: 'cim',
    name: 'DHL',
    url: 'integrationdetail/DHL',
    image: dhl,
    content: `DHL is a German logistics company providing courier, package delivery and express mail service, 
              which is a division of the German logistics firm Deutsche Post. 
                The company group delivers over 1.6 billion parcels per year. DHL Express is market leader for parcel services in Europe and Germany's main Courier and Parcel Service.`,
    color1: '#debd2f',
    color2: '#e86566',

  },
  {
    id: 'sap',
    category: 'tms',
    name: 'SAP',
    url: 'integrationdetail/sap',
    image: sap,
    content: `Get your transport management system in perfect sync with your shipment route planning. 
              Your SAP integrates readily with LogiNext to optimize vehicle carrying capacity, auto-allocate shipments to the right vehicle and driver, balance load capacity across your fleet, 
              ensure fast loading and dispatch, shipment route optimization, live track all vehicles, real-time driver behavior analysis, detention analysis, and delivery validation.`,
    color1: '#1a6ab3',
    color2: '#3ca9e9',
  },
]


const menuList = [
  {
    id: 'all-integration',
    label: 'All Integration',
  },
  {
    id: 'wms',
    label: 'WMS Integrations',
  },
  {
    id: 'crm',
    label: 'CRM Integrations',
  },
  {
    id: 'oms',
    label: 'OMS/eCommerce Integrations',
  },
  {
    id: 'cim',
    label: 'Carrier Integrations',
  },
  {
    id: 'erp',
    label: 'ERP Integrations',
  },
  {
    id: 'tms',
    label: 'TMS Integrations',
  },
  {
    id: 'map',
    label: 'Map Integrations',
  },
  {
    id: 'hardware',
    label: 'Hardware Integrations',
  },
  {
    id: 'sms',
    label: 'SMS Gateway Integrations',
  },
  {
    id: 'email',
    label: 'Email Gateway Integrations',
  },
  {
    id: 'payment',
    label: 'Payment Integrations',
  },
  {
    id: 'cloud',
    label: 'Cloud Integrations',
  },
]

type metaData ={
  [key : string] : {
    title: string;
    description: string;
  }
}
const metaData : metaData = {
  momoe: {
    title: 'Momoe',
    description: 'LogiNext offers Momoe integration to help shippers, receivers, and customers with online payments during delivery. A must-have for logistics service providers.'
  },
  midtrans: {
    title: 'Midtrans',
    description: `Want to reduce invoicing errors? LogiNext's integration with Midtrans will offer the best payment 
    options to customers for maximum customer satisfaction.`
  },
  'amazon-web-services' : {
    title: 'Amazon Web Services (AWS)',
    description: 'Get the best cloud integration with LogiNext to get the best route planning, analytics, logistics operations scalability, and security using Amazon Web Services.'
  },
  'alibaba-cloud': {
    title: 'Alibaba Cloud',
    description: 'Want to enhance your Transportation Management Solution? LogiNext integrates with Alibaba cloud to help enhance scalability, reliability, and core computing power.'
  },
  'IBM-cloud': {
    title: 'IBM Cloud',
    description: 'With LogiNext and IBM Cloud tool integration, get the best mobile device management services for load balancing and enhanced artificial intelligence capabilities.'
  },
  'microsoft-azure': {
    title: 'Microsoft Azure',
    description: 'LogiNext has partnered with Microsoft Azure to offer the best cloud computing, scalability, security, and database solutions to enhance logistics operations.',
  },
  'zoho': {
    title: 'Zoho',
    description: 'LogiNext has complete integration with a full suite of Zoho products to give businesses streamlined analytics, reports, and invoices for logistics automation.'
  },
  'Shopify': {
    title: '',
    description: 'LogiNext offers Shopify integration to help businesses optimize each aspect of shipment movement from order placement to fleet tracking for the last mile.'
  },
  'Capillary-Martjack': {
    title: 'Capillary Martjack',
    description: 'Want to optimize your omnichannel logistics & offer shipment tracking to improve the delivery experience? LogiNext can integrate with Capillary-Martjack for this.'
  },
  'Magento': {
    title: 'Magento',
    description: `Magento offers a comprehensive suite of integration support to help
    businesses seamlessly connect their existing operational systems, creating a plug-and-play operating system for logistics`,
  },
  'sendgrid': {
    title: 'Sendgrid',
    description: 'LogiNext offers SendGrid integration to help clients with a superior cloud-based email automation platform to ensure timely alerts and notifications are sent.'
  },
  'oracle': {
    title: 'Oracle',
    description: 'LogiNext can be integrated with Oracle- the leading ERP in the world. This helps with seamless integrations across platforms and applications to be go-live ready.'
  },
  'oracle-transportation-management': {
    title: 'Oracle Transportation Management',
    description: 'LogiNext can be integrated with Oracle Transportation Management with APIs to improve route planning efficiency and enhance fleet operations & efficiency.'
  },
  'google': {
    title: 'Google',
    description: 'With LogiNext, get the best live traffic analysis, accurate ETAs, and pinpoint location information with Google integration to get data using APIs for logistics.'
  },
  'osm': {
    title: 'OSM',
    description: `Osm offers a comprehensive suite of integration support to help
    businesses seamlessly connect their existing operational systems, creating a
    plug-and-play operating system for logistics`
  },
  'here-map': {
    title: 'Here Map',
    description: 'LogiNext comes with pre-integrated Here Maps to help with accurate mapping and location analytics to get the best-on-ground visibility for logistics operations.'
  },
  'concox': {
    title: 'Concox',
    description: 'Want help with hardware integrations for your TMS? LogiNext helps integrate with Concox to get accurate route-planning and route optimization using AI & ML.'
  },
  'trimble': {
    title: 'Trimble',
    description: 'Need better visibility and tracking for long-haul movements? LogiNext can integrate with Trimble to get you live-tracking for long-haul orders with ease.'
  },
  'twilio': {
    title: 'Twilio',
    description: 'Want to send SMSs, alerts, and notifications via APIs? LogiNext offers easy integration with a Twilio account to help improve customer experience in logistics.'
  },
  'solutions-infini': {
    title: 'Solutions Infini',
    description: 'Are you looking for an SMS integration for your logistics needs? LogiNext’s instant alerts can be readily integrated with Solutions Infini for the best results.'
  },
  'paytm': {
    title: 'Paytm',
    description: 'LogiNext can be integrated with multiple payment integrations, of which Paytm is one of the top platforms to give the best delivery experience to customers.'
  },
  'mswipe': {
    title: 'MSwipe',
    description: 'LogiNext can be integrated with MSwipe to offer businesses a safe & secure payment line for their customers, giving real-time visibility for on-ground payments.'
  },
  'mosambee': {
    title: 'Mosambee',
    description: `Looking for payment integrations for logistics operations? LogiNext's integration with
    Mosambee offers customers multiple safe payment options for deliveries.`
  },
  'grey-orange': {
    title: 'GreyOrange',
    description: 'LogiNext offers WMS integrations using GreyOrange to completely streamline sorting, loading, and dispatch at warehouses for the best logistics automation.'
  },
  'jda-warehoues-management': {
    title: 'HDA Warehoues Management',
    description: 'Optimize your logistics operations by integrating LogiNext with JDA Warehouse Management to ensure that all shipments flow seamlessly from warehouse to delivery.'
  },
  'salesforce': {
    title: 'Salesforce',
    description: 'Ensure smooth last-mile deliveries when LogiNext integrates with the Salesforce CRM application to improve your operations visibility and customer experience.'
  },
  'microsoft-dynamics': {
    title: 'Microsoft Dynamics',
    description: 'Scale your business by integrating your Microsoft Dynamics CRM with LogiNext’s multiple APIs and core systems to streamline your logistics operations with ease.'
  },
  'IBM-Watson-Commerce': {
    title: 'IBM Watson Commerce',
    description: 'LogiNext offers OMS/eCommerce integration with Magento to get real-time delivery updates, route planning, and exhaustive customer profiling capabilities.'
  },
  'SAP-Hybris': {
    title: 'SAP Hybris',
    description: 'Give your customers a great delivery experience with an OMS integration for a seamless delivery route planning engine. Integrate LogiNext with SAP Hybris today!'
  },
  'web-jaguar': {
    title: 'Web Jaguar',
    description: `LogiNext's Comprehrensive suite of Integration support let's you seamlessly connect your existing Operational systems 
    that allow a plug & play operating system for your logistics.`
  },
  'Grab': {
    title: 'Grab',
    description: `LogiNext's Comprehrensive suite of Integration support let's you seamlessly 
    connect your existing Operational systems that allow a plug & play operating system for your logistics.`
  },
  'Pandago': {
    title: 'Pandago',
    description: 'LogiNext offers carrier integration with Pandago to help with services like the delivery of parcels, documents & gifts with real-time tracking of the delivery.'
  },
  'Uber-Eats': {
    title: 'Uber Eats',
    description: 'Want to ensure fast and hot food deliveries? LogiNext helps with carrier integration with Uber Eats to ensure on-time and meet on-demand delivery needs.'
  },
  'Orderin': {
    title: 'Orderin',
    description: 'LogiNexts integration with Orderin helps with B2B on-demand and scheduled deliveries. Optimize your fleet management software to the fullest with this integration.'
  },
  'FedEx': {
    title: 'FedEx',
    description: 'Need additional carriers to get deliveries completed on time? LogiNext can help with seamless carrier integration with FedEx for guaranteed on-time deliveries.'
  },
  'DHL': {
    title: 'DHL',
    description: `LogiNext's Comprehrensive suite of Integration support let's you seamlessly connect your existing 
    Operational systems that allow a plug & play operating system for your logistics.`
  },
  'sap': {
    title: 'SAP',
    description: `LogiNext's integration with SAP allows your transport management system to meet all your difficulties related to 
    transportation planning and optimization.`
  },
}


export { data , menuList , metaData }
