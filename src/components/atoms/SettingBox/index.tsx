import React, { useState } from 'react'
import Header from './Header'
import { ISetting, ISettingOption } from './interface'
import SettingBody from './SettingBody'
import { StyledButton, StyledIcon, StyledSettingBox } from './StyledSettingBox'
import SettingWrapper from './UniversalBodyWrapper'
import Tooltip from '../../molecules/Tooltip'
import IconButton from '../../atoms/IconButton'
import Box from '../../atoms/Box'
import { deepCopy, getNewSetting } from '../Map/helperMethods'

const SettingBox = ({
  onChange,
  width = '350px',
  settingOption,
  isOpenStreet,
  showModal = true,
  handleShowModal,
  setMarkers,
  heatMap,
  settingButtonTitle,
  onSettingChange,
  legend,
  geocoding,
  setFocusSearchPlace
}: ISetting) => {
  const keys = Object.keys(settingOption)

  // to create a new reference completely below approach.- deep clone
  const [_settingOption, setSettingOption] = useState<Array<ISettingOption>>(
    Object.values(getNewSetting(settingOption))
  )
  React.useEffect(() => {
    setSettingOption(Object.values(getNewSetting(settingOption)))
  }, [settingOption])

  React.useEffect(() => {
    // whenever close modal just revert the changes
    if (!showModal) {
      onCancel()
    }
  }, [showModal])

  const handleChange = (newSetting: Array<ISettingOption>) => {
    // set setting in array format
    setSettingOption(newSetting)
  }

  const onSaveAndApply = () => {
    // create a object like setting again
    const settings: any = {}
    keys.forEach((key: string, index: number) => {
      settings[key] = _settingOption[index]
    })
    // if search text in search box then set focus search place true
    geocoding?.searchText && setFocusSearchPlace(true)
    // whatever checkbox for legends getting changed, set it to outer marker layer legendmodel,
    setMarkers(settings?.Legends?.option)

    // send settings to map, to set all the settings accordingly
    onChange(settings)
    // send setting out of map component to save it
    onSettingChange && onSettingChange(settings, 'save')
  }
  const onApply = () => {
    // create a object like setting again
    const settings: any = {}
    keys.forEach((key: string, index: number) => {
      settings[key] = _settingOption[index]
    })
    // if search text in search box then set focus search place true
    geocoding?.searchText && setFocusSearchPlace(true)
    // whatever checkbox for legends getting changed, set it to outer marker layer legendmodel,
    setMarkers(settings?.Legends?.option)

    // send settings to map, to set all the settings accordingly
    onChange(settings)
    // send setting out of map component to keep  it temporarily
    onSettingChange && onSettingChange(settings, 'apply')
  }
  const onCancel = () => {
    const instance = deepCopy(Object.values(settingOption))
    // it will help to keep out legends in sync with outer marker legend model
    // we have to some how revert it to original model- pending

    // if search text in search box then set focus search place true
    geocoding?.searchText && setFocusSearchPlace(true)
    setMarkers(legend)

    setSettingOption(instance)
    handleShowModal(false)
  }
  return (
    <div>
      {!showModal ? (
        <StyledIcon>
          <Tooltip
            messagePlacement='end'
            arrowPlacement='center'
            tooltipDirection='bottom'
            hide={showModal}
            hover
            message={
              settingButtonTitle ||
              'Click here to configure the settings of the map to get a customized map view.'
            }
          >
            <StyledButton
              onClick={() => {
                handleShowModal(true)
              }}
            >
              <img
                // title={
                //   settingButtonTitle ||
                //   'configure the way you visualize data, how map the looks and unlock exciting tools!'
                // }
                style={{ marginTop: '7px', marginLeft: '8px' }}
                src='https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/mapAssist.png'
              />
            </StyledButton>
          </Tooltip>
        </StyledIcon>
      ) : null}
      {showModal ? (
        <StyledSettingBox width={width} id='setting-box'>
          <SettingWrapper
            header={
              <Header
                headerTitle='Map Settings'
                handleClose={() => {
                  onCancel()
                }}
                imageVariant='close'
                width={width}
              />
            }
            footer={
              <Box
                display='flex'
                color='black'
                style={{
                  boxShadow: '0 2px 11px -5px #000',
                  backgroundColor: '#fff'
                }}
              >
                <Box
                  display='flex'
                  justifyContent='flex-end'
                  fullWidth
                  horizontalSpacing='10px'
                  p='15px'
                  style={{
                    boxShadow: '0 2px 11px -5px #000',
                    zIndex: 2000
                  }}
                  // pt='0px'
                >
                  <IconButton
                    id='MapSetting--save_apply'
                    iconVariant='icomoon-save'
                    primary
                    className='footer'
                    onClick={() => {
                      handleShowModal(false)
                      onSaveAndApply()
                    }}
                    children='Save & Apply'
                  />
                  <IconButton
                    id='MapSetting--apply'
                    iconVariant='icomoon-tick-circled'
                    primary
                    className='footer'
                    onClick={() => {
                      handleShowModal(false)
                      onApply()
                    }}
                    children='Apply'
                  />
                  <IconButton
                    id='MapSetting--cancel'
                    className='footer'
                    iconVariant='icomoon-close'
                    children='Cancel'
                    // iconSize={19}
                    onClick={() => {
                      onCancel()
                    }}
                  />
                </Box>
              </Box>
            }
            content={
              <SettingBody
                settings={_settingOption}
                onChange={(newSetting: Array<ISettingOption>) =>
                  handleChange(newSetting)
                }
                isOpenStreet={!!isOpenStreet}
                heatMap={heatMap}
              />
            }
          />
        </StyledSettingBox>
      ) : null}
    </div>
  )
}
export default SettingBox
