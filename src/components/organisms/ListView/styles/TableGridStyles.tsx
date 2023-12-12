import styled from 'styled-components'

export const TableCellStyledNew = styled.div`
  position: relative;
  height: 100%;
  box-sizing: border-box;
  padding: 5px 5px 5px 15px;
  border: none;
  vertical-align: top;
  border-right: 1px solid transparent;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme?.colors?.white};

  box-shadow: 0px -1px rgba(0, 0, 0, 0.122);

  & .editIcon {
    opacity: 0;
    // transform: translateX(-2.5em);
    transition: 0.2s;
  }

  &.last-row {
    box-shadow: 0px 1px rgba(0, 0, 0, 0.122), 0px -1px rgba(0, 0, 0, 0.122);
  }

  &.rowHover {
    background-color: ${({ theme }) => theme?.colors?.grey['50']};

    & .editIcon {
      opacity: 1;
      // transform: translateX(0);
    }
  }

  &.selected {
    background-color: ${({ theme }) => theme?.colors?.listRowSelection};
  }
`

export const TableRowStyledNew = styled.div`
  box-shadow: 0px -1px rgba(0, 0, 0, 0.122);

  :last-child {
    box-shadow: 0px 1px rgba(0, 0, 0, 0.122), 0px -1px rgba(0, 0, 0, 0.122);
  }
`
