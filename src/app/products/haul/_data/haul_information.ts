/* eslint-disable max-len */

import transportSoftwareForEnhanced from '/public/products/haul/transport-software-for-enhanced.webp'
import transportationManagementSystem from '/public/products/haul/transportation-management-system.webp'
import analyzeInDepthAndComprehensive from '/public/products/haul/analyze-in-depth-and-comprehensive.webp'

const productHaulInformation = [
  {
    id: 'transport-software-for-enhanced',
    image: transportSoftwareForEnhanced,
    imagePosition: 'right',
    title:
      'Transport Software for Enhanced Planning and Simplified Fleet Tracking and Management',
    description:
      'Ensure better fleet utilization with routes optimized for traffic and weather conditions, and higher capacity and distance covered.',
    features: [
      {
        id: 'optimize-fleet-capacity',
        label: 'Optimize Fleet capacity: ',
        description:
          'Reduce under-utilization or over-shooting of capacities to avoid losses due to empty spaces or spot-market buy-ins to cover excesses, respectively.',
      },
      {
        id: 'skill-set-based-fleet-assignment',
        label: 'Skill-set based fleet assignment: ',
        description:
          'Effectively match vehicles and driver skillsets with the shipment type and other requirements of each trip.',
      },
      {
        id: 'faster-and-better-routes',
        label: 'Faster and better routes: ',
        description:
          'Reduce the turnaround time for all vehicles while ensuring on-time drop-offs for all shipments by using routes optimized for traffic and weather.',
      },
    ]
  },
  {
    id: 'transportation-management-system',
    image: transportationManagementSystem,
    imagePosition:'left',
    title:
      'Transportation Management Systems to Track All Fleet Movement and Driver Behavior in Real-Time',
    description:
      'High compliance ratings for all service level agreements with timely ETA updates, delay or detention notifications, and delivery validation.',
    features: [
      {
        id: 'get-live-tracking-and-alerts',
        label: 'Get live tracking and alerts: ',
        description:
          'Receive live updates about the movement of all fleets as they pass any point of interest or near/reach an intermediate or destination hub/depot.',
      },
      {
        id: 'ensure-sla-and-safety-compliance',
        label: 'Ensure SLA and safety compliance: ',
        description:
          'Meet your region specific transportation compliance including off-time for drivers, route deviations, speed limits and other SLA requirements.',
      },
      {
        id: 'track-driver-behavior',
        label: 'Track driver behavior: ',
        description:
          'Track driver behavior including hours of service fulfilled, deviation from planned routes, speeding, unplanned stops or detention and driving in restricted time-slots.',
      },
    ],
  },
  {
    id: 'analyze-in-depth-and-comprehensive',
    title: 'Analyze In-Depth and Comprehensive Reports with the Best Transport Software',
    image: analyzeInDepthAndComprehensive,
    imagePosition: 'right',
    description:
      'Visually compare the performance of each driver or vehicle with in-depth reports showcasing current and historical movement analytics.',
    features: [
      {
        id: 'identify-operational-bottlenecks',
        label: 'Identify operational bottlenecks: ',
        description:
          'Ensure common bottlenecks such as key-traffic areas of risk-prone routes are avoided immediately after they are discovered or reported.',
      },
      {
        id: 'get-visual-reports-for-all-metrics',
        label: 'Get visual reports for all metrics: ',
        description:
          'Easily compare multiple metrics such as loading and unloading time at each hub, avoidable detention zones, fleet tracking, capacity utilization, etc.',
      },
      {
        id: 'analyze-driver-and-vehicle-performance',
        label: 'Analyze driver and vehicle performance: ',
        description:
          'Analyze the performance of each driver and vehicle to better direct them towards skill-set improvements or timely maintenance, respectively.',
      },
    ],
  },
]

export default productHaulInformation
