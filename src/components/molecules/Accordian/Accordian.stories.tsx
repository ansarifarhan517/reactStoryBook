import React from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import Accordian from '.'

import Box from '../../atoms/Box'

import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import {
  AccordionHeaderTitle,
  AccordionHeaderSubTitle,
  AccordionContent
} from './styles'

export default {
  title: `${path}/Accordian`,
  decorators: [withKnobs],
  component: Accordian
}

const AccordionComponent = () => {
  const [expanded, setExpanded] = React.useState('1')
  const handleToggle = (accordianId: string, isExpanded?: boolean) => {
    setExpanded(isExpanded ? accordianId : '')
  }

  const handleToggleChange = (e: any) => {
    console.log("toggledata", e)
  }

  const tooltipProps={
    messagePlacement:'end',
    arrowPlacement:'center',
    tooltipDirection:'bottom'
  }

  return (
    <>
       <Accordian id='1' expanded={expanded === '1'} onToggle={handleToggle} onToggleSwitch={handleToggleChange} switchTooltipMessage="Activate / Deactivate this setting" switchTooltipProps={tooltipProps} showToggleSwitch={true} toggleSwitchStyle={{paddingRight:"15px"}}>
        {{
          header: (
            <>
              <AccordionHeaderTitle>
                Minimum Capacity Utilization
              </AccordionHeaderTitle>
              <AccordionHeaderSubTitle>
                Helps you manage Fleet utilization
              </AccordionHeaderSubTitle>
            </>
          ),
          content: (
            <AccordionContent>
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>Line {i + 1} </div>
                ))}
            </AccordionContent>
          )
        }}
      </Accordian>
      <Accordian id='2' expanded={expanded === '2'} onToggle={handleToggle} onToggleSwitch={handleToggleChange} showToggleSwitch={true} toggleSwitchDisable={true} isToggleChecked={true}>
        {{
          header: (
            <>
              <AccordionHeaderTitle>Send Activation Link</AccordionHeaderTitle>
              <AccordionHeaderSubTitle>
                Send an activation link to the mobile number of a newly created
                Delivery Associate.
              </AccordionHeaderSubTitle>
            </>
          ),
          content: (
            <AccordionContent>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>Line {i + 1} </div>
                ))}
            </AccordionContent>
          )
        }}
      </Accordian>
      <Accordian id='3' expanded={expanded === '3'} onToggle={handleToggle} onToggleSwitch={handleToggleChange}>
        {{
          header: (
            <>
              <AccordionHeaderTitle>
                Delivery Associates Skill-sets configuration
              </AccordionHeaderTitle>
              <AccordionHeaderSubTitle>
                Select specific skills while adding a Delivery Associate.
                LogiNext Route planning will automatically assign the Shipments
                that a Delivery Associate is skilled to perform.
              </AccordionHeaderSubTitle>
            </>
          ),
          content: (
            <AccordionContent>
              {Array(15)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>Line {i + 1} </div>
                ))}
            </AccordionContent>
          )
        }}
      </Accordian>
    </>
  )
}
export const Default = () => {
  return (
    <ThemeWrapper>
      <Box p='1em' bgColor='grey.50'>
        <AccordionComponent />
      </Box>
    </ThemeWrapper>
  )
}
