const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Enable CORS for all requests
app.use(cors());

// Proxy handler
app.get(['/proxy', '/api/proxy'], async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            error: 'URL is required. Usage: /proxy?url=https://example.com'
        });
    }

    try {
        const targetUrl = decodeURIComponent(url);
        
        console.log(`Proxying request to: ${targetUrl}`);

        const response = await axios.get(targetUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Accept': '*/*'
            },
            timeout: 15000 // Increased timeout to 15s
        });

        // Forward the Content-Type header
        const contentType = response.headers['content-type'];
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        // Ensure CORS headers are set
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        res.send(response.data);

    } catch (error) {
        console.error('Proxy error:', error.message);
        
        const statusCode = error.response?.status || 500;
        const errorMessage = error.message;
        const errorDetails = error.response?.data?.toString().substring(0, 500) || 'No additional details';

        res.status(statusCode).json({
            error: errorMessage,
            details: errorDetails
        });
    }
});

// Important: Export the app for Vercel
module.exports = app;
