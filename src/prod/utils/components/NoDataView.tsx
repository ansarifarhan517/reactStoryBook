import React from "react";
import {
    IconButton,
    Box,
} from 'ui-library';
import { hybridRouteTo } from '../hybridRouting';
import { StyledMessage } from './StyledReusableComponent';
import styled from 'styled-components';

interface INoDataView {
    image: string
    message: string
    buttonList: IButton[],
    styledClassess?: {
        primaryImage: {
            [key: string]: string | number
        },
        styledButtons: {
            [key: string]: string | number
        }

    },
    parentMargin?: string,
    timelineContainer?: {
        id: string,
        label: string,
        href: string,
        image: string
    }[]
}
interface IButton {
    name: string
    icon: string
    href?: string
    onButtonClick?: () => void
}

const TimelineContainer = styled.div`
padding:15px;
  img{
    max-width: 200px;
    display: block;
  }
`

const NoDataView = ({ image, buttonList, message, styledClassess, parentMargin = '10%', timelineContainer }: INoDataView) => {

    return <Box display='flex' flexDirection='column' mt={parentMargin}>
        <img width={300} src={image} alt={image} style={{ ...styledClassess?.primaryImage }} />
        <StyledMessage >{message}</StyledMessage>
        <Box display='flex' flexDirection='row'>
            {
                buttonList?.map((button: IButton, index: number) =>
                    <IconButton iconVariant={button.icon} primary={index === 0} intent='table' key={index}
                        onClick={() => {
                            button?.onButtonClick && button?.onButtonClick()
                            button?.href && hybridRouteTo(button.href)
                        }} style={{ ...styledClassess?.styledButtons, marginLeft: '10px' }}>
                        <span style={{fontSize: '13px'}}>{button.name}</span>
                    </IconButton>
                )
            }
        </Box>
        <Box>
            <TimelineContainer>
                <Box display="flex" justifyContent="center">
                    {timelineContainer && timelineContainer?.length > 0 && timelineContainer?.map(container => {
                        return <a href={container.href} key={container.id}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={container.image} />
                                <span>
                                    {container.label}
                                </span>
                            </div>
                        </a>
                    })}

                </Box>
            </TimelineContainer>

        </Box>


    </Box>

}

export default NoDataView

