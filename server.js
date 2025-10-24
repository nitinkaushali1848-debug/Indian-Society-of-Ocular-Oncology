const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (Bootstrap website)
app.use(express.static(path.join(__dirname, 'public')));

//Backend Logics
app.get('/api', (req, res) => {
  res.json({ message: 'IIOO website is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
