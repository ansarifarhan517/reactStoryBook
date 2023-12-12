import styled from 'styled-components'
import { OnlyIconButtonStyled } from '../../../atoms/IconButton'

interface IListViewStyled {
  loading?: boolean
  showFavouriteStar?: boolean
}
const ListViewStyled = styled.div<IListViewStyled>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: opacity 0.2s ease-in-out;

  /*
  .toolbar {
    ${({ loading }) => loading && 'opacity: 0; '}
  }
  */

  ${OnlyIconButtonStyled} {
    padding: 0px 7px;
  }

  .hideScroll::-webkit-scrollbar {
    width: 0px; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
    display: none;
  }

  .list-container {
    position: relative;

    & .columns-container {
      position: sticky;
      top: 0;
      left: 0;
      height: auto;
      z-index: 3;
      border-bottom: 1px solid rgba(0, 0, 0, 0.122);
      display: flex;
      box-sizing: content-box;

      .pinned-left-overlap {
        position: sticky;
        left: 0;
        z-index: 4;
        background-color: #fff;
      }

      .pinned-right-overlap {
        position: sticky;
        right: 0;
        z-index: 4;
      }
    }

    & .rows-container {
      position: absolute;
      top: 70px;
      height: 100%;
      display: flex;
      flex-direction: row;

      & .pinned-left-container {
        position: sticky;
        left: 0;
        top: 70px;
        height: 100%;
        z-index: 2;
      }

      & .pinned-right-container {
        position: sticky;
        right: 0;
        top: 70px;
        height: 100%;
        z-index: 2;
      }

      & .data-container {
        position: relative;
        z-index: 1;
        ${({ showFavouriteStar }) => showFavouriteStar && 'left: 10px; '}
      }
    }
  }
`

export default ListViewStyled
