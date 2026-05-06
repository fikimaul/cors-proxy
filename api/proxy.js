const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/proxy', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            error: 'URL is required'
        });
    }

    try {
        const response = await axios.get(
            decodeURIComponent(url),
            {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            }
        );

        res.set(
            'Content-Type',
            response.headers['content-type']
        );

        res.send(response.data);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = app;