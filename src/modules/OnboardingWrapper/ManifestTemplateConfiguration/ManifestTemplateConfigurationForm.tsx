import React, {
  Dispatch,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import {
  useToast,
  Box,
  BreadCrumb,
  Card,
  Grid,
  TextInput,
  SectionHeader,
  FontIcon,
  Loader,
} from "ui-library";
import { tGlobalToastActions } from "../../common/GlobalToasts/globalToast.reducer";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { ManifestTemplateConfigActions } from "./ManifestTemplateConfiguration.actions";
import { closeSideMenu, openSideMenu } from "../../../utils/helper";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import {
  BlankPreview,
  EditTemplateWrapper,
  EditTextWrapper,
  FormActionButton,
  IFrameWrapper,
  PreviewContainer,
  PreviewWrapper,
  SectionHeaderWrapper,
  TabsWrapper,
} from "./StyledManifestTemplateConfiguration";
import AttachDynamicTags from "./SubComponents/AttachDynamicTags";
import AceEditor from "react-ace-builds";
import Tab from "../../../utils/components/Tabs/Tab";
import Tabs from "../../../utils/components/Tabs/Tabs";
import {
  IDefaultTemplate,
  IPreviewProps,
  orderCrateDetails,
} from "./ManifestTemplateConfiguration.models";
import { Ace } from "ace-builds";
import { setCompleters } from "ace-builds/src-noconflict/ext-language_tools";
import {
  baseTemplate,
  extractFieldsFromHTML,
  replaceFieldWithData,
} from "../../OrderMiddleMile/PrintAwb/PrintAwb.constants";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { sendGA } from "../../../utils/ga";

interface IManifestTemplateConfigurationForm {
  onFormCancel: () => void;
}

const ManifestTemplateConfigurationForm = (
  props: IManifestTemplateConfigurationForm
) => {
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.manifestTemplateConfiguration
  );
  const dispatch = useDispatch<Dispatch<ManifestTemplateConfigActions>>();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();
  const toast = useToast();

  const {
    manifestTemplateConfigFormData,
    isEditManifestTemplate,
    defaultTemplates,
    defaultSelectedTemplate,
    tags,
    isLoading,
  } = useTypedSelector((state) => state.manifestTemplateConfiguration);

  const [editorInstance, setEditorInstance] = useState<any>();
  const [selectedTab, setSelectedTab] = useState<string>("template");
  const [manifestTemplateNameError, setManifestTemplateNameError] =
    useState<boolean>(false);
  const templateEditor = useRef(null);
  const [errorCount, setErrorCount] = useState<number>(0);

  const templateImgMap = {
    "Predefined Template": "manifestTemplateConfig1.png"
  };

  const defaultHTML = `
    <!DOCTYPE html>
        <html lang="en">

        <head>

            <style>
            * {
                font-family: Calibri, sans-serif;
            }

            table {
                border-collapse: collapse;
            }

            td,
            th {
                text-align: start;
                padding: 5px;
            }

            </style>
        </head>

        <body>
            <div id='print-area' style='page-break-after: always;'>
            <div class='header' style='display: flex; justify-content: space-between; align-items: center;'>
                <div> <img src='@Client Logo' alt='logo' style='height: 60px; width: 100px;' /> </div>
                <div>
                <p style='text-transform: uppercase; font-size: 11px; font-weight: bold; text-align: center;'>
                    Company's name
                </p>
                <p style='font-size: 10px; font-weight: bold;'>
                    Address
                </p>
                <p style='font-size: 10px; font-weight: bold;'>
                    Website
                </p>
                <p style='font-size: 10px; font-weight: bold;'>
                    CIN number
                </p>
                </div>

            </div>
            <p style='font-size: 13px; font-weight: bold;'>
                Manifest Id: @Manifest Id
            </p>
            <div style="padding-top: 10px;">
                <table border='1' style="width: 100%; ">
                
                    <tr>
                    <th rowpsan="4" colspan="5">Origin Branch</th>
                    <td rowpsan="4" colspan="5">@Origin Branch Code</td>
                    <th rowpsan="4" colspan="5">Vendor Name</th>
                    <td rowpsan="4" colspan="5"></td>
                    <th rowpsan="4" colspan="5">Outscan time</th>
                    <td rowpsan="4" colspan="5"></td>
                    </tr>
                    <tr>
                    <th rowpsan="4" colspan="5">Total weight</th>
                    <td rowpsan="4" colspan="5">@Weight</td>
                    <th rowpsan="4" colspan="5">Total shipments</th>
                    <td rowpsan="4" colspan="5">@Orders</td>
                    <th rowpsan="4" colspan="5">Total E-way bill</th>
                    <td rowpsan="4" colspan="5"></td>
                    <th rowpsan="4" colspan="5">Prepared by</th>
                    <td rowpsan="4" colspan="5"></td>
                    </tr>
                    <tr>
                    <th colspan="5">Vehicle Number</th>
                    <th></th>
                    </tr>
                
                </table>
            </div>
            <div style='padding-top: 15px'>
                <table border='1' style='width: 100%;'>
                <thead>
                    <tr>
                    <th>Order no.</th>
                    <th>Parent order no.</th>
                    <th>Shipper name</th>
                    <th>Package weight</th>
                    <th>Deliver customer name</th>
                    <th>AWB no.</th>
                    <th>E-Way Bill Number</th>
                    <th>Expiry Date</th>
                    </tr>
                </thead>
                <tbody>
                    <Orders>
                    <tr>
                    <td>@Order#</td>
                    <td>@Parent Order Number</td>
                    <td>@Package Weight</td>
                    <td>@Shipper Name</td>
                    <td>@Deliver Customer Name</td>
                    <td>@AWB Number</td>
                    <td>
                    <td></td>
                    </td>
                    </tr>
                    </Orders>
                </tbody>
                </table>
                <div style='padding-top: 15px'>
                <table border='1' style='width: 100%;'>
                <thead>
                    <tr>
                    <th>Manifest id</th>
                    <th>Manifest type</th>
                    </tr>
                </thead>
                <tbody>
                    <Manifests>
                    <tr>
                    <td>@Manifest Id</td>
                    <td>@Manifest Type</td>
                    </tr>
                    </Manifests>
                </tbody>
                </table>
            </div>
            </div>
            <div  style='display: flex; justify-content: space-between; margin-top: 60px;'>
                <div class='checked-by'>
                <p>Driver Signature: </p>
                </div>
                <div  style='margin-right: 100px'>
                
                <p>Employee signature & stamp: </p>
                
                </div>
            </div>
            </div>
        </body>

        </html>`;

  const PreviewIcon = ({ children, className, onClick }: IPreviewProps) => {
    return (
      <PreviewContainer onClick={onClick} className={`${className}`}>
        <PreviewWrapper>{children}</PreviewWrapper>
      </PreviewContainer>
    );
  };

  useEffect(() => {
    closeSideMenu();
    dispatch({ type: "@@manifestTemplateConfig/FETCH_PROPERTY_TYPE" });
    dispatch({ type: "@@manifestTemplateConfig/FETCH_TAGS" });
    if (isEditManifestTemplate) {
      let x = isEditManifestTemplate.templateId;
      dispatch({
        type: "@@manifestTemplateConfig/GET_MANIFEST_TEMPLATE_DETAILS_DATA",
        payload: { templateId: x, type: "MANIFEST_TEMPLATE" },
      });
      setDefaultTemplate({
        isActiveFl: false,
        templateName: "",
        isDefault: false,
        htmlData: {
          orderHTML: "",
          ordersHTML: "",
          manifestsHTML: "",
        },
      });
    } else {
      dispatch({ type: "@@manifestTemplateConfig/INITIALISE_FORM" });
    }
  }, []);

  useEffect(() => {
    const completer = {
      getCompletions: function (
        editor: Ace.Editor,
        session: Ace.EditSession,
        pos: Ace.Point,
        prefix: string,
        callback: Ace.CompleterCallback
      ) {
        console.log(editor, session, pos, prefix);
        var completions = tags.dynamicTagKeys.map((o) => {
          return {
            caption: o.dynamicTagLabelValue,
            snippet: "@" + o.dynamicTagLabelValue,
            type: "snippet",
            value: o.dynamicTagKey,
            score: 0,
          };
        });
        callback(null, completions);
      },
    };
    setCompleters([completer]);
  }, [tags]);

  useEffect(() => {
    if (!isEditManifestTemplate) {
      dispatch({
        type: "@@manifestTemplateConfig/FETCH_DEFAULT_TEMPLATE_LIST",
      });
    }
  }, [isEditManifestTemplate]);

  useEffect(() => {
    if (!!defaultTemplates && !isEditManifestTemplate) {
      dispatch({
        type: "@@manifestTemplateConfig/SET_DEFAULT_SELECTED_TEMPLATE",
        payload: defaultTemplates[0],
      });
    }
  }, [defaultTemplates]);

  useEffect(() => {
    if (
      Object.keys(defaultSelectedTemplate).length &&
      defaultSelectedTemplate.templateName !== ""
    ) {
      if (defaultSelectedTemplate.htmlData.orderHTML.includes("<Orders />")) {
        defaultSelectedTemplate.htmlData.orderHTML =
          defaultSelectedTemplate.htmlData.orderHTML.replace(
            "<Orders />",
            `<Orders>${defaultSelectedTemplate.htmlData.ordersHTML}</Orders>`
          );
      }
      if (
        defaultSelectedTemplate.htmlData.orderHTML.includes("<Manifests />")
      ) {
        defaultSelectedTemplate.htmlData.orderHTML =
          defaultSelectedTemplate.htmlData.orderHTML.replace(
            "<Manifests />",
            `<Manifests>${defaultSelectedTemplate.htmlData.manifestsHTML}</Manifests>`
          );
      }
      tags.dynamicTagKeys.forEach((key) => {
        defaultSelectedTemplate.htmlData.orderHTML =
          defaultSelectedTemplate.htmlData.orderHTML.replaceAll(
            key.dynamicTagKey,
            `@${key.dynamicTagLabelValue}`
          );
      });
      setFormData("orderHTML", defaultSelectedTemplate?.htmlData?.orderHTML);
    }
  }, [defaultSelectedTemplate]);

  useEffect(() => {
    if (Object.keys(defaultSelectedTemplate).length) {
      let htmlData = manifestTemplateConfigFormData.orderHTML;
      tags.dynamicTagKeys.forEach((key) => {
        htmlData = htmlData.replaceAll(
          `@${key.dynamicTagLabelValue}`,
          key.dynamicTagKey?.includes("cf_")
            ? "custom_field"
            : key.dynamicTagKey
        );
      });
      handleHtmlRendering(htmlData);
    }
    editorInstance?.getSession().setUseWorker(false);
    editorInstance?.getSession().on("changeAnnotation", function () {
      const annot = editorInstance.getSession().getAnnotations();
      const noOfErrors = annot.length;
      setErrorCount(noOfErrors);
    });
  }, [manifestTemplateConfigFormData.orderHTML]);

  const breadCrumbOptions = useMemo(
    () => [
      {
        id: "manifestTemplateConfiguration",
        label: dynamicLabels?.MANIFEST_TEMPLATE_CONFIGURATION
          ? dynamicLabels.MANIFEST_TEMPLATE_CONFIGURATION
          : "Manifest Configuration",
        disabled: false,
      },
      {
        id: "addManifestTemplate",
        label: isEditManifestTemplate
          ? dynamicLabels.editManifestTemplate
          : dynamicLabels.addManifestTemplate,
        disabled: true,
      },
    ],
    [dynamicLabels]
  );

  //setFormData() sets the data of form which comes from the get call on clicking edit button on listView.
  const setFormData = (key: string, value: any) => {
    dispatch({
      type: "@@manifestTemplateConfig/SET_FORM_DATA",
      payload: { key: key, value: value },
    });
  };

  const handleHtmlChange = (html: string) => {
    setFormData("orderHTML", html);
  };

  //setDefaultTemplate() sets tghe default HTML template from the structure.
  const setDefaultTemplate = (template: IDefaultTemplate) => {
    dispatch({
      type: "@@manifestTemplateConfig/SET_DEFAULT_SELECTED_TEMPLATE",
      payload: template,
    });
  };

  //handleSaveTemplate() saves/updates the template by passing the the payload to the api call.
  const handleSaveTemplate = async () => {
    sendGA(
      "Save Template Action",
      "Manifest Configuration - Save or Update Template"
    );

    let htmlData = editorInstance.getValue();
    tags.dynamicTagKeys.forEach((key) => {
      htmlData = htmlData.replaceAll(
        `@${key.dynamicTagLabelValue}`,
        key.dynamicTagKey
      );
    });
    setManifestTemplateNameError(
      manifestTemplateConfigFormData.templateName === ""
    );
    if (manifestTemplateConfigFormData.templateName !== "") {
      let templateData = "";
      if (htmlData.includes("<Orders>")) {
        let ordersHtml = htmlData.split("<Orders>")[1].split("</Orders>")[0];
        templateData = htmlData.replace(
          `<Orders>${ordersHtml}</Orders>`,
          "<Orders />"
        );
        manifestTemplateConfigFormData.ordersHTML = ordersHtml;
      }
      if (htmlData.includes("<Manifests>")) {
        let manifestsHtml =
          templateData !== ""
            ? templateData.split("<Manifests>")[1].split("</Manifests>")[0]
            : htmlData.split("<Manifests>")[1].split("</Manifests>")[0];
        templateData =
          templateData !== ""
            ? templateData.replace(
                `<Manifests>${manifestsHtml}</Manifests>`,
                "<Manifests />"
              )
            : htmlData.replace(
                `<Manifests>${manifestsHtml}</Manifests>`,
                "<Manifests />"
              );
        manifestTemplateConfigFormData.manifestsHTML = manifestsHtml;
      } else {
        templateData = templateData !== "" ? templateData : htmlData;
      }
      const htmlRequestObj = {
        orderHTML: templateData,
        ordersHTML: manifestTemplateConfigFormData.ordersHTML,
        manifestsHTML: manifestTemplateConfigFormData.manifestsHTML,
      };
      let payload: any = {
        htmlData: htmlRequestObj,
        templateName: manifestTemplateConfigFormData.templateName,
        templateDesc: manifestTemplateConfigFormData.templateDesc,
        type: "MANIFEST_TEMPLATE",
      };

      if (!isEditManifestTemplate) {
        try {
          dispatch({
            type: "@@manifestTemplateConfig/SET_FORM_LOADING",
            payload: true,
          });
          const url =
            apiMappings.manifestTemplateConfiguration.listView.saveAwbTemplate;
          const {
            data: { message, status },
          } = await axios.post(url, payload);
          if (status == 200) {
            toastDispatch({
              type: "@@globalToast/add",
              payload: {
                message:
                  dynamicLabels?.manifestTemplateAddedSuccessfully || message,
                icon: "check-round",
                remove: false,
              },
            });
            dispatch({ type: "@@manifestTemplateConfig/INITIALISE_FORM" });
            openSideMenu();
            setTimeout(() => {
              props?.onFormCancel();
            }, 100);
          } else {
            message && toast.add(message, "warning", false);
          }
        } catch (error: any) {
          if (error?.response.status === 412) {
            error.response.data.message &&
              toast.add(error?.response?.data?.message, "warning", false);
          } else {
            error &&
              toast.add(
                error?.response?.data?.message ||
                  dynamicLabels.somethingWendWrong,
                "warning",
                false
              );
          }
        } finally {
          dispatch({
            type: "@@manifestTemplateConfig/SET_FORM_LOADING",
            payload: false,
          });
        }
      } else {
        payload = {
          templateId: isEditManifestTemplate?.templateId,
          htmlData: htmlRequestObj,
          templateName: manifestTemplateConfigFormData.templateName,
          templateDesc: manifestTemplateConfigFormData.templateDesc,
          type: "MANIFEST_TEMPLATE",
        };

        try {
          dispatch({
            type: "@@manifestTemplateConfig/SET_FORM_LOADING",
            payload: true,
          });
          const url =
            apiMappings.manifestTemplateConfiguration.listView
              .updateAwbTemplate;
          const {
            data: { message, status },
          } = await axios.post(url, payload);

          if (status === 200) {
            toastDispatch({
              type: "@@globalToast/add",
              payload: {
                message: dynamicLabels?.manifestUpdatedSuccessfully || message,
                icon: "check-round",
                remove: false,
              },
            });
            dispatch({ type: "@@manifestTemplateConfig/INITIALISE_FORM" });
            openSideMenu();
            setTimeout(() => {
              props?.onFormCancel();
            }, 100);
          } else {
            message && toast.add(message, "warning", false);
          }
        } catch (error: any) {
          if (error?.response.status === 412) {
            error.response.data.message &&
              toast.add(error?.response?.data?.message, "warning", false);
          } else {
            error &&
              toast.add(
                error?.response?.data?.message ||
                  dynamicLabels.somethingWendWrong,
                "warning",
                false
              );
          }
        } finally {
          dispatch({
            type: "@@manifestTemplateConfig/SET_FORM_LOADING",
            payload: false,
          });
        }
      }
    } else {
      const element = document.getElementById("manifestBreadcrumbs");
      element?.scrollIntoView({ behavior: "smooth" });
      return;
    }
  };

  //On clicking any tag from dynamic tags button, setTags() sets the selected tag at the cursor position on AceEditor.
  const setTags = (label: string) => {
    editorInstance.session.insert(
      editorInstance.getCursorPosition(),
      `@${label}`
    );
    const isTooltipVisible = document.getElementsByClassName("ui-tooltip");
    if (isTooltipVisible.length) {
      isTooltipVisible[0].remove();
    }
  };

  const onLoad = (editor: any) => {
    setEditorInstance(editor);
    editor.commands.bindKey("@", "startAutocomplete");
    editor.commands.bindKey("ctrl-space", null);
  };

  //handleBreadcrumbClick() redirects the page to listView on clicking breadcrumb text.
  const handleBreadcrumbClick = () => {
    openSideMenu();
    dispatch({ type: "@@manifestTemplateConfig/INITIALISE_FORM" });
    setTimeout(() => {
      props?.onFormCancel();
    }, 100);
  };

  //handleCancel() handles the cancel button of form. It redirects the page to listView.
  const handleCancel = () => {
    openSideMenu();
    dispatch({ type: "@@manifestTemplateConfig/INITIALISE_FORM" });
    setTimeout(() => {
      props?.onFormCancel();
    }, 100);
  };

  //handleHtmlRendering() displays the output of HTML code.
  const handleHtmlRendering = useCallback((templateData: string) => {
    let combinedOrderPrintContent = "";
    let orderHTML: string = "",
      ordersHTML: string = "",
      manifestsHTML: string = "";

    orderHTML = templateData;
    if (templateData.includes("<Orders>")) {
      ordersHTML = templateData.split("<Orders>")[1].split("</Orders>")[0];
      orderHTML = orderHTML.replace(
        `<Orders>${ordersHTML}</Orders>`,
        "<Orders />"
      );
    }
    if (templateData.includes("<Manifests>")) {
      manifestsHTML = templateData
        .split("<Manifests>")[1]
        .split("</Manifests>")[0];
      orderHTML = orderHTML.replace(
        `<Manifests>${manifestsHTML}</Manifests>`,
        "<Manifests />"
      );
    }

    /** Extract Dynamic Fields from orderHTML template */
    const orderTemplateFields = extractFieldsFromHTML(orderHTML);
    const ordersTemplateFields = extractFieldsFromHTML(ordersHTML);
    const manifestsTemplateFields = extractFieldsFromHTML(manifestsHTML);
    orderCrateDetails.forEach((orderObj) => {
      const customFields: Record<string, string> = {};
      orderObj.customFieldList?.forEach(({ field, value }) => {
        customFields[field] = value || "";
      });

      const orderDetail = { ...orderObj, ...customFields };

      let previewContent = `${orderHTML}`;

      orderTemplateFields.forEach((field) => {
        previewContent = replaceFieldWithData(
          previewContent,
          field,
          orderDetail[field] || "Not Available"
        );
      });

      /** Find if <Orders /> exist & replace it with Orders Templates (x) times - x: Number of Orders for the manifest */

      if (
        previewContent.includes("<Orders />") &&
        orderDetail.shipmentsLst?.length
      ) {
        let ordersContent = "";

        orderDetail.shipmentsLst &&
          orderDetail.shipmentsLst.forEach((manifestOrderObj) => {
            ordersContent += ordersHTML;
            const ordersDetail = { ...orderDetail, ...manifestOrderObj };

            ordersTemplateFields.forEach((field) => {
              ordersContent = replaceFieldWithData(
                ordersContent,
                field,
                ordersDetail[field] || "Not Available"
              );
            });
          });

        /** If yes, Render Orders HTML template in place of <Orders /> */
        previewContent = previewContent.replace(/<Orders \/>/g, ordersContent);
      }

      /** Find if <Manifests /> exist & replace it with Manifests Templates (x) times - x: Number of Manifests for the manifest */
      if (
        previewContent.includes("<Manifests />") &&
        orderDetail.childManifests?.length
      ) {
        let manifestsContent = "";

        orderDetail.childManifests &&
          orderDetail.childManifests.forEach((childManifestObj) => {
            manifestsContent += manifestsHTML;
            const manifestsDetail = { ...orderDetail, ...childManifestObj };

            manifestsTemplateFields.forEach((field) => {
              manifestsContent = replaceFieldWithData(
                manifestsContent,
                field,
                manifestsDetail[field] || "Not Available"
              );
            });
          });

        /** If yes, Render Manifests HTML template in place of <Manifests /> */
        previewContent = previewContent.replace(
          /<Manifests \/>/g,
          manifestsContent
        );
      }
      combinedOrderPrintContent += previewContent;
    });

    let finalPrintContent: string = baseTemplate.replace(
      ":dynamic-content",
      combinedOrderPrintContent
    );

    if (finalPrintContent) {
      var iframe = document.getElementById(
          "templateFrame"
        ) as HTMLIFrameElement,
        iframeDoc = iframe?.contentDocument;
      iframeDoc?.open();
      iframeDoc?.write(finalPrintContent);
      setTimeout(() => {
        iframe.width = "";
        iframe.width =
          iframeDoc?.documentElement?.scrollWidth &&
          iframeDoc?.documentElement?.scrollWidth > 550
            ? "550"
            : iframeDoc?.documentElement?.scrollWidth &&
              iframeDoc?.documentElement?.scrollWidth > 425
            ? iframeDoc?.documentElement.scrollWidth + 15 + "px"
            : "425px";
        iframeDoc?.close();
      }, 300);
    }
  }, []);

  //handleDisable() makes Save button disabled if there are errors in the HTML code.
  const handleDisable = () => {
    if (
      Object.keys(defaultSelectedTemplate).length &&
      defaultSelectedTemplate?.templateName !== ""
    ) {
      return false;
    } else {
      if (errorCount > 0 || manifestTemplateConfigFormData.orderHTML === "") {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        paddingRight: "15px",
      }}
      px="15px"
      pb="15px"
    >
      <Box
        id="manifestBreadcrumbs"
        display="flex"
        justifyContent="space-between"
        style={{ width: "100%", marginTop: "20px" }}
      >
        <BreadCrumb
          options={breadCrumbOptions}
          onClick={handleBreadcrumbClick}
        />
      </Box>

      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          backgroundColor: "#fff",
          overflow: "hidden",
          width: "100%",
          paddingRight: "15px",
          paddingBottom: "15px",
          marginTop: "20px",
          paddingTop: "35px",
          paddingLeft: "15px",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          style={{ width: "100%" }}
          justifyContent="space-between"
        >
          <Grid container spacing="15px">
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <TextInput
                id="id-templateName"
                name="templateName"
                className="someClassName"
                value={manifestTemplateConfigFormData.templateName}
                onChange={(e: { target: { value: string } }) => {
                  setFormData("templateName", e.target.value);
                  setManifestTemplateNameError(e.target.value === "");
                }}
                label={dynamicLabels?.templateName}
                labelColor={"text.inputLabel.default"}
                placeholder={"Enter text here..."}
                error={manifestTemplateNameError}
                errorMessage={dynamicLabels?.manifestTemplateNameErrorMessage}
                required={true}
                fullWidth={true}
                maxLength={255}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <TextInput
                id="id-awbTemplateDesc"
                name="templateDesc"
                className="someClassName"
                value={manifestTemplateConfigFormData.templateDesc}
                label={dynamicLabels?.templateDesc}
                labelColor={"text.inputLabel.default"}
                placeholder={"Enter text here..."}
                onChange={(e: { target: { value: string } }) => {
                  setFormData("templateDesc", e.target.value);
                }}
                fullWidth={true}
                maxLength={255}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ width: "100%" }}
          pb="15px"
        >
          <SectionHeaderWrapper>
            <SectionHeader headerTitle={dynamicLabels?.designDetails} />
          </SectionHeaderWrapper>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ width: "100%" }}
          pb="15px"
          className="1"
        >
          <Grid container spacing="15px" className="2">
            <Grid item xs={12} sm={6} md={6} lg={6} className="3">
              {!!isEditManifestTemplate ? (
                <EditTemplateWrapper>
                  <EditTextWrapper>Edit HTML</EditTextWrapper>
                  <AttachDynamicTags
                    onSelect={(label: string) => {
                      setTags(label);
                    }}
                    show={true}
                  >
                    <AceEditor
                      mode="html"
                      theme="xcode"
                      ref={templateEditor}
                      onLoad={onLoad}
                      onChange={handleHtmlChange}
                      name="manifestTemplate"
                      fontSize={14}
                      width="100%"
                      height="600px"
                      showPrintMargin={false}
                      showGutter={true}
                      highlightActiveLine={true}
                      value={manifestTemplateConfigFormData.orderHTML}
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: false,
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 2,
                      }}
                      style={{
                        margin: "0px",
                        top: "25px",
                        padding: "9px 10px 3px 7px",
                        border: "1px solid #97979778",
                      }}
                    />
                  </AttachDynamicTags>
                </EditTemplateWrapper>
              ) : (
                <TabsWrapper className="tabs-wrapper">
                  <Tabs selected={selectedTab} onSelect={setSelectedTab}>
                    <Tab
                      id="template"
                      icon={<FontIcon variant="template" size={15} />}
                      label={dynamicLabels.predefinedTemplates}
                    >
                      {defaultTemplates &&
                        defaultTemplates?.map((template: IDefaultTemplate) => {
                          return (
                            <PreviewIcon
                              className={
                                template.templateName ===
                                defaultSelectedTemplate.templateName
                                  ? "preview-container-active"
                                  : "preview-container"
                              }
                              key={template.templateName}
                              onClick={() => {
                                setDefaultTemplate(
                                  defaultTemplates.filter(
                                    (htmlTemplate: IDefaultTemplate) =>
                                      htmlTemplate.templateName ===
                                      template.templateName
                                  )[0]
                                );
                                setSelectedTab("html");
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  height: "auto",
                                  zIndex: 1,
                                  filter: "grayscale(1)",
                                  marginTop: 0,
                                }}
                                className="preview-icon"
                              >
                                <img
                                  width="300px"
                                  height="320px"
                                  src={`images/${
                                    templateImgMap[template.templateName]
                                      ? templateImgMap[template.templateName]
                                      : "transguard.png"
                                  }`}
                                ></img>
                              </div>
                            </PreviewIcon>
                          );
                        })}
                      <PreviewIcon
                        className={
                          defaultSelectedTemplate?.htmlData?.orderHTML === ""
                            ? "preview-container-active"
                            : "preview-container"
                        }
                        onClick={() => {
                          setSelectedTab("html");
                          setFormData("orderHTML", defaultHTML);
                          setDefaultTemplate({
                            isActiveFl: false,
                            templateName: "",
                            isDefault: false,
                            htmlData: {
                              orderHTML: "",
                              ordersHTML: "",
                              manifestsHTML: "",
                            },
                          });
                        }}
                      >
                        <Box
                          flexDirection="column"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          style={{ textAlign: "center", fontSize: 9 }}
                        >
                          <FontIcon
                            size={48}
                            variant="html"
                            style={{
                              color: "#b9b9b9!important",
                            }}
                          />
                          <p>{dynamicLabels.createNewHtmlCode}</p>
                        </Box>
                      </PreviewIcon>
                    </Tab>
                    <Tab
                      id="html"
                      icon={<FontIcon variant="html-editor" size={15} />}
                      label={dynamicLabels.htmlEditor}
                    >
                      <EditTextWrapper>Edit HTML</EditTextWrapper>
                      <AttachDynamicTags
                        onSelect={(label: string) => {
                          setTags(label);
                        }}
                        show={true}
                      >
                        <AceEditor
                          mode="html"
                          theme="xcode"
                          ref={templateEditor}
                          onLoad={onLoad}
                          onChange={handleHtmlChange}
                          name="manifestTemplate"
                          fontSize={14}
                          width="100%"
                          height="600px"
                          showPrintMargin={false}
                          showGutter={true}
                          highlightActiveLine={true}
                          value={manifestTemplateConfigFormData.orderHTML}
                          setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: false,
                            enableSnippets: true,
                            showLineNumbers: true,
                            tabSize: 2,
                          }}
                          style={{
                            margin: "0px",
                            top: "25px",
                            padding: "9px 10px 3px 7px",
                            border: "1px solid #97979778",
                          }}
                        />
                      </AttachDynamicTags>
                    </Tab>
                  </Tabs>
                </TabsWrapper>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              {!!manifestTemplateConfigFormData.orderHTML ? (
                <Box
                  mr="50px"
                  style={{
                    height: isEditManifestTemplate ? "645px" : "100%",
                    margin: "0 auto",
                    backgroundColor: "#f0f0f0",
                    padding: "17px 0",
                  }}
                >
                  <IFrameWrapper className="iframe-wrapper">
                    <iframe
                      id="templateFrame"
                      style={{ margin: "0 auto", display: "block" }}
                      width="100%"
                      height="100%"
                    ></iframe>
                  </IFrameWrapper>
                </Box>
              ) : (
                <BlankPreview>{dynamicLabels.htmlPreview}</BlankPreview>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box horizontalSpacing="15px" display="flex" mt="30px" fullWidth>
          <FormActionButton
           id={isEditManifestTemplate ? 'ManifestTemplateForm-button-Update' : 'ManifestTemplateForm-button-save'}
            iconVariant="icomoon-save"
            disabled={handleDisable()}
            onClick={handleSaveTemplate}
            primary
          >
            {isEditManifestTemplate ? dynamicLabels.update : dynamicLabels.save}
          </FormActionButton>
          <FormActionButton id="ManifestTemplateForm-button-close" iconVariant="icomoon-close" onClick={handleCancel}>
            {dynamicLabels.cancel}
          </FormActionButton>
        </Box>
      </Card>
      {isLoading && <Loader center={true} fadeBackground={true} speed={1} />}
    </Box>
  );
};
export default ManifestTemplateConfigurationForm;
