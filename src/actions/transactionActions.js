import axios from 'axios';

// Action types
export const SET_MONTH = 'SET_MONTH';
export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_FILTERS = 'SET_FILTERS';
export const SET_SORT = 'SET_SORT';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_LOADING = 'SET_LOADING';

// Action creators for setting various states
export const setMonth = (month) => ({
    type: SET_MONTH,
    payload: month,
});

export const setSearchText = (text) => ({
    type: SET_SEARCH_TEXT,
    payload: text,
});

export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page,
});

export const setFilters = (filters) => ({
    type: SET_FILTERS,
    payload: filters,
});

export const setSort = (sort) => ({
    type: SET_SORT,
    payload: sort,
});

export const setTransactions = (transactions) => ({
    type: SET_TRANSACTIONS,
    payload: transactions,
});

export const setLoading = (loading) => ({
    type: SET_LOADING,
    payload: loading,
});

// Thunk action for loading transactions asynchronously
export const loadTransactions = () => async (dispatch, getState) => {
    // Extracting necessary state variables
    const { month, searchText, filters, sort, currentPage } = getState().transaction;
    
    // Dispatching action to set loading state to true
    dispatch(setLoading(true));
    
    try {
        // Fetching transactions from the API
        const response = await axios.get('/api/apitems/transactions', {
            params: {
                month,
                searchText,
                filters,
                sort,
                page: currentPage,
            },
        });
        
        // Dispatching action to set fetched transactions
        dispatch(setTransactions(response.data));
    } catch (error) {
        // Logging error if fetching transactions fails
        console.error('Error fetching transactions:', error);
    } finally {
        // Dispatching action to set loading state to false regardless of success or failure
        dispatch(setLoading(false));
    }
};
