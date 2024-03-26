import React, { Dispatch } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  DropDown,
  IconButton,
  InlinePopup,
  Loader,
  Position,
  Tooltip,
  useToast,
  FontIcon,
} from "ui-library";
import { ILogiAPIResponse } from "../../../../utils/api.interfaces";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import ChipsContainer from "../../../../utils/components/Chips/ChipsContainer";
import {
  CenteredContentWrapper,
  NumberCountWrapper,
} from "../../../../utils/components/NumberCount";
import { sendGA } from "../../../../utils/ga";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { tPayoutProfilesActions } from "../PayoutListView/Store/PayoutProfile.actions";
import { ChipWrapper } from "../PayoutProfileForm/PayoutProfileForm.styles";

export interface IAttachToPayoutProfileProps {
  linkedBranchIds: number[];
  profileId: number;
}

const AttachBranchToPayoutProfile = ({
  linkedBranchIds,
  profileId,
}: IAttachToPayoutProfileProps) => {
  const dispatch = useDispatch<Dispatch<tPayoutProfilesActions>>();
  const branchLookup = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.branchAttached
  );
  const branchLookupMap = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.branchAttachedMap
  );

  const listParams = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.listParams
  );

  const branchToProfileMapping = useTypedSelector(
    (state) =>
      state.deliveryAssociatePayout.listView?.branchProfileMapping
  );

  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);

  const toast = useToast();
  const [isAddMode, setIsAddMode] = React.useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = React.useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = React.useState<
    number | undefined
  >();
  const [branchWarning, setBranchWarning] = React.useState<string>("");

  const branchDropdownOptions = React.useMemo(() => {
    const alreadyLinkedToThisProfile = new Set();

    linkedBranchIds?.forEach((linkedId) => {
      alreadyLinkedToThisProfile.add(linkedId);
    });

    return branchLookup?.filter(
      (option) => !alreadyLinkedToThisProfile.has(option.value)
    );
  }, [branchLookup, linkedBranchIds]);

  const linkageInformation = React.useMemo(() => {
    if (!linkedBranchIds?.length) {
      return (
        dynamicLabels.noBranchAttachedToPayoutToolTip ||
        "No Branch is attached to this Payout profile."
      );
    } else {
      return (
        dynamicLabels.branchAttachedToPayoutToolTip ||
        "Branch is attached to this Payout profile."
      );
    }
  }, [linkedBranchIds]);

  const getWarningNote = (profileName) =>
    `Note: ${dynamicLabels.branch_s} is already linked to ${profileName} ${dynamicLabels.payout_s} profile.`;

  const handleAddClick = React.useCallback(() => {
    sendGA("Payout Configuration", "Open Link Branch Form");
    setIsAddMode(true);
  }, []);

  const handleCancel = React.useCallback(() => {
    setIsAddMode(false);
  }, []);

  const handleSave = async () => {
    sendGA("Payout Configuration", "Link Branch");
    setIsFormLoading(true);
    try {
      const { data: response } = await axios.put<ILogiAPIResponse<boolean>>(
        apiMappings.payments.deliveryAssociatePayout.linkBranch,
        {
          id: profileId,
          linkedBranchIds: [dropdownValue],
        }
      );

      if (!response.hasError && response.status === 200) {
        toast.add(
          response.message || "Payout profile mapped with branch success",
          "check-round",
          false
        );
        dispatch({
          type: "@@PAYOUTS/FETCH_LISTVIEW_DATA",
          payload: { ...listParams },
        });
        setIsAddMode(false);
      }
    } catch (errorResponse: any) {
      console.log(errorResponse);
      toast.add(
        errorResponse?.message ||
          errorResponse?.response?.message ||
          dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const delinkBranch = async (branchIdToDelink: number) => {
    setIsFormLoading(true);
    try {
      const { data: response } = await axios.put<ILogiAPIResponse<boolean>>(
        apiMappings.payments.deliveryAssociatePayout.linkBranch,
        {
          id: profileId,
          delinkedBranchIds: [branchIdToDelink],
        }
      );

      if (!response.hasError && response.status === 200) {
        toast.add(
          response.message || "Payout profile mapped with branch success",
          "check-round",
          false
        );
        dispatch({
          type: "@@PAYOUTS/FETCH_LISTVIEW_DATA",
          payload: { ...listParams },
        });
        setIsAddMode(false);
      } else {
        throw response;
      }
    } catch (errorResponse: any) {
      console.log(errorResponse);
      toast.add(
        errorResponse?.message ||
          errorResponse?.response?.message ||
          dynamicLabels?.somethingWendWrong,
        "warning",
        false
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const isBranchTagged = (branchId: any) => {
    return branchToProfileMapping.has(branchId)
      ? branchToProfileMapping.get(branchId)
      : false;
  };

  const handleDropdownChange = (branchId: any) => {
    setDropdownValue(branchId);
    if (isBranchTagged(branchId)) {
      const warningNote = getWarningNote(isBranchTagged(branchId));
      setBranchWarning(warningNote);
    }else{
      setBranchWarning("");
    }
  };

  return (
    <InlinePopup
      id="link-popup"
      title={dynamicLabels?.attachedBranches || "Attached Branches"}
      isOpen={false}
      width={500}
      height={300}
      style={{ margin: "5px 0px" }}
      content={
        <Box p="15px" bgColor="white">
          <Box style={{ color: "grey", fontSize: 13 }} mb="15px">
            {linkageInformation}
          </Box>
          {(linkedBranchIds?.length || 0) > 0 && (
            <ChipsContainer>
              {linkedBranchIds?.map((id) => (
                <Box m="5px" display="inline-block" key={id}>
                  <ChipWrapper>
                    {branchLookupMap[id]?.name || id}
                    <IconButton
                      iconVariant="delete-thin"
                      iconSize={10}
                      color="error.main"
                      onClick={() => delinkBranch(id)}
                      intent="default"
                      onlyIcon
                    />
                  </ChipWrapper>
                </Box>
              ))}
            </ChipsContainer>
          )}

          <Position type="relative">
            {isFormLoading && <Loader center fadeBackground />}
            {isAddMode && (
              <Box fullWidth mt="15px">
                <DropDown
                  placeholder={dynamicLabels?.branch_s || "Branch"}
                  label={dynamicLabels?.branch_s || "Branch"}
                  variant="form-select"
                  onChange={(value: any) => handleDropdownChange(value)}
                  optionList={branchDropdownOptions}
                />
                {/* Validation for the branch should come here. */}
                {branchWarning ? (
                  <Box
                    flexDirection="row"
                    display="flex"
                    alignItems="flex-start"
                    style={{
                      fontSize: 12,
                      gap: "5px",
                      padding: "5px 0",
                      wordBreak: "break-all",
                      lineHeight: "12px",
                    }}
                  >
                    <FontIcon
                      variant="icomoon-warning-circled"
                      color="error.main"
                      size="xs"
                    />
                    {branchWarning}
                  </Box>
                ) : null}
              </Box>
            )}
            <Box
              mt="15px"
              display="flex"
              fullWidth
              justifyContent="flex-end"
              horizontalSpacing="10px"
            >
              {isAddMode ? (
                <>
                  <IconButton
                    iconVariant="icomoon-save"
                    primary
                    onClick={handleSave}
                    disabled={!dropdownValue}
                  >
                    {dynamicLabels.save}
                  </IconButton>
                  <IconButton
                    iconVariant="icomoon-close"
                    onClick={handleCancel}
                  >
                    {dynamicLabels.cancel}
                  </IconButton>
                </>
              ) : (
                <Tooltip
                  hover
                  message={dynamicLabels?.linkBranch}
                  tooltipDirection="bottom"
                >
                  <IconButton
                    iconVariant="icomoon-add"
                    onClick={handleAddClick}
                  >
                    {dynamicLabels?.add}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Position>
        </Box>
      }
    >
      <Tooltip message={linkageInformation} hover>
        <CenteredContentWrapper
          onClick={() => {
            sendGA("Payout Configuration", "Open Linked Branches Pop-up");
          }}
        >
          <NumberCountWrapper>
            {linkedBranchIds?.length}
          </NumberCountWrapper>
        </CenteredContentWrapper>
      </Tooltip>
    </InlinePopup>
  );
};

export default AttachBranchToPayoutProfile;
