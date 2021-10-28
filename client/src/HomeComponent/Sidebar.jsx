import React from 'react'
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from "react-router-dom"
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import DashboardIcon from '@material-ui/icons/Dashboard';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import AssignmentIcon from '@material-ui/icons/Assignment';
import GroupIcon from '@material-ui/icons/Group';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import LayersIcon from '@material-ui/icons/Layers';
import Typography from '@material-ui/core/Typography';

function Sidebar(props) {

    return (
        <div className="sidebar">
            <Drawer variant="persistent"
                anchor="left" openSecondary={true} open={props.open} >
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", height: "4.0em", backgroundColor: "hsl(231deg 48% 48%)" }}>
                    <img src="/icons8-java8.svg" alt="" style={{ height: "60px", width: "60px", marginRight: "20px" }} />
                    <IconButton onClick={props.onHide} >
                        <CloseIcon style={{ color: "InactiveBorder", fontSize: "2.0rem" }} />
                    </IconButton>
                </div>
                <Divider />
                <MenuItem onClick={props.onHide} >
                    <DashboardIcon />
                    <Link to="/questionsdashboard" className="MuiMenuItem-root-sidebar">
                        <Typography variant="h6">
                            Dashboard
                        </Typography>
                    </Link>
                </MenuItem>
                <MenuItem onClick={props.onHide}>
                    <AssignmentIcon />
                    <Link to="/writeexam" className="MuiMenuItem-root-sidebar">
                        <Typography variant="h6">
                            WriteExam
                        </Typography>
                    </Link>
                </MenuItem>
                <MenuItem onClick={props.onHide}>
                    <AddToQueueIcon />
                    <Link to="/addquestion" className="MuiMenuItem-root-sidebar">
                        <Typography variant="h6">
                            Add Question
                        </Typography>
                    </Link>
                </MenuItem>
                <MenuItem onClick={props.onHide}>
                    <WebAssetIcon />
                    <Link to="/examsdetails" className="MuiMenuItem-root-sidebar">
                        <Typography variant="h6">
                            Exams
                        </Typography>
                    </Link>
                </MenuItem>
                {props.role === "ADMIN" || props.role === "SUPER_ADMIN" ?
                    <MenuItem onClick={props.onHide} >
                        <MenuBookIcon />
                        <Link to="/submitquestion" className="MuiMenuItem-root-sidebar">
                            <Typography variant="h6">
                                Questions
                            </Typography>
                        </Link>
                    </MenuItem> : ""}
                {props.role === "SUPER_ADMIN" ?
                    <>
                        <MenuItem onClick={props.onHide}>
                            <GroupIcon />
                            <Link to="/manageusers" className="MuiMenuItem-root-sidebar">
                                <Typography variant="h6">
                                    Users
                                </Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={props.onHide}>
                            <LayersIcon />
                            <Link to="/topic" className="MuiMenuItem-root-sidebar">
                                <Typography variant="h6">
                                    Topics
                                </Typography>
                            </Link>
                        </MenuItem>
                    </>
                    : ""}

            </Drawer>
        </div>
    )
}

export default Sidebar
