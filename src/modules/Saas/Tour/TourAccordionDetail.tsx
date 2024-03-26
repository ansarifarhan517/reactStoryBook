import React from 'react';
import VideoViewer from './Components/VideoViewer';
import TextContent from './Components/TextContent';
import ButtonGroup from './Components/ButtonGroup';
import { StyledImageTemplate } from './Layouts/StyledOnboardingView';
import iconCardIcon from '../../../../images/onboardingClient/ic-driver-app.svg';

const VideoTemplate = ({data, id, index, redirectSupport}) => {
  return (
    <>
      {
        data.videoUrl !== '' &&
          <VideoViewer url={data.videoUrl} id={id}/>
      }
      <TextContent textContent={data?.description} isHTML={true}/>
      <ButtonGroup buttons={data?.buttons} descriptionKey={id} index={index} redirectSupport={redirectSupport}/>
    </>
  )
}

const IconSeperator = () => {
  return(
    <div className='icon-wrapper'>
      <img src={iconCardIcon}></img>
    </div>
  )
}

const ImageTemplate = ({data, id, index, redirectSupport) => {
  return (
    <StyledImageTemplate>
      {/* <Icon /> */}
      <IconSeperator />
      <div className='text-wrapper-image-template'>
        <h3 style={{color: '#000', fontSize: '2rem'}}>{data?.title}</h3>
        <TextContent textContent={data?.description} isHTML={true} type='secondary'/>
        <ButtonGroup buttons={data?.buttons} descriptionKey={id} index={index} redirectSupport={redirectSupport}/>
      </div>
    </StyledImageTemplate>
  )
}

const AccordionBodyTemplate = ({template, id, index, redirectSupport}) => {
  return (
    <>
      {
        template.type === 'Video' &&
        <VideoTemplate data={template} id={id} index={index} redirectSupport={redirectSupport}/>
      }
      {
         template.type === 'Image' &&
         <ImageTemplate data={template} id={id} index={index} redirectSupport={redirectSupport}/>
      }
    </>
  )
}

function TourAccordionDetail({step, redirectSupport}) {
  return (
    <>
      {/* <div>TourAccordionDetail {step?.stepId}</div> */}
     {
       step.templates && step.templates.length > 0 && step.templates.map((templateData, index) => {
         return <AccordionBodyTemplate key={index} template={templateData} index={index} id={step.stepName} redirectSupport={redirectSupport}/>
       })
     }
    </>
  )
}

export default TourAccordionDetail;