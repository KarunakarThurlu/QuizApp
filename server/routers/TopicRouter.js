const express = require('express');
const topicController = require("../controllers/TopicController");
const JWTConfig = require("../config/JWTConfig");

const router = express.Router();

router.post("/savetopic",JWTConfig.verify,[JWTConfig.AdminOrSuperAdmin], topicController.saveTopic);
router.put("/updatetopic",JWTConfig.verify,[JWTConfig.AdminOrSuperAdmin],  topicController.updateTopic);
router.get("/gettopic",JWTConfig.verify,  topicController.findTopicById);
router.delete("/deletetopic",JWTConfig.verify,[JWTConfig.AdminOrSuperAdmin],  topicController.deleteTopicById);
router.get("/getalltopics",JWTConfig.verify,  topicController.getAllTopics);
router.get("/getalltopicsfordropdown",JWTConfig.verify,  topicController.getAllTopicsWithoutPagination);



module.exports = router;