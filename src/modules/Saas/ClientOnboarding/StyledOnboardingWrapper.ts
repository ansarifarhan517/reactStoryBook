import styled from "styled-components";
export const StyledOnboardingWrapper = styled.div`
  .main__content {
    width: 100%;
    display: inline-block;
    height: calc(100vh);
    vertical-align: top;
    position: relative;
    text-align: center;
    max-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 11rem;
    background-color: #fff;
}
  }
  .main__content.LOGINEXT_CAPABILITIES{
    padding-bottom: 5rem;
    padding-top: 5rem;
  }
  .main__content.ORG_PROFILE .btn__group,
  .main__content.ADD_MAIN_HUB .btn__group,
  .main__content.PRIMARY_OPERATIONS .btn__group,
  .main__content.LOGINEXT_CAPABILITIES .btn__group
   {
    position: static;
  }

  .main__content.ORG_PROFILE,
  .main__content.ADD_MAIN_HUB,
  .main__content.PRIMARY_OPERATIONS,
  .main__content.LOGINEXT_CAPABILITIES{
    padding-bottom: 3rem;
  }

  .INDUSTRY_VERTICAL .menuAnimate > div {
    max-height: 150px;
  }
  .content__block {
    text-align: center;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 65rem;
    z-index:1;
  }

  .content__block.ORG_PROFILE,
  .content__block.PRIMARY_OPERATIONS,
  .content__block.OPERATIONS_MODE,
  .content__block.PARTNER_ECOSYSTEM,
  .content__block.ADD_MAIN_HUB,
  .content__block.INVITEUSERS,
  .content__block.LOGINEXT_CAPABILITIES {
    top: 0%;
    left: 0%;
    transform: none;
    width: 80rem;
    position: static;
    margin: 0 auto;
    display: inline-block;
  }
  .content__block.LOGINEXT_CAPABILITIES {
    width: 70rem;
  }
  .content__block.ADD_MAIN_HUB, .content__block.ORG_PROFILE{
    width: 94rem;
  }
  @media only screen and (min-width: 1000px) and (max-width: 1280px) {
    /* For small desktop: */
    .content__block.ADD_MAIN_HUB, .content__block.ORG_PROFILE{
      width: 84rem;
    }
  }
  .ORG_PROFILE .image__container{
    width: 40%
  }
  .ORG_PROFILE .image__container label{
    width: 160px;
    margin: 0;
    border-radius: 10px;
    height: 100px;
    display: inline-block;
    margin-bottom: 15px;
    margin-top: 15px;
  }
  .ORG_PROFILE .image__container label:hover{
    background: #444444b3;
  }
  .ORG_PROFILE .image__container label:hover div#org-img:after {
    z-index: 2;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

  .ORG_PROFILE .image__container label + div{
    margin: 0 !important;
    width: 190px;
    padding-left: 10px;
    display: inline-block !important;
    vertical-align: top;
    font-family: 'Gotham-Rounded-Book';
    line-height: 20px;
    color: #949494 !important;
    font-size: 12px !important;
    padding-top: 50px;
  }
  .ORG_PROFILE .image__container label + div p {
    font-size: 12px;
  }

  .ORG_PROFILE .image__container div#org-img i{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
  }

//   .ORG_PROFILE .image__container label:after {
//     content: 'Click to upload';
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     color: #5698D3;
//     font-size: 14px;
//     width: 100%;
//     text-align: center;
// }

.ORG_PROFILE .image__container label:hover:after{
  display: none;
}

  .ORG_PROFILE .image__container label + div p span{
    display: inline-block;
  }

  .ORG_PROFILE .image__container label #inputContainer{
    border-radius: 10px;
    border: 1px dashed #5698d3;
  }
  .ORG_PROFILE .image__container label:hover  #inputContainer:after{
    display: none
  }
  .ORG_PROFILE .image__container label #inputContainer:after {
    content: 'upload';
    font-size: 14px;
    font-family: 'Gotham-Rounded-Book';
    width: 100%;
    text-align: center;
    position: absolute;
    color: #5698D3;
    z-index:-1;
}
  .ORG_PROFILE .image__container label #inputContainer #test1{
    display: none;
  }
  .content__block.PRIMARY_OPERATIONS,  .content__block.OPERATIONS_MODE {
    text-align: left;
    width: 100%;
    padding: 0 2%;
  }
  .ORG_PROFILE .sc-main-content-container div {
    box-shadow: none;
    background: transparent;
  }
  .btn__group {
    text-align: center;
    position: absolute;
    bottom: 2.5rem;
    width: 100%;
  }
  .btn__group button {
    width: 16.5rem;
    display: inline-block;
    margin-right: 1.5%;
    margin-top: 2rem;
    box-shadow: 0px 0px 5px 1px #dcdcdc;
  }
  .btn__group button.secondary{
    background: #fff;
    color: #5698d3;
  }
  .btn__group button:last-child {
    margin-right: 0%;
  }
  /* Steps css */
  .step__text {
    font-size: 18px;
    color: #7c7c7c;
    padding: 2.5rem 0 2rem 0;
    font-weight: 300;
    text-align: center;
    font-family: "Gotham-Rounded-Book-Light";
  }
  /* Form control css */
  .form__control {
    padding-bottom: 1rem;
    text-align: left;
  }

  .form__control h4 {
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-family: "Gotham-Rounded-Book-Medium";
    margin-bottom: 8px;
    margin-top: 20px;
  }

  .form__control p {
    font-size: 14px;
    padding-bottom: 1rem;
    font-family: "Gotham-Rounded-Book";
    margin-bottom: 0px;
  }

  [id$="-CheckboxWrapper"] {
    display: inline-block;
    padding-right: 8px;
  }

  [id$="-StyledCheckbox"], [id$="-StyledCheckbox"] input{
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }

  .grid-item {
    flex-basis: 100%;
    max-width: 100%;
  }

  .grid-item input{
    margin: 12px 0
  }
  .grid-item input::placeholder, .grid-item [class$="-placeholder"]{
    color: #AEAEAE !important;
    font-family: 'Gotham-Rounded-Book-Light' !important;
  }
  .grid-item input + div{
    top: 6px;
    left: 6px;
  }
  .grid-item div[class$="-control"] div[class$="-Input"]{
    padding: 0;
    margin: 0;
    min-height: 38px;
  }
  .address-fields{
    vertical-align: top;
  }
  .grid-item input,
  .grid-item div[class$="-control"] {
    border-radius: 4px;
    font-family: "Gotham-Rounded-Book";
  }
  .grid-item div[class$="-control"] {
    margin: 13px 0;
  }
  .grid-item div[class$="-control"] div[class$="-ValueContainer"] {
    padding-top: 0;
    padding-bottom: 0;
  }
  .grid-item div[class$="label"] {
    font-family: "Gotham-Rounded-Book";
    font-size: 11px;
    padding: 0 3px;
  }

  .INDUSTRY_VERTICAL [class$="-control"] {
    border-radius: 4px;
    font-family: "Gotham-Rounded-Book-Light";
  }

  .INVITEUSERS .grid-item,
  .system.preferences .grid-item,
  .hub.manager .grid-item,
  .ADD_MAIN_HUB .general.details .grid-item  {
    max-width: none;
    width: 46%;
    display: inline-block;
    margin-right: 2%;
    flex-basis: 36%;
  }

  .admin.details .grid-item{
    flex-basis: 40%;
    max-width: 40%;
  }

  .admin.details .grid-item input {
    width: 95%;
  }

  .toggleSwitch .toggleSwitchLabel {
    width: 50px;
    height: 24px;
    box-shadow: none;
  }

  .toggleSwitch .toggleSwitchLabel input[type="checkbox"] + span{
    box-shadow: none;
    background-color: #ccc;
    color: #fff;
  }

  .toggleSwitch .toggleSwitchLabel input[type="checkbox"]:checked + span{
    background-color: #5698d3;
  }

  .feature__list__item{
    position: relative;
  }

  .feature__list__item i{
    position: absolute;
    width: 75%;
    left: 48px;
    top: 98%;
  }

  .feature__list__item i.img{
    width: 114%;
  }

  .feature__list__item i.flip{
    transform: scaleX(-1);
    left: 123px;
  }

  .feature__list__item i.none{
    display: none
  }

  .launch__wrapper{
    width: 42em;
    height: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .trolly-moving-icon{
    position: absolute;
    bottom: 0;
    left: -88px;
  }
  .bounce2 {
    animation: bounce2 2s ease infinite;
  }
  @keyframes bounce2 {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-30px);}
    60% {transform: translateY(-15px);}
  }

  .launch-container{
    position: absolute;
    width: 87%;
    top: 47%;
    transform: translateY(-50%);
  }

  .toggleSwitch .toggleSwitchLabel input[type="checkbox"] + span:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: #fafafa;
    -webkit-transition: 0.4s;
    -webkit-transition: 0.5s;
    transition: 0.5s;
    border-radius: 50%;
    box-shadow: none;
    z-index: 2;
  }

  .toggleSwitch .toggleSwitchLabel input[type="checkbox"] + span:after {
    content: "NO";
    position: absolute;
    font-family: "Gotham-Rounded-Book";
    font-size: 10px;
    right: 9px;
    top: 5px;
    z-index: 0;
    color: #718190;
    transition: all 0.2s ease;
  }

  .toggleSwitch .toggleSwitchLabel input[type="checkbox"]:checked + span:after {
    content: "YES";
    position: absolute;
    font-family: "Gotham-Rounded-Book";
    font-size: 10px;
    right: 25px;
    top: 5px;
    color: #fff;
    z-index: 0;
    transition: all 0.2s ease;
  }

  .toggle__list {
    padding: 2rem 0;
    border-bottom: 1px solid #ededed;
  }


  button::before, button::after {
    box-sizing: inherit;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
  }

  .draw {
    transition: color 0.15s;
  }
  .draw::before, .draw::after {
    border: 1px solid transparent;
    width: 0;
    height: 0;
  }
  .draw::before {
    top: 0;
    left: 0;
  }
  .draw::after {
    bottom: 0;
    right: 0;
  }
  .draw:hover {
    color:#5698d3;
  }
  .draw:hover::before, .draw:hover::after {
    width: 100%;
    height: 100%;
  }
  .draw:hover::before {
    border-top-color:#5698d3;
    border-right-color:#5698d3;
    transition: width 0.15s ease-out, height 0.15s ease-out 0.15s;
  }
  .draw:hover::after {
    border-bottom-color:#5698d3;
    border-left-color:#5698d3;
    transition: border-color 0s ease-out 0.5s, width 0.15s ease-out 0.5s, height 0.15s ease-out 0.75s;
  }
  
  .meet:hover {
    color: #5698d3;
  }
  .meet::after {
    top: 0;
    left: 0;
  }
  .meet:hover::before {
    border-top-color: #5698d3;
    border-right-color: #5698d3;
  }
  .meet:hover::after {
    border-bottom-color: #5698d3;
    border-left-color: #5698d3;
    transition: height 0.15s ease-out, width 0.15s ease-out 0.15s;
  }
  .PARTNER_ECOSYSTEM .form__control h4{
    margin-bottom: 12px;
    margin-top: 5px;
  }
  .PARTNER_ECOSYSTEM .form__control p{
    line-height: 18px;
    color: #333;
  }
  
`;
