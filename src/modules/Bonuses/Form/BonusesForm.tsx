import React, { useEffect, Dispatch, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import FormField from "../../../utils/components/Form/FormField";
import { tGlobalToastActions } from "../../common/GlobalToasts/globalToast.reducer";
import FormLoader from "../../../utils/components/FormLoader";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { SectionHeaderContainer } from "../../../utils/components/Form/Form.styles";
import {
  typeFieldMappings,
  metricFieldMappings,
  useBreadCrumbs,
  isBeforeToday,
  getParsedDAFilter,
  manipulateStructure,
  setValueForFieldDependentOnCategory,
  preparePayload,
  getDateWithoutOffset,
} from "./FormUtils";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { IBonusFormActions } from "./BonusesForm.action";
import SlabField from "./Components/SlabModal";
import AdvancedFilterMasterCondition from "../../common/AdvancedFilterComponent/MasterCondition";

import {
  FormAdvancedFilterWrapper,
  FormFieldWrapper,
  FormWrapper,
  OverNightWrapper,
} from "./BonusesForm.styles";
import {
  BreadCrumb,
  Box,
  Card,
  Grid,
  SectionHeader,
  IconButton,
  useToast,
  IFilter,
} from "ui-library";
import Conditions from "../../common/AdvancedFilterComponent/Conditions";
import PrepColumnsData from "../../common/AdvancedFilterComponent/PrepColumnsData";
import ThirdElement from "./Components/AdvThirdElement";
import { withReactOptimized } from "../../../utils/components/withReact";
import {
  getQueryParams,
  hybridRouteTo,
  routeContains,
} from "../../../utils/hybridRouting";
import { getBaseCurrency } from "../../../utils/core";
import { sendGA } from "../../../utils/ga";
import moment from "moment";
import useClientProperties from "../../common/ClientProperties/useClientProperties";

const BonusesForm = () => {
  const toast = useToast();
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);

  const formDynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.payments.bonuses.form
  );
  const currencySymbol = "cur_symbol_" + getBaseCurrency();
  const commonDynamicLabels = useDynamicLabels(
    `${DYNAMIC_LABELS_MAPPING.payments.bonuses.common},${currencySymbol}`
  );

  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {},
  });

  // Checking if form is dirty
  console.log(formInstance.formState.isDirty);

  const { handleSubmit, watch, unregister, reset } = formInstance;
  const dispatch = useDispatch<Dispatch<IBonusFormActions>>();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();

  const [columnsData, setColumnsData] = useState({
    sortDropdown: [],
    columnStructure: [],
    HSetColumnStructure: {},
  });

  // Redux states
  const advancedFilterColumns = useTypedSelector(
    (state) => state.bonuses.form?.advancedFilterColumns?.columns
  );

  const isStructureLoading = useTypedSelector(
    (state) => state.bonuses.form.loading
  );
  const structure = useTypedSelector((state) => state.bonuses.form?.structure);
  const isUpdateForm = useTypedSelector(
    (state) => state.bonuses.form.isUpdateForm
  );

  const sectionsKeysArray = Object.keys(structure);
  const typeLookup = useTypedSelector(
    (state) => state.bonuses.form.lookup?.type
  );
  const categoryLookup = useTypedSelector(
    (state) => state.bonuses.form.lookup?.category
  );
  const metricLookup = useTypedSelector(
    (state) => state.bonuses.form.lookup?.metric
  );
  const weekdayLookup = useTypedSelector(
    (state) => state.bonuses.form.lookup?.eventDay
  );
  const paymentModeLookup = useTypedSelector(
    (state) => state.bonuses.form.lookup?.paymentMode
  );
  const skillSetLookup = useTypedSelector(
    (state) => state.bonuses.form.lookup?.skillSet
  );
  const givenBonusData = useTypedSelector(
    (state) => state.bonuses.form?.bonusIdData
  );
  const operations = useTypedSelector(
    (state) => state.advancedSearch?.operations
  );
  const DAFilter = useTypedSelector((state) => state.bonuses.form?.daFilter);
  const lookupObject = useTypedSelector((state) => state.bonuses.form?.lookup);
  const slabData = useTypedSelector((state) => state.bonuses.form?.slabData);

  const { breadCrumbOptions, onBreadCrumbClick } = useBreadCrumbs(
    formInstance,
    commonDynamicLabels
  );

  const [stepsToAutoAdd, setStepsToAutoAdd] = useState(1);
  const [localMetricValue, setLocalMetricValue] = useState(undefined);
  const [disableSave, setDisableSave] = useState(false);
  const [isOvernight, setIsOvernight] = useState(false);
  const [filterData, setFilterData] = useState<IFilter>({
    id: "",
    multiFilter: [],
    filterName: "",
    filterMasterCondition: givenBonusData?.DAFiltersOperationLogic
      ? givenBonusData?.DAFiltersOperationLogic
      : "AND",
    filterSortable: false,
    sortable: {
      columnName: "",
      sortOrder: "",
    },
    allowSort: false,
    filterApplied: false,
    advanceFilterTagReferenceIds: [],
  });

  const ThirdElementFormatter = (data: any) => {
    switch (data?.type) {
      case "calendar":
        return data?.value;
      default:
        return data?.value;
    }
  };

  const isLoading = React.useMemo(
    () => isStructureLoading,
    [isStructureLoading]
  ); // Todo: set this later

  /*****************     FUNCTIONS      *****************/
  const getDropDownOptions = {
    orderType: {
      PICKUP: "Pickup only",
      DELIVER: "Delivery only",
    },
    frequency: {
      Daily: "Daily",
      Weekly: "Weekly",
      Monthly: "Monthly",
      Custom: "Custom",
    },
    period: {
      Daily: "Day(s)",
      Weekly: "Week(s)",
      Monthly: "Month(s)",
    },
  };

  const generateDataToFill = (
    dataToFill: any,
    isUpdatePage: boolean,
    isCopyPage: boolean
  ) => {
    const {
      type,
      metric,
      bonusCriteria,
      frequency,
      period,
      everyTime,
      startDate,
      endDate,
      code,
      ...rest
    } = dataToFill;

    // Prepare data forehand to perfectly set data;
    const typeValue = typeLookup?.find((obj) => obj.clientRefMasterCd === type);
    const metricValue = metricLookup?.find(
      (obj) => obj.clientRefMasterCd === metric
    );
    const frequencyValue = Object.keys(getDropDownOptions?.frequency)?.find(
      (optionKey) => optionKey === frequency
    );
    const periodValue = Object.keys(getDropDownOptions?.period)?.find(
          (optionKey) => optionKey === period
        );

    const _dataToBeFilled = {
      code: isUpdatePage ? code : `${code}_1`,
      type: typeValue,
      metric: metricValue,
      frequency: frequencyValue,
      startDate:
        (isCopyPage && moment().isBefore(startDate)) || isUpdatePage
          ? getDateWithoutOffset(startDate)
          : undefined,
      endDate:
        (isUpdatePage || isCopyPage) && moment().isBefore(endDate)
          ? getDateWithoutOffset(endDate)
          : undefined,

      everyTime: frequencyValue === "Custom" ? everyTime : "",
      period: frequencyValue === "Custom" ? periodValue : "",
    };

    if (bonusCriteria?.length) {

      // generateCriteria
      // Bonus Criteria length that means 'category' || 'eventDay' || 'eventStartTime' || 'eventEndTime' values might be coming
      bonusCriteria?.forEach((criteriaObj) => {
        const fieldKey = criteriaObj.fieldKey;
        const value = criteriaObj.value;
        if (fieldKey === "eventStartTime" || fieldKey === "eventEndTime") {
          _dataToBeFilled[fieldKey] = moment(value, "HH:mm:ss")
            // .utc(value, "HH:mm:ss")
            // .tz(clientProperties?.TIMEZONE?.propertyValue)
            .toDate();
        } else if (fieldKey === "eventDay") {
          const daysInObjectArray = value?.split(",")?.map((currDay: any) => {
            return weekdayLookup?.find(
              (optionObj) => optionObj.name === currDay
            );
          });

          _dataToBeFilled[fieldKey] = daysInObjectArray;
        } else {
          // Set Category Field
          const categoryValue = categoryLookup?.find(
            (optionObj) => optionObj.clientRefMasterCd === fieldKey
          );
          if (categoryValue) {
            _dataToBeFilled["category"] = categoryValue;
          }

          // Set field that was selected in Category
          const [key, val] = setValueForFieldDependentOnCategory(
            categoryValue?.clientRefMasterCd,
            value,
            paymentModeLookup,
            skillSetLookup,
            getDropDownOptions?.orderType
          );

          _dataToBeFilled[key] = val;
        }
      });
    }
    Object.keys(rest)?.forEach((fieldKey: string) => {
      _dataToBeFilled[fieldKey] = rest[fieldKey];
    });

    return _dataToBeFilled;
  };

  const makeFieldsNonEditable = () => {
    if(Object.keys(structure)?.length){
      const disabledFieldsStructure = manipulateStructure(structure)
      dispatch({
        type: "@@bonuses/SET_FORM_STRUCTURE",
        payload: disabledFieldsStructure,
      });
    } 
  };

  const showHideFields = (
    sectionName: string,
    keysOfFieldsToShow: Array<string>,
    keyOfFieldsToHide: Array<string>,
  ) => {
    Object.keys(structure)?.length &&
      keysOfFieldsToShow &&
      keysOfFieldsToShow?.length &&
      keysOfFieldsToShow?.forEach((fieldKey) => {
        structure[sectionName][fieldKey].permission = true;
      });

    Object.keys(structure)?.length &&
      keyOfFieldsToHide &&
      keyOfFieldsToHide.length &&
      keyOfFieldsToHide?.forEach((fieldKey) => {
        structure[sectionName][fieldKey].permission = false;
        formInstance.setValue(fieldKey, "");
      });
  };

  const onSubmit = async (data: any) => {
    // If it is update form and user hasn't changed anything then disable save and redirect it to
    if (isUpdateForm && !formInstance.formState.isDirty) {
      setDisableSave(true);
      hybridRouteTo("bonuses");
    } else {
      const dateFormat = clientProperties?.DATEFORMAT?.propertyValue.toUpperCase();
      if (isBeforeToday(data?.startDate) && !isUpdateForm) {
        toast.add(
          `${formDynamicLabels?.startDateBeforeToday || "Start Date cannot be before"} ${moment().format(dateFormat)}`,
          "warning",
          false
        );
      } else if (isBeforeToday(data?.endDate)) {
        toast.add(
          `${formDynamicLabels?.endDateBeforeToday ||"End Date cannot be before"} ${moment().format(dateFormat)}`,
          "warning",
          false
        );
      } else if (data?.endDate < data?.startDate) {
        toast.add(
          formDynamicLabels?.startBeforeEndDate ||
            "Start Date must be before End Date",
          "warning",
          false
        );
      } else {
        const payload = preparePayload(data, DAFilter, slabData);
        await createUpdateBonusAPI(payload);
      }
    }
  };

  // Create Update Call
  const createUpdateBonusAPI = async (payload: any) => {
    //API call here;
    try {
      sendGA("Bonus Configuration", `${isUpdateForm ? "Update" : "Add"} Bonus`);
      setDisableSave(true);
      const { data: response } = await axios[isUpdateForm ? "put" : "post"](
        apiMappings.payments.bonuses[isUpdateForm ? "update" : "create"],
        payload
      );

      if (response.status === 200) {
        dispatch({
          type: "@@bonuses/SET_FORM_LOADING",
          payload: false,
        });
        if (isUpdateForm === true) {
          toastDispatch({
            type: "@@globalToast/add",
            payload: {
              message:
                response.message || formDynamicLabels?.[response.message], // update.bonusprofile.success
              icon: "check-round",
            },
          });
        }

        toastDispatch({
          type: "@@globalToast/add",
          payload: {
            message: response.message || formDynamicLabels[response.message], // create.bonusprofile.success
            icon: "check-round",
          },
        });
        hybridRouteTo("bonuses");
        setDisableSave(false);
      }
    } catch (err: any) {
      dispatch({
        type: "@@bonuses/SET_FORM_LOADING",
        payload: false,
      });
      toast.add(
        err?.response?.data?.message ||
          formDynamicLabels[err?.response?.data?.message] ||
          commonDynamicLabels.somethingWendWrong,
        "warning",
        false
      );
      setDisableSave(false);
    }
  }

  /******************     EFFECTS       ******************/
  useEffect(() => {
    // Fetch Structure if structure doesn't exists
    !sectionsKeysArray?.length &&
      dispatch({ type: "@@bonuses/FETCH_FORM_STRUCTURE" });
  }, [structure]);

  useEffect(() => {
    if (
      advancedFilterColumns &&
      Object.entries(advancedFilterColumns)?.length
    ) {
      const [sortDropdown, columnStructure, HSetColumnStructure]: any =
        PrepColumnsData(advancedFilterColumns);
      setColumnsData({
        sortDropdown: sortDropdown,
        columnStructure: columnStructure,
        HSetColumnStructure: HSetColumnStructure,
      });
    }
  }, [advancedFilterColumns]);

  const saveDAFiltersToRedux = (filterData: any) => {
    const DAFilterObject = getParsedDAFilter(filterData);

    dispatch({
      type: "@@bonuses/SET_DA_FILTER",
      payload: DAFilterObject,
    });
  };

  const fetchAndFillBonusData = async (
    bonusId: any,
    formTypeFlag: "update" | "copy"
  ) => {
    try {
      dispatch({
        type: "@@bonuses/SET_FORM_LOADING",
        payload: true,
      });
      const {
        data: { data },
      } = await axios.get(apiMappings.payments.bonuses.getDataByBonusID, {
        params: { profileId: bonusId },
      });
      dispatch({
        type: "@@bonuses/SET_SLAB_DATA",
        payload: data?.bonusRateDTOs,
      });
      saveDAFiltersToRedux(data?.daFilter);
      delete data?.daFilter;
      const _dataToFill = {
        ...generateDataToFill(
          data,
          formTypeFlag === "update",
          formTypeFlag === "copy"
        ),
      };
      reset({ ..._dataToFill });

      dispatch({
        type: "@@bonuses/SET_BONUSID_DATA",
        payload: _dataToFill,
      });

      dispatch({
        type: "@@bonuses/SET_FORM_LOADING",
        payload: false,
      });
    } catch (error: any) {
      toast.add("Error in fetching data for selected Row", "warning", false);
      return;
    }
  };

  useEffect(() => {
    // And fill all the fields with given data
    if (
      sectionsKeysArray?.length &&
      Object.keys(lookupObject)?.length === 6 &&
      !givenBonusData
    ) {
      const { bonusId } = getQueryParams();
      if (routeContains("copyBonus") && bonusId) {
        dispatch({
          type: "@@bonuses/SET_FORM_ISCOPY_FLAG",
          payload: true,
        });
        fetchAndFillBonusData(bonusId, "copy");
      } else if (routeContains("updateBonus") && bonusId) {
        makeFieldsNonEditable();
        dispatch({
          type: "@@bonuses/SET_FORM_ISUPDATE_FLAG",
          payload: true,
        });
        fetchAndFillBonusData(bonusId, "update");
      } else {
        dispatch({
          type: "@@bonuses/SET_FORM_ISUPDATE_FLAG",
          payload: false,
        });
        dispatch({
          type: "@@bonuses/SET_FORM_ISCOPY_FLAG",
          payload: false,
        });
      }
    }
  }, [lookupObject, structure]);

  useEffect(() => {
    // Removing effects on un-mounted components.
    return () => {
      console.log("Removing all the sectionFields here");
      sectionsKeysArray?.forEach((key) => {
        Object.keys(structure[key])?.forEach((fieldName) => {
          unregister(fieldName);
        });
      });

      dispatch({ type: "@@bonuses/RESET_TO_INITIAL_STATE" });
    };
  }, []);

  // All fields -> type, metric, category, skillSet, paymentMode, weight, volume, orderValue, bonusSlabs, frequency, everyTime, period, eventDay, eventStartTime, eventEndTime
  /***********     ADDING WATCHERS     ************/

  // type WATCHER
  useEffect(() => {
    const bonusTypeValue = watch("type")?.clientRefMasterCd || "reset";
    const frequencyValue = watch("frequency") || "reset";
    const fromVal = watch("eventStartTime") ? "exists" : "reset";
    const { show, hide } = typeFieldMappings(
      bonusTypeValue,
      frequencyValue,
      fromVal
    );

    showHideFields("bonusDetails", show, hide);
  }, [
    watch("type")?.clientRefMasterCd,
    watch("frequency"),
    watch("eventStartTime"),
  ]);

  // metric WATCHER
  useEffect(() => {
    const bonusMetricValue = watch("metric")?.clientRefMasterCd || "reset";
    setLocalMetricValue(bonusMetricValue);

    // Remove the Slab -> copy/updateForm and selectedMetricValue not equals fetchedMetricValue then flush slab data OR if it is a add form then flush data
    if (
      (givenBonusData && bonusMetricValue !== givenBonusData?.metric) ||
      routeContains("addBonus")
    ) {
      dispatch({
        type: "@@bonuses/SET_SLAB_DATA",
        payload: undefined,
      });
    }

    bonusMetricValue === "HOURS_ON_DUTY"
      ? setStepsToAutoAdd(0)
      : setStepsToAutoAdd(1);
  }, [watch("metric")?.clientRefMasterCd]);

  // category WATCHER
  useEffect(() => {
    const categoryValue = watch("category")?.clientRefMasterCd || "reset";
    const bonusMetricValue = watch("metric")?.clientRefMasterCd || "reset";
    const { show, hide } = metricFieldMappings(bonusMetricValue, categoryValue);
    showHideFields("bonusDetails", show, hide);
  }, [
    watch("metric")?.clientRefMasterCd,
    watch("category")?.clientRefMasterCd,
  ]);

  // eventStartTime, to WATCHER
  useEffect(() => {
    // If to value is less than eventStartTime value then make isOvernight flag true and then Overnight text should be visible.
    setIsOvernight(watch("eventEndTime") && (watch("eventStartTime") >= watch("eventEndTime")));
  }, [watch("eventStartTime"), watch("eventEndTime")]);

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
                          structure[sectionName][fieldKey].permission
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

                                    if (fieldName === "startDate" || fieldName === "endDate") {
                                      fieldStructure["minDate"] =
                                        new Date().toString();
                                    }

                                    if (fieldName == "orderType") {
                                      fieldStructure["dropdownValues"] =
                                        getDropDownOptions.orderType;
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
                                        {fieldStructure.fieldType ===
                                        "addSlabs" ? (
                                          <SlabField
                                            fieldName={fieldName}
                                            structure={fieldStructure}
                                            stepToAutoAdd={stepsToAutoAdd}
                                            metricValue={localMetricValue}
                                            formInstance={formInstance}
                                            commonDynamicLabels={
                                              commonDynamicLabels
                                            }
                                            currencySymbol={
                                              commonDynamicLabels[
                                                `${currencySymbol}`
                                              ]
                                            }
                                          />
                                        ) : fieldStructure.fieldType ===
                                          "time" ? (
                                          fieldName === "eventEndTime" ? (
                                            <>
                                              <FormFieldWrapper>
                                                <FormField
                                                  name={fieldName}
                                                  meta={fieldStructure}
                                                  formInstance={formInstance}
                                                  timeInterval={15}
                                                />
                                              </FormFieldWrapper>
                                              <OverNightWrapper>
                                                {isOvernight ? "Overnight" : ""}
                                              </OverNightWrapper>
                                            </>
                                          ) : (
                                            <FormFieldWrapper>
                                              <FormField
                                                name={fieldName}
                                                meta={fieldStructure}
                                                formInstance={formInstance}
                                                timeInterval={15}
                                              />
                                            </FormFieldWrapper>
                                          )
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

            {sectionsKeysArray?.length &&
            advancedFilterColumns &&
            Object.entries(advancedFilterColumns)?.length ? (
              <FormAdvancedFilterWrapper key="Condition">
                <SectionHeaderContainer>
                  <SectionHeader
                    headerTitle={
                      formDynamicLabels["conditions"]
                        ? formDynamicLabels["conditions"]
                        : "Conditions"
                    }
                  />
                </SectionHeaderContainer>
                <Grid container className={isUpdateForm ? "fade-overlay" : ""}>
                  <Grid item xs={12} sm={6}>
                    <>
                      <AdvancedFilterMasterCondition
                        condition={filterData.filterMasterCondition}
                        handleChange={(e: any) => {
                          setFilterData({
                            ...filterData,
                            filterMasterCondition: e,
                          });
                        }}
                      />
                      <Conditions
                        key={Object.keys(DAFilter)?.length}
                        ThirdElement={ThirdElement}
                        chipsArray={<></>}
                        fieldOperation={operations}
                        columnsData={columnsData?.columnStructure}
                        filterData={DAFilter}
                        onAddCondition={(data: any) => {
                          console.log("on Add condition", data);
                          dispatch({
                            type: "@@bonuses/SET_DA_FILTER",
                            payload: data,
                          });
                        }}
                        HSetColumnData={columnsData?.HSetColumnStructure}
                        ThirdElementFormatter={ThirdElementFormatter}
                      />
                    </>
                  </Grid>
                </Grid>
              </FormAdvancedFilterWrapper>
            ) : null}
          </div>
        )}

        {/* Action Buttons */}
        <Box horizontalSpacing="15px" display="flex" mt="30px">
          <IconButton
            iconVariant="icomoon-save"
            style={{ padding: "0px 15px" }}
            disabled={disableSave}
            onClick={handleSubmit(onSubmit)}
            primary
            id={`bonusForm--${isUpdateForm ? 'update' : routeContains('copyBonus') ? 'copy' : 'add'}--${isUpdateForm ? 'update' : 'save'}`}
          >
            {isUpdateForm ? formDynamicLabels.update : formDynamicLabels.save}
          </IconButton>
          <IconButton
            iconVariant="icomoon-close"
            style={{ padding: "0px 15px" }}
            disabled={isLoading}
            onClick={() => {
              onBreadCrumbClick();
            }}
            id={`bonusForm--${isUpdateForm ? 'update' : routeContains('copyBonus') ? 'copy' : 'add'}--cancel`}
          >
            {formDynamicLabels.cancel}
          </IconButton>
        </Box>
      </Card>
    </FormWrapper>
  );
};

export default withReactOptimized(BonusesForm);

