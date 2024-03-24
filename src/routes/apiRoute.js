const express=require('express')
const axios=require('axios')
const ApiModel=require('../models/apiItems')
const router=express.Router()
const moment = require('moment'); 


function getDefaultMonth() {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 
    const currentYear = currentDate.getFullYear()
    return `${currentYear}-${currentMonth.toString().padStart(2, '0')}`
}

router.get('/database', async (req,res)=>{
    try{
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data=response.data
        await ApiModel.insertMany(data); 
        res.send('Database initialized with seed data')
    }
    catch(error){
        res.status(400).send(error)
    }
})

router.get('/transactions', async (req, res) => {
    try {
        let { search, month, page = 1, perPage = 10 } = req.query
        const skip = (page - 1) * perPage

        let query = {}
        if (month) {
            const monthNumber = new Date(`${month}-01`).getUTCMonth() + 1
            query.$expr = { $eq: [{ $month: '$dateOfSale' }, monthNumber] }
        }

        if (search) {
            if (!isNaN(parseFloat(search))) {
                query.price = parseFloat(search)
            } else {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }
        }

        const transactions = await ApiModel.find(query).skip(skip).limit(perPage);

        const formattedTransactions = transactions.map(transaction => ({
            id: transaction.id,
            title: transaction.title,
            description: transaction.description,
            price: transaction.price,
            category: transaction.category,
            sold: transaction.sold,
            image: transaction.image
        }))

        res.json(formattedTransactions)
    } catch (error) {
        console.error('Error fetching product transactions:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})



router.get('/statistics', async (req, res) => {
    try {
        let { month } = req.query
        month = month || getDefaultMonth()

        const monthNumber = new Date(`${month}-01`).getUTCMonth() + 1

        const totalSaleAmount = await ApiModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: '$dateOfSale' }, monthNumber]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$price" }
                }
            }
        ])

        const totalSoldItems = await ApiModel.countDocuments({
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, monthNumber]
            },
            sold: true
        })

        const totalNotSoldItems = await ApiModel.countDocuments({
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, monthNumber]
            },
            sold: false
        })

        res.status(200).json({
            totalSaleAmount: totalSaleAmount.length ? totalSaleAmount[0].totalAmount : 0,
            totalSoldItems,
            totalNotSoldItems
        })
    } catch (error) {
        res.status(500).send(error)
    }
})



router.get('/bar-chart', async (req, res) => {
    try {
        let { month } = req.query;

        month = month || getDefaultMonth()

        let query = {}

        if (month) {
            const monthNumber = new Date(`${month}-01`).getUTCMonth() + 1
            query.$expr = { $eq: [{ $month: '$dateOfSale' }, monthNumber] }
        }

        const priceRanges = await ApiModel.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $and: [ { $gte: ["$price", 0] }, { $lt: ["$price", 100] } ] }, then: "0-100" },
                                { case: { $and: [ { $gte: ["$price", 100] }, { $lt: ["$price", 200] } ] }, then: "101-200" },
                                { case: { $and: [ { $gte: ["$price", 200] }, { $lt: ["$price", 300] } ] }, then: "201-300" },
                                { case: { $and: [ { $gte: ["$price", 300] }, { $lt: ["$price", 400] } ] }, then: "301-400" },
                                { case: { $and: [ { $gte: ["$price", 400] }, { $lt: ["$price", 500] } ] }, then: "401-500" },
                                { case: { $and: [ { $gte: ["$price", 500] }, { $lt: ["$price", 600] } ] }, then: "501-600" },
                                { case: { $and: [ { $gte: ["$price", 600] }, { $lt: ["$price", 700] } ] }, then: "601-700" },
                                { case: { $and: [ { $gte: ["$price", 700] }, { $lt: ["$price", 800] } ] }, then: "701-800" },
                                { case: { $and: [ { $gte: ["$price", 800] }, { $lt: ["$price", 900] } ] }, then: "801-900" },
                                { case: { $gte: ["$price", 900] }, then: "901-above" }
                            ],
                            default: "Other"
                        }
                    },
                    total_items: { $sum: 1 }
                }
            }
        ])

        res.status(200).json(priceRanges)
    } catch (error) {
        console.error('Error generating bar chart data:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})




router.get('/pie-chart', async (req, res) => {
    try {
        let { month } = req.query;

        month = month || getDefaultMonth()

        let query = {}

        if (month) {
            const monthNumber = new Date(`${month}-01`).getUTCMonth() + 1
            query = { $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] } }
        }

        const categoryCounts = await ApiModel.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ])

        res.status(200).json(categoryCounts)
    } catch (error) {
        console.error('Error generating pie chart data:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


router.get('/combine-response', async (req, res) => {
    const allAPI = [
        'http://localhost:3000/api/apitems/statistics',
        'http://localhost:3000/api/apitems/bar-chart',
        'http://localhost:3000/api/apitems/pie-chart'
    ];

    try {
        const responses = []
        for (const url of allAPI) {
            const response = await axios.get(url, { params: req.query })
            responses.push(response.data)
        }
        const allData = {
            statistics: responses[0],
            barChart: responses[1],
            pieChart: responses[2]
        };
        res.status(200).json(allData)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports=router


