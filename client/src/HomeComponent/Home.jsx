import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";
import LogOutIcon from "@material-ui/icons/PowerSettingsNewOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import AccountCircleSharpIcon from "@material-ui/icons/AccountCircleSharp";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import config from "../ApiCalls/Config";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import Notifier from "../Utils/Notifier";
import UploadProfilePic from "../ManageUsers/UploadProfilePic";
import Sidebar from "./Sidebar";
import ChangePassword from "./ChangePassword";
import AddUserModel from "../ManageUsers/AddUserModel";

import "./sidebar.scss";

function NavBar(props) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [role, setRole] = useState("USER");
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      getLoggedInUserDataPromise();
    }, 1);
  }, []);

  const getLoggedInUserDataPromise = () => {
    return new Promise((resolve, reject) => {
      config.LOCAL_FORAGE.getItem("user").then((res) => {
        setLoggedInUserData(res);
        resolve(res);
      });
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
    setRole(localStorage.getItem("role"));
  };

  const dropDropDownItemClick = (event) => {
    if (event.currentTarget.innerText === "Profile") {
      setShowProfilePic(true);
    } else if (event.currentTarget.innerText === "Account") {
      setRole(
        localStorage.getItem("role") === null
          ? "USER"
          : localStorage.getItem("role")
      );
      setShowAccountDetails(true);
      getLoggedInUserDataPromise();
    } else if (event.currentTarget.innerText === "Password") {
      setShowChangePassword(true);
    } else {
      config.LOCAL_FORAGE.removeItem("token");
      config.LOCAL_FORAGE.removeItem("user");
      localStorage.clear();
      navigate("/signin");
      Notifier.notify(
        "You are Logged out  Successfully!.",
        Notifier.notificationType.SUCCESS
      );
    }
  };
  const constructImage = (row) => {
    if (row) {
      return `data:${row.contentType};base64,${new Buffer.from(
        row.data
      ).toString("base64")}`;
    } else {
      return "/user.png";
    }
  };
  return (
    <div className="home-container">
      <AddUserModel
        open={showAccountDetails}
        onClose={() => setShowAccountDetails(false)}
        role={role}
        editFormData={loggedInUserData}
      />
      <UploadProfilePic
        open={showProfilePic}
        onClose={() => {
          setShowProfilePic(false);
          getLoggedInUserDataPromise();
        }}
        image={loggedInUserData !== null ? loggedInUserData.profilePicture : ""}
      />
      <ChangePassword
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <div
            onClick={dropDropDownItemClick}
            name="Profile"
            style={{ display: "flex" }}
          >
            <PersonIcon />
            <Typography>Profile</Typography>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div
            onClick={dropDropDownItemClick}
            name="Account"
            style={{ display: "flex" }}
          >
            <SettingsIcon style={{ paddingRight: "4px" }} />
            <Typography>Account</Typography>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div
            onClick={dropDropDownItemClick}
            name="Password"
            style={{ display: "flex" }}
          >
            <VpnKeyIcon style={{ paddingRight: "4px" }} />
            <Typography>Password</Typography>
          </div>
        </MenuItem>
        <MenuItem onClick={dropDropDownItemClick}>
          <div name="logout" style={{ display: "flex" }}>
            <LogOutIcon style={{ paddingRight: "4px" }} />
            <Typography>Logout</Typography>
          </div>
        </MenuItem>
      </Menu>
      <AppBar
        title="Java Quiz Application"
        variant="elevation"
        className="nav-bar"
      >
        <Toolbar>
          <IconButton onClick={handleMenuClick}>
            <MenuIcon style={{ color: "white", fontSize: "2.5rem" }} />
          </IconButton>
          <Typography variant="h6">Java Quiz Application</Typography>
          {loggedInUserData !== null &&
          loggedInUserData.profilePicture !== undefined ? (
            <img
              onClick={handleClick}
              src={constructImage(loggedInUserData.profilePicture)}
              title={loggedInUserData && loggedInUserData.email}
              alt=""
            />
          ) : (
            <AccountCircleSharpIcon onClick={handleClick} />
          )}
        </Toolbar>
      </AppBar>
      <Sidebar
        open={sidebarOpen}
        role={role}
        onHide={() => setSidebarOpen(false)}
      />
    </div>
  );
}

export default NavBar;
