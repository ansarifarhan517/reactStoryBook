import React, {Suspense} from 'react'
import { withReactOptimized } from '../../../../../utils/components/withReact'
import { MemoryRouter, Switch, Route } from 'react-router-dom'
import UserManagementListView from './UserManagementListView'
import { Loader, Position } from 'ui-library'

export const basename = ''

const UserForm = React.lazy(() => import('../Form/UserForm'));

function UserFormFormLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center />
        </Position>}>
        <UserForm />
      </Suspense>
    </div>
  );
}



const UserManagementEntry = () => {
    return <div>
      <Switch>
        <Route path={`${basename}/addUser`}><UserFormFormLazy /></Route>
        <Route path={`${basename}/updateUser/:userId`}><UserFormFormLazy /></Route>
        <Route path={`${basename}/`}><UserManagementListView /></Route>
      </Switch> 
    </div>   
}


const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }

export default withReactOptimized(withMemoryRouter(UserManagementEntry));
