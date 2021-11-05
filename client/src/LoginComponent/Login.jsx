import React, { useState, useContext } from 'react'
import TextField from '@material-ui/core/TextField';
import { Link, withRouter } from "react-router-dom"
import HelperUtils from '../Utils/HelperUtils';
import Button from '@material-ui/core/Button';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import config from "../ApiCalls/Config";
import LoginApiCall from "../ApiCalls/LoginApiCall";
import Notifier from "../Utils/Notifier";
import UserContext from '../Context/UserContext/UserContext';
import Spinner from "../Utils/Spinner";

import "./login.scss";

function Login(props) {
    
    const [data, setData] = useState({ email: "", password: ""});
    const [errors,setErrors] = useState({ email: "", password: ""});
    const [spinner, setSpinner] = useState(false);
    const { addLoggedInUserData } = useContext(UserContext);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        validate(e.target.name, e.target.value);
    }
    const validate = (name, value) => {
        let error = "";
        if (name === "email") {
            error = value.length === 0 ? "Email is required" : "";
        }
        if(name === "email" && value.length > 0){
            error= HelperUtils.validateEmail(value) ? "" : "Invalid Email";
        }
        if (name === "password") {
            error = value.length === 0 ? "Password is required" : "";
        }
        setErrors({ ...errors, [name]: error });
    }
    const validateForm = () => {
        let valid = true;
        let errorsObj={email:"",password:""};
        if (data.email.length === 0) {
            valid = false;
            errorsObj.email = "Email is required";
        }
        if(data.email.length > 0){
            valid= HelperUtils.validateEmail(data.email) ? valid : false;
            errorsObj.email = HelperUtils.validateEmail(data.email) ? "" : "Invalid Email";
        }
        if (data.password.length === 0) {
            valid = false;
            errorsObj.password = "Password is required";
        }
        setErrors(errorsObj);
        return valid;
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if(validateForm()){
        setSpinner(true);
        LoginApiCall.login(data).then(response => {
            setSpinner(false);
            if (response.data.statusCode === 200) {
                localStorage.setItem("isAuthenticated", true);
                localStorage.setItem("loginDate", new Date().toDateString());
                addLoggedInUserData(response.data.data);
                if (response.data.data.roles.length === 1) {
                    localStorage.setItem("role", response.data.data.roles[0].role_name);
                } else if (response.data.data.roles.length === 2) {
                    if (response.data.data.roles[0].role_name === "ADMIN" || response.data.data.roles[1].role_name === "ADMIN")
                        localStorage.setItem("role", "ADMIN");
                } else {
                    localStorage.setItem("role", "SUPER_ADMIN");
                }
                props.history.push("/home")
                Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                config.LOCAL_FORAGE.setItem("token", response.data.token);
                config.LOCAL_FORAGE.setItem("user", response.data.data);
            } else {
                Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
            }
        }).catch(error => {
            setSpinner(false);
            Notifier.notify(error.message, Notifier.notificationType.ERROR);
        }).finally(() => {
            setSpinner(false);
        });
    }
    };
    return (
        <div className="login">
            {spinner && <Spinner open={spinner} />}
                <LockOutlinedIcon style={{ fontSize: 40 }} />
                <div className="form-fields">
                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        error={errors.email !== "" ? true : false}
                        helperText={errors.email}
                        value={data.email}
                    />
                    <br />
                    <br />
                    <TextField
                        label="password"
                        variant="outlined"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        error={errors.password !== "" ? true : false}
                        helperText={errors.password}
                        value={data.password}
                    />
                    <br />
                </div>
                <br />
                <div className="form-button">
                    <Button  onClick={onSubmit} className="MuiButton-containedPrimary-login" variant="contained" color="primary">Login</Button>
                </div>
            <div className="questions">
                <Link to="/signup"><h4 className="questions-text" >New User?</h4></Link>
                <Link to="/signin"><h4 className="questions-text" >Alredy have account?</h4></Link>
                {/* <Link to="/forgotpassword"><h4 className="questions-text">Forgot Password?</h4></Link> */}
            </div>
        </div>
    )
}

export default withRouter(Login);
