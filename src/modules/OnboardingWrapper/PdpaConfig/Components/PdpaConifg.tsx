import React, { Dispatch } from "react"
import { MemoryRouter, Route, Switch, useHistory } from "react-router-dom"
import {
  Card, Grid, IconButton, BreadCrumb, Box , Tooltip
} from 'ui-library'
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { withReactOptimized } from "../../../../utils/components/withReact"
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import PdpaConfigListView from "./PdpaConfigListView";
import AddPdpaForm from "./PdpaCustomeForm/AddPdpaForm";
import { useDispatch } from "react-redux";
import { PdpaConfigActions } from "./PdpaConfig.action";

export const basename = '';
const PdpaConfig = () => {
  const history = useHistory();
  const pageType = useTypedSelector(state => state.consentHandling.pageType )
  const pageLabels = useTypedSelector(state => state.pageLabels.consentConfiguration);
  const viewType = useTypedSelector(state => state.consentHandling.listview.consentAct.viewType)
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.consentForm}`);
  const dispatch = useDispatch<Dispatch<PdpaConfigActions>>();

  const breadCrumbOptions = React.useMemo(() => {
    let parentBreadCrumb = [
      {
        id: 'CONSENT_CONFIGURATION',
        label: dynamicLabels.consentConfiguration,
        disabled: pageType === "addConsent" || pageType === "updateConsent" ? false : true
      },
    ];
    switch (pageType) {
      case  "listpage" :
        return parentBreadCrumb;
      case  "addConsent" :
        return [
           ...parentBreadCrumb,
            {
              id: 'ADD_CONSENT_CONFIGURATION',
              label: `Add ${dynamicLabels.consentConfiguration}`,
              disabled: true,
            },
        ] ;
        case  "updateConsent" :
          return [
           ...parentBreadCrumb,
            {
              id: 'UPDATE_CONSENT_CONFIGURATION',
              label: `Update ${dynamicLabels.consentConfiguration}`,
              disabled: true,
            },
          ];
          default:  
           return parentBreadCrumb;
  }
  }, [dynamicLabels,pageType]);

  const handleBreadcrumbChange = (id) => {
    if(id === 'CONSENT_CONFIGURATION'){
      dispatch({
        type: '@@PROTECTIONCONFIG/SET_PAGETYPE',
        payload: 'listPage'
      })
      dispatch({
        type:"@@PROTECTIONCONFIG/SET_CONSENT_FORM_VIEW_TYPE",
        payload:{viewType: "ListLoaded"}
       })
      history.push('/');
    }
  }

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="space-between" style={{ width: "100%" }} py="15px">
        <BreadCrumb options={breadCrumbOptions}  onClick={handleBreadcrumbChange} />
        <Box display="flex" justifyContent="space-evenly" horizontalSpacing="10px">
        {pageLabels?.buttons.add && pageType !== "addConsent" && pageType !== "updateConsent" && (
           <Tooltip
           messagePlacement='start'
           tooltipDirection='left'
           hover
           message={dynamicLabels.addConsentForm || "Click here to add the selected Consent Form"}
           >
              <IconButton
                intent="page"
                id="ConsentFormConfiglistView-actionBar-add"
                data-tip
                data-for="tt-user"
                iconVariant="icomoon-add"
                onClick={() => {
                  dispatch({
                    type: '@@PROTECTIONCONFIG/SET_PAGETYPE',
                    payload: 'addConsent'
                })
                  dispatch({ type: "@@PROTECTIONCONFIG/SET_VIEW_TYPE", payload: {viewType:"Form"} })
                  history.push({ pathname: "/addPdpaForm" });
                }}
              >
                {dynamicLabels.Add}
              </IconButton>

            </Tooltip>
          )}
        </Box>
      </Box>

     
      <Box display='flex' flexDirection='column' style={{ width: '100%', height: '90vh', marginRight: '2px' }}>
      <Grid container spacing={5} style={{ flexGrow: 1,  width: '100%', boxShadow: '0 2px 20px -10px #000' }}> {/* overflow: 'hidden'*/}
      <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
               <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                <Switch>
                  <Route path={`${basename}/addPdpaForm`}><AddPdpaForm /></Route>
                  <Route path={`${basename}/`}><PdpaConfigListView /></Route>
                </Switch>
              </Card>
            </Grid>
          </Grid>
      </Box>

    </React.Fragment>
  )
}

const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }


export default withReactOptimized(withMemoryRouter(PdpaConfig));