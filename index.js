const express = require("express");
const dotenv = require("dotenv")
dotenv.config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const uri = process.env.MONGO_URL;
// db connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Database connected"))
.catch((err) => console.log("Database not connected", err))

// middleware
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended: false})) 

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', 'https://ecotrack-solutions.netlify.app')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}

const corsHandler = allowCors(handler);

app.use(cors({
  origin: process.env.PROD_URL,
  // origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use("/", require("./routes/userRouter"), corsHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on ${port}`));