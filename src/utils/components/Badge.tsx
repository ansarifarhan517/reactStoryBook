import styled from 'styled-components'

const Badge = styled.button.attrs(props => `sc-badge ${props.className || ''}`)`
  ${({ theme }) => `
    background: ${theme?.colors?.primary?.main};
    cursor: pointer;
    color: white;
    &.disabled {
      background: #e5e5e5;
      color: #636363;
    }
    height: 20px;
    width: auto;
    font-size: 12px;
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    line-height: 20px;
    border-radius: 2px;
    padding: 0px 7px;
    box-shadow: inset 0px -1px 0px 0px rgba(80,80,80,0.22), 0px 1px 1px 0px rgba(0,0,0,0.239);
  `}
`

export default Badge