import React, { useReducer } from 'react'
import UserContext from "./UserContext";
import UserReducer from './UserReducer';
import UserApiCall from "../../ApiCalls/UsersApiCall";
import Notifier from '../../Utils/Notifier';
import UserActions from "./UserActions";
import config from '../../ApiCalls/Config';


const UserState = (props) => {
    const initialState = {
        users: [],
        loggedInUser: {},
        totalCount:0
    }
    const [state, dispatch] = useReducer(UserReducer, initialState);

    const saveUser = async (user) => {
        await UserApiCall.saveUser(user)
            .then(response => {
                if (response.data.statusCode === 200) {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS,);
                    dispatch({ type: UserActions.SAVE_USER, payload: response.data.data });
                }
                else {
                    Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
                }
            })
            .catch(error => {
                console.error("while saving user", error);
            });
    }

    const getUser = (id) => {
        dispatch({
            type: UserActions.GET_USER,
            payload: id
        })
    }
    const deleteUser = async (id) => {
        await UserApiCall.deleteUser(id)
            .then(response => {
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
                console.error("while deleting user", error);
            });
    }

    const getAllUsers = async (pageNumber,pageSize) => {
        await UserApiCall.getAllUsers(pageNumber,pageSize)
            .then(response => {
                dispatch({
                    type: UserActions.GET_ALL_USERS,
                    payload: response.data
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    const updateUser = async (user) => {
        await UserApiCall.updateUser(user)
            .then(response => {
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
                console.error(error);
            })
    }

    const uploadProfilePic = async (file) => {
        UserApiCall.uploadProfilePic(file)
            .then(response => {
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
                console.error(error);
            })
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
    )
}

export default UserState;
