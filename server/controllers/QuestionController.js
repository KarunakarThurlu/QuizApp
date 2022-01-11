const Question = require("../models/QuestionsModel");
const Exam = require("../models/ExamModel");
const Topic = require("../models/TopicsModel");
const User = require("../models/UserModel");
const GetUserFromToken = require("../utils/GetUserDetailsFromToken");
const CacheSerive = require("../utils/CacheSerive");
const Constants = require("../utils/CommonConstants");
const UsersController = require("./UserController");


exports.saveQuestion = async (request, response, next) => {

    const requestUser = await GetUserFromToken.getUserDetailsFromToken(request);

    try {
        const question = new Question(request.body);
        question["creator"] = requestUser._id
        const savedQuestion = await question.save();
        CacheSerive.del(Constants.KEYS.QUETIONS_VISULN);
        return response.json({ data: savedQuestion, statusCode: 200, message: "Question Saved" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.deleteQuestionById = async (request, response, next) => {
    try {
        const question = await Question.findById({ _id: {$eq : request.query.id  } });
        if (question)
            await Question.findByIdAndDelete({ _id: {$eq : question.id  } }, (errror, doc, res) => response.json({ data: {}, statusCode: 200, message: "Question deleted" }));
        else
            return response.json({ data: {}, statusCode: 400, message: "Question Not Found" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}
exports.updateQuestion = async (request, response, next) => {

    try {
        
        const questionFromDB = await Question.findOne({ _id: {$eq:request.body._id} });
        if (questionFromDB) {
            let keys = Object.keys(request.body);
            keys.map((v, i) => {
                questionFromDB[keys[i]] = request.body[v];
            });
            questionFromDB["updatedOn"] = Date.now();
            const updatedQuestion = await Question.findByIdAndUpdate({ _id: { $eq : request.body._id } }, questionFromDB, (error, doc, res) => { });
            return response.json({ data: updatedQuestion, statusCode: 200, message: "Question updated" });
        } else {
            return response.json({ data: {}, statusCode: 400, message: "nottttttttt found" });
        }
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}
exports.getQuestionById = async (request, response, next) => {
    try {
        const question = await Question.findById({ _id: { $eq : request.query.id } }).populate("creator").populate("topic_id");
        if (question)
            return response.json({ data: question, statusCode: 200, message: "User Saved" });
        else
            return response.json({ data: {}, statusCode: 400, message: "not found" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.getAllQuestions = async (request, response, next) => {
    try {
        const pageNumber = parseInt(request.query.pageNumber) - 1 || 0;
        const pageSize = parseInt(request.query.pageSize) || 5;
        //sort by updatedOn
        const totalCount = await Question.find({}).count();
        const questions = await Question.find({}).sort({ updatedOn: -1 })
            .populate({ path: "creator", select: ["name", "email"] })
            .populate({ path: "topic", select: "topicName" })
            .skip(pageNumber * pageSize).limit(pageSize);
        if (questions) {
            return response.json({ data: questions, totalCount: totalCount, statusCode: 200, message: "OK" });
        } else {
            return response.json({ data: {}, statusCode: 400, message: "Not Found" });
        }
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.getQuestionsForExam = async (request, response, next) => {
    try {
        const pageNumber = request.query.pageNumber || 0;
        const pageSize = request.query.pageSize || 20;
        const questions = await Question.find({ topic: {$eq : request.query.topicId }, status: "APPROVED" }, { answer: false }).skip(pageNumber).limit(pageSize);
        if (questions)
            return response.json({ data: questions, statusCode: 200, message: "OK" });
        else
            return response.json({ data: {}, statusCode: 400, message: "Not Found" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}
exports.totalQuestionsCountOfTopic = async (request, response, next) => {
    try {
        const questions = await Question.find({ topic: {$eq : request.query.id }, status: "APPROVED" }).count();
        if (questions)
            return response.json({ data: questions, statusCode: 200, message: "OK" });
        else
            return response.json({ data: {}, statusCode: 400, message: "Not Found" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}
//getquestionsforexam

exports.getQuestionsForExam = async (request, response, next) => {
    try {
        if (request.query.topicId === undefined) {
            return response.json({ data: {}, statusCode: 400, message: "Topic Id is required" });
        } else {
            const pageNumber = request.query.pageNumber || 0;
            const pageSize = request.query.pageSize || 20;
            const questions = await Question.find({ topic: {$eq : request.query.topicId }, status: "APPROVED" }, { answer: false }).skip(parseInt(pageNumber)).limit(parseInt(pageSize));
            if (questions)
                return response.json({ data: questions, statusCode: 200, message: "OK" });
            else
                return response.json({ data: {}, statusCode: 400, message: "Not Found" });
        }
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.getAllQuestionsByTopicId = async (request, response, next) => {
    try {
        if (request.query.id === undefined) {
            return response.json({ "data": {}, "statusCode": "400", "message": "Required Parameter topicId is not present" });
        } else {
            const pageNumber = request.body.pageNumber || 0;
            const pageSize = request.body.pageSize || 20;
            const totalCount = await Question.find({ topic: {$eq : request.query.id  } }, { answer: false }).count();
            const questions = await Question.find({ topic: { $eq : request.query.id } }, { answer: false }).skip(pageNumber).limit(pageSize);
            if (questions)
                return response.json({ data: questions, totalCount: totalCount, statusCode: 200, message: "OK" });
            else
                return response.json({ data: {}, statusCode: 400, message: "Not Found" });
        }
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}
exports.userQuestionsViewInDashboard = async (request, response, next) => {
    try {
        let user = await GetUserFromToken.getUserDetailsFromToken(request);
        const status = request.query.status;
        const pageNumber = parseInt(request.query.pageNumber) - 1 || 0;
        const pageSize = parseInt(request.query.pageSize) || 5;
        let questions;
        let totalCount;
        if (status === "TOTAL") {
            questions = await Question.find({ creator: { $eq :user._id } }).skip(parseInt(pageNumber)).limit(parseInt(pageSize));
            totalCount = await Question.find({ creator:{ $eq :user._id } }).count();
        } else {
            questions = await Question.find({ creator: {$eq : user._id }, status: {$eq : status } }).skip(parseInt(pageNumber)).limit(parseInt(pageSize));
            totalCount = await Question.find({ creator: {$eq : user._id }, status: { $eq : status } }).count();
        }
        return response.json({ data: questions, totalCount: totalCount, statusCode: 200, message: "OK" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}
exports.getquestionscountforDashboard = async (request, response, next) => {
    let user = await GetUserFromToken.getUserDetailsFromToken(request);
    try {
        let data = {};
        let chartData = {};
        let questions = await Question.aggregate([
            { $match: { creator: user._id } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        questions.map((v, i) => { data[v._id] = v.count });
        let totalcount = questions.reduce((accumulator, question) => accumulator + question.count, 0);
        data["totalCount"] = totalcount;

        let topicsCount = await Question.aggregate([
            { $match: { creator: user._id } },
            { $group: { _id: "$topic", count: { $sum: 1 } } }
        ]);
        let topics = await Topic.find({}).select("topicName _id");


        data["topics"] = topics;
        data["topicCount"] = topicsCount;

        data["chartData"] = chartData;

        if (questions) {
            return response.json({ data: data, statusCode: 200, message: "OK" });
        } else {
            return response.json({ data: {}, statusCode: 400, message: "Not Found" });
        }
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.getTestScore = async (request, response, next) => {
    let user = await GetUserFromToken.getUserDetailsFromToken(request);
    try {
        if (request.query.id === undefined) {
            return response.json({ "data": {}, "statusCode": 400, "message": "Required Parameter topicId is not present" });
        } else {
            const pageNumber = request.query.pageNumber || 0;
            const pageSize = request.query.pageSize || 20;
            const questions = await Question.find({ topic: { $eq :request.query.id } }).skip(parseInt(pageNumber)).limit(parseInt(pageSize));
            if (questions) {
                const answeredQuestions = request.body;
                const TestQuestions = [];
                const TestAnswers = [];

                answeredQuestions.map((v, i) => {
                    TestQuestions.push(v._id);
                    let obj = {};
                    obj[v._id] = v.answer;
                    TestAnswers.push(obj);
                });


                //Finding the correct answer
                let testScore = 0;
                questions.map((question, index) => {
                    answeredQuestions.map((answeredQuestion, answeredQuestionsindex) => {
                        if (answeredQuestion._id === question._doc._id.toString()) {
                            if (answeredQuestion.answer === question.answer) {
                                testScore++;
                            }
                        }
                    })
                });
                //Saving Exam Details
                const topic = await Topic.findOne({ _id: { $eq :request.query.id  } });
                const examResults = new Exam({
                    Name: user.firstName + " " + user.lastName,
                    Email: user.email,
                    profilePicture: user.profilePicture,
                    TestScore: testScore,
                    UserId: user._id,
                    TopicName: topic.topicName,
                    Date: Date.now(),
                    TestQuestions: TestQuestions,
                    TestAnswers: TestAnswers
                });
                await examResults.save();


                return response.json({ testScore: testScore, statusCode: 200, message: "OK" });
            } else {
                return response.json({ data: {}, statusCode: 400, message: "Not Found" });
            }
        }
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

const getQuestionsBarChartData = async () => {
    const seriesData = [];
    const drillDownData = [];
    const topics = await Topic.find({}).select("topicName _id");
    const groupByTopicQuestions = await Question.aggregate([{ $group: { _id: "$topic", count: { $sum: 1 } } }]);
    const groupByStatusQuestions = await Question.aggregate([{ $group: { _id: { topic: "$topic", status: "$status" }, count: { $sum: 1 } } }]);
    const topicquestionsMap = new Map();
    const statusquestionsMap = new Map();

    groupByTopicQuestions.map((v, i) => {
        topicquestionsMap.set(v._id.toString(), v);
    });

    groupByStatusQuestions.map((v, i) => {
        statusquestionsMap.set(v._id.topic.toString() + v._id.status, v);
    });

    topics.map((v, i, a) => {
        let q = topicquestionsMap.get(v._id.toString());
        seriesData.push({ name: v.topicName, y: q === undefined ? 0 : q.count, drilldown: q === undefined ? null : v.topicName });
        let obj = { name: v.topicName, id: v.topicName, data: [] };
        let aquestion = statusquestionsMap.get(v._id.toString() + `APPROVED`);
        let rquestion = statusquestionsMap.get(v._id.toString() + `REJECTED`);
        let pquestion = statusquestionsMap.get(v._id.toString() + `PENDING`);
        if (aquestion !== undefined)
            obj.data.push([aquestion._id.status, aquestion.count]);
        if (rquestion !== undefined)
            obj.data.push([rquestion._id.status, rquestion.count]);
        if (pquestion !== undefined)
            obj.data.push([pquestion._id.status, pquestion.count]);
        drillDownData.push(obj);
    });
    return { seriesData, drillDownData };
}

exports.getQuestionsDataForVisualization = async (request, response, next) => {
    try {
        if (CacheSerive.has(Constants.KEYS.QUETIONS_VISULN)) {
            return response.json({ data: CacheSerive.get(Constants.KEYS.QUETIONS_VISULN), statusCode: 200, message: "OK" });
        } else {
            const chartData = await getQuestionsBarChartData();
            CacheSerive.set(Constants.KEYS.QUETIONS_VISULN, chartData);
            return response.json({ data: chartData, statusCode: 200, message: "OK" });
        }
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.getDataForDashBoard = async (request, response, next) => {
    try {
        // Get Count of Documnets for  User ,Exam, Topic,Questions
        const userCount = await User.countDocuments();
        const examCount = await Exam.countDocuments();
        const topicCount = await Topic.countDocuments();
        const questionCount = await Question.countDocuments();

        let xaxis = [];
        let series = [];
        //get Exams group by TopicName
        const exams = await Exam.aggregate([{ $group: { _id: "$TopicName", count: { $sum: 1 } } },]);
        exams.map((v, i, a) => { xaxis.push(v._id); series.push(v.count); });
        const examsChart = { xaxis, series };

        let groupByUserStatus=null;
        if(CacheSerive.has(Constants.KEYS.USERS_VISULN)){
            groupByUserStatus = CacheSerive.get(Constants.KEYS.USERS_VISULN);
        }else{
            groupByUserStatus= await UsersController.getUsersDataForVisualizationData();
        }
        const splinechartData = await getQuestionsBarChartData();
        const responseObj = { splinechartData,userCount,examCount,topicCount,questionCount,examsChart,groupByUserStatus,}
        return response.json({ data: responseObj, statusCode: 200, message: "OK" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}