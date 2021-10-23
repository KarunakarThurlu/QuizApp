import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Typography } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import UsersApiCalls from '../ApiCalls/UsersApiCall';
import Notifier from '../Utils/Notifier';
import config from "../ApiCalls/Config";

function ChangePassword(props) {
    const [data, setData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    useEffect(() => {
        if (props.open) {
            setData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
    }, [props.open]);

    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
        setErrors({ ...errors, [event.target.name]: '' });
    }
   

    const handleSubmit = () => {
        if (validateForm()) {
            data["_id"]=props.userId || "";
            UsersApiCalls.changePassword(data).then(res => {
                if (res.data.statusCode === 200) {
                    config.LOCAL_FORAGE.removeItem("token");
                    config.LOCAL_FORAGE.removeItem("user");
                    localStorage.clear();
                    props.history.push("/signin");
                    props.onClose();
                    Notifier.notify(res.data.message, Notifier.notificationType.SUCCESS);
                } else {
                    setErrors({ ...errors,currentPassword: res.data.message });
                }
            })
                .then(error => {
                    console.log(error);
                })
        }
    }
    const validateForm = () => {
        let isValid = true;
        let errorsObj = { currentPassword: '', newPassword: '', confirmPassword: '' };
        if (data.currentPassword.length <= 0 && !props.role===true) {
            isValid = false;
            errorsObj.currentPassword = 'Current Password is required';
        }
        if (data.newPassword.length <= 0) {
            isValid = false;
            errorsObj.newPassword = 'New Password is required';
        }
        if (data.confirmPassword.length <= 0) {
            isValid = false;
            errorsObj.confirmPassword = 'Confirm Password is required';
        }
        if (data.newPassword !== data.confirmPassword) {
            isValid = false;
            errorsObj.confirmPassword = 'New Password and Confirm Password must be same';
        }
        setErrors(errorsObj);
        return isValid;
    }

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="MuiDialog-paper-AddTopicModel"
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography variant="body1">
                        Change Password
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {props.role===true?"":
                      <TextField
                        error={errors.currentPassword !== "" ? true : false}
                        helperText={errors.currentPassword}
                        id="outlined-basic"
                        variant="outlined"
                        label="CurrentPassword"
                        type="password"
                        name="currentPassword"
                        value={data.currentPassword}
                        onChange={handleChange}
                    />}<br /><br />
                    <TextField
                        error={errors.newPassword !== "" ? true : false}
                        helperText={errors.newPassword}
                        className="TopicName"
                        id="outlined-basic"
                        variant="outlined"
                        label="NewPassword"
                        type="password"
                        name="newPassword"
                        value={data.newPassword}
                        onChange={handleChange}
                    /><br /><br />
                    <TextField
                        error={errors.confirmPassword !== "" ? true : false}
                        helperText={errors.confirmPassword}
                        className="Description"
                        id="outlined-basic"
                        variant="outlined"
                        label="ConfirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={data.confirmPassword}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Submit
                    </Button>
                    <Button onClick={props.onClose} color="primary" autoFocus variant="contained">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withRouter(ChangePassword);