import React, { Dispatch, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid, BreadCrumb, IconDropdown, Button, useToast } from "ui-library";
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import { theme } from '../../../../utils/theme';
import PageTypeButtonsGroup from './../Components/PageTypeButtonsGroup';
import UsageCard from './../Components/UsageCard';
import UsageGraph from './../Components/UsageGraph';
import { IUsageAnalyticsActions } from './../Services/UsageAnalytics.actions';
import { IClientOptions } from './../Services/UsageAnalytics.models';
import { FlexContainer } from './../Services/UsageAnalytics.styles';
import { getSubscriptionName } from './../Services/Utils/HelperFunctions';
import { paramsFromSubscriptionName } from './../Services/Utils/Mappings';

const ClientUsageAnalytics = ({ dynamicLabels }: any) => {

  // General Hooks (Dynamic Labels, Redux States, UseDispatch, UseHistory)
  const toast = useToast();
  const dispatch = useDispatch<Dispatch<IUsageAnalyticsActions>>();
  const history = useHistory();

  const clientOptions = history.location.state ? (history.location.state as Object)['clientOptions'] : [];
  const clientMappedData = clientOptions?.map((client: IClientOptions) => {
    return {
      isActiveFl: client.isActiveFl,
      value: client.clientId,
      label: client.name,
      region: client.region,
      subscriptionName: client.subscriptionName
    }
  });

  const userClientId = JSON.parse(localStorage?.getItem("userAccessInfo") || "")["clientId"];
  const defaultOption = clientMappedData?.find((client: any) => userClientId === client?.value);


  // Redux States
  const timeGap = useTypedSelector((state) => state.usageAnalytics.timeGap);
  const minDate = useTypedSelector(state => state.usageAnalytics.dateRange.fromDate);
  const maxDate = useTypedSelector(state => state.usageAnalytics.dateRange.toDate);


  // Local States
  const [dropdownValue, setDropdownValue] = useState(defaultOption?.value);
  const [usageCardData, setUsageCardData] = useState({});
  const [graphData, setGraphData] = useState([]);


  // Utils
  const getClientUsage = async () => {
    try {
      const subscriptionName = getSubscriptionName("CLIENT", clientOptions, dropdownValue);

      // To get data params sent are based on selectedOption's subscriptionType i.e. ['RESOURCEBASEED','TRANSACTIONBASED']
      const { data: response } = await
        axios.post(
          apiMappings.usageAnalytics.cardData,
          { key: "CLIENT", identifier: dropdownValue?.toString() },
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
              fromDate: minDate.toISOString(),
              groupBy: timeGap,
              toDate: maxDate.toISOString(),
              clientIds: [dropdownValue],
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
      toast.add(dynamicLabels.somethingWentWrong, 'warning', false)
      console.log(error);
    }
  }

  // Effects
  useEffect(() => {
    dispatch({ type: "@@usageAnalytics/SET_SELECTED_OPTION", payload: dropdownValue });
    getClientUsage();
  }, [dropdownValue])

  useEffect(() => {
    fetchGraphData();
  }, [minDate, maxDate, timeGap, dropdownValue])


  const breadCrumbOptions = React.useMemo(() => [
    { id: 'USAGEANALYTICS', label: dynamicLabels.usageAnalytics || "Usage Analytics", disabled: true },
  ], [dynamicLabels])

  return (
    <>
      <FlexContainer flexDirection="row" alignItems="center" justifyContent="space-between" margin="15px 0">
        <BreadCrumb options={breadCrumbOptions} />
        <FlexContainer flexDirection="row" height="30px" gap="10px">
          <PageTypeButtonsGroup dynamicLabels={dynamicLabels} />

          {clientMappedData?.length > 1 ? <IconDropdown
            variant='default-dropdown'
            optionList={clientMappedData}
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
                <Button style={{ maxHeight: "30px", width: "260px" }}
                  onClick={() => {
                    setMenuIsOpen(!menuIsOpen)
                  }}
                  color={theme.colors.text.primary}
                  bgColor="#white"
                  fullWidth={true}
                >
                  <div className="buttonArrow">{selectedOption?.label}</div>
                </Button>
              )
            }}
          </IconDropdown> : null}
        </FlexContainer>
      </FlexContainer>

      {Object.keys(usageCardData)?.length ? (
        <Grid container spacing="10px">
          {Object.keys(usageCardData).map((cardKey) =>
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
}

export default ClientUsageAnalytics