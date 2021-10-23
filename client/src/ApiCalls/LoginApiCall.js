import config from "./Config";
import axios from "axios"

const loginCall = {
    login: async (data) => {
        return  axios.post(`/user/login`, data);
    }
}


export default loginCall