const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (Bootstrap website)
app.use(express.static(path.join(__dirname, 'public')));

//Backend Logics
app.get('/', (req, res) => {
  res.render('../views/pages/index.ejs');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
