import styled from "styled-components";
import { Grid } from "ui-library";

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
    padding: 60px 30px;
    text-align: center;
    position: relative;
  }
  .sidebar-footer{
    // position: absolute;
    // bottom: 1.5rem;
    // text-align: center;
    // width: 85%;
    padding-top: 5rem;
    p{
      font-size: 16px;
    }
    a{
      font-size: 14px;
      color: #f8ad3f;
      text-decoration: underline;
    }
  }
  .content-wrapper-onboarding {
    width: 70%;
    float: right;
    height: calc(100vh);
    display: inline-block;
    position: relative;
    background-color: #5698d3;
  }

  .launch__wrapper {
    width: 42em;
    height: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .trolly-moving-icon {
    position: absolute;
    bottom: -3px;
    z-index: 2;
    left: -30%;
    transition: all 0.5s ease;
  }
  .clouds-bg-icon {
    position: absolute;
    width: 100%;
    left: -6%;
    // animation: cloud2 20s infinite linear;
  }
  .location-icon.bounce2 {
    animation: bounceIcon 4s ease infinite;
  }
  @keyframes bounceIcon {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  @keyframes cloud2 {
    from {
      transform: translate3d(200px, 0, 0);
    }
    to {
      transform: translate3d(-200px, 0, 0);
    }
  }

  .cloud-small {
  }
  .launch__container {
    height: calc(100vh);
    background: #fff;
    border-radius: 0px;
  }
  .launch__container span {
    display: block;
    text-align: center;
    font-size: 20px;
    position: absolute;
    bottom: -36px;
    width: 100%;
  }
  .launch__loader__icon {
    text-align: center;
    height: 201px;
    position: absolute;
    width: 100%;
    overflow: hidden;
  }

  .location-icon {
    position: absolute;
    left: 106px;
    top: 14px;
  }

  .progress {
    margin-top: 5px;
    margin-left: 0;
    margin-right: 0;
    height: 10px !important;
    box-shadow: none;
    background-color: rgb(230 230 230);
    position: absolute;
    bottom: -32px;
    width: 100%;
    left: 0;
  }

  .progress-value {
    display: none;
  }

  .progress-bar {
    background-color: #a2a2a2;
  }

  .img-icon-wrapper {
    padding: 30px 0;
  }
  .img-wrapper {
    img {
      width: auto;
    }
  }
  .sidebarWrapper h4 {
    color: #fff;
    font-size: 30px;
    margin-bottom: 15px;
    font-family: "Gotham-Rounded-Book-Medium";
    margin-left: 3rem;
    margin-right: 3rem;
  }
  .sidebarWrapper p {
    font-size: 18px;
    color: #fff;
    line-height: 24px;
    font-family: "Gotham-Rounded-Book-Light";
    font-weight: 400;
  }
  .sidebarWrapper p span {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .launch-container {
    position: absolute;
    width: 87%;
    top: 47%;
    transform: translateY(-50%);
  }
`;
