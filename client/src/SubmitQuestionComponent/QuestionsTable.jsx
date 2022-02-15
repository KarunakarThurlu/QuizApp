
import React, { useContext, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import HelperUtils from '../Utils/HelperUtils';
import Home from '../HomeComponent/Home';
import SubmitQuestionModel from "./SubmitQuestionModel";
import ChangeQuestionStatusModel from "./ChangeQuestionStatusModel";
import WarningPopupModel from "../Utils/WarningPopUpModel"
import DataTable from "../Utils/DataTable";
import "./AddQuestions.scss";
import QuestionsContext from '../Context/QuestionsContext/QuestionsContext';
import CommonConstants from '../Utils/CommonConstants';
import QuestionsVisualization from './QuestionsVisualization';
import ToolTipUtil from "../Utils/ToolTip";


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
    const { getAllQuestions, questions, deleteQuestion,updateQuestion } = useContext(QuestionsContext);

    useEffect(() => {
        getAllQuestions(page, rowsPerPage);
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getAllQuestions(newPage, rowsPerPage);
    };
    const getDataOnPageChange =(pageSize)=>{
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
                field: '_id', title: 'Id',
                render: (params) => (<ToolTipUtil key={params.name._id} toolTipData={params._id} length={8}/>),
            },
            {
                field: 'name', title: 'Question Name',
                render: (params) => ( <ToolTipUtil key={params.name._id} toolTipData={params.name} length={50} /> ),
            },
            {   field: 'creator_name', title: 'Creator', 
                render: (params) => ( <ToolTipUtil key={params.creator_name} toolTipData={params.creator_name} length={20} /> ),
            },
            {   field: 'topic_name', title: 'Topic',
                render: (params) => ( <ToolTipUtil key={params.topic_name} toolTipData={params.topic_name} length={10} /> ),
            },
            {
                field: "optionA", title: "optionA",
                render: (params) => ( <ToolTipUtil key={params.name._id} toolTipData={params.optionA} length={17} />),
            },
            {
                field: "optionB", title: "optionB",
                render: (params) => (<ToolTipUtil key={params.name._id} toolTipData={params.optionB} length={17} />),
            },
            {
                field: "optionC", title: "optionC", 
                render: (params) => (<ToolTipUtil key={params.name._id} toolTipData={params.optionC} length={17}/>),
            },
            {
                field: "optionD", title: "optionD",
                render: (params) => ( <ToolTipUtil key={params.name._id} toolTipData={params.optionD} length={17} />),
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
