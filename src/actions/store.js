import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // Importing redux-thunk middleware
import rootReducer from '../reducers/rootReducer'; // Importing the root reducer

// Creating the Redux store with middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store; // Exporting the configured store
