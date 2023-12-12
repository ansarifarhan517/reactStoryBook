import React, { useState } from 'react'
// import Style
import styled, { keyframes } from 'styled-components'
// import { tVariant } from '../../atoms/Button'
import CheckboxGroup, { IOptionType } from '../../atoms/CheckboxGroup'
import IconButton from '../../atoms/IconButton'
// import Position from '../../molecules/Position'
import Modal from '../Modal/ModalWrapper'
// import Helper Components
import Header from '../ModalHeader'
import Tooltip from '../Tooltip'
import Box from '../../atoms/Box'
// import Checkbox from '../../atoms/Checkbox'

export interface ShowHideColumnPopupProps {
  checkBoxGroupArray: IOptionType[]
  selectedCount?: number
  onCheckBoxChange?: (
    id: string,
    checked: boolean
    // checkBoxArray?: IOptionType[]
  ) => void
  onApply?: (closeModal: () => void, withSave?: boolean) => void
  onClickCancel?: () => void
  onSelectAll?: (checked?: boolean) => void
  onOpen?: () => void
}

/**********************************/
/*          MODAL STYLES          */
/**********************************/
const FadeIn = keyframes`
0% {
  opacity:0;
}
100% {
  opacity:1;
}
`

const ModalWrapper = styled.div`
  min-width: 350px;
  max-width: 600px;
  margin-left: auto;
  box-shadow: ${({ theme }) => `${theme?.shadows?.default}`};
  label {
    display: inline-block;
  }
  animation: 500ms ${FadeIn};
  position: absolute;
  right: 5px;
  z-index: ${({ theme }) => theme?.zIndex?.modal};

  & > div {
    position: relative;
    top: auto;
  }
`
const ModalHeaderStyled = styled.div`
  h4 {
    font-weight: ${({ theme }) => `${theme?.typography?.fontWeightRegular}`};
    justify-content: center;
    & ~ span {
      display: none;
    }
  }
`
const ModalBodyStyled = styled.div`
  /* column-count: 2;
  font-size: 13px;
  color: ${({ theme }) => theme?.colors?.grey?.['800']}; */
  max-height: 195px;
  overflow-y: scroll;
  width: calc(100% + 15px);
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 15px;
`
const IconButtonStyled = styled(IconButton)`
  /*  
    margin: 0px 5px;
    line-height: 40px;
    max-height: 40px;
    padding: 10px 15px;
  */

  span {
    text-transform: Capitalize;
    letter-spacing: 0.6px;
    font-size: 13px;
  }

  /*
    i {
      margin-right: 5px;
      font-size: 19px;
    }
  */
`
const ShowHideWrapper = styled.div`
  position: relative;
`
/**********************************/
/*          MODAL COMPONENTS       */
/**********************************/

const ModalHeader = () => (
  <ModalHeaderStyled>
    <Header headerTitle='Column Settings' width='100%' />
  </ModalHeaderStyled>
)

const ModalBody = ({
  checkBoxGroupArray = [],
  onCheckBoxChange = () => {}
}: ShowHideColumnPopupProps) => {
  const [checkOptions, setCheckOptions] = useState<IOptionType[]>(
    checkBoxGroupArray
  )

  React.useEffect(() => {
    if (checkBoxGroupArray) {
      setCheckOptions(checkBoxGroupArray)
    }
  }, [checkBoxGroupArray])

  const handleCheckBoxChange = React.useCallback(
    (id, checked) => {
      // const checkedCount =
      //   checkOptions.filter((option: IOptionType) => option.checked).length +
      //   (checked ? 1 : -1)

      // let newCheckboxState = checkOptions.map((option: IOptionType) =>
      //   option.id === id ? { ...option, checked } : option
      // )
      // console.log(checkedCount)
      // if (checkedCount <= 3) {
      //   newCheckboxState = newCheckboxState.map((option: IOptionType) =>
      //     option.checked ? { ...option, disabled: true } : option
      //   )
      // } else {
      //   newCheckboxState = newCheckboxState.map((option: IOptionType) => ({
      //     ...option,
      //     disabled: false
      //   }))
      // }

      // console.log(newCheckboxState)
      onCheckBoxChange(id, checked)
    },
    [onCheckBoxChange, checkOptions]
  )

  return (
    <ModalBodyStyled>
      <CheckboxGroup
        orientation
        spacing={10}
        onChange={handleCheckBoxChange}
        checkOptions={checkOptions}
        checkboxSize='md'
        style={{
          columnCount: 2,
          columnGap: '5px',
          maxHeight: '1000px'
        }}
      />
    </ModalBodyStyled>
  )
}

