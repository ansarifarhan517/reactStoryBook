import { StaticImageData } from 'next/image'

import bloomberg from '/public/news-media/bloomberg.webp'
import businessInsider from '/public/news-media/business-insider.webp'
import businessLine from '/public/news-media/business-line.webp'
import cnbc from '/public/news-media/cnbc.webp'
import dailySpecialId from '/public/news-media/daily-special-id.webp'
import dealStreetAsia from '/public/news-media/deal-street-asia.webp'
import financialTimes from '/public/news-media/financial-times.webp'
import forbes from '/public/news-media/forbes.webp'
import indianTransportationLogisticsNews from '/public/news-media/indian-transport-logisitcs-news.webp'
import techInAsia from '/public/news-media/tech-in-asia.webp'
import techTarget from '/public/news-media/tech-target.webp'
import theBusinessTimes from '/public/news-media/the-business-times.webp'
import theEconomicTimes from '/public/news-media/the-economic-times.webp'
import yahooFinance from '/public/news-media/yahoo-finance.webp'

type newsMediaData = {
    id:string
    category: string
    name: string
    url: string
    source: string
    publishedOn: string
    image?: StaticImageData,
    content: string
    detailDescription: string
    newsLink: string
    meta?: string
}

const data : newsMediaData[] = [
  {
    id: 'single-post-partners',
    category: '',
    name: 'SingPost Partners with LogiNext\'s Delivery Route Planning',
    source: 'The Business Times',
    publishedOn: '2018-12-10 00:00:00',
    url: '/company/newsmedia/single-post-partners',
    image: theBusinessTimes,
    content: `Singapore Post (SingPost) partners with LogiNext to boost their parcel
    movement with advanced delivery route planning, auto-parcel allocation, and live
    courier movement tracking to give end-to-end delivery visibility.`,
    detailDescription: `SingPost is integrating machine learning and AI route planning software
    from LogiNext into its regional logistics platform, LaMP. This will allow the platform to
    optimize courier delivery routes based on factors such as parcel destinations, customer
    preferences, and real-time ground data including traffic and weather conditions, in all
    South-east Asia markets covered by LaMP. The software will also be able to predict courier
    movements and send customers an alert half-an-hour before their parcel arrives. This is an
    improvement particularly in dense cities such as Bangkok and Jakarta "where customers are
    generally provided vague parcel arrival times due to a myriad of reasons such as traffic
    jams and extreme weather conditions", said SingPost.`,
    newsLink: 'https://www.businesstimes.com.sg/companies-markets/singpost-to-use-ai-to-improve-parcel-traceability-reliability-for-customers-across'
  },
  {
    id: 'loginext-ranked-21',
    category: '',
    name: 'LogiNext ranked 21st in FT 1000 High Growth Companies ',
    source: 'Financial Times',
    publishedOn: '2018-02-12 00:00:00',
    url: '/company/newsmedia/loginext-ranked-21',
    image: financialTimes,
    content: 'LogiNext ranks 21st and 2nd Indian Company in the Financial Times Top 1000 ',
    detailDescription: `The inaugural FT 1000 High-Growth Companies Asia-Pacific list considered
    companies based in 11 of the regionâ€™s more developed markets: Australia, Hong Kong, India,
    Indonesia, Japan, Malaysia, New Zealand, the Philippines, Singapore, South Korea and Taiwan.
    Those that participated have been ranked according to the percentage growth in their revenues
    between 2013 and 2016.`,
    newsLink: 'https://ig.ft.com/special-reports/ft-1000/asia-pacific/2018/'
  },
  {
    id: 'voice-control-logistics',
    category: '',
    name: 'Voice Controlled Logistics Management is Finally Here!',
    source: 'Business Insider: Markets Insider',
    publishedOn: '2018-01-31 00:00:00',
    url: '/company/newsmedia/voice-control-logistics',
    image: businessInsider,
    content: 'LogiNext launches its voice-controlled automation feature as it integrates with Alexa, Siri, Google Assistant, and Cortana.',
    detailDescription: `LogiNext launches its voice-controlled automation feature as it integrates
    with Alexa, Siri, Google Assistant, and Cortana. LogiNext is working on this with five enterprise
    clients and looking to do more pilots. The clients can now just talk to their digital assistants
    and get all the required information about their logistics movement instantaneously. They can
    give instructions to LogiNext's system to optimize routes, plan delivery schedules or assign a
    specific order to a delivery personnel. With LogiNext's voice-controlled automation, managers
    can plan the entire schedule and route with load balancing across the last mile fleet and send
    ETAs by just talking to the LogiNext system. If they want a specific parcel to be assigned to
    a courier who is more well-equipped to deliver it, they can simply say so and it would be done.
    It can carry out dispatch automation with a single skill-defined command.`,
    newsLink: 'http://markets.businessinsider.com/news/stocks/Voice-Controlled-Logistics-Management-is-Finally-Here-1014689912'
  },
  {
    id: 'google-suppy-chain-logistics',
    category: '',
    name: 'Dhruvil Sanghvi is working to make LogiNext the Google of supply-chain logistics',
    source: 'Forbes India',
    publishedOn: '2017-02-17 00:00:00',
    url: '/company/newsmedia/google-suppy-chain-logistics',
    image: forbes,
    content: `Forbes 30 Under 30 Lister (2017), Dhruvil Sanghi has ambitious plans for
    seeing logistics optimization mature with machine-learning and IoT. â€œLogiNext could
    become the Google of this space as its software helps manage and organize information
    about anyt`,
    detailDescription: `Forbes 30 Under 30 Lister (2017), Dhruvil Sanghi has ambitious plans for
    seeing logistics optimization mature with machine-learning and IoT. â€œLogiNext could become
    the Google of this space as its software helps manage and organize information about anything
    and everything that moves,â€ says Sanjay Mehta, Angel investor. By end of 2015, Sanghvi, CEO,
    and Manisha Raisinghani, CTO LogiNext, had built their product and business to a level where it
    caught the attention of Alibaba-backed mobile wallet services provider Paytm, and raised $10 million
    from it. â€œThey [Paytm] became both our largest investor and largest customer,â€ says Sanghvi.`,
    newsLink: 'http://www.forbesindia.com/article/30-under-30-2017/dhruvil-sanghvi-is-working-to-make-loginext-the-google-of-supplychain-logistics/45877/1'
  },
  {
    id: 'dhruvil-sanghvi-cnbc',
    category: 'product-upgrade',
    name: 'Dhruvil Sanghvi interviewed by Martin Soong, CNBC',
    source: 'CNBC',
    publishedOn: '2017-11-10 00:00:00',
    url: '/company/newsmedia/dhruvil-sanghvi-cnbc',
    image: cnbc,
    content: `Dhruvil Sanghvi talks about how logistics optimization is the backbone of
    mega shopping festivals like 'Singles Day' conducted by Jack Ma, Alibaba.com.`,
    detailDescription: `Dhruvil Sanghvi talks about how logistics optimization is the backbone of
    mega shopping festivals like 'Singles Day' conducted by Jack Ma, Alibaba.com. Watch this
    exclusive interview to gain valuable insights about how these super events are actually
    executed at the ground-level.`,
    newsLink: 'https://www.cnbc.com/video/2017/11/09/this-firm-helps-reach-the-last-mile-in-delivery-logistics.html'
  },
  {
    id: 'lion-parcel-umumkan',
    category: '',
    name: 'Lion Parcel Umumkan Kemitraan dengan Perusahaan Optimasi Logistik LogiNext',
    source: 'Daily Social',
    publishedOn: '2017-11-22 00:00:00',
    url: '/company/newsmedia/lion-parcel-umumkan',
    image: dailySpecialId,
    content: `Lion Parcel, anak usaha dari Lion Air Group, mengumumkan kemitraan dengan
    perusahaan optimasi logistik LogiNext untuk meningkatkan efisiensi manajemen jasa
    pengiriman e-commerce, sekaligus pemenuhan kebutuhan logistik di Indonesia.`,
    detailDescription: `Lion Parcel, anak usaha dari Lion Air Group, mengumumkan kemitraan dengan
    perusahaan optimasi logistik LogiNext untuk meningkatkan efisiensi manajemen jasa pengiriman
    e-commerce, sekaligus pemenuhan kebutuhan logistik di Indonesia. LogiNext adalah perusahaan
    yang bergerak di solusi SaaS untuk optimasi logistik. Perusahaan ini memiliki produk andalan
    untuk last mile, field force, on-demand delivery, dan line haul express manajemen. Alasan Lion
    Parcel menggandeng LogiNext, lantaran perusahaan ini piawai dalam effective last mile optimization.
    Selain itu, perusahaan memiliki banyak pengalaman membantu perusahaan e-commerce untuk menerapkan
    langkah optimasi logistik dalam pengerjaan berbagai pengiriman paket yang tepat waktu. Dengan
    optimasi jalur dan otentikasi pencatatan yang efektif.`,
    newsLink: 'https://dailysocial.id/post/lion-parcel-umumkan-kemitraan-dengan-perusahaan-optimasi-logistik-loginext'
  },
  {
    id: 'bloomberg-dhruvil-sanghavi',
    category: '',
    name: 'Interview with Dhruvil Sanghvi: Logistics in 2018 and the importance of the Last Mile',
    source: 'Bloomberg Radio',
    publishedOn: '2018-01-11 00:00:00',
    url: '/company/newsmedia/bloomberg-dhruvil-sanghavi',
    image: bloomberg,
    content: 'Dhruvil Sanghvi, CEO, Loginext, joined Juliette Saly and Doug Krizner to discuss trends in the logistics sector in 2018.',
    detailDescription: `Dhruvil Sanghvi, CEO, Loginext, joined Juliette Saly and Doug Krizner to
    discuss trends in the logistics sector in 2018. He sees the last mile as being the biggest
    focus, with machine learning and AI being of huge importance. He also considered smart
    inventory solutions and the use of the cloud.`,
    newsLink: 'https://www.bloomberg.com/news/audio/2018-01-11/logistics-and-the-last-mile-in-2018'
  },
  {
    id: 'how-machine-learning',
    category: '',
    name: 'How machine learning streamlines location data with the Kalman filter',
    source: 'TechTarget',
    publishedOn: '2018-01-18 00:00:00',
    url: '/company/newsmedia/how-machine-learning',
    image: techTarget,
    content: `The Kalman filter is an innovative data cleansing method discovered initially
    by NASA for its Apollo missions. Since then, the filter has been randomly used for route 
    and location corrections. The idea is that the filter recognizes sudden deviations`,
    detailDescription: `Machine learning and the internet of things as tools to optimize location
    analytics in logistics and supply chain management. Itâ€™s an accepted fact that technology,
    especially cloud-based, can benefit companies by optimizing routes and predicting the accurate
    estimated time of arrivals (ETAs). The direct business value of this optimization lies in the
    streamlining of various fixed and variable costs associated with logistics.`,
    newsLink: 'http://internetofthingsagenda.techtarget.com/blog/IoT-Agenda/How-machine-learning-streamlines-location-data-with-the-Kalman-filter'
  },
  {
    id: 'paytm-backed-logiNext-partners',
    category: '',
    name: 'Paytm-backed LogiNext partners IBM to streamline e-commerce supply chain',
    source: 'Deal Street',
    publishedOn: '2017-11-21 00:00:00',
    url: '/company/newsmedia/paytm-backed-logiNext-partners',
    image: dealStreetAsia,
    content: `Paytm-backed Mumbai-based logistics analytics startup LogiNext has teamed up
    with global technology giant IBM in a partnership aimed at optimising supply chain
    functions for e-commerce, retail and allied sectors.`,
    detailDescription: `Paytm-backed Mumbai-based logistics analytics startup LogiNext has teamed
    up with global technology giant IBM in a partnership aimed at optimising supply chain functions
    for e-commerce, retail and allied sectors. â€This (partnership) will allow FMCG, e-commerce,
    retail and transportation companies to optimize their logistics and supply chain from resource,
    time, distance and cost point of view. At the same time, it allows companies to improve their
    customer experience with real time visibility across the supply chainâ€, LogiNext CEO Dhruvil
    Singhvi told DEALSTREETASIA. LogiNext will now become pre-integrated with IBM cloud, IBM Order
    Management, IBM MDM MaaS 360 and IBM Weather Company. LogiNext is also in talks with IBM to use
    more machine learning APIs of Watson.`,
    newsLink: 'https://www.dealstreetasia.com/stories/tue-or-till-ibm-quote-comes-exclusive-paytm-backed-loginext-partners-with-ibm-to-streamline-e-commerce-supply-chain-86753/'
  },
  {
    id: 'decathlon-to-lean-on-paytm-backed-logiNext',
    category: '',
    name: 'Decathlon to lean on Paytm-backed LogiNext, Alibaba to improve logistics',
    source: 'Hindu Business Line',
    publishedOn: '2017-09-27 00:00:00',
    url: '/company/newsmedia/decathlon-to-lean-on-paytm-backed-logiNext',
    image: businessLine,
    content: 'Delivery management and optimisation will play a key role in bridging the supply and demand, says CEO Sanghvi',
    detailDescription: `The France-based retailer will be using the technology expertise of Alibaba
  and Paytm-backed LogiNext, a SaaS-based logistics and field workforce optimisation start-up
  based out of Mumbai. LogiNext will help Decathlon expand its distribution network in several
  developing markets, to grow its business outside its biggest market Europe, using machine learning
  algorithms that are designed to read traffic and by leveraging historical delivery movement information
  for weather patterns.`,
    newsLink: 'https://www.thehindubusinessline.com/news/decathlon-to-lean-on-paytmbacked-loginext-alibaba-to-improve-logistics/article9875910.ece'
  },
  {
    id: 'largest-sporting-goods-retailer',
    category: '',
    name: 'Largest Sporting Goods Retailer, Decathlon Boosts Ground-Level Distribution Visibility with LogiNext',
    source: 'Yahoo Finance',
    publishedOn: '2017-09-28 00:00:00',
    url: '/company/newsmedia/largest-sporting-goods-retailer',
    image: yahooFinance,
    content: 'The largest sporting goods retailer worldwide ties up with the one of the leading SaaS companies in logistics and field workforce optimization.',
    detailDescription: `The largest sporting goods retailer worldwide ties up with the one of the
  leading SaaS companies in logistics and field workforce optimization. Decathlon partners with
  LogiNext to extend the power of its superior distribution network in multiple developing
  markets. Through this partnership it looks to recreate its French market domination in other
  countries. Through machine learning algorithms designed to read traffic and weather patterns
  from historical delivery movement information, LogiNext has managed to set up a unique solution
  set for Decathlon that offers exceptional logistics movement visibility across geographies.
  Along with movement visibility, hub-load analytics around fleet movement can be automated
  using LogiNextâ€™s planning engine. Tracking the fleet vehicles through a centralized
  controlling dashboard, Decathlon can plan their delivery routes and estimated time of
  arrivals backed by actual real-time, ground-level location analytics. This would help
  them eliminate bot`,
    newsLink: 'https://finance.yahoo.com/news/largest-sporting-goods-retailer-decathlon-110000568.html'
  },
  {
    id: 'focusing-on-customer-experience',
    category: '',
    name: 'Focusing on customer experience, Myntra signs up LogiNext to track order shipments',
    source: 'Economic Time',
    publishedOn: '2016-09-09 00:00:00',
    url: '/company/newsmedia/focusing-on-customer-experience',
    image: theEconomicTimes,
    content: `Myntra has signed up with logistics technology platform LogiNext for real-time
  tracking of shipments and is piloting with the platform's location mapping product for
  improved intracity logistics.`,
    detailDescription: `Myntra has signed up with logistics technology platform LogiNext for
  real-time tracking of shipments and is piloting with the platform's location mapping product
  for improved intracity logistics. With these capabilities, Myntra hopes to improve customer
  experience and make its captive logistics arm, Myntra Logistics, more efficient.
  The logistics arm of Myntra handles the differentiated services on offer, including
  'try-and-buy' service, which was launched across 10 cities after being piloted in Bengaluru.`,
    newsLink: 'https://economictimes.indiatimes.com/small-biz/startups/focusing-on-customer-experience-myntra-signs-up-loginext-to-track-order-shipments/articleshow/54205376.cms'
  },
  {
    id: 'what-i-learned-brilliant-people',
    category: '',
    name: 'What I learned from the brilliant people who attended the Forbes summit in Manila',
    source: 'TechinAsia',
    publishedOn: '2017-07-11 00:00:00',
    url: '/company/newsmedia/what-i-learned-brilliant-people',
    image: techInAsia,
    content: `At Forbes Under 30 Summit in Manila, I couldn't help but marvel at how the
  power of innovation is bridging cultural and generational gaps across the world.`,
    detailDescription: `I was back in Manila! It seems like a second home now. I love the people
  and culture, which is not far from what I have experienced in the US, Middle East, and South
  Asia. As a company, we have spread wings across the globe but Southeast Asia is where I find
  the perfect summation and confluence of cultures. There is a great balance between tradition
  and innovation.`,
    newsLink: 'https://www.techinasia.com/talk/asian-startup-ecosystem-forbes-summit'
  },
  {
    id: 'the-race-for-speedy-delivery',
    category: '',
    name: 'The race for â€˜speedy deliveryâ€™',
    source: 'ITLN',
    publishedOn: '2016-11-16 00:00:00',
    url: '/company/newsmedia/the-race-for-speedy-delivery',
    image: indianTransportationLogisticsNews,
    content: `The Indian e-commerce space is currently at an inflection point and there
  is tremendous opportunity for growth. With the increasing consumer demand for fastest
  deliveries, e-commerce giants are enhancing logistics services to make the delivery race `,
    detailDescription: `â€œWe will meet 90 percent of our target this year. We will be crossing
  1.5 lakh shipments a day which are being processed on our platform. Optimisation and
  visibility can only happen with technology entering the sector. All of these companies are
  tech savy but are reluctant to invest heavily in technology,â€ said Dhruvil Sanghvi,
  co-founder and chief executive of LogiNext.`,
    newsLink: 'http://www.itln.in/index.php/from-magazine-the-race-for-speedy-delivery/'
  },
  {
    id: 'b2b-startups-hold',
    category: '',
    name: 'B2B startups hold their ground even as B2C peers feel the heat of weakening investor sentiment',
    source: 'Economic Times',
    publishedOn: '2016-10-01 00:00:00',
    url: '/company/newsmedia/b2b-startups-hold',
    image: theEconomicTimes,
    content: 'Amazon gets much larger profit margins from its B2B business than its B2C marketplace, says Sanghvi. ',
    detailDescription: `The stickiness of the need-based nature of business-to-business (B2B) startups
  and the attendant financial virtues, including negligible cash burn, help them cope in an
  environment where investors, singed by obscene spending and reckless scaling-up by business-to-consumer
  (B2C) startups, tighten their purse strings.`,
    newsLink: 'https://economictimes.indiatimes.com/small-biz/startups/b2b-startups-hold-their-ground-even-as-b2c-peers-feel-the-heat-of-weakening-investor-sentiment/articleshow/54618920.cms'
  },
  {
    id: 'paytm-to-invest-in-loginext',
    category: '',
    name: 'Paytm to invest $10 mn in logistics data firm LogiNext',
    source: 'The Economic Times',
    publishedOn: '2015-09-23 00:00:00',
    url: '/company/newsmedia/paytm-to-invest-in-loginext',
    image: theEconomicTimes,
    content: 'Mobile commerce platform Paytm today said it is investing $10 million in logistics data start-up company, LogiNext.',
    detailDescription: `"While large logistics companies have great in-house tech capabilities,
  smaller players have limited access to good technologies. To solve this, we are building a
  strong logistics cloud network for our merchants and courier partners," said Kiran Vasireddy,
  Senior Vice President at Paytm.`,
    newsLink: 'https://economictimes.indiatimes.com/small-biz/startups/paytm-to-invest-10-mn-in-logistics-data-firm-loginext/articleshow/49079301.cms'
  },
  {
    id: 'raw-pressery',
    category: '',
    name: 'RAW pressery brings on board LogiNextâ€™s last mile delivery solution â€˜Mileâ€™',
    source: ' Economic Times',
    publishedOn: '2016-10-10 00:00:00',
    url: '/company/newsmedia/raw-pressery',
    image: theEconomicTimes,
    content: `Cold-pressed juice delivery firm RAW Pressery has tied up with LogiNext
  Solutions to plug the loopholes in its last mile delivery operations through
  LogiNext's solution Mile. `,
    detailDescription: `Cold-pressed juice delivery firm RAW Pressery has tied up with LogiNext
  Solutions to plug the loopholes in its last mile delivery operations through LogiNextâ€™s
  solution â€˜Mileâ€™. This provides automated delivery schedules, route optimization, and
  resource capacity helping to reduce the number of kilometres travelled.
  Mile also provides real-time tracking and notifications via its mobile app as well as
  cloud computing. Logistical movement has been a challenge for RAW Pressery, since its
  products need to be kept in a cold chain with temperatures varying between 0-8 degrees Celsius, and have a perishable shelf life of 21 days.`,
    newsLink: 'https://economictimes.indiatimes.com/industry/cons-products/food/raw-pressery-brings-on-board-loginexts-last-mile-delivery-solution-mile/articleshow/54778994.cms'
  }]

const menuList = [
  {
    id: 'all',
    label: 'Show All News',
  },
  {
    id: 'product-upgrade',
    label: 'Product Upgrade'
  },
  {
    id: 'partnership',
    label: 'Partnerships and Client Acquisition',
  },
  {
    id: 'growth',
    label: 'Growth Story',
  },
  {
    id: 'leadership',
    label: 'Thought Leadership',
  }
]

type metaData ={
  [key : string] : {
    title: string;
    description: string;
  }
}

const metaData : metaData = {
  'single-post-partners': {
    title: 'Singapore Post Partners With LogiNext For Live Delivery Route Planning',
    description: `Singapore Post partners with LogiNext to get complete visibility of their
    delivery operations and customer get parcel delivery alerts. Singapore Post Partners With
    LogiNext For Live Delivery Route Planning `
  },
}


export { data , menuList , metaData }
