const mongoose = require('mongoose');

//MongoDB config
const mongoDBURL = process.env.MONGODB_URL || "mongodb://localhost:27017/nodejs"
mongoose.connect(mongoDBURL, {   useNewUrlParser: true, useUnifiedTopology: true }).then((req, res) => {
    console.log("Mongo DB Connected");
}).catch(error => {
    console.log(error);
});
