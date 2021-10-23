
import axios from "axios";


const SignupApi = {

    signUp: async (data) => {
        return  axios.post(`/user/saveuser`, data);
    }

}

export default SignupApi