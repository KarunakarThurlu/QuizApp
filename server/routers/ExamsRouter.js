const express = require('express');
const examController = require("../controllers/ExamsController");
const JWTConfig = require("../config/JWTConfig");
const router = express.Router();


router.get("/getallexamsDetails",JWTConfig.verify, examController.getAllExamsDetails);
router.delete("/deleteexam",JWTConfig.verify, examController.deleteExam);
router.get("/searchexam",JWTConfig.verify, examController.searchExam);


module.exports = router;