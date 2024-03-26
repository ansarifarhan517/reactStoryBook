import React ,{ Suspense } from 'react'
// import {OrganizatonRoleMasterContainer} from './styles'
import { withReactOptimized } from '../../../../../utils/components/withReact'
import { MemoryRouter, Switch, Route } from 'react-router-dom'
import OrganizationRoleListView from './OrganizationRoleListView'
import { Loader, Position } from 'ui-library'

export const basename = ''

const OrganizationRoleForm = React.lazy(() => import('../Form/OrganizationRoleForm'));

function OrganizationRoleFormLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center />
        </Position>}>
        <OrganizationRoleForm />
      </Suspense>
    </div>
  );
}

const OrganizationRoleEntry = () => {

  
  return (
    <Switch>
      <Route path={`${basename}/organizationRoles`}><OrganizationRoleFormLazy/></Route>
      <Route path={`${basename}/updateorganizationRole/:orgRoleId`}><OrganizationRoleFormLazy /></Route>
      <Route path={`${basename}/`}><OrganizationRoleListView /></Route>
    </Switch>
  )
}


const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }

export default withReactOptimized(withMemoryRouter(OrganizationRoleEntry));
