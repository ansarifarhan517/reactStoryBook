import React from 'react'
import { useTypedSelector } from "../../../utils/redux/rootReducer"
import { useDispatch } from "react-redux"
import { Dispatch } from "react"
import { tGlobalPopupAction } from "./GlobalPopup.reducer"
import { Modal, ModalHeader, Box } from 'ui-library'

export const useGlobalPopup = () => {
  const popupProps = useTypedSelector(state => state.globalPopupProps)
  const popupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

  return popupProps && <Modal open={!!popupProps?.isOpen} onToggle={() => { }} width={popupProps?.width} size={popupProps?.size}>
    {{
      header: (
        <ModalHeader headerTitle={popupProps?.title || ''} handleClose={() => {
          popupProps?.onClose && popupProps.onClose()
          popupDispatch({
            type: '@@globalPopup/SET_PROPS',
            payload: {
              ...popupProps,
              isOpen: false,

            }
          })
        }}
          width='100%'
        />),
      content: (
        <div style={{ fontSize: '14px' }}>
          {popupProps?.content}
        </div>),
      footer: (
        <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
          {popupProps?.footer}
        </Box>)
    }

    }
  </Modal>

}