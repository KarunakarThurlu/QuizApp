const mongoose = require('mongoose');
const dotenv = require('dotenv');
const result = dotenv.config();
const path = require('path');
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const ratelimit = require('express-rate-limit');

const userRouter = require("./routers/UserRouter");
const companyRouter = require("./routers/CompanyRouter");
const topicRouter = require("./routers/TopicRouter");
const questionRouter = require("./routers/QuestionRouter");
const examsRouter = require("./routers/ExamsRouter");


const PORT = process.env.PORT || 3001;
const mongoDBURL = process.env.MONGODB_URL;
const app = express();


//CORS Error Handling
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin,X-Requested-with,Content-Type,Accept,Authorization');
    if (request.method === "OPTIONS") {
        response.header('Access-Control-Allow-Methods', 'PUT,PATCH,DELETE,GET,POST');
        return response.status(200).json({});
    }
    next();
});


const server = app.listen(PORT, () => {
    console.log(`server is running on : ${PORT} `);
});


mongoose.connect(mongoDBURL, { useNewUrlParser: true}).then((req, res) => {
    console.log("Mongo DB Connected");
}).catch(error => {
    console.log(error);
});

//logging
app.use(morgan('dev'));
app.use(express.json());


//Routers configuration
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/topic", topicRouter);
app.use("/question", questionRouter);
app.use("/exams", examsRouter);
app.use('/uploads', express.static('uploads'));

//Render React App from ../client/build
if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}
//Error Handling
app.use((request, response) => {
    response.json({ statusCode: 404, message: "Not Found" })
});


const limiter = ratelimit({
    windowMs: 1*60*1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after an hour",

})
app.use(limiter); 


app.use((error, request, response, next) => {
    response.json({ statusCode: error.status || 500, message: error.message })
});


module.exports = server;

