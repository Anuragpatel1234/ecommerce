const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(module => (module.default || module)(...args));
require('dotenv').config();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const PAYPAL_API_URL = 'https://api-m.sandbox.paypal.com'; // Use https://api-m.paypal.com for production

// Helper to calculate total amount from cart including tax and shipping
// Ideally this should reuse logic from cart/orders service to ensure consistency
const calculateTotal = (cart) => {
    const subtotal = cart.totalAmount || 0;
    const shipping = subtotal > 2000 ? 0 : 200;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    return total.toFixed(2);
};

// 1. Authenticate with PayPal to get Access Token
async function getAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error_description || 'Failed to get access token');
    }
    return data.access_token;
}

// 2. Capture the Order
router.post('/capture-order', async (req, res) => {
    const { orderID } = req.body;

    try {
        const accessToken = await getAccessToken();

        const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.status === 'COMPLETED') {
            // Here you would typically:
            // 1. Save order to your database
            // 2. Clear user's cart
            // 3. Send confirmation email
            // For now, we return the data to the frontend to handle the success flow

            return res.status(200).json(data);
        } else {
            return res.status(400).json({
                error: "Transaction not completed",
                details: data
            });
        }
    } catch (error) {
        console.error('PayPal Capture Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
