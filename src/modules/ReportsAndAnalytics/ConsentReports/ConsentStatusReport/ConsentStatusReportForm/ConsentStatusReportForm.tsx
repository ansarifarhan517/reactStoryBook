import React, { Dispatch, useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  IconButton,
  useToast,
} from "ui-library";
import FormLoader from "../../../../../utils/components/FormLoader";
import { useDispatch } from "react-redux";
import { IConsentStatusReportFormActions } from "./ConsentStatusReportForm.action";
import { useForm } from "react-hook-form";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import FormField from "../../../../../utils/components/Form/FormField";
import {
  AddFormButtonContainer,
  FormWrapper,
} from "./ConsentStatusReportForm.styles";
import firebaseRef from "../../../../../utils/firebase";
import { sendGA } from "../../../../../utils/ga";

import apiMappings from "../../../../../utils/apiMapping";
import ConsentMultiSelectFormField from "../SubComponets/ConsentMultiSelectFormField";
import axios from "../../../../../utils/axios";
import { createRequestPayload } from "./FormUtils";
import SendEmailModal from "../SubComponets/SendEmailModal";
import ConsentStatusReportList from "../ConsentStatusReportList/ConsentStatusReportList";
import EmailMessage from "../../../../../utils/components/EmailMessage";
import ConsentDropDownField from "../SubComponets/ConsentDropDownField";

