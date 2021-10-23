import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import "./register.scss";

const ResetPassword = () => {
    const [data, setData] = useState({otp:'',password:'',confirmPassword:''});
    const [error, setError] = useState({otp:'',password:'',confirmPassword:''});
    const handleClick = () => {
       if(validateForm()){
            axios.post('/api/resetPassword',data)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
       }
    };

    const validateForm = () => {
        let error = {};
        let formIsValid = true;
        if(data.otp === ''){
            formIsValid = false;
            error.otp = "Please enter OTP";
        }
        if(data.otp.length < 6){
            formIsValid = false;
            error.otp = "OTP must be 6 digit";
        }
        if(data.password === ''){
            formIsValid = false;
            error.password = "Please enter password";
        }
        if(data.confirmPassword === ''){
            formIsValid = false;
            error.confirmPassword = "Please enter confirm password";
        }
        if(data.password !== data.confirmPassword){
            formIsValid = false;
            error.confirmPassword = "Password and confirm password should be same";
        }
        setError(error);
        return formIsValid;
    }

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    };
    return (
        <div className="forgotpassword">
            <TextField
                id="outlined-basic"
                variant="outlined"
                label="Enter OTP"
                type="text"
                name="otp"
                error={error.otp !== "" ? true : false}
                helperText={error.otp}
                onChange={handleChange}
            /><br/><br/>
             <TextField
                id="outlined-basic"
                variant="outlined"
                label="Enter Password"
                type="password"
                name="password"
                error={error.password !== "" ? true : false}
                helperText={error.password}
                onChange={handleChange}
            /><br/><br/>
             <TextField
                id="outlined-basic"
                variant="outlined"
                label="Enter ConformPassword"
                type="password"
                name="conformpassword"
                error={error.confirmPassword !== "" ? true : false}
                helperText={error.confirmPassword}
                onChange={handleChange}
            /><br/><br/>
            <Button variant="contained" color="primary" onClick={handleClick}>Submit</Button>
        </div>
    );
}

export default ResetPassword;