import styled from 'styled-components'

export const FeatureCardContainer = styled.div.attrs(props => ({
  className: `sc-feature-card-container ${props.className || ''}`
}))`
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0px 1px 1px rgb(0 0 0 / 21%), 0px -0.5px 1px rgb(0 0 0 / 12%);

  .horizontal-line {
    width: 100%;
    height: 1px;
    background-color: #abacba;
    margin: 5px 0px;
  }

  .title {
    font-size: 15px;
    color: #1a1a1a;
    line-height: 15px;
    flex-grow: 1;
    white-space: prewrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .sub-title {
    color: #555555;
    font-size: 12px;
    letter-spacing: -0.22px;
    white-space: nowrap;
  }

  .icon-button {
    width: 33px;
    height: 33px;

    i {
      color: #666;
      &.icon-thumb-up-filled, &.icon-thumb-down-filled {
        color: ${({theme}) => theme?.colors?.primary?.main};
      }
    }
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`

export const TagChip = styled.span`
  border-radius: 3px;
  padding: 3px 5px;
  color: white;
  font-size: 12px;
  text-transform: capitalize;
  white-space: nowrap;
  margin-top: 5px;
  display: inline-block;
`

interface IUnreadIndicatorProps {
  size?: number
}
export const UnreadIndicator = styled.div<IUnreadIndicatorProps>`
  width: ${({size}) => size || 7}px;
  height: ${({size}) => size || 7}px;
  border-radius: 50%;
  background-color: #ee5448;
`