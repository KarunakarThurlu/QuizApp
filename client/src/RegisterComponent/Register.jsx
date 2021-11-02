import React, { useContext,useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import HelperUtils from '../Utils/HelperUtils';
import "./register.scss";
import UserContext from "../Context/UserContext/UserContext";

function Register(props) {

    const { saveUser } = useContext(UserContext);
    const [data, setData] = useState({  firstName: '', lastName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
   
    const onSubmit = () => {
        if(validateForm()){
        data['roles']=[{role_name:"USER"}]
        data['status']='ACTIVE'
        saveUser(data);
        props.history.push("/signin");
        }
       
    };
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        validate(e.target.name, e.target.value);
    }
    const validate = (name, value) => {
        switch (name) {
            case 'firstName':
                if (value === '') {
                    setErrors({ ...errors, firstName: 'firstName is required' });
                } else {
                    setErrors({ ...errors, firstName: '' });
                }
                break;
            case 'lastName':
                if (value === '') {
                    setErrors({ ...errors, lastName: 'lastName is required' });
                }
                else {
                    setErrors({ ...errors, lastName: '' });
                }
                break;
            case 'email':
                if (value === '') {
                    setErrors({ ...errors, email: 'email is required' });
                } else if (!HelperUtils.validateEmail(value)) {
                    setErrors({ ...errors, email: 'email is not valid' });
                } else {
                    setErrors({ ...errors, email: '' });
                }
                break;
            case 'phoneNumber':
                if (value === '') {
                    setErrors({ ...errors, phoneNumber: 'phoneNumber is required' });
                }
                else if (value.match(/^\d/) === null) {
                    setErrors({ ...errors, phoneNumber: 'phoneNumber should contain 10 digits' });
                }else if(value.length!==10){
                    setErrors({ ...errors, phoneNumber: 'phoneNumber must be 10 digit' });
                }else {
                    setErrors({ ...errors, phoneNumber: '' });
                }
                break;
            case 'password':
                if (value === '') {
                    setErrors({ ...errors, password: 'password is required' });
                }
                else {
                    setErrors({ ...errors, password: '' });
                }
                break;
            case 'confirmPassword':
                if (value === '') {
                    setErrors({ ...errors, confirmPassword: 'confirmPassword is required' });
                }
                else {
                    setErrors({ ...errors, confirmPassword: '' });
                }
                break;
            default:
                break;
        }

    }
    const validateForm = () => {
        let isValid = true;
        let errorsObj={ firstName: '', lastName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' };
        if (data.firstName === "") {
            errorsObj["firstName"] = "FirstName is reuired"
            isValid = false;
        }
        if (data.lastName === "") {
            errorsObj["lastName"] = "LastName is reuired."
            isValid = false;
        }
        if (data.email === "") {
            errorsObj["email"] = "Email is reuired."
            isValid = false;
        }
        if (data.phoneNumber === "") {
            errorsObj["phoneNumber"] = "PhoneNumber is reuired."
            isValid = false;
        }
        if (data.password === "") {
            errorsObj["password"] = "Password is reuired."
            isValid = false;
        }
        if (data.confirmPassword === "") {
            errorsObj["confirmPassword"] = "ConfirmPassword is reuired."
            isValid = false;
        }
        if (data.password !== data.confirmPassword) {
            errorsObj["confirmPassword"] = "Password and confirmPassword must be same."
            isValid = false;
        }
        setErrors(errorsObj);
        return isValid;
    }

    return (
        <div className="signup">
                <AccountCircleIcon style={{ fontSize: 40 }} />
                <div className="form-fields">
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="First Name"
                        type="text"
                        name="firstName"
                        onChange={handleChange}
                        error={errors.firstName !== "" ? true : false}
                        helperText={errors.firstName}
                        value={data.firstName}
                    />
                    <br />
                    <br />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="Last Name"
                        type="text"
                        name="lastName"
                        onChange={handleChange}
                        error={errors.lastName !== "" ? true : false}
                        helperText={errors.lastName}
                        value={data.lastName}
                    />
                    <br />
                    <br />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="Phone"
                        type="text"
                        name="phoneNumber"
                        onChange={handleChange}
                        error={errors.phoneNumber !== "" ? true : false}
                        helperText={errors.phoneNumber}
                        value={data.phoneNumber}
                    />
                    <br />
                    <br />
                    <TextField
                        id="outlined-basic"
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
                        id="outlined-basic"
                        variant="outlined"
                        label="Password"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        error={errors.password !== "" ? true : false}
                        helperText={errors.password}
                        value={data.password}
                    />
                    <br />
                    <br />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="ConformPassword"
                        type="password"
                        name="confirmPassword"
                        onChange={handleChange}
                        error={errors.confirmPassword !== "" ? true : false}
                        helperText={errors.confirmPassword}
                        value={data.confirmPassword}
                    />
                    <br />
                </div>
                <br />
                <div className="form-button">
                    <Button onClick={onSubmit} variant="contained" color="primary">SignUp</Button>
                </div>
            <div className="questions">
                <Link to="/signin"><h4 className="questions-text" >Alredy have account?</h4></Link>  
                <Link to="/signup"><h4 className="questions-text" >New User?</h4></Link> 
                {/* <Link to="/forgotpassword"><h4 className="questions-text">Forgot Password?</h4></Link> */}
            </div>
        </div>
    )
}

export default Register
