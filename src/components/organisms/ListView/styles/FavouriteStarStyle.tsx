import styled from 'styled-components'

const FavouriteStarStyle = styled.div`
  background-color: white;
  align-items: center;
  display: flex;
  border-bottom: 1px solid rgb(0 0 0 / 12%);
  padding: 5px 5px 5px 0px;
  min-width: 10px !important;

  &.selected {
    background-color: ${({ theme }) => theme?.colors?.listRowSelection};
  }
`
export default FavouriteStarStyle
