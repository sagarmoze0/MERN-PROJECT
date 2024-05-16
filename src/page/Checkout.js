// components/Checkout.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
const Checkout = () => {
    const cart = useSelector((state) => state.cart);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle checkout process
        console.log('Checkout', { cart, address, paymentMethod });
    };

    return (
        <div>
            <h1>Checkout</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Address: </label>
                    <input
                        placeholder='Enter address'
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div>
                    <label>Payment Method: </label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="Credit Card">Credit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>
                <button type="submit" Navigate='transactionsTable'>Place order
                </button>
            </form>
        </div>
    );
};

export default Checkout;
