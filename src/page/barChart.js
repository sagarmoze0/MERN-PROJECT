import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Chart from 'chart.js/auto'

const BarChart = () => {
    const [month, setMonth] = useState('')
    const [chartData, setChartData] = useState([])
    const myChartRef = useRef(null)

    useEffect(() => {
        const currentDate = new Date()
        const currentMonth = (currentDate.getMonth() + 1).toString()
        setMonth(currentMonth);
    }, [])

    useEffect(() => {
        if (month) {
            fetchData()
        }
    }, [month])

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/apitems/bar-chart?month=${month}`)
            setChartData(response.data)
            renderChart(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const renderChart = data => {

        data.sort((a, b) => {
            if (a._id < b._id) return -1
            if (a._id > b._id) return 1
            return 0
        });
        const labels = data.map(item => item._id)
        const values = data.map(item => item.total_items)

        const ctx = document.getElementById('bar-chart').getContext('2d')
        
        if (myChartRef.current) {
            myChartRef.current.destroy()
        }

        myChartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Items',
                    data: values,
                    backgroundColor: 'rgba(0, 100, 0, 0.2)',
                    borderColor: 'rgba(0,0,0)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        min: 0,
                        max: 10,
                        ticks: {
                            stepSize: 2
                        }                 }
                }
            }
        })
    }

    const handleMonthChange = (e) => {
        setMonth(e.target.value)
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Bar Chart Status of:</h2>
            <select value={month} onChange={handleMonthChange} className="p-2 m-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
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
            <div className="w-full max-w-md">
                <canvas id="bar-chart"></canvas>
            </div>
        </div>
    );
};

export default BarChart
