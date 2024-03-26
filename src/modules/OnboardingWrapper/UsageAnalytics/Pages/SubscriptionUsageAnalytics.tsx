import React, { Dispatch, useEffect, useState } from "react";
import { Grid, BreadCrumb, IconDropdown, Button, useToast } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import UsageGraph from "../Components/UsageGraph";
import UsageCard from "../Components/UsageCard";
import { FlexContainer } from "../Services/UsageAnalytics.styles";
import PageTypeButtonsGroup from "../Components/PageTypeButtonsGroup";
import { useDispatch } from "react-redux";
import { ISubscriptionOptions } from "../Services/UsageAnalytics.models";
import { IUsageAnalyticsActions } from "../Services/UsageAnalytics.actions";
import { theme } from "../../../../utils/theme";
import { paramsFromSubscriptionName } from "../Services/Utils/Mappings";
import { getSubscriptionName } from "../Services/Utils/HelperFunctions";
import axios from "../../../../utils/axios";
import apiMappings from "../../../../utils/apiMapping";
import { useHistory } from "react-router-dom";

export const SubscriptionUsageAnalytics = ({ dynamicLabels }: any) => {

  // General Hooks (Dynamic Labels, Redux States, UseDispatch, UseHistory)
  const toast = useToast();
  const dispatch = useDispatch<Dispatch<IUsageAnalyticsActions>>();
  const history = useHistory();

  const subscriptionOptions = history.location.state ? (history.location.state as Object)['subscriptionOptions'] : [];
  const subscriptionMappedData = subscriptionOptions?.map((subscription: ISubscriptionOptions) => {
    return {
      subscriptionId: subscription.subscriptionId,
      label: subscription.clientName,
      value: subscription.clientIds,
      subscriptionName: subscription.subscriptionName
    }
  });

  const userClientId = JSON.parse(localStorage?.getItem("userAccessInfo") || "")["clientId"];
  const defaultOption = subscriptionMappedData?.find((subscription: any) => subscription.value?.find((clientId) => clientId === userClientId));


  // Redux States
  const timeGap = useTypedSelector((state) => state.usageAnalytics.timeGap);
  const fromDate = useTypedSelector(state => state.usageAnalytics.dateRange.fromDate);
  const toDate = useTypedSelector(state => state.usageAnalytics.dateRange.toDate);


  // Local States
  const [dropdownValue, setDropdownValue] = useState(defaultOption?.value);
  const [usageCardData, setUsageCardData] = useState({});
  const [graphData, setGraphData] = useState([]);


  // Utils
  const getSubscriptionIdForClientId = (clientIds: Array<number>) => {

    const tempObject = subscriptionMappedData.find((subscriptionOptions) => subscriptionOptions.value === clientIds)
    return tempObject?.subscriptionId;
  };

  const getSubscriptionUsage = async (subscriptionId) => {
    // To get data params sent are based on selectedOption's subscriptionType i.e. ['RESOURCEBASEED','TRANSACTIONBASED']
    try {
      const subscriptionName = getSubscriptionName("SUBSCRIPTION", subscriptionOptions, dropdownValue);

      const { data: response } = await
        axios.post(
          apiMappings.usageAnalytics.cardData,
          { key: "SUBSCRIPTION", identifier: subscriptionId },
          {
            params: { types: paramsFromSubscriptionName[subscriptionName] },
          }
        );
      
      // Making a mapping to get RESOURCELIMIT and ORDERLIMIT as the first card.
      let rightMapping = {};
      paramsFromSubscriptionName[subscriptionName].split(",").forEach((key: string) => {
        rightMapping[key] = "";
      });

      // Filling data in the temporaryMapping.
      if (response) {
        Object.keys(response).forEach((limitKey) => {
          rightMapping[limitKey] = response[limitKey];
        });

        setUsageCardData(rightMapping);
      }
    } catch (error) {
      toast.add(dynamicLabels.somethingWentWrong, 'warning', false)
      console.log(error);
    }
  };

  const fetchGraphData = async () => {
    try {
      const {
        data: {
          data: { data: response },
        },
      } = await
          axios.post(
            apiMappings.usageAnalytics.getActivityData,
            {
              fromDate: fromDate.toISOString(),
              groupBy: timeGap,
              toDate: toDate.toISOString(),
              clientIds: dropdownValue,
            }
          );

      if (response) {
        setGraphData(response);
        dispatch({
          type: "@@usageAnalytics/SET_GRAPH_DATA",
          payload: response,
        });
      } else {
        setGraphData([]);
        dispatch({
          type: "@@usageAnalytics/SET_GRAPH_DATA",
          payload: [],
        });
      }
    } catch (error) {
      toast.add(dynamicLabels.somethingWentWrong, 'warning', false);
      console.log(error);
    }
  };


  // Effects
  useEffect(() => {
    const subscriptionId = getSubscriptionIdForClientId(dropdownValue);

    dispatch({ type: "@@usageAnalytics/SET_SUBSCRIPTION_ID", payload: subscriptionId });
    dispatch({ type: "@@usageAnalytics/SET_SELECTED_OPTION", payload: dropdownValue });
    getSubscriptionUsage(subscriptionId);
  }, [dropdownValue]);

  useEffect(() => {
    fetchGraphData();
  }, [fromDate, toDate, timeGap, dropdownValue])

  // BreadCrumb
  const breadCrumbOptions = React.useMemo(() => [
    { id: 'USAGEANALYTICS', label: dynamicLabels.usageAnalytics || "Usage Analytics", disabled: true },
  ], [dynamicLabels])

  return (
    <>
      <FlexContainer flexDirection="row" alignItems="center" justifyContent="space-between" margin="15px 0">
        <BreadCrumb options={breadCrumbOptions} />
        <FlexContainer flexDirection="row" height="30px" gap="10px">
          <PageTypeButtonsGroup dynamicLabels={dynamicLabels} />

          {subscriptionMappedData?.length > 1 ? <IconDropdown
            variant='default-dropdown'
            optionList={subscriptionMappedData}
            menuIsOpen={false}
            primary={true}
            width="100%"
            onChange={(value: any) => setDropdownValue(value)}
            isSingleClickOption={true}
            value={dropdownValue}
            optionComponent={({ selectedOption }: any) => {
              return (
                <div style={{ width: "100%", fontSize: "13px", textAlign: "center" }}>
                  <div>{selectedOption?.color}</div>
                  <div>{selectedOption?.label}</div>
                </div>
              )
            }}
          >
            {({
              selectedOption,
              menuIsOpen,
              setMenuIsOpen
            }: any) => {
              return (
                <Button style={{ maxHeight: "30px", width: "200px" }}
                  onClick={() => {
                    setMenuIsOpen(!menuIsOpen)
                  }}
                  color={theme.colors.text.primary}
                  bgColor="white"
                  fullWidth={true}
                >
                  <div className="buttonArrow">{selectedOption?.label}</div>
                </Button>
              )
            }}
          </IconDropdown> : null}
        </FlexContainer>
      </FlexContainer>
      {/* Usage Cards here... */}
      {Object.keys(usageCardData)?.length ? (
        <Grid container spacing="10px">
          {Object.keys(usageCardData)?.map((cardKey) =>
            <Grid item md={6} xs={6} sm={6} className="grid-item" key={cardKey} >
              <UsageCard cardData={usageCardData[cardKey]} cardKey={cardKey} dynamicLabels={dynamicLabels} />
            </Grid>
          )}
        </Grid>
      ) : null}

      {/* Graph ... */}
      <UsageGraph graphData={graphData} dynamicLabels={dynamicLabels} />
    </>
  );
};

