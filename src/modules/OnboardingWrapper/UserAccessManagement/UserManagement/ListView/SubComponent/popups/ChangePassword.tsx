import React, { useState } from "react";
import {
  Box,
  PasswordInput,
  Modal,
  ModalHeader,
  IconButton,
  ISelectedRows,
  useToast,
} from "ui-library";
import apiMappings from "../../../../../../../utils/apiMapping";
import axios from "../../../../../../../utils/axios";
import { formatStringTillLength } from "../../../../../../../utils/helper";
import withRedux from "../../../../../../../utils/redux/withRedux";
import DYNAMIC_LABELS_MAPPING from "../../../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../../../common/DynamicLabels/useDynamicLabels";
import { StyledChangePassword, StyledError } from "../StyledSubComponent";

interface IChangePassword {
  showChangePassword: boolean;
  setShowChangePassword: (value: boolean) => void;
  selectedRows: ISelectedRows;
}
interface IpasswordField {
  text: string;
  error: string;
}
const ChangePassword = ({
  showChangePassword,
  setShowChangePassword,
  selectedRows,
}: IChangePassword) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.users);

  const [currentPassword, setCurrentPassword] = useState<IpasswordField>({
    text: "",
    error: "",
  });
  const [newPassword, setNewPassword] = useState<IpasswordField>({
    text: "",
    error: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<IpasswordField>({
    text: "",
    error: "",
  });
  const pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");
  const toast = useToast();

  const handleSave = async () => {
    setShowChangePassword(false);
    const payload = Object.values(selectedRows)?.map((row: any) => {
      return {
        mode: "WEB",
        newPassword: newPassword.text,
        oldPassword: currentPassword.text,
        userId: row?.userId,
        userName: row?.userName,
      };
    });
    if (
      newPassword.text &&
      confirmPassword.text &&
      !(!!newPassword.error && !!confirmPassword.error)
    ) {
      try {
        const {
          data: { status, message },
        } = await axios.post(
          apiMappings.userManagement.listView.changePassword,
          payload
        );
        if (status === 200) {
          toast.add(message, "check-round", false);
          return;
        }
        if (status === 400) {
          toast.add(message, "warning", false);
          return;
        }
        // throw message;
      } catch (errorMessage) {
        toast.add(
          typeof errorMessage === "string"
            ? errorMessage
            : dynamicLabels?.somethingWendWrong,
          "",
          false
        );
      }
    }
  };

  const handleCurrentPassword = (value: string) => {
    let error = "";
    if (value.length === 0) {
      // error = LabelMapping.currentPasswordShouldNotBeEmpty;
      error = dynamicLabels.currentPasswordReqd;
    }
    // setCurrentPassword({ ...currentPassword, text: formattedValue, error });
    setCurrentPassword({ ...currentPassword, text: value, error });
  };

  const handleNewPassword = (value: string) => {
    const formattedValue = formatStringTillLength(14, value);
    let error = "";
    if (!pattern.test(value)) {
      error = dynamicLabels.passwordMatchCriteria;
      // confirmpassword should not be " "
    } else if (
      confirmPassword.text &&
      formattedValue !== confirmPassword.text
    ) {
      setConfirmPassword({
        ...confirmPassword,
        error: dynamicLabels.passwordDoNotMatch,
      });
    }
    setNewPassword({ ...newPassword, text: formattedValue, error });
  };
  const handleConfirmPassword = (value: string) => {
    const formattedValue = formatStringTillLength(14, value);
    let error = "";
    if (formattedValue !== newPassword.text) {
      error = dynamicLabels.passwordDoNotMatch;
    }
    setConfirmPassword({ ...confirmPassword, text: formattedValue, error });
  };
  return (
    <Modal
      open={showChangePassword}
      onToggle={(value) => {
        setNewPassword({ text: "", error: "" });
        setConfirmPassword({ text: "", error: "" });
        setShowChangePassword(value);
      }}
      width="600px"
      children={{
        header: (
          <ModalHeader
            headerTitle={dynamicLabels?.changePassword || "Change Password"}
            handleClose={() => setShowChangePassword(false)}
            imageVariant="icomoon-close"
            headerStyle={{ fontSize: "15px" }}
          />
        ),
        content: (
          <StyledChangePassword>
            <Box horizontalSpacing="5px" style={{ width: "100%" }}>
              <div style={{ marginBottom: "15px" }}>
                <PasswordInput
                  id="current-password"
                  name="current-password"
                  label={dynamicLabels?.currentPassword || "Current Password"}
                  labelColor="text.inputLabel.default"
                  placeholder={
                    dynamicLabels?.currentPassword || "Current Password"
                  }
                  fullWidth
                  value={currentPassword.text}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleCurrentPassword(e.target.value)
                  }
                  errorMessage={currentPassword.error}
                  error={!!currentPassword.error}
                />
                <StyledError>{currentPassword.error}</StyledError>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <PasswordInput
                  id="new-password"
                  name="new-password"
                  label={dynamicLabels?.newPassword || "New Password"}
                  labelColor="text.inputLabel.default"
                  placeholder={dynamicLabels?.newPassword || "New Password"}
                  fullWidth
                  value={newPassword.text}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleNewPassword(e.target.value)
                  }
                  errorMessage={newPassword.error}
                  error={!!newPassword.error}
                />
                <StyledError>{newPassword.error}</StyledError>
              </div>
              <PasswordInput
                id="confirm-password"
                name="confirm-password"
                label={dynamicLabels?.confirmPassword || "Confirm Password"}
                labelColor="text.inputLabel.default"
                placeholder={
                  dynamicLabels?.confirmPassword || "Confirm Password"
                }
                value={confirmPassword.text}
                errorMessage={confirmPassword.error}
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleConfirmPassword(e.target.value)
                }
                error={!!confirmPassword.error}
              />
              <StyledError> {confirmPassword.error}</StyledError>
            </Box>
          </StyledChangePassword>
        ),
        footer: (
          <Box
            horizontalSpacing="10px"
            display="flex"
            justifyContent="flex-end"
            p="10px"
          >
            <IconButton
              id='User-ChangePassword-Modal-save'
              disabled={
                !!(
                  confirmPassword.error ||
                  newPassword.error ||
                  !newPassword.text ||
                  !confirmPassword.text
                )
              }
              iconVariant="icomoon-save"
              primary
              onClick={handleSave}
            >
              {dynamicLabels?.Save || "Save"}
            </IconButton>
            <IconButton
              id='User-ChangePassword-Modal-cancel'
              iconVariant="icomoon-close"
              iconSize={11}
              onClick={() => {
                setNewPassword({ text: "", error: "" });
                setConfirmPassword({ text: "", error: "" });
                setShowChangePassword(false);
              }}
            >
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
        ),
      }}
    />
  );
};

export default withRedux(ChangePassword);
