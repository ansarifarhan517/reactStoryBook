import React from 'react'

import ModalTriggerButton from '@/components/modal-trigger-button'
import ConfigurationSection from '@/components/configuration-section'
import MidContentSection from '@/components/mid-content-section'

import './style.scss'

const blk = 'security-features'

const SecurityFeatures = () => (
  <div className={blk}>
    <>
      <MidContentSection
        title="Service disruptions? Not a chance!"
        description={`All your web dashboards and mobile apps would function at their best
        everywhere and all the time.`}
      >
        <ModalTriggerButton
          modalType="talk-to-us"
          category="primary"
          outline
        >
          Learn More
        </ModalTriggerButton>
      </MidContentSection>

      <ConfigurationSection
        iconSize="xxxlg"
        data={[
          {
            id: 'large-mile-delivery-schedule-planning-preferred-time-slots',
            icon: 'large-mile-delivery-schedule-planning-preferred-time-slots',
            title: 'Absolute Zero Downtime',
            description:
              'Our planning and visibility take no break. Move your shipments with zero downtime.',
          },
          {
            id: 'large-home-slider-courier',
            icon: 'large-home-slider-courier5',
            title: 'Complete Reliability',
            description:
              'Plan with the same speed and accuracy from anywhere in the world, across platforms.',
          },
          {
            id: 'large-mile-mobile-white-labeling',
            icon: 'large-mile-mobile-white-labeling',
            title: 'Mobile Device Management',
            description:
              'Manage and secure the data within each mobile device remotely from a central system.',
          },
        ]}
        hoverEffect
        columns="3"
      />
    </>
  </div>
)

export default SecurityFeatures
