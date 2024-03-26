import React, { MouseEventHandler } from 'react';
import { Modal, ModalHeader, IconButton } from 'ui-library';
import styled from 'styled-components';
import WaveLoader from './WaveLoader';

export const ModalContainer = styled.div`
  div[class*="baseStyles__BaseModalBackground-"] {
    padding-top: 125px;
  }
`;
interface ICTAModal {
    open: boolean;
    onToggle?: Function;
    width: string;
    headerTitle: string;
    contentMessage: string;
    onClickOk: MouseEventHandler<HTMLButtonElement>;
    onClickCancel: any;
    isOkButtonLoading?: boolean;
}

const CTAModalComponent = ({
    open,
    width,
    headerTitle,
    contentMessage,
    onClickOk,
    onClickCancel,
    isOkButtonLoading
}: ICTAModal) => {
    return (
        <ModalContainer>
            <Modal
                open={open}
                onToggle={() => {}}
                children={{
                    header: (
                        <ModalHeader
                            headerTitle={headerTitle}
                            handleClose={onClickCancel}
                            imageVariant='close'
                            width="555px"
                        />
                    ),
                    content: (
                        <div style={{ fontSize: '14px', color: '#4c4c4c' }}>
                            <div>{contentMessage}</div>
                        </div>
                    ),
                    footer: (
                        <div className="cta-button-container">
                            <IconButton
                                id='importSetting-CTAModal-button-OK'
                                onClick={onClickOk}
                                primary={true}
                                disabled={false}
                                iconVariant='icomoon-tick-circled'
                                children={isOkButtonLoading ? <WaveLoader /> : 'OK'}
                                style={{ marginRight: "10px" }}
                            />
                            <IconButton
                                onClick={onClickCancel}
                                id='importSetting-CTAModal-button-cancel'
                                primary={false}
                                disabled={false}
                                iconVariant='icomoon-close'
                                children='Cancel'
                            />
                        </div>
                    )
                }}
                width={width}
            />
        </ModalContainer>
    )
}

export default CTAModalComponent;