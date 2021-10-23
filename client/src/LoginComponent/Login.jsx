import React, { useState ,useContext} from 'react'
import TextField from '@material-ui/core/TextField';
import { Link ,withRouter} from "react-router-dom"
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import config from "../ApiCalls/Config";
import LoginApiCall from "../ApiCalls/LoginApiCall";
import Notifier from "../Utils/Notifier";
import UserContext from '../Context/UserContext/UserContext';

import "./login.css";

function Login(props) {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [loader, setLoader] = useState(false);
    const { addLoggedInUserData} = useContext(UserContext);

    const onSubmit = (data) => {
        setLoader(true);
        LoginApiCall.login(data).then(response => {
            setLoader(false);
            if (response.data.statusCode === 200) {
                localStorage.setItem("isAuthenticated", true);
                localStorage.setItem("loginDate", new Date().toDateString());
                addLoggedInUserData(response.data.data);
                if(response.data.data.roles.some(role => role.role_name === "ADMIN"))
                    localStorage.setItem("isAdmin", true);
                props.history.push("/home")
                Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                config.LOCAL_FORAGE.setItem("token", response.data.token);
                config.LOCAL_FORAGE.setItem("user", response.data.data);
            } else {
                Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
            }
        });
    };
    return (
        <div className="login">
            { loader && <CircularProgress className="loader" />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <LockOutlinedIcon style={{ fontSize: 40 }} />
                <div className="form-fields">
                    <TextField
                        className="MuiTextField-root-login"
                        id="outlined-basic"
                        label="User Name"
                        variant="outlined"
                        type="email"
                        name="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value:
                                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Invalid email address",
                            },
                        })}
                    />
                    <br />
                    {errors.email && <span className="Error-Message">{errors.email.message}</span>}
                    <br />
                    <TextField
                        className="MuiTextField-root-login"
                        id="outlined-basic"
                        variant="outlined"
                        label="Password"
                        type="password"
                        name="password"
                        {...register("password", {
                            required: "password is required"
                        })}
                    />
                    <br />
                    {errors.password && <span className="Error-Message">{errors.password.message}</span>}
                </div>
                <br />
                <div className="form-button">
                    <Button type="submit" className="MuiButton-containedPrimary-login" variant="contained" color="primary">Login</Button>
                </div>
            </form>
            <div className="questions">
                <Link to="/signup"><h4 className="questions-text" >New User?</h4></Link> 
                <Link to="/signin"><h4 className="questions-text" >Alredy have account?</h4></Link>
                {/* <Link to="/forgotpassword"><h4 className="questions-text">Forgot Password?</h4></Link> */}
            </div>

        </div>
    )
}

export default withRouter(Login);
