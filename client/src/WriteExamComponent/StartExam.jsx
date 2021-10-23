import React, { useState, useEffect } from 'react'
import Home from '../HomeComponent/Home'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TopicApiCall from "../ApiCalls/TopicApiCall";
import Button from '@material-ui/core/Button';


import "./writeexam.scss";

function StartExam() {
    const [topics, setTopics] = useState([]);
    

    useEffect(() => {
        TopicApiCall.getAllTopics()
            .then(response => setTopics(response.data.data))
            .catch(error => console.log(error));
    }, []);

    const handleClick = () => {
       
        console.log("fooo");
    }

    return (
        <div className="start-exam-container">
            <Home />
            <Grid container spacing={1}>
                <Grid item xs={8} sm={8}>
                    <Paper className="h">
                        The Exam Contains 20 Questions and Time also 20 minutes means each
                        Question has exactly one minute. Before starting the exam you need to select topic
                        then you can click on start.
                        <br /><br /><br />
                        <FormControl variant="outlined" >
                            <InputLabel htmlFor="outlined-age-native-simple">Select Topic</InputLabel>
                            <Select
                                native
                                label="Select Topic"
                                name="Topic"
                            >
                                <option aria-label="None" value="" />
                                {topics.map(t => (<option value={t._id}>{t.topicName}</option>))}
                            </Select>
                        </FormControl>
                        <br /><br /><br />
                        <Button variant="contained" onClik={handleClick} color="primary">Start</Button>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}
export default StartExam