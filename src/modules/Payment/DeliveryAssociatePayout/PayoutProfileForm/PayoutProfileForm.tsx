import React, { useEffect, Dispatch, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import FormField from "../../../../utils/components/Form/FormField";
import { tGlobalToastActions } from "../../../common/GlobalToasts/globalToast.reducer";
import FormLoader from "../../../../utils/components/FormLoader";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { SectionHeaderContainer } from "../../../../utils/components/Form/Form.styles";
import {
  getDropDownOptions,
  showHideFieldMappings,
  useBreadCrumbs,
} from "./PayoutProfileForm.utils";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import axios from "../../../../utils/axios";
import apiMappings from "../../../../utils/apiMapping";

import { FormFieldWrapper, FormWrapper } from "./PayoutProfileForm.styles";
import {
  BreadCrumb,
  Box,
  Card,
  Grid,
  SectionHeader,
  IconButton,
  useToast,
} from "ui-library";
import { withReactOptimized } from "../../../../utils/components/withReact";
import { IPayoutFormActions } from "./Store/PayoutProfileForm.actions";
import {
  getQueryParams,
  hybridRouteTo,
  routeContains,
} from "../../../../utils/hybridRouting";
import moment from "moment";
import { sendGA } from "../../../../utils/ga";
import { deepCopy } from "../../../../utils/helper";
import useDebounce from "../../../../utils/useDebounce";

const PayoutProfileForm = ({ commonDynamicLabels }: any) => {
  const toast = useToast();
  const formDynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.payments.deliveryAssociatePayout.form
  );
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {},
  });

  // Checking if form is dirty
  console.log(formInstance.formState.isDirty);

  const { handleSubmit, watch, unregister, setValue, reset } = formInstance;
  const periodWatcher = useDebounce(watch("period", ""), 100);
  const frequencyWatcher = useDebounce(watch("frequency", ""), 100);

  const dispatch = useDispatch<Dispatch<IPayoutFormActions>>();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();

  // Redux states
  const isStructureLoading = useTypedSelector(
    (state) => state.deliveryAssociatePayout.form.loading
  );
  const structure = useTypedSelector(
    (state) => state.deliveryAssociatePayout.form?.structure
  );
  const isUpdateForm = useTypedSelector(
    (state) => state.deliveryAssociatePayout.form.isUpdateForm
  );
  const sectionsKeysArray = Object.keys(structure);
  const weekdayLookup = useTypedSelector(
    (state) => state.deliveryAssociatePayout.form.lookup?.day
  );
  const fetchedProfileData = useTypedSelector(
    (state) => state.deliveryAssociatePayout.form?.payoutIdData
  );
  const lookupObject = useTypedSelector(
    (state) => state.deliveryAssociatePayout.form?.lookup
  );

  const { breadCrumbOptions, onBreadCrumbClick } = useBreadCrumbs(
    formInstance
  );

  const [disableSave, setDisableSave] = useState(false);

  const isLoading = React.useMemo(
    () => isStructureLoading,
    [isStructureLoading]
  ); // Todo: set this later

  const getLabelForSelectedDay = (weekdayLookup, day) => {
    const weekdayVal = weekdayLookup?.find(
      (optionObj) => optionObj.name === day
    );
    return {...weekdayVal, name: weekdayVal?.clientRefMasterCd};
  }

  /*****************     FUNCTIONS      *****************/

  const generateDataToFill = (dataToFill: any) => {
    const { frequency, period, time, day, date, every, payoutProfileName } =
      dataToFill;

    const weekdayVal = getLabelForSelectedDay(weekdayLookup, day);
    const frequencyValue = Object.keys(getDropDownOptions?.frequency)?.find(
      (optionKey) => optionKey === frequency
    );
    const periodValue = Object.keys(getDropDownOptions?.period)?.find(
      (optionKey) => optionKey === period
    );

    const _formData = {
      frequency: frequencyValue,
      payoutProfileName: payoutProfileName,
    };

    if (frequencyValue === "Custom") {
      _formData["every"] = every;
      _formData["period"] = periodValue;

      switch (period) {
        case "Daily":
          _formData["time"] = moment(time, "HH:mm:ss").toDate();
          break;
        case "Weekly":
          _formData["day"] = weekdayVal;
          break;
        case "Monthly":
          _formData["date"] = date.toString();
          break;
        default:
          break;
      }
    } else {
      switch (frequencyValue) {
        case "Daily":
          _formData["time"] = moment(time, "HH:mm:ss").toDate();
          break;

        case "Weekly":
          _formData["day"] = weekdayVal;
          break;

        case "Monthly":
          _formData["date"] = date.toString();
          break;

        default:
          break;
      }
    }
    return _formData;
  };

  const makeFieldsNonEditable = (editableField: string, structure: any) => {
    const tempStructure = deepCopy(structure);
    if (Object.keys(tempStructure)?.length) {
      Object.entries(tempStructure)?.forEach(([sectionKey, fieldsObj]: any) => {
        Object.keys(fieldsObj)
          ?.filter((fieldKey: string) => fieldKey !== editableField)
          ?.forEach((fieldKey) => {
            if (fieldKey === "time") {
              tempStructure[sectionKey][fieldKey][
                "ShiftStartEndTimeVisiblity"
              ] = true; // TODO: This is a generic Logic change this
            } else {
              tempStructure[sectionKey][fieldKey].editable = false;
            }
          });
      });
    }
    return tempStructure;
  };

  const showHideFields = (
    sectionName: string,
    keysOfFieldsToShow: Array<string>,
    keyOfFieldsToHide: Array<string>
  ) => {
    const tempStructure = deepCopy(structure);
    Object.keys(tempStructure)?.length &&
      keysOfFieldsToShow &&
      keysOfFieldsToShow?.length &&
      keysOfFieldsToShow?.forEach((fieldKey) => {
        tempStructure[sectionName][fieldKey].permission = true;
      });

    Object.keys(tempStructure)?.length &&
      keyOfFieldsToHide &&
      keyOfFieldsToHide.length &&
      keyOfFieldsToHide?.forEach((fieldKey) => {
        tempStructure[sectionName][fieldKey].permission = false;
        !isUpdateForm && setValue(fieldKey, undefined);
        formInstance.clearErrors(fieldKey);
      });

    dispatch({
      type: "@@PAYOUTS/SET_FORM_STRUCTURE",
      payload: tempStructure,
    });
  };

  const fetchPayoutData = async (profileId: number) => {
    try {
      const {
        data: { data },
      } = await axios.get(apiMappings.payments.deliveryAssociatePayout.getById, {
        params: { profileId: profileId },
      });
      return data;
    } catch (error: any) {
      toast.add(
        error?.response?.data?.message || formDynamicLabels.somethingWendWrong,
        "warning",
        false
      );
      return;
    }
  };

  const getKeyForSelectedDay = (weekdayLookup, dayLabel) => {
    return weekdayLookup?.find(dayObj => dayObj?.name === dayLabel)?.key
  }

  const onSubmit = async (data: any) => {
    sendGA(
      "Payout Configuration",
      `${isUpdateForm ? "Update" : "Add"} Payout Profile`
    );
    const payload = {
      ...data,
      day: data?.day ? isUpdateForm ? getKeyForSelectedDay(weekdayLookup, data?.day.name) : data?.day.name : undefined,
      time: data?.time ? moment(data?.time).format("HH:mm:ss") : undefined, // clientProperties?.TIMEZONE?.propertyValue
      id: isUpdateForm ? fetchedProfileData?.id : ""
    };
    try {
      setDisableSave(true);
      const { data: response } = await axios[isUpdateForm ? "put" : "post"](
        apiMappings.payments.deliveryAssociatePayout[
          isUpdateForm ? "update" : "create"
        ],
        payload
      );

      if (response.status === 200) {
        dispatch({
          type: "@@PAYOUTS/SET_FORM_LOADING",
          payload: false,
        });
        if (isUpdateForm === true) {
          toastDispatch({
            type: "@@globalToast/add",
            payload: {
              message: formDynamicLabels?.bonusUpdatedSuccessfully,
              icon: "check-round",
            },
          });
        }

        toastDispatch({
          type: "@@globalToast/add",
          payload: {
            message: response.message,
            icon: "check-round",
          },
        });
        hybridRouteTo("payouts");
        setDisableSave(false);
      }
    } catch (err: any) {
      dispatch({
        type: "@@PAYOUTS/SET_FORM_LOADING",
        payload: false,
      });
      toast.add(
        err?.response?.data?.error?.message?.[0] ||
          err?.response?.data?.message ||
          commonDynamicLabels.somethingWendWrong,
        "warning",
        false
      );
      setDisableSave(false);
    }
  };

  /******************     EFFECTS       ******************/
  useEffect(() => {
    // Fetch Structure if structure doesn't exists
    !sectionsKeysArray?.length &&
      dispatch({ type: "@@PAYOUTS/FETCH_FORM_STRUCTURE" });
  }, [structure]);

  useEffect(() => {
    (async () => {
      if (sectionsKeysArray?.length && Object.keys(lookupObject)?.length && !fetchedProfileData) {
        const { payoutId } = getQueryParams();
        if (routeContains("updatePayout") && payoutId) {
          dispatch({
            type: "@@PAYOUTS/SET_FORM_ISUPDATE_FLAG",
            payload: true,
          });
          dispatch({type: "@@PAYOUTS/SET_FORM_LOADING", payload: true})
          const responseData = await fetchPayoutData(payoutId);
          dispatch({type: "@@PAYOUTS/SET_PAYOUT_ID_DATA", payload: responseData})
          const dataToFill = generateDataToFill(responseData);
          reset({ ...dataToFill });
          dispatch({type: "@@PAYOUTS/SET_FORM_LOADING", payload: false})
        } else {
          dispatch({
            type: "@@PAYOUTS/SET_FORM_ISUPDATE_FLAG",
            payload: false,
          });
        }
      }
    })();
  }, [lookupObject, structure]);

  useEffect(() => {
    const modifiedStructure = makeFieldsNonEditable(
      "payoutProfileName",
      structure
    );
    Object.keys(structure)?.length &&
      dispatch({
        type: "@@PAYOUTS/SET_FORM_STRUCTURE",
        payload: modifiedStructure,
      });
  }, [fetchedProfileData]);

  useEffect(() => {
    // Removing effects on un-mounted components.
    return () => {
      console.log("Removing all the sectionFields here");
      sectionsKeysArray?.forEach((key) => {
        Object.keys(structure[key])?.forEach((fieldName) => {
          unregister(fieldName);
        });
      });

      dispatch({ type: "@@PAYOUTS/RESET_TO_INITIAL_STATE" });
    };
  }, []);

  // All fields -> name, frequency, period, every, day, time, date
  /***********     ADDING WATCHERS     ************/

  // frequency WATCHER
  useEffect(() => {
    const freqVal = frequencyWatcher || "reset";
    const periodVal = periodWatcher || "reset";
    const { show, hide } = showHideFieldMappings(freqVal, periodVal);
    showHideFields("payoutDetails", show, hide);
  }, [frequencyWatcher, periodWatcher]);

  const dateOptions = () => {
    let countTill = 29;
    const mapper = {};
    for (let i = 1; i < countTill; i++) {
      mapper[i] = i.toString();
    }
    return mapper;
  };

  return (
    <FormWrapper>
      <div id="toast-inject-here" />
      <Box pt="15px" pb="22px">
        <BreadCrumb options={breadCrumbOptions} onClick={onBreadCrumbClick} />
      </Box>
      <Card
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "white",
        }}
      >
        {isLoading ? (
          <FormLoader />
        ) : (
          <div>
            {sectionsKeysArray?.length
              ? sectionsKeysArray?.map((sectionName) => {
                  return (
                    <div className={`${sectionName}-section`} key={sectionName}>
                      {Object.keys(structure[sectionName])?.some(
                        (fieldKey) =>
                          structure[sectionName][fieldKey]?.permission
                      ) ? (
                        <>
                          <SectionHeaderContainer>
                            <SectionHeader
                              headerTitle={formDynamicLabels[sectionName]}
                            />
                          </SectionHeaderContainer>

                          <Grid
                            container
                            spacing="10px"
                            style={{ marginBottom: "15px" }}
                          >
                            {Object.keys(structure[sectionName])
                              ? Object.keys(structure[sectionName])?.map(
                                  (fieldName: string) => {
                                    const fieldStructure =
                                      structure[sectionName][fieldName];
                                    const { permission } = fieldStructure;

                                    if (fieldName == "frequency") {
                                      fieldStructure["dropdownValues"] =
                                        getDropDownOptions.frequency;
                                      fieldStructure["customField"] = true;
                                    }

                                    if (fieldName == "period") {
                                      fieldStructure["dropdownValues"] =
                                        getDropDownOptions.period;
                                      fieldStructure["customField"] = true;
                                    }

                                    if (fieldName == "date") {
                                      fieldStructure["dropdownValues"] =
                                        dateOptions();
                                      fieldStructure["customField"] = true;
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
                                        {fieldStructure.fieldType === "time" ? (
                                          <FormFieldWrapper>
                                            <FormField
                                              name={fieldName}
                                              meta={fieldStructure}
                                              formInstance={formInstance}
                                              timeInterval={15}
                                            />
                                          </FormFieldWrapper>
                                        ) : (
                                          <FormFieldWrapper
                                            isDisabled={
                                              !fieldStructure.editable
                                            }
                                          >
                                            <FormField
                                              name={fieldName}
                                              meta={fieldStructure}
                                              formInstance={formInstance}
                                              isSortable={!(fieldName === "day")}
                                            />
                                          </FormFieldWrapper>
                                        )}
                                      </Grid>
                                    );
                                  }
                                )
                              : null}
                          </Grid>
                        </>
                      ) : null}
                    </div>
                  );
                })
              : null}
          </div>
        )}
        
        {/* Action Buttons */}
        <Box horizontalSpacing="15px" display="flex" mt="30px">
          <IconButton
            iconVariant="icomoon-save"
            id={`payoutForm--${isUpdateForm ? 'update' : 'add'}--${isUpdateForm ? 'update' : 'save'}`}
            style={{ padding: "0px 15px" }}
            disabled={disableSave}
            onClick={handleSubmit(onSubmit)}
            primary
          >
            {isUpdateForm ? formDynamicLabels.update : formDynamicLabels.save}
          </IconButton>
          <IconButton
            iconVariant="icomoon-close"
            id={`payoutForm--${isUpdateForm ? 'update' : 'add'}--cancel`}
            style={{ padding: "0px 15px" }}
            disabled={isLoading}
            onClick={() => {
              sendGA(
                "Payout Configuration",
                `Cancel - ${
                  isUpdateForm ? "Update" : "Add"
                } Payout Profile From`
              );
              onBreadCrumbClick();
            }}
          >
            {formDynamicLabels.cancel}
          </IconButton>
        </Box>
      </Card>
    </FormWrapper>
  );
};

export default withReactOptimized(PayoutProfileForm);
