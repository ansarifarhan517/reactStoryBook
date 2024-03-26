import React, { useState } from "react";
import {
  Box,
  Modal,
  ModalHeader,
  IconButton,
  // Checkbox
} from "ui-library";
import InactiveDatePicker from "./InactiveDatePicker";

interface IInactiveModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (booleanValue) => void;
  dynamicLabels: any;
  clickedRow: any;
  bonusStartDate: Date;
  dateFormat: string;
  APICall: (
    date,
    // checkboxValue,
    bonusId
  ) => Promise<void>;
}
const InactiveModal = ({
  isModalOpen,
  setIsModalOpen,
  dynamicLabels,
  clickedRow,
  bonusStartDate,
  APICall,
  dateFormat,
}: IInactiveModalProps) => {
  // const [isChecked, setIsChecked] = useState<boolean>(false);
  const [date, setDate] = useState("");

  const sendAPICall = async () => {
    await APICall(
      date,
      // isChecked,
      clickedRow
    );
    setIsModalOpen(false);
    setDate("");
  };

  const removeInput = () => {
    setDate("");
    setIsModalOpen(false);
  };

  return (
    <Modal open={isModalOpen} onToggle={() => setIsModalOpen(false)}>
      {{
        header: (
          <ModalHeader
            headerTitle={dynamicLabels?.markAsInactive || "Mark as Inactive"}
            imageVariant="icomoon-close"
            handleClose={() => {
              setIsModalOpen(false);
            }}
          />
        ),
        content: (
          <>
            <Box pb="10px">
              {dynamicLabels?.markBonusInactiveDesc ||
                "Are you sure you want to mark as Inactive? Once Inactive, Bonuses will be delinked from all Delivery Associates and no further Bonuses will be calculated."}
            </Box>
            <InactiveDatePicker
              date={date}
              setDate={setDate}
              DATEFORMAT={dateFormat}
              dynamicLabels={dynamicLabels}
              bonusStartDate={bonusStartDate}
            />
            {/* <Checkbox
              id={clickedRow}
              label={dynamicLabels?.notifyDAs || "Notify Delivery Associates"}
              checked={isChecked}
              checkboxSize="md"
              onChange={(prevState) => setIsChecked(!prevState)}
            /> */}
          </>
        ),
        footer: (
          <Box
            horizontalSpacing="10px"
            display="flex"
            justifyContent="flex-end"
            p="15px"
          >
            <IconButton
              id='BonusesInactive-Modal-button-OK'
              iconVariant="icomoon-tick-circled"
              primary
              iconSize={11}
              onClick={sendAPICall}
            >
              {dynamicLabels?.ok || "Ok"}
            </IconButton>
            <IconButton
            id='BonusesInactive-Modal-button-close'
              iconVariant="icomoon-close"
              iconSize={11}
              onClick={removeInput}
            >
              {dynamicLabels?.cancel || "Cancel"}
            </IconButton>
          </Box>
        ),
      }}
    </Modal>
  );
};

export default InactiveModal;
