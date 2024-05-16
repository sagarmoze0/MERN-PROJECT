const express = require('express');
const axios = require('axios');
const ApiModel = require('../models/apiItems');
const moment = require('moment'); 

const router = express.Router();

// Function to get default month in format YYYY-MM
function getDefaultMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    return `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
}

// Endpoint to initialize database with seed data
router.get('/database', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;
        await ApiModel.insertMany(data); 
        res.send('Data has been stored in database');
    } catch(error) {
        res.status(400).send(error);
    }
});

// Endpoint to fetch transactions with optional search and pagination
router.get('/transactions', async (req, res) => {
    try {
        let { search, month, page = 1, perPage = 10 } = req.query;
        const skip = (page - 1) * perPage;

        let query = {};

        // Filtering by month if provided
        if (month) {
            const monthNumber = new Date(`${month}-01`).getUTCMonth() + 1;
            query.$expr = { $eq: [{ $month: '$dateOfSale' }, monthNumber] };
        }

        // Searching by title or description if provided
        if (search) {
            if (!isNaN(parseFloat(search))) {
                query.price = parseFloat(search);
            } else {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
        }

        // Fetching transactions based on query
        const transactions = await ApiModel.find(query).skip(skip).limit(perPage);

        // Formatting fetched transactions
        const formattedTransactions = transactions.map(transaction => ({
            id: transaction.id,
            title: transaction.title,
            description: transaction.description,
            price: transaction.price,
            category: transaction.category,
            sold: transaction.sold,
            image: transaction.image
        }));

        res.json(formattedTransactions);
    } catch (error) {
        console.error('Error fetching product transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to fetch statistics for a given month
router.get('/statistics', async (req, res) => {
    try {
        let { month } = req.query;
        month = month || getDefaultMonth();

        const monthNumber = new Date(`${month}-01`).getUTCMonth() + 1;

        // Aggregating total sale amount for the given month
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
        ]);

        // Counting total sold items for the given month
        const totalSoldItems = await ApiModel.countDocuments({
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, monthNumber]
            },
            sold: true
        });

        // Counting total not sold items for the given month
        const totalNotSoldItems = await ApiModel.countDocuments({
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, monthNumber]
            },
            sold: false
        });

        // Sending statistics as response
        res.status(200).json({
            totalSaleAmount: totalSaleAmount.length ? totalSaleAmount[0].totalAmount : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
