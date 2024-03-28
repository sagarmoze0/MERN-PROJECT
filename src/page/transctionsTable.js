import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TransactionsListing = () => {
    const [month, setMonth] = useState(3);
    const [searchText, setSearchText] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTransactions();
    }, [month, searchText, currentPage]);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/apitems/transactions`, {
                params: {
                    month,
                    search: searchText,
                    page: currentPage
                }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchTransactions = () => {
        setCurrentPage(1);
        loadTransactions();
    };

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <select id="month-select" value={month} onChange={e => setMonth(e.target.value)} className="border rounded px-2 py-1 mb-4">
                <option value="">Select Month</option>
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

            <div className="flex mb-4">
                <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search transaction..." className="border rounded-l px-2 py-1 flex-grow focus:outline-none" />
                <button onClick={searchTransactions} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-r flex items-center transition duration-300 ease-in-out transform hover:scale-105">
                    <FaSearch className="mr-1" /> Search
                </button>
            </div>

            <table className="w-full c  bg-yellow-200 borderw-full border-collapse border border-black">
                <thead>
                    <tr>
                        <th className="border border-black px-4 py-2">ID</th>
                        <th className="border border-black px-4 py-2">Title</th>
                        <th className="border border-black px-4 py-2">Description</th>
                        <th className="border border-black px-4 py-2">Price</th> 
                        <th className="border border-black px-4 py-2">Category</th>
                        <th className="border border-black px-4 py-2">Sold</th>
                        <th className="border border-black px-4 py-2">Image</th>
                    </tr>
                </thead>
                <tbody> 
                    {loading ? (
                        <tr>  
                            <td colSpan="7" className="text-right">Loading...</td>
                        </tr>
                    ) : (
                        transactions.map((transaction, index) => (
                            <tr key={transaction.id || index}>
                                <td className="border border-black px-4 py-2 text-left">{transaction.id}</td>
                                <td className="border border-black px-4 py-2 text-left">{transaction.title}</td>
                                <td className="border border-black px-4 py-2 text-left">{transaction.description}</td>
                                <td className="border border-black px-4 py-2 text-left">{transaction.price}</td>
                                <td className="border border-black px-4 py-2 text-left">{transaction.category}</td>
                                <td className="border border-black px-4 py-2 text-left">{transaction.sold !== undefined ? transaction.sold.toString() : ''}</td>
                                <td className="border border-black px-4 py-2">
                                    {transaction.image ? <img src={transaction.image} alt="Transaction" className="h-20 w-auto object-cover" /> : 'N/A'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="mt-4 flex justify-between">
                <button onClick={previousPage} disabled={currentPage === 1} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 flex items-center transition duration-300 ease-in-out transform hover:scale-105">
                    <FaChevronLeft className="mr-1" /> Previous
                </button>
                <button onClick={nextPage} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center transition duration-300 ease-in-out transform hover:scale-105">
                    Next <FaChevronRight className="ml-1" />
                </button>
            </div>
        </div>
    );
}

export default TransactionsListing;
