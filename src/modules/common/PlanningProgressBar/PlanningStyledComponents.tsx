import styled from "styled-components";

export const PlanningProgressBarWrapper = styled.div`
background-color: #fff;
position: fixed;
bottom: 0;
display: flex;
box-shadow: 0px 0px 20px -9px #000;
width:100%;
align-items: center;
z-index: 999;
left: 0;
`;

export const ImageWrapper = styled.div`
position:relative;
height: 35px;
    width: 35px;
    border-radius: 50%;
    margin-right: 15px;
    img{
        width:100%;
        max-width: 100%;
    }
`;
export const ProgressStep = styled.div`
.showAsTooltip{
    display: none;
}
&:hover .showAsTooltip{
   display: block;
   + .popover_wrapper-opened {
       box-shadow: none;
   }
}

.popover_wrapper{
    position: absolute;
    z-index: 10;
    background: rgba(86,152,211,0.95);
    border-radius: 2px;
    padding: 10px 10px;
    color: #fff;
    font-size: 12px;
    top: 0px;
    left: 15px;
    transform: translateY(-100%);
    box-shadow: 0px 4px 20px -6px #000;
    width: max-content;
    min-width: 150px;
    line-height: 1.4;
    &:after{
        content: '';
    transform: rotate(0deg);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #5698d3;
    position: absolute;
    bottom: -8px;
    left: 8px;
    }
}
.close-tooltip{
    position: absolute;
    top:2px;
    right: 2px;
}
.tip_notify {
    position: absolute;
    background: #f00;
    height: 7px;
    width: 7px;
    top: -1px;
    right: 1px;
    border-radius: 50%;
    animation: pulse 2s infinite;
}
    cursor: pointer;
    padding: 10px 15px;
    display: flex;
    position: relative;
    flex: 1;
    flex-wrap: nowrap;
    align-items: center;
    position: relative;
    :before {
    content: '';
    width: 1px;
    border-top: 34px solid #ddd;
    position: absolute;
    right: 0;
    bottom: -4px;
    transform: rotate(
    20deg);
    }
    :after {
        content: '';
        width: 1px;
        border-top: 33px solid #ddd;
        position: absolute;
        right: 0;
        top: -1px;
        transform: rotate(-20deg);
    }
    &.active{
    background: #eee;
    :after {
    width: 0;
    height: 0;
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
    border-left: 8px solid #eee;
    content: '';
    transform: rotate(0);
    right: -8px;
    }
    :before{
    left: 0;
    width: 0;
    height: 0;
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
    content: '';
    border-right: 10px solid #fff;
    transform: scaleX(-1);
    };
    
    [data-testid="tooltipContainer"]{
        left: 98px;
    }
}
&.activeBefore{
    :before, :after{
        border-top:0px;
        border-bottom:0px;
    }
    }
&.disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
`;

export const ActionButtons= styled.div`
flex: 1;
    display: flex;
    justify-content: flex-end;
    padding: 7px 15px;
button{
    padding: 0px 15px;
    letter-spacing: 0.6px;
    border-radius: 2px;
    i{
        font-size: 18px;
    }
    [disabled]{
        opacity: 0.2;
    }
}
`