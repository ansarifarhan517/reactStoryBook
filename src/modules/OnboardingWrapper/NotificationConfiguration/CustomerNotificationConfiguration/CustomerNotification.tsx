import React from "react";
import {
  Box,
  Card,
  Accordion,
  AccordionHeaderTitle,
  AccordionHeaderSubTitle,
  AccordionContent,
} from "ui-library";
import "../CustomerNotificationConfiguration/CustomerNotificationStyles.scss";
import { fullHeightStyle } from "../../AlertProfilesMaster/utils/constants";
import NotificationComponent from "../SubComponent/NotificationComponent";
import MessageTemplateSettingPage from "../SubComponent/MessageTemplateSettingPage";
import { tCustomerNotificationProps } from "../SubComponent/Notification.model";

const CustomerNotification = ({
  currentStep,
  dynamicLabels,
  isLoading,
  structureColumns,
  columnsData,
  showAccordion,
  expanded,
  showDeleteModal,
  setShowDeleteModal,
  messageTemplateSetting,
  setMessageTemplateSetting,
  stateUpdated,
  setUpdateState,
  updatedObj,
  setUpdatedObj,
  toast,
  handleToggle,
  setColumnsData,
  getColumnsData,
  currentNotification,
  ivrAccess,
}: tCustomerNotificationProps) => {
  return (
    <>
      {!isLoading && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="stretch"
          style={fullHeightStyle}
        >
          {!messageTemplateSetting ? (
            <>
              <div className="customer-notification__box__page-header">
                {currentStep?.headerLabel}
              </div>
              <Box flexGrow={1}>
                <Card className="customer-notification__box__content">
                  {currentStep?.questions?.map((question, index) => (
                    <Accordion
                      key={String(Number(index + 1))}
                      id={String(Number(index + 1))}
                      onToggle={handleToggle}
                      expanded={
                        showAccordion
                          ? true
                          : expanded === String(Number(index + 1))
                      }
                    >
                      {{
                        header: (
                          <>
                            <AccordionHeaderTitle>
                              {question.questionLabel}
                            </AccordionHeaderTitle>
                            <AccordionHeaderSubTitle>
                              {question.questionDescLabel}
                            </AccordionHeaderSubTitle>
                          </>
                        ),
                        content: (
                          <AccordionContent style={{ padding: "0" }}>
                            <NotificationComponent
                              structureColumns={structureColumns}
                              columnsData={columnsData}
                              setShowDeleteModal={setShowDeleteModal}
                              showDeleteModal={showDeleteModal}
                              setColumnsData={setColumnsData}
                              toast={toast}
                              setMessageTemplateSetting={
                                setMessageTemplateSetting
                              }
                              setUpdatedObj={setUpdatedObj}
                              dynamicLabels={dynamicLabels}
                              currentNotification={currentNotification}
                              ivrAccess={ivrAccess}
                            />
                          </AccordionContent>
                        ),
                      }}
                    </Accordion>
                  ))}
                </Card>
              </Box>
            </>
          ) : (
            <MessageTemplateSettingPage
              stateUpdated={stateUpdated}
              setUpdateState={setUpdateState}
              updatedObj={updatedObj}
              setUpdatedObj={setUpdatedObj}
              setMessageTemplateSetting={setMessageTemplateSetting}
              toast={toast}
              getColumnsData={getColumnsData}
              dynamicLabels={dynamicLabels}
              currentNotification={currentNotification}
              ivrAccess={ivrAccess}
              currentStep={currentStep}
              columnsData={columnsData}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default CustomerNotification;
