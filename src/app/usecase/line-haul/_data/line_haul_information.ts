import transportSoftwareSolutionsForLogisticsMovementAcrossContinents from '/public/use-case/line-haul/transport-software-solutions-for-logistics-movement-across-continents.webp'
import reduceDetentionTimeAtWarehouse from '/public/use-case/line-haul/reduce-detention-time-at-warehouse.webp'
import driverCompliance from '/public/use-case/line-haul/driver-compliance.webp'

const useCaseLineHaulDelivery = [{
  id: 'transport-software-solutions-for-logistics-movement-across-continents',
  image: transportSoftwareSolutionsForLogisticsMovementAcrossContinents,
  imagePosition: 'right',
  title: 'Transport Software Solutions for Logistics Movement Across Continents',
  description: 'Complete visibility and ETA of goods and parcel movement from hub to hub across several modes of transport, be it ground, sea or air.',
  features: [{
    id: 'real-time-map-visualization',
    label: 'Real Time Map Visualization: ',
    description: 'Map based view in real time of your end to end delivery operations.',
  },
  {
    id: 'alerts-and-notifications',
    label: 'Alerts & Notifications: ',
    description: 'Get instant alerts regarding any disruption in operations.',
  },
  {
    id: 'eliminate-manual-work',
    label: 'Eliminate Manual Work: ',
    description: 'Leverage the platform and digitally transform your processes.',
  }]
}, {
  id: 'reduce-detention-time-at-warehouse',
  image: reduceDetentionTimeAtWarehouse,
  imagePosition: 'left',
  title: 'Reduce Detention Time at Warehouse',
  description: 'Integrate with your WMS for seamless visibility of incoming shipments and volume information.',
  features: [
    {
      id: 'complete-visibility',
      label: 'Complete Visibility: ',
      description:'Map based view in real time of your end to end delivery operations.',
    },
    {
      id: 'easy-api-integration',
      label: 'Easy API Integration: ',
      description: 'LogiNext platform sits effortlessly on top of your existing systems.',
    },
    {
      id: '3d-packing-optimization',
      label: '3D Packing Optimization: ',
      description: 'Optimally load vehicles to optimize capacity utilization.',
    }]
},{
  id: 'driver-compliance',
  image: driverCompliance,
  imagePosition: 'right',
  title: 'Be in Compliance with Health and Safety Regulations',
  description: `Whether you are a transporter or a brand outsourcing to a transporter,
  get full visibility on the miles covered per day by each driver and break duration
  with the most comprehensive transportation logistics software.`,
  features: [
    {
      id: 'driver-compliance',
      label: 'Driver Compliance.',
      description: '',
    },
    {
      id: 'mandated-break-hours-alerts',
      label: 'Mandated Break Hours Alerts.',
      description: '',
    },
    {
      id: 'integrate-with-eld-Devices',
      label: 'Integrate with ELD Devices.',
      description: '',
    },
  ]
}]

export default useCaseLineHaulDelivery
