import React, { useEffect, Dispatch } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Grid, IconButton, useToast, Accordion, AccordionHeaderTitle, AccordionContent, withPopup} from 'ui-library'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { hybridRouteTo } from '../../../../utils/hybridRouting'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux'
import { IShipperETAProfileFormActions, AnswerData, IShipperData } from './ShipperETAProfile.model'
import { IShipperCommonFormActions } from '../../ShipperCommon/ShipperCommon.model'
import { AccordionHeader, AccordionSubHeader, AccordionWrapper ,AccordionContentSubHeader, AccordionContentHeader} from './ShipperETAProfile.styles'
import FormField from '../../../../utils/components/Form/FormField'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import axios from '../../../../utils/axios'
import { ILogiAPIResponse } from '../../../../utils/api.interfaces'
import apiMappings from '../../../../utils/apiMapping'
import { generateShipperFormData} from './ShipperETAProfile.utils'
import { tGlobalToastActions } from '../../../common/GlobalToasts/globalToast.reducer'
import FormLoader from '../../../../utils/components/FormLoader'
import withReact from '../../../../utils/components/withReact'
import { getBaseCurrency } from '../../../../utils/core'
import { sendGA } from '../../../../utils/ga';
import { withThemeProvider } from '../../../../utils/theme'
import withRedux from '../../../../utils/redux/withRedux'
const currencySymbol = 'cur_symbol_' + getBaseCurrency()

const ShipperETAProfile = () => {
  const toast = useToast()
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.shipper},${currencySymbol}`)
  const formInstance = useForm<Record<string, any>>({
    mode: 'all', shouldUnregister: false, defaultValues: {}
  })
  const { handleSubmit, reset } = formInstance
  console.log(formInstance.formState.isDirty)

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IShipperETAProfileFormActions>>()
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
  const commonDispatch = useDispatch<Dispatch<IShipperCommonFormActions>>()
  const structure = useTypedSelector(state => state.shipper.ETAProfile.structure)
  const isStructureLoading = useTypedSelector(state => state.shipper.ETAProfile.loading)
  const resetData = useTypedSelector(state => state.shipper.ETAProfile.resetData)
  const onBoardingData = useTypedSelector(state => state.shipper.onBoardingStructure.onBoardingData.data)
  const isLoading = (isStructureLoading)
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const shipperDetailsTem = onBoardingData?.configurationSteps[0]?.subSteps[0]?.answerData;
  const shipperDetails= shipperDetailsTem && shipperDetailsTem!=="" ? JSON.parse(shipperDetailsTem): ''
  const [expanded, setExpanded] = React.useState('0')


  const setEtaProfile = async () => {
    dispatch({ type: '@@shipperETAProfileForm/SET_LOADING', payload: true })
    try {
      const { data: { data, status } } = await axios.get<ILogiAPIResponse<IShipperData>>(`${apiMappings.shipper.etaProfile.saveOrUpdate}?subClientId=${shipperDetails.subClientId}`)
      if (status === 200) {
        
        const _resetData = {
          ...resetData, ...generateShipperFormData(data)
         }
        reset({ ..._resetData })
        dispatch({ type: '@@shipperETAProfileForm/SET_SHIPPER_DATA', payload: data })
        dispatch({ type: '@@shipperETAProfileForm/SET_FORM_RESET_DATA', payload: _resetData })
        dispatch({ type: '@@shipperETAProfileForm/SET_LOADING', payload: false })
      }
    } catch (error) {
      console.log(error)
      dispatch({ type: '@@shipperETAProfileForm/SET_LOADING', payload: false })
    }
  }

  /** Callbacks */
  const onSubmit = async (data: any) => {
    sendGA('Event New',  'shipperSettings - shipper eta profile save');
    if(!formInstance.formState.isDirty){
      hybridRouteTo('shipper')
      return;
    }
    const subClientId = shipperDetails.subClientId ||  '';
    var answerArr:AnswerData[] = [];
       
        structure.map( (section:any) => {
          section && section?.questions?.map((question:{fieldType:string, options:any} )=>{
            if (question.fieldType == 'json') {
              question.options.map((option:{optionValue: string,optionIdentifier:any } )=> {
                  var answerObj:AnswerData = {};
                  answerObj['propertyKey'] = option.optionValue;
                  answerObj['propertyValue'] = data[option.optionIdentifier].value || data[option.optionIdentifier].clientRefMasterCd || data[option.optionIdentifier].propertyValue;
                  if (answerObj['propertyValue'] !== undefined && answerObj['propertyValue'] !== null) {
                      answerArr.push(answerObj);
                      answerObj = {};
                  }
              });
          }
          })
        });
    
    try {
      const { data: response } = await axios['put'](apiMappings.shipper.etaProfile['saveOrUpdate']+`?subClientId=`+subClientId, answerArr, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        toastDispatch({
          type: '@@globalToast/add', payload: {
            message: response.message,
            icon: 'check-round'
          }
        })
      }
    } catch (error) {
      if (error?.response?.data?.status === 428) {
        return
      }
      toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  useEffect(() => {
    if (!onBoardingData) {
      commonDispatch({ type: '@@shipperOnboarding/FETCH_STRUCTURE' })
    }
    else {
      dispatch({ type: '@@shipperETAProfileForm/SET_STRUCTURE', payload: onBoardingData?.configurationSteps[2]?.subSteps })
      setEtaProfile()
    }
  }, [onBoardingData])

  useEffect(() => {
    return () => {
      dispatch({ type: '@@shipperETAProfileForm/RESET_INITIAL_STATE' })
    }
  }, [])

  const handleToggle = (accordianId: string, isExpanded?: boolean) => {
    setExpanded(isExpanded ? accordianId : '')
  }
  return (
    <AccordionWrapper>
      <div id='toast-inject-here'></div>
      <div>
        {isLoading && <div ref={loaderRef}><FormLoader /></div>}

        <div style={isLoading ? { display: 'none' } : {}}>
          {console.log("structure", structure)}
          {structure?.length > 0 && structure.map((section:any) =>
            <div key={section.stepNameLabelKey}>
              {section?.questions && section.questions.map((question: any, index: number) => {
                return <Accordion id={index.toString()} expanded={expanded == index.toString()} onToggle={handleToggle}>
                  {{
                    header: (
                      <>
                        <AccordionHeaderTitle>
                          <AccordionHeader>{question.questionLabel}</AccordionHeader>
                          <AccordionSubHeader>{question.questionDescLabel}</AccordionSubHeader>
                        </AccordionHeaderTitle>
                      </>
                    ),
                    content: (
                      <AccordionContent>
                        {question?.options && question.options.map( (option:any) => {
                          option.fieldType = (option?.optionIdentifier == 'OPTION_ETAWINDOW') ?'select': 'input'
                          option.lookupType = 'getETAWindowOptions'
                          option.editable = true
                          // option._id= option?.optionIdentifier
                          option.label=''
                          option.fieldName= option?.optionIdentifier
                          option.permission= true
                          option.isSearchable= false
                          option.isCustomField= false
                          option.required= false
                          option.options= []
                          option.labelKey= option?.optionIdentifier
                          return <Grid container spacing='10px' style={{padding: '10px 0' }} key={option.optionIdentifier}>
                            <Grid item md={10} xs={10} sm={10} className='grid-item'>
                              <AccordionContentHeader> {option.optionLabel} </AccordionContentHeader>
                              <AccordionContentSubHeader> {option.optionDescLabel} </AccordionContentSubHeader>
                            </Grid>
                            <Grid item md={2} xs={2} sm={2} className='grid-item'>
                              
                            <FormField
                                name={option.optionIdentifier}
                                meta={option}
                                formInstance={formInstance}
                                 />
                            </Grid>
                          </Grid>

                        })}

                      </AccordionContent>
                    )
                  }}
                </Accordion>
              }
              )}
            </div>
          )}
        </div>
        <Box horizontalSpacing='15px' display='flex' mt='30px' style={isLoading ? { display: 'none' } : {}}>
          <IconButton id="shipperETAProfile-actionBar-save" iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={handleSubmit(onSubmit)} primary>{dynamicLabels.save}</IconButton>
          <IconButton iconVariant='icomoon-close' style={{ padding: '0px 15px' }} onClick={() => {
           sendGA('Event New',  'shipperSettings - shipper eta profile cancel');
            hybridRouteTo('shipper');
          }}>{dynamicLabels.cancel}</IconButton>
        </Box>
      </div>
    </AccordionWrapper>
  )
}

export default withThemeProvider(withRedux(withPopup(ShipperETAProfile)), false)