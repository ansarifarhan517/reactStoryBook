import React , {Suspense}from 'react'
import { withReactOptimized } from '../../../../../utils/components/withReact'
import { MemoryRouter, Switch, Route } from 'react-router-dom'
import AccessProfileListView from './AccessProfileListView'
import {
  Loader,
  Position
} from "ui-library";

export const basename = ''


const AccessProfileForm = React.lazy(() => import('../Form/AccessProfileForm'));

function AccessProfileFormLazy() {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center />
                </Position>}>
                <AccessProfileForm />
            </Suspense>
        </div>
    );
}

const AccessProfileEntry = ()=> {
    return <div>
    <Switch>
    <Route path={`${basename}/addProfile`}><AccessProfileFormLazy /></Route>
    <Route path={`${basename}/updateAccessProfile/:accessProfileId`}><AccessProfileFormLazy /></Route>
    <Route path={`${basename}/`}><AccessProfileListView /></Route>
    <Route path='/'><AccessProfileListView /></Route>
    </Switch> 
    </div>   
}


const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }

export default withReactOptimized(withMemoryRouter(AccessProfileEntry));
