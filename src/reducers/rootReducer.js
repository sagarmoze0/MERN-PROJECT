import { combineReducers } from 'redux';
import transactionReducer from './transactionReducer'; // Importing the transaction reducer

// Combining reducers into root reducer
const rootReducer = combineReducers({
    transaction: transactionReducer, // Transaction reducer for managing transaction-related state
});

export default rootReducer; // Exporting the root reducer
