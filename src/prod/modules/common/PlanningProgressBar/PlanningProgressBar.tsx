import React, { useState } from 'react';
import {Button} from 'ui-library'
import { PlanningProgressBarWrapper, ImageWrapper, ProgressStep, ActionButtons } from './PlanningStyledComponents'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
interface ProgressBarProps {
    structure?:any,
    handleSubmit:Function
    validateForm:Function
    stepperConfig:any
    goToStep:Function,
    disableNext?:boolean,
    isEditMode?:boolean
}

const PlanningProgressBar = ({handleSubmit, validateForm, stepperConfig,goToStep, disableNext=false, isEditMode=false}: ProgressBarProps) => {
   const isLastStep = stepperConfig && stepperConfig.length ? stepperConfig?.findIndex((element:any) => element.isActive) == stepperConfig.length -1 :0
   const activeStepIndex= stepperConfig && stepperConfig.length ?  stepperConfig?.findIndex((element:any) => element.isActive): 0
   const [showTooltip, setShowTooltip]=useState(true)
   const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    return (
            <PlanningProgressBarWrapper>
                {stepperConfig?.map((steps: any, index:number) => {
                    return (
                        <ProgressStep onClick={()=> index>activeStepIndex? {} : goToStep(index)} className={steps.isActive? 'active ':  index>activeStepIndex? ' disabled':  index==activeStepIndex-1 ? 'activeBefore':''} key={"stepWrapper_"+steps.name+index}>
                       
                       {/* This is to show as tooltip */}
                        {steps.summary?.length!==0 && !steps.showPopover &&  index< activeStepIndex && <div className="popover_wrapper showAsTooltip">
                            <div dangerouslySetInnerHTML={{ __html: `${steps.summary}` }}></div>
                        </div> 
                        }
                       {/* This is popover */}
                        {steps.summary?.length!==0 && showTooltip && index== activeStepIndex-1 &&
                        <div className="popover_wrapper popover_wrapper-opened" onClick={(e)=>{e.stopPropagation()}}>
                            <i className="logi-icon icon-Product-Icons_X close-tooltip" onClick={()=>{setShowTooltip(false)}}/>
                            <div dangerouslySetInnerHTML={{ __html: `${steps.summary}` }}></div>
                        </div> 
                        }
                        <ImageWrapper key="steps.stepIcon">
                         {index==activeStepIndex-1 && steps.summary?.length!==0 && <div className="tip_notify"></div>}
                        <img src={steps.stepIcon} />
                        </ImageWrapper>
                        {/* </Tooltip> */}
                        <div key={"stepNameDiv_"+steps.stepName}>{dynamicLabels[steps?.steplabelKey] || steps.stepName}</div>
                      
                        </ProgressStep>

                    )
                })
                }
                <ActionButtons>
                  <Button id={`${isLastStep? (isEditMode? 'Update': 'Save'): 'Next'}-button-TripPlanningScheduler`} primary onClick={()=>{handleSubmit(validateForm)()}} disabled={disableNext}>
                     {isLastStep  && <i className="logi-icon icon-Product-Icons_Save"></i>}<span>{isLastStep? (isEditMode? 'Update': 'Save'): 'Next'} </span>{!isLastStep && <i className="logi-icon icon-Product-Icons_Arrow-Right"></i>}
                  </Button>
                  
                </ActionButtons>
                {/* <IconButton
                iconSize="md"
                primary
                intent='page'
                iconVariant='icomoon-save'
                onClick={() => {}} >
                {dynamicLabels.save || 'Save'}
        </IconButton> */}
            </PlanningProgressBarWrapper>
    )
}

export default React.memo(PlanningProgressBar);