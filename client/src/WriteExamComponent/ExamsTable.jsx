import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import ExamsApiCall from '../ApiCalls/ExamsApiCall';
import HelperUtils from "../Utils/HelperUtils";
import Home from '../HomeComponent/Home';
import DeletePopUpModel from '../Utils/WarningPopUpModel';
import ReviewExam from "./ReviewExam";
import CommonConstants from '../Utils/CommonConstants';
import Notifier from '../Utils/Notifier';
import DataTable from '../Utils/DataTable';
import ViewProfilePic from '../ManageUsers/ViewProfilePic';
import Spinner from '../Utils/Spinner';
import ToolTip from "../Utils/ToolTip"

import './writeexam.scss';

const ExamsTable = () => {

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [exams, setExams] = useState([]);
    const [testScore, setTestScore] = useState(0);
    const [testQuestions, setTestQuestions] = useState({});
    const [showReviewExam, setShowReviewExam] = useState(false);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [examId, setExamId] = useState(0);
    const [openProfilePic, setOpenProfilePic] = useState(false);
    const [currentRowData, setCurrentRowData] = useState({});
    const [spinner, setSpinner] = useState(false);


    const handleConformDelete = () => {
        setSpinner(true);
        ExamsApiCall.deleteExam(examId)
            .then(res => {
                setSpinner(false);
                if (res.data.statusCode === 200) {
                    setOpenDeleteModel(false);
                    setExams(exams.filter(exam => exam._id !== examId));
                    Notifier.notify(res.data.message, Notifier.notificationType.SUCCESS);
                }
            })
            .catch(err => {
                setSpinner(false);
                console.log(err);
            }).finally(() => {
                setSpinner(false);
            });
    }

    useEffect(() => {
        getExamsPerPage(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const getExamsPerPage = (pageNumber, pageSize) => {
        setSpinner(true);
        ExamsApiCall.getAllExamsDetails(pageNumber, pageSize)
            .then(res => {
                setSpinner(false);
                if (res.data.statusCode === 200) {
                    setExams(res.data.data.data);
                    setTotalCount(parseInt(res.data.data.totalCount));
                }
            })
            .catch(err => {
                setSpinner(false);
                console.log(err);
            }).finally(() => {
                setSpinner(false);
            });
    }

    const handleExamReviewClick = (row) => {
        //get Exam byId from JSON Array
        let exam = exams.find(exm => exm._id === row._id);
        let TestQuestions = exam.TestQuestions;
        let TestAnswers = exam.TestAnswers;
        if ((TestQuestions !== undefined && TestAnswers !== undefined) && TestQuestions.length === TestAnswers.length) {
            let AnsMap = new Map();
            TestAnswers.forEach(ans => { AnsMap.set(Object.keys(ans)[0], Object.values(ans)[0]); });
            TestQuestions.forEach(que => { que['YourAnswer'] = AnsMap.get(que._id); });
        }
        setTestQuestions(TestQuestions);
        setShowReviewExam(true);
        setExamId(row._id)
        setTestScore(row.TestScore);
    }

    const constructImage = (row) => {
        if(row.profilePicture){
            return `data:${row.profilePicture.contentType};base64,${ new Buffer.from(row.profilePicture.data).toString('base64')}`;
        }else{
            return "/user.png";
        }
    }
    const columns =
        [
            { field: '_id', title: 'Id',render: (params) => (<ToolTip key={params._id}  toolTipData={params._id} length={8} />),},
            {
                title: 'profilePicture', field: 'imageUrl',
                render: rowData => <img src={constructImage(rowData)} alt="User Profile" onClick={() => { setCurrentRowData(rowData); setOpenProfilePic(true) }} style={{ width: 35, borderRadius: '50%' }} />
            },
            { field: 'firstName', title: 'FirstName', },
            { field: 'lastName', title: 'LastName', },
            { field: 'email', title: 'Email', },
            { field: 'TopicName', title: 'TopicName', },
            {
                field: 'Date', title: 'Date',
                render: row => HelperUtils.formatDateWithTimeStamp(row.Date)
            },
            { field: 'TestScore', title: 'TestScore', },
            {
                field: 'Review', title: 'Review',
                render: (row) => (<Button variant="contained" onClick={() => handleExamReviewClick(row)} ><FindInPageIcon color="primary" /></Button>)
            },
            {
                field: 'Delete', title: 'Delete',
                render: (row) => (<Button variant="contained" onClick={() => { setOpenDeleteModel(true); setExamId(row._id) }} ><DeleteIcon color="error" /></Button>)
            },

        ]

        exams.length >0 && exams.forEach(exam => {
        exam["firstName"] = exam && exam.UserId.firstName;
        exam["lastName"] = exam && exam.UserId.lastName;
        exam["email"] =  exam && exam.UserId.email;
        exam["profilePicture"] = exam && exam.UserId.profilePicture;
        
    });
    const rows = exams;
    const TableData = { columns, rows, page, rowsPerPage, totalCount, toolTip: "Add Question", title: "Exams Data", showActions: false }
    return (
        <div className="Exams-Table">
            <Home />
            {spinner && <Spinner open={spinner} />}
            <ViewProfilePic open={openProfilePic} onClose={() => setOpenProfilePic(false)} image={currentRowData.profilePicture} />
            <ReviewExam open={showReviewExam} onClose={() => setShowReviewExam(false)} data={testQuestions} score={testScore} />
            <DeletePopUpModel open={openDeleteModel} onClickYes={handleConformDelete} message={CommonConstants.Delete_Exam_Warning} handleClose={() => setOpenDeleteModel(false)} />
            <div className="Data-Table">
                <DataTable
                    data={TableData}
                    handleChangePage={(event, newPage) => setPage(newPage)}
                    setOpen={setShowReviewExam}
                    setIdForDelete={setExamId}
                    setShowWarningPopup={setOpenDeleteModel}
                    setRowsPerPage={setRowsPerPage}
                    setPage={setPage}
                    getDataOnPageChange={(pageSize) => { setRowsPerPage(pageSize); setPage(1) }}
                />
            </div>
        </div>
    );
}
export default ExamsTable;