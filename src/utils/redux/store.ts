import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './rootReducer'
import rootSaga from './rootSaga'
import { useSelector as primitiveSelector } from 'react-redux';

const sagaMiddleware = createSagaMiddleware()
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
// const store = createStore(rootReducer, compose(devToolsEnhancer({})));

// export function useDispatch<A extends Action>(): Dispatch<A> {
//   return store.dispatch
// };

// export function useDispatch<A extends Action = AnyAction>(): Dispatch<A>;
sagaMiddleware.run(rootSaga)

export const useSelector = primitiveSelector
export default store;
