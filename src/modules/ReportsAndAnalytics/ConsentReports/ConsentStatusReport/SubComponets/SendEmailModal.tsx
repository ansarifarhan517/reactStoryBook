import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  IconButton,
  Loader,
  TextInput,
} from "ui-library";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";

const SendEmailModal = ({ isModalOpen, setShowSendEmail  ,formInstance ,handlerSubmitEmail}) => {
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.drsTemplateConfiguration
  );
  const userEmail =JSON.parse(localStorage.getItem("userAccessInfo") || "{}").userName;

  const [emailText, setEmailtext] = useState(userEmail);
  const [emailTextError, setEmailTextError] = useState<boolean>(false);

    const handleSubmitEmail =(data)=>{
      handlerSubmitEmail(data,emailText)
    }

    const {handleSubmit}=formInstance

  return (
    <Modal open={isModalOpen} width="600px" onToggle={() => {}}>
      {{
        header: (
          <ModalHeader
            headerTitle={"Consent Status Report"}
            handleClose={() => {
              setShowSendEmail(false);
            }}
          />
        ),
        content: (
          <div>
            {!isModalOpen ? (
              <Loader center fadeBackground />
            ) : (
              <TextInput
                id="email-text"
                name="emailText"
                className="emailText"
                value={emailText}
                maxLength={255}
                onChange={(e: { target: { value: any } }) => {
                  setEmailtext(e.target.value);
                  setEmailTextError(e.target.value === "");
                }}
                label={"Email"}
                labelColor={"text.inputLabel.default"}
                placeholder={"Enter email here..."}
                error={emailTextError}
                errorMessage={`${dynamicLabels?.templateName}${dynamicLabels.isRequired}`}
                required={true}
                fullWidth={true}
                defaultValue={userEmail}
              />
            )}
          </div>
        ),
        footer: (
          <ModalFooter>
            <IconButton
              id="printDRS-Modal-OK"
              iconVariant="icomoon-tick-circled"
              primary
              disabled={!emailText}
              onClick={handleSubmit((data)=>{
                handleSubmitEmail(data)
              })
              }
            >
              {"Submit"}
            </IconButton>

            <IconButton
              id="printDRS-Modal-cancel"
              iconVariant="icomoon-close"
              onClick={() => {
                setShowSendEmail(false);
              }}
              iconSize={11}
            >
              {dynamicLabels.cancel}
            </IconButton>
          </ModalFooter>
        ),
      }}
    </Modal>
  );
};

export default SendEmailModal;
