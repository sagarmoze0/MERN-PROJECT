import {
    SET_MONTH,
    SET_SEARCH_TEXT,
    SET_CURRENT_PAGE,
    SET_FILTERS,
    SET_SORT,
    SET_TRANSACTIONS,
    SET_LOADING,
} from '../actions/transactionActions';

// Initial state for transactions
const initialState = {
    month: '',          // Selected month for filtering
    searchText: '',     // Search text entered by user
    filters: {},        // Additional filters applied to transactions
    sort: '',           // Sorting criteria for transactions
    transactions: [],  // Array of transactions
    currentPage: 1,     // Current page number for pagination
    loading: false,     // Loading state
};

// Reducer function for transactions
const transactionReducer = (state = initialState, action) => {
    switch (action.type) {
        // Action to set the selected month
        case SET_MONTH:
            return { ...state, month: action.payload };

        // Action to set the search text
        case SET_SEARCH_TEXT:
            return { ...state, searchText: action.payload };

        // Action to set the current page number
        case SET_CURRENT_PAGE:
            return { ...state, currentPage: action.payload };

        // Action to set additional filters
        case SET_FILTERS:
            return { ...state, filters: action.payload };

        // Action to set the sorting criteria
        case SET_SORT:
            return { ...state, sort: action.payload };

        // Action to set the array of transactions
        case SET_TRANSACTIONS:
            return { ...state, transactions: action.payload };

        // Action to set the loading state
        case SET_LOADING:
            return { ...state, loading: action.payload };

        // Default case returns the current state
        default:
            return state;
    }
};

export default transactionReducer;
