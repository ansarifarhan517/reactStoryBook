import styled from 'styled-components'
import { IThumbnailProps } from './FilePreviewer.interfaces'

export const FilePreviewerContainer = styled.div`
  display: flex;
  max-height: 400px;
  width: 100%;
  flex-direction: column;
  ${({ theme }) => `
    border: 2px dashed ${theme?.colors?.grey?.A800}66;
  `}
`

export const FileName = styled.div`
  text-align: center;
  font-size: 14px;
  padding: 20px;
`

export const Preview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  min-height: 250px;
  max-height: 250px;
  img {
    width: auto;
    height: auto;
    max-height: 250px;
  }
`

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  color: black;
`

export const ThumbnailsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 10px 15px;
  overflow-x: auto;
  min-height: 45px;
  ${({ theme }) => `
    background-color: ${theme?.colors?.grey?.[500]};
    box-shadow: 2px 0px 0px ${theme?.colors?.grey?.[500]}, -2px 0px 0px ${theme?.colors?.grey?.[500]};
  `}
`

export const Thumbnail = styled.div<IThumbnailProps>`
  margin-right: 15px;
  width: 50px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  cursor: pointer;
  border: 2px solid white;
  img {
    max-width: 100%;
    max-height: 100%;
  }
  ${({ selected, theme }) =>
    selected &&
    `
      box-shadow: 2px 0px 0px ${theme?.colors?.primary?.main}, -2px 0px 0px ${theme?.colors?.primary?.main}, 0px 2px 0px ${theme?.colors?.primary?.main}, 0px -2px 0px ${theme?.colors?.primary?.main};
  `}
`
