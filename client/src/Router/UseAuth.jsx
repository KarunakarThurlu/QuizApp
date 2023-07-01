import React, { useState, useEffect } from "react";

export default function useAuth() {
  const [auth, setAuth] = useState(false); // user undefined

  useEffect(() => {
    const authenticated =
      localStorage.getItem("isAuthenticated") === "true" &&
      localStorage.getItem("loginDate") === new Date().toDateString();
    setAuth(authenticated);
  }, []);

  return auth;
}
