import React from "react"
import styled from "styled-components"
import { IconButton } from 'ui-library'
  
  const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 15px;
  `
  const IconButtonStyled = styled(IconButton)`  
      margin: 0px 5px;
    /*line-height: 40px;
      max-height: 40px;
      padding: 10px 15px;
    */
  
    span {
      text-transform: Capitalize;
      letter-spacing: 0.6px;
      font-size: 13px;
    }
  
    /*
      i {
        margin-right: 5px;
        font-size: 19px;
      }
    */
  `

  export const ButtonList = ({ listOfButtons }: any) => {
    return (
      <ButtonWrapper>
        {listOfButtons.map((button: any, index: number) => {
          return <IconButtonStyled key={index} {...button} iconSize={19} />
        })}
      </ButtonWrapper>
    )
  }