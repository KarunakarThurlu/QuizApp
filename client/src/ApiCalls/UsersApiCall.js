import axios from "axios";
import GetAuthToken from "../Utils/GetAuthToken";
import config from "./Config";

const UsersApiCalls = {

    getAllUsers: async (pageNumber,pageSize) => {
        const token = await GetAuthToken();
        return  axios.get(`/user/getallusers?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getUserById: async (id) => {
        const token = await GetAuthToken();
        return  axios.get(config.Base_URL + `/user/getuser?id=${id}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    saveUser: async (data) => {
        return  axios.post(config.Base_URL + "/user/saveuser", data);
    },
    updateUser: async (data) => {
        const token = await GetAuthToken();
        return  axios.put(config.Base_URL + "/user/updateuser", data, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    changePassword: async (data) => {
        const token = await GetAuthToken();
        return  axios.put(config.Base_URL + "/user/changepassword", data, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    deleteUser: async (UserId) => {
        const token = await GetAuthToken();
        return  axios.delete(config.Base_URL + `/user/deleteuser?id=${UserId}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    uploadProfilePic: async (file) => {
        const token = await GetAuthToken();
        var data = new FormData();
        data.append("image", file);
        console.log(data);
        return  axios.post(config.Base_URL + `/user/uploadprofilepic`,data, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getUsersDataForVisualization: async () => {
        const token = await GetAuthToken();
        return  axios.get(config.Base_URL + `/user/getusersdataforvisualization`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },

}

export default UsersApiCalls