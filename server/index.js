require("./config/MongoDBConfiguration");
const path = require('path');
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

const userRouter = require("./routers/UserRouter");
const companyRouter = require("./routers/CompanyRouter");
const topicRouter = require("./routers/TopicRouter");
const questionRouter = require("./routers/QuestionRouter");
const examsRouter = require("./routers/ExamsRouter");


const PORT = process.env.PORT || 3001
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

/*
//Rendering-UI
app.use(express.static(path.resolve(__dirname, '../client/build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
*/

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

//Error Handling
app.use((request, response) => {
    response.json({ statusCode: 404, message: "Not Found" })
});

app.use((error, request, response, next) => {
    response.json({ statusCode: error.status || 500, message: error.message })
});

module.exports = server;

//sudo kill -9 $(sudo lsof -t -i:9001)