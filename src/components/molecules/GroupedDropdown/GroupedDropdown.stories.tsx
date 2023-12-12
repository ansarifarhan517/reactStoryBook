import React from 'react'
import Box from '../../atoms/Box'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import GroupedDropdown from '.'
import Data from './Data'
import { action } from '@storybook/addon-actions'
import Card from '../../atoms/Card'
import Button from '../../atoms/Button'
import { text, object, withKnobs } from '@storybook/addon-knobs'

export default {
  title: `${path}/GroupedDropdown`,
  decorators: [withKnobs],
  component: GroupedDropdown
}

export const GroupedDropdownStory = () => {
  const [open, setOpen] = React.useState(false)
  const [tag, setTag] = React.useState(false)

  const onChange = (data: any, category: any) => {
    action('selected', data)
    handleOpen()
    setTag(data?.label + category?.label)
  }
  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <ThemeWrapper>
      <Box p='1em'>
        <Box p='1em'>
          <Card style={{ display: 'inline-block' }}>Tag: {tag}</Card>
        </Box>
        <Button onClick={handleOpen} variant='button' intent='default'>
          Click me !
        </Button>
        <div>
          {open && (
            <Card style={{ display: 'inline-flex', padding: '0px' }}>
              <GroupedDropdown
                category={object('category', Data.category)}
                data={object('data', Data.data)}
                width={text('width', '500px')}
                height={text('height', '250px')}
                allLabel={text('allLabel', 'All')}
                handleOnChange={onChange}
                searchFieldLabel={text('dropdownLabel', 'Search')}
                searchFieldPlaceholder={text(
                  'dropdownPlaceholder',
                  'Search Tags'
                )}
              />
            </Card>
          )}
        </div>
      </Box>
    </ThemeWrapper>
  )
}
