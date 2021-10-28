import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

export default function DeletePopUpModel(props) {

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        
      >
        <DialogTitle id="alert-dialog-title" style={{textAlign:'center'}}>
          <Typography color="secondary" variant='h5'>
             Are You Sure?
          </Typography>
        </DialogTitle>
        <DialogContent style={{width: '500px',height:'100px',padding:'20px'}}>
          <DialogContentText id="alert-dialog-description">
            <Typography color='primary' variant='h6' component='h6' align='center' >
              {props.message}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{padding:"20px"}}>
          <Button onClick={props.onClickYes}  variant="contained"  color="primary">
            YES
          </Button>
          <Button onClick={props.handleClose}  variant="contained" color="primary">
            NO
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}