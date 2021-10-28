import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';


const Spinner = (props) => {
  return (
    <div className="spinner"  >
      <Dialog open={props.open}  >
        <DialogActions >
          <img src="spinner.gif" alt="Loading..." ></img>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default Spinner;