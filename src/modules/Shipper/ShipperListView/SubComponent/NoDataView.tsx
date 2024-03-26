import React from "react";
import styled from 'styled-components';
import {
    IconButton,
    Box,
} from 'ui-library';
import { hybridRouteTo } from '../../../../utils/hybridRouting';

interface INoDataView {
    image: string
    message: string
    buttonList: IButton[]
}
interface IButton {
    name: string
    icon: string
    href: string
}

export const StyledMessage = styled.div`
    letter-spacing: 0.1px;
    margin:45px 0px 30px 0px;
    fontSize:15px;
    color: ${({ theme }) => theme.colors.black};
`

const NoDataView = ({ image, buttonList, message }: INoDataView) => {

    return <Box display='flex' flexDirection='column' mt='10%'>
        <img src={image} alt={image} />
        <StyledMessage >{message}</StyledMessage>
        <Box display='flex' flexDirection='row'>
        {
            buttonList?.map((button: IButton,index:number) => 
                <IconButton iconVariant={button.icon} primary={index === 0} intent='table' style={{marginLeft:'10px'}}
                    onClick={() => hybridRouteTo(button.href)}>
                    {button.name}
                </IconButton>
            )
        }
        </Box>

    </Box>

}

export default NoDataView

