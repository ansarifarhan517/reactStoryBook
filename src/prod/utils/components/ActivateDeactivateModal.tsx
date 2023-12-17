import React, { Dispatch } from "react";
import { IconButton, useToast } from "ui-library";
import { useDispatch } from "react-redux";
import DYNAMIC_LABELS_MAPPING from "../../modules/common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../modules/common/DynamicLabels/useDynamicLabels";
import { tGlobalPopupAction } from "../../modules/common/GlobalPopup/GlobalPopup.reducer";
import { IFetchDataOptions } from "ui-library";
import axios from "../axios";
import styled from "styled-components";
import withRedux from "../redux/withRedux";

export interface IRequest {
  activeRequest: boolean;
  rowIds: Record<number, boolean>;
  failureCallback?: React.Dispatch<React.SetStateAction<boolean>>;
  message?: string;
}

export interface IActiveDeactiveConfirmation {
  activationRequest: IRequest | undefined;
  setActivationRequest: Function;
  setSelectedRows: Function;
  handleFetchData: Function;
  fetchOptions: IFetchDataOptions;
  setEditMode: Function;
  url: any
  // actionObject: any
  // actionType: any
}

export const ModalContentWrapper = styled.div`
  font-size: 14px;
  > div {
    padding-bottom: 2% !important;
  }
`;

const ActivateDeactivateModal = ({
  activationRequest,
  setActivationRequest,
  fetchOptions,
  handleFetchData,
  setSelectedRows,
  setEditMode,
  url,
}: IActiveDeactiveConfirmation) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0]);
  // const dispatch = useDispatch<Dispatch<{actionType}>>();
  // const breadcrumbState = useTypedSelector(state => state.territory.listView.breadcrumbState);
  const toast = useToast();
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
  const handleActivation = async () => {
    if (!activationRequest) {
      return;
    }
    setActivationRequest(undefined);

    const rowIds = Object.keys(activationRequest.rowIds).map((key) => Number(key));
    const payload = rowIds
    try {
      const {
        data: { message, status },
      } = await axios.put(
        url, 
       payload,
        {params:{
          isActive: activationRequest.activeRequest
        }}
      );
      if (status === 200) {
        toast.add(message, "check-round", false);
        handleFetchData(fetchOptions);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        setEditMode(false);
        return;
      }
      throw message;
    } catch (errorMessage) {
      activationRequest.failureCallback &&
        activationRequest.failureCallback(!activationRequest.activeRequest);
      toast.add(
        typeof errorMessage === "string"
          ? errorMessage
          : dynamicLabels.somethingWendWrong,
        "",
        false
      );
    }
  };

  globalPopupDispatch({
    type: "@@globalPopup/SET_PROPS",
    payload: {
      isOpen: true,
      title: dynamicLabels.statusConfirmation,
      onClose: () => {
        activationRequest?.failureCallback &&
          activationRequest?.failureCallback(!activationRequest.activeRequest);
        setActivationRequest(undefined);
      },
      content: (
        <>
          <ModalContentWrapper>
            <div>{activationRequest?.message}</div>
            <div>
              {activationRequest?.activeRequest
                ? dynamicLabels.areYouSureYouWantToMarkAsAcitve
                : dynamicLabels.areYouSureYouWantToMarkAsInactive}
            </div>
          </ModalContentWrapper>
        </>
      ),
      footer: (
        <>
          <IconButton
            iconVariant="icomoon-tick-circled"
            primary
            onClick={() => {
              globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
              handleActivation();
            }}
            id="statusConfirmation--actionBar--ok"
          >
            {dynamicLabels.ok}
          </IconButton>
          <IconButton
            iconVariant="icomoon-close"
            onClick={() => {
              globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
              activationRequest?.failureCallback &&
                activationRequest?.failureCallback(
                  !activationRequest.activeRequest
                );
              setActivationRequest(undefined);
            }}
            id="statusConfirmation--actionBar--cancel"
          >
            {dynamicLabels.cancel}
          </IconButton>
        </>
      ),
    },
  });

  return <></>;
};

export default withRedux(ActivateDeactivateModal);