export const ButtonList = ({ listOfButtons }: any) => {
  return (
    <ButtonWrapper>
      {listOfButtons.map((button: any, index: number) => {
        return <IconButtonStyled key={index} {...button} iconSize={19} />
      })}
    </ButtonWrapper>
  )
}

/**********************************/
/*     SHOW HIDE COLUMN MODAL     */
/**********************************/

const defaultCallback = () => {}
const ShowHideColumnPopup = ({
  checkBoxGroupArray = [],
  onCheckBoxChange = defaultCallback,
  onApply = defaultCallback,
  onOpen = defaultCallback,
  onClickCancel = defaultCallback,
  // onSelectAll = defaultCallback,
  selectedCount = 0
}: ShowHideColumnPopupProps) => {
  const node = React.useRef(null)
  const triggerElementRef = React.useRef<HTMLDivElement>(null)
  const refWidth =
    triggerElementRef.current?.getBoundingClientRect()?.left || 600
  const modalWidth = refWidth > 600 ? 600 : refWidth

  const [showModal, setShowModal] = useState<boolean>(false)

  const handleOutsideClick = (e: any) => {
    const n = (node.current as unknown) as Node
    if (n.contains(e.target)) return
    setShowModal(false)
  }
  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  // const [selectAllChecked, setSelectAllChecked] = useState<boolean>(
  //   selectedCount === checkBoxGroupArray.length
  // )

  // React.useEffect(() => {
  //   setSelectAllChecked(selectedCount === checkBoxGroupArray.length)
  // }, [selectedCount, checkBoxGroupArray])

  const handleShowModal = () => {
    setShowModal(!showModal)
    onOpen()
  }

  // const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const isSelectAll = e?.target?.checked
  //   setSelectAllChecked(isSelectAll)
  //   onSelectAll(isSelectAll)
  // }

  return (
    <ShowHideWrapper ref={node}>
      <Tooltip
        hide={showModal}
        messagePlacement='end'
        tooltipDirection='bottom'
        hover
        message='Customize your view by adding/removing columns. For the best view, a display of 8 columns is recommended.'
      >
        <div ref={triggerElementRef}>
          <IconButton
            onClick={handleShowModal}
            onlyIcon
            circle
            iconVariant='icomoon-options-vertical'
            iconSize={15}
            color='grey.A1000'
          />
        </div>
      </Tooltip>
      {showModal ? (
        <ModalWrapper style={{ width: `${modalWidth}px` }}>
          <Modal
            width={`${modalWidth}px`}
            header={<ModalHeader />}
            content={
              <Box color='black' mb='-15px' mt='-5px'>
                <ModalBody
                  checkBoxGroupArray={checkBoxGroupArray}
                  onCheckBoxChange={onCheckBoxChange}
                />
              </Box>
            }
            footer={
              <Box
                display='flex'
                color='black'
                style={{ boxShadow: '0 -1px 9px 0 #00000021' }}
              >
                <Box
                  display='flex'
                  justifyContent='flex-end'
                  fullWidth
                  horizontalSpacing='10px'
                  p='15px'
                  // pt='0px'
                >
                  <Box color='grey.150' flexGrow={1}>
                    {selectedCount} column(s) selected
                  </Box>
                  <IconButtonStyled
                    iconVariant='icomoon-save'
                    primary
                    onClick={() => {
                      onApply(() => {
                        setShowModal(false)
                      }, true)
                    }}
                  >
                    Save & Apply
                  </IconButtonStyled>
                  <IconButtonStyled
                    iconVariant='icomoon-tick-circled'
                    primary
                    onClick={() => {
                      onApply(() => {
                        setShowModal(false)
                      })
                    }}
                  >
                    Apply
                  </IconButtonStyled>
                  <IconButtonStyled
                    iconVariant='icomoon-close'
                    // iconSize={19}
                    onClick={() => {
                      onClickCancel()
                      setShowModal(false)
                    }}
                  >
                    Cancel
                  </IconButtonStyled>
                </Box>
              </Box>
            }
          />
        </ModalWrapper>
      ) : null}
    </ShowHideWrapper>
  )
}

export default ShowHideColumnPopup
