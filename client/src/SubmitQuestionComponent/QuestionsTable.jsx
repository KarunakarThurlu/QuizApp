
import React, { useContext, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import HelperUtils from '../Utils/HelperUtils';
import Home from '../HomeComponent/Home';
import SubmitQuestionModel from "./SubmitQuestionModel";
import ChangeQuestionStatusModel from "./ChangeQuestionStatusModel";
import Tooltip from '@material-ui/core/Tooltip';
import WarningPopupModel from "../Utils/WarningPopUpModel"
import DataTable from "../Utils/DataTable";
import "./AddQuestions.scss";
import CircularProgress from '@material-ui/core/CircularProgress';
import QuestionsContext from '../Context/QuestionsContext/QuestionsContext';
import CommonConstants from '../Utils/CommonConstants';
import QuestionsVisualization from './QuestionsVisualization';


const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        boxShadow: theme.shadows[1],
        fontSize: 14,
    },
}))(Tooltip);


function SubmitQuestion(props) {

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [formDataToEdit, setFormDataToEdit] = useState({});
    const [statusModelOpen, setStatusModelOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState();
    const [showWarningPopup, setShowWarningPopup] = useState(false);
    const [questionIdForDelete, setQuestionIdForDelete] = useState(0);
    const [showVisualization,setShowVisualization]=useState(false);
    const [spinner,setSpinner]=useState(false);
    const { getAllQuestions, questions, deleteQuestion,updateQuestion } = useContext(QuestionsContext);

    useEffect(() => {
        getAllQuestions(page, rowsPerPage);
    }, []);

    const handleChangePage = (event, newPage) => {
        setSpinner(true);
        setPage(newPage);
        getAllQuestions(newPage, rowsPerPage);
        //setSpinner(false);
    };
    const getDataOnPageChange =(pageSize)=>{
        setSpinner(true);
        setPage(1);
        getAllQuestions(1, pageSize);
    }
    const handleDeleteQuestion = () => {
        deleteQuestion(questionIdForDelete);
        setShowWarningPopup(false);
    }
    const columns =
        [
            {
                field: 'questionId', title: 'Id',
                render: (params) => (
                    <LightTooltip key={params.name._id} title={params._id} arrow >
                        <span className="table-cell-trucate">{params._id.substr(0, 7)}</span>
                    </LightTooltip>
                ),
            },
            {
                field: 'name', title: 'Question Name',
                render: (params) => (
                    <LightTooltip key={params.name._id} title={params.name} arrow >
                        <span className="table-cell-trucate">{params.name.substr(0, 17)}...</span>
                    </LightTooltip>
                ),
            },
            { field: 'creator_name', title: 'Creator', },
            { field: 'topic_name', title: 'Topic', },
            {
                field: "optionA", title: "optionA",
                render: (params) => (
                    <LightTooltip key={params.name._id} title={params.optionA} arrow >
                        <span className="table-cell-trucate">{params.optionA.substr(0, 17)}{params.optionA.length>16?"...":""}</span>
                    </LightTooltip>
                ),
            },
            {
                field: "optionB", title: "optionB",
                render: (params) => (
                    <LightTooltip key={params.name._id} title={params.optionB} arrow >
                        <span className="table-cell-trucate">{params.optionB.substr(0, 17)}{params.optionB.length>16?"...":""}</span>
                    </LightTooltip>
                ),
            },
            {
                field: "optionC", title: "optionC", 
                render: (params) => (
                    <LightTooltip key={params.name._id} title={params.optionC} arrow >
                        <span className="table-cell-trucate">{params.optionC.substr(0, 17)}{params.optionC.length>16?"...":""}</span>
                    </LightTooltip>
                ),
            },
            {
                field: "optionD", title: "optionD",
                render: (params) => (
                    <LightTooltip key={params.name._id} title={params.optionD} arrow >
                        <span className="table-cell-trucate">{params.optionD.substr(0, 17)}{params.optionD.length>16?"...":""}</span>
                    </LightTooltip>
                ),
            },
            {
                field: 'status', title: 'Status', align: 'center',
                render: (params) => (<Button variant="contained" style={{ color: params.status === "APPROVED" ? '#388e3c' : params.status === "PENDING" ? "#f57c00" : "#d32f2f", width: "10em" }} onClick={() => { setStatusModelOpen(true); setCurrentQuestion(params) }}>{params.status} </Button>)
            },
            {
                field: 'updatedOn', title: 'Update Date', cellStyle: {
                    whiteSpace: 'nowrap'
                },
            },
            { field: 'createdOn', title: 'Created Date', },
        ];
    const rows = questions.questions;
    const totalCount = questions.totalCount;
    if (rows !== undefined && rows.length !== 0) {
        rows.forEach((q, i) => {
            q.creator_name = q.creator.email;
            q.topic_name = q.topic.topicName;
            q.createdOn = HelperUtils.formateDate(q.createdOn);
            q.updatedOn = HelperUtils.formateDate(q.updatedOn);
        });
    }
    const updateQuestioninList = (data) => {
        updateQuestion(data);
        setStatusModelOpen(false)
    }
    const TableData = { columns, rows, page, rowsPerPage, totalCount,toolTip:"Add Question",showGroupByHeader:true,title:"Questions Data" ,showActions:true}
    return (
        <div className="questions-container">
            <Home />
            {spinner && <CircularProgress/>}
            {showVisualization && <QuestionsVisualization open={showVisualization} onClose={()=>setShowVisualization(false)}/>}
            {updateQuestioninList && <ChangeQuestionStatusModel updateQuestion={updateQuestioninList} open={statusModelOpen} CQData={currentQuestion} onClose={() => setStatusModelOpen(false)} />}
            {open && <SubmitQuestionModel open={open} editFormData={formDataToEdit} onClose={() => setOpen(false)} />}
            <WarningPopupModel open={showWarningPopup} message={CommonConstants.Delete_Question_Warning} onClickYes={handleDeleteQuestion} handleClose={() => setShowWarningPopup(false)} />
            <div className="Data-Table">
                <DataTable
                    data={TableData}
                    handleChangePage={handleChangePage}
                    setFormDataToEdit={setFormDataToEdit}
                    setOpen={setOpen}
                    setIdForDelete={setQuestionIdForDelete}
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
export default SubmitQuestion

//<MaterialTable columns={columns} tableRef={props.tableRef} title="Contacts" isLoading={!props.remote} onSearchChange={e => searchInData(e)} data={props.contactList} key={props.limit} components={{ Pagination: () => { return (<TablePagination rowsPerPageOptions={[5, 10, 25]} count={props.count} rowsPerPage={props.limit} page={props.page - 1} onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage} />); }, }} actions={[{ icon: () => <FilterListIcon />, tooltip: 'Filters', isFreeAction: true, onClick: () => OpenFilterModal(), }, { icon: 'add', tooltip: 'Add Contact', isFreeAction: true, onClick: () => setAddDrawer(), },]} />
