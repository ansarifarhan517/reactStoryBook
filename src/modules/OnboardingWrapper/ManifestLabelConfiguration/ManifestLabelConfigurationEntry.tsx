import React, {Suspense} from 'react'
import { withReactOptimized } from '../../../utils/components/withReact'
import { MemoryRouter, Switch, Route } from 'react-router-dom'
import ManifestLabelConfiguration from './ManifestLabelConfiguration'

import { Loader, Position } from 'ui-library'

export const basename = ''

const ManifestLabelConfigurationForm = React.lazy(() => import('./Form/ManifestLabelConfigurationForm'));

function ItemConfigurationFormLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center />
        </Position>}>
        <ManifestLabelConfigurationForm />
      </Suspense>
    </div>
  );
}



const ManifestLabelConfigurationEntry = ()=> {
    return (
    <div>
      <Switch>
       
       
         <Route exact path={`${basename}/addManifestLabel`}><ItemConfigurationFormLazy /></Route>
        <Route exact path={`${basename}/updateManifestLabel/:manifestLabelId`}><ItemConfigurationFormLazy /></Route>
        <Route exact path={`${basename}/`}><ManifestLabelConfiguration /></Route>
      </Switch> 
    </div>  
    ) 
}


const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }

export default withReactOptimized(withMemoryRouter(ManifestLabelConfigurationEntry));




