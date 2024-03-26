import React, {Suspense} from 'react'
import { withReactOptimized } from '../../../../utils/components/withReact'
import { MemoryRouter, Switch, Route } from 'react-router-dom'

import { Loader, Position } from 'ui-library'

export const basename = ''

const ManifestConfigurationPage = React.lazy(() => import('./ManifestConfiguration'));

function ManifestConfigurationView() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center />
        </Position>}>
        <ManifestConfigurationPage />
      </Suspense>
    </div>
  );
}



const ManifestConfigurationEntry = ()=> {
    return (
    <div>
      <Switch>
        <Route exact path={`${basename}/`}><ManifestConfigurationView></ManifestConfigurationView></Route>
      </Switch> 
    </div>  
    ) 
}


const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }

export default withReactOptimized(withMemoryRouter(ManifestConfigurationEntry));




