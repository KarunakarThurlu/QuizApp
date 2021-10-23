const Topic = require("../models/TopicsModel");
const Question = require("../models/QuestionsModel");
const User = require("../models/UserModel");
const Exam = require("../models/ExamModel");
const GetUserFromToken = require("../utils/GetUserDetailsFromToken");
const CacheService = require("../utils/CacheSerive");
const Constants = require("../utils/CommonConstants");


exports.saveTopic = async (request, response, next) => {
    const requestUser = await GetUserFromToken.getUserDetailsFromToken(request);
    try {
        const topic = new Topic({
            topicName: request.body.topicName,
            description: request.body.description,
            creator: requestUser._id,
        });
        const savedT = await topic.save();
        CacheService.del("allTopicsForDropDown");
        CacheService.del(Constants.KEYS.QUETIONS_VISULN);
        return response.json({ data: savedT, statusCode: 200, message: "Topic Saved" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.updateTopic = async (request, response, next) => {
    const requestUser = await GetUserFromToken.getUserDetailsFromToken(request);
    try {
        let topic = await Topic.findOne({ _id: request.body._id });
        if (topic) {
            let keys = Object.keys(request.body);
            keys.map((v, i) => {
                topic._doc[keys[i]] = request.body[v];
            });
            topic.creator = requestUser._id;
            const updatedTopic = await Topic.findByIdAndUpdate({ _id: request.body._id }, topic, (error, doc, res) => { });
            CacheService.del("allTopicsForDropDown");
            CacheService.del(Constants.KEYS.QUETIONS_VISULN);
            return response.json({ data: updatedTopic, statusCode: 200, message: "Topic Updated Successfully." });
        } else {
            return response.json({ data: {}, statusCode: 400, message: "Not Found" });
        }
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }

}

exports.findTopicById = async (request, response, next) => {
    try {
        const t = await Topic.findOne({ _id: request.query.id }).populate({ path: "creator", select: ["name", "email"] });
        return response.json({ data: t, statusCode: 200, message: "OK" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.deleteTopicById = async (request, response, next) => {
    try {
        const topic = await Topic.findById({ _id: request.query.id });
        if (topic) {
            await Question.deleteMany({ topic: topic._id });
            await Exam.deleteMany({ TopicName: topic.topicName });
            await Topic.findByIdAndDelete({ _id: topic.id }, (errror, doc, res) => response.json({ data: {}, statusCode: "200", message: "Topic Deleted" }));
            CacheService.del("allTopicsForDropDown");
            CacheService.del(Constants.KEYS.QUETIONS_VISULN);
        }
        else
            return response.json({ data: {}, statusCode: 400, message: "Not Found" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.getAllTopics = async (request, response, next) => {
    try {
        const pageNumber = parseInt(request.query.pageNumber) - 1 || 0;
        const pageSize = parseInt(request.query.pageSize) || 5;
        const totalCount = await Topic.find().countDocuments();
        const t = await Topic.find({}).populate({ path: "creator", select: ["name", "email"] })
            .skip(pageNumber * pageSize)
            .limit(pageSize);
        return response.json({ data: t, totalCount: totalCount,statusCode: 200, message: "OK" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

//getAll Topics Without pagination with topicName, _id for Showing Add Question Dropdown
exports.getAllTopicsWithoutPagination = async (request, response, next) => {
    try {
        if(CacheService.has("allTopicsForDropDown")){
            return response.json({ data: CacheService.get("allTopicsForDropDown"), statusCode: 200, message: "OK" });
        }else{
            const t = await Topic.find().select("topicName _id");
            CacheService.set("allTopicsForDropDown",t);
            return response.json({ data: t, statusCode: 200, message: "OK" });
        }
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}