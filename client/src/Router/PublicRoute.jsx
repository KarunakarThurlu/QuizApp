import React from "react";
import { Route, Navigate } from "react-router-dom";
//import { isLogin } from "../Router/VerifyAuth";
import { useNavigate } from "react-router-dom";

function PublicRoute({
  element: Component,
  restricted,
  redirectTo = "/home",
  ...rest
}) {
  const navigate = useNavigate();
  return (
    <Route
      {...rest}
      element={
        true ? (
          <Navigate to={redirectTo} replace state={{ from: rest.location }} />
        ) : (
          <Component />
        )
      }
    ></Route>
  );
}

export default PublicRoute;
