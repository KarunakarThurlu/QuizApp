import React, { useContext, useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Home from "../HomeComponent/Home";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText'
import QuestionsContext from '../Context/QuestionsContext/QuestionsContext';
import TopicApiCall from "../ApiCalls/TopicApiCall";

const AddQuestion = () => {

    const [topics, setTopics] = useState([]);
    const { saveQuestion } = useContext(QuestionsContext);
    useEffect(() => {
        TopicApiCall.getAllTopicsWithoutpagination()
            .then(response => setTopics(response.data.data))
            .catch(error => console.log(error));
    }, []);
    const [data, setData] = useState({
        name: "",
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        topic: '',
        answer: '',
    });

    const [errors, setErrors] = useState({
        name: "",
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        topic: '',
        answer: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            saveQuestion(data);
            setData({
                name: "",
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                topic: '',
                answer: '',
            });
        } else {
            console.log(data);
            console.log('error');
        }
    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        validate(e.target.name, e.target.value);
    }


    const validate = (name, value) => {
        switch (name) {
            case 'name':
                if (value === "") {
                    setErrors({ ...errors, name: 'Question is required' });
                } else {
                    if (value.length < 10) {
                        setErrors({ ...errors, name: 'Question should be atleast 10 characters' });
                    } else if (value.length > 150) {
                        setErrors({ ...errors, name: 'Question should be less than 100 characters' });
                    } else {
                        setErrors({ ...errors, name: "" });
                    }
                }
                break;
            case 'optionA':
                if (value === '') {
                    setErrors({ ...errors, optionA: 'Option A is required' });
                } else {
                    if (value.length > 40) {
                        setErrors({ ...errors, optionA: 'Option A should be less than 40 characters' });
                    } else {
                        setErrors({ ...errors, optionA: '' });
                    }
                }
                break;
            case 'optionB':
                if (value === '') {
                    setErrors({ ...errors, optionB: 'Option B is required' });
                } else {
                    if (value.length > 40) {
                        setErrors({ ...errors, optionB: 'Option B should be less than 40 characters' });
                    } else {
                        setErrors({ ...errors, optionB: '' });
                    }
                }
                break;
            case 'optionC':
                if (value === '') {
                    setErrors({ ...errors, optionC: 'Option C is required' });
                } else {
                    if (value.length > 40) {
                        setErrors({ ...errors, optionC: 'Option C should be less than 40 characters' });
                    } else {
                        setErrors({ ...errors, optionC: '' });
                    }
                }
                break;
            case 'optionD':
                if (value === '') {
                    setErrors({ ...errors, optionD: 'Option D is required' });
                } else {
                    if (value.length > 40) {
                        setErrors({ ...errors, optionD: 'Option D should be less than 40 characters' });
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
        let errors = {
            name: "",
            optionA: "",
            optionB: "",
            optionC: "",
            optionD: "",
            topic: "",
            answer: "",
        }
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

    return (
        <div className="addquestion">
            <Home />
            <div className="addQuestionForm">
                <h2>Add Question</h2>
                <TextField
                    error={errors.name !== "" ? true : false}
                    helperText={errors.name}
                    multiline={true}
                    rows={5}
                    className="questionName"
                    id="outlined-basic"
                    variant="outlined"
                    label="Question Name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                />
                <FormControl variant="outlined" className='topic' helperText={errors.topic} error={errors.topic !== "" ? true : false}>
                    <InputLabel htmlFor="outlined-age-native-simple" >Topic</InputLabel>
                    <Select
                        native
                        value={data.topic}
                        helperText={errors.topic}
                        onChange={handleChange}
                        label="Topic"
                        name='topic'
                    >
                        <option aria-label="None" value="" />
                        {topics.map(t => (<option value={t._id}>{t.topicName}</option>))}
                    </Select>
                    <FormHelperText>
                        {errors.topic}
                    </FormHelperText>
                </FormControl>
                <TextField
                    error={errors.optionA !== "" ? true : false}
                    value={data.optionA}
                    helperText={errors.optionA}
                    className="options"
                    id="outlined-basica"
                    variant="outlined"
                    label="OptionA"
                    type="text"
                    name="optionA"
                    onChange={handleChange}
                />

                <TextField
                    error={errors.optionB !== "" ? true : false}
                    helperText={errors.optionB}
                    value={data.optionB}
                    className="options"
                    id="outlined-basicb"
                    variant="outlined"
                    label="OptionB"
                    type="text"
                    name="optionB"
                    onChange={handleChange}
                />

                <TextField
                    error={errors.optionC !== "" ? true : false}
                    helperText={errors.optionC}
                    value={data.optionC}
                    className="options"
                    id="outlined-basicc"
                    variant="outlined"
                    label="OptionC"
                    type="text"
                    name="optionC"
                    onChange={handleChange}
                />

                <TextField
                    error={errors.optionD !== "" ? true : false}
                    helperText={errors.optionD}
                    value={data.optionD}
                    className="options"
                    id="outlined-basicd"
                    variant="outlined"
                    label="OptionD"
                    type="text"
                    name="optionD"
                    onChange={handleChange}
                />

                <TextField
                    error={errors.answer !== "" ? true : false}
                    helperText={errors.answer}
                    value={data.answer}
                    id="outlined-basic"
                    variant="outlined"
                    label="Answer"
                    type="text"
                    name="answer"
                    onChange={handleChange}
                />

                <div className="submit">
                    <Button type="submit" onClick={handleSubmit} className="MuiButton-containedPrimary" variant="contained" color="primary">Submit</Button>
                </div>

            </div>
        </div>
    );
}

export default AddQuestion