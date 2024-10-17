import { useEffect, useState } from "react";
import { Button, TextField, Checkbox } from "@material-ui/core";
import { Select, MenuItem } from "@material-ui/core";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import StyledTableCell from "../StyledTableCell";
import { SelectEndpointsEnum, createRequestData } from "./configs";
import StyledTableRow from "../StyledTableRow";

const PlanReviewInlineCreate = ({ showHeader, sampleID, fetchSampleData }) => {
  const [reviewers, setReviewers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [deciplineList, setDeciplineList] = useState([]);

  const [reviewer, setReviewer] = useState();
  const [discipline, setDiscipline] = useState();
  const [hours, setHours] = useState();
  const [status, setStatus] = useState();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetch(SelectEndpointsEnum.reviewers)
      .then((response) => response.json())
      .then((response) => setReviewers(response))
      .then(() => {
        fetch(SelectEndpointsEnum.jobStatuses)
          .then((response) => response.json())
          .then((response) => setStatuses(response));
      })
      .then(() => {
        fetch(SelectEndpointsEnum.diciplines)
          .then((response) => response.json())
          .then((response) => setDeciplineList(response));
      });
  }, []);

  const submitPlanReview = () => {
    const payload = createRequestData(
      {
        reviewer,
        discipline,
        status,
        jobcycleID: sampleID,
        hours,
        completionStatus: completed,
      },
      "POST"
    );
    fetch("/api/Kid/", payload)
      .then((response) => response.json())
      .then(() => fetchSampleData());
  };

  // const TableHeader = () => (
  //   <TableHead>
  //     <TableRow>
  //       <StyledTableCell align="center">Id</StyledTableCell>
  //       <StyledTableCell align="center">Reviewer</StyledTableCell>
  //       <StyledTableCell align="center">Dicipline</StyledTableCell>
  //       <StyledTableCell align="center">Status</StyledTableCell>
  //       <StyledTableCell align="center">Actions</StyledTableCell>
  //     </TableRow>
  //   </TableHead>
  // );

  return (
    // <TableRow>
    //   <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
    //     <Table size="small" aria-label="purchases">
    //       {showHeader && <TableHeader />}
    //       <TableBody>
    <StyledTableRow>
      <StyledTableCell>
        <Select
          className="w-100"
          value={reviewer}
          onBlur={(e) => setReviewer(e.target.value)}
        >
          {reviewers.map(({ id, name: value }) => (
            <MenuItem value={id}>{value}</MenuItem>
          ))}
        </Select>
      </StyledTableCell>
      <StyledTableCell>
        <Select
          className="w-100"
          value={reviewer}
          onBlur={(e) => setDiscipline(e.target.value)}
        >
          {deciplineList.map(({ id, name: value }) => (
            <MenuItem value={id}>{value}</MenuItem>
          ))}
        </Select>
      </StyledTableCell>
      <StyledTableCell>
        <Select
          className="w-100"
          value={status}
          onBlur={(e) => setStatus(e.target.value)}
        >
          {statuses.map(({ id, name: value }) => (
            <MenuItem value={id}>{value}</MenuItem>
          ))}
        </Select>
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          className="w-100"
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <Checkbox
          color="default"
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(!completed)}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <Button onClick={submitPlanReview}>Save</Button>
      </StyledTableCell>
    </StyledTableRow>
    //       </TableBody>
    //     </Table>
    //   </StyledTableCell>
    // </TableRow>
  );
};

export default PlanReviewInlineCreate;
