import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Home from "../HomeComponent/Home";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import AccessAlarmsRoundedIcon from "@material-ui/icons/AccessAlarmsRounded";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import BarChartRoundedIcon from "@material-ui/icons/BarChartRounded";
import UserQuestionsView from "./UserQuestionsView";
import ChartUtil from "../Utils/ChartUtil";
import CommonConstants from "../Utils/CommonConstants";
import Spinner from "../Utils/Spinner";

import "./dashboard.scss";

import QuestionsApiCall from "../ApiCalls/QuestionsApiCall";

function DashBoard() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [questions, setQuestions] = useState({});
  const [xaxisData, setXaxisData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    fetchDataForDashBoard();
  }, []);
  const fetchDataForDashBoard = () => {
    setSpinner(true);
    QuestionsApiCall.getQuestionsCountForDashBoard()
      .then((response) => {
        setSpinner(false);
        if (response.data.statusCode === 200) {
          setQuestions(response.data.data);
          let xaxis = [];
          let series = [];
          response.data.data.topics.forEach((v, i) => {
            xaxis.push(v.topicName);
            let topic = response.data.data.topicCount.find(
              (x) => x._id === v._id
            );
            if (topic) {
              series.push(topic.count);
            } else {
              series.push(0);
            }
          });
          setXaxisData(xaxis);
          setChartData(series);
        } else {
          console.log("Error in getting questions count for dashboard");
        }
      })
      .catch((error) => {
        setSpinner(false);
        console.log(error);
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const splineData = {
    chartType: CommonConstants.SPLINE,
    seriesData: chartData,
    xaxis: xaxisData,
    title: "QuestionsCount by TopicName",
    yaxistitle: "Questions Count",
    xaxistitle: "Topic Name",
    legend: false,
  };

  return (
    <div className="questionsdashboard">
      <Home />
      {spinner && <Spinner open={spinner} />}
      {open && (
        <UserQuestionsView
          open={open}
          onClose={() => setOpen(false)}
          status={status}
        />
      )}
      <div className="dashboardheader">
        <Link to="/questionsdashboard">
          <h4>Questions DashBoard</h4>
        </Link>{" "}
        <Link to="/usersdashboard">
          {localStorage.getItem("role") === "ADMIN" ||
          localStorage.getItem("role") === "SUPER_ADMIN" ? (
            <h4>Users Dashboard</h4>
          ) : (
            ""
          )}
        </Link>
      </div>
      <Grid container spacing={5}>
        <Grid item xs={6} sm={3}>
          <Paper
            onClick={() => {
              setOpen(true);
              setStatus("PENDING");
            }}
          >
            <AccessAlarmsRoundedIcon
              style={{ color: "orange", fontSize: "3em" }}
            />
            InProgress{" "}
            <b>
              {" "}
              <h3>{questions.PENDING}</h3>{" "}
            </b>{" "}
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            onClick={() => {
              setOpen(true);
              setStatus("APPROVED");
            }}
          >
            {" "}
            <CheckRoundedIcon style={{ color: "green", fontSize: "3em" }} />
            Approved{" "}
            <b>
              {" "}
              <h3>{questions.APPROVED}</h3>{" "}
            </b>{" "}
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            onClick={() => {
              setOpen(true);
              setStatus("REJECTED");
            }}
          >
            {" "}
            <ClearRoundedIcon style={{ color: "red", fontSize: "3em" }} />
            Rejected{" "}
            <b>
              {" "}
              <h3>{questions.REJECTED}</h3>{" "}
            </b>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            onClick={() => {
              setOpen(true);
              setStatus("TOTAL");
            }}
          >
            <BarChartRoundedIcon style={{ fontSize: "3em" }} />
            Total Questions{" "}
            <b>
              {" "}
              <h3>{questions.totalCount}</h3>{" "}
            </b>
          </Paper>
        </Grid>
        <Grid item xs={12} className="chart">
          <HighchartsReact
            highcharts={Highcharts}
            options={ChartUtil(splineData)}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default DashBoard;
