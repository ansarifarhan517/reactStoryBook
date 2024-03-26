import React, { Dispatch, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionHeaderTitle,
  AccordionHeaderSubTitle,
  Modal,
  Box,
  IconButton,
  ModalHeader,
  useToast,
} from "ui-library";
import MaxHaltTimeAccordion from "./MaxHaltTimeAccordion";
import { alertSettings } from "./AlertSettingsData";
import RestrictedAlertsAccordion from "./RestrictedAlertsAccordion";
import { useForm } from "react-hook-form";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { useDispatch } from "react-redux";
import { CheckpointsFormActions } from "../CheckpointsForm.actions";
import useClientProperties from "../../../common/ClientProperties/useClientProperties";
import moment from "moment";
import { AccordionWrapper, AlertWrapper } from "../CheckpointsFormStyledComponent";

const AlertSettingsModal = ({
  isAlertSettingsModal,
  setIsAlertSettingsModal,
  isCheckpointEditable,
  handleAlertCount,
  toggleState,
  dynamicLabels,
}) => {
  const alertsFormInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {},
  });
  const { handleSubmit, reset } = alertsFormInstance;
  const structure = useTypedSelector(
    (state) => state.checkpoints.form.alertFormStructure
  );
  const dispatch = useDispatch<Dispatch<CheckpointsFormActions>>();
  const { shiftTimings, checkpointData, saveAlertModalFlag, fleetTypeList, updatedToggleState,vehicleTypeList,fetchDropdownSuccessFlag } = useTypedSelector((state)=>state.checkpoints.form);
  const [errorMappingArray, setErrorMappingArray] = useState<any>([]);
  const toast = useToast();
  const [isFormValid, setIsFormValid] = useState(true);


  const prepareRestrictedFieldData = (alertParams) => {
    let result = {};
    alertParams?.forEach((pref, i) => {
      result = {
        ...result,
        [`fleetType${i}`] : (pref['fleetTypeIds'])?.map((fleetId)=> fleetTypeList?.find((fullList)=>fullList.id === fleetId))?.map((selectedFleet)=> {return {...selectedFleet , name: selectedFleet?.type, label: selectedFleet?.type}}),
        [`vehicleType${i}`]: Object.keys(pref['vehicleTypes'])?.map((vehicleId)=> vehicleTypeList?.find((fullList)=>fullList.id == vehicleId))?.map((selectedVehicle) => {return {...selectedVehicle, id: selectedVehicle?.name}})
      };
    });
    return result;
  };

  useEffect(() => {
    if(isCheckpointEditable && fetchDropdownSuccessFlag ) {
      const _dataToFill = prepareRestrictedFieldData(checkpointData?.alertParams);
      const [hrs, mins] =  checkpointData?.maxHaltTimeInHrsMins ? checkpointData?.maxHaltTimeInHrsMins?.split(":") : ["", ""];
     reset({..._dataToFill, hrs: hrs, mins: mins})
    }
  }, [isCheckpointEditable,checkpointData ,fetchDropdownSuccessFlag])

  const isValid = (filledTimings) => {
    const result = Object.values(filledTimings)?.map((prefs: any) => {
    return prefs?.map((timeSlot) => {
        let invalidEndTime = moment(timeSlot?.toValue).isSameOrBefore(timeSlot?.fromValue);
        return {
          startTime: {
            error: false,
            message: "",
          },
          endTime: {
            error: invalidEndTime,
            message: invalidEndTime ? (dynamicLabels.stopTimeMustBeAfterStartTime ? dynamicLabels.stopTimeMustBeAfterStartTime : "Stop Time Must be After Start Time") : "",
          },
        };
      });
    });

    const isValidTiming = Object.values(filledTimings)?.every((pref: any) => {
      return pref?.every(
        (timeSlot) => moment(timeSlot?.fromValue).isBefore(timeSlot?.toValue)
      );
    });

    return [isValidTiming, result];
  };

  const isTimingFilled = (filledTimings) => {
    const result = Object.values(filledTimings)?.map((prefs: any) => {
      return prefs && prefs?.map((timeSlot) => {
        return{
          startTime: {
            error: !timeSlot?.fromValue,
            message: !timeSlot?.fromValue ? (dynamicLabels.startTimeRequired ? dynamicLabels.startTimeRequired : "Start Time Required") : "",
          },
          endTime: {
            error: !timeSlot?.toValue,
            message: !timeSlot?.toValue ? (dynamicLabels.stopTimeRequired ? dynamicLabels.stopTimeRequired : "Stop Time Required") : "",
          },
        };
      });
    });

    const isTimingFilledBool = Object.values(filledTimings)?.every((pref: any) => {
      return pref?.every(
        (timeSlot) =>
          timeSlot?.toValue != undefined && timeSlot?.fromValue != undefined
      );
    });

    return [isTimingFilledBool, result];
  };

  const getFleetTypeIds = (fleetData) => {
    return fleetData?.map((data) => data?.id);
  };

  const getVehicleTypeIds = (vehicleData) => {
    return vehicleData?.reduce(
      (acc, selectedVehicle) => {
        return {
          ...acc,
          [selectedVehicle?.clientRefMasterId]:
            selectedVehicle?.name,
        };
      },
      {}
    )
  };

  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  const prepareTimingsPayload = (inputTimings: any) => {
    return inputTimings?.map((timings: any) => {
      return {
        startTime: moment
          .tz(timings?.fromValue, clientProperties?.TIMEZONE?.propertyValue)
          .utc()
          .format("HH:mm:ss"),
        endTime: moment
          .tz(timings?.toValue, clientProperties?.TIMEZONE?.propertyValue)
          .utc()
          .format("HH:mm:ss"),
      };
    });
  };

  const makeSaveAlertPayload = (filledData, filledShiftTimings, restrictedToggleState) => {
    let alertsPayloadData = Object.values(filledShiftTimings)?.map(
      (shiftTimings, i) => {
        const alertParams = {
          fleetGroupSequence: i + 1,
          fleetTypeIds: filledData?.[`fleetType${i}`] ? getFleetTypeIds(filledData?.[`fleetType${i}`]) : [],
          vehicleTypes: filledData?.[`vehicleType${i}`] ? getVehicleTypeIds(filledData?.[`vehicleType${i}`]) : {},
          timeSlots: prepareTimingsPayload(shiftTimings),
        };

        delete filledData?.[`fleetType${i}`];
        delete filledData?.[`vehicleType${i}`];
        return alertParams;
      }
    );
    return {
      alertsPayloadData: restrictedToggleState ? alertsPayloadData: [],
      ...filledData,
    };
  };

  const saveAlertsInfo = (data) => {
    if (toggleState?.restrictedTime) {
      if (Object.keys(shiftTimings)?.length) {
        if (isTimingFilled(shiftTimings)[0]) {
          if (isValid(shiftTimings)[0]) {
            // setIsAlertSettingsModal && setIsAlertSettingsModal(false);
            const alertsInfo = makeSaveAlertPayload(
              data,
              shiftTimings,
              toggleState?.restrictedTime
            );
            // Save manipulatedData in Redux
            dispatch({
              type: "@@checkpointsForm/SET_ALERTS_DATA",
              payload: alertsInfo,
            });

            dispatch({
              type: "@@checkpointsForm/UPDATE_TOOGLE_STATE",
              payload: toggleState,
            });
            handleAlertCount(toggleState);
            setErrorMappingArray([]); // Emptying Error State
            return true;
          } else {
            setErrorMappingArray(isValid(shiftTimings)[1]);
            return false;
          }
        } else {
          setErrorMappingArray(isTimingFilled(shiftTimings)[1]);
          return false;
        }
      } else {
        toast.add(
          dynamicLabels.noPreferenceSelectedError
            ? dynamicLabels.noPreferenceSelectedError
            : "Unable to Save. No preference selected for Restricted Time",
          "warning",
          false
        );
        return false;
      }
    } else {
      // setIsAlertSettingsModal && setIsAlertSettingsModal(false);
      const alertsInfo = makeSaveAlertPayload(
        data,
        shiftTimings,
        toggleState?.restrictedTime
      );
      dispatch({
        type: "@@checkpointsForm/SET_ALERTS_DATA",
        payload: alertsInfo,
      });
      dispatch({
        type: "@@checkpointsForm/UPDATE_TOOGLE_STATE",
        payload: toggleState,
      });
      handleAlertCount(toggleState);
      return true;
    }
  };

  const isMaxHaltValid = (data) => {
    if (parseInt(data?.hrs) === 0 && parseInt(data?.mins) === 0 && toggleState?.maximumHaltTime) {
      saveAlertsInfo(data);
      return;
    } else {
      saveAlertsInfo(data) ? setIsAlertSettingsModal && setIsAlertSettingsModal(false) : null;
      dispatch({
        type: "@@checkpointsForm/SET_SAVE_ALERT_MODAL_FLAG",
        payload: true,
      });
    }
  }

  return (
    <>
      <Modal open={isAlertSettingsModal} onToggle={() => {}} size="md">
        {{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels.alertPreferences ? dynamicLabels.alertPreferences : "Alert Preferences"}
              imageVariant="icomoon-close"
              handleClose={() => {
                for (let key in updatedToggleState) {
                  dispatch({
                    type: "@@checkpointsForm/SET_TOOGLE_STATE",
                    payload: { key: key, value: updatedToggleState[key] },
                  });
                }
                setIsAlertSettingsModal(false);
              }}
            />
          ),
          content: (
            <AlertWrapper>
              {alertSettings?.map((item) => {
                const accordionLabel = dynamicLabels?.[item.accordionLabelKey] ? dynamicLabels?.[item.accordionLabelKey] : item.fallbackAccordianLabel;
          
                if (item.fallbackLabel === "Maximum Halt Time") {
                  return (
                    <AccordionWrapper key={item.id}>
                      <MaxHaltTimeAccordion
                        data={item}
                        alertsFormInstance={alertsFormInstance}
                        structure={structure}
                        dispatch={dispatch}
                        toggleState={toggleState}
                        isCheckpointEditable={isCheckpointEditable}
                        updatedToggleState={updatedToggleState}
                        dynamicLabels={dynamicLabels}
                        setIsFormValid={setIsFormValid}
                      />
                    </AccordionWrapper>
                  );
                } else if (item.fallbackLabel === "Restricted Time") {
                  return (
                    <AccordionWrapper key={item.id}>
                      <RestrictedAlertsAccordion
                        data={item}
                        alertsFormInstance={alertsFormInstance}
                        structure={structure}
                        dispatch={dispatch}
                        toggleState={toggleState}
                        errorMappingArray={errorMappingArray}
                        isCheckpointEditable={isCheckpointEditable}
                        updatedToggleState={updatedToggleState}
                        dynamicLabels={dynamicLabels}
                      />
                    </AccordionWrapper>
                  );
                } else {
                  const toggleChecked = saveAlertModalFlag ? updatedToggleState?.[item.toggleLabelKey] : toggleState?.[item?.toggleLabelKey];
          
                  return (
                    <AccordionWrapper key={item.id}>
                      <Accordion
                        id={item.id}
                        onToggle={() => {}}
                        showToggleSwitch={true}
                        hideChevron={true}
                        isToggleChecked={toggleChecked}
                        onToggleSwitch={(toggleFlag) => {
                          dispatch({
                            type: "@@checkpointsForm/SET_TOOGLE_STATE",
                            payload: { key: item.toggleLabelKey, value: toggleFlag },
                          });
                        }}
                      >
                        {{
                          header: (
                            <>
                              <AccordionHeaderTitle>
                                {dynamicLabels?.[item.toggleLabelKey] ? dynamicLabels?.[item.toggleLabelKey] : item.fallbackLabel}
                              </AccordionHeaderTitle>
                              <AccordionHeaderSubTitle>
                                {accordionLabel}
                              </AccordionHeaderSubTitle>
                            </>
                          ),
                          content: (
                            <AccordionContent></AccordionContent>
                          ),
                        }}
                      </Accordion>
                    </AccordionWrapper>
                  );
                }
              })}
            </AlertWrapper>
          ),
          footer: (
            <Box
              horizontalSpacing="10px"
              display="flex"
              justifyContent="flex-end"
              p="15px"
            >
              <IconButton
                iconVariant="icomoon-tick-circled"
                primary
                onClick={handleSubmit((data) => {
                  isMaxHaltValid(data);
                })}
                id="checkpointsAlertsForm--actionBar--save"
              >
                {isCheckpointEditable
                  ? (dynamicLabels.update ? dynamicLabels.update : "Update")
                  : dynamicLabels.save ? dynamicLabels.save : "Save"}
              </IconButton>
              <IconButton
                iconVariant="icomoon-close"
                onClick={() => {
                  setIsAlertSettingsModal(false);
                  for (let key in updatedToggleState) {
                    dispatch({
                      type: "@@checkpointsForm/SET_TOOGLE_STATE",
                      payload: { key: key, value: updatedToggleState[key] },
                    });
                  }
                }}
                id="checkpointsAlertsForm--actionBar--cancel"
              >
                {dynamicLabels.cancel ? dynamicLabels.cancel : "Cancel"}
              </IconButton>
            </Box>
          ),
        }}
      </Modal>
    </>
  );
};

export default AlertSettingsModal;
