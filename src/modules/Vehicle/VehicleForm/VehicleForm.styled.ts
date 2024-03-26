import styled from 'styled-components'
import { IconButton } from 'ui-library'

export const FormActionButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .deletePromotion {
    margin-left: 0;
    width: 20px;
    height: 20px;
  }
  button:not(.deletePromotion) {
    width: 20px;
    height: 20px;
    margin-left: 15px;
  }

  button.deletePromotion {
    color: #f05548;
    border-color: #f05548;
    &:hover {
      color: #f05548;
      background-color: transparent;
    }
  }
`;
export const FormActionButton = styled(IconButton)`
margin: auto 0;
  i {
    font-size: 16px !important;
    height: 16px !important;
    line-height: 16px !important;
  }
`;