import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth =
    localStorage.getItem("isAuthenticated") === "true" &&
    localStorage.getItem("loginDate") === new Date().toDateString();
  if (!auth) {
    return <Navigate to="/" replace />;
  }
  return (
    <Fragment>
      <Component {...rest} />
    </Fragment>
  );
};
export default PrivateRoute;
