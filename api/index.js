const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files locally

app.get('*', async (req, res) => {
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

// Add local listener for direct execution
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`\x1b[32m[Proxy]\x1b[0m Server running at http://localhost:${PORT}`);
    });
}