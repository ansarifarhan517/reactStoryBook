import styled from 'styled-components'
export const ManifestConfigurationWrapper= styled.div`
#manifest-add{
    border: 2px dashed #5698d3;
    background: #fafafa;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    margin-top: 20px;
    color: #5698d3;
    width: -webkit-fill-available;
    max-height: 42px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: none;
    width: calc(100% - 30px);
    span{
        font-size: 14px;
    }
    &:hover{
        box-shadow:none;
        background-color:#fff;
    }
    i{
        font-size: 13px; 
    }
}
#manifest-actionBar-save{
    min-height: 40px;
    max-width: 80px;
span{
    font-size: 14px;
}
i{
    font-size: 19px;
    margin-top: -8px;
}
}
`
