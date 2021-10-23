import React from 'react'
import { Route,Redirect ,withRouter} from "react-router-dom";
const PrivateRoute = (props) => {
    return (
        <Route {...props} >
               { localStorage.getItem("isAuthenticated") === "true" && localStorage.getItem("loginDate") ===new Date().toDateString() ? props.children : <Redirect to = "/" /> }
        </Route>
    )
}

export default withRouter(PrivateRoute);
