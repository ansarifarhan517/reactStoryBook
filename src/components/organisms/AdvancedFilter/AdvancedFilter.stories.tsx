import React from 'react'
import { path } from '..'
import { withKnobs, boolean, object, text } from '@storybook/addon-knobs'
import AdvancedFilter from '.'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { IThirdElementValue, tAdvancedFilterChildren } from './interfaces'
import { action } from '@storybook/addon-actions'
import IconButton from '../../atoms/IconButton'
import operationTypes from './Data/operationType'
import columnsStructure from './Data/columnsStructure'
import filterData from './Data/filterData'
import ThirdElement from './ThirdElement/index'

export default {
  title: `${path}/AdvancedFilter`,
  decorators: [withKnobs],
  component: AdvancedFilter
}

const ThirdElementFormatter = (data: IThirdElementValue) => {
  switch (data?.type) {
    case 'calendar':
      return data.value
    default:
      return data?.label || data.value
  }
}

export const withPlayGround = () => (
  <ThemeWrapper>
    <AdvancedFilter
      showOpen={boolean('show Open', false)}
      backButton={boolean('back Button', false)}
      masterCondition={boolean('show Condition', true)}
      allowSort={boolean('show Sort', true)}
      allowFavourites={boolean('show favourites', true)}
      allowMultipleFilters={boolean('show Multiple Filters', true)}
      backButtonCallback={() => action('Back Button clicked')}
      chipsArray={object('preDefinedArrays', filterData)}
      dropDownOptions={object('columns Data', columnsStructure)}
      fieldOperation={object('operation Type', operationTypes)}
      onApply={(filterObject: any) => action('Apply clicked')(filterObject)}
      onRemove={(filterObject: any) =>
        action('on Remove Clicked')(filterObject)
      }
      onDelete={(filterObject: any) => action('Delete Clicked')(filterObject)}
      onSave={(filterObject: any) => action('on Save clicked')(filterObject)}
      onUpdate={(filterObject: any) =>
        action('on Update clicked')(filterObject)
      }
      appliedFilterId={text('AppliedFilterId', '5f92b95637c24c28eb950447')}
      onFavourite={(filterObject: any) =>
        action('Favourites CLicked')(filterObject)
      }
      onAddFilter={action('Add Filter Called')}
      onAddCondition={action('Add Condition Called')}
      ThirdElement={ThirdElement}
      ThirdElementFormatter={ThirdElementFormatter}
      saveTooltip='Save'
      duplicateTooltip='Create Duplicate'
      cancelTooltip='Cancel'
      removeFavouriteTooltip='Remove Favourite'
      markAsfavouriteTooltip='Mark as Favourite'
      style={{
        position: 'absolute',
        left: '0px'
      }}
    >
      {({ open, setOpen, chips }: tAdvancedFilterChildren) => (
        <>
          <IconButton
            onClick={() => setOpen && setOpen(!open)}
            intent='default'
            iconVariant='icomoon-funel'
            children={'Advanced Filter ' + chips?.length}
          />
        </>
      )}
    </AdvancedFilter>
  </ThemeWrapper>
)
