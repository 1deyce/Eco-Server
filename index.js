const express = require("express");
const dotenv = require("dotenv")
dotenv.config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
// const cors = require("cors");

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

// app.use(cors({
//   origin: process.env.PROD_URL,
//   // origin: "http://localhost:3000",
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

app.use("/", require("./routes/userRouter"));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on ${port}`));