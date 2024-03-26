import React from "react";
//import { useDispatch } from "react-redux";
import {
    Box,
    IconButton,
    Modal,
    ModalHeader
} from "ui-library";
//import { IUatFormActions } from "../../../Saas/UatForm/UatForm.model";

const UatAccountCountPopup = (props:any) => {
    const {uatAccountCountPopup, setUatAccountCountPopup, submit} = props

    //const dispatch = useDispatch<Dispatch<IUatFormActions>>()
    const handleClose = () => {
        setUatAccountCountPopup(false)
        //dispatch({type: '@@uatForm/RESET_INITIAL_STATE'})
    }

    return(
        <Modal
            open={uatAccountCountPopup}
            onToggle={() => handleClose()}
            width='600px'
            children={{
                header: (
                    <ModalHeader
                        headerTitle='Add UAT Confirmation'
                        handleClose={() => {
                            handleClose()
                        }}
                        imageVariant='icomoon-close'
                        headerStyle={{ fontSize: '15px' }}
                    />
                ),
                content: (
                    <div style={{ fontSize: '14px' }}>
                        <Box horizontalSpacing='5px'>
                            <span style={{ lineHeight: '30px' }}>UAT account exists, do you want to create one more account?</span>
                        </Box>
                    </div>
                ),
                footer: (
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                        <IconButton
                            iconVariant='icomoon-tick-circled'
                            primary
                            onClick={() => {
                                handleClose()
                                submit()
                            }}
                        >
                        Confirm</IconButton>
                        <IconButton
                            iconVariant='icomoon-close'
                            iconSize={11}
                            onClick={() => {
                                handleClose()
                            }
                            }
                        >Cancel</IconButton>
                    </Box>
                )
            }}
        />
    )
}

export default UatAccountCountPopup;