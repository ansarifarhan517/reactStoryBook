import styled from 'styled-components'

const InputFieldHelpText = styled.div.attrs(props => ({ className: `sc-input-field-help-text ${props.className || ''}`}))`
  font-size: 12px;
  line-height: 14px;
  padding: 5px 0px;
  color: rgba(0,0,0,0.7);
`

export default InputFieldHelpText