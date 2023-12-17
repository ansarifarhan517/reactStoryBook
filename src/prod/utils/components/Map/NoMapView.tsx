import React from 'react'
import styled from 'styled-components'
import { Loader } from 'ui-library'

const StyledNoMapView = styled.div`
  background-color: ${({ theme }) => theme?.colors?.white};
`

const NoMapView = () => {
  return <StyledNoMapView id='noDataView'><Loader center /></StyledNoMapView>
}

export default NoMapView
