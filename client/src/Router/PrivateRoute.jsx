import React, { Fragment } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import useAuth from "./UseAuth";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth =
    localStorage.getItem("isAuthenticated") === "true" &&
    localStorage.getItem("loginDate") === new Date().toDateString();
  console.log("IsAuthenticated : ", auth);
  if (!auth) {
    return <Navigate to="/" replace />;
  }
  return (
    <Fragment>
      <Component {...rest} />
    </Fragment>
  );
  //return auth ? <Route {...props} /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
