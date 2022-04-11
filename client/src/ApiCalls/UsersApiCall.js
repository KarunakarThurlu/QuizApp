import axios from "axios";
import GetAuthToken from "../Utils/GetAuthToken";
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
        return  axios.get(`/user/getuser?id=${id}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    saveUser: async (data) => {
        const token = await GetAuthToken();
        return  axios.post(`/user/saveuser`, data,{
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    updateUser: async (data) => {
        const token = await GetAuthToken();
        return  axios.put("/user/updateuser", data, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    changePassword: async (data) => {
        const token = await GetAuthToken();
        return  axios.put( "/user/changepassword", data, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    deleteUser: async (UserId) => {
        const token = await GetAuthToken();
        return  axios.delete(`/user/deleteuser?id=${UserId}`, {
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
        return  axios.post(`/user/uploadprofilepic`,data, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },
    getUsersDataForVisualization: async () => {
        const token = await GetAuthToken();
        return  axios.get(`/user/getusersdataforvisualization`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    },

    getUsersBySearchKey: async (searchKey) => {
        const token = await GetAuthToken();
        return  axios.get(`/user/getusersbysearchkey?searchKey=${searchKey}`, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        });
    }

}

export default UsersApiCalls