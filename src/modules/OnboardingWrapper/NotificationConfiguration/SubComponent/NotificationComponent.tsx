import React, { useState, useMemo } from "react";
import { Toggle } from "ui-library";
import "../CustomerNotificationConfiguration/CustomerNotificationStyles.scss";

import DeleteModal from "./DeleteModal";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import {
  tNotificationComponentProps,
  tPayload,
  tUpdatedObj,
} from "./Notification.model";
import { excludeArray } from "./constants";

const NotificationComponent = ({
  structureColumns,
  columnsData,
  setShowDeleteModal,
  showDeleteModal,
  setColumnsData,
  toast,
  setMessageTemplateSetting,
  setUpdatedObj,
  dynamicLabels,
  currentNotification,
  ivrAccess,
}: tNotificationComponentProps) => {
  const [searchText, setSearchText] = useState("");
  const [deleteObj, setDeleteObj] = useState({});

  const filterColumnData = useMemo(() => {
    return columnsData.filter((item) =>
      item?.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, columnsData]);
  //main data is stored in filterColumnData

  const handleDeletePopUp = (data: tUpdatedObj) => {
    setShowDeleteModal(true);
    setDeleteObj(data);
  };

  const updateStructure = async () => {
    try {
      const { data: response } = await axios.get(
        apiMappings.order.listView.customerNotificationTemplates,
        { params: { notificationType: currentNotification } }
      );
      if (response?.status === 200) {
        setColumnsData(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleActiveFl = async (data: tUpdatedObj) => {
    try {
      const payload: tPayload = {
        id: data?.id,
        name: data?.name,
        smsMessage: data?.smsMessage,
        emailSubject: data?.emailSubject,
        emailBody: data?.emailBody,
        isActiveFl: !data?.isActiveFl,
        isSmsActiveFl: data?.isSmsActiveFl,
        isEmailActiveFl: data?.isEmailActiveFl,
        isWhatsappActiveFl: data?.isWhatsappActiveFl,
        templateName: data?.templateName,
        templateId: data?.templateId,
        templateLanguage: data?.templateLanguage,
        templateDynamicTags: data?.templateDynamicTags,
        whatsappMessage: data?.whatsappMessage
      };
      if (
        ivrAccess &&
        (currentNotification === "ORDER_ALLMILE" ||
          currentNotification === "ORDER" ||
          currentNotification === "MILESTONE")
      ) {
        payload.ivrMessage = data?.ivrMessage;
        payload.isIvrActiveFl = data?.isIvrActiveFl;
      }
      const url = apiMappings.order.listView.customerNotificationTemplates;

      const { data: response } = await axios.put(url, [payload], {
        params: { notificationType: currentNotification },
      });
      if (response?.status === 200) {
        toast.add(response?.message, "check-round", false);
        updateStructure();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageTemplateSetting = (data: any = {}) => {
    setMessageTemplateSetting(true);
    if (Object.keys(data).length === 0) {
    } else {
      setUpdatedObj(data);
    }
  };

  return (
    <>
      <div style={{ padding: "15px" }}>
        <table className="customer-notification__box__simple-table-notification">
          <thead>
            <tr>
              <th style={{ width: "30px" }}></th>
              {structureColumns?.map((column) => (
                <th
                  className={
                    column?.id === "name"
                      ? "customer-notification__box__name"
                      : ""
                  }
                  key={column?.id}
                >
                  <span>{column?.label}</span>
                  {column?.searchable && (
                    <div className="customer-notification__box__table-search-column">
                      <i className="icon ui-library-icons icon-icomoon-search customer-notification__box__table-search-column__icon-btn"></i>
                      <input
                        className="customer-notification__box__table-search-column__dotted-input"
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      ></input>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filterColumnData?.map((data) => (
              <tr key={data?.id}>
                <td></td>
                <td>
                  <span>{data?.name}</span>
                </td>
                <td style={{ padding: "5px 10px" }}>
                  <Toggle
                    id={data?.id}
                    checked={data?.isActiveFl}
                    disabled={
                      currentNotification !== "MILESTONE"
                        ? data?.default
                        : excludeArray.indexOf(data?.name) > -1
                    }
                    onChange={() => handleActiveFl(data)}
                    style={{ margin: "14px 0px 0px 0px" }}
                  />
                </td>
                <td>
                  <span className="customer-notification__box__delete-action-notification">
                    <button
                      id="notificationEmail--actionBar-email"
                      style={{ background: "white", margin: "3px" }}

                      onClick={() => handleMessageTemplateSetting(data)}
                      title={
                        dynamicLabels?.messageTemplateSettings ||
                        "Message Template Settings"
                      }
                    >
                      <img
                      src="images/email.svg"
                      width="17px"></img>
                    </button>

                    <button
                      id="notificationDelete--actionBar-delete"
                      onClick={() => handleDeletePopUp(data)}
                      style={{ background: "white", margin: "3px" }}
                      disabled={
                        currentNotification !== "MILESTONE"
                          ? data?.default
                          : excludeArray.indexOf(data?.name) > -1
                      }
                      title={dynamicLabels?.Delte || "Delete"}
                    >
                      <i className="icon ui-library-icons icon-icomoon-delete customer-notification__box__delete-action-notification__common-btn"></i>
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className="customer-notification__box__add-more-notifications"
          onClick={() => handleMessageTemplateSetting()}
        >
          <span>
            {`+ ${dynamicLabels.addMoreNotifications}` ||
              "+ Add More Notifications"}
          </span>
        </div>
      </div>
      {showDeleteModal && (
        <DeleteModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          data={deleteObj}
          setColumnsData={setColumnsData}
          toast={toast}
          dynamicLabels={dynamicLabels}
          currentNotification={currentNotification}
        />
      )}
    </>
  );
};

export default NotificationComponent;
