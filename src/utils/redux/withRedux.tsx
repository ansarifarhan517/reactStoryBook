import React from 'react'

import { Provider } from "react-redux";
import store from "./store";

const withRedux = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) =>
    <Provider store={store}>
        <Component {...props as P} />
    </Provider>


export default withRedux