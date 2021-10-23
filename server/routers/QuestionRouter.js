const express = require('express');
const router = express.Router();
const questionController = require("../controllers/QuestionController");
const JWTConfig = require("../config/JWTConfig");

router.post("/savequestion",JWTConfig.verify, questionController.saveQuestion);
router.put("/updatequestion",JWTConfig.verify,[JWTConfig.AdminOrSuperAdmin], questionController.updateQuestion);
router.get("/getquestionscountfordashboard",JWTConfig.verify, questionController.getquestionscountforDashboard);
router.get("/getquestion",JWTConfig.verify, questionController.getQuestionById);
router.get("/getallquestions",JWTConfig.verify, questionController.getAllQuestions);
router.get("/getquestionsbytopicid",JWTConfig.verify, questionController.getAllQuestionsByTopicId);
router.delete("/deletequestion", JWTConfig.verify, [JWTConfig.AdminOrSuperAdmin], questionController.deleteQuestionById);
router.post("/gettestscore",JWTConfig.verify, questionController.getTestScore);
router.get("/totalquestionscountoftopic",JWTConfig.verify, questionController.totalQuestionsCountOfTopic);
router.get("/getquestionsforexam",JWTConfig.verify, questionController.getQuestionsForExam);
router.get("/getquestionsforvisualization",JWTConfig.verify, questionController.getQuestionsDataForVisualization);
router.get("/getdatafordashboard",JWTConfig.verify,questionController.getDataForDashBoard);
router.get("/userquestionsviewindashboard",JWTConfig.verify,questionController.userQuestionsViewInDashboard);
module.exports = router