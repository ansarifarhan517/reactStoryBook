import React, { Dispatch } from "react";
import { UseFormMethods } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { tGlobalPopupAction } from "../../../common/GlobalPopup/GlobalPopup.reducer";
import { IOrganizationData } from "./OrganizationProfile.model";
import { IconButton } from "ui-library";

export const generateOrganizationProfileFormData = (
  data: IOrganizationData
) => {
  const {
    countryName,
    countryId,
    stateName,
    zipCode,
    contactDetailsList,
  } = data;
  convertAdditionalContacts(data, contactDetailsList);
  return {
    ...data,
    stateId: stateName
      ? {
          id: 1,
          name: stateName,
        }
      : undefined,
    countryId: countryName
      ? {
          id: countryId,
          name: countryName,
        }
      : undefined,
    // baseCountry: countryName
    // ? {
    //     id: countryId,
    //     name: countryName,
    //   }
    // : undefined,
    zipCode: zipCode
      ? {
          id: countryId,
          name: zipCode,
          pincode: zipCode,
        }
      : undefined,
  };
};
export const useBreadCrumbs = (
  formInstance: UseFormMethods<Record<string, any>>
) => {
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();

  const breadCrumbOptions = React.useMemo(
    () => [
      {
        id: "organizationProfile",
        label: dynamicLabels.organizationProfile,
        disabled: true,
      },
    ],
    [dynamicLabels]
  );

  const handleBreadCrumbClick = (id: string) => {
    switch (id) {
      case "organizationProfile":
        if (!formInstance.formState.isDirty) {
          return;
        } else {
          globalPopupDispatch({
            type: "@@globalPopup/SET_PROPS",
            payload: {
              isOpen: true,
              title: dynamicLabels.navigationConfirmation,
              content: dynamicLabels.dataLostWarningMsg,
              footer: (
                <>
                  <IconButton
                    iconVariant="icomoon-tick-circled"
                    primary
                    onClick={() => {
                      globalPopupDispatch({
                        type: "@@globalPopup/CLOSE_POPUP",
                      });
                    }}
                  >
                    {dynamicLabels.ok}
                  </IconButton>
                  <IconButton
                    iconVariant="icomoon-close"
                    onClick={() =>
                      globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" })
                    }
                  >
                    {dynamicLabels.cancel}
                  </IconButton>
                </>
              ),
            },
          });
        }
        break;
    }
  };

  return { breadCrumbOptions, handleBreadCrumbClick };
};

export const convertAdditionalContacts = (data: any, opList: any) => {
  let index = 0;
  if (opList) {
    opList.map((field: any) => {
      if (!field.isPrimaryFl && field.isActiveFl) {
        data["fullName" + index] = field?.contactName;
        data["phoneNumber" + index] = field?.contactNumber;
        data["emailId" + index] = field?.contactEmail;
        data["contactId" + index] = field?.contactId;
        data["zohoContactId" + index] = field?.zohoContactId;
        index = index + 1;
      }
    });
  }
};

export const buildContactPayload = (getValues: Function, clientId: number) => {
  const contactDetails = [];
  for (var i = 0; i < 3; i++) {
    contactDetails.push(
      addContactDetails(
        getValues("contactId" + i),
        getValues("fullName" + i),
        getValues("emailId" + i),
        getValues("phoneNumber" + i),
        false,
        getValues("zohoContactId" + i),
        clientId
      )
    );
  }
  return contactDetails;
};

const addContactDetails = (
  contactId: any,
  fullName: string,
  emailId: string,
  phoneNumber: string,
  isPrimaryFl: boolean,
  zohoContactId: string,
  clientId: number
) => {
  if (validateDetails(emailId)) {
    return {
      contactId: contactId,
      contactName: fullName,
      contactEmail: emailId,
      contactNumber: phoneNumber,
      isActiveFl: true,
      isPrimaryFl: isPrimaryFl,
      zohoContactId: zohoContactId,
      clientId: clientId,
    };
  }
  return {
    contactId: contactId,
    contactName: fullName,
    contactEmail: emailId,
    contactNumber: phoneNumber,
    isActiveFl: false,
    isPrimaryFl: isPrimaryFl,
    zohoContactId: zohoContactId,
    clientId: clientId,
  };
};

const validateDetails = (emailId: string) => {
  return emailId == "" ? false : true;
};
