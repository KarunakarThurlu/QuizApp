import React, { useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import QuestionsApiCall from '../ApiCalls/QuestionsApiCall';
import DataTable from "../Utils/DataTable";
import HelperUtils from '../Utils/HelperUtils';
import Spinner from '../Utils/Spinner';
import TooltipUtil from "../Utils/ToolTip";
import "./dashboard.scss"



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
                render: (params) => (<TooltipUtil key={params.name._id} toolTipData={params.name} length={40} />),
            },
            {
                field: "optionA", title: "optionA",
                render: (params) => ( <TooltipUtil key={params.optionA._id} toolTipData={params.optionA} length={17} /> ),
            },
            {
                field: "optionB", title: "optionB",
                render: (params) => ( <TooltipUtil key={params.optionB._id} toolTipData={params.optionB} length={17} /> ),
            },
            {
                field: "optionC", title: "optionC", 
                render: (params) => ( <TooltipUtil key={params.optionC._id} toolTipData={params.optionC} length={17} />),
            },
            {
                field: "optionD", title: "optionD",
                render: (params) => (<TooltipUtil key={params.optionD._id} toolTipData={params.optionD} length={17} />),
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
                render: (params) => (<span  style={{ color : "#d32f2f" }} ><TooltipUtil toolTipData= {params.rejectedReason} length={15}/></span>)
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
