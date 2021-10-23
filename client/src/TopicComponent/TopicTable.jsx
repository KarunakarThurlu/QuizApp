import React, { useState, useEffect, useContext } from 'react';
import Home from "../HomeComponent/Home";
import TopicContext from '../Context/TopicContext/TopicContext';
import HelperUtils from '../Utils/HelperUtils';
import TopicModel from './TopicModel';
import WarningPopupModel from "../Utils/WarningPopUpModel"
import CommonConstants from '../Utils/CommonConstants';
import DataTable from "../Utils/DataTable";
import TopicVisualization from "./TopicVisualization";
import "./topic.scss";

const TopicTable = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [editTopicData, setEditTopicData] = useState(null);
  const [deleteTopicId, setDeleteTopicId] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const { Topics, getAllTopics, deleteTopic } = useContext(TopicContext);



  useEffect(() => {
    getAllTopics(page, rowsPerPage);
  }, [page, rowsPerPage]);
  
  let rows = Topics.Topics;
  if (rows !== undefined && rows.length !== 0) {
    rows.forEach((q, i) => {
      q.name = q.creator.name;
      q.createdOn = HelperUtils.formateDate(q.createdOn);
      q.updatedOn = HelperUtils.formateDate(q.updatedOn);
    });
  }


  const columns =
    [
      { field: '_id', title: 'Id' },
      { field: 'topicName', title: 'TopicName', },
      { field: 'description', title: 'description', },
      { field: 'name', title: 'Name', },
      { field: 'createdOn', title: 'CreatedOn', },
      { field: 'updatedOn', title: 'UpdatedOn', },

    ]

  const handleConformDelete = () => {
    deleteTopic(deleteTopicId);
    setShowWarningPopup(false);
  }
  const TableData = { columns, rows, page, rowsPerPage, totalCount: Topics.totalCount, toolTip: "Add Topic", showGroupByHeader: true, title: "Topics Data ", showActions: true }
  return (
    <div className="topic-table">
      <Home />
      {showVisualization && <TopicVisualization open={showVisualization} onClose={() => setShowVisualization(false)} />}
      <WarningPopupModel open={openDeleteModel} onClickYes={handleConformDelete} message={CommonConstants.Delete_Topic_Warning} handleClose={() => setOpenDeleteModel(false)} />
      <TopicModel open={open} data={editTopicData} onClose={() => setOpen(false)} />
      <WarningPopupModel open={showWarningPopup} message={CommonConstants.Delete_Topic_Warning} onClickYes={handleConformDelete} handleClose={() => setShowWarningPopup(false)} />
      <div className="Data-Table">
        <DataTable
          data={TableData}
          handleChangePage={(event, newPage) => setPage(newPage)}
          setFormDataToEdit={setEditTopicData}
          setOpen={setOpen}
          setIdForDelete={setDeleteTopicId}
          setShowWarningPopup={setShowWarningPopup}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          getDataOnPageChange={(pageSize) => { setPage(1); setRowsPerPage(pageSize) }}
          setShowVisualization={setShowVisualization}
        />
      </div>
    </div>
  );
}

export default TopicTable;

/*
<TableContainer className="table-container">
        <div className="heading">
          <div className="label">
            <label htmlFor=""> Topics Table</label>
          </div>
          <div className="addbutton">
            <Button variant="outlined"  onClick={() => {setOpenEditModel(true);setEditTopicData({})}}><AddIcon style={{ fontSize: 25,  padding: "4px" }} />Add</Button>
          </div>
        </div>
        <Table stickyHeader aria-label="sticky table">
          <TableHead >
            <TableRow >
              <TableCell >TopicId</TableCell>
              <TableCell >TopicName</TableCell>
              <TableCell >Description</TableCell>
              <TableCell >Createator</TableCell>
              <TableCell >CreatedOn</TableCell>
              <TableCell >UpdatedOn</TableCell>
              <TableCell align="center" colSpan={2} >Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row._id}>
                <TableCell >{row._id}</TableCell>
                <TableCell >{row.topicName}</TableCell>
                <TableCell >{row.description}</TableCell>
                <TableCell >{row.creator.name}</TableCell>
                <TableCell >{HelperUtils.formateDate(row.createdOn)}</TableCell>
                <TableCell >{HelperUtils.formateDate(row.updatedOn)}</TableCell>
                <TableCell ><Button variant="contained" onClick={() => {setEditTopicData(row);setOpenEditModel(true)}}><EditIcon /></Button></TableCell>
                <TableCell ><Button variant="contained" onClick={() => {setDeleteTopicId(row._id);setOpenDeleteModel(true)}} ><DeleteIcon color="secondary" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />*/