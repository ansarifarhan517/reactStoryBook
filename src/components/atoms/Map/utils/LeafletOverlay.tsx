import React,{useState} from 'react'
import styled from 'styled-components'
interface Props {
    title:string
    showArrow:boolean
    showCloseIcon :boolean
}

const StyledOverlap = styled.div`
    background: black;
    position: absolute;
    z-index: 1000;
    opacity: 0.4;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    border-radius: 6px;
    font-size: 17px;
    color: #fff;
    height:100px;
    width: 420px;
    justify-content: space-between;
`

const Title = styled.div`
    white-space: nowrap !important;
    padding: 15px;
    margin-top: 6px;
    align-self: center;
`

const Arrow = styled.div`
    align-self: center;
    padding: 10px;
    font-size: 30px;
    `

const Icon = styled.div`
    align-self: flex-start;
    padding: 10px;
    font-size: 12px;
    cursor:pointer;
`



export const LeafletOverlay = ({title='Select Trip(s) to view on map',showArrow=true,showCloseIcon=true}: Props) => {
    const [showOverlay,setOverlay] = useState(true);
    return (
        showOverlay ? <StyledOverlap>
             {showArrow && <Arrow className='icon icon-left-arrow'></Arrow>}
            <Title>{title}</Title>
            {showCloseIcon && <Icon className='icon icon-close' onClick={() =>setOverlay(false)}></Icon>}
        </StyledOverlap>: null
    )
}
