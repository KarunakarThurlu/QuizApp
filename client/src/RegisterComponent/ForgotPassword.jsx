import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom"
import HelperUtils from '../Utils/HelperUtils';
import axios from 'axios';

import "./register.scss";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const handleClick = () => {
        if (email === "") {
            setError("Please enter your email");
        } else {
            if (HelperUtils.validateEmail(email)) {
                setError("");
                //Call send mail api
                axios.post('/api/send-mail', {
                    email: email
                }).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                })
            }else{
                setError("Please enter valid email");
            }
        }
    };
    return (
        <div className="forgotpassword">
            <TextField
                id="outlined-basic"
                variant="outlined"
                label="Enter email"
                type="email"
                name="name"
                error={error !== "" ? true : false}
                helperText={error}
                onChange={(e) => setEmail(e.target.value)}
            /><br/><br/>
            <Button variant="contained" color="primary" onClick={handleClick}>Send OTP</Button>
            <div className="questions">
                <Link to="/signin"><h4 className="questions-text" >Alredy have account?</h4></Link>  <Link to="/signup"><h4 className="questions-text">SignUp?</h4></Link>
            </div>
        </div>
    );
}

export default ForgotPassword;