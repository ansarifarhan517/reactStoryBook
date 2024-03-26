import styled from 'styled-components';
import { IconButton } from 'ui-library';

export const ServiceTypeRuleWrapper = styled.div`
  font-size: 14px;
  .operation-fields {
    padding-top: 0;
    padding-bottom: 0;
  }
`

export const OperationFieldContainer = styled.div`
  width: 100%;
  input {
    height: 40px
  }
  .css-13h5h13-control,
  .css-geq484-control {
    margin-bottom: 0;
    font-size: 12px;
  }
`;

export const FormActionButton = styled(IconButton)`
  i {
    font-size: 16px !important;
    height: 16px !important;
    line-height: 16px !important;
  }
`;

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
    margin-left: 10px;
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

export const SpanCSS = styled.span`
  font-size: 20px;
  margin-top: 3%;
  padding: 0px;
`;

export const PickupEndTimeError = styled.div`
  font-size: 12px;
  color: #f44336;
  margin-top: -7px;
`;

export const ServiceTypeRuleTitle = styled.div`
  margin-bottom: 15px;
  .main-title {
    font-size: 15px;
    color: #000;
  }
  .title-main-border {
    height: 5px;
    background-color: #eee;
  }
  .title-sub-border {
    height: 1px;
    background-color: #eee;
  }
`;

export const ServiceTypeRuleIndex = styled.div`
  border: 1px solid #999;
  border-radius: 50%;
  margin-top: 18px;
  width: 22px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #999;
`

export const ModalContainer = styled.div`
  > div > div {
    overflow-y: auto;
  }
`