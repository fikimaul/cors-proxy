const express = require('express');
const path = require('path');
const app = require('./api/proxy');

// Serve static files from the 'public' directory
// This handles serving index.html at the root path '/'
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n🚀 Local dev server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
});