import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import UsersApiCall from "../ApiCalls/UsersApiCall"
import ChartUtils from "../Utils/ChartUtil";
import CommonConstants from "../Utils/CommonConstants";



const UsersVisualization = (props) => {
    const [data, setData] = useState();
    useEffect(() => {
        UsersApiCall.getUsersDataForVisualization()
                    .then(res => {
                        setData(res.data.data)
                    })
                    .catch(err => {
                        console.log(err)
                    })
    }, []);

   
    const pieChartData={chartType:CommonConstants.PIE_CHART,data:data && data.users}
    return (
        <div>
            <Dialog open={props.open} onClose={props.onClose} className="MuiDialog-paper-ReviewExamModel">
                <MuiDialogTitle>
                    <IconButton className="closeButton" onClick={props.onClose} variant="contained"><CloseIcon /></IconButton>
                    <Typography variant="h5">Users Data View</Typography>
                </MuiDialogTitle>
                <MuiDialogContent >
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={ChartUtils(pieChartData)}
                    />
                    
                </MuiDialogContent>
                
            </Dialog>
        </div>
    );
}
export default UsersVisualization;