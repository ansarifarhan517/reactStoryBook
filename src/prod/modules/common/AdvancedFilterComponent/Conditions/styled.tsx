import styled from 'styled-components'
export const ConditionWrapper = styled.div`
  position: relative;
  font-size: 13px;
  .RowWrapper{
  margin: 5px 0px;
  padding:0 10px;
  background-color: ${({ theme }) => theme?.colors?.grey['200']};
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  .multiselect-search-input-wrappper{
    width: 85%;
  }
  }
  .RowSummaryWrapper{
    margin: 0.6em 0px;
    padding: 10px;
    background-color: #eeeeee;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  & > div {
    width: 100%;
    min-width: 100px;
    position: relative;
    margin: 0px 5px;

    & input {
      margin: 0px 0px;
      min-height: 28px;
      line-height: 28px;
      border: 1px solid ${({ theme }) => theme?.colors?.grey['450']};
    }
    & #fromDateRange-input,
    & #toDateRange-input {
      margin: 18px 0px;
    }
  }
`

export const AddConditionWrapper = styled.div`
  margin: 0.6em 0px;
  padding: 1em;
  color: ${({ theme }) => theme?.colors?.primary?.main};
  border: 1px dashed ${({ theme }) => theme?.colors?.primary?.main};
  text-align: center;
  /* & > button {
    padding: 0px 5px;
  } */
  cursor: pointer;
`

export const DropDownWrapper = styled.div`
position: relative;
flex-basis: 300px;
padding: 0 5px;
height: 55px;
display: flex;
align-items: center;
&>div{
  width: 100%;
}
&>div>input{
  width: 100%;
  height: 35px;
  line-height: 35px;
}
.react-select__control {
  padding: 0 10px;
  .react-select__indicator {
    margin: 4px 3px 0;
  }
}
`
export const ActionButtonWrapper = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
margin-left: 20px;
button.delete-button{
  border: none;
    background: #ec6261;
    color: #fff;
    height: 20px;
    width: 20px;
    i{
      height: 16px;
    }
&:hover{
  background: #ec6261;
  color: #fff;
}    
}
button.edit-button{
  margin-right: 18px;
  border: none;
    color: #646464;
    height: 20px;
    width: 20px;
    i{
      height: 18px;
    }
/* :hover{
  background:rgb(216, 216, 216)
}     */
}
`