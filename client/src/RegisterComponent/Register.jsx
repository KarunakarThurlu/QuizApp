import React, { useContext } from 'react'
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import "./register.scss";
import UserContext from "../Context/UserContext/UserContext";

function Register(props) {

    const { saveUser } = useContext(UserContext);
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const onSubmit = (data) => {
        data['roles']=[{role_name:"USER"}]
        saveUser(data);
    };

    return (
        <div className="signup">
            <form onSubmit={handleSubmit(onSubmit)}>
                <AccountCircleIcon style={{ fontSize: 40 }} />
                <div className="form-fields">
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="First Name"
                        type="text"
                        name="firstName"
                        {...register("firstName", { required: "First name is required" })}
                    />
                    <br />
                    {errors.firstName && <span className="Error-Message">{errors.firstName.message}</span>}
                    <br />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="Last Name"
                        type="text"
                        name="lastName"
                        {...register("lastName", { required: "Last name is required" })}
                    />
                    <br />
                    {errors.lastName && <span className="Error-Message">{errors.lastName.message}</span>}
                    <br />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="Phono"
                        type="text"
                        name="phoneNumber"
                        {...register("phoneNumber",{ 
                             required: "User phono is required",
                             pattern:{
                                 value:/^\d{10}$/
                             }
                             })}
                    />
                    <br />
                    {errors.phoneNumber && <span className="Error-Message">{errors.phoneNumber.message}</span>}
                    <br />
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        type="email"
                        name="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Invalid email address",
                            },
                        })}
                    />
                    <br />
                    {errors.email && <span className="Error-Message">{errors.email.message}</span>}
                    <br />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="Password"
                        type="password"
                        name="password"
                        {...register("password", { required: "Password is required" })}
                    />
                    <br />
                    {errors.password && <span className="Error-Message">{errors.password.message}</span>}
                    <br />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="ConformPassword"
                        type="password"
                        name="password"
                        {...register("password", { required: "Password is required" })}
                    />
                    <br />
                    {errors.password && <span className="Error-Message">{errors.password.message}</span>}
                </div>
                <br />
                <div className="form-button">
                    <Button type="submit" variant="contained" color="primary">SignUp</Button>
                </div>
            </form>
            <div className="questions">
                <Link to="/signin"><h4 className="questions-text" >Alredy have account?</h4></Link>  
                <Link to="/signup"><h4 className="questions-text" >New User?</h4></Link> 
                {/* <Link to="/forgotpassword"><h4 className="questions-text">Forgot Password?</h4></Link> */}
            </div>
        </div>
    )
}

export default Register
