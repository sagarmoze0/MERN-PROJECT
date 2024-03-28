import React, { useState, useEffect } from 'react'
import axios from 'axios'

const StatisticsComponent = () => {
    const [statistics, setStatistics] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState('')

    useEffect(() => {
        const currentDate = new Date()
        const currentMonth = (currentDate.getMonth() + 1).toString()
        setSelectedMonth(currentMonth)
    }, [])

    const fetchStatistics = async () => {
        try {
            let monthQueryParam = selectedMonth
            if (!monthQueryParam) {
                const currentDate = new Date()
                const currentMonth = (currentDate.getMonth() + 1).toString()
                monthQueryParam = currentMonth
            }
            
            const response = await axios.get(`http://localhost:3000/api/apitems/statistics?month=${monthQueryParam}`)
            setStatistics(response.data)
        } catch (error) {
            console.error('Error fetching statistics:', error)
        }
    }

    useEffect(() => {
        if (selectedMonth) {
            fetchStatistics()
        }
    }, [selectedMonth])

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value)
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <select value={selectedMonth} onChange={handleMonthChange} className="p-2 m-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
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

            {statistics && (
                <div className="mt-4 p-4 border border-black px-4 py-2 rounded-md">
                    <p className="text-lg">Statistics for month{selectedMonth}:</p>
                    <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
                    <p>Total Sold Items: {statistics.totalSoldItems}</p>
                    <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
                </div>
            )}
        </div>
    )
}

export default StatisticsComponent;
