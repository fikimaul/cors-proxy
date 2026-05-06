export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Decode URL jika di-encode
    const targetUrl = decodeURIComponent(url);
    
    // Validasi URL
    new URL(targetUrl);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();

    res.status(response.status);
    response.headers.forEach((value, name) => {
      if (name.toLowerCase() !== 'content-encoding') {
        res.setHeader(name, value);
      }
    });

    res.send(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch URL', details: error.message });
  }
}
