import React, { useEffect, useState, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import QuestionsApiCall from "../ApiCalls/QuestionsApiCall";
import DataTable from "../Utils/DataTable";
import HelperUtils from "../Utils/HelperUtils";
import Spinner from "../Utils/Spinner";
import TooltipUtil from "../Utils/ToolTip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import TopicsContext from "../Context/TopicContext/TopicContext";
import "./dashboard.scss";

function UserQuestionsView(props) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [filters, setFilters] = useState({ topicName: [] }); //For Label Display
  const [filtersData, setFiltersData] = useState({ topicName: "" }); //For Filter Data
  const { getTopicNames, Topics } = useContext(TopicsContext);
  useEffect(() => {
    setSpinner(true);
    QuestionsApiCall.userQuestionsViewInDashboard(
      page,
      rowsPerPage,
      props.status,
      filtersData
    )
      .then((res) => {
        setSpinner(false);
        if (res.data.statusCode === 200) {
          setQuestions(res.data.data);
          setTotalCount(res.data.totalCount);
        }
      })
      .catch((err) => {
        setSpinner(false);
        console.log(err);
      })
      .finally(() => {
        setSpinner(false);
      });
  }, [page, rowsPerPage, filtersData, props.status]);

  useEffect(() => {
    getTopicNames();
  }, []);
  const topics = Topics.topicNames;
  let tns = [];
  if (topics !== undefined && topics.length > 0 && topics !== null) {
    try {
      const t = JSON.parse(topics);
      t.map((t) => tns.push({ topicName: t.topicName, id: t._id }));
    } catch (error) {
      console.error("Error While Parsing TopicsNames");
    }
  }

  const columns = [
    {
      field: "topic_name",
      title: "Topic",
      filtering: true,
      filterComponent: () => (
        <Autocomplete
          style={{ width: "15em" }}
          multiple
          size="small"
          id="topic"
          options={tns}
          getOptionLabel={(option) => option.topicName}
          onChange={(event) => {
            const topicName = event.target.textContent;
            const topicId = tns.filter((t) => t.topicName === topicName);
            const obj = {
              ...filters,
              topicName: topicName !== "" ? [{ topicName: topicName }] : [],
            };
            const filteredObject = {
              ...filtersData,
              topicName: topicName !== "" ? topicId[0].id : "",
            };
            setFilters(obj);
            setFiltersData(filteredObject);
          }}
          value={filters.topicName}
          renderInput={(inputparams) => (
            <TextField
              {...inputparams}
              variant="standard"
              style={{ width: "16em" }}
            />
          )}
        />
      ),
      render: (params) => (
        <TooltipUtil
          key={params.topic_name}
          toolTipData={params.topic_name}
          length={15}
        />
      ),
    },
    {
      field: "name",
      title: "Question Name",
      filtering: false,
      render: (params) => (
        <TooltipUtil
          key={params.name._id}
          toolTipData={params.name}
          length={40}
        />
      ),
    },
    {
      field: "optionA",
      title: "optionA",
      filtering: false,
      render: (params) => (
        <TooltipUtil
          key={params.optionA._id}
          toolTipData={params.optionA}
          length={17}
        />
      ),
    },
    {
      field: "optionB",
      title: "optionB",
      filtering: false,
      render: (params) => (
        <TooltipUtil
          key={params.optionB._id}
          toolTipData={params.optionB}
          length={17}
        />
      ),
    },
    {
      field: "optionC",
      title: "optionC",
      filtering: false,
      render: (params) => (
        <TooltipUtil
          key={params.optionC._id}
          toolTipData={params.optionC}
          length={17}
        />
      ),
    },
    {
      field: "optionD",
      title: "optionD",
      filtering: false,
      render: (params) => (
        <TooltipUtil
          key={params.optionD._id}
          toolTipData={params.optionD}
          length={17}
        />
      ),
    },
    { field: "createdOn", title: "Created Date", filtering: false },
  ];
  if (props.status === "REJECTED") {
    //rejectedReason
    columns.push(
      {
        field: "status",
        title: "Status",
        align: "center",
        filtering: false,
        render: (params) => (
          <span variant="contained" style={{ color: "#d32f2f", width: "10em" }}>
            {params.status}{" "}
          </span>
        ),
      },
      {
        field: "rejectedReason",
        title: "RejectedReason",
        align: "center",
        filtering: false,
        render: (params) => (
          <span style={{ color: "#d32f2f" }}>
            <TooltipUtil toolTipData={params.rejectedReason} length={15} />
          </span>
        ),
      }
    );
  }
  const rows = questions;
  if (rows !== undefined && rows.length !== 0) {
    rows.forEach((q, i) => {
      q.creator_name = q.creator.name;
      q.topic_name = q.topic.topicName;
      q.createdOn = HelperUtils.formateDate(q.createdOn);
      q.updatedOn = HelperUtils.formateDate(q.updatedOn);
    });
  }
  const TableData = {
    columns,
    rows,
    page,
    rowsPerPage,
    title: "Questions Data",
    showGroupByHeader: false,
    filtering: true,
    totalCount,
    showActions: false,
  };
  return (
    <div>
      {spinner && <Spinner open={spinner} />}
      <Dialog
        onClose={props.onClose}
        open={props.open}
        className="userQuestionsView"
      >
        <MuiDialogTitle>
          <IconButton className="closeButton" onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <MuiDialogContent>
          <DataTable
            data={TableData}
            handleChangePage={(event, newPage) => {
              setPage(newPage);
              setRowsPerPage(rowsPerPage);
            }}
            setRowsPerPage={setRowsPerPage}
            setPage={setPage}
            getDataOnPageChange={(pageSize) => {
              setPage(1);
              setRowsPerPage(pageSize);
            }}
          />
        </MuiDialogContent>
      </Dialog>
    </div>
  );
}

export default UserQuestionsView;
