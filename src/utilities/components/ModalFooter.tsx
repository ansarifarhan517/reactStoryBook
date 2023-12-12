import React from 'react'
import Box from '../../components/atoms/Box'

const ModalFooter: React.FC = ({ children }) => (
  <Box
    horizontalSpacing='10px'
    display='flex'
    justifyContent='flex-end'
    p='15px'
  >
    {children}
  </Box>
)

export default ModalFooter
