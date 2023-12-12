import React from 'react'
import { FooterWrapper, SpacedIconButton } from './styled'
import IconButton from '../../../../atoms/IconButton'

const AdvancedFilterFooter = ({
  showRemove,
  showAddFilter,
  addFilter,
  removeFilter,
  applyFilter
}: any) => (
  <FooterWrapper type='relative' display='block'>
    {showAddFilter ? (
      <SpacedIconButton
        onClick={addFilter}
        intent='default'
        iconVariant='add'
        iconSize={12}
        children='Add Filter'
      />
    ) : (
      <>
        {showRemove && (
          <SpacedIconButton
            onClick={removeFilter}
            intent='default'
            iconVariant='close'
            iconSize={12}
            children='Remove Filter'
          />
        )}

        <IconButton
          primary
          onClick={applyFilter}
          intent='default'
          iconVariant='icomoon-tick-circled'
          iconSize={12}
          color='white'
          children='Apply Filter'
        />
      </>
    )}
  </FooterWrapper>
)
export default AdvancedFilterFooter
