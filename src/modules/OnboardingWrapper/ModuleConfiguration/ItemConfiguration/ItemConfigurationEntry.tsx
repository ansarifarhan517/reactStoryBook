import React, {Suspense} from 'react'
import { withReactOptimized } from '../../../../utils/components/withReact'
import { MemoryRouter, Switch, Route } from 'react-router-dom'
import ItemConfigurationListView from './ItemConfiguration'

import { Loader, Position } from 'ui-library'

export const basename = ''

const ItemConfigurationForm = React.lazy(() => import('./Form/ItemConfigurationForm'));

function ItemConfigurationFormLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center />
        </Position>}>
        <ItemConfigurationForm />
      </Suspense>
    </div>
  );
}



const ItemConfigurationEntry = ()=> {
    return (
    <div>
      <Switch>
       
       
         <Route exact path={`${basename}/addItem`}><ItemConfigurationFormLazy /></Route>
        <Route exact path={`${basename}/updateItem/:itemId`}><ItemConfigurationFormLazy /></Route>
        <Route exact path={`${basename}/`}><ItemConfigurationListView /></Route>
      </Switch> 
    </div>  
    ) 
}


const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }

export default withReactOptimized(withMemoryRouter(ItemConfigurationEntry));




