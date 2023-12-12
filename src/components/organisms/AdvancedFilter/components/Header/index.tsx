import React from 'react'
import { HeaderWrapper, IconButtonStyled } from './styled'

const AdvancedFilterHeader = ({
  closeAdvancedFilter,
  backButton,
  backButtonCallback
}: any) => (
  <HeaderWrapper type='relative' display='block' id='advancedFilterHeader'>
    <div>
      {backButton && (
        <IconButtonStyled
          onClick={backButtonCallback}
          intent='default'
          iconVariant='angle-left-thin'
          onlyIcon
          iconSize='xs'
          color='white'
        />
      )}{' '}
      Advanced Filters
    </div>

    <IconButtonStyled
      onClick={closeAdvancedFilter}
      intent='default'
      iconVariant='close'
      onlyIcon
      iconSize='xs'
      color='white'
    />
  </HeaderWrapper>
)
export default AdvancedFilterHeader
