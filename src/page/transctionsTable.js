import React, { useState, useEffect } from 'react'
import axios from 'axios'
import App from '../App'

const TransactionsListing = () => {
    const [month, setMonth] = useState(3)
    const [searchText, setSearchText] = useState('')
    const [transactions, setTransactions] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    
    useEffect(() => {
        loadTransactions()
    }, [month, searchText, currentPage])


    const loadTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/apitems/transactions', {
                params: {
                    month,
                    search: searchText,
                    page: currentPage
                }
            });
            setTransactions(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

       

    const searchTransactions = () => {
        setCurrentPage(1)
        loadTransactions()
    }

    const nextPage = () => {
        setCurrentPage(currentPage + 1)
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

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

            <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search transaction..." className="border rounded px-2 py-1 mb-4" />
            <button onClick={searchTransactions} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">Search</button>

            <table className="w-full">
                <thead>
                    <tr>
                    <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Sold</th>
                        <th className="px-4 py-2">Image</th>
                    </tr>
                </thead>
                <tbody>
                {transactions.map((transaction,index) => (
                        console.log(transaction),

    <tr key={transaction.id || index}>
         <td className="border border-black px-4 py-2">{transaction.id}</td>
                            <td className="border border-black px-4 py-2">{transaction.title}</td>
                            <td className="border border-black px-4 py-2">{transaction.description}</td>
                            <td className="border border-black px-4 py-2">{transaction.price}</td>
                            <td className="border border-black px-4 py-2">{transaction.category}</td>
                            <td className="border border-black px-4 py-2">{transaction.sold !== undefined ? transaction.sold.toString() : ''}</td>
                            <td className="border border-black px-4 py-2">
                            {transaction.image ? 
                <img src={transaction.image} alt="Transaction" className="h-full w-full object-cover" /> : 'N/A'}
                          </td>
    </tr>
))}

                </tbody>
            </table>

            <div className="mt-4">
                <button onClick={previousPage} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">Previous</button>
                <button onClick={nextPage} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Next</button>
            </div>
        </div>
    )
}

export default TransactionsListing;
