import React, { useState, useEffect } from 'react';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import QuestionsApiCall from '../ApiCalls/QuestionsApiCall';
import ChartUtils from "../Utils/ChartUtil";
import CommonConstants from "../Utils/CommonConstants";


const QuestionsVisualization = (props) => {
    const [data, setData] = useState();


    useEffect(()=> {
        QuestionsApiCall.getQuestionsDataForVisualization()
            .then(res => {
                setData(res.data.data);
            })
            .catch(err => {
                console.log(err)
            })
    },[props]);

    const BarChartData = {
        chartType: CommonConstants.BAR_CAHRT,
        seriesData: data && data.seriesData,
        drilldowndata: data && data.drillDownData,
        title: "Questions count by Topic Name",
        yaxistitle: "Questions Count",
        xaxistitle: "Topic Name",
        seriesName: "Topic Name",
    }

    return (
        <div>
            <Dialog open={props.open} onClose={props.onClose} className="MuiDialog-paper-ReviewExamModel">
                <MuiDialogTitle>
                    <IconButton className="closeButton" onClick={props.onClose} variant="contained"><CloseIcon /></IconButton>

                </MuiDialogTitle>
                <MuiDialogContent >
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={ChartUtils(BarChartData)}
                    />
                </MuiDialogContent>

            </Dialog>
        </div>
    );
}
export default QuestionsVisualization;