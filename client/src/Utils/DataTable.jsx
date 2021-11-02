
import React from 'react'
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import BarChartRoundedIcon from '@material-ui/icons/BarChartRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import MaterialTable from 'material-table';
import Pagination from '@mui/material/Pagination';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';


import "./DataTable.scss"

function DataTable(props) {

    const handleClose = (e) => {
        props.setPage(1)
        props.setRowsPerPage(e.target.textContent === undefined ? props.data.rowsPerPage : e.currentTarget.textContent);
        props.getDataOnPageChange(e.currentTarget.textContent);
    };
    return (
        <>
            <MaterialTable
                title={props.data.title}
                data={props.data.rows}
                columns={props.data.columns}
                actions={
                    props.data.showActions && [
                        {
                            icon: () => <AddIcon onClick={() => { props.setOpen(true); props.setFormDataToEdit(null) }} />,
                            tooltip: props.data.toolTip,
                            isFreeAction: true
                        },
                        {
                            icon: () => <BarChartRoundedIcon onClick={() => { props.setShowVisualization(true); }} />,
                            tooltip: 'Chart View',
                            isFreeAction: true
                        },
                        rowData => ({
                            icon: () => <EditIcon />,
                            tooltip: "Edit",
                            onClick: (event, currentRowData) => {
                                props.setFormDataToEdit(currentRowData);
                                props.setOpen(true);
                            },
                        }),
                        rowData => ({
                            icon: () => <DeleteIcon color="secondary" />,
                            tooltip: 'Delete',
                            onClick: (event, currentRowData) => {
                                props.setIdForDelete(currentRowData._id);
                                props.setShowWarningPopup(true);
                            },
                        })
                    ]
                }
                options={{
                    exportButton: true,
                    grouping: props.data.showGroupByHeader===true?true:false,
                    sorting: true,
                    maxBodyHeight: 351,
                    headerStyle: { position: 'sticky', top: 0, backgroundColor: '#01579b', color: '#FFF', whiteSpace: 'nowrap' },
                    rowStyle: { whiteSpace: 'nowrap' },
                    actionsColumnIndex: props.data.columns.length,
                    paging: true,
                    pageSize: 100,
                    emptyRowsWhenPaging: false,

                }}
                components={{
                    Pagination: property => (
                        <div className="custompagination">
                            <Typography >Per Page : </Typography>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={props.data.rowsPerPage}
                                variant='outlined'
                            >
                                <MenuItem onClick={handleClose} defaultValue="5" value="5">5</MenuItem>
                                <MenuItem onClick={handleClose} value="10">10</MenuItem>
                                <MenuItem onClick={handleClose} value="25">25</MenuItem>
                                <MenuItem onClick={handleClose} value="50">50</MenuItem>
                                <MenuItem onClick={handleClose} value="100">100</MenuItem>
                            </Select>
                            <Pagination
                                count={Math.ceil(props.data.totalCount / props.data.rowsPerPage)}
                                showFirstButton
                                color="primary"
                                variant="text"
                                showLastButton
                                defaultPage={1}
                                page={props.data.page}
                                onChange={props.handleChangePage}
                            />

                        </div>
                    )
                }}
            />
        </>
    )
}
export default DataTable
