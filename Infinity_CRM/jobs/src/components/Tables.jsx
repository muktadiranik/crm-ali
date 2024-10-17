import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { Button } from "@material-ui/core";

import StyledTableRowMain from "./StyledTableRowMain";
import StyledTableCell from "./StyledTableCell";
import PlanReviewTable from "./PlanReviewTable";
import {
  ViewEditWidget,
  WidgetEnum,
  SelectEndpointsEnum,
} from "./ViewEditWidget";
import JobCycleInlineCreate from "./ViewEditWidget/JobCycleInlineCreate";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie("csrftoken");

function formatDate(date) {
  if (!date) return null;

  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function Row({
  tableData,
  setTableData,
  row,
  needsRefresh,
  setNeedsRefresh,
  setCurrentSampleId,
  fetchSampleData,
  currentSampleId,
}) {
  const [open, setOpen] = React.useState(true);
  const [createReviewPlan, setCreateReviewPlan] = useState(false);

  const handleSampleDelete = async (id) => {
    await fetch(`/api/JobCycle/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "X-CSRFToken": csrftoken,
      },
    }).then((res) => {});
    console.log("sample delete", tableData);
    const result = tableData.filter((each) => each.id !== id);
    setTableData(result);
  };

  const handleKidDelete = async (id) => {
    console.log("Deleting kid of id", id);
    await fetch(`/api/Kid/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "X-CSRFToken": csrftoken,
      },
    }).then((res) => {});
    setNeedsRefresh(needsRefresh + 1);
  };

  const handleKidCreate = async (sampleId) => {
    setCurrentSampleId(sampleId);
    setCreateReviewPlan(!createReviewPlan);
  };

  const apiURL = (id) => `/api/JobCycle/${id}`;

  return (
    <React.Fragment>
      <StyledTableRowMain>
        <StyledTableCell align='center'>
          {row.Plan_reviews.length > 0 && (
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </StyledTableCell>
        <StyledTableCell component='th' scope='row' align='center'>
          <ViewEditWidget
            widget={WidgetEnum.select}
            fieldName={"type"}
            value={row.type}
            apiURL={apiURL(row.id)}
            fetchSampleData={fetchSampleData}
            optionsURL={SelectEndpointsEnum.jobCycles}
          />
        </StyledTableCell>
        <StyledTableCell component='th' scope='row' align='center'>
          <ViewEditWidget
            widget={WidgetEnum.select}
            fieldName={"status"}
            value={row.status}
            apiURL={apiURL(row.id)}
            fetchSampleData={fetchSampleData}
            optionsURL={SelectEndpointsEnum.jobStatuses}
          />
        </StyledTableCell>
        <StyledTableCell component='th' scope='row' align='center'>
          <ViewEditWidget
            widget={WidgetEnum.date}
            fieldName={"dateReceived"}
            value={formatDate(row.dateReceived)}
            apiURL={apiURL(row.id)}
            fetchSampleData={fetchSampleData}
          />
        </StyledTableCell>
        <StyledTableCell component='th' scope='row' align='center'>
          <ViewEditWidget
            widget={WidgetEnum.date}
            fieldName={"dueDate"}
            value={formatDate(row.dueDate)}
            apiURL={apiURL(row.id)}
            fetchSampleData={fetchSampleData}
          />
        </StyledTableCell>
        <StyledTableCell component='th' scope='row' align='center'>
          <ViewEditWidget
            widget={WidgetEnum.date}
            fieldName={"dateOut"}
            value={formatDate(row.dateOut)}
            apiURL={apiURL(row.id)}
            fetchSampleData={fetchSampleData}
          />
        </StyledTableCell>
        <StyledTableCell component='th' scope='row' align='center'>
          <ViewEditWidget
            widget={WidgetEnum.text}
            fieldName={"deliveredBy"}
            value={row.deliveredBy}
            apiURL={apiURL(row.id)}
            fetchSampleData={fetchSampleData}
          />
        </StyledTableCell>
        <StyledTableCell component='th' scope='row' align='center'>
          <ViewEditWidget
            widget={WidgetEnum.checkbox}
            fieldName={"completionStatus"}
            value={row.completionStatus}
            labelValue={row.completionStatus ? "Done" : "Pending"}
            apiURL={apiURL(row.id)}
            fetchSampleData={fetchSampleData}
          />
        </StyledTableCell>
        <StyledTableCell component='th' scope='row' align='center'>
          <Button
            onClick={() => {
              console.log("Adding a kid on", row.id);
            }}>
            <AddIcon
              onClick={() => {
                handleKidCreate(row.id);
              }}
            />
          </Button>
          <Button>
            <DeleteIcon
              onClick={() => {
                handleSampleDelete(row.id);
              }}
            />
          </Button>
        </StyledTableCell>
      </StyledTableRowMain>
      {(row.Plan_reviews.length > 0 || createReviewPlan) && (
        <PlanReviewTable
          {...{
            row,
            fetchSampleData,
            handleKidDelete,
            open,
            createReviewPlan,
            currentSampleId,
          }}
        />
      )}
    </React.Fragment>
  );
}

export default function CollapsibleTable({
  jobID,
  data,
  setData,
  sample,
  setSample,
  isSampleModalOpen,
  setIsSampleModalOpen,
  setNeedsRefresh,
  needsRefresh,
  setCurrentSampleId,
  iskidModalOpen,
  setIsKidModalOpen,
  kid,
  setKid,
  fetchSampleData,
  currentSampleId,
}) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <StyledTableCell align='center'></StyledTableCell>
              <StyledTableCell align='center'>Job Cycle</StyledTableCell>
              <StyledTableCell align='center'>Job Status</StyledTableCell>
              <StyledTableCell align='center'>Date Received</StyledTableCell>
              <StyledTableCell align='center'>Date Due</StyledTableCell>
              <StyledTableCell align='center'>Date Out</StyledTableCell>
              <StyledTableCell align='center'>Delivered By</StyledTableCell>
              <StyledTableCell align='center'>Completed</StyledTableCell>
              <StyledTableCell align='center'>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((each) => (
              <Row
                key={each.id}
                row={each}
                tableData={data}
                setTableData={setData}
                sample={sample}
                setSample={setSample}
                isSampleModalOpen={isSampleModalOpen}
                setIsSampleModalOpen={setIsSampleModalOpen}
                setNeedsRefresh={setNeedsRefresh}
                needsRefresh={needsRefresh}
                setCurrentSampleId={setCurrentSampleId}
                setIsKidModalOpen={setIsKidModalOpen}
                iskidModalOpen={iskidModalOpen}
                kid={kid}
                setKid={setKid}
                fetchSampleData={fetchSampleData}
                currentSampleId={currentSampleId}
              />
            ))}
            {(isSampleModalOpen || data.length === 0) && (
              <JobCycleInlineCreate
                key={1000000000001}
                jobID={jobID}
                showHeader={data.length > 0}
                fetchSampleData={fetchSampleData}
                submittalsData={data}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
