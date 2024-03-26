import styled from "styled-components";
import { Grid, IconButton } from "ui-library";

export const StyledGrid = styled(Grid)`
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  height: 100%;
  .wrapper-layout-onboarding {
    width: 100%;
    min-height: calc(100vh);
  }
  .sidebarWrapper {
    width: 30%;
    height: calc(100vh);
    display: inline-block;
    float: left;
    background-color: #5698d3;
    padding: 25px 20px;
    text-align: left;
    position: relative;
  }

  .content-wrapper-onboarding {
    width: 70%;
    float: right;
    height: calc(100vh);
    display: inline-block;
    position: relative;
    background-color: #5698d3;
    padding: 2rem;
    padding-left: 0;
  }
  h3 {
    color: #fff;
    margin: 0;
    padding-bottom: 15px;
  }
  .animated__accordion__wrapper.active {
    background: #edf2f8;
  }
  .animated__accordion__wrapper.active h4 {
    background: #edf2f8;
  }
  .animated__accordion__wrapper.active h4 strong {
    transform: rotate(45deg);
    transition: all 0.8s ease;
  }
  .content-placeholder {
    padding: 1rem 2rem;
    transform-origin: top center;
  }
  .cbx {
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }
  .cbx span {
    display: inline-block;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
  }
  .cbx span:first-child {
    position: relative;
    width: 23px;
    height: 23px;
    border-radius: 50%;
    transform: scale(1);
    vertical-align: middle;
    border: 1px solid #b9b8c3;
    transition: all 0.2s ease;
  }
  .cbx span:first-child svg {
    position: absolute;
    z-index: 1;
    top: 7px;
    left: 5px;
    fill: none;
    stroke: white;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
  }
  .cbx span:first-child:before {
    content: "";
    width: 100%;
    height: 100%;
    background: #00a886;
    display: block;
    transform: scale(0);
    opacity: 1;
    border-radius: 50%;
    transition-delay: 0.2s;
    left: 3px;
    top: 3px;
  }
  .cbx span:last-child {
    margin-left: -3px;
  }
  .cbx span:last-child:after {
    content: "";
    position: absolute;
    top: 8px;
    left: 0;
    height: 1px;
    width: 100%;
    background: #00a886;
    transform-origin: 0 0;
    transform: scaleX(0);
  }
  .cbx.active span:first-child {
    border-color: #00a886;
    background: #00a886;
    animation: check 0.6s ease;
  }
  .cbx.active span:first-child svg {
    stroke-dashoffset: 0;
  }
  .cbx.active span:first-child:before {
    transform: scale(2.2);
    opacity: 0;
    transition: all 0.6s ease;
  }
  .cbx.active span:last-child {
    color: #b9b8c3;
    transition: all 0.3s ease;
  }
  .cbx.active span:last-child:after {
    transform: scaleX(1);
    transition: all 0.3s ease;
  }

  @keyframes check {
    50% {
      transform: scale(1.2);
    }
  }
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

export const StyledAccordionWrapper = styled.div`
  padding: 1rem;
  margin-top: 1rem;
  background: #fff;
  border-radius: 10px;
  height: calc(100vh - 140px);
  padding-right: 5px;
    .accordion--wrapper{
      border-radius: 10px;
      height: calc(100vh - 165px);
      overflow: auto;
      padding-right: 8px;
  }
`;

export const StyledProgressBar = styled.div`
  padding: 4px;
  margin-bottom: 1.5rem;
  background: #fff;
  border-radius: 8px;
  height: 40px;
  position: relative;
  overflow: hidden;
  .progress--bar {
    position: absolute;
    left: 0;
    height: 100%;
    top: 0;
    background: #ccc;
    z-index: 0;
    border-radius: 8px;
    z-index: 0;
    transition: width 1s ease;
  }
`;

export const StyledProgressBarWithIcon = styled.div`
  padding: 1rem;
  border-radius: 16px;
  width: 86px;
  height: 32px;
  position: relative;
  transition: left 1s ease;
  color: #000;
  background: #f6f6f6;
  animation: gradient 15s ease infinite;
`;

export const StyledAccordionHead = styled.h4`
  margin: 0;
  padding: 1.5rem 1rem;
  background: #fff;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  position: relative;
  &:hover {
    background: #fafcff;
  }
  &.selected {
    background: #5698d3;
    color: #fff;
    border-radius: 5px;
    cursor: default;
  }
  // &.subSelected{
  //   background: #edf2f8;
  //   color: #000;
  // }
  i {
    font-style: normal;
    vertical-align: middle;
    margin-top: 4px;
    display: inline-block;
  }
  &.selected span:after {
    background: #fca327;
  }
  span {
    width: 20px;
    height: 20px;
    display: inline-block;
    position: relative;
    margin-right: 0.8rem;
    vertical-align: top;
  }
  span.active::after {
    background: #00a886;
    transition: all 0.2s ease;
  }
  span::after {
    content: "";
    position: absolute;
    top: -1px;
    right: -1px;
    width: 24px;
    height: 24px;
    background: #c8c8c8;
    border-radius: 50%;
    border: 2px solid #fff;
  }

  span::before {
    content: "";
    position: absolute;
    top: 5px;
    right: 8px;
    transform: rotate(45deg);
    height: 10px;
    width: 5px;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
    z-index: 2;
    transition: all 0.2s ease;
  }
  strong {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-top: 2px solid #000;
    transform: rotate(225deg);
    border-left: 2px solid #000;
    position: absolute;
    right: 10px;
    top: 40%;
    transition: all 0.8s ease;
  }
  &.selected strong {
    transform: rotate(45deg);
    border-left: 2px solid #fff;
    border-top: 2px solid #fff;
    transition: all 0.8s ease;
  }
`;

export const StyledSubStepTitle = styled.h6`
  margin: 0;
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
  border-radius: 6px;
  cursor: pointer;
  font-weight: normal;
  &:hover {
    background: #edf2f8;
  }
  &.selected {
    background: #5698d3;
    color: #fff;
  }
  &.unvisited-step {
    position: relative;
    font-weight: bold;
  }
  &.unvisited-step:after {
    content: "";
    display:none;
    position: absolute;
    width: 7px;
    height: 7px;
    background: #6a6a6a;
    border-radius: 50%;
    left: -3px;
    top: 11px;
  }
`;

export const StyledButtonGroup = styled.div`
  padding: 0;
  text-align: left;
  margin-top: 1.5rem;
`;

export const StyledIconButton = styled(IconButton)`
  padding: 0px 19px;
  display: inline-flex;
  margin-right: 1.5rem;
  border-radius: 5px;
  span {
    font-size: 13px;
    margin-left: 0px;
  }
  span img{
    margin-right: 8px;
    width: auto;
    vertical-align: middle;
    display: inline-block;
  }
  i {
    font-size: 16px;
    height: 16px;
  }
  &.LEARN_MORE span img{
    vertical-align: top;
    padding-top: 11px;
  }
`;

export const StyledImageTemplate = styled.div`
  padding: 2rem;
  text-align: left;
  background: #f4f7fa;
  line-height: 1.9rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  .icon-wrapper{
    width: 10%;
    vertical-align: top;
    display: inline-block;
  }
  .text-wrapper-image-template{
    display: inline-block;
    width: 90%;
  }
`;

export const StyledTextContent = styled.p`
  font-size: 14px;
  color: #444;
  padding: 2rem;
  text-align: left;
  background: #f4f7fa;
  line-height: 1.9rem;
  border-radius: 10px;
  margin-bottom: 1.2rem;
  div > p {
    &:first-child{
      margin-bottom: 2rem;
    }
    &:last-child{
      margin-bottom: 0rem;
    }
  }
  ul {
    list-style: auto;
    margin-left: 2rem;
    margin-bottom: 0;
    li {
      padding-bottom: 0.5rem;
      &:last-child{
        padding-bottom: 0;
      }
    }
  }
`;

export const StyledSimpleTextContent = styled.p`
  font-size: 14px;
  color: #444;
  text-align: left;
  background: #f4f7fa;
  line-height: 1.9rem;
  border-radius: 10px;
  margin-bottom: 1.2rem;
  ul {
    list-style: auto;
    margin-left: 2rem;
    li {
      padding-bottom: 0.5rem;
    }
  }
`;
