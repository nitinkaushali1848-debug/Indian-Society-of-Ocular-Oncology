import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import session from "express-session";
import MongoStore from "connect-mongo";
import rateLimit from "express-rate-limit";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

dotenv.config();

// Middlewares from libraries
app.set("trust proxy", 1); // important on Render for secure cookies
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://maps.googleapis.com",
          "https://www.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // keep only if you must (remove if you can)
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "data:",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://maps.gstatic.com",
          "https://lh3.googleusercontent.com",
          "https://www.googleusercontent.com",
          "https://cdnjs.cloudflare.com",
        ],
        connectSrc: [
          "'self'",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
        ],
        frameSrc: [
          "'self'",
          "https://www.google.com",
          "https://maps.google.com",
          "https://www.googleusercontent.com",
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> console.log("MongoDB Atlas connected"))
.catch(err => {
  console.error("MongoDB connect error:", err);
  process.exit(1); // stop if DB not available
});

//for dev env only
app.use("/uploads/members", express.static(path.join(__dirname, "public", "uploads", "members")));

//Backend Logics

var upload = multer({dest: '/uploads'});

// Index Page
app.get("/", (req, res) => {
  console.log(Object.keys(req.ip).length); // for fun - test hurray
  res.render("../views/pages/index.ejs");
});

//Login Form Page
app.get("/login", (req, res) => {
  res.render("../views/pages/login.ejs");
});

//member registeration online/offline forms
app.get("/member-registration", (req, res) =>{
  res.render("../views/pages/memRegistration.ejs");
});

//administator singin 
app.get("/administrator-login", (req, res) =>{
  res.render("../views/pages/adminLogin.ejs");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
