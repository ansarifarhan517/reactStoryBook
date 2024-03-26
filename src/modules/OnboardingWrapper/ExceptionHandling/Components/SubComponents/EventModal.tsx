import React, { Dispatch, SetStateAction } from "react";
import { Modal, ModalHeader, IconButton, Radio } from 'ui-library';
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { IExceptionEvents } from "../../ExceptionHandling.models";
import { EventContainer, EventListContainer, EventModalButtonContainer, RadioDesc } from "../../ExceptionHandlingStyledComponents";

interface IModalProps {
    isModalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    modalWidth: string;
    eventCode: string;
    setEventCode: Dispatch<SetStateAction<string>>;
    handleEventModal: Function
}

const EventModal = (props: IModalProps) => {
    const { isModalOpen, setModalOpen, modalWidth, eventCode, setEventCode, handleEventModal } = props;
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.exceptionHandling);
    const events = useTypedSelector((state) => state.exceptionHandling.form.events);

    return (
        <Modal open={isModalOpen} onToggle={() => { }} width={modalWidth}>
            {{
                header: (
                    <ModalHeader headerTitle={dynamicLabels?.selectEvent} imageVariant='icomoon-close' width={modalWidth} handleClose={() => { setModalOpen(false) }} />
                ),
                content: (
                    <EventListContainer>
                        {events.length > 0 && events.map((event: IExceptionEvents) => {
                            return (
                                <EventContainer key={event.exceptionCode}>
                                    <Radio className="event-radio" checked={event.exceptionCode === eventCode} radioSize="md" label={event.exceptionName} onChange={() => setEventCode(event.exceptionCode)} />
                                    <RadioDesc>{event.exceptionDescription}</RadioDesc>
                                </EventContainer>
                            )
                        })}
                    </EventListContainer>
                ),
                footer: (
                    <EventModalButtonContainer>
                        <IconButton primary id="exception-eventModal-button-Saveclient" iconVariant="icomoon-save" onClick={() => handleEventModal()}>{dynamicLabels.save}</IconButton>
                        <IconButton id="exception-eventModal-button-cancelclient" iconVariant="cancel-button" onClick={() => setModalOpen(false)}>{dynamicLabels.cancel}</IconButton>
                    </EventModalButtonContainer>
                )
            }}
        </Modal>
    )
}

export default EventModal;