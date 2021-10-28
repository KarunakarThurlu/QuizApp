import React, { useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import QuestionsApiCall from '../ApiCalls/QuestionsApiCall';
import DataTable from "../Utils/DataTable";
import HelperUtils from '../Utils/HelperUtils';
import Spinner from '../Utils/Spinner';
import "./dashboard.scss"

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        boxShadow: theme.shadows[1],
        fontSize: 14,
    },
}))(Tooltip);


function UserQuestionsView(props) {

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount,setTotalCount]=useState(0);
    const [questions, setQuestions] = useState([]);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        setSpinner(true);
        QuestionsApiCall.userQuestionsViewInDashboard(page,rowsPerPage,props.status)
        .then(res=>{
            setSpinner(false);
            if(res.data.statusCode===200){
               setQuestions(res.data.data);
               setTotalCount(res.data.totalCount);
            }
        })
        .catch(err=>{
            setSpinner(false);
            console.log(err);
        }).finally(()=>{
            setSpinner(false);
        })
    }, [page, rowsPerPage,props.status]);
    
   const columns =
        [
            {
                field: 'name', title: 'Question Name',
                render: (params) => (
                    <LightTooltip key={params.name._id} title={params.name} arrow >
                        <span className="table-cell-trucate">{params.name.substr(0, 17)}...</span>
                    </LightTooltip>
                ),
            },
            {
                field: "optionA", title: "optionA",
                cellStyle: {
                    whiteSpace: 'nowrap'
                },
            },
            {
                field: "optionB", title: "optionB",
                cellStyle: {
                    whiteSpace: 'nowrap'
                },
            },
            {
                field: "optionC", title: "optionC", cellStyle: {
                    whiteSpace: 'nowrap'
                },
            },
            {
                field: "optionD", title: "optionD",
                cellStyle: {
                    whiteSpace: 'nowrap'
                },
            },
            { field: 'createdOn', title: 'Created Date', },
        ];
        if(props.status==='REJECTED'){//rejectedReason
            columns.push({
                field: 'status', title: 'Status', align: 'center',
                render: (params) => (<span variant="contained" style={{ color : "#d32f2f", width: "10em" }} >{params.status} </span>)
            },
            {
                field: 'rejectedReason', title: 'RejectedReason', align: 'center',
                render: (params) => (<span variant="contained" style={{ color : "#d32f2f", width: "10em" }} >{params.rejectedReason} </span>)
            }
            );
        }
        const rows = questions;
        if (rows !== undefined && rows.length !== 0) {
            rows.forEach((q, i) => {
                q.creator_name = q.creator.name;
                q.topic_name = q.topic.topicName;
                q.createdOn = HelperUtils.formateDate(q.createdOn);
                q.updatedOn = HelperUtils.formateDate(q.updatedOn);
            });
        }
        const TableData = { columns, rows, page, rowsPerPage,title:"Questions Data" ,showGroupByHeader:false, totalCount,showActions:false}
    return (
        <div>
            {spinner && <Spinner open={spinner} />}
            <Dialog onClose={props.onClose} open={props.open} className="userQuestionsView">
                <MuiDialogTitle>
                    <IconButton className="closeButton" onClick={props.onClose}><CloseIcon /></IconButton>
                </MuiDialogTitle>
                <MuiDialogContent>
                <DataTable
                    data={TableData}
                    handleChangePage={(event, newPage) => {
                        setPage(newPage);
                        setRowsPerPage(rowsPerPage);
                    }}
                    setRowsPerPage={setRowsPerPage}
                    setPage={setPage}
                    getDataOnPageChange={(pageSize) => {
                        setPage(1);
                        setRowsPerPage(pageSize);
                    }}
                />
                </MuiDialogContent>
            </Dialog>
        </div>
    )
}

export default UserQuestionsView
