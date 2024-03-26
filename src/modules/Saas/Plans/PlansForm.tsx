import React, { useEffect, Dispatch, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BreadCrumb,
  Box,
  Card,
  Grid,
  SectionHeader,
  IconButton,
  useToast,
} from "ui-library";
import uuid from "uuid";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import {
  hybridRouteTo,
  routeContains,
  getQueryParams,
} from "../../../utils/hybridRouting";
import { useDispatch } from "react-redux";
import {
  IAddOn,
  IPlansForm,
  IPlansFormActions,
  ITable,
  IZohoAddon,
  tShowHide,
} from "./PlansForm.model";
import FormField from "../../../utils/components/Form/FormField";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import {
  useGoogleAnalytics,
  useBreadCrumbs,
  setPlanData,
  summaryKeysWithCurrency,
  createOneTimeAddOn,
  createRecurringAddOn,
  getBillingFrequency,
  getPincode,
  createSchedulePlan,
  createScheduleAddon,
  resetAddressFieldOnCountryChange,
  setInternalUsers,
} from "./PlansForm.utils";
import moment from "moment-timezone";
import { SectionHeaderContainer, PlansFormWrapper } from "./PlansForm.styles";
import useClientProperties from "../../common/ClientProperties/useClientProperties";
import { tGlobalToastActions } from "../../common/GlobalToasts/globalToast.reducer";
import FormLoader from "../../../utils/components/FormLoader";
import withReact from "../../../utils/components/withReact";
import { getBaseCurrency } from "../../../utils/core";
import AccordionSection from "./Accordion/AccordionSection";
import {
  checkValidationInEditMode,
  gerateAccordionData,
  PlanList,
} from "./PlanData";
import {
  IMongoField,
  IMongoFormStructure,
} from "../../../utils/mongo/interfaces";
import EditModePopup from "./Popups/EditModePopup";
import { NewChanges } from "./Popups/ViewChanges";

const currencySymbol = "cur_symbol_" + getBaseCurrency();

const PlansForm = () => {
  /** General Hooks */
  const toast = useToast();

  const dynamicLabels = useDynamicLabels(
    `${DYNAMIC_LABELS_MAPPING.saas.plans},${currencySymbol}`
  );
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
  });
  console.log(formInstance.formState.isDirty); // make sure formState is read before render to enable the Proxy
  const { handleSubmit, unregister, watch, setValue, setError, getValues } = formInstance;
  const { gaOnSubmit, gaOnCancel } = useGoogleAnalytics();
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  const { breadCrumbOptions, handleBreadCrumbClick } =
    useBreadCrumbs(formInstance);

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IPlansFormActions>>();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();

  const storeState = useTypedSelector((state) => state.saas.plans);
  const {
    structure,
    isEditMode,
    plansData,
    selectedPlan,
    sectionData,
    billingCurrency,
    rowWiseTierData,
    planNameMapping,
    zohoAddons,
    gstStructure,
    plansDetails,
    addonTierData,
    selectedPlanRow,
    isContinue,
    currencySign,
    scheduledChangesDiscardPopup,
    billingFrequencyMap,
    parentSubscriptionId
  } = storeState;
  const isStructureLoading = storeState?.loading;
  const scheduledZohoAddons = plansData?.scheduledChanges?.zohoAddonDTOs;
  const sectionKeys = Object.keys(structure);

  /** Internal State */
  const [isPlansDataLoading, setIsPlansDataLoading] = useState<boolean>(false);
  const [isHubSpotDetailsLoading, setIHubSpotDetailsLoading] =
    useState<boolean>(false);
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const [addOnList, setAddOnList] = useState<any>({
    oneTimeAddOn: [],
    recurringAddOn: [],
  });
  const [addonNameMapping, setAddonNameMapping] = useState<
    { [key: string]: string } | undefined
  >({});

  const [shareSubscriptionLocalState, setShareSubscriptionLocalState] = useState(false);
  const isLoading = React.useMemo(
    () => isStructureLoading || isPlansDataLoading,
    [isStructureLoading, isPlansDataLoading]
  );

  // Watchers
  const watchAllFields = watch();
  const billingCurrencyWatcher = watch("billingCurrency", "");
  const billingFrequencyWatcher = watch("billingFrequency", "");
  const refreshWatch = watch("refresh", false);
  const signUpType = formInstance.getValues().signUpType;

  useEffect(() => {
    if (billingCurrency && billingCurrencyWatcher?.name) {
      setValue(
        "billingCurrency",
        billingCurrency?.[billingCurrencyWatcher?.name]
      );
      dispatch({
        type: "@@plansForm/SET_CURRENCY_SIGN",
        payload: billingCurrencyWatcher?.name === "USD" ? "$" : "₹",
      });
    }
  }, [billingCurrency, billingCurrencyWatcher?.name]);

  useEffect(() => {
    return () => {
      sectionKeys.forEach((key) => {
        Object.keys(structure[key]).forEach((fieldName) => {
          unregister(fieldName);
        });
      });

      dispatch({ type: "@@plansForm/RESET_INITIAL_STATE" });
    };
  }, []);

  useEffect(() => {
    if (billingFrequencyWatcher?.name) {
      dispatch({
        type: "@@plansForm/SET_BILLING_CYCLE",
        payload: billingFrequencyWatcher?.name,
      });
    }
  }, [billingFrequencyWatcher?.name]);

  useEffect(() => {
    if (refreshWatch && (!isEditMode || plansData?.planType === "TRIAL")) {
      if (watchAllFields.hubspotDealId) {
        formInstance.clearErrors();
        getHubSpotDetails();
      } else {
        setDetails({});
        setError("hubspotDealId", {
          message: "Please enter valid hub spot deal Id",
          type: "max",
        });
      }

      setValue("refresh", false);
    }
  }, [refreshWatch]);

  useEffect(() => {
    if (
      billingCurrencyWatcher.name &&
      billingFrequencyWatcher.name &&
      selectedPlan &&
      plansDetails
    ) {
      getAddOnList();
    }
  }, [
    selectedPlan,
    billingCurrencyWatcher?.name,
    billingFrequencyWatcher?.name,
    plansDetails,
    scheduledZohoAddons,
    currencySign,
  ]);

  useEffect(() => {
    if (!isEditMode) {
      dispatch({ type: "@@plansForm/SET_SECTION_DATA", payload: {} });
    }
    getPlan();
  }, [
    billingCurrencyWatcher?.name,
    billingFrequencyWatcher?.name,
    watchAllFields.subscriptionType,
    isEditMode,
    plansData?.scheduledChanges,
    plansData?.product,
  ]);

  useEffect(() => {
    if (Object.values(structure).length) {
      const structureSummary = {};
      Object.values(structure?.summary).forEach((summaryField: IMongoField) => {
        if (summaryKeysWithCurrency.includes(summaryField.fieldName)) {
          const label = summaryField.label.split("(");
          structureSummary[summaryField.fieldName] = {
            ...summaryField,
            label: `${label[0]}${billingCurrencyWatcher?.name === "USD" ? "($)" : "(₹)"
              }`,
          };
        } else {
          structureSummary[summaryField?.fieldName] = { ...summaryField };
        }
      });
      dispatch({
        type: "@@plansForm/SET_STRUCTURE",
        payload: { ...structure, summary: structureSummary },
      });
    }
  }, [billingCurrencyWatcher?.name]);

  useEffect(() => {
    if (
      !isEditMode ||
      (isEditMode && watchAllFields.billingCurrency === undefined) ||
      watchAllFields.billingCurrency === ""
    ) {
      if (watchAllFields.legalDocs === "LogiNext") {
        setValue("billingCurrency", billingCurrency?.["USD"]);
      } else if (watchAllFields.legalDocs === "LogiSprint") {
        setValue("billingCurrency", billingCurrency?.["INR"]);
      }
    }
  }, [watchAllFields.legalDocs]);

  useEffect(() => {
    if (Object.values(structure).length) {
      const newStruct = structure;
      if (
        watchAllFields.businessType === "business_none" ||
        watchAllFields.businessType === undefined ||
        watchAllFields.businessType === ""
      ) {
        if (newStruct.organizationDetails?.gst_no) {
          delete newStruct.organizationDetails?.gst_no;
        }
      } else {
        if (!newStruct?.organizationDetails?.gst_no && gstStructure) {
          let isBusinessType = false;
          const newOrg: any = {};
          Object.values(newStruct?.organizationDetails).forEach(
            (organization: IMongoField) => {
              if (organization.fieldName === "businessType") {
                isBusinessType = true;
              }
              newOrg[organization.fieldName] = organization;
              if (isBusinessType) {
                isBusinessType = false;
                newOrg.gst_no = gstStructure;
              }
            }
          );
          newStruct.organizationDetails = newOrg;
        }
      }
      dispatch({ type: "@@plansForm/SET_STRUCTURE", payload: newStruct });
    }
  }, [watchAllFields.businessType]);

  useEffect(() => {
    const oneTimeAddOn = sectionData?.oneTimeAddOn;
    const planDetails = sectionData?.planDetails;
    const recurringAddOn = sectionData?.recurringAddOn;
    if (sectionData && oneTimeAddOn && planDetails && recurringAddOn) {
      let oneTimeSms = { limit: 0, price: 0 },
        oneTimeEmail = { limit: 0, price: 0 },
        oneTimeIvr = { limit: 0, price: 0 },
        recurringSms = { limit: 0, price: 0 },
        recurringEmail = { limit: 0, price: 0 },
        recurringIvr = { limit: 0, price: 0 },
        orderOneTime = { limit: 0, price: 0 };

      Object.values(oneTimeAddOn).forEach((oneTimeEntry) => {
        const addOnName = oneTimeEntry[0]?.value;
        const numberOFTransaction = oneTimeEntry[2]?.value;
        const price = oneTimeEntry?.find(
          (recurr: { id: string }) => recurr.id === "price"
        )?.value;
        if (
          addOnName &&
          (PlanList[addOnName] === "email" ||
            addOnName.toLowerCase().includes("email")) &&
          numberOFTransaction
        ) {
          oneTimeEmail = { ...oneTimeEmail, price: oneTimeEmail.price + price };
          oneTimeEmail = {
            ...oneTimeEmail,
            limit: oneTimeEmail.limit + Number(numberOFTransaction),
          };
        } else if (
          addOnName &&
          (PlanList[addOnName] === "sms" ||
            addOnName.toLowerCase().includes("sms")) &&
          numberOFTransaction
        ) {
          oneTimeSms = { ...oneTimeSms, price: oneTimeSms.price + price };
          oneTimeSms = {
            ...oneTimeSms,
            limit: oneTimeSms.limit + Number(numberOFTransaction),
          };
        } else if (
          addOnName &&
          PlanList[addOnName] === "ivr" &&
          numberOFTransaction
        ) {
          oneTimeIvr = { ...oneTimeIvr, price: oneTimeIvr.price + price };
          oneTimeIvr = {
            ...oneTimeIvr,
            limit: oneTimeIvr.limit + Number(numberOFTransaction),
          };
        } else if (
          addOnName &&
          PlanList[addOnName] === "order" &&
          numberOFTransaction
        ) {
          orderOneTime = { ...orderOneTime, price: orderOneTime.price + price };
          orderOneTime = {
            ...orderOneTime,
            limit: orderOneTime.limit + Number(numberOFTransaction),
          };
        }
      });

      Object.values(recurringAddOn).forEach((recurringEntry) => {
        const addOnName = recurringEntry[0]?.value;
        const numberOFTransaction = recurringEntry[1]?.value;
        const price = recurringEntry?.find(
          (recurr: { id: string }) => recurr.id === "price"
        )?.value;
        if (
          addOnName &&
          (PlanList[addOnName] === "email" ||
            addOnName.toLowerCase().includes("email")) &&
          numberOFTransaction
        ) {
          recurringEmail = {
            ...recurringEmail,
            price: recurringEmail.price + price,
          };
          recurringEmail = {
            ...recurringEmail,
            limit: recurringEmail.limit + Number(numberOFTransaction),
          };
        } else if (
          addOnName &&
          (PlanList[addOnName] === "sms" ||
            addOnName.toLowerCase().includes("sms")) &&
          numberOFTransaction
        ) {
          recurringSms = { ...recurringSms, price: recurringSms.price + price };
          recurringSms = {
            ...recurringSms,
            limit: recurringSms.limit + Number(numberOFTransaction),
          };
        } else if (
          addOnName &&
          PlanList[addOnName] === "ivr" &&
          numberOFTransaction
        ) {
          recurringIvr = { ...recurringIvr, price: recurringIvr.price + price };
          recurringIvr = {
            ...recurringIvr,
            limit: recurringIvr.limit + Number(numberOFTransaction),
          };
        }
      });
      setValue("onetimeAddonSmsLimit", oneTimeSms.limit);
      setValue("smsOneTimeAddOnPrice", Number(oneTimeSms.price).toFixed(3));
      setValue("onetimeAddonEmailLimit", oneTimeEmail.limit);
      setValue("emailOneTimeAddOnPrice", Number(oneTimeEmail.price).toFixed(3));
      setValue("onetimeAddonIvrLimit", oneTimeIvr.limit);
      setValue("ivrOneTimeAddOnPrice", Number(oneTimeIvr.price).toFixed(3));
      setValue("smsLimit", recurringSms.limit);
      setValue("smsRecurringAddOnPrice", Number(recurringSms.price).toFixed(3));
      setValue("emailLimit", recurringEmail.limit);
      setValue(
        "emailRecurringAddOnPrice",
        Number(recurringEmail.price).toFixed(3)
      );
      setValue("ivrLimit", recurringIvr.limit);
      setValue("ivrRecurringAddOnPrice", Number(recurringIvr.price).toFixed(3));
      setValue("onetimeAddonOrderLimit", orderOneTime.limit);
      setValue("orderOneTimeAddOnPrice", Number(orderOneTime.price).toFixed(3));
    }
  }, [sectionData]);

  /** Watchers */
  useEffect(() => {
    if (clientProperties?.TIMEZONE && !plansData) {
      const { clientId, zohoSubscriptionId } = getQueryParams();
      const isEditMode = !!( routeContains("updateClient") && clientId);
      dispatch({ type: "@@plansForm/SET_EDIT_MODE", payload: isEditMode });
      if (!sectionKeys.length) {
        dispatch({ type: "@@plansForm/FETCH_STRUCTURE" });
      }
      if (isEditMode && billingCurrency && zohoSubscriptionId) {
        dispatch({ type: "@@plansForm/SET_EDIT_MODE", payload: true });
        fetchPlansData(clientId, zohoSubscriptionId);
      }
      // If there is no zohoSubscriptionId in QueryParam and it is an update form that means this is a Child client with shared sub., 
      // Thus, we have to send empty string to backend for fetching details for update form for clientChild with shared sub.
      if(isEditMode && !zohoSubscriptionId){
        const tempSubscriptionId = "";
        dispatch({ type: "@@plansForm/SET_EDIT_MODE", payload: true });
        fetchPlansData(clientId, tempSubscriptionId);
      }
      if (!isEditMode) {
        if (billingCurrency) {
          setValue("billingCurrency", billingCurrency?.["USD"]);
        }
        setValue("subscriptionType", "deliveryAssociates");
        setValue("legalDocs", "LogiNext");
        setValue("sendActivationLink", "Before Payment");
        setValue("subscriptionActivationDate", new Date());
        setValue("productActivationDate", new Date());
        // By default set the signUpType to Enterprise
        setValue("signUpType", { "clientRefMasterId": 14211, "clientRefMasterType": "SIGNUPTYPE", "clientRefMasterCd": "ENTERPRISE", "clientRefMasterDesc": "ENTERPRISE", "clientId": 0, "isDeleteFl": "N", "id": 14211, "name": "ENTERPRISE", "sequence": 2 })
      }
    }
  }, [clientProperties, billingCurrency]);

  // Watcher for Link To Parent Entity toggle
  useEffect(() => {
    updateStructureForLinkToParentEntity(watchAllFields.linkToParentEntity);
  }, [watchAllFields.linkToParentEntity]);

  // Watcher for Share subscription toggle
  useEffect(() => {
    const shareSubscroptionValue = watchAllFields.shareSubscription;
    updateStructureForShareSubscription(shareSubscroptionValue);
    // Fetch the subscriptionId for the selected Parent Client
    const linkToParentEntityValue = getValues("linkToParentEntity");
    const selectedParentEntity = getValues("parentEntityName")
    if (selectedParentEntity && shareSubscroptionValue === "Y" && !isEditMode) {
      fetchParentSubcriptionId(selectedParentEntity?.clientId);
    } else if (linkToParentEntityValue === "Y" && !selectedParentEntity) {
      setValue("shareSubscription", "N");
      toast.add("Please select Parent Entity Name to enable Share Subscription", "warning", false);
    }
  }, [watchAllFields.shareSubscription, watchAllFields.parentEntityName, isEditMode]);

  useEffect(() => {
    if (
      plansData?.paymentTerms &&
      structure?.subscriptionDetails?.paymentTerms?.dropdownValues
    ) {
      const dropdownValues =
        structure?.subscriptionDetails?.paymentTerms?.dropdownValues;
      const struct = { ...structure };
      struct.subscriptionDetails.paymentTerms = {
        ...struct.subscriptionDetails.paymentTerms,
        dropdownValues: {
          ...dropdownValues,
          [plansData?.paymentTerms]: `Net ${plansData?.paymentTerms}`,
        },
      };
      dispatch({ type: "@@plansForm/SET_STRUCTURE", payload: struct });
    }
  }, [plansData?.paymentTerms]);

  useEffect(() => {
    if (isContinue) {
      handleSubmit(onSubmit)();
    }
  }, [isContinue]);

  useEffect(() => {
    if (isEditMode && Object.values(structure).length) {
      updateStructureForEndOfTerm(structure, watchAllFields.endOfTerm);
      if (watchAllFields.endOfTerm === "N") {
        setValue(
          "subscriptionType",
          plansData?.subscriptionType === "Orders"
            ? "orders"
            : "deliveryAssociates"
        );
        setValue("billingFrequency", {
          id: billingFrequencyMap[plansData?.["billingFequency"]],
          name: plansData?.["billingFequency"],
        });
      }
    }
  }, [watchAllFields.endOfTerm]);

  useEffect(() => {
    if (Object.values(structure).length && watchAllFields.billingCountry) {
      if (!isEditMode && !isHubSpotDetailsLoading) {
        resetAddressFieldOnCountryChange(
          watchAllFields.billingCountry,
          structure,
          setValue,
          dispatch
        );
      } else if (
        plansData &&
        plansData.billingAddressDTO &&
        plansData.billingAddressDTO.countryId !==
        watchAllFields.billingCountry.id
      ) {
        resetAddressFieldOnCountryChange(
          watchAllFields.billingCountry,
          structure,
          setValue,
          dispatch
        );
      }
    }
  }, [watchAllFields.billingCountry]);

  // signupType watcher
  useEffect(() => {
    updateStructureForSignUpType(signUpType?.clientRefMasterCd);
  }, [signUpType?.clientRefMasterCd])

  /** Utils */

  const fetchParentSubcriptionId = (clientId: number) => {
    dispatch({ type: "@@plansForm/FETCH_PARENT_SUBSCRIPTION_ID", payload: clientId });
  }

  const getAddOnList = async () => {
    const recurringAddOnList: IAddOn[] = [];
    const oneTimeAddOnList: IAddOn[] = [];
    const addonMapping = {};
    const oneTimeAddonKeys: string[] = [];
    const recurringAddonKeys: string[] = [];
    const unitRateMapping = {};

    try {
      const {
        data: { data },
      } = await axios.get(
        `${apiMappings.saas.plans.addonPlans}${selectedPlan}&currencyCode=${billingCurrencyWatcher.name}&billingFrequency=${billingFrequencyWatcher.name}`,
        {
          params: {
            productType: plansData?.product,
          },
        }
      );
      const tempResponse = data || [];
      tempResponse.forEach((addOn: IAddOn) => {
        const newAddOn = {
          ...addOn,
          label: addOn.name,
          value: addOn.addonCode,
          rate: addOn.price,
          title: addOn.name,
          pricingScheme: "unit",
        };
        addonMapping[addOn.addonCode] = addOn?.name;
        if (addOn.type === "one_time") {
          oneTimeAddOnList.push(newAddOn);
          oneTimeAddonKeys.push(addOn.addonCode);
          unitRateMapping[addOn.addonCode] = addOn.price;
        } else {
          recurringAddOnList.push(newAddOn);
          recurringAddonKeys.push(addOn.addonCode);
          unitRateMapping[addOn.addonCode] = addOn.price;
        }
      });

      setAddonNameMapping(addonMapping);
      setAddOnList({
        oneTimeAddOn: oneTimeAddOnList,
        recurringAddOn: recurringAddOnList,
      });
      let oneTimeAddOn = {};
      let recurringAddOn = {};
      let oneTimeTierData = {};
      let recurringTierData = {};
      if (zohoAddons && plansData?.planType === selectedPlan) {
        zohoAddons?.forEach((zohoAddon: IAddOn) => {
          const randomId = uuid.v4();
          let _zohoAddon = { ...zohoAddon };
          if (oneTimeAddonKeys.includes(zohoAddon.addonCode)) {
            if (addonTierData && addonTierData[zohoAddon.addonCode]) {
              oneTimeTierData[randomId] = addonTierData[zohoAddon.addonCode];
              _zohoAddon = {
                ...zohoAddon,
                rate: unitRateMapping[zohoAddon.addonCode],
              };
            }
            oneTimeAddOn[randomId] = createOneTimeAddOn(
              _zohoAddon,
              oneTimeAddOnList
            );
          } else if (recurringAddonKeys.includes(zohoAddon.addonCode)) {
            if (addonTierData && addonTierData[zohoAddon.addonCode]) {
              recurringTierData[randomId] = addonTierData[zohoAddon.addonCode];
              _zohoAddon = {
                ...zohoAddon,
                rate: unitRateMapping[zohoAddon.addonCode],
              };
            }
            recurringAddOn[randomId] = createRecurringAddOn(
              _zohoAddon,
              recurringAddOnList
            );
          }
        });
      }
      let scheduledOneTime = {};
      let scheduledRecurring = {};
      const scheduleChanges = plansData?.scheduledChanges;
      let schedulePlan: ITable[] = [];
      if (scheduleChanges && scheduleChanges?.planType) {
        schedulePlan = createSchedulePlan({
          ...scheduleChanges,
          planType: scheduleChanges?.planName || "",
          currencyCode: currencySign,
          billingFrequency:
            scheduleChanges?.billingFrequency || billingFrequencyWatcher?.name,
        });
      }
      if (scheduledZohoAddons?.length) {
        scheduledZohoAddons.forEach((zohoAddon: IZohoAddon) => {
          const randomId = uuid.v4();
          if (oneTimeAddonKeys.includes(zohoAddon.addonCode)) {
            scheduledOneTime[randomId] = createScheduleAddon({
              ...zohoAddon,
              addonCode: zohoAddon?.name || "",
              currencyCode: currencySign,
            });
          } else if (recurringAddonKeys.includes(zohoAddon.addonCode)) {
            scheduledRecurring[randomId] = createScheduleAddon({
              ...zohoAddon,
              addonCode: zohoAddon?.name || "",
              currencyCode: currencySign,
            });
          }
        });
      }
      dispatch({
        type: "@@plansForm/SET_SCHEDULED_CHANGES",
        payload: {
          plan: schedulePlan,
          oneTime: scheduledOneTime,
          recurring: scheduledRecurring,
        },
      });
      const randomId = uuid.v4();
      if (!Object.keys(oneTimeAddOn).length) {
        oneTimeAddOn[randomId] = createOneTimeAddOn({}, oneTimeAddOnList);
      }
      if (!Object.keys(recurringAddOn).length) {
        recurringAddOn[randomId] = createRecurringAddOn({}, recurringAddOnList);
      }
      const newRowData = {
        ...rowWiseTierData,
        oneTimeAddOn: oneTimeTierData,
        recurringAddOn: recurringTierData,
      };

      dispatch({
        type: "@@plansForm/SET_ROWWISE_TIER_DATA",
        payload: newRowData,
      });
      if (sectionData && selectedPlanRow) {
        const newPlanDetails: any = sectionData?.planDetails;
        newPlanDetails["1"] = selectedPlanRow;
        const section = {
          planDetails: newPlanDetails,
          oneTimeAddOn,
          recurringAddOn,
        };
        dispatch({ type: "@@plansForm/SET_SECTION_DATA", payload: section });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPlan = async () => {
    if (
      billingCurrencyWatcher &&
      billingFrequencyWatcher &&
      watchAllFields.subscriptionType
    ) {
      try {
        const resp = await axios.get(
          `${apiMappings.saas.plans.productPlan}${billingCurrencyWatcher.name
          }&billingCycle=${billingFrequencyWatcher.name}&subscriptionType=${watchAllFields.subscriptionType === "orders"
            ? "orders"
            : "Delivery Associates"
          }`,
          {
            params: {
              productType: plansData?.product,
            },
          }
        );
        let mockedData = resp?.data?.data?.plans || [];
        const transformedPlanDetails: any = mockedData?.map(
          (plan: {
            name: string;
            plan_code: string;
            recurring_price: number;
          }) => ({
            label: plan.name,
            value: plan.plan_code,
            rate: plan.recurring_price,
            price: plan.recurring_price,
            pricingScheme: "unit",
            title: plan.name,
          })
        );
        dispatch({
          type: "@@plansForm/SET_PLAN_DETAILS",
          payload: transformedPlanDetails,
        });
        if (isEditMode) {
          const newSelectedPlan = [...selectedPlanRow];

          newSelectedPlan[0].options = transformedPlanDetails;
          newSelectedPlan[1].id =
            watchAllFields.subscriptionType === "orders"
              ? "numberOfOrders"
              : "numberOfDeliveryAssociates";
          newSelectedPlan[1].label =
            watchAllFields.subscriptionType === "orders"
              ? "Number Of Orders"
              : "Number Of Delivery Associates";
          const newSectionData = {
            ...sectionData,
            planDetails: { 1: newSelectedPlan },
          };
          dispatch({
            type: "@@plansForm/SET_SECTION_DATA",
            payload: newSectionData,
          });
          dispatch({
            type: "@@plansForm/SET_SELECTED_PLAN",
            payload: newSelectedPlan,
          });
        } else {
          dispatch({
            type: "@@plansForm/SET_SELECTED_PLAN",
            payload: undefined,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updateStructureForEndOfTerm = (
    structure: IMongoFormStructure,
    endOfTerm: string
  ) => {
    if (endOfTerm === "Y") {
      structure.subscriptionDetails.subscriptionType.editable = true;
      structure.billingDetails.billingFrequency.editable = true;
    } else {
      structure.subscriptionDetails.subscriptionType.editable = false;
      structure.billingDetails.billingFrequency.editable = false;
    }
    dispatch({ type: "@@plansForm/SET_STRUCTURE", payload: structure });
  };

  const showHideFields = (
    sectionsToUpdate: { [s: string]: unknown } | ArrayLike<string>,
    action: tShowHide
  ) => {
    const isPermitted = action === "show";

    if (Object.keys(structure).length !== 0) {
      Object.entries(sectionsToUpdate).forEach(([sectionKey, fieldKeyArray]) => {
        // If the sectionsToUpdate has fields defined inside array then show/hide only those fields else show/hide all the fields for that section
        if (Array.isArray(fieldKeyArray) && fieldKeyArray.length > 0) {
          fieldKeyArray.forEach((fieldKeyInArray: string | number) => {
            structure[sectionKey][fieldKeyInArray].permission = isPermitted;
          });
        } else {
          Object.values(structure[sectionKey]).forEach(
            (fieldValue) => (fieldValue.permission = isPermitted)
          );
        }
      });
      dispatch({ type: "@@plansForm/SET_STRUCTURE", payload: structure });
    }
  };

  const updateStructureForShareSubscription = (shareSubscription: string) => {
    /**
     * Making Object for sections and fields to hide.
     * To hide whole sections we defined empty arrays, like billingAddressDetails, billingContactDetails...
     * Else declare the fields you want to hide for that section as an array of strings
     * Like for organizationDetails we need to hide only taxIdentification field
     */
    const sectionFieldsToUpdate = {
      billingAddressDetails: [],
      billingContactDetails: [],
      billingDetails: [],
      subscriptionDetails: [],
      summary: [],
      organizationDetails: ["taxIdentification"],
    };

    if (shareSubscription === "Y") {
      setShareSubscriptionLocalState(true);
      showHideFields(sectionFieldsToUpdate, "hide");
    } else {
      setShareSubscriptionLocalState(false);
      showHideFields(sectionFieldsToUpdate, "show");
    }
  };

  const updateStructureForLinkToParentEntity = (linkToParentEntity: string) => {
    const sectionFieldsToUpdate = {
      organizationDetails: ["parentEntityName", "shareSubscription"],
    };
    if (linkToParentEntity === "Y") {
      showHideFields(sectionFieldsToUpdate, "show");
    } else if (linkToParentEntity === "N") {
      showHideFields(sectionFieldsToUpdate, "hide");
      setShareSubscriptionLocalState(false);
      setValue("shareSubscription", "N");
      setValue("parentEntityName", "");
    }
  };

  const updateStructureForSignUpType = (signUpType : string) => {
    const sectionFieldsToUpdate = {
      uatAccountDetails: ["uatAdminName", "uatAdminEmail", "uatAdminMobileNumber"],
    };
    signUpType === "SMB" ? showHideFields(sectionFieldsToUpdate, "hide") : showHideFields(sectionFieldsToUpdate, "show");
    sectionFieldsToUpdate.uatAccountDetails.map((obj) => {
      delete formInstance.errors[obj];
    })
  };

  const setDetails = async (hubDetails: any) => {
    const {
      accountManager,
      entityName,
      taxIdentification,
      operationManager,
      organization,
      businessDevelopmentManager,
      billingContactNo,
      billingEmail,
      adminContactNo,
      billingName,
      billingAddressDTO,
      billingFrequency,
      currencyCode,
      ...rest
    } = hubDetails;
    if (billingAddressDTO?.pincode) {
      const currentPincode = await getPincode(billingAddressDTO?.pincode);
      setValue("billingPinCode", currentPincode);
    }
    if (billingFrequency || rest.billingFequency) {
      const billingFreq = await getBillingFrequency(
        billingFrequency || rest.billingFequency,
        dispatch
      );
      setValue("billingFrequency", billingFreq);
    }
    if (currencyCode && billingCurrency) {
      setValue("billingCurrency", billingCurrency[currencyCode]);
    }
    const org = organization
      ? organization?.toLowerCase() === "loginext"
        ? "LogiNext"
        : "LogiSprint"
      : "LogiNext";
    //organization
    setInternalUsers(
      businessDevelopmentManager,
      accountManager,
      operationManager,
      setValue
    );
    setValue("businessType", rest?.businessType);
    setValue("entityName", entityName);
    setValue("gst_no", rest?.gst_no);
    setValue("hubspotDealId", rest?.hubspotDealId);
    setValue("legalDocs", rest?.legalDocs || org);
    setValue("taxIdentification", taxIdentification);
    // billling contact details
    setValue("billingApartment", billingAddressDTO?.apartment);
    setValue("billingCity", billingAddressDTO?.city);
    setValue("billingContactNo", billingAddressDTO?.phoneNumber);
    setValue("phoneNumber", billingAddressDTO?.phoneNumber);
    setValue("billingCountry", {
      name: billingAddressDTO?.country || billingAddressDTO?.countryName,
      id: billingAddressDTO?.countryId,
    });
    setValue("billingEmail", billingAddressDTO?.contactEmailAddress);

    setValue("billingName", billingName);
    setValue("billingLandmark", billingAddressDTO?.landmark);
    setValue("billingLocality", billingAddressDTO?.locality);

    setValue("billingState", {
      name: billingAddressDTO?.state || billingAddressDTO?.stateName,
      id: billingAddressDTO?.stateId,
    });
    setValue("billingStreetName", billingAddressDTO?.streetName);
    // admin details
    setValue("adminEmailId", rest?.email || rest?.adminEmailId);
    setValue("adminPhoneNumber", adminContactNo);
    setValue("adminName", rest?.adminName);
    setValue("uatAdminName", rest?.uatAdminName);
    setValue("uatAdminEmail", rest?.uatAdminEmail);
    setValue("uatAdminMobileNumber", rest?.uatAdminMobileNumber);
    setIHubSpotDetailsLoading(false);
  };

  const fetchPlansData = async (
    clientId?: string | number,
    zohoSubscriptionId?: any
  ) => {
    setIsPlansDataLoading(true);
    try {
      const {
        data: { data: res },
      }: any = await axios.get<any>(
        `${apiMappings.saas.plans.getPlan}${zohoSubscriptionId}&clientId=${clientId}`
      );
      const response: IPlansForm = { ...res, clientId, zohoSubscriptionId };
      //, scheduledChangesDTO: getSaasData.scheduledChangesDTO }
      setPlanData(response, setValue, dispatch, storeState);
      dispatch({ type: "@@plansForm/SET_PLANS_DATA", payload: response || {} });
      setIsPlansDataLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsPlansDataLoading(false);
      toast.add(
        error?.response?.data?.message || dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    }
  };

  const getHubSpotDetails = async () => {
    try {
      setIHubSpotDetailsLoading(true);
      let params = {
        hubspotDealId: watchAllFields.hubspotDealId,
        adminEmailId: watchAllFields.adminEmailId,
      };
      const {
        data: { data: hubSpotDetails, status, message },
      } = await axios.get(apiMappings.saas.plans.getHubSpotDetails, { params });
      if (status === 200 || status === 0) {
        setDetails(hubSpotDetails);
      } else {
        toast.add(message, "warning", false);
        setIHubSpotDetailsLoading(false);
      }
    } catch (error: any) {
      toast.add(
        error?.response?.data?.message || dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
      setIHubSpotDetailsLoading(false);
    }
  };

  const isSameArray = (
    oldArray: IZohoAddon[] = [],
    newArray: IZohoAddon[] = []
  ) => {
    let isSame = true;
    let isOneTimeAddonChange = false;
    let isRecurringAddonChange = false;

    for (let i = 0; i < newArray.length; i++) {
      const currentAddon = newArray[i];
      const oldAArrayAddon = oldArray?.find(
        (o) => o.addonCode === currentAddon.addonCode
      );
      if (!oldAArrayAddon) {
        isSame = false;
        if (currentAddon.type === "one_time" && !isOneTimeAddonChange) {
          isOneTimeAddonChange = true;
        } else if (
          currentAddon.type === "recurring" &&
          !isRecurringAddonChange
        ) {
          isRecurringAddonChange = true;
        }
      }
      //  else if (oldAArrayAddon.numberOfTransaction && oldAArrayAddon.rate !== currentAddon.price || oldAArrayAddon.numberOfTransaction !== currentAddon.quantity) {
      //   isSame = false
      // }
      else if (
        oldAArrayAddon.price !== currentAddon.price ||
        oldAArrayAddon.quantity !== currentAddon.quantity
      ) {
        isSame = false;
        if (currentAddon.type === "one_time" && !isOneTimeAddonChange) {
          isOneTimeAddonChange = true;
        } else if (
          currentAddon.type === "recurring" &&
          !isRecurringAddonChange
        ) {
          isRecurringAddonChange = true;
        }
      } else if (
        oldAArrayAddon &&
        currentAddon &&
        oldAArrayAddon.quantity &&
        currentAddon.quantity &&
        Number(oldAArrayAddon.quantity) > Number(currentAddon.quantity)
      ) {
        return toast.add(
          "For any plan or recurring addon, it should NOT be possible for the user to decrease the number of orders/delivery associates/units from the current billing cycle onwards.",
          "warning",
          false
        );
      }
    }

    return { isSame, isOneTimeAddonChange, isRecurringAddonChange };
  };

  /** Callbacks */
  const onSubmit = async (data: any) => {
    gaOnSubmit();

    //  onlyOneTimeAddonAdded -> if only onetime addon got changed

    const {
      productActivationDate,
      subscriptionActivationDate,
      billingName,
      billingEmail,
      billingContactNo,
      billingCountry,
      billingCurrency,
      lockInPeriod,
      billingApartment,
      billingStreetName,
      billingLandmark,
      billingLocality,
      billingState,
      billingCity,
      billingPinCode,
      adminEmailId,
      adminPhoneNumber,
      paymentTerms,
      endOfTerm,
      signUpType,
      linkToParentEntity,
      parentEntityName,
      ...rest
    } = data;

    let onlyOneTimeAddonAdded = false;
    // even if change in plan send override key as true -edit
    const {
      planDetails,
      zohoAddonDTOs,
      error,
      billingError,
      isAddonAddedTwice,
    } = gerateAccordionData(
      sectionData,
      rowWiseTierData,
      planNameMapping,
      addonNameMapping
    );

    let revisedZohoAddon = zohoAddonDTOs;
    let revisedPlanObj: any = { ...planDetails };
    let overrideSubscriptionChanges = false;
    let isChange = false;
    const isPlanChanged =
      planDetails?.planType?.toString() !== plansData?.planType?.toString() ||
      Number(planDetails?.planQuantity || 0) !==
      Number(plansData?.planQuantity || 0) ||
      Number(planDetails?.planUnitRate || 0) !==
      Number(plansData?.planUnitRate || 0);
    if (isEditMode && plansData?.planType !== "TRIAL") {
      const { planError, planQuantityError } = checkValidationInEditMode(
        plansData,
        planDetails,
        data,
        planNameMapping,
        revisedZohoAddon
      );
      if (planError || planQuantityError) {
        return toast.add(planError || planQuantityError, "warning", false);
      } else {
        const { isSame: isSameScheduledChanges, isRecurringAddonChange } =
          isSameArray(
            plansData?.scheduledChanges?.zohoAddonDTOs,
            zohoAddonDTOs || []
          );
        // if scheduled changes ,  if plan or zoho addon changed then show below popup
        if (
          plansData?.scheduledChanges &&
          // make sure recurring addon changed too, only if onetime addon changed then no need to show popup simply send one key
          ((!isSameScheduledChanges && isRecurringAddonChange) ||
            isPlanChanged) &&
          isContinue === undefined &&
          !scheduledChangesDiscardPopup
        ) {
          dispatch({
            type: "@@plansForm/SET_SCHEDULED_CHANGES_DISCARD_POPUP",
            payload: true,
          });
          return;
        }
      }
    }

    // if changes apply on next billing cycle in edit mode, and user clicked on continue(isContinue = true) changes, then change the zohoAddondto with new value
    if ((isEditMode && isContinue) || isContinue === undefined) {
      revisedZohoAddon = zohoAddonDTOs;
      // only if user clicks on continue then  only go inside
      const {
        isSame: isSameZohoAdd0n,
        isOneTimeAddonChange,
        isRecurringAddonChange,
      } = isSameArray(plansData?.zohoAddonDTOs, zohoAddonDTOs);
      // hack, on the click of continue coming undefined
      if (isContinue === undefined) {
        overrideSubscriptionChanges = true;
        isChange = true;
      } else if (isContinue || !isSameZohoAdd0n) {
        overrideSubscriptionChanges = true;
        isChange = true;
      }
      // if no plan change or recurring addon change, only one time add on change send below key in payload
      if (isOneTimeAddonChange && !isRecurringAddonChange && !isPlanChanged) {
        onlyOneTimeAddonAdded = true;
      }
    }

    // IF cancel btn pressed(isContinue=false) then zohoaddon dto will go as it is even no change in curren zoho dto
    if (isEditMode && isContinue === false) {
      revisedZohoAddon = plansData?.zohoAddonDTOs;
      overrideSubscriptionChanges = false;
      isChange = false;
    }
    // if user wants to discontinue then revert plan data too
    if (isEditMode && isContinue === false) {
      revisedPlanObj = {
        planType: plansData?.planType,
        planQuantity: plansData?.planQuantity,
        planUnitRate: plansData?.planUnitRate,
      };
      overrideSubscriptionChanges = false;
    }
    // if any change in plan in edit mode and user clicks on continue send overrideSubscriptionChanges
    if (isEditMode && isPlanChanged) {
      if (isContinue || isContinue === undefined) {
        overrideSubscriptionChanges = true;
        isChange = true;
      }
    }
    let err = false;
    if (!planDetails?.planType && !isEditMode && !shareSubscriptionLocalState) {
      err = true;
      toast.add("Please select the plan", "warning", false);
    }
    if (error.plan) {
      err = true;
      toast.add(error.plan, "warning", false);
    }
    if (error.addon) {
      err = true;
      toast.add(error.addon, "warning", false);
    }
    if (billingError) {
      err = true;
      toast.add(billingError, "warning", false);
    }
    if (isAddonAddedTwice) {
      err = true;
      toast.add(
        "Few addons are mentioned more than once in the subscription. To proceed further, remove the multiple entries of the same addon.",
        "warning",
        false
      );
    }
    if (err) {
      return;
    }
    if (!formInstance.formState.isDirty && !isChange) {
      hybridRouteTo("admindashboard");
      return;
    }

    const removeIds = [
      "billingFrequency",
      "orderOneTimeAddOnPrice",
      "smsRecurringAddOnPrice",
      "smsOneTimeAddOnPrice",
      "emailRecurringAddOnPrice",
      "emailOneTimeAddOnPrice",
      "ivrRecurringAddOnPrice",
      "ivrOneTimeAddOnPrice",
      "refresh",
      // This value is not required in payload because as soon as toggle is on we just need the parentSubscriptionId which is set in redux and used here in payload
      "shareSubscription" 
    ];
    let productionActivation =
      productActivationDate &&
      moment(productActivationDate).utc().format("YYYY-MM-DD HH:mm:ss");
    let subScriptionActivation =
      subscriptionActivationDate &&
      moment(subscriptionActivationDate).utc().format("YYYY-MM-DD HH:mm:ss");
    if (productionActivation) {
      productionActivation = productionActivation.split(" ").join("T");
    }
    if (subScriptionActivation) {
      subScriptionActivation = subScriptionActivation.split(" ").join("T");
    }
    const payload = {
      // If linkToParentEntity is on then only send parent refernce Id
      parentReferenceId: !!(linkToParentEntity === "Y") ? parentEntityName.referenceId : undefined,
      // If linkToParentEntity is on and parentEntity is selected and parentSubscriptionId is fetched and saved in redux then only send shareSubscriptionId
      sharedSubscriptionId: !!(linkToParentEntity === "Y" && parentEntityName && shareSubscriptionLocalState) ? parentSubscriptionId : undefined,
      // If linkToParentEntity is on and parentEntity is selected and parentSubscriptionId is fetched and saved in redux then send parent planType else selectedPlanType
      planType: !!(linkToParentEntity === "Y" && parentEntityName && shareSubscriptionLocalState) ? parentEntityName.planType : revisedPlanObj.planType,

      zohoAddonDTOs: revisedZohoAddon,
      legalDocsFilledBy: rest?.legalDocs ? rest?.legalDocs : "LogiNext",
      currencyCode: billingCurrency?.name,
      billingFequency: rest.billingFrequency?.name,
      paymentTerms: Number(paymentTerms),
      lockInPeriod: Number(lockInPeriod),
      endOfTerm: !!(endOfTerm === "Y"),
      gst_no: rest?.businessType === "business_gst" ? rest?.gst_no : undefined,
      billingAddressDTO: {
        locality: billingLocality,
        streetName: billingStreetName,
        phoneNumber: billingContactNo,
        contactEmailAddress: billingEmail,
        apartment: billingApartment,
        landmark: billingLandmark,
        state: billingState?.name,
        country: billingCountry?.name,
        stateId: billingState?.id,
        countryId: billingCountry?.id,
        pincode: billingPinCode?.name,
        city: billingCity,
      },
      adminContactNo: adminPhoneNumber,
      billingName,
      adminEmailId: adminEmailId,
      email: adminEmailId,
      signUpType: signUpType?.clientRefMasterCd,
      subscriptionType:
        watchAllFields?.subscriptionType === "orders"
          ? "Orders"
          : "Delivery Associates",
      productActivationDate: productActivationDate,
      subscriptionActivationDate: subScriptionActivation,
      trialToPaidRequest: plansData?.planType === "TRIAL" ? true : false,
      billingEmailId: billingEmail ? billingEmail : undefined,

      ...rest,
      ...revisedPlanObj
    };
    if (isEditMode) {
      payload.overrideSubscriptionChanges = overrideSubscriptionChanges;
      if (onlyOneTimeAddonAdded) {
        payload.onlyOneTimeAddonAdded = onlyOneTimeAddonAdded;
        payload.overrideSubscriptionChanges = false;
      }
    }
    removeIds.forEach((id) => {
      if (payload[id]) {
        delete payload[id];
      }
    });

    dispatch({ type: "@@plansForm/SET_LOADING", payload: true });
    try {
      const { data: response } = await axios[isEditMode ? "put" : "post"](
        apiMappings.saas.plans[isEditMode ? "update" : "create"],
        payload
      );

      if (response?.status === 200) {
        dispatch({ type: "@@plansForm/SET_LOADING", payload: false });
        toastDispatch({
          type: "@@globalToast/add",
          payload: {
            message: response.message,
            icon: "check-round",
          },
        });
        hybridRouteTo("admindashboard");
      } else {
        dispatch({ type: "@@plansForm/SET_LOADING", payload: false });
        toast.add(response?.message, "warning", false);
      }
    } catch (error: any) {
      dispatch({ type: "@@plansForm/SET_LOADING", payload: false });
      toast.add(
        error?.response?.data?.error?.message?.[0] ||
        error?.response?.data?.message ||
        dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    }
  };

  const handleSubmitForm = (value: boolean) => {
    dispatch({ type: "@@plansForm/SET_IS_DISCARD", payload: value });
    dispatch({
      type: "@@plansForm/SET_SCHEDULED_CHANGES_DISCARD_POPUP",
      payload: false,
    });
  };

  return (
    <PlansFormWrapper>
      <div id="toast-inject-here"></div>
      <EditModePopup handleSubmitForm={handleSubmitForm} />
      <Box py="15px">
        <BreadCrumb
          options={breadCrumbOptions}
          onClick={handleBreadCrumbClick}
        />
      </Box>
      <Box bgColor="white">
        <Card style={{ minHeight: "80vh", position: "relative" }}>
          {isHubSpotDetailsLoading && <FormLoader sections={8} />}
          {isLoading && (
            <div ref={loaderRef}>
              <FormLoader />
            </div>
          )}
          <div
            style={
              isLoading || isHubSpotDetailsLoading ? { display: "none" } : {}
            }
          >
            {sectionKeys.length > 0 &&
              sectionKeys.map((sectionName, index) => (
                <>
                  {index === 7 && !shareSubscriptionLocalState && (
                    <AccordionSection
                      addOnList={addOnList}
                      allField={watchAllFields}
                      subscriptionType={watchAllFields.subscriptionType}
                    />
                  )}
                  {isEditMode &&
                    !shareSubscriptionLocalState &&
                    sectionName === "summary" &&
                    plansData?.scheduledChanges && (
                      <NewChanges watchAllFields={watchAllFields} />
                    )}
                  <div key={sectionName}>
                    {Object.keys(structure[sectionName]).some(
                      (fieldKey) => structure[sectionName][fieldKey].permission
                    ) &&
                      // Hiding the section Name for the sections not required if subscription is shared
                      (!shareSubscriptionLocalState ||
                        sectionName === "adminDetails" ||
                        sectionName === "organizationDetails" ||
                        sectionName === "uatAccountDetails") && (
                        <SectionHeaderContainer>
                          <SectionHeader
                            headerTitle={dynamicLabels[sectionName]}
                          />
                        </SectionHeaderContainer>
                      )}

                    <Grid
                      container
                      spacing="10px"
                      style={{ marginBottom: "15px" }}
                    >
                      {Object.keys(structure[sectionName]).map((fieldName) => {
                        const meta = structure[sectionName][fieldName];
                        meta.multipleFiles = false;
                        const { permission } = meta;
                        if (
                          sectionName === "organizationDetails" &&
                          fieldName === "hubspotDealId"
                        ) {
                          meta.icon = "refresh-thin";
                          if (plansData?.planType == "TRIAL") {
                            meta.editable = true;
                          }
                        }
                        if (
                          fieldName === "productActivationDate" ||
                          fieldName === "subscriptionActivationDate"
                        ) {
                          meta.minDate = "today";
                        }
                        // if logiNext is selected show tax identity and hide business type,gst no
                        // if logisprint then show business type and hide tax identity
                        // if business type is business none then hide gst_no
                        if (
                          ((watchAllFields.legalDocs === "LogiNext" ||
                            watchAllFields.legalDocs === undefined) &&
                            (fieldName === "businessType" ||
                              fieldName === "gst_no")) ||
                          (watchAllFields.legalDocs === "LogiSprint" &&
                            fieldName === "taxIdentification") ||
                          ((watchAllFields.businessType === undefined ||
                            watchAllFields.businessType === "business_none") &&
                            fieldName === "gst_no")
                        ) {
                          return undefined;
                        }
                        if (
                          sectionName === "subscriptionDetails" &&
                          fieldName === "endOfTerm" &&
                          plansData?.planType === "TRIAL"
                        ) {
                          meta.editable = false;
                        }

                        if (!permission) {
                          return undefined;
                        }

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
                              meta={meta}
                              formInstance={formInstance}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </div>
                </>
              ))}
          </div>
          <Box horizontalSpacing="15px" display="flex" mt="30px">
            <IconButton
              id='addClientForm-save'
              iconVariant="icomoon-save"
              style={{ padding: "0px 15px" }}
              disabled={isLoading}
              onClick={() => handleSubmit(onSubmit)()}
              primary
            >
              {isEditMode ? dynamicLabels.update : dynamicLabels.save}
            </IconButton>
            <IconButton
              iconVariant="icomoon-close"
              style={{ padding: "0px 15px" }}
              disabled={isLoading}
              onClick={() => {
                gaOnCancel();
                handleBreadCrumbClick("settingDashboard");
              }}
            >
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
        </Card>
      </Box>
    </PlansFormWrapper>
  );
};

export default withReact(PlansForm);
