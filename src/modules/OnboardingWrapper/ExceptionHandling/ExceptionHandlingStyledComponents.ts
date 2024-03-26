import styled from "styled-components";
import { Box, Grid } from 'ui-library';

export const ExceptionHandlingContainer = styled.div``;

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0px;
`;

export const BreadCrumbContainer = styled(Box)`
  margin: 10px 0;
  background-color: #fafafa;
  padding: 10px 0;
  label {
    white-space: nowrap;
  }
`;
export const ActionButtonWrapper = styled.div`
  display: flex;
  > button {
    margin: 0px 5px;
  }
`
export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
`;

export const FormFieldWapper = styled.div`
  label {
    display: flex;
  } 
`;
export const FormContainer = styled.div`
  padding: 0 10px;
   input {
     margin-bottom: 0;
   }
   .input-grid {
     padding-bottom: 0;
   }
   div[class*="-control"] {
     margin-bottom: 0;
   }
   .multiselect {
   i.icon-triangle-down {
     margin-top: 10px
   }
  }
`;

export const RadioDesc = styled.p`
    padding-left: 20px;
    font-size: 13px;
`

export const CenteredContentWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;
export const NumberCountWrapper = styled.div`
    background: #5698d3;
    color: #fff;
    line-height: initial;
    vertical-align: middle;
    padding: 3px 3px;
    padding: 3px 5px;
    border-radius: 2px;
    cursor: not-allowed;
`;

export const ModalFooterButtonContainer = styled(Box)`
    display: flex;
    align-items: flex-end;
    flex-direction: row;
    padding: 10px;
    justify-content: flex-end;
    button {
      margin: 0 5px;
      min-width: 92px;
      &.rejected {
        i {
          font-size: 16px;
          line-height: 16px;
          height: 15px;
        }
      }
    }
`

export const AddFormButtonContainer = styled(Grid)`
  margin: 15px 10px;
  display: flex;
  button {
    margin-right: 10px;
    min-width: 92px;
  }
`;

export const EventListContainer = styled.div`
  max-height: 50vh;
  overflow-y: auto;
`;
export const EventContainer = styled.div`
  label > label {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 3px;
  }
`;

export const EventModalButtonContainer = styled.div`
  padding: 15px 10px;
  display: flex;
  justify-content: flex-end;
    button {
      margin-right: 10px;
      min-width: 92px;
    }
`;
export const FormFieldWapperWithToolTip = styled.div`
  label {
    display: flex;
  } 
  > div {
    display:block
  }
  #exceptionMode {
    margin-bottom: 0px;
  }
  [data-testId=tooltipContainer] > div{
    left: 32px;
  }
  [data-testId=tooltipContainer] > div:first-child {
    max-width:500px;
    left: 20px;
  }
`;
export const LogATicketWrapper = styled.div`
  margin-bottom:15px;
`;

export const TabContainer = styled.div`
  width: 100%;
  margin: 0 0 1px;
  padding: 5px 0 10px;
  overflow-y: auto;
  border-radius: 4px;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.23);
  background-color: #ffffff;
`;

export const TabButtonContainer = styled.div`
  div {
    margin: 0;
    box-shadow: none;
  }
  span#orders, span#manifests {
    width: 120px;
    margin-right: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 11px -5px #000;
    border: unset;
    line-height: 40px;
    padding: 10px 10px;
    min-height: 40px;
    cursor: pointer;
    font-size: 13px;
  }
`

export const ResolveRejectTextAreaContainer = styled.div`
margin-top: 20px;
  textarea {
    border-color: '#bdbdbd';
  }
`;

export const ActionBarContainer = styled(Box)`
  margin-left: 2px;
  margin-top: 2px;
`;

export const ContainerCSS = styled.div<{listViewType: string}>`
  margin-top: ${({ listViewType }) => listViewType === 'RAISED_EXCEPTIONS' ? '64px' : '0px'};
  padding: ${({ listViewType }) => listViewType === 'RAISED_EXCEPTIONS' ? '0px 15px 0px 15px' : '0px'};
`