import React, { useEffect, useState, useRef } from "react";
import Home from "../HomeComponent/Home";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Highcharts from "highcharts";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import HighchartsReact from "highcharts-react-official";
import Typography from "@material-ui/core/Typography";
import Spinner from "../Utils/Spinner";
import GridLayout from "react-grid-layout";
import CommonConstants from "../Utils/CommonConstants";
import ChartUtil from "../Utils/ChartUtil";
import DrillDown from "highcharts/modules/drilldown";
import QuestionsApiCall from "../ApiCalls/QuestionsApiCall";
import variablePie from "highcharts/modules/variable-pie.js";
variablePie(Highcharts);
DrillDown(Highcharts);

require("highcharts/modules/exporting")(Highcharts);
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const DashBoard = (props) => {
  const navigate = useNavigate();

  const [chartsData, setChartsData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const firstChart = useRef(null);
  const secondChart = useRef(null);
  const thirdChart = useRef(null);

  useEffect(() => {
    getDataForDashBoard();
  }, []);

  const getDataForDashBoard = () => {
    setSpinner(true);
    QuestionsApiCall.getDataForUsersdashboard()
      .then((response) => {
        setSpinner(false);
        setChartsData(response.data.data);
      })
      .catch((error) => {
        setSpinner(false);
        console.log("Errror Whle fetching Data for Dashboard", error);
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const layoutLg = [
    { i: "a", x: 0, y: 0, w: 2, h: 2, resizeHandles: ["ne", "se", "sw", "nw"] },
    { i: "b", x: 2, y: 0, w: 6, h: 2, resizeHandles: ["ne", "se", "sw", "nw"] },
    { i: "c", x: 8, y: 0, w: 4, h: 2, resizeHandles: ["ne", "se", "sw", "nw"] },
    {
      i: "d",
      x: 12,
      y: 1,
      w: 12,
      h: 2,
      resizeHandles: ["ne", "se", "sw", "nw"],
    },
  ];
  const layoutSm = [
    { i: "a", x: 0, y: 0, w: 2, h: 1, resizeHandles: ["ne", "se", "sw", "nw"] },
    { i: "b", x: 1, y: 0, w: 2, h: 1, resizeHandles: ["ne", "se", "sw", "nw"] },
    { i: "c", x: 2, y: 0, w: 1, h: 1, resizeHandles: ["ne", "se", "sw", "nw"] },
    { i: "d", x: 3, y: 0, w: 1, h: 1, resizeHandles: ["ne", "se", "sw", "nw"] },
  ];
  const mView = {
    layout: layoutSm,
    columns: 2,
    width: 1359,
  };
  const Dview = {
    layout: layoutLg,
    columns: 12,
    width: 1350,
  };
  let layout = window.innerHeight > 613 ? mView : Dview;

  const onLayoutChange = (i) => {
    Highcharts.charts.map((v, i, a) => {
      if (Highcharts.charts[i] !== undefined) Highcharts.charts[i].reflow();
      return null;
    });
  };

  const spline = {
    chartType: CommonConstants.SPLINE,
    seriesData: chartsData.examsChart && chartsData.examsChart.series,
    xaxis: chartsData.examsChart && chartsData.examsChart.xaxis,
    title: "Exams count by Topic Name",
    yaxistitle: "Exams Count",
    xaxistitle: "Topic Name",
  };
  const column = {
    chartType: CommonConstants.BAR_CAHRT,
    seriesData:
      chartsData.splinechartData && chartsData.splinechartData.seriesData,
    drilldowndata:
      chartsData.splinechartData && chartsData.splinechartData.drillDownData,
    title: "Questions count by Topic Name",
    yaxistitle: "Questions Count",
    xaxistitle: "Questions Count",
    seriesName: "Topic Name",
  };
  const pie = {
    chartType: CommonConstants.PIE_CHART,
    data: chartsData.groupByUserStatus && chartsData.groupByUserStatus.users,
    title: "Users By Status",
  };
  const VARIABLE_RADIUS_PIE = {
    chartType: CommonConstants.VARIABLE_RADIUS_PIE,
    data:
      chartsData.groupByUserStatus &&
      chartsData.groupByUserStatus.usersWithRoles,
  };
  return (
    <div className="dashboard">
      <Home />
      {spinner && <Spinner open={spinner} />}
      <div className="dashboardheader">
        <Link to="/questionsdashboard">
          <h4>Questions DashBoard</h4>
        </Link>
        <Link to="/usersdashboard">
          {localStorage.getItem("role") === "ADMIN" ||
          localStorage.getItem("role") === "SUPER_ADMIN" ? (
            <h4>Users Dashboard</h4>
          ) : (
            ""
          )}
        </Link>
      </div>
      <Box>
        <Grid container spacing={1}>
          <Grid item xs={3} className="first-row">
            <Item>
              <Typography variant="h6">
                Total Users : <b>{chartsData.userCount}</b>
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={3} className="first-row">
            <Item>
              <Typography variant="h6">
                Total Topics : <b>{chartsData.topicCount}</b>
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={3} className="first-row">
            <Item>
              <Typography variant="h6">
                Total Questions : <b>{chartsData.questionCount}</b>
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={3} className="first-row">
            <Item>
              <Typography variant="h6">
                Total Exams : <b>{chartsData.examCount} </b>
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={12} className="grids">
            <GridLayout
              className="layout"
              onLayoutChange={(e) => onLayoutChange(e)}
              layout={layout.layout}
              cols={layout.columns}
              rowHeight={200}
              width={layout.width}
            >
              <div key="a">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={ChartUtil(VARIABLE_RADIUS_PIE)}
                  ref={firstChart}
                  containerProps={{ style: { width: "100%", height: "100%" } }}
                />
              </div>
              <div key="b">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={ChartUtil(column)}
                  ref={secondChart}
                  containerProps={{ style: { width: "100%", height: "100%" } }}
                />
              </div>
              <div key="c">
                <HighchartsReact
                  highcharts={Highcharts}
                  ref={thirdChart}
                  options={ChartUtil(pie)}
                  containerProps={{ style: { width: "100%", height: "100%" } }}
                />
              </div>
              <div key="d">
                <HighchartsReact
                  highcharts={Highcharts}
                  ref={thirdChart}
                  options={ChartUtil(spline)}
                  containerProps={{ style: { width: "100%", height: "100%" } }}
                />
              </div>
            </GridLayout>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default DashBoard;
