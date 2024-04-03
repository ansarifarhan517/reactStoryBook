'use client'

import { useContext } from 'react'
import AppContext from '@/context'

import Modal from '../modal'

import './style.scss'

const blk = 'schedule-a-demo'

const ScheduleADemoPopup = () => {
  const { scheduleDemo, toggleScheduleDemoModal } = useContext(AppContext)
  if (!scheduleDemo) {
    return null
  }
  return (
    <Modal isClosable className={blk} closeHandler={toggleScheduleDemoModal}>
      <iframe
        src="https://meetings.hubspot.com/onkar-vengurlekar?embed=true&parentHubspotUtk=5cafcf45648e95db69a438b886cda5cc&parentPageUrl=https://www.loginextsolutions.com/"
        width="100%"
        height="100%"
      />
    </Modal>
  )
}

export default ScheduleADemoPopup
