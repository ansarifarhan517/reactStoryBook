// styled component for Location search component
import styled from 'styled-components'
import { getDefaultTheme } from '../../../../../utilities/theme'
import TextInput from '../../../../molecules/TextInput'
const theme = getDefaultTheme()

// style for search input container
export const LocationSearchContainer = styled.div`
  position: absolute;
  width: 50%;
  z-index: 1200;
  left: 0px;
  border: 1px solid ${theme?.colors?.grey?.searchInputBorder};
  cursor: pointer;
  border-radius: 2px;
  top: 15px;
  box-shadow: ${theme?.shadows?.searchInput};
  font-size: 13px;
  margin-left: 15px;
  overflow: hidden;
`
// style for search input
export const LocationSearchInput = styled.input`
  width: 100%;
  height: 30px;
  border: none;
  box-shadow: ${theme?.shadows?.searchInput};
  left: 0;
  top: 0;
  padding-left: 35px;
  padding-right: 35px;
  border-radius: 2px;
  &:focus {
    outline: none;
  }
  color: #000;
`
export const SearchIcon = styled.i`
  position: absolute;
  text-align: center;
  padding-left: 10px;
  font-size: 17px;
  color: ${theme?.colors?.grey[500]};
  padding-top: 1px;
`
export const CloseSuggestionIcon = styled.i`
  position: absolute;
  right: 10px;
  margin-top: 5px;
  font-size: 11px;
  color: ${theme?.colors?.grey[500]};
`
// style for search result container
export const ResultsContainer = styled.div`
  background-color: ${theme?.colors?.white};
  border-radius: 2px;
  margin-top: 0px;
  .active {
    background-color: ${theme?.colors?.grey['50']};
  }
`
// style for search Results
export const Results = styled.div`
  padding-left: 10px;
  color: #000;
  font-size: 13px;
  .inactive {
    color: #828395;
    font-size: 10px;
  }
`
export const StyledResult = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${theme?.colors?.grey?.searchInputBorder};
  padding: 5px;
  &:hover {
    background-color: ${theme?.colors?.grey['50']};
  }
  span{
    font
  }
`

export const GeocodingFieldsWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  bottom: 15px;
  left: 50%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  transform: translate(-50%, 0);
  gap: 10px;
`
export const GeocodingField = styled(TextInput)`
  & {
    margin: 0px !important;
    min-height: 35px;
    border-radius: 2px;
    border: 0px;
    box-shadow: ${theme?.shadows?.searchInput};
  }
`
