import styled from "styled-components";
import { Grid, IconButton } from 'ui-library'

export const AddBrandProfileButtonWrapper = styled.div`
    position: absolute;
    right: 30px;

    .addFromButton {
       
        height: 30px;
        padding: 7px 10px 8px;
        box-shadow: 0 2px 11px -5px #000000;
    }
`
export const SubHeader= styled.div`
text-transform: none;
  color: #545454;
  margin-top: 11px;
  line-height: 20px;
  letter-spacing: 0.6px;
  font-size: 13px;
`

export const StyledGrid = styled(Grid)`
  flex-grow: 1;
  overflow: hidden;
  height:100%;
  width: 100%;
  & button[disabled] {
  opacity:0.2 !important;
  }

  .grid-customised-scroll-bar ::-webkit-scrollbar {
  width: 7px !important;
  height: 7px !important;
  cursor: grab !important;

  }

  .grid-customised-scroll-bar ::-webkit-scrollbar-track {
  -webkit-border-radius: 9px;
  border-radius: 9px;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb {
  -webkit-border-radius: 9px !important;
  border-radius: 9px !important;
  // background-color: #dadceo !important;
  background-color: #DADCE0 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
  // background-color: #bdc1c6 !important;
  background-color: #bdc1c6 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
  // background-color: #80868b !important;
  background-color: #80868b !important;
  }
`

export const SectionHeaderWrapper = styled.div`
width: 100%;
& > div {
    & > div {
        & > div {
            font-size: 15px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            color: #000000;
        }
    }
}
`

export const FormActionButton = styled(IconButton)`
    padding: 10px 11px 10px 8px;
    border-radius: 1px;
    box-shadow: 0 2px 11px -5px #000000;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
`
export const PromotionLinkActionButtonWrapper = styled.div`

    display:flex;
    justify-content: flex-start;
    margin-top: 21px;
    align-items: center;

    button {
        width: 20px;
        height: 20px;
        margin-left: 11px
    }

    button.deletePromotion {
        color: #f05548;
        border-color: #f05548;
        &:hover {
            color: #f05548;
            background-color: transparent;
        }
    }

`
export const PromotionActionButton = styled(IconButton)`
    i {
      font-size: 16px !important;
      height: 16px  !important;
      line-height: 16px  !important;
    }
`

export const AccordionContentWraper = styled.div`
    height: auto !important;
    padding: 26px 0px;
`

export const ListGridWrapper = styled(Grid)`
    flex-grow: 1;
    overflow: hidden;
    width: 100%;
    box-shadow: 0 2px 20px -10px #000;
`

export const PreviewHeaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding-bottom: 5px;
`
export const BrandProfilePageHeader = styled.div`
    padding: 0 10px 0 0;
    font-size: 17px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.17px;
    color: #000000;
`
export const BestFitTextWrapper = styled.div`
    font-size: 12px;
    color: #777;
    margin-top: 5px;
`