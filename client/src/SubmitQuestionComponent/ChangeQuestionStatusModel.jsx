import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import "./AddQuestions.scss"

function ChangeQuestionStatusModel(props) {
    useEffect(()=>{
        setData({showreason:false,reason:""});
        setErrors({reason:""});
    },[]);
   const[data,setData]= useState({showreason:false,reason:""});
   const[errors,setErrors]= useState({reason:''});
    const handleClick = (value) => {
        if(value==='REJECTED' && data.showreason===false)
            setData({...data,showreason:true})
        else if(value==='REJECTED' && data.showreason===true && data.reason==="")
            setErrors({...errors,reason:'Please enter reason'})
        else if(data.reason.length>50)
            setErrors({...errors,reason:'Reason should be less than 50 characters'})
        else
            props.updateQuestion({ _id: props.CQData._id, status: value,rejectedReason:data.reason });
    }
    return (
        <div>
            <Dialog onClose={props.onClose} open={props.open} className="MuiDialog-paper-ChangeQuestionStatusModel">
                <MuiDialogTitle>
                    <IconButton className="closeButton" onClick={props.onClose}><CloseIcon /></IconButton>
                </MuiDialogTitle>
                <MuiDialogContent>
                    <Typography color='initial' variant='h6' component='h6' align='left' >
                        {props.CQData !== undefined ? props.CQData.name : ""}
                    </Typography>
                    <Typography color='initial' variant='h6' component='h6' align='left' >
                        A.  {props.CQData !== undefined ? props.CQData.optionA : ""}<br />
                    </Typography>
                    <Typography color='initial' variant='h6' component='h6' align='left' >
                        B.  {props.CQData !== undefined ? props.CQData.optionB : ""}<br />
                    </Typography>
                    <Typography color='initial' variant='h6' component='h6' align='left' >
                        C.  {props.CQData !== undefined ? props.CQData.optionC : ""}<br />
                    </Typography>
                    <Typography color='initial' variant='h6' component='h6' align='left' >
                        D.  {props.CQData !== undefined ? props.CQData.optionD : ""}<br />
                    </Typography>
                    <Typography color='initial' variant='h6' component='h6' align='left' >
                        Answer.  <b>{props.CQData !== undefined ? props.CQData.answer : ""}</b><br />
                    </Typography>
                {data.showreason ===true && <TextField
                    style={{marginTop:'20px',width:"40em"}}
                    error={errors.reason !== "" ? true : false}
                    helperText={errors.reason}
                    multiline={true}
                    rows={2}
                    className="questionName"
                    id="outlined-basic"
                    variant="outlined"
                    label="Reason"
                    type="text"
                    name="reason"
                    value={data.reason}
                    onChange={(e)=>{
                         setData({...data,reason:e.target.value});
                         if(data.reason.length>4)
                                setErrors({...errors,reason:""});
                        }}
                />}
                </MuiDialogContent>
                <MuiDialogActions>
                    <Button variant="contained" color="primary" disabled={props.CQData && props.CQData.status === "APPROVED" ? true : false} onClick={() => handleClick("APPROVED")}>Approve</Button><Button disabled={props.CQData && props.CQData.status === "APPROVED" ? true : false} variant="contained" color="secondary" onClick={() => handleClick("REJECTED")}>Reject</Button>
                </MuiDialogActions>
            </Dialog>
        </div>
    )
}

export default ChangeQuestionStatusModel
