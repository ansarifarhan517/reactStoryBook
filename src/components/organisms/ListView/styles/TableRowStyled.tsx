import styled from 'styled-components'
import TableCellStyled from './TableCellStyled'

const TableRowStyled = styled.div`
  // border-bottom: 1px solid rgba(0, 0, 0, 0.122);
  box-shadow: 0px -1px rgba(0, 0, 0, 0.122);
  min-height: 24px;

  :last-child {
    box-shadow: 0px 1px rgba(0, 0, 0, 0.122), 0px -1px rgba(0, 0, 0, 0.122);
  }

  & .editIcon {
    opacity: 0;
    // transform: translateX(-2.5em);
    transition: 0.2s;
  }

  &:hover {
    background-color: ${({ theme }) => theme?.colors?.grey['50']};
    & ${TableCellStyled} {
      background-color: ${({ theme }) => theme?.colors?.grey['50']};
    }

    & .editIcon {
      opacity: 1;
      // transform: translateX(0);
    }
  }

  &.rowHover {
    background-color: ${({ theme }) => theme?.colors?.grey['50']};
    & ${TableCellStyled} {
      background-color: ${({ theme }) => theme?.colors?.grey['50']};
    }

    & .editIcon {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &.selected {
    background-color: ${({ theme }) => theme?.colors?.listRowSelection};
    // background-color: rgba(0, 120, 240, 0.2);
    & ${TableCellStyled} {
      background-color: ${({ theme }) => theme?.colors?.listRowSelection};
      // background-color: rgba(0, 120, 240, 0.2);
    }
  }
`

export default TableRowStyled
