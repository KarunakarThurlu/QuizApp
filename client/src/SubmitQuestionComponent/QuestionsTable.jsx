import React, { useContext, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import CircularProgress from '@mui/material/CircularProgress';
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
import Spinner from '../Utils/Spinner';
import ToolTipUtil from "../Utils/ToolTip";
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField';
import TopicsContext from '../Context/TopicContext/TopicContext';
import UsersApiCalls from '../ApiCalls/UsersApiCall';


function SubmitQuestion(props) {

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [formDataToEdit, setFormDataToEdit] = useState({});
    const [filters, setFilters] = useState({ creator: [], topicName: [], status: [] });        //For Label Display
    const [filtersData, setFiltersData] = useState({ creator: '', topicName: '', status: '' });//For Filter Data
    const [asynchronusLabelOpen, setAsynchronusLabelOpen] = useState(false);
    const [userLabelOptions, setUserLabelOptions] = useState([]);
   
    const [statusModelOpen, setStatusModelOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState();
    const [showWarningPopup, setShowWarningPopup] = useState(false);
    const [questionIdForDelete, setQuestionIdForDelete] = useState(0);
    const [showVisualization, setShowVisualization] = useState(false);
    const { getAllQuestions, questions, deleteQuestion, updateQuestion } = useContext(QuestionsContext);
    const { getTopicNames, Topics } = useContext(TopicsContext);
    const [usersOptions,setUsersOptions]=useState([]);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        getAllQuestions(page, rowsPerPage, filtersData);
        getTopicNames();
    }, [filtersData]);
    const topics = Topics.topicNames
    let tns = []
    if (topics !== undefined && topics.length > 0) {
        const t = JSON.parse(topics)
        t.map(t => tns.push({ topicName: t.topicName, id: t._id }))
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getAllQuestions(newPage, rowsPerPage, filtersData);
    };
    const getDataOnPageChange = (pageSize) => {
        setPage(1);
        getAllQuestions(1, pageSize, filtersData);
    }
    const handleDeleteQuestion = () => {
        deleteQuestion(questionIdForDelete);
        setShowWarningPopup(false);
    }
    const columns =
        [
            {
                field: '_id', title: 'Id', filtering: false,
                render: (params) => (<ToolTipUtil key={params.name._id} toolTipData={params._id} length={8} />),
            },
            {
                field: 'name', title: 'Question Name', filtering: false, width: 200,
                render: (params) => (<ToolTipUtil key={params.name._id} toolTipData={params.name} length={25} />),
            },
            {
                field: 'creator_name', title: 'Creator', filtering: true,
                filterComponent: () => (<Autocomplete
                    multiple
                    size='small'
                    
                    id="creator"
                    style={{ width: '15em' }}
                    filterOptions={(x) => x}
                    options={filters.creator}
                    loading={loading}
                    includeInputInList
                    open={asynchronusLabelOpen}
                    //onOpen={()=>setAsynchronusLabelOpen(true)}
                    onClose={()=>setAsynchronusLabelOpen(false)}
                    onChange={(event)=>{
                        const creatorName = event.target.textContent;
                        setUsersOptions(creatorName!==""?[{creator:creatorName}]:[]);
                        const creatorId = userLabelOptions.filter(e=>e.email===creatorName);
                        const filteredObject = { ...filtersData, creator: creatorName !== "" ? creatorId[0]._id : '' }
                        setFiltersData(filteredObject);
                    }}
                    value={usersOptions}
                    getOptionLabel={(option) => option.creator}
                    onInputChange={(event) => {
                        const creator = event.target.value;
                        if (creator !== null && creator !== '' && creator!==undefined && creator.length > 2 && creator !== undefined) {
                            setLoading(true);
                            UsersApiCalls.getUsersBySearchKey(creator)
                                .then(res => {
                                    setLoading(false);
                                    setUserLabelOptions(res.data.data);
                                    const array=[];
                                    const usersd= res.data.data;
                                    usersd.map(u=>array.push({creator:u.email}))
                                    const obj = { ...filters, creator: array }
                                    setFilters(obj);
                                    setAsynchronusLabelOpen(true)
                                })
                                .catch(err => {
                                    console.log(err);
                                    setLoading(false);
                                }).finally(()=>{
                                    setLoading(false)
                                });
                        }
                    }}
                    renderInput={(params) => (
                        <TextField {...params} 
                          style={{width:'16em'}}
                          InputProps={{...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                />),
                render: (params) => (<ToolTipUtil key={params.creator_name} toolTipData={params.creator_name} length={20} />),
            },
            {
                field: 'topic_name', title: 'Topic', filtering: true,
                filterComponent: () => (<Autocomplete
                    style={{ width: '15em' }}
                    multiple
                    size='small'
                    id="topic"
                    options={tns}
                    getOptionLabel={(option) => option.topicName}
                    onChange={(event) => {
                        const topicName = event.target.textContent;
                        const topicId = tns.filter(t => t.topicName === topicName)
                        const obj = { ...filters, topicName: topicName !== "" ? [{ topicName: topicName }] : [] }
                        const filteredObject = { ...filtersData, topicName: topicName !== "" ? topicId[0].id : '' }
                        setFilters(obj);
                        setFiltersData(filteredObject);
                    }}
                    value={filters.topicName}
                    renderInput={(inputparams) => (<TextField {...inputparams} variant="standard" style={{ width: '16em' }} />)}
                />),
                render: (params) => (<ToolTipUtil key={params.topic_name} toolTipData={params.topic_name} length={15} />),
            },
            {
                field: 'status', title: 'Status', align: 'center', filtering: true,
                filterComponent: () => (<Autocomplete
                    style={{ width: '15em' }}
                    multiple
                    size='small'
                    id="status"
                    options={[{ status: 'APPROVED' }, { status: 'PENDING' }, { status: 'REJECTED' }]}
                    getOptionLabel={(option) => option.status}
                    onChange={(event) => {
                        const sts = event.target.textContent;
                        const obj = { ...filters, status: sts !== "" ? [{ status: sts }] : [] }
                        const filteredObject = { ...filtersData, status: sts }
                        setFilters(obj);
                        setFiltersData(filteredObject);
                    }}
                    value={filters.status}
                    renderInput={(inputparams) => (<TextField {...inputparams} variant="standard" />)}
                />),
                render: (params) => (<Button variant="contained" style={{ color: params.status === "APPROVED" ? '#388e3c' : params.status === "PENDING" ? "#f57c00" : "#d32f2f", width: "15em" }} onClick={() => { setStatusModelOpen(true); setCurrentQuestion(params) }}>{params.status} </Button>)
            },
            {
                field: "optionA", title: "optionA", filtering: false,
                render: (params) => (<ToolTipUtil key={params.name._id} toolTipData={params.optionA} length={17} />),
            },
            {
                field: "optionB", title: "optionB", filtering: false,
                render: (params) => (<ToolTipUtil key={params.name._id} toolTipData={params.optionB} length={17} />),
            },
            {
                field: "optionC", title: "optionC", filtering: false,
                render: (params) => (<ToolTipUtil key={params.name._id} toolTipData={params.optionC} length={17} />),
            },
            {
                field: "optionD", title: "optionD", filtering: false,
                cellStyle: { height: '60px', width: '100px' },
                render: (params) => (<ToolTipUtil key={params.name._id} toolTipData={params.optionD} length={17} />),
            },
            {
                field: 'updatedOn', title: 'Update Date', cellStyle: { whiteSpace: 'nowrap' }, filtering: false,
            },
            { field: 'createdOn', title: 'Created Date', filtering: false, },
        ];
    const rows = questions.questions;
    const totalCount = questions.totalCount;
    const users = [];
    if (rows !== undefined && rows.length !== 0) {
        rows.forEach((q, i) => {
            q.creator_name = q.creator.email;
            q.topic_name = q.topic.topicName;
            q.createdOn = HelperUtils.formateDate(q.createdOn);
            q.updatedOn = HelperUtils.formateDate(q.updatedOn);
            users.push({ creator: q.creator.email });
        });
        //Remove duplicate objects from users
        users.sort();
        for (var i = 0; i < users.length - 1; i++) {
            if (users[i].creator === users[i + 1].creator) {
                users.splice(i, 1);
                i--;
            }
        }
    }
    const updateQuestioninList = (data) => {
        updateQuestion(data);
        setStatusModelOpen(false)
    }
    const TableData = { columns, rows, page, rowsPerPage, totalCount, toolTip: "Add Question", showGroupByHeader: false, filtering: true, title: "Questions Data", showActions: true }
    return (
        <div className="questions-container">
            <Home />
            {loading && <Spinner open={loading}/>}
            {showVisualization && <QuestionsVisualization open={showVisualization} onClose={() => setShowVisualization(false)} />}
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
