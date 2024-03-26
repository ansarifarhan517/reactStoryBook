import React from "react";
import {
  StyledButtonGroup,
  StyledIconButton,
} from "../Layouts/StyledOnboardingView";
import trynowIcon from '../../../../../images/onboardingClient/ic-play.svg';
import learnmoreIcon from '../../../../../images/onboardingClient/ic-learn-more.svg';
import apiIcon from '../../../../../images/onboardingClient/ic-developer-portal.svg';



const iconMap = {
  'Try Now' : trynowIcon,
  'Learn More': learnmoreIcon,
  'API Details': apiIcon
}

const buttonIdMap = {
  'Try Now' : 'TRY_NOW',
  'Learn More': 'LEARN_MORE',
  'API Details': 'API_DETAILS'
}

function CustomIconButton({ item, id, index, redirectSupport }) {
  console.log('id', item.label)
  const routeChange = () => {
    if (window.location.origin == "http://localhost:9001") {
       
        if(item.label === 'Learn More'){
          redirectSupport(item.url)
        }else{
          window.open('#'+item.url, "_blank");
        }
        } else {
          if(item.label === 'Learn More'){
            redirectSupport(item.url)
          }else{
            window.open(item.url, "_blank");
          }
       
      }
    // if(item.labelKey === 'TRY_NOW'){
    //   let url = '/product/#'+item.url;
    //   window.open(url, "_target");
    // }else if(item.labelKey === 'API_DETAILS'){
    //   let url = '/product/#'+item.url
    //   window.open(url, "_target");
    // }else{
    //   if (window.location.origin == "http://localhost:9001") {
    //     window.open(item.url, "_blank");
    //     } else {
    //     window.open(item.url, "_blank");
    //   }
      
    // }
    
  };

  return (
    <StyledIconButton primary iconVariant={''} className={buttonIdMap[item.label]} id={id+'_'+buttonIdMap[item.label]+'_'+index} onClick={routeChange}>
      <img src={iconMap[item.label]}/>
      {item.label}
    </StyledIconButton>
  );
}

function ButtonGroup({ buttons, descriptionKey='', index, redirectSupport }) {
  return (
    <StyledButtonGroup>
      {buttons.map((button, i) => {
        return <CustomIconButton key={i} item={button} index={index} id={descriptionKey} redirectSupport={redirectSupport}/>;
      })}
    </StyledButtonGroup>
  );
}

export default ButtonGroup;
