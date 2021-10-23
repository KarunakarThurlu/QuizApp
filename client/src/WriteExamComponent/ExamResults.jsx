import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

import './writeexam.scss';

export default function ExamResultsModel(props) {

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="MuiDialog-paper-examresultsModel"
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography color="secondary" variant='h5'>
                        Test Score
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography color='primary' variant='h6' component='h6' align='center' >
                           Your Test Score : {props.testScore}
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} variant="outlined" color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}