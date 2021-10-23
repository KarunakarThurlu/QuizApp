import config from "./Config";
import GetAuthToken from "../Utils/GetAuthToken";
import axios from "axios"

const TopicApiCall = {
    getAllTopics: async (pageNumber,pageSize) => {
        const token = await GetAuthToken();
        return  axios.get(config.Base_URL + `/topic/getalltopics?pageNumber=${pageNumber}&pageSize=${pageSize}`,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },//getalltopicsfordropdown
    getAllTopicsWithoutpagination: async () => {
        const token = await GetAuthToken();
        return  axios.get(config.Base_URL + `/topic/getalltopicsfordropdown`,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    deleteTopic:  async (data) => {
        const token = await GetAuthToken();
        return  axios.delete(config.Base_URL + `/topic/deletetopic/?id=${data}`,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    addTopic: async (data) => {
        const token = await GetAuthToken();
        return  axios.post(config.Base_URL + "/topic/savetopic", data,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    updateTopic : async (data)=>{
        const token = await GetAuthToken();
        return  axios.put(config.Base_URL + "/topic/updatetopic", data,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    }

}


export default TopicApiCall