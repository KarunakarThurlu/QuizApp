import React, { useContext, useEffect, useState } from 'react'
import HelperUtils from "../Utils/HelperUtils"
import UserContext from '../Context/UserContext/UserContext';
import Home from '../HomeComponent/Home';
import WarningPopupModel from "../Utils/WarningPopUpModel"
import CommonConstants from '../Utils/CommonConstants';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AddUserModel from './AddUserModel';
import ViewProfilePic from './ViewProfilePic';
import DataTable from "../Utils/DataTable";
import Button from '@material-ui/core/Button';
import UsersVisualization from './UsersVisualization';
import config from "../ApiCalls/Config";
import ChangePassword from "../HomeComponent/ChangePassword";

import "./manageusers.scss";
import "../Utils/DataTable.scss"
function ManageUsers(props) {

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [openProfilePic, setOpenProfilePic] = useState(false);
    const [showWarningPopup, setShowWarningPopup] = useState(false);
    const [showVisualization,setShowVisualization]=useState(false);
    const [formDataToEdit, setFormDataToEdit] = useState({});
    const [userIdForDelete, setUserIdForDelete] = useState(0);
    const [currentRowData, setCurrentRowData] = useState({});
    const [superAdmin,setSuperAdmin] =useState(false);
    const [showresetpasswordmodel,setShowresetpasswordmodel]=useState(false);

    const { getAllUsers, users, deleteUser } = useContext(UserContext);

    useEffect(() => {
        getAllUsers(page,rowsPerPage);
        getLoggedInUserDataPromise();
    }, [])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getAllUsers(newPage, rowsPerPage);
    };
    const getDataOnPageChange = (pageSize) => {
        setPage(1);
        getAllUsers(1, pageSize);
    }

    const getLoggedInUserDataPromise = () => {
        return new Promise((resolve, reject) => {
            config.LOCAL_FORAGE.getItem("user").then((res) => {
                if(res.roles.find(r=>r.role_name==="SUPER_ADMIN")!==undefined)
                    setSuperAdmin(true);
            });
        })
    }

    const columns =
        [
            { field: '_id', title: 'Id' },
            {
                title: 'Profile', field: 'imageUrl',
                render: rowData =>
                    <img src={rowData.profilePicture !== null && rowData.profilePicture !== undefined ? rowData.profilePicture : "/user.png"} alt="" onClick={() => { setCurrentRowData(rowData); setOpenProfilePic(true) }} style={{ width: 40, borderRadius: '50%' }} />
            },
            { field: 'firstName', title: 'FirstName', },
            { field: 'lastName', title: 'lastName', },
            { field: 'DOB', title: 'DateOfBirth', },
            { field: 'phoneNumber', title: 'PnoneNumber', },
            { field: 'email', title: 'Email', },
            { field: 'gender', title: 'Gender', },
            { field: 'status', title: 'status', },
            { field: 'createdOn', title: 'createdOn', },
            { field: 'updatedOn', title: 'updatedOn', },
            { field: 'roles', title: 'Roles', },
        ];
        if(superAdmin){
            columns.push( {
                field: 'status', title: 'ResetPassword', align: 'center',
                render: (row) => (<Button startIcon={<VpnKeyIcon/>} variant="contained" onClick={()=>{setShowresetpasswordmodel(true);setCurrentRowData(row)}} ></Button>)
            },);
        }
    const getRolesWithComma = (roles) => {
        let rolesWithComma = "";
        if (typeof roles !== 'string') {
            roles.forEach(role => {
                rolesWithComma += role.role_name + ",";
            });
            return rolesWithComma.substring(0, rolesWithComma.length - 1);
        } else {
            return roles;
        }
    }
    const rows = users.users;
    const totalCount = users.totalCount;
    if (rows.length !== 0 && rows.length!==undefined) {
        rows.forEach((q, i) => {
            q.createdOn = HelperUtils.formateDate(q.createdOn);
            q.updatedOn = HelperUtils.formateDate(q.updatedOn);
            q.DOB = HelperUtils.formateDate(q.DOB);
            q.roles = getRolesWithComma(q.roles);
        });
    }


    const handleDeleteUser = () => {
        setShowWarningPopup(false);
        deleteUser(userIdForDelete);
    }
    const TableData = { columns, rows, page, rowsPerPage, totalCount,toolTip:"Add User",showGroupByHeader:true,title:"Users Data ",showActions:true }
    return (
        <div className="ManageUsers">
            <Home />
            {showVisualization && <UsersVisualization  open={showVisualization} onClose={()=>setShowVisualization(false)}/>}
            {showresetpasswordmodel && <ChangePassword role={superAdmin} userId={currentRowData._id} open={showresetpasswordmodel} onClose={()=>setShowresetpasswordmodel(false)}/>}
            <ViewProfilePic open={openProfilePic} onClose={() => setOpenProfilePic(false)} image={currentRowData.profilePicture} />
            <AddUserModel open={open} editFormData={formDataToEdit} onClose={() => setOpen(false)} isAdmin={"true"} />
            <WarningPopupModel open={showWarningPopup} message={CommonConstants.Delete_User_Warning} onClickYes={handleDeleteUser} handleClose={() => setShowWarningPopup(false)} />
            <div className="Data-Table">
                <DataTable
                    data={TableData}
                    handleChangePage={handleChangePage}
                    setFormDataToEdit={setFormDataToEdit}
                    setOpen={setOpen}
                    setIdForDelete={setUserIdForDelete}
                    setShowWarningPopup={setShowWarningPopup}
                    setRowsPerPage={setRowsPerPage}
                    setPage={setPage}
                    getDataOnPageChange={getDataOnPageChange}
                    setShowVisualization={setShowVisualization}
                />
            </div>
        </div>
    )
}

export default ManageUsers