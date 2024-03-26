import styled from 'styled-components';

export const FormContainer = styled.div`
background: #fff;
box-shadow: 0px 0px 20px -7px #000;
height: 100%;
border-radius: 3px;
padding: 15px 0px;
padding-bottom: 15px;
position: relative;
margin-left: auto;
margin-right: auto;
.grid-item {
  padding: 0 15px!important;
}
.toggle-item {
  padding: 15px!important;
}
.address-fields .grid-item {
  padding: 0!important;
  margin: 0 15px!important;
  flex-basis: 100%;
  max-width: 100%;
}
` 
export const SectionHeaderContainer = styled.div`
 padding-left: 15px;
 padding-bottom: 15px;
`

export const EventCount = styled.div`
  height: 35px;
  width: 35px;
  border-radius: 50%;
  border: 1px solid #999;
  line-height: 33px;
  margin-top: 2px;
  color: #999;
  text-align: center;
  position: relative;
  margin-left: 15px;
  margin-right: 10px;
  font-size:15px;
`

export const EventIndex = styled.div`
  padding: 0px;
  margin-top: 15px;
`