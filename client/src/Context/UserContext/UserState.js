import React, { useReducer,useState } from 'react'
import UserContext from "./UserContext";
import UserReducer from './UserReducer';
import UserApiCall from "../../ApiCalls/UsersApiCall";
import Notifier from '../../Utils/Notifier';
import UserActions from "./UserActions";
import config from '../../ApiCalls/Config';
import Spinner from "../../Utils/Spinner";


const UserState = (props) => {
    const initialState = {
        users: [],
        loggedInUser: {},
        totalCount:0
    }
    const [state, dispatch] = useReducer(UserReducer, initialState);
    const [spinner, setSpinner] = useState(false);

    const saveUser = async (user) => {
        setSpinner(true);
        await UserApiCall.saveUser(user)
            .then(response => {
                setSpinner(false);
                if (response.data.statusCode === 200) {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS,);
                    dispatch({ type: UserActions.SAVE_USER, payload: response.data.data });
                }
                else {
                    Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
                }
            })
            .catch(error => {
                setSpinner(false);
                console.error("while saving user", error);
            }).finally(() => {
                setSpinner(false);
            });
    }

    const getUser = (id) => {
        dispatch({
            type: UserActions.GET_USER,
            payload: id
        })
    }
    const deleteUser = async (id) => {
        setSpinner(true);
        await UserApiCall.deleteUser(id)
            .then(response => {
                setSpinner(false);
                if (response.data.statusCode === 200) {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS,);
                    dispatch({
                        type: UserActions.DELETE_USER,
                        payload: id
                    })
                }else {
                    Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
                }
            })
            .catch(error => {
                setSpinner(false);
                console.error("while deleting user", error);
            }).finally(() => {
                setSpinner(false);
            });
    }

    const getAllUsers = async (pageNumber,pageSize) => {
        setSpinner(true);
        await UserApiCall.getAllUsers(pageNumber,pageSize)
            .then(response => {
                setSpinner(false);
                dispatch({
                    type: UserActions.GET_ALL_USERS,
                    payload: response.data
                })
            })
            .catch(error => {
                console.log(error);
                setSpinner(false);
            }).finally(()=>{
                setSpinner(false);
            });
    }

    const updateUser = async (user) => {
        setSpinner(true);
        await UserApiCall.updateUser(user)
            .then(response => {
                setSpinner(false);
                if (response.data.statusCode === 200) {
                    Notifier.notify("User Details Updated Successfully", Notifier.notificationType.SUCCESS);
                    config.LOCAL_FORAGE.setItem("user", response.data.data);
                    dispatch({
                        type: UserActions.UPDATE_USER,
                        payload: response.data.data
                    })
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                }
            })
            .catch(error => {
                setSpinner(false);
                console.error(error);
            }).finally(() => {
                setSpinner(false);
            });
    }

    const uploadProfilePic = async (file) => {
        setSpinner(true);
        UserApiCall.uploadProfilePic(file)
            .then(response => {
                setSpinner(false);
                if (response.data.statusCode === 200) {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                    config.LOCAL_FORAGE.removeItem('user');
                    config.LOCAL_FORAGE.setItem('user', response.data.data);
                    dispatch({
                        type: UserActions.UPDATE_USER,
                        payload: response.data.data
                    })
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                }
            })
            .catch(error => {
                setSpinner(false);
                console.error(error);
            }).finally(() => {
                setSpinner(false);
            });
    }

    const addLoggedInUserData = (data) => {
        dispatch({
            type: UserActions.ADD_LOGIN_USER_DATA,
            payload: data
        })
    }
    const getLoggedInUserData = () => {
        dispatch({
            type: UserActions.GET_LOGIN_USER_DATA,
            payload: ''
        })
    }


    return (
        <>
        {spinner && <Spinner open={spinner} />}
        <UserContext.Provider value={{
            users:state,
            saveUser,
            deleteUser,
            updateUser,
            getUser,
            getAllUsers,
            uploadProfilePic,
            addLoggedInUserData,
            getLoggedInUserData
        }}>
            {props.children}
        </UserContext.Provider >
        </>
    )
}

export default UserState;