const ConsentStatusReportForm = ({
  // handleShowList,
  setShowDownloadSuccess,
  pageName,
}) => {
  /**General Hooks */
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
  });
  console.log(formInstance.formState);
  const { handleSubmit, watch, setValue } = formInstance;
  /**Custom Hooks */
  // const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  const toast = useToast();
  // const consentReportsDynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.consentReports)


  /** Redux Hooks * */
  const dispatch = useDispatch<Dispatch<IConsentStatusReportFormActions>>();
  const structure = useTypedSelector(
    (state) => state.consentStatusReport.form.structure
  );
  const loading = useTypedSelector(
    (state) => state.consentStatusReport.form.loading
  );
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);

  const sectionsKeysArray = Object.keys(structure);
  const [showEmailSuccessMessage, setShowEmailSuccessMessage] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [email, setEmail] = useState("");
  const  totalCount= useTypedSelector((state)=>state.consentStatusReport.listView.data.totalCount)


  // const timeZone =
  //   clientProperties?.TIMEZONE?.propertyValue ||
  //   JSON.parse(localStorage.getItem("userAccessInfo") || "{}").timezone;

 
  const handleViewReport = (data) => {
    dispatch({
      type: "@@consentStatusReportForm/SET_FORM_DATA",
      payload: { ...data },

    });
    setShowListView(true);
  };

  const getSocketConnection = (timestamp: any) => {
    const timeStampString = timestamp.toString();

    let accessToken = localStorage.getItem("userAccessInfo");
    accessToken = accessToken ? JSON.parse(accessToken).token : null;
    const driverCreateRef = firebaseRef
      .database()
      .ref(`sockets/dynamicreport/${accessToken}/${timeStampString}`);

    driverCreateRef.on("value", function (snapshot) {
      if (snapshot.val()) {
        var reportURL = snapshot.val().value;

        if (reportURL && reportURL == "usermasterreport_FAILED") {
          console.log("Failed");
          toast.add(
            dynamicLabels["internal.server.error"] != null
              ? dynamicLabels["internal.server.error"]
              : "Internal Server Error",
            "warning",
            false
          );
        } else if (reportURL && reportURL?.length) {
          window.location.href = reportURL;
        }
        driverCreateRef.off("value");
      }
    });
  };


  const handleDownloadReport = async (data) => {
    const hitStamp = Date.now().toString();

    const payload = createRequestPayload(data);
    sendGA(
      "Download Action",
      "Users Download Button Click - User Audit Report"
    );
    getSocketConnection(hitStamp);
    setShowDownloadSuccess(true);

    try {
      await axios.post(
        pageName == "consentDetailedReport"
          ? apiMappings.consentDetailedReport.downloadReport
          : apiMappings.consentStatusReport.downloadReport,
        payload,
        {}
      );

    } catch (errorMessage) {
      toast.add(
        typeof errorMessage === "string"
          ? errorMessage
          : dynamicLabels?.somethingWendWrong,
        "",
        false
      );

    }
  };

  const handlerSubmitEmail = async (data, email) => {
    setShowSendEmail(false);
    const payload = createRequestPayload(data);

    setShowEmailSuccessMessage(true);
    setEmail(email);
    try {
      const { data } = await axios.post(
        pageName == "consentDetailedReport"
          ? apiMappings.consentDetailedReport.sendEmail
          : apiMappings.consentStatusReport.sendEmail,
        { ...payload, receiverEmail: email }
      );
    } catch (errorMessage) {
      toast.add(
        typeof errorMessage === "string"
          ? errorMessage
          : dynamicLabels?.somethingWendWrong,
        "",
        false
      );
    }
  };

  useEffect(() => {
    dispatch({
      type: "@@consentStatusReportForm/SET_PAGE_NAME",
      payload: pageName,
    });
    dispatch({ type: "@@consentStatusReportForm/FETCH_STRUCTURE" });
   
  }, []);

  const [consentTypePayload, setConsentTypePayload] = useState(pageName == "consentDetailedReport" ? {}:[]);
  const consentTypeWatcher = watch("consentType");
  const consentTypeWatcherString = JSON.stringify(consentTypeWatcher)
  const [showSendEmailModal, setShowSendEmail] = useState(false);
  const [resetConsentVersion,setResetConsentVersion] = useState(false)
  const [resetConsentName,setResetConsentName] = useState(false)
  const [resetDA,setResetDA] = useState(false)
  const consentNameWatcher = watch("consentName");
  const [consentNamePayload,setConsentNamePayload] = useState(pageName == "consentDetailedReport" ? {}:[])
  useEffect(() => {
      setResetConsentVersion(!resetConsentVersion)
      setResetConsentName(!resetConsentName)
      setResetDA(!resetDA)
     pageName == "consentStatusReport" ? setValue('consentVersion',[]) : setValue('consentVersion',"")
     pageName == "consentStatusReport" ? setValue('consentName',[]) : setValue('consentName',"")
      setValue('da',[])
      if (pageName == "consentDetailedReport") {
        setConsentTypePayload([consentTypeWatcher?.consentType]);
      } else {
        setConsentTypePayload(
          consentTypeWatcher?.map((type) => type.consentType)
        );
      }
  }, [consentTypeWatcherString]);

  const handleSendEmail = () => {
    setShowSendEmail(true);
  };

  useEffect(()=>{

    setResetConsentVersion(!resetConsentVersion)
    pageName == "consentStatusReport" ? setValue('consentVersion',[]) : setValue('consentVersion',"")
    if (pageName == "consentDetailedReport") {
      setConsentNamePayload([consentNameWatcher?.name]);
    } else {
      setConsentNamePayload(
        consentNameWatcher?.map((consentName) => consentName?.name)
      );
    }
  },[watch('consentName')])
 
  return (
    <>
      <FormWrapper>
        <div id="toast-inject-here"></div>
        <Box bgColor="white">
          <Card style={{ position: "relative" }}>
            {loading ? (
              <FormLoader />
            ) : (
              <div>
                {sectionsKeysArray.length
                  ? sectionsKeysArray?.map((sectionName) => {
                      return (
                        <div
                          className={`${sectionName}-section`}
                          key={sectionName}
                        >
                          <Grid
                            container
                            spacing="10px"
                            style={{ marginBottom: "15px" }}
                          >
                            {Object.keys(structure[sectionName])
                              ? Object.keys(structure[sectionName])?.map(
                                  (fieldName) => {
                                    const fieldStructure =
                                      structure[sectionName][fieldName];
                                    const permission =
                                      fieldStructure?.permission;
                                    if (
                                      fieldName == "consentType" &&
                                      pageName == "consentStatusReport"
                                    ) {
                                      return (
                                        <Grid
                                          item
                                          key={fieldName}
                                          xs={12}
                                          sm={6}
                                          md={3}
                                          className="grid-item"
                                        >
                                          <ConsentMultiSelectFormField
                                            name={fieldName}
                                            meta={fieldStructure}
                                            formInstance={formInstance}
                                            timeInterval={15}
                                            apiPayload={consentTypePayload}
                                            
                                          />
                                        </Grid>
                                      );
                                    }
                                    if (
                                      fieldName == "consentVersion" &&
                                      pageName == "consentStatusReport"
                                    ) {
                                      return (
                                        <Grid
                                          item
                                          key={fieldName}
                                          xs={12}
                                          sm={6}
                                          md={3}
                                          className="grid-item"
                                        >
                                          <ConsentMultiSelectFormField
                                            name={fieldName}
                                            meta={fieldStructure}
                                            formInstance={formInstance}
                                            timeInterval={15}
                                            apiPayload={consentTypePayload}
                                             reset={resetConsentVersion}
                                             consentNamePayload={consentNamePayload}
                                          />
                                        </Grid>
                                      );
                                    }
                                   
                                    if (
                                      fieldName == "consentName" &&
                                      pageName == "consentStatusReport"
                                    ) {
                                      return (
                                        <Grid
                                          item
                                          key={fieldName}
                                          xs={12}
                                          sm={6}
                                          md={3}
                                          className="grid-item"
                                        >
                                          <ConsentMultiSelectFormField
                                            name={fieldName}
                                            meta={fieldStructure}
                                            formInstance={formInstance}
                                            timeInterval={15}
                                            apiPayload={consentTypePayload}
                                            reset={resetConsentName}
                                          />
                                        </Grid>
                                      );
                                    }

                                    if (
                                      fieldName == "consentType" &&
                                      pageName == "consentDetailedReport"
                                    ) {
                
                                      return (
                                        <Grid
                                          item
                                          key={fieldName}
                                          xs={12}
                                          sm={6}
                                          md={3}
                                          className="grid-item"
                                        >
                                          <ConsentDropDownField
                                            name={fieldName}
                                            meta={fieldStructure}
                                            formInstance={formInstance}
                                            timeInterval={15}
                                            apiPayload={consentTypePayload}
                                          />
                                        </Grid>
                                      );
                                    }
                                    if (
                                      fieldName == "consentName" &&
                                      pageName == "consentDetailedReport"
                                    ) {
                                     
                                      return (
                                        <Grid
                                          item
                                          key={fieldName}
                                          xs={12}
                                          sm={6}
                                          md={3}
                                          className="grid-item"
                                        >
                                          <ConsentDropDownField
                                            name={fieldName}
                                            meta={fieldStructure}
                                            formInstance={formInstance}
                                            timeInterval={15}
                                            apiPayload={consentTypePayload}
                                          />
                                        </Grid>
                                      );
                                    }
                                    if (
                                      fieldName == "consentVersion" &&
                                      pageName == "consentDetailedReport"
                                    ) {
                                     
                                      return (
                                        <Grid
                                          item
                                          key={fieldName}
                                          xs={12}
                                          sm={6}
                                          md={3}
                                          className="grid-item"
                                        >
                                          <ConsentDropDownField
                                            name={fieldName}
                                            meta={fieldStructure}
                                            formInstance={formInstance}
                                            timeInterval={15}
                                            apiPayload={consentTypePayload}
                                            consentNamePayload={consentNamePayload}
                                          />
                                        </Grid>
                                      );
                                    }
                                    if (
                                      fieldName == "da"
                                    ) {
                                    
                                      return (
                                        <Grid
                                          item
                                          key={fieldName}
                                          xs={12}
                                          sm={6}
                                          md={3}
                                          className="grid-item"
                                        >
                                          <ConsentMultiSelectFormField
                                            name={fieldName}
                                            meta={fieldStructure}
                                            formInstance={formInstance}
                                            timeInterval={15}
                                            apiPayload={consentTypePayload}
                                            reset={resetDA}
                                          />
                                        </Grid>
                                      );
                                    }

                                    if (fieldName == "isActiveFl") {
                                      return (
                                        <Grid
                                          item
                                          key={fieldName}
                                          xs={12}
                                          sm={6}
                                          md={3}
                                          className="grid-item"
                                        >
                                          <FormField
                                            name={fieldName}
                                            meta={fieldStructure}
                                            formInstance={formInstance}
                                            timeInterval={15}
                                            options={[
                                              {
                                                id: "Active",
                                                name: "Active",
                                                label:"Active",
                                                value: "Active",
                                              },
                                              {
                                                id: "InActive",
                                                name: "InActive",
                                                value: "InActive",
                                                label :"InActive"
                                              },
                                            ]}
                                            isSortable={false}
                                          />
                                        </Grid>
                                      );
                                    }

                                    return !permission ? undefined : (
                                      <Grid
                                        item
                                        key={fieldName}
                                        xs={12}
                                        sm={6}
                                        md={3}
                                        className="grid-item"
                                      >
                                        <FormField
                                          name={fieldName}
                                          meta={fieldStructure}
                                          formInstance={formInstance}
                                          timeInterval={15}
                                        />
                                      </Grid>
                                    );
                                  }
                                )
                              : null}
                          </Grid>
                        </div>
                      );
                    })
                  : null}
              </div>
            )}
            <Grid container spacing="15px">
              <AddFormButtonContainer item xs={6} sm={6} md={6}>
              <IconButton
                  id="consentStatusReport-actionBar-view"
                  primary
                  iconVariant="icon-notes"
                  style={{ width: "140px" }}
                  onClick={handleSubmit((data) => {
                    handleViewReport(data);
                  })}
                >
                  {"View Report"}
                </IconButton>
               { totalCount>0 && <IconButton
                  id="consentStatusReport-actionBar-email"
                  iconVariant="send-mail"
                  onClick={handleSendEmail}
                  style={{ width: "140px" }}
                >
                  {"Send Email"}
                </IconButton> }
                
                { totalCount>0 &&<IconButton
                  id="consentStatusReport-actionBar-download"
                  primary
                  iconVariant="icomoon-download-report"
                  style={{ width: "140px" }}
                  onClick={handleSubmit((data) => {
                    handleDownloadReport(data);
                  })}
                >
                  {"Download"}
                </IconButton>}
              </AddFormButtonContainer>
            </Grid>
          </Card>
        </Box>
      </FormWrapper>
      {showListView && (
        <Box style={{ width: "100%" }}>
          <ConsentStatusReportList />

        </Box>
      )}
      {showSendEmailModal && (
        <SendEmailModal
          isModalOpen={showSendEmailModal}
          setShowSendEmail={setShowSendEmail}
          formInstance={formInstance}
          handlerSubmitEmail={handlerSubmitEmail}
        />
      )}
      {showEmailSuccessMessage && (
        <EmailMessage
          showInfoModal={showEmailSuccessMessage}
          onToggle={setShowEmailSuccessMessage}
          email={email}
        />
      )}
    </>
  );
};

export default ConsentStatusReportForm;
