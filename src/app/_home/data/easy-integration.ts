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
import WebJaguar from '/public/integration/web-jaguar.webp'
import grab from '/public/integration/grab.webp'
import pandago from '/public/integration/pandago.webp'
import uberEats from '/public/integration/uber-eats.webp'
import orderIn from '/public/integration/orderin.webp'
import fedex from '/public/integration/fedex.webp'
import dhl from '/public/integration/dhl.webp'
import sap from '/public/integration/sap.webp'

const easyIntegration = [{
  title: 'CRM',
  cssClass: 'crm',
  integration: [{
    id: 'salesforce',
    name: 'Salesforce',
    href: '/integration/salesforce',
    img: salesforce
  },
  {
    id: 'zoho',
    name: 'Zoho',
    href: '/integration/zoho',
    img: zoho
  },
  {
    id: 'microsoft-dynamics',
    name: 'Microsoft Dynamics',
    href: '/integration/microsoft-dynamics',
    img: microsoft
  }]
},
{
  title: 'SMS',
  cssClass: 'sms',
  integration: [{
    id: 'twilio',
    name: 'Twilio',
    href: '/integration/twilio',
    img: twilio
  },
  {
    id: 'solutions-infini',
    name: 'Solutions Infini',
    href: '/integration/solutions-infini',
    img: solutionsInfini
  }]
},
{
  title: 'OMS',
  cssClass: 'oms',
  integration: [{
    id: 'magento',
    name: 'Magento',
    href: '/integration/Magento',
    img: magento
  },
  {
    id: 'shopify',
    name: 'Shopify',
    href: '/integration/Shopify',
    img: shopify
  },
  {
    id: 'capillary-martjack',
    name: 'Capillary Martjack',
    href: '/integration/Capillary-Martjack',
    img: capillary
  },
  {
    id: 'ibm-watson-commerce',
    name: 'IBM Watson Commerce',
    href: '/integration/IBM-Watson-Commerce',
    img: ibmWatson
  },
  {
    id: 'sap-hybris',
    name: 'SAP Hybris',
    href: '/integration/SAP-Hybris',
    img: sapHybris
  }]
},
{
  title: 'CLOUD',
  cssClass: 'cloud',
  integration: [{
    id: 'amazon',
    name: 'Amazon web services',
    href: '/integration/amazon-web-services',
    img: aws
  },
  {
    id: 'alibaba',
    name: 'Alibaba cloud',
    href: '/integration/alibaba-cloud',
    img: alibaba
  },
  {
    id: 'microsoft-azure',
    name: 'Microsoft azure',
    href: '/integration/microsoft-azure',
    img: azure
  },
  {
    id: 'ibm-cloud',
    name: 'IBM Cloud',
    href: '/integration/IBM-cloud',
    img: ibmCloud
  }]
},
{
  title: 'ERP',
  cssClass: 'erp',
  integration: [{
    id: 'oracle',
    name: 'Oracle',
    href: '/integration/oracle',
    img: oracle
  }]
},
{
  title: 'HARDWARE',
  cssClass: 'hardware',
  integration: [{
    id: 'concox',
    name: 'Concox',
    href: '/integration/concox',
    img: concox
  },
  {
    id: 'trimble',
    name: 'Trimble',
    href: '/integration/trimble',
    img: trimble
  }]
},
{
  title: 'WMS',
  cssClass: 'wms',
  integration: [{
    id: 'grey-orange',
    name: 'Grey Orange',
    href: '/integration/grey-orange',
    img: greyOrange
  },
  {
    id: 'jda-warehouse',
    name: 'JDA Warehouse Management',
    href: '/integration/jda-warehoues-management',
    img: jda
  }]
},
{
  title: 'PAYMENT',
  cssClass: 'payment',
  integration: [{
    id: 'paytm',
    name: 'Paytm',
    href: '/integration/paytm',
    img: paytm
  },
  {
    id: 'm-swipe',
    name: 'M Swipe',
    href: '/integration/mswipe',
    img: mSwipe
  },
  {
    id: 'mosambee',
    name: 'Mosambee',
    href: '/integration/mosambee',
    img: mosambee
  },
  {
    id: 'momoe',
    name: 'Momoe',
    href: '/integration/momoe',
    img: momoe
  },
  {
    id: 'midtrans',
    name: 'Midtrans',
    href: '/integration/midtrans',
    img: midtrans
  }]
},
{
  title: 'TMS',
  cssClass: 'tms',
  integration: [{
    id: 'sap',
    name: 'SAP',
    href: '/integration/sap',
    img: sap
  },
  {
    id: 'otm',
    name: 'Oracle Transportation Management (OTM)',
    href: '/integration/oracle-transportation-management',
    img: otm
  }]
},
{
  title: 'MAP',
  cssClass: 'map',
  integration: [{
    id: 'google',
    name: 'Google',
    href: '/integration/google',
    img: google
  },
  {
    id: 'here-map',
    name: 'Here Maps',
    href: '/integration/here-map',
    img: here
  },
  {
    id: 'osm',
    name: 'Open Street Map',
    href: '/integration/osm',
    img: osm
  }]
},
{
  title: 'CARRIERS',
  cssClass: 'carriers',
  integration: [{
    id: 'pando-go',
    name: 'Pando Go',
    href: '/integration/Pandago',
    img: pandago
  },
  {
    id: 'grab',
    name: 'Grab',
    href: '/integration/Grab',
    img: grab
  },
  {
    id: 'dhl',
    name: 'DHL',
    href: '/integration/DHL',
    img: dhl
  },
  {
    id: 'fedex',
    name: 'FedEx',
    href: '/integration/FedEx',
    img: fedex
  },
  {
    id: 'order-in',
    name: 'Order In',
    href: '/integration/Orderin',
    img: orderIn
  },
  {
    id: 'uber-eats',
    name: 'Uber Eats',
    href: '/integration/Uber-Eats',
    img: uberEats
  }]
},
{
  title: 'EMAIL',
  cssClass: 'email',
  integration: [{
    id: 'send-grid',
    name: 'SendGrid',
    href: '/integration/sendgrid',
    img: sendGrid
  }]
}]

export {
  easyIntegration,
}
