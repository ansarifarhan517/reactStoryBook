import styled from 'styled-components';
import { IconButton } from 'ui-library'


export const IconButtonStyled = styled(IconButton)<any>`
border-radius: 50%;
padding: 0px;
height: auto;
background-color: ${({ theme , iconVariant}:any) =>iconVariant === 'add' && theme?.colors?.primary?.main};
color: ${({ theme , color, iconVariant}:any) => iconVariant === 'add' ? theme?.colors?.primary?.contrastText : color};

i {
  margin: 3.5px 3px 3px 3.5px;
  display: flex;
}
width: auto;
`
export const AccordionStyled = styled.div`
.accordian__container{
  margin-top:20px; 
}
.noData {
  text-align: center;
  padding: 12px;
}

`