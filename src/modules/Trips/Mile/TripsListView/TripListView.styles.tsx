import styled from 'styled-components'
import { InlinePopup } from 'ui-library'

export const UncheckedOrdersNote = styled.div`
margin: 15px !important;
padding: 9px;
background-color: #c2c2c5;
`


export const StyledPrintPage = styled.div`
    display:none;
    @media print {
      td {
        break-inside: avoid;
      }
    }
`

export const StyledNumber = styled.div<{ disabledValue: boolean }>`
  background: #5698d3;
  color: #fff;
  line-height: initial;
  vertical-align: middle;
  padding: 3px 3px;
  padding: 3px 5px;
  border-radius: 2px;
  cursor: ${(props) => (props.disabledValue ? "not-allowed" : "pointer")};
  box-shadow: none;
  margin: 0 auto;
` 

export const StyledInlinePopup = styled(InlinePopup)`
  margin: '5px 0px';
`