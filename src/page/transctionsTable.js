import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as transactionActions from '../actions/transactionActions';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TransactionsListing = ({
    month, searchText, transactions, currentPage, loading, actions
}) => {
    // Effect to load transactions when month, search text, or current page changes
    useEffect(() => {
        // Set initial month to current month
        const currentMonth = new Date().getMonth() + 1;
        actions.setMonth(currentMonth);
        actions.loadTransactions();
    }, [searchText, currentPage]);
    // Function to search transactions
    const searchTransactions = () => {
        actions.setCurrentPage(1);
        actions.loadTransactions();
    };

    // Function to navigate to the next page
    const nextPage = () => {
        actions.setCurrentPage(currentPage + 1);
        actions.loadTransactions();
    };

    // Function to navigate to the previous page
    const previousPage = () => {
        if (currentPage > 1) {
            actions.setCurrentPage(currentPage - 1);
            actions.loadTransactions();
        }
    };

    // State to control whether to show full description or not
    const [showFullDescription, setShowFullDescription] = useState(false);

   
    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Month select */}
            <select
                id="month-select"
                value={month}
                onChange={(e) => actions.setMonth(Number(e.target.value))}
                className="border rounded px-2 py-1 mb-4"
            >
               <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>

            {/* Search bar */}
            <div className="flex mb-4">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => actions.setSearchText(e.target.value)}
                    placeholder="Search transaction..."
                    className="border rounded-l px-2 py-1 flex-grow focus:outline-none"
                />
                <button
                    onClick={searchTransactions}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-r flex items-center transition duration-300 ease-in-out transform hover:scale-105"
                >
                    <FaSearch className="mr-1" /> Search
                </button>
            </div>

            {/* Transaction grid */}
            <div className="grid grid-cols-3 gap-4"
            onClick={searchTransactions}>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className="border p-4 flex flex-col items-center">
                            {/* Image container */}
                            <div className="image-container w-full h-48 overflow-hidden rounded-lg shadow-lg mb-4">
                                <img
                                    src={transaction.image}
                                    alt="Transaction"
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Title */}
                            <div className="text-lg font-bold text-center">{transaction.title}</div>
                            {/* Description */}
                            <div className="text-sm text-center overflow-hidden">
                                {showFullDescription ? (
                                    transaction.description
                                ) : (
                                    <>
                                        {transaction.description.length > 100 ?
                                            <>
                                                {transaction.description.substring(0, 100)}...
                                                <span
                                                    className="text-blue-500 cursor-pointer"
                                                    onClick={() => setShowFullDescription(true)}
                                                >
                                                    {' Read More'}
                                                </span>
                                            </>
                                            :
                                            transaction.description
                                        }
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between">
                <button
                    onClick={previousPage}
                    disabled={currentPage === 1}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 flex items-center transition duration-300 ease-in-out transform hover:scale-105"
                >
                    <FaChevronLeft className="mr-1" /> Previous
                </button>
                <button
                    onClick={nextPage}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Next <FaChevronRight className="ml-1" />
                </button>
            </div>
        </div>
    );
};

// Map state to props
const mapStateToProps = (state) => ({
    month: state.transaction.month,
    searchText: state.transaction.searchText,
    transactions: state.transaction.transactions,
    currentPage: state.transaction.currentPage,
    loading: state.transaction.loading,
});

// Map dispatch to props
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(transactionActions, dispatch),
});

// Connect component to Redux store
export default connect(mapStateToProps, mapDispatchToProps)(TransactionsListing);
