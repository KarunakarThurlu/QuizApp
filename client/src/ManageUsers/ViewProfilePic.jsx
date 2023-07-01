import React from "react";
import Avatar from "@material-ui/core/Avatar";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { Buffer } from "buffer";

const ViewProfilePic = (props) => {
  const constructImage = (row) => {
    if (row) {
      return `data:${row.contentType};base64,${new Buffer.from(
        row.data
      ).toString("base64")}`;
    } else {
      return "/user.png";
    }
  };
  return (
    <div className="Image-container">
      <Dialog
        open={props.open}
        onClose={props.onClose}
        className="MuiDialog-paper-ProfilePic"
      >
        <MuiDialogTitle>
          <CloseIcon
            style={{ float: "right" }}
            variant="contained"
            onClick={() => props.onClose()}
            className="addUserButton"
            color="primary"
          />
        </MuiDialogTitle>
        <DialogContent>
          <Avatar src={constructImage(props.image)} alt="" />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewProfilePic;
