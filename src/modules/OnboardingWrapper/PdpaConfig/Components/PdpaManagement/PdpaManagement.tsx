import React, { Dispatch, useEffect } from "react"
import { MemoryRouter, Switch, Route } from 'react-router-dom'
import { withReactOptimized } from "../../../../../utils/components/withReact";
import { BreadCrumb, Box} from 'ui-library'
import PdpaManagementAcc from "./PdpaManagementAcc";
import AddConsent from "./AddConsent/AddConsent";
import { useDispatch } from "react-redux";
import { ConsentManagementActions } from "./ConsentManagement.action";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";

export const basename = ''

const PdpaManagement = () => {
    const dispatch = useDispatch<Dispatch<ConsentManagementActions>>();
    const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.consentManagement}`);

    const breadCrumbOptions = React.useMemo(() => {
        return [
          {
            id: 'PDPA',
            label: dynamicLabels.consentManagement,
            disabled: true,
          },
        ]
      }, [dynamicLabels]);

    useEffect(() => {
      return () => { dispatch({type:"@@consentManagement/RESET_CONSENT_MANAGEMENT_DATA"}); }
    },[]);
      

  return (
        <Switch>
          <Route exact path={`${basename}/`}>
            <Box style={{display:"flex", flexDirection:"column", minHeight:"inherit"}}>
              <Box display="flex" justifyContent="space-between" style={{ width: "100%" }} py="15px"><BreadCrumb options={breadCrumbOptions} /></Box>
              <AddConsent/>
            </Box>
          </Route>
          <Route path={`${basename}/:consent`}><PdpaManagementAcc /></Route>
        </Switch>
  )

  }

const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
    (props: P) => {
        return <MemoryRouter><Component {...props as P} /></MemoryRouter>
    }
export default withReactOptimized(withMemoryRouter(PdpaManagement))