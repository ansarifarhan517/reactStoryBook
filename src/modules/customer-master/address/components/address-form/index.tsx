import React, { useEffect, Dispatch, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Card, useToast, Box, IconButton } from "ui-library";

import OutlineBlockErrorSvg from "../../../../../../images/outline-block-error.svg";
import { deepCopy } from "../../../../../utils/helper";
import { IMongoColumnOnlyStructure } from "../../../../../utils/mongo/interfaces";
import { tGlobalPopupAction } from "../../../../common/GlobalPopup/GlobalPopup.reducer";
import { tGlobalToastActions } from "../../../../common/GlobalToasts/globalToast.reducer";

import FormMap from "./components/form-map";
import { tDropdownComponentProps, tSearchFieldAddressInfo } from "./model";
import AddressesFormFields from "./components/addresses-form-fields";
import { AssignedOrdersModal } from "..";
import {
  fetchFormStructure,
  fetchLocale,
  fetchOrderCount,
  putUpdatedAddress,
  fetchAssingedOrderStructure,
} from "./api";

import "./style.css";

const AddressForm = ({ dynamicLabels, setIsUpdateForm, updateRowData, currentPage }) => {
  const toast = useToast();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();

  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {},
  });

  // Checking if form is dirty
  console.log(formInstance.formState.isDirty);

  const { handleSubmit, getValues, setValue } = formInstance;

  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();

  // Local States
  const [addressFields, setAddressFields] = useState<any>({});
  const [countryList, setCountryList] = useState<tDropdownComponentProps[]>([]);
  const [showAssingedOrderModal, setShowAssignedOrderModal] = useState(false);
  const [modalStructure, setModalStructure] =
    useState<IMongoColumnOnlyStructure>({ columns: {} });
  const [filledData, setFilledData] = useState(null);

  // Local Variables
  const nodeAddress = updateRowData?.nodeAddress;
  const addressString = updateRowData?.address;
  const id = updateRowData?.clientNodeId;

  useEffect(() => {
    countryList?.length > 0 &&
      Object.keys(nodeAddress)?.length > 0 &&
      updateAddressFields(nodeAddress);
  }, [countryList]);

  useEffect(() => {
    (async () => {
      if (!Object.keys(addressFields).length) {
        const {
          ["address details"]: { addressFields: response },
        } = await fetchFormStructure();
        setAddressFields(response);
      }
      if (!countryList.length) {
        const localeResponse = await fetchLocale();
        setCountryList(localeResponse);
      }
    })();

    (async () => {
      const response = await fetchAssingedOrderStructure();
      setModalStructure({ ...response });
    })();
  }, []);

  const updateAddressFields = (address: tSearchFieldAddressInfo) => {
    const addressFieldStructure = deepCopy(addressFields);

    const selectedCountry = countryList?.find((countryObj) => {
      return countryObj["name"] === address.country?.toUpperCase();
    });

    setValue("country", {
      id: selectedCountry && selectedCountry?.["id"],
      name: address?.country,
    });
    setValue("state", { id: 1, name: address?.state });
    setValue("apartment", address?.apartment);
    setValue("streetName", address?.streetName);
    setValue("landmark", address?.landmark);
    setValue("locality", address?.locality);
    setValue("city", address?.city);
    if (Object.keys(addressFieldStructure).length > 0) {
      if (
        Object.keys(addressFieldStructure?.["childNodes"])?.includes("pincode")
      ) {
        if (
          addressFieldStructure?.["childNodes"]?.pincode?.fieldType === "text"
        ) {
          setValue("pincode", address?.pincode);
        } else if (
          addressFieldStructure?.["childNodes"]?.pincode?.fieldType === "select"
        ) {
          setValue("pincode", {
            id: selectedCountry && selectedCountry?.["id"],
            pincode: address?.pincode,
            name: address?.pincode,
          });
        }
      }
    }
  };

  const preparePayload = (filledData, clientNodeId) => {
    const {
      country,
      apartment,
      streetName,
      state,
      city,
      pincode: { pincode },
      latitude,
      longitude,
    } = filledData;


    return {
      clientNodeId: clientNodeId,
      nodeAddress: {
        country: country.name,
        apartment,
        streetName,
        state: state.name,
        city,
        pincode,
        latitude,
        longitude,
      },
    };
  };

  const showIntransitOrdersNote = (intransitOrderCount) => {
    globalPopupDispatch({
      type: "@@globalPopup/SET_PROPS",
      payload: {
        isOpen: true,
        title:
          dynamicLabels.addressChangeConfirmation ||
          "Update Address Confirmation",
        content: (
          <div className="all-addresses____update-form__modal-content">
            <img
              src={OutlineBlockErrorSvg}
              className="all-addresses____update-form__modal-content-image"
            />
            {`${
              dynamicLabels.thisAddressCanNotBeUpdatedAsItIsUsedFor ||
              "This address can not be updated as it is used for"
            } ${intransitOrderCount} ${
              dynamicLabels.addressIntransitOrders || "Intransit Order(s)"
            } ${
              dynamicLabels.pleaseCompleteTheseOrdersAndTryAgain ||
              "Please complete these Order(s) and try again"
            }`}
          </div>
        ),
        footer: (
          <>
            <IconButton
              iconVariant="icomoon-tick-circled"
              primary
              onClick={() =>
                globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" })
              }
            >
              {dynamicLabels.ok || "Ok"}
            </IconButton>
          </>
        ),
      },
    });
  };

  const onSubmit = async (data) => {
    setFilledData(data);

    const {
      hasError: fetchOrderCountHasError,
      intransitOrderCount,
      assignedOrderCount,
      message: fetchOrderCountMessage,
    } = await fetchOrderCount(id);

    if (fetchOrderCountHasError) {
      toast.add(
        fetchOrderCountMessage || dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
      return;
    }

    if (intransitOrderCount) {
      showIntransitOrdersNote(intransitOrderCount);
      return;
    }

    if (assignedOrderCount) {
      setShowAssignedOrderModal(true);
      return;
    }

    updateLocation(data);
  };

  const updateLocation = async (filledData) => {

    const filteredPayload = preparePayload(filledData, id);
    const { hasError, message } = await putUpdatedAddress(filteredPayload);

    if (!hasError) {
      toastDispatch({
        type: "@@globalToast/add",
        payload: { message: message, icon: "check-round" },
      });

      setIsUpdateForm(false);
      return;
    } else {
      toast.add(message || dynamicLabels.somethingWendWrong, "warning", false);
    }
  };

  // Country Watcher
  const resetAddressFields = () => {
    setValue("state", "");
    setValue("apartment", "");
    setValue("pincode", "");
    setValue("streetName", "");
    setValue("landmark", "");
    setValue("locality", "");
    setValue("city", "");
  };

  useEffect(() => {
    getValues("country")?.name !== nodeAddress?.country && resetAddressFields();
  }, [getValues("country")]);

  return (
    <>
      <div id="toast-inject-here" />
      <Card className="all-addresses__update-form">
        <div className="all-addresses__update-form__fields">
          {addressFields?.childNodes ? (
            <>
              <AddressesFormFields
                formInstance={formInstance}
                addressFields={addressFields}
              />
              {/* Action Buttons */}
              <Box horizontalSpacing="15px" display="flex" mt="30px">
                <IconButton
                  iconVariant="icomoon-save"
                  style={{ padding: "0px 15px" }}
                  onClick={handleSubmit(onSubmit)}
                  primary
                  id="updateAddressForm--update--save"
                >
                  {dynamicLabels.save}
                </IconButton>
                <IconButton
                  iconVariant="icomoon-close"
                  style={{ padding: "0px 15px" }}
                  onClick={() => setIsUpdateForm(false)}
                  id="updateAddressForm--update--cancel"
                >
                  {dynamicLabels.cancel}
                </IconButton>
              </Box>
            </>
          ) : null}
        </div>
        <div className="all-addresses__update-form__map">
          <FormMap
            nodeAddress={nodeAddress}
            setValue={setValue}
            addressString={addressString}
            currentPage={currentPage}
          />
        </div>
        <AssignedOrdersModal
          isModalOpen={showAssingedOrderModal}
          setIsModalOpen={setShowAssignedOrderModal}
          dynamicLabels={dynamicLabels}
          columns={modalStructure?.columns}
          clickedRow={id}
          onModalAction={() => updateLocation(filledData)}
        />
      </Card>
    </>
  );
};

export default AddressForm;
