import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import TopicContext from '../Context/TopicContext/TopicContext';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function TopicModel(props) {

    const [data, setData] = useState({ topicName: "", description: "", _id: "" });
    const [errors, setErrors] = useState({ topicName: "", description: "" });
    const { saveTopic, updateTopic } = useContext(TopicContext);

    const clearErros = () => {
        setErrors({ topicName: "", description: "" });
    }

    useEffect(() => {
        //Edit Topic data Model
        if (props.data!==null && props.data.topicName !== undefined && props.data.description !== undefined) {
            setData({ topicName: props.data.topicName, description: props.data.description, _id: props.data._id });
            clearErros();
        } else {
        //Add Topic data Model
            setData({ topicName: "", description: "", _id: "" });
            clearErros();
        }
    }, [props.data]);
    const handleSubmit = () => {
        if (validate()) {
            if (props.data!==null && props.data._id !== undefined && props.data._id !== "") {
                updateTopic(data);
                props.onClose();
            } else {
                saveTopic(data);
                props.onClose();
            }
            setData({ topicName: "", description: "", _id: "" });
            clearErros();
        }
    }
    const validate = () => {
        let isValid = true;
        let errorsObj = {};
        if (data.topicName === "") {
            isValid = false;
            errorsObj["topicName"] = "Topic Name is required";
        }
        if (data.description === "") {
            isValid = false;
            errorsObj["description"] = "Topic Name is required";
        }
        setErrors(errorsObj);
        return isValid;

    }
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }



    return (
        <div className="AddTopicContainer">
            <Dialog
                open={props.open}
                onClose={props.onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="MuiDialog-paper-AddTopicModel"
            >
                <DialogTitle id="alert-dialog-title">Add Topic </DialogTitle>
                <DialogContent>
                    <TextField
                        error={errors.topicName !== "" ? true : false}
                        helperText={errors.topicName}
                        className="TopicName"
                        id="outlined-basic"
                        variant="outlined"
                        label="TopicName"
                        type="text"
                        name="topicName"
                        value={data.topicName}
                        onChange={handleChange}
                    /><br /><br />
                    <TextField
                        error={errors.description !== "" ? true : false}
                        helperText={errors.description}
                        className="Description"
                        id="outlined-basic"
                        variant="outlined"
                        label="DescriptionName"
                        type="text"
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Submit
                    </Button>
                    <Button onClick={props.onClose} color="primary" autoFocus variant="contained">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
