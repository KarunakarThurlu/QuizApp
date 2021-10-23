import React from 'react'
import { Route, Redirect } from "react-router-dom";
//import { isLogin } from "../Router/VerifyAuth";



const PublicRoute = ({ component: Component, restricted, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => (
                localStorage.getItem("isAuthenticated") === "true" && restricted ? <Redirect to="/home" /> : <Component {...props} />
            )} />
    )
}

export default PublicRoute
