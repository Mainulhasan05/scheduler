const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const CORS = require("cors")
const mongoose = require("mongoose");
const authRoute=require("./routes/authRoute")
const cookieParser=require('cookie-parser')
const bodyParser = require('body-parser');
var cron = require('node-cron');


const apiRoute=require("./routes/apiRoute")
// const postRoute=require("./Routes/Posts/Posts")

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(CORS())
app.use("/auth",authRoute)
app.use("/api",apiRoute)
// app.use("/post",postRoute)

mongoose.connect(process.env.DB,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        cron.schedule('1-5 * * * *', () => {
            console.log('running every minute to 1 from 5');
          });
        
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log(err);
    }
    )


app.get("/", (req, res) => {
    res.json({ message: "Welcome to Microdeft" })
})

// const task = () => {
//     console.log('Printed after 10 seconds');
//   };
  
//   cron.schedule('*/10 * * * * *', task);


  
app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
})