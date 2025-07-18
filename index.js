const express = require("express");
const app = express();
const cors = require('cors');


require("dotenv").config();

const PORT = process.env.PORT || 3000;

// middleware

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors({
    //this used because my backend and front end are on different port
    origin: "https://attendanceapp-three.vercel.app", // Allow requests from frontend
    credentials: true, //Allow cookies & authentication headers
}));


app.use(express.json());

const route = require("./router/route");

app.use("/api/v1",route);

const connectwithDb = require("./config/Database");
connectwithDb();


app.listen(3000, ()=>{
    console.log("APP is running");
})
