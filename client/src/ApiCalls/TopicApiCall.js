import config from "./Config";
import GetAuthToken from "../Utils/GetAuthToken";
import axios from "axios"

const TopicApiCall = {
    getAllTopics: async (pageNumber,pageSize) => {
        const token = await GetAuthToken();
        return  axios.get(`topic/getalltopics?pageNumber=${pageNumber}&pageSize=${pageSize}`,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },//getalltopicsfordropdown
    getAllTopicsWithoutpagination: async () => {
        const token = await GetAuthToken();
        return  axios.get(`topic/getalltopicsfordropdown`,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    deleteTopic:  async (data) => {
        const token = await GetAuthToken();
        return  axios.delete(`topic/deletetopic/?id=${data}`,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    addTopic: async (data) => {
        const token = await GetAuthToken();
        return  axios.post("topic/savetopic", data,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    updateTopic : async (data)=>{
        const token = await GetAuthToken();
        return  axios.put("topic/updatetopic", data,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    }

}


export default TopicApiCall