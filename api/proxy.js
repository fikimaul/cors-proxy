const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());

// The proxy handler logic
app.get(['/proxy', '/api/proxy'], async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            error: 'URL is required. Usage: /proxy?url=https://example.com'
        });
    }

    try {
        const targetUrl = decodeURIComponent(url);
        
        const response = await axios.get(targetUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Accept': '*/*'
            },
            timeout: 10000 // 10s timeout
        });

        const contentType = response.headers['content-type'];
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(response.data);

    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data?.toString() || 'No additional details'
        });
    }
});

module.exports = app;
