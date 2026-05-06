const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

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

app.listen(PORT, () => {
  console.log(`CORS Proxy running at http://localhost:${PORT}`);
});
