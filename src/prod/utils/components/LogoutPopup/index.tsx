/*
  File Purpose: This will log the user out.
  Idea: We are clearing the local storage and session storage and then making the page reload. 
  As no token and data will be available in local storage the user will be logged out.
*/

import React, { ReactChild, useState } from "react";
import { IconButton, Modal, ModalHeader, Box } from "ui-library";

interface ILogoutProps {
  title: string;
  children: ReactChild;
}

const LogoutPopup = (props: ILogoutProps) => {

  // Destructuring props
  const {title, children} = props;

  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    setOpen(false);
    localStorage.clear();
    sessionStorage.clear();

    // Reload the page to logout as token is null now.
    window.location.reload();
  };

  return (
    <Modal open={open} onToggle={() => {}} size="md">
      {{
        header: (
          <ModalHeader
            headerTitle={title}
            showIcon={false}
          />
        ),

        content: <div>{children}</div>,
        footer: (
          <Box
            horizontalSpacing="10px"
            display="flex"
            justifyContent="flex-end"
            p="15px"
          >
            <IconButton
              iconVariant="icomoon-power-switch"
              primary
              onClick={handleLogout}
            >
              Logout
            </IconButton>
          </Box>
        ),
      }}
    </Modal>
  );
};

export default LogoutPopup;
