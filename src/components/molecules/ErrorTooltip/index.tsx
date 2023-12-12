import React from 'react'
import Tooltip from '../Tooltip'
import Box from '../../atoms/Box'
import Typography from '../../atoms/Typography'

export interface ErrorTooltipProps {
  message?: string
  boundLeft?: number
  isWordWrap?: boolean
}

const ErrorTooltip = ({
  message = '',
  boundLeft,
  isWordWrap = false
}: ErrorTooltipProps) => (
  <Tooltip
    hover
    tooltipDirection='top'
    arrowPlacement='center'
    messagePlacement='end'
    color={{
      arrow: 'error.main',
      border: 'error.main',
      background: 'error.light',
      text: 'error.main'
    }}
    message={message}
    boundLeft={boundLeft}
    isWordWrap={isWordWrap}
  >
    <Box
      borderRadius='50%'
      style={{ width: '15px', height: '15px', cursor: 'default' }}
      bgColor='error.main'
      color='error.contrastText'
      display='flex'
      alignItems='center'
      justifyContent='center'
      id='error-tooltip'
    >
      <Typography
        fontSize='11px'
        lineHeight='11px'
        style={{ width: '15px', textAlign: 'center' }}
      >
        !
      </Typography>
    </Box>
  </Tooltip>
)

export { ErrorTooltip as default }
