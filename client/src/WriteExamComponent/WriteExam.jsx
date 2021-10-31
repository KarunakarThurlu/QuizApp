import React, {  useEffect, useState } from 'react'
import Home from '../HomeComponent/Home'
import SkipNextRoundedIcon from '@material-ui/icons/SkipNextRounded';
import SkipPreviousRoundedIcon from '@material-ui/icons/SkipPreviousRounded';
import Grid from '@material-ui/core/Grid';
import Spinner from "../Utils/Spinner";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import WarningPopUpModel from "../Utils/WarningPopUpModel"
import TopicApiCall from "../ApiCalls/TopicApiCall";
import QuestionsApiCall from '../ApiCalls/QuestionsApiCall';
import {Prompt} from 'react-router-dom';
import "./writeexam.scss";
import { Typography } from '@material-ui/core';
import CommonConstants from '../Utils/CommonConstants';
import ExamResults from './ExamResults';
import MenuItem from '@mui/material/MenuItem';

function WriteExam(props) {
    const [value, setValue] = useState('');
    const [topics, setTopics] = useState([]);
    const [startExam, setStartExam] = useState(false);
    const [topicName, setTopicName] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('')
    const [questions, setQuestions] = useState([]);
    const [questionInfo, setQuestionInfo] = useState({});
    let [seconds, setSeconds] = useState(0);
    let [minutes, setMinutes] = useState(20);
    const [openSubmitWarningModel, setOpenSubmitWarningModel] = useState(false);
    const [warningMessage, setWarningMessage] = useState(CommonConstants.Submit_Exam_Warning);
    const [openExamResultsModel, setOpenExamResultsModel] = useState(false);
    const [testScore, setTestScore] = useState(0);
    const [rangedata, setRangeData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedRange, setSelectedRange] = useState('');
    const [errors, setErrors] = useState({ topic: '', questionsrange: '' });

    useEffect(() => {
        TopicApiCall.getAllTopicsWithoutpagination()
            .then(response => setTopics(response.data.data))
            .catch(error => console.log(error));
    }, []);

    const getSelectedTopicQuestionsCount = (id) => {
        setLoader(true);
        QuestionsApiCall.getSelectedTopicQuestionsCount(id)
            .then(response => {
                if (response.data.statusCode === 200) {
                    getRangeList(response.data.data);
                    setLoader(false);
                }else{
                    setRangeData([]);
                }
            })
            .catch(error => console.log(error))
            .finally(() => setLoader(false));
    }

    const handleTopicSelect = (event) => {
        const topicId= event.target.name!==undefined?event.target.value:event.target.getAttribute("data-value")
        getSelectedTopicQuestionsCount(topicId);
        setTopicName(topicId);
        if (topicId !== '') {
            setErrors({ ...errors, topic: '' });
        }
    }

    let handleStartExam = () => {
        if (validateForm()) {
            const range = selectedRange.split('-');
            const start = parseInt(range[0]);
            QuestionsApiCall.getQuestionsForExams(topicName, start-1, 20)
                .then(response => {
                    let array = [];
                    if (response.data.statusCode === 200) {
                        response.data.data.map((e, i) => {
                            e["answer"] = '';
                            e["id"] = i + 1;
                            array.push(e);
                            return null;
                        });
                        setQuestions(array);
                        setQuestionInfo(array[0]);
                        setCurrentQuestion(1);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            setStartExam(true);
            const down = () => {
                if (seconds === 0) {
                    seconds = 59;
                    setSeconds(seconds);
                    minutes = minutes - 1
                    setMinutes(minutes)
                } else {
                    seconds = seconds - 1
                    setSeconds(seconds);
                }
                if (minutes <= 0 && seconds === 0) {
                    clearInterval(fooo);
                }
            }
            let fooo = setInterval(down, 1000);
        }
    }

    const validateForm = () => {
        let isValid = true;
        let errorsobj = {topic:'',questionsrange:''};
        if (topicName === '') {
            errorsobj["topic"] = "Please Select Topic";
            isValid = false;
        }
        if (selectedRange === '') {
            errorsobj["questionsrange"] = "Please Select Questions Range";
            isValid = false;
        }
        setErrors(errorsobj);
        return isValid;
    }
    const saveAnswer = (e) => {
        const updateAnswer = questions.find(Q => Q.id === questionInfo.id)
        if (updateAnswer) {
            updateAnswer.answer = e.target.value;
        }
    }
    const handleNextButtons = (value) => {
        if (value === "PreviousQuestion") {
            const back = currentQuestion === 1 ? 1 : currentQuestion - 1;
            setCurrentQuestion(back);
            const updateAnswer = questions.find(Q => Q.id === back);
            setQuestionInfo(updateAnswer);
        }
        if (value === "NextQuestion") {
            const forward = currentQuestion === questions.length ? questions.length : currentQuestion + 1;
            setCurrentQuestion(forward);
            const updateAnswer = questions.find(Q => Q.id === forward);
            setQuestionInfo(updateAnswer);
        }
    }

    const showWarning = (e) => {
        e.preventDefault();
        setWarningMessage(CommonConstants.Submit_Exam_Warning);
        setOpenSubmitWarningModel(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const range = selectedRange.split('-');
        const pageNumber = parseInt(range[0]);
        setLoader(true);
        QuestionsApiCall.getTestResults(questions, pageNumber-1, topicName)
            .then(response => {
                setLoader(false);
                if (response.data.statusCode === 200) {
                    setTestScore(response.data.testScore);
                    setOpenExamResultsModel(true);
                    setStartExam(false);
                    setTopicName('');
                    setQuestions([]);
                    setOpenSubmitWarningModel(false)
                }
            })
            .catch(error => {
                console.log(error);
                setLoader(false);
            })
            .final(() => setLoader(false));
    }
    const getRangeList = (size) => {
        let array = [];
        if (size <= 20) {
            array.push(1 + " - " + size);
        } else {
            let reminder = size % 20;
            let count = size / 20;
            let start = 1;
            let end = 20;
            for (let i = 1; i <= count; i++) {
                array.push(start + "-" + end);
                start = end + 1;
                end = end + 20;
            }
            if (reminder !== 0) {
                array.push(start + "-" + size);
            }
        }
        setRangeData(array);
        return array;
    }

    const warnOnLeavingExampage=()=>{
        if(questions.length>0){
            setOpenSubmitWarningModel(true);
            setWarningMessage(CommonConstants.Exam_Exit_warning);
            return false;
        }
    }
    return (
        <div className="write-exam-container">
            <Home />
            <Prompt when={true} message={warnOnLeavingExampage}  />
            <WarningPopUpModel open={openSubmitWarningModel} message={warningMessage} onClickYes={handleSubmit} handleClose={() => setOpenSubmitWarningModel(false)} />
            <ExamResults open={openExamResultsModel} handleClose={() => setOpenExamResultsModel(false)} testScore={testScore} />
            {loader && <Spinner open={loader} />}
            {startExam === true ? <Grid container className="writeexam" spacing={0}>
                <Grid item xs={8} >
                    <FormControl className="Question-name-form-controll">
                        <FormLabel >{questionInfo.id}.{questionInfo.name}</FormLabel>
                        <RadioGroup value={value} onChange={event => setValue(event.target.value)}>
                            <FormControlLabel value="A" onClick={e => saveAnswer(e)} control={<Radio checked={questionInfo.answer === "A" ? true : false} />} label={questionInfo.optionA} />
                            <FormControlLabel value="B" onClick={e => saveAnswer(e)} control={<Radio checked={questionInfo.answer === "B" ? true : false} />} label={questionInfo.optionB} />
                            <FormControlLabel value="C" onClick={e => saveAnswer(e)} control={<Radio checked={questionInfo.answer === "C" ? true : false} />} label={questionInfo.optionC} />
                            <FormControlLabel value="D" onClick={e => saveAnswer(e)} control={<Radio checked={questionInfo.answer === "D" ? true : false} />} label={questionInfo.optionD} />
                        </RadioGroup>
                    </FormControl>
                    <div className="next-buttons">
                            <Button variant="contained" color="primary" onClick={e => handleNextButtons("PreviousQuestion")}><SkipPreviousRoundedIcon style={{ color: "white" }} /></Button><Button variant="contained" color="primary" onClick={(e) => handleNextButtons("NextQuestion")}><SkipNextRoundedIcon style={{ color: "white" }} /></Button>
                    </div>
                </Grid>
                <Grid item xs={3}  >
                    Timer   {minutes} : {seconds}
                    <Grid className="questions-list" container justify="center" spacing={1}>
                        {questions.map((value, i) => (
                            <Grid variant="contained" key={value.id} item style={{ backgroundColor: value.answer !== "" ? "green" : "yellow" }} onClick={(e) => { setCurrentQuestion(value.id); setQuestionInfo(value); }} >
                                {value.id}
                            </Grid>
                        ))}
                        <div className="submit-button">
                            <Button variant="contained" onClick={showWarning}>Submit</Button>
                        </div>
                    </Grid>
                </Grid>

            </Grid>
                :
                <Grid container spacing={0} className="start-exam">
                    <Grid item xs={8} >
                        <Typography color='primary' variant='h6' component='h6' align='center' >
                            Exam Contains 20 Questions and Time also 20 minutes. Each
                            Question has exactly one minute. Before starting the exam you need to select Topic & Questions Range
                            then you can click on start.
                        </Typography>
                        <br /><br />
                        <div className="start-exam-form-control">
                        <FormControl variant="outlined" >
                            <InputLabel >Topic</InputLabel>
                            <Select
                                //native
                                label="Topic"
                                name="Topic"
                                onClick={handleTopicSelect}
                                error={errors.topic !== ""}
                                helperText={errors.topic}
                            >
                                <MenuItem aria-label="None" value="" />
                                {topics.map(t => (<MenuItem value={t._id}>{t.topicName}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <br /><br />
                        <FormControl variant="outlined" className="start-exam-form-control">
                            <InputLabel >Questions Range</InputLabel>
                            <Select
                               // native
                                label="Questions Range"
                                name="questionsrange"
                                onClick={(e) => {
                                    setSelectedRange(e.target.value);
                                    if (e.target.value !== '') {
                                        setErrors({ ...errors, questionsrange: '' });
                                    }
                                }}
                                error={errors.questionsrange !== ""}
                                helperText={errors.questionsrange}
                            >
                                <MenuItem aria-label="None" value="" />
                                {rangedata.map((v, i) => (<MenuItem key={i} value={v}>{v}</MenuItem>))}
                            </Select>
                        </FormControl>
                        
                        <br /><br /> <br />
                        <Button variant="contained" color='primary' onClick={handleStartExam}>Start</Button>
                        </div>
                    </Grid>
                </Grid>

            }
        </div >
    );
}

export default WriteExam
