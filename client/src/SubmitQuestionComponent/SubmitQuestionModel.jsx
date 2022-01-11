import React, { useContext, useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import QuestionsContext from '../Context/QuestionsContext/QuestionsContext';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TopicApiCall from "../ApiCalls/TopicApiCall";


function SubmitQuestionModel(props) {
    const [topics, setTopics] = useState([]);
    const { saveQuestion, updateQuestion } = useContext(QuestionsContext);
    const [data, setData] = useState({ name: "", topic: '', optionA: '', optionB: '', optionC: '', optionD: '', answer: '', _id: '' });
    const [errors, setErrors] = useState({ name: "", optionA: '', optionB: '', optionC: '', optionD: '', topic: '', answer: '' });

    useEffect(() => {
        TopicApiCall.getAllTopicsWithoutpagination()
            .then(response => setTopics(response.data.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (props.editFormData !== undefined && props.editFormData !== null) {
            setData({ name: props.editFormData.name, topic: props.editFormData.topic_name, optionA: props.editFormData.optionA, optionB: props.editFormData.optionB, optionC: props.editFormData.optionC, optionD: props.editFormData.optionD, answer: props.editFormData.answer, _id: props.editFormData._id });
            clearErrors()
        } else {
            setData({ name: "", optionA: '', optionB: '', optionC: '', optionD: '', topic: '', answer: '', });
            clearErrors()
        }
    }, [props.editFormData]);

    const clearErrors = () => { setErrors({ name: "", optionA: '', optionB: '', optionC: '', optionD: '', topic: '', answer: '' }); }
   
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        validate(e.target.name, e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (data._id !== '' && data._id !== undefined) {
                updateQuestion(data);
            } else {
                saveQuestion(data);
            }
            //Resetting form state once saved or updated
            setData({ name: "", optionA: '', optionB: '', optionC: '', optionD: '', topic: '', answer: '', _id: '' });
            clearErrors();
            props.onClose();
        } else {
            console.log('error');
        }
    }
    const validate = (name, value) => {
        switch (name) {
            case 'name':
                if (value === "") {
                    setErrors({ ...errors, name: 'Question is required' });
                } else {
                    if (value.length < 10) {
                        setErrors({ ...errors, name: 'Question should be atleast 10 characters' });
                    } else if (value.length > 300) {
                        setErrors({ ...errors, name: 'Question should be less than 300 characters' });
                    } else {
                        setErrors({ ...errors, name: "" });
                    }
                }
                break;
            case 'optionA':
                if (value === '') {
                    setErrors({ ...errors, optionA: 'Option A is required' });
                } else {
                    if (value.length > 150) {
                        setErrors({ ...errors, optionA: 'Option A should be less than 150 characters' });
                    } else {
                        setErrors({ ...errors, optionA: '' });
                    }
                }
                break;
            case 'optionB':
                if (value === '') {
                    setErrors({ ...errors, optionB: 'Option B is required' });
                } else {
                    if (value.length > 150) {
                        setErrors({ ...errors, optionB: 'Option B should be less than 150 characters' });
                    } else {
                        setErrors({ ...errors, optionB: '' });
                    }
                }
                break;
            case 'optionC':
                if (value === '') {
                    setErrors({ ...errors, optionC: 'Option C is required' });
                } else {
                    if (value.length > 150) {
                        setErrors({ ...errors, optionC: 'Option C should be less than 150 characters' });
                    } else {
                        setErrors({ ...errors, optionC: '' });
                    }
                }
                break;
            case 'optionD':
                if (value === '') {
                    setErrors({ ...errors, optionD: 'Option D is required' });
                } else {
                    if (value.length > 150) {
                        setErrors({ ...errors, optionD: 'Option D should be less than 150 characters' });
                    } else {
                        setErrors({ ...errors, optionD: '' });
                    }
                }
                break;
            case 'answer':
                if (value === '') {
                    setErrors({ ...errors, answer: 'Answer is required' });
                } else {
                    if (value.length > 1) {
                        setErrors({ ...errors, answer: 'Answer should be Only one Character.' });
                    } else if (value.toUpperCase() === "A" || value.toUpperCase() === "B" || value.toUpperCase() === "C" || value.toUpperCase() === "D") {
                        setErrors({ ...errors, answer: '' });
                    } else {
                        setErrors({ ...errors, answer: 'Answer should be one of (A or B or C or D)' });
                    }
                }
                break;
            case 'topic':
                if (value === "") {
                    setErrors({ ...errors, topic: 'Topic is required' });
                } else {
                    setErrors({ ...errors, topic: '' });
                }
                break;
            default:
                break;
        }
    }
    const validateForm = () => {
        let isValid = true;
        let errors = { name: "", optionA: "", optionB: "", optionC: "", optionD: "", topic: "", answer: "", }
        if (data.name === "") {
            errors["name"] = "Question Name is reuired."
            isValid = false;
        }
        if (data.topic === "") {
            errors["topic"] = "Please select topic."
            isValid = false;
        }
        if (data.optionA === "") {
            errors["optionA"] = "optionA is reuired."
            isValid = false;
        }
        if (data.optionB === "") {
            errors["optionB"] = "optionB is reuired."
            isValid = false;
        }
        if (data.optionC === "") {
            errors["optionC"] = "optionC is reuired."
            isValid = false;
        }
        if (data.optionD === "") {
            errors["optionD"] = "optionD is reuired."
            isValid = false;
        }
        if (data.answer === "") {
            errors["answer"] = "answer is reuired."
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    }
    const getTopic = () => {
        if (data.topic !== '' && data.topic !== undefined){
            let t=topics.filter(topic => {
                if (topic._id === data.topic || topic.topicName === data.topic) {
                    return topic.topicName;
                }
                return null;
            })
            return (<option value={data.topic} >{t[0] && t[0].topicName}</option>)
        }
        else
            return (<option  value="" ></option>)
    }
    return (
        <div className="Question-Model" >
            <Dialog className="MuiDialog-paper-AddQuestionModel"
                open={props.open}
                onClose={props.onClose}
            >
                <MuiDialogTitle>
                    <Typography variant="h6">
                        {props.editFormData !== undefined && props.editFormData !== null ?"Update Question":"Add Question"}
                    </Typography>
                </MuiDialogTitle>
                <DialogContent  >
                    <TextField className="MuiTextField-root-login-submitquestion"
                        variant="outlined"
                        multiline rows={3}
                        type="text"
                        aria-label="Question Name"
                        placeholder="Enter Question Name here"
                        name="name"
                        onChange={handleChange}
                        error={errors.name !== "" ? true : false}
                        helperText={errors.name}
                        value={data.name}
                    />
                    <FormControl variant="outlined" >
                        <InputLabel htmlFor="outlined-age-native-simple">Topic</InputLabel>
                        <Select
                            native
                            label="topic"
                            name="topic"
                            onChange={handleChange}
                            error={errors.topic !== "" ? true : false}
                            helperText={errors.topic}
                            value={data.topic}
                        >
                            {getTopic()}
                            {topics.map(t => (<option value={t._id}>{t.topicName}</option>))}
                        </Select>
                    </FormControl>
                    <TextField className="MuiTextField-root"
                        variant="outlined"
                        label="Option A"
                        name="optionA"
                        onChange={handleChange}
                        error={errors.optionA !== "" ? true : false}
                        helperText={errors.optionA}
                        value={data.optionA}
                    />
                    <TextField className="MuiTextField-root"
                        variant="outlined"
                        label="Option B"
                        name="optionB"
                        onChange={handleChange}
                        error={errors.optionB !== "" ? true : false}
                        helperText={errors.optionB}
                        value={data.optionB}

                    />
                    <TextField className="MuiTextField-root"
                        variant="outlined"
                        label="Option C"
                        name="optionC"
                        onChange={handleChange}
                        error={errors.optionC !== "" ? true : false}
                        helperText={errors.optionC}
                        value={data.optionC}

                    />
                    <TextField className="MuiTextField-root"
                        variant="outlined"
                        label="Option D"
                        name="optionD"
                        onChange={handleChange}
                        error={errors.optionD !== "" ? true : false}
                        helperText={errors.optionD}
                        value={data.optionD}

                    />
                    <TextField className="MuiTextField-root"
                        variant="outlined"
                        label="Answer"
                        name="answer"
                        onChange={handleChange}
                        error={errors.answer !== "" ? true : false}
                        helperText={errors.answer}
                        value={data.answer}
                    />
                </DialogContent>
                <MuiDialogActions>
                    <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
                    <Button onClick={() => props.onClose()} variant="contained" color="primary">Cancel</Button>
                </MuiDialogActions>
            </Dialog>
        </div>
    )
}

export default SubmitQuestionModel
