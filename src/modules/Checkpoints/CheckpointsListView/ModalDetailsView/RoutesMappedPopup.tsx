import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  useToast,
  Accordion,
  AccordionHeaderTitle,
  AccordionContent,
  Box
} from "ui-library";

import axios from "../../../../utils/axios";
import apiMappings from "../../../../utils/apiMapping";
import RouteDetailsTableView from "./RouteDetailsTableView";
import { deepCopy, getFormattedDate } from "../../../../utils/helper";
import { StyledAccordionHeaderTitle, StyledBox, StyledHeaderContainer, StyledRouteDivider, StyledRouteValues, StyledRouteValuesEllipsis, StyledSpan } from "../CheckpointsListViewStyledComponent";

const RoutesMappedPopupView = ({popupRouteDetails, isModalOpen, setIsModalOpen, dynamicLabels }) => {

  const toast = useToast();

  const [expanded, setExpanded] = useState('')
  const [addRouteForm, setAddRouteForm] = useState({});


async function handleRouteDetails(row) {
  const getRouteUrl = apiMappings.checkpoints.routeMiddleMile.addRouteForwardFormJSON;
  try {
   let result = await axios.get(getRouteUrl);
   let addRouteForm = result?.data
   let res = result?.data

   let resultChild  = await axios.get(apiMappings.checkpoints.routeMiddleMile.addRouteFormChildJSON);
   res = { ...addRouteForm, childNodes: [] };
   
    const data = await axios.get(apiMappings.checkpoints.routeMiddleMile.getDetail + '?routeId=' + encodeURIComponent(row));
    let routeDetails = data?.data?.data;
    let addRouteForm_new = { ...addRouteForm };

    if (routeDetails?.viaPointsDetailsResponseDTO) {
      addRouteForm_new['forwardRouteDetails']['deliveryOrder'].value = routeDetails?.viaPointsDetailsResponseDTO[routeDetails?.viaPointsDetailsResponseDTO?.length - 1]['sequenceNumber'] - 1;
    }
    addRouteForm_new['forwardRouteDetails']['originBranchId'].value = routeDetails?.originBranchName;
    addRouteForm_new['forwardRouteDetails']['destinationBranchId'].value = routeDetails?.destinationBranchName;
    addRouteForm_new['forwardRouteDetails']['routeType'] = { label: "Route Type", id: "routeType", value: "", permission: true };
    addRouteForm_new['forwardRouteDetails']['routeType'].value = routeDetails?.routeType ? routeDetails?.routeType : "-";
    addRouteForm_new['forwardRouteDetails']['routeName'].value = routeDetails?.routeName;
    addRouteForm_new['forwardRouteDetails']['routeCode'].value = routeDetails?.routeCode;
    addRouteForm_new['forwardRouteDetails']['serviceType'].value = routeDetails?.serviceTypeRouteDetailsDTO?.serviceType;
    let delTypes:any = [];
    routeDetails?.serviceTypeRouteDetailsDTO?.deliveryTypes.forEach(function(delType) {
      delTypes.push(delType?.deliveryType);
    });
    addRouteForm_new['forwardRouteDetails']['deliveryType']['value'] = delTypes.join();
    addRouteForm_new['forwardRouteDetails']['serviceTime'].value = routeDetails?.serviceTypeRouteDetailsDTO?.serviceTime;
    addRouteForm_new['forwardRouteDetails']['serviceDays'].value = routeDetails?.serviceTypeRouteDetailsDTO?.serviceDays;
    addRouteForm_new['forwardRouteDetails']['branchId'].value = routeDetails?.destinationBranchName;
    let checkpointsArr:any = [];
    routeDetails?.checkpoints?.forEach((checkpoint) => {
      checkpointsArr.push(checkpoint?.checkpointCode)
    })
    addRouteForm_new['forwardRouteDetails']['checkpointCodes'].value = checkpointsArr.join();
    if (routeDetails?.viaPointsDetailsResponseDTO && routeDetails?.viaPointsDetailsResponseDTO[(routeDetails?.viaPointsDetailsResponseDTO?.length) - 2]) {
      addRouteForm_new['forwardRouteDetails']['fromBranch'].value = routeDetails?.viaPointsDetailsResponseDTO[(routeDetails?.viaPointsDetailsResponseDTO?.length) - 2]?.branchName;
    } else {
      addRouteForm_new['forwardRouteDetails']['fromBranch'].value = addRouteForm_new['forwardRouteDetails']['originBranchId']['value'];
    }

    res = { ...res, addRouteForm: { ...res.addRouteForm, ...addRouteForm_new, childNodes: []}};

  if (routeDetails.viaPointsDetailsResponseDTO) {
    let destDetails = routeDetails?.viaPointsDetailsResponseDTO[routeDetails?.viaPointsDetailsResponseDTO.length - 1];
    addRouteForm_new['forwardRouteDetails']['milestoneType'].value = destDetails?.milestoneType;
    addRouteForm_new['forwardRouteDetails']['modeOfTransport'].value = destDetails?.modeOfTransport;
    addRouteForm_new['forwardRouteDetails']['deliveryDay'].value = destDetails?.deliveryDay;

    if (destDetails.milestoneType == 'PICKUP') {
      addRouteForm_new['forwardRouteDetails']['loadingTime'].value = destDetails?.unloadingTime;
      addRouteForm_new['forwardRouteDetails']['loadingStartTimeWindow'].value = getFormattedDate(destDetails?.startTime, '')
      addRouteForm_new['forwardRouteDetails']['loadingEndTimeWindow'].value = getFormattedDate(destDetails?.endTime, '')
      addRouteForm_new['forwardRouteDetails']['unloadingStartTimeWindow']['permission'] = false;
      addRouteForm_new['forwardRouteDetails']['unloadingEndTimeWindow']['permission'] = false;

      addRouteForm_new['forwardRouteDetails']['loadingTime']['permission'] = true;
      addRouteForm_new['forwardRouteDetails']['loadingStartTimeWindow']['permission'] = true;
      addRouteForm_new['forwardRouteDetails']['loadingEndTimeWindow']['permission'] = true;
    } else if (destDetails.milestoneType == 'DELIVER') {
      addRouteForm_new['forwardRouteDetails']['unloadingTime'].value = destDetails?.unloadingTime;
      addRouteForm_new['forwardRouteDetails']['unloadingStartTimeWindow'].value = getFormattedDate(destDetails?.startTime, '')
      addRouteForm_new['forwardRouteDetails']['unloadingEndTimeWindow'].value = getFormattedDate(destDetails?.endTime, '')
      addRouteForm_new['forwardRouteDetails']['unloadingTime']['permission'] = true;
      addRouteForm_new['forwardRouteDetails']['unloadingStartTimeWindow']['permission'] = true;
      addRouteForm_new['forwardRouteDetails']['unloadingEndTimeWindow']['permission'] = true;

      addRouteForm_new['forwardRouteDetails']['loadingStartTimeWindow']['permission'] = false;
      addRouteForm_new['forwardRouteDetails']['loadingEndTimeWindow']['permission'] = false;
    }
    res = { ...res, addRouteForm: { ...res.addRouteForm, ...addRouteForm_new, childNodes: [] } };

    for (let i = 0; i < routeDetails?.viaPointsDetailsResponseDTO?.length - 1; i++) {
      let viaPointdata = routeDetails?.viaPointsDetailsResponseDTO[i];
      let addRouteFormChildTemplateCopy = {...resultChild.data}
        addRouteFormChildTemplateCopy['transitPoints']['deliveryOrder']['value'] = viaPointdata?.sequenceNumber - 1;
        if (i === 0) {
          addRouteFormChildTemplateCopy['transitPoints']['fromBranch']['value'] = addRouteForm_new['forwardRouteDetails']['originBranchId']['value'];
        } else {
          addRouteFormChildTemplateCopy['transitPoints']['fromBranch']['value'] = routeDetails['viaPointsDetailsResponseDTO'][i - 1]['branchName'];
        }
        addRouteFormChildTemplateCopy['transitPoints']['branchId']['value'] = viaPointdata['branchName'];
        addRouteFormChildTemplateCopy['transitPoints']['milestoneType']['value'] = viaPointdata['milestoneType'];
        addRouteFormChildTemplateCopy['transitPoints']['modeOfTransport']['value'] = viaPointdata['modeOfTransport'];
        addRouteFormChildTemplateCopy['transitPoints']['deliveryDay']['value'] = viaPointdata['deliveryDay'];

        if (viaPointdata['milestoneType'] === 'PICKUP') {
          addRouteFormChildTemplateCopy['transitPoints']['loadingTime']['value'] = viaPointdata['unloadingTime'];
          addRouteFormChildTemplateCopy['transitPoints']['loadingStartTimeWindow']['value'] = getFormattedDate(viaPointdata['startTime'], '')
          addRouteFormChildTemplateCopy['transitPoints']['loadingEndTimeWindow']['value'] =  getFormattedDate(viaPointdata['endTime'], '')

          addRouteFormChildTemplateCopy['transitPoints']['unloadingStartTimeWindow']['permission'] = false;
          addRouteFormChildTemplateCopy['transitPoints']['unloadingEndTimeWindow']['permission'] = false;

          addRouteFormChildTemplateCopy['transitPoints']['loadingTime']['permission'] = true;
          addRouteFormChildTemplateCopy['transitPoints']['loadingStartTimeWindow']['permission'] = true;
          addRouteFormChildTemplateCopy['transitPoints']['loadingEndTimeWindow']['permission'] = true;
        } else if (viaPointdata['milestoneType'] === 'DELIVER') {
          addRouteFormChildTemplateCopy['transitPoints']['unloadingTime']['value'] = viaPointdata['unloadingTime'];
          addRouteFormChildTemplateCopy['transitPoints']['unloadingStartTimeWindow']['value'] = getFormattedDate(viaPointdata['startTime'], '')
          addRouteFormChildTemplateCopy['transitPoints']['unloadingEndTimeWindow']['value'] = getFormattedDate(viaPointdata['endTime'], '')

          addRouteFormChildTemplateCopy['transitPoints']['unloadingTime']['permission'] = true;
          addRouteFormChildTemplateCopy['transitPoints']['unloadingStartTimeWindow']['permission'] = true;
          addRouteFormChildTemplateCopy['transitPoints']['unloadingEndTimeWindow']['permission'] = true;

          addRouteFormChildTemplateCopy['transitPoints']['loadingStartTimeWindow']['permission'] = false;
          addRouteFormChildTemplateCopy['transitPoints']['loadingEndTimeWindow']['permission'] = false;
        }
        res.childNodes.push(deepCopy(addRouteFormChildTemplateCopy));      
      };
      //keep the row number as key of the total result which will help to fetch the data based on row key instead of making an api call.
      setAddRouteForm(prevState => ({...prevState, ...{[row]:res}}));
    }
  } catch (error) {
    console.log(error);
  }
}

  const handleToggle = (accordionId: string, isExpanded?: boolean, key?: string) => {
    setExpanded(isExpanded ? accordionId : '')
   //check if row id already exists in the stored state(addRouteForm) to avoid extra api calls
    const keyExists = key in addRouteForm ? true : false
    isExpanded && !keyExists && handleRouteDetails(key) 
  } 

  return (
    <>
      <Modal
        open={isModalOpen}
        onToggle={() => setIsModalOpen(false)}
        width="calc(95vw - 20px)"
      >
        {{
          header: (
            <ModalHeader
              headerTitle={
                "Routes"
              }
              imageVariant="icomoon-close"
              width="calc(95vw - 20px)"
              handleClose={() => setIsModalOpen(false)}
            />
          ),

          content: (
            <StyledBox>
              {popupRouteDetails && popupRouteDetails?.length > 0 && popupRouteDetails.map((item, index) => {
                return (
                  <Accordion 
                    key={item?.routeConfigurationId} 
                    id={index.toString()} 
                    expanded={expanded === index.toString()} 
                    onToggle={(event, isExpanded) => handleToggle(index.toString(), isExpanded, item?.routeConfigurationId)}
                  >
                    {{
                      header: (
                        <>
                          <StyledHeaderContainer>
                            <div>
                              <StyledAccordionHeaderTitle>
                                {item?.routeName}
                              </StyledAccordionHeaderTitle>
                            </div>
                            <div>
                              <StyledSpan>
                                {item?.routeType}
                              </StyledSpan>
                            </div>
                          </StyledHeaderContainer>
                        </>
                      ),
                      content: (
                        <AccordionContent>
                          {addRouteForm[item?.routeConfigurationId]?.forwardRouteDetails ? (
                            <div className="mainSection">
                              <h4>Route Details</h4>
                              <div className="row mainSection">
                                {addRouteForm[item?.routeConfigurationId]?.forwardRouteDetails && Object.entries(addRouteForm[item?.routeConfigurationId]?.forwardRouteDetails).filter(([subKey]) => (
                                  !["deliveryOrder", "branchId", "milestoneType", "modeOfTransport", "deliveryDay", "unloadingStartTimeWindow", "unloadingEndTimeWindow", "unloadingTime", "loadingStartTimeWindow", "loadingEndTimeWindow", "loadingTime", "fromBranch"].includes(subKey)
                                )).map(([subKey, subValue], subIndex) => (
                                  <div key={subIndex} className="form">
                                    {subValue?.permission && subValue?.id !== "inTransitHubDTO" && (
                                      <StyledRouteDivider className={subValue?.id === "routeType" ? "col-md-9" : "col-md-3"} id={subValue.id}>
                                        {subValue?.permission && (subValue?.id == "deliveryType" || subValue?.id == "checkpointCodes") && (
                                          <>
                                            <StyledRouteValues>
                                              {subValue?.label}
                                            </StyledRouteValues>
                                            <StyledRouteValuesEllipsis title={`${subValue?.value}`}>
                                              {subValue?.value}
                                            </StyledRouteValuesEllipsis>
                                          </>
                                        )}
                                        {subValue?.permission && subValue?.id != "checkpointCodes" && subValue?.id != "deliveryType" && (
                                          <>
                                            <StyledRouteValues>
                                              {subValue?.label}
                                            </StyledRouteValues>
                                            <div className="route-values">
                                              {subValue?.value}
                                            </div>
                                          </>
                                        )}
                                        </StyledRouteDivider>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <h4>Milestones</h4>
                              {addRouteForm[item?.routeConfigurationId]?.forwardRouteDetails && <RouteDetailsTableView data={addRouteForm[item?.routeConfigurationId]} />}
                            </div>
                          ) : "Loading..."}
                        </AccordionContent>
                      )
                    }}
                  </Accordion>
                );
              })}
            </StyledBox>
          )
        }}
      </Modal>
    </>
  );
  
}

export default RoutesMappedPopupView