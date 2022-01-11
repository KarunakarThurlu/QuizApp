import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';




const ReviewExam = (props) => {
    const [data, setData] = useState(props.data !== undefined ? props.data : []);
    const [score, setScore] = useState(props.score !== undefined ? props.score : 0);
    useEffect(() => {
        setData(props.data !== undefined ? props.data : []);
        setScore(props.score !== undefined ? props.score : 0);
    }, [props]);

    return (
        <div>
            <Dialog open={props.open} onClose={props.onClose} className="MuiDialog-paper-ReviewExamModel">
                <MuiDialogTitle>
                    <IconButton className="closeButton" onClick={props.onClose} variant="contained"><CloseIcon /></IconButton>
                    <Typography variant="h5">Review Exam</Typography>
                </MuiDialogTitle>
                <MuiDialogContent>
                    <TableContainer className="table-container" style={{ marginTop: "0px", height: "20em" }}>

                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead >
                                <TableRow style={{ backgroundColor: "bisque" }}>
                                    <TableCell >Id</TableCell>
                                    <TableCell >QuestionName</TableCell>
                                    <TableCell >OptionA</TableCell>
                                    <TableCell >OptionB</TableCell>
                                    <TableCell >OptionC</TableCell>
                                    <TableCell >OptionD</TableCell>
                                    <TableCell >Answear</TableCell>
                                    <TableCell >YourAnswer</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody style={{ height: "2em" }}>
                                {data.length > 0 && data.map((row, index, array) => (
                                    <TableRow key={row._id}>
                                        <TableCell >{index + 1}</TableCell>
                                        <TableCell title={row.name}>{row.name.substr(0, 50)}{row.name.length>49?"...":""}</TableCell>
                                        <TableCell title={row.optionA}>{row.optionA.substr(0, 14)}{row.optionA.length>15?"...":""}</TableCell>
                                        <TableCell title={row.optionB}>{row.optionB.substr(0, 14)}{row.optionB.length>15?"...":""}</TableCell>
                                        <TableCell title={row.optionC}>{row.optionC.substr(0, 14)}{row.optionC.length>15?"...":""}</TableCell>
                                        <TableCell title={row.optionD}>{row.optionD.substr(0, 14)}{row.optionD.length>15?"...":""}</TableCell>
                                        <TableCell title={row.answer}><b>{row.answer}</b></TableCell>
                                        <TableCell style={{ color: row.answer === row.YourAnswer ? "green" : "red" }} ><b>{row.YourAnswer}</b></TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </MuiDialogContent>
                <MuiDialogActions>
                    <Typography variant="h6"><b>Total Marks: {score} </b></Typography>
                </MuiDialogActions>
            </Dialog>
        </div>
    );
}
export default ReviewExam;