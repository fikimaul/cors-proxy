const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());

// We don't need express.static('public') here because Vercel 
// serves the public folder automatically at the root.

app.get(['/proxy', '/api/proxy'], async (req, res) => {
    const { url } = req.query;

    if (!url) {
        // If no URL is provided, and we are at root, the user might be 
        // seeing this because the static index.html didn't load.
        // But normally Vercel serves the static file first.
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

        // Pass through the content type
        const contentType = response.headers['content-type'];
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        // Add some basic CORS headers just in case
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

// Export the app for Vercel
module.exports = app;