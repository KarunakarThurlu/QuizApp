import axios from "axios";
import GetAuthToken from "../Utils/GetAuthToken";

const QuestionsApiCall = {

    saveQuestion: async (data) => {
        const token = await GetAuthToken();
        return  axios.post("/question/savequestion", data, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getAllQuestions: async (pageNumber,pageSize,filters) => {
        const token = await GetAuthToken();
        let url='';
        const keys=Object.keys(filters);
        for(let i=0;i<3;i++){
            const key= keys[i];
            const val=filters[key];
            if(val.length>0 && val!==undefined)
                url=url+"&"+key+"="+val;
        }
        return  axios.get(`/question/getallquestions?pageNumber=${pageNumber}&pageSize=${pageSize}${url}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getSelectRangeQuestionsForExam: async (id,pageNumber,pageSize) => {
        const token = await GetAuthToken();
        return  axios.get( `/question/getquestionsforexam?id=${id}&${pageNumber}&${pageSize}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getSelectedTopicQuestionsCount: async (id) => {
        const token = await GetAuthToken();
        return  axios.get(`/question/totalquestionscountoftopic?id=${id}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getAllQuestionsByTopicId: async (id) => {
        const token = await GetAuthToken();
        return  axios.get( `/question/getquestionsbytopicid?id=${id}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getQuestionsForExams: async (topicId,pageNumber,pageSize) => {
        const token = await GetAuthToken();
        return  axios.get( `/question/getquestionsforexam?topicId=${topicId}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getQuestionById: async (id) => {
        const token = await GetAuthToken();
        return  axios.get(`/question/getquestion?id=${id}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    updateQuestion: async (data) => {
        const token = await GetAuthToken();
        return axios.put("/question/updatequestion", data, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getQuestionsCountForDashBoard: async () => {
        const token = await GetAuthToken();
        return  axios.get( "/question/getquestionscountfordashboard", {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    deleteQuestion: async (QuestionId) => {
        const token = await GetAuthToken();
        return axios.delete(`/question/deletequestion?id=${QuestionId}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getTestResults: async (data,pageNumber,topicId) => {
        const token = await GetAuthToken();
        return  axios.post(`/question/gettestscore?pageNumber=${pageNumber}&id=${topicId}`, data, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },//userquestionsviewindashboard
    getQuestionsDataForVisualization: async () => {
        const token = await GetAuthToken();
        return  axios.get(`/question/getquestionsforvisualization`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    userQuestionsViewInDashboard: async (pageNumber,pageSize,status,filtersData) => {
        const token = await GetAuthToken();
        const topicId=filtersData.topicName;
        return  axios.get(`/question/userquestionsviewindashboard?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}&topicId=${topicId}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getDataForUsersdashboard: async () => {
        const token = await GetAuthToken();
        return  axios.get(`/question/getdatafordashboard`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },

}

export default QuestionsApiCall