import axios from "axios";
import GetAuthToken from "../Utils/GetAuthToken";

const ExamsApi = {
    getAllExamsDetails: async (pageNumber,pageSize) => {
        const token = await GetAuthToken();
        return  axios.get(`exams/getallexamsDetails?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    deleteExam: async (id) => {
        const token = await GetAuthToken();
        return axios.delete(`exams/deleteexam?id=${id}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    }
}

export default ExamsApi