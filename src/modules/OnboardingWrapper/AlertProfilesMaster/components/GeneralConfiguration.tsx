import React from 'react'
import { Box, TextInput, Accordion, AccordionHeaderTitle, AccordionHeaderSubTitle, Toggle, DatePicker, Grid, Checkbox } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
// import { useDispatch } from 'react-redux'
// import { tAlertProfilesMasterActions } from '../AlertProfilesMaster.actions'
import { useFormContext } from 'react-hook-form'
import { REGEXPS } from '../../../../utils/constants'
import moment from 'moment';

const GeneralConfiguration = () => {
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const { register, errors, setValue } = useFormContext()
  const generalParamMap = useTypedSelector(state => state.settings.alertProfilesMaster.settings.apiResponse.generalParamMap)
  const readOnly = useTypedSelector(state => state.settings.alertProfilesMaster.readonlyMode)

  const trackerAlertsArray = ['TRACKERLOWBATTERYPERC', 'INSURANCEALERTWINDOW', 'REPEATVEHICLEOVERSPEEDINTERVAL', 'VEHICLEMAXSPEED', 'TRACKERGPSCALCDURATIONINMINS']
  const [temperatureDeviationChecked, temperatureDeviationSetChecked] = React.useState<boolean>(generalParamMap['TRACKERTEMPPERCENTAGECHECK']?.paramValue === 'Y')
  const [startTimeHrs, setStartTimeHrs] = React.useState< Date | undefined >()
  const [endTimeHrs, setEndTimeHrs] = React.useState<Date | undefined>()
  return <Box>

    {(generalParamMap.LOWBATTERYPERC) && <Box
      style={{ width: 'calc(25% - 15px)' }}
    >
      <TextInput
        id='generalParamMap.LOWBATTERYPERC'
        name='generalParamMap.LOWBATTERYPERC'
        label={dynamicLabels.lowBatteryPercentage + ' (%)'}
        placeholder={dynamicLabels.lowBatteryPercentage + ' (%)'}
        type='number'
        fullWidth
        defaultValue={generalParamMap.LOWBATTERYPERC?.paramValue}
        min={0}
        max={99}
        ref={register({
          min: 0,
          max: 99,
          pattern: REGEXPS.wholeNumber,
        })}
        disabled={readOnly}
        error={errors?.generalParamMap?.LOWBATTERYPERC}
        errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels.lowBatteryPercentage}`}
      />
    </Box>}
    {(generalParamMap.NODRIVEZONEALERTFREQUENCYINMINS) && <Box
      style={{ width: 'calc(25% - 15px)' }}
    >
      <TextInput
        id='generalParamMap.NODRIVEZONEALERTFREQUENCYINMINS'
        name='generalParamMap.NODRIVEZONEALERTFREQUENCYINMINS'
        label={dynamicLabels.NODRIVEZONEALERTFREQUENCYINMINS}
        placeholder={dynamicLabels.NODRIVEZONEALERTFREQUENCYINMINS}
        type='text'
        fullWidth
        defaultValue={generalParamMap.NODRIVEZONEALERTFREQUENCYINMINS?.paramValue}
        min={1}
        max={99999}
        ref={register({
          min: 1,
          max: 99999,
          pattern: REGEXPS.noDriveZone,
        })}
        disabled={readOnly}
        error={errors?.generalParamMap?.NODRIVEZONEALERTFREQUENCYINMINS}
        errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels.NODRIVEZONEALERTFREQUENCYINMINS}`}
      />
    </Box>}
    {(generalParamMap.TIMEWINDOW?.paramLabel == 'TIMEWINDOW_LABEL') && <Box
      style={{ width: 'calc(29% - 15px)' }}
    >
      <TextInput
        id='generalParamMap.TIMEWINDOW'
        name='generalParamMap.TIMEWINDOW'
        label={dynamicLabels.timewindowTimefenceLabel}
        placeholder={dynamicLabels.timewindowTimefenceLabel}
        type='number'
        fullWidth
        defaultValue={generalParamMap.TIMEWINDOW?.paramValue}
        min={0}
        max={999}
        ref={register({
          min:0,
          max:999,
          pattern: REGEXPS.decimal,
        })}
        disabled={readOnly}
        error={errors?.generalParamMap?.TIMEWINDOW}
        errorMessage={dynamicLabels.pleaseEnterValidTimewindow}
      />
    </Box>}
    {(generalParamMap.TIMEWINDOW?.paramLabel == 'TIMEWINDOW_DAYS_LABEL') && <Box
      style={{ width: 'calc(29% - 15px)' }}
    >
      <TextInput
        id='generalParamMap.TIMEWINDOW'
        name='generalParamMap.TIMEWINDOW'
        label={dynamicLabels.timewindowDaysLabel}
        placeholder={dynamicLabels.timewindowDaysLabel}
        type='number'
        fullWidth
        defaultValue={generalParamMap.TIMEWINDOW?.paramValue}
        min={0}
        max={999}
        ref={register({
          min:0,
          max:999,
          pattern: {
            value: REGEXPS.wholeNumberWithMax,
            message: dynamicLabels.pleaseEnterValidTimewindow
          }

        })}
        disabled={readOnly}
        error={errors?.generalParamMap?.TIMEWINDOW}
        errorMessage={dynamicLabels.pleaseEnterValidTimewindow}
      />
    </Box>}
    {(generalParamMap.STUCKDURATION) && <Box
      style={{ width: 'calc(29% - 15px)' }}
    >
      <TextInput
        id='generalParamMap.STUCKDURATION'
        name='generalParamMap.STUCKDURATION'
        label={dynamicLabels.stuckDuration + ' ' + dynamicLabels.minutes}
        placeholder={dynamicLabels.stuckDuration + ' ' + dynamicLabels.minutes}
        type='text'
        fullWidth
        defaultValue={generalParamMap.STUCKDURATION?.paramValue}
        min={5}
        max={99999}
        ref={register({
          min: 5,
          max: 99999,
          pattern: REGEXPS.stuckDuration,
        })}
        disabled={readOnly}
        error={errors?.generalParamMap?.STUCKDURATION}
        errorMessage={dynamicLabels.pleaseEnterValidDuration}
      />
    </Box>}

    {(generalParamMap.REVISEETADIFFINMINS) && <Box
      style={{ width: 'calc(50% - 15px)' }}
    >
      <TextInput
        id='generalParamMap.REVISEETADIFFINMINS'
        name='generalParamMap.REVISEETADIFFINMINS'
        label={dynamicLabels.reviseEtaDiffInMins}
        placeholder={dynamicLabels.reviseEtaDiffInMins}
        type='number'
        fullWidth
        defaultValue={generalParamMap.REVISEETADIFFINMINS?.paramValue}
        ref={register({
          pattern: REGEXPS.wholeNumber,
        })}
        disabled={readOnly}
        error={errors?.generalParamMap?.REVISEETADIFFINMINS}
        errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels.reviseEtaDiffInMins}`}
      />
    </Box>}

    {(generalParamMap.DELIVERYDELAYEDDURATION) && <Box
      style={{ width: 'calc(25% - 15px)' }}
    >
      <TextInput
        id='DELIVERYDELAYEDDURATION'
        name='generalParamMap.DELIVERYDELAYEDDURATION'
        label={dynamicLabels.delayedDurationInMins}
        placeholder={dynamicLabels.delayedDurationInMins}
        type='number'
        fullWidth
        defaultValue={generalParamMap.DELIVERYDELAYEDDURATION?.paramValue}
        ref={register({
          pattern: REGEXPS.wholeNumber,
        })}
        disabled={readOnly}
        error={errors?.generalParamMap?.DELIVERYDELAYEDDURATION}
        errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels.delayedDurationInMins}`}
      />
    </Box>}

    {(generalParamMap.DELIVERYBEFORETIMEDURATION) && <Box
      style={{ width: 'calc(25% - 15px)' }}
    >
      <TextInput
        id='DELIVERYBEFORETIMEDURATION'
        name='generalParamMap.DELIVERYBEFORETIMEDURATION'
        label={dynamicLabels.beforeTimeDurationInMins}
        placeholder={dynamicLabels.beforeTimeDurationInMins}
        type='number'
        fullWidth
        defaultValue={generalParamMap.DELIVERYBEFORETIMEDURATION?.paramValue}
        ref={register({
          pattern: REGEXPS.wholeNumber,
        })}
        disabled={readOnly}
        error={errors?.generalParamMap?.DELIVERYBEFORETIMEDURATION}
        errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels.beforeTimeDurationInMins}`}
      />
    </Box>}

    {(generalParamMap.PICKUPDELAYEDDURATION) && <Box
      style={{ width: 'calc(25% - 15px)' }}
    >
      <TextInput
        id='PICKUPDELAYEDDURATION'
        name='generalParamMap.PICKUPDELAYEDDURATION'
        label={dynamicLabels.delayedDurationInMins}
        placeholder={dynamicLabels.delayedDurationInMins}
        type='number'
        fullWidth
        defaultValue={generalParamMap.PICKUPDELAYEDDURATION?.paramValue}
        ref={register({
          pattern: REGEXPS.wholeNumber,
        })}
        disabled={readOnly}
        error={errors?.generalParamMap?.PICKUPDELAYEDDURATION}
        errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels.delayedDurationInMins}`}
      />
    </Box>}
    
    {(generalParamMap.PICKUPBEFORETIMEDURATION) && <Box
      style={{ width: 'calc(25% - 15px)' }}
    >
      <TextInput
        id='PICKUPBEFORETIMEDURATION'
        name='generalParamMap.PICKUPBEFORETIMEDURATION'
        label={dynamicLabels.beforeTimeDurationInMins}
        placeholder={dynamicLabels.beforeTimeDurationInMins}
        type='number'
        fullWidth
        defaultValue={generalParamMap.PICKUPBEFORETIMEDURATION?.paramValue}
        ref={register({
          pattern: REGEXPS.wholeNumber,
        })}
        disabled={readOnly}
        error={errors?.generalParamMap?.PICKUPBEFORETIMEDURATION}
        errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels.beforeTimeDurationInMins}`}
      />
    </Box>}
{/* generic code to display text input fields in general params map object */}
    {(Object.keys(generalParamMap).length) &&
      <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
        {Object.keys(generalParamMap).sort().map((field: any) => {
          if (field !== 'ISVISIBLETOCUSTOMER' && trackerAlertsArray.includes(field)) {
            return (
              <Grid item key={`generalParamMap.${field}`} xs={12} sm={4} md={4} style={{ padding: '5px 5px 0px 5px' }} className='grid-item'>
                <TextInput
                  id={`generalParamMap.${field}`}
                  name={`generalParamMap.${field}`}
                  label={dynamicLabels?.[field] || field}
                  placeholder={dynamicLabels?.[field] || field}
                  type='number'
                  fullWidth
                  defaultValue={generalParamMap[field]?.paramValue}
                  min={0}
                  max={(field === 'TRACKERLOWBATTERYPERC' || field === 'TRACKERTEMPDEVIATIONPERCENTAGE') ? 99 : 999}
                  ref={register({
                    min: 0,
                    max: (field === 'TRACKERLOWBATTERYPERC' || field === 'TRACKERTEMPDEVIATIONPERCENTAGE') ? 99 : 999,
                    pattern: REGEXPS.wholeNumber,
                    required: field === 'INSURANCEALERTWINDOW' ? true : false
                  })}
                  disabled={readOnly}
                  required={field === 'INSURANCEALERTWINDOW' ? true : false}
                  error={errors?.generalParamMap?.[field]}
                  errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels?.[field]}`}
                />
              </Grid>
            )
          }
        })}
      </Grid>}
    {(generalParamMap.VEHCILENODRIVESTARTTIMEHRS) && <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
      <Grid item key={'VEHCILENODRIVESTARTTIMEHRS'} xs={12} sm={4} md={4} style={{ paddingRight: '5px' }} className='grid-item'>
        <DatePicker
          onChange={(d: Date | any) => {
            setStartTimeHrs(d)
            setValue("generalParamMap.VEHCILENODRIVESTARTTIMEHRS", d, { shouldDirty: true })
          }}
          label='VEHCILENODRIVESTARTTIMEHRS'
          variant='time'
          timeInterval={30}
          timeFormat={24}
          selected={startTimeHrs}
          style={{
            position: 'absolute',
            top: 'auto',
            right: 'auto',
            zIndex: 1,
            width: '100%'
          }}
          id='generalParamMap.VEHCILENODRIVESTARTTIMEHRS'
          name='generalParamMap.VEHCILENODRIVESTARTTIMEHRS'
        >
          {({ value, open, setOpen }: any) => (
            <div onClick={() => {
              setOpen(!open)
              console.log('value', value)
            }}>
              <TextInput
                id='generalParamMap.VEHCILENODRIVESTARTTIMEHRS'
                name='generalParamMap.VEHCILENODRIVESTARTTIMEHRS'
                className='someClassname'
                placeholder={dynamicLabels.VEHCILENODRIVESTARTTIMEHRS}
                label={dynamicLabels.VEHCILENODRIVESTARTTIMEHRS}
                onClick={() => {
                  setOpen(!open)
                }}
                defaultValue={!(generalParamMap.VEHCILENODRIVESTARTTIMEHRS && generalParamMap.VEHCILENODRIVESTARTTIMEHRS.paramValue) ? '' : moment(generalParamMap.VEHCILENODRIVESTARTTIMEHRS?.paramValue, 'HH:mm:ss').subtract(new Date().getTimezoneOffset(), "minute").format("HH:mm:ss")}
                value={startTimeHrs !== undefined ? moment(startTimeHrs).format('HH:mm:ss') === "Invalid date" ? '' : moment(startTimeHrs).format('HH:mm:ss') : (startTimeHrs !== '' ? value && moment(value).format('HH:mm:ss') === "Invalid date" ? '' : value && moment(value).format('HH:mm:ss') : '')}
                read-only
                fullWidth
                onChange={(date: any) => { }}
                ref={register()}
              />

            </div>
          )}
        </DatePicker>
      </Grid>
      <Grid item key={'VEHCILENODRIVEENDTIMEHRS'} xs={12} sm={4} md={4} style={{ paddingRight: '5px' }} className='grid-item'>
        <DatePicker
          onChange={(d: any) => {
            setEndTimeHrs(d)
            setValue("generalParamMap.VEHCILENODRIVEENDTIMEHRS", d, { shouldDirty: true })
          }}
          label='generalParamMap.VEHCILENODRIVEENDTIMEHRS'
          variant='time'
          timeInterval={30}
          timeFormat={24}
          selected={endTimeHrs}
          style={{
            position: 'absolute',
            top: 'auto',
            right: 'auto',
            zIndex: 1,
            width: '100%'
          }}
        >
          {({ value, open, setOpen }: any) => (
            <div onClick={() => setOpen(!open)}>
              <TextInput
                id='generalParamMap.VEHCILENODRIVEENDTIMEHRS'
                name='generalParamMap.VEHCILENODRIVEENDTIMEHRS'
                className='someClassname'
                placeholder={dynamicLabels.VEHCILENODRIVEENDTIMEHRS}
                label={dynamicLabels.VEHCILENODRIVEENDTIMEHRS}
                onClick={() => {
                  setOpen(!open)
                }}
                defaultValue={!(generalParamMap.VEHCILENODRIVEENDTIMEHRS && generalParamMap.VEHCILENODRIVEENDTIMEHRS.paramValue) ? '' : moment(generalParamMap.VEHCILENODRIVEENDTIMEHRS?.paramValue, 'HH:mm:ss').subtract(new Date().getTimezoneOffset(), "minute").format("HH:mm:ss")}
                value={endTimeHrs !== undefined ? moment(endTimeHrs).format('HH:mm:ss') === "Invalid date" ? '' : moment(endTimeHrs).format('HH:mm:ss') : (endTimeHrs !== '' ? value && moment(value).format('HH:mm:ss') === "Invalid date" ? '' : value && moment(value).format('HH:mm:ss') : '')}
                read-only
                fullWidth
                onChange={() => { }}
                ref={register()}
              />

            </div>
          )}
        </DatePicker>
      </Grid>
      <Grid item key={'VEHCILENODRIVECALCDURATIONINMINS'} xs={12} sm={4} md={4} style={{ paddingRight: '5px' }} className='grid-item'>
        <TextInput
          id='generalParamMap.VEHCILENODRIVECALCDURATIONINMINS'
          name='generalParamMap.VEHCILENODRIVECALCDURATIONINMINS'
          label={dynamicLabels.VEHCILENODRIVECALCDURATIONINMINS}
          placeholder={dynamicLabels.VEHCILENODRIVECALCDURATIONINMINS}
          type='number'
          fullWidth
          defaultValue={generalParamMap.VEHCILENODRIVECALCDURATIONINMINS?.paramValue}
          ref={register({
            pattern: REGEXPS.wholeNumber,
          })}
          disabled={readOnly}
          error={errors?.generalParamMap?.VEHCILENODRIVECALCDURATIONINMINS}
          errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels.VEHCILENODRIVECALCDURATIONINMINS}`}
        />
      </Grid>
    </Grid>}
    {(generalParamMap.TRACKERTEMPPERCENTAGECHECK) && <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
      <Grid item key={'TRACKERMAXTEMPERATURE'} xs={12} sm={4} md={4} style={{ padding: '0px 5px 0px 5px' }} className='grid-item'>
        <TextInput
          id={`generalParamMap.TRACKERMAXTEMPERATURE`}
          name={`generalParamMap.TRACKERMAXTEMPERATURE`}
          label={dynamicLabels.TRACKERMAXTEMPERATURE}
          placeholder={dynamicLabels.TRACKERMAXTEMPERATURE}
          type='number'
          fullWidth
          defaultValue={generalParamMap['TRACKERMAXTEMPERATURE']?.paramValue}
          min={0}
          max={999}
          ref={register({
            min: 0,
            max: 999,
            pattern: REGEXPS.wholeNumber,
            required: false
          })}
          disabled={readOnly}
          required={false}
          error={errors?.generalParamMap?.['TRACKERMAXTEMPERATURE']}
          errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels?.['TRACKERMAXTEMPERATURE']}`}
        />
      </Grid>
      <Grid item key={'TRACKERMINTEMPERATURE'} xs={12} sm={4} md={4} style={{ padding: '0px 5px 0px 5px'}} className='grid-item'>
        <TextInput
          id={`generalParamMap.TRACKERMINTEMPERATURE`}
          name={`generalParamMap.TRACKERMINTEMPERATURE`}
          label={dynamicLabels.TRACKERMINTEMPERATURE}
          placeholder={dynamicLabels.TRACKERMINTEMPERATURE}
          type='number'
          fullWidth
          defaultValue={generalParamMap['TRACKERMINTEMPERATURE']?.paramValue}
          min={0}
          max={999}
          ref={register({
            min: 0,
            max: 999,
            pattern: REGEXPS.wholeNumber,
            required: false
          })}
          disabled={readOnly}
          required={false}
          error={errors?.generalParamMap?.['TRACKERMINTEMPERATURE']}
          errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels?.['TRACKERMINTEMPERATURE']}`}
        />
      </Grid>
      <Grid item key={'TRACKERTEMPALERTREPEATDURATION'} xs={12} sm={4} md={4} style={{ padding: '0px 5px 0px 5px' }} className='grid-item'>
        <TextInput
          id={`generalParamMap.TRACKERTEMPALERTREPEATDURATION`}
          name={`generalParamMap.TRACKERTEMPALERTREPEATDURATION`}
          label={dynamicLabels.TRACKERTEMPALERTREPEATDURATION}
          placeholder={dynamicLabels.TRACKERTEMPALERTREPEATDURATION}
          type='number'
          fullWidth
          defaultValue={generalParamMap['TRACKERTEMPALERTREPEATDURATION']?.paramValue}
          min={0}
          max={999}
          ref={register({
            min: 0,
            max: 999,
            pattern: REGEXPS.wholeNumber,
            required: false
          })}
          disabled={readOnly}
          required={false}
          error={errors?.generalParamMap?.['TRACKERTEMPALERTREPEATDURATION']}
          errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels?.['TRACKERTEMPALERTREPEATDURATION']}`}
        />
      </Grid>
      <Grid item key={'TRACKERTEMPPERCENTAGECHECK'} xs={12} sm={4} md={4} style={{ display: 'flex', alignItems: 'center'}} className='grid-item'>
        <Checkbox
          id={`generalParamMap.TRACKERTEMPPERCENTAGECHECK`}
          name={`generalParamMap.TRACKERTEMPPERCENTAGECHECK`}
          onChange={() => {
            temperatureDeviationSetChecked(!temperatureDeviationChecked);
            setValue("generalParamMap.TRACKERTEMPPERCENTAGECHECK", temperatureDeviationChecked ? "N": "Y", { shouldDirty: true })
            generalParamMap['TRACKERTEMPPERCENTAGECHECK'].paramValue = temperatureDeviationChecked ? "N": "Y"
          }}
          checked={generalParamMap['TRACKERTEMPPERCENTAGECHECK']?.paramValue === 'Y'}
          defaultChecked={generalParamMap['TRACKERTEMPPERCENTAGECHECK']?.paramValue === 'Y'}
          label={dynamicLabels.TRACKERTEMPPERCENTAGECHECK}
          checkboxSize='md'
          ref={register()}
        />
      </Grid>
      {temperatureDeviationChecked && generalParamMap['TRACKERTEMPPERCENTAGECHECK']?.paramValue === 'Y' &&
        <>
          <Grid item key={'TRACKERTEMPDEVIATIONINTERVAL'} xs={12} sm={4} md={4} style={{ padding: '0px 5px 0px 5px' }} className='grid-item'>
            <TextInput
              id={`generalParamMap.TRACKERTEMPDEVIATIONINTERVAL`}
              name={`generalParamMap.TRACKERTEMPDEVIATIONINTERVAL`}
              label={dynamicLabels.TRACKERTEMPDEVIATIONINTERVAL}
              placeholder={dynamicLabels.TRACKERTEMPDEVIATIONINTERVAL}
              type='number'
              fullWidth
              defaultValue={generalParamMap['TRACKERTEMPDEVIATIONINTERVAL']?.paramValue}
              min={0}
              max={999}
              ref={register({
                min: 0,
                max: 999,
                pattern: REGEXPS.wholeNumber,
                required: temperatureDeviationChecked
              })}
              disabled={readOnly}
              required={temperatureDeviationChecked}
              error={errors?.generalParamMap?.['TRACKERTEMPDEVIATIONINTERVAL']}
              errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels?.['TRACKERTEMPDEVIATIONINTERVAL']}`}
            />
          </Grid>
          <Grid item key={'TRACKERTEMPDEVIATIONPERCENTAGE'} xs={12} sm={4} md={4} style={{ padding: '0px 5px 0px 5px' }} className='grid-item'>
            <TextInput
              id={`generalParamMap.TRACKERTEMPDEVIATIONPERCENTAGE`}
              name={`generalParamMap.TRACKERTEMPDEVIATIONPERCENTAGE`}
              label={dynamicLabels.TRACKERTEMPDEVIATIONPERCENTAGE}
              placeholder={dynamicLabels.TRACKERTEMPDEVIATIONPERCENTAGE}
              type='number'
              fullWidth
              defaultValue={generalParamMap['TRACKERTEMPDEVIATIONPERCENTAGE']?.paramValue}
              min={0}
              max={99}
              ref={register({
                min: 0,
                max: 99,
                pattern: REGEXPS.wholeNumber,
                required: temperatureDeviationChecked
              })}
              disabled={readOnly}
              required={temperatureDeviationChecked}
              error={errors?.generalParamMap?.['TRACKERTEMPDEVIATIONPERCENTAGE']}
              errorMessage={`${dynamicLabels.pleaseEnterValid} ${dynamicLabels?.['TRACKERTEMPDEVIATIONPERCENTAGE']}`}
            />
          </Grid>
        </>}
    </Grid>}
    {(generalParamMap.ISVISIBLETOCUSTOMER) && <Accordion id='customizeAlertPreferences' expanded={false} hideChevron>
      {{
        header: <Box display='flex'>
          <Box flexGrow={1}>
            <AccordionHeaderTitle>{dynamicLabels.customizeAlertPreferences}</AccordionHeaderTitle>
            <AccordionHeaderSubTitle>{dynamicLabels.customizeAlertPreferencesDesc}</AccordionHeaderSubTitle>
          </Box>
          <Box>
            <Toggle defaultChecked={generalParamMap.ISVISIBLETOCUSTOMER?.paramValue === 'Y'}
              name='generalParamMap.ISVISIBLETOCUSTOMER'
              ref={register()}
              disabled={readOnly}
            />
          </Box>
        </Box>,
        content: <div />
      }}
    </Accordion>}
  </Box>
}

export default GeneralConfiguration