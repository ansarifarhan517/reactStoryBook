import styled, { css } from 'styled-components';

export const FormWrapper = styled.div<{
  formName?: string
}>`
  height: 100%;
  margin-top: 70px;
  padding: 0px 15px;
  margin-bottom: 15px;
  .grid-item {
    padding: 0px 10px;
  }
  & div{
    text-transform: capitalize;
  }
  & div.text-initial div{
    text-transform: initial;
  }
  & ::placeholder {
    text-transform: capitalize;
  }
  
  ${({ formName }) =>
    formName === 'Vehicle' &&
    css`
        .vehicleForm {
            align-self: center;
          }
		`}

    ${({ formName }) =>
    formName === 'FleetType' &&
    css`
        .fleetTypeForm {
            align-self: center;
          }
		`}
    
  ${({ formName }) =>
    formName === 'shipper' &&
    css`
       & div{
          text-transform: initial;
        }
        div#modalwrapperid img {
            max-width: 100%;
        }
		`}

`

export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
`
