const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Proxy endpoint
app.all('/api/proxy', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const targetUrl = decodeURIComponent(url);
    new URL(targetUrl);

    const response = await axios({
      method: req.method.toLowerCase(),
      url: targetUrl,
      data: req.body,
      headers: req.headers,
      validateStatus: () => true,
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch URL', 
      details: error.message 
    });
  }
});

module.exports = app;
