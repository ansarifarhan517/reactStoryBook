import React from 'react'
import styled from 'styled-components'
import {IconButton} from 'ui-library'
interface IEditPopUp {
  onClick: () => void
}

const StyledEdit = styled.div`
  display: flex;
  flex-direction: column;
  .title {
    text-align: center;
  }

  .gifs {
    width: 100%;
    background: #fff;
    border: 2px dashed #adadad;
    border-radius: 2px;
    min-height: 200px;
  }
`
const EditPopUp = ({ onClick }: IEditPopUp) => {
  return (
    <StyledEdit>
      <div className='title'>Quick Tutorial</div>
      <div style={{ padding: '10px' }}>
        <img className='gifs' src="images/geocoding_new.gif" />
      </div>
      <div style={{ margin: 'auto', paddingTop: '10px', marginLeft: '50%' }}>
        <IconButton
          onClick={() => onClick()}
          primary={false}
          disabled={false}
          intent='page'
          iconVariant='edit'
          children='Continue Editing'
        />
      </div>
    </StyledEdit>
  )
}

export default EditPopUp