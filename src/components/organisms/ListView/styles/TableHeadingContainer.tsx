import styled from 'styled-components'

const TableHeadingContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme?.zIndex?.listView?.columnHeader};
  border-bottom: 1px solid rgba(0, 0, 0, 0.122);
  & .tableHeaderContainer {
    overflow: hidden;
  }
`
export default TableHeadingContainer
