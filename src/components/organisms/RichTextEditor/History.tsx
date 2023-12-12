import React from 'react'
import IconButton from '../../atoms/IconButton'
import Box from '../../atoms/Box'

const History = (props: any) => {
  // console.log('History Props: ', props)
  const handleClick = (key: 'undo' | 'redo') => {
    props.onChange(key)
  }

  return (
    <Box
      display='flex'
      style={{ height: 'inherit', width: '60px' }}
      justifyContent='space-evenly'
      mb='7px'
      className='history-wrapper'
    >
      <IconButton
        iconVariant='undo'
        onlyIcon
        onClick={() => handleClick('undo')}
        circle
        color='black'
        title='Undo'
        disabled={props.currentState.undoDisabled}
      >
        Undo
      </IconButton>
      <IconButton
        onlyIcon
        circle
        title='Redo'
        color='black'
        iconVariant='redo'
        onClick={() => handleClick('redo')}
        disabled={props.currentState.redoDisabled}
      >
        Redo
      </IconButton>
    </Box>
  )
}

export default History
