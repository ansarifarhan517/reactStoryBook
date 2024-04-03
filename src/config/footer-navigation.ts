import navigation from './navigation'

const footerNavigation = [
  ...navigation,
  {
    id: 'support',
    label: 'Support',
    menu: [
      {
        id: 'api-integration',
        label: 'API & Integrations',
        href: '/integration',
      },
      {
        id: 'trust',
        label: 'Trust',
        href: '/trust',
      },
      {
        id: 'customer-login',
        label: 'Customer Login',
        href: 'https://products.loginextsolutions.com/login',
      },
      {
        id: 'end-user-license-agreement',
        label: 'End User License Agreement',
        href: '/end-user-license-agreement',
      },
      {
        id: 'feature-gallery',
        label: 'Feature Gallery',
        href: '/feature',
      },
      {
        id: 'security',
        label: 'Security ',
        href: '/security',
      },
    ],
    href: '/',
  },
  {
    id: 'distinctive-benefits',
    label: 'Distinctive Benefits',
    menu: [
      {
        id: 'live-tracking-of-delivery-movement',
        label: 'Live Tracking of Delivery Movement',
        href: '/products/on-demand/live-track-ondemand-deliveries-drivers',
      },
      {
        id: 'efficient-route-optimization',
        label: 'Efficient Route Optimization',
        href: '/products/mile/route-planning-software',
      },
      {
        id: 'automated-pickups-and-delivery',
        label: 'Automated Pickups and Delivery',
        href: '/products/reverse/multiple-pickups-drops-management-software',
      },
      {
        id: 'delivery-schedule-planning',
        label: 'Delivery Schedule Planning',
        href: '/products/mile/delivery-schedule-planning-software',
      },
    ],
    href: '/',
  },
  {
    id: 'spotlight-content',
    label: 'Spotlight Content',
    menu: [
      {
        id: 'elevate-your-deliveries-with-proven-strategies',
        label: 'Elevate Your Deliveries with Proven Strategies',
        href: 'https://www.loginextsolutions.com/blog/what-is-delivery-management-software-how-to-improve-delivery-experience',
      },
      {
        id: 'revolutionize-your-logistics-with-tms-excellence',
        label: 'Revolutionize Your Logistics with TMS Excellence',
        href: 'https://www.loginextsolutions.com/blog/best-transportation-management-software-guide',
      },
      {
        id: 'transform-logistics-with-the-ultimate-guide',
        label: 'Transform Logistics with the Ultimate Guide',
        href: 'https://www.loginextsolutions.com/blog/the-ultimate-guide-to-logistics-management-software-everything-you-need-to-know',
      },
      {
        id: 'the-ultimate-gGuide-tto-last-mile-delivery-solutions',
        label: 'The Ultimate Guide to Last Mile Delivery Solutions',
        href: 'https://www.loginextsolutions.com/blog/last-mile-delivery-software-importance-in-the-logistics-industry',
      },
    ],
    href: '/',
  },
]

export default footerNavigation
