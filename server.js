const express = require('express');
const path = require('path');
const ejs = require('ejs');
const helmet = require('helmet');

const app = express();
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

// Middlewares from libraries
app.set('trust proxy', 1); // important on Render for secure cookies

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://maps.googleapis.com",
        "https://www.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",           // keep only if you must (remove if you can)
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com",
        "data:"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://maps.gstatic.com",
        "https://lh3.googleusercontent.com",
        "https://www.googleusercontent.com",
        "https://cdnjs.cloudflare.com"
      ],
      connectSrc: [
        "'self'",
        "https://maps.googleapis.com",
        "https://maps.gstatic.com"
      ],
      frameSrc: [
        "'self'",
        "https://www.google.com",
        "https://maps.google.com",
        "https://www.googleusercontent.com"
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

//Backend Logics

// Index Page
app.get('/', (req, res) => {
  console.log(Object.keys(req.ip).length) // for fun - test hurray
  res.render('../views/pages/index.ejs');
});

//Login Form Page
app.get('/login', (req, res) => {
  res.render('../views/pages/login.ejs');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
