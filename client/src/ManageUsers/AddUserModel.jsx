import React, { useContext, useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import HelperUtils from '../Utils/HelperUtils';
import UserContext from "../Context/UserContext/UserContext"

import "./manageusers.scss";

function AddUserModel(props) {

    const { saveUser, updateUser } = useContext(UserContext);

    const [data, setData] = useState({ _id: '', firstName: '', lastName: '', email: '', phoneNumber: '', gender: '', DOB: '', roles: [] })
    const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', gender: '', DOB: '', roles: '' })
    const clearErrors = () => { setErrors({ firstName: '', lastName: '', email: '', phoneNumber: '', gender: '', DOB: '', roles: '' }) }

    const getRolesInArrayFormat = (roles) => {
        if (roles !== undefined && roles !== "") {
            if (typeof roles === 'string') {
                let rs = roles.split(",");
                let rolesArray = [];
                rs.forEach(r => {
                    let obj = { role_name: r }
                    rolesArray.push(obj);
                })
                return rolesArray;
            }else{
                return roles;
            }
        } else {
            return [{ role_name: "USER" }];
        }
    }
    useEffect(() => {
        if (props.editFormData !== undefined && props.editFormData !== null) {
            setData({ _id: props.editFormData._id, firstName: props.editFormData.firstName, lastName: props.editFormData.lastName, email: props.editFormData.email, DOB: props.editFormData.DOB && props.editFormData.DOB.length>10?HelperUtils.formateDate(props.editFormData.DOB):props.editFormData.DOB, phoneNumber: props.editFormData.phoneNumber, gender: props.editFormData.gender, roles: getRolesInArrayFormat(props.editFormData.roles) });
            clearErrors()
        } else {
            setData({ firstName: '', lastName: '', email: '', phoneNumber: '', gender: '', DOB: '', roles: [] });
            clearErrors()
        }
    }, [props.editFormData]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        validate(e.target.name, e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (data._id !== '' && data._id !== undefined) {
                updateUser(data);
            } else {
                delete data._id;
                saveUser(data);
            }
            //Resetting form state once saved or updated
            setData({ _id: '', firstName: '', lastName: '', email: '', phoneNumber: '', DOB: '', roles: [] });
            clearErrors();
            props.onClose();
        } else {
            console.error('error while saving user');
        }

    };
    const validate = (firstName, value) => {
        switch (firstName) {
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
                } else {
                    setErrors({ ...errors, lastName: '' });
                }
                break;
            case 'email':
                if (value === '') {
                    setErrors({ ...errors, email: 'Email is required' });
                } else if (!HelperUtils.validateEmail(value)) {
                    setErrors({ ...errors, email: 'Invalid Email' });
                } else {
                    setErrors({ ...errors, email: '' });
                }
                break;
            case 'gender':
                if (value === '') {
                    setErrors({ ...errors, gender: "select Gender" });
                } else {
                    setErrors({ ...errors, gender: '' });
                }
                break;
            case 'phoneNumber':
                if (value === '') {
                    setErrors({ ...errors, phoneNumber: 'Phone Number is required' });
                } else if (!HelperUtils.validatePhoneNumber(value)) {
                    setErrors({ ...errors, phoneNumber: 'Invalid Phone Number' });
                } else {
                    setErrors({ ...errors, phoneNumber: '' });
                }
                break;
            case 'roles':
                if (value.length === 0) {
                    setErrors({ ...errors, roles: 'Role is required' });
                } else {
                    setErrors({ ...errors, roles: '' });
                }
                break;
            case 'DOB':
                if (value === '') {
                    setErrors({ ...errors, DOB: 'Date of Birth is required' });
                } else if (value.length > 10 && !HelperUtils.validateDate(value)) {
                    setErrors({ ...errors, DOB: 'Invalid Date of Birth' });
                } else if (value.length === 10 && !HelperUtils.validateMaxDate(value)) {
                    setErrors({ ...errors, DOB: 'Maximam Date should be 2099-12-31' });
                } else if (value.length === 10 && !HelperUtils.validateMinDate(value)) {
                    setErrors({ ...errors, DOB: 'Minimum Date Should be 1900-01-01' });
                } else {
                    setErrors({ ...errors, DOB: '' });
                }
                break;
            default:
                break;
        }
    }

    const validateForm = () => {
        let isValid = true;
        let errorsObj = { firstName: '', lastName: '', email: '', phoneNumber: '', gender: '', roles: '', DOB: '' }
        if (data.firstName === "") {
            errorsObj["firstName"] = "FirstName is reuired."
            isValid = false;
        }
        if (data.lastName === "") {
            errorsObj["lastName"] = "LastName is reuired."
            isValid = false;
        }
        if (data.email === '') {
            errorsObj['email'] = 'Email is required';
            isValid = false;
        }
        if (data.email !== '') {
            if (!HelperUtils.validateEmail(data.email)) {
                errorsObj['email'] = 'Email is not valid';
                isValid = false;
            }
        }
        if (data.phoneNumber === '') {
            errorsObj['phoneNumber'] = 'Phone Number is required';
            isValid = false;
        }
        if (data.phoneNumber !== '') {
            if (!HelperUtils.validatePhoneNumber(data.phoneNumber)) {
                errorsObj['phoneNumber'] = 'Invalid Phone Number';
            }
        }
        if (data.gender === '') {
            errorsObj['gender'] = 'Please Select Gender';
            isValid = false;
        }
        if (data.DOB === '') {
            errorsObj['DOB'] = 'Please Select DateOfBirth';
            isValid = false;
        }
        if (data.roles.length === 0) {
            errorsObj['roles'] = 'Role is required';
            isValid = false;
        }
        setErrors(errorsObj);
        return isValid;
    };

    return (
        <div className="AddUser-Model">
            <Dialog className="MuiDialog-paper-AddUserModel"
                open={props.open}
                onClose={props.onClose}
            >
                <MuiDialogTitle>
                <img src={props.editFormData === null  ||  props.editFormData.profilePicture=== undefined ? '/user.png': props.editFormData.profilePicture } alt="" style={{ width: 40, borderRadius: '50%' }} />
                </MuiDialogTitle>
                <DialogContent>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="firstName"
                        type="text"
                        name="firstName"
                        onChange={handleChange}
                        error={errors.firstName !== "" ? true : false}
                        helperText={errors.firstName}
                        value={data.firstName}
                    />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="LastfirstName"
                        type="text"
                        name="lastName"
                        onChange={handleChange}
                        error={errors.lastName !== "" ? true : false}
                        helperText={errors.lastName}
                        value={data.lastName}
                    />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="Phono"
                        type="text"
                        name="phoneNumber"
                        onChange={handleChange}
                        error={errors.phoneNumber !== "" ? true : false}
                        helperText={errors.phoneNumber}
                        value={data.phoneNumber}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        type="email"
                        name="email"
                        disabled={props.editFormData && props.editFormData._id!==""?true:false}
                        onChange={handleChange}
                        error={errors.email !== "" ? true : false}
                        helperText={errors.email}
                        value={data.email}
                    />
                    <TextField
                        name="DOB"
                        id="date"
                        label="DateOfBirth"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={data.DOB}
                        onChange={handleChange}
                        placeholder="Date of Birth"
                        error={errors.DOB !== "" ? true : false}
                        helperText={errors.DOB}
                        fullWidth
                        required
                        
                    />

                    <div className="secondRow">
                        <FormControl variant="outlined" >
                            <InputLabel htmlFor="outlined-age-native-simple">Gender</InputLabel>
                            <Select
                                native
                                label="Gender"
                                name="gender"
                                onChange={handleChange}
                                error={errors.gender !== "" ? true : false}
                                helperText={errors.gender}
                                value={data.gender}
                            >
                                <option aria-label="None" value="" />
                                <option value="MALE">MALE</option>
                                <option value="FEMALE">FEMALE</option>
                            </Select>
                        </FormControl>
                        <Autocomplete
                            multiple
                            options={[{ role_name: "USER" }, { role_name: "ADMIN" }, { role_name: "SUPER_ADMIN" }]}
                            getOptionLabel={(option) => option.role_name}
                            onChange={(event, value) => {
                                //Removing Duplicate Objects from Array
                                let rls = value.filter((v, i, a) => a.findIndex(t => (t.role_name === v.role_name)) === i);
                                setData({ ...data, roles: rls });
                                validate('roles', value);
                            }}
                            value={data.roles}
                            filterSelectedOptions
                            disabled={props.role ==="SUPER_ADMIN"?false:true}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Roles"
                                    placeholder="Roles"
                                    margin="normal"
                                    error={errors.roles !== "" ? true : false}
                                    helperText={errors.roles}

                                />
                            )}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} variant="contained" className="addUserButton" color="primary">{props.editFormData !== undefined && props.editFormData !== null?"Update":"AddUser"}</Button>
                    <Button onClick={props.onClose} variant="contained" color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddUserModel
