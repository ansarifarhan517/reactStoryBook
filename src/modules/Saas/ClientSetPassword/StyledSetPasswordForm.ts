import styled from "styled-components";
import { PasswordInput } from 'ui-library'
export const StyledSetPasswordWrapper = styled.div`
  .main__content {
    width: 100%;
    display: inline-block;
    height: calc(100vh);
    vertical-align: top;
    position: relative;
    text-align: center;
    max-height: 100vh;
    background-color: #fff;
    border-radius: 0px;
  }
  .content__block {
    text-align: center;
    position: absolute;
    width: 48rem;
    top: 140px;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,0%);
  }
  .main__block__container {
    width: 50rem;
    margin: 0 auto;
  }
  .location__content {
    text-align: left;
    padding-bottom: 1rem;
  }
  .validation__list {
    margin-left: 18px;
    padding: 0.5rem 0;
    text-align: left;
    margin-bottom: 0;
  }
  .validation__list li {
    text-align: left;
    font-size: 12px;
    width: 40%;
    list-style-type: circle;
    display: inline-block;
    position: relative;
    color: #000;
    font-family: 'Gotham-Rounded-Book';
    padding-bottom: 8px;
  }
  .validation__list li.active {
    color: #008967;
  }
  .validation__list li:after {
    content: "";
    position: absolute;
    left: -12px;
    top: 4px;
    width: 5px;
    background: #3e3d3d;
    height: 5px;
    border-radius: 50%;
    transition: all 0.5s ease-in-out;
  }
  
  .validation__list li.active:after {
    content: "";
    position: absolute;
    top: 1px;
    left: -12px;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    height: 11px;
    width: 5px;
    border-bottom: 2px solid #008967;
    border-right: 2px solid #008967;
    z-index: 2;
    background: transparent;
    border-radius: unset;
  }
  .disclaimer__text {
    font-size: 12px;
    padding: 0.7rem 1rem 2.5rem 0.5rem;
    border-bottom: 1px solid #ededed;
    display: inline-block;
    font-weight: 300;
    font-family: 'Gotham-Rounded-Book';
    line-height: 18px;
  }
  .disclaimer__text a {
    padding: 0 0.3rem;
    display: inline-block;
    color: #5698d3;
    text-decoration: underline;
  }
  .partners_img {
    display: inline-block;
    padding-top: 2.5rem;
    width: 50%;
  }
  .partners_img img {
    width: 21%;
    margin-right: 5%;
  }
  .oulined__input-input+div{
    background-color: #fff;
    display: inline-block;
    padding: 1px 5px;
    font-family:'Gotham-Rounded-Book';
  }
  .input__wrapper{
    position: relative;
  } 
  .input__wrapper input+ div{
    padding: 0 5px;
    background: #fff;
    top: 11px;
    left: 6px;
    font-family: 'Gotham-Rounded-Book';
  }
  .input__wrapper button{
    position: absolute;
    top: 30px;
    right: 10px;
    background: transparent;
  }
  input#new-password-input::placeholder, input#confirm-password-input::placeholder{
    color: #AEAEAE !important;
    font-family: 'Gotham-Rounded-Book-Light' !important;
  }
  #error-tooltip{
    color: rgb(255, 255, 255);
    background-color: rgb(244, 67, 54);
  }
`;

export const StyledSetPassword =  styled(PasswordInput)`
  input{
    border-radius: 5px;
    font-family: 'Gotham-Rounded-Book';
    border-color: #C9C9C9;
    font-size: 1.4rem;
    padding: 13px 15px 10px;
    margin-bottom: 10px;

  }
`;

export const StyledDefaultButton = styled.button`
text-transform: inherit;
    width: 100%;
    background-color: rgb(86, 152, 211);
    padding: 12px 10px;
    border-radius: 4px;
    color: #fff;
    font-family: 'Gotham-Rounded-Book';
    transition: all 0.5s ease;
    position: relative;
    :hover{
      background-color: rgb(54 134 205);
       img.Next,  img.Get.Started, img.Launch{
        padding-left: 15px;
      }
    }
    :hover{
      img.Previous{
        padding-right: 15px;
      }
    }
    img.Previous{
      display: inline-block;
      padding-right: 12px;
      transition: all 0.3s ease;
    }
    img.Next{
      transform: rotate(0deg);
      padding-left: 12px;
      transition: all 0.3s ease;
    }
    img.Get.Started{
      padding-left: 12px;
      transition: all 0.3s ease;
    }
    img.Launch{
      padding-left: 12px;
      transition: all 0.3s ease;
    }
`;
