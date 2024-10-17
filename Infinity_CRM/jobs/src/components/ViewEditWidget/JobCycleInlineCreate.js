import { useEffect, useState } from "react";
import TableRow from "@mui/material/TableRow";
import { Button, TextField, Checkbox } from "@material-ui/core";
import { Select, MenuItem } from "@material-ui/core";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";

import StyledTableCell from "../StyledTableCell";
import StyledTableRowMain from "../StyledTableRowMain";
import { SelectEndpointsEnum, createRequestData } from "./configs";

const JobCycleInlineCreate = ({
  jobID,
  showHeader,
  fetchSampleData,
  submittalsData,
}) => {
  const [jobCycles, setJobCycles] = useState([]);
  const [jobStatuses, setJobStatuses] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [jobCycle, setJobCycle] = useState();
  const [jobStatus, setJobStatus] = useState();
  const [dateReceived, setDateReceived] = useState();
  const [dateDue, setDateDue] = useState();
  const [dateOut, setDateOut] = useState();
  const [feeType, setFeeType] = useState();
  const [fee, setFee] = useState();
  const [taskCode, setTaskCode] = useState();
  const [jobValuation, setJobValuation] = useState();
  const [billed, setBilled] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [deliveredBy, setDeliveredBy] = useState();

  useEffect(() => {
    let isMounted = true;

    fetch(SelectEndpointsEnum.jobCycles)
      .then((response) => response.json())
      .then((response) => {
        if (isMounted) {
          setJobCycles(response);
        }
      })
      .then(() => {
        fetch(SelectEndpointsEnum.jobStatuses)
          .then((response) => response.json())
          .then((response) => {
            if (isMounted) {
              setJobStatuses(response);
            }
          })
          .then(() => {
            fetch(SelectEndpointsEnum.feeTypes)
              .then((response) => response.json())
              .then((response) => {
                if (isMounted) {
                  setFeeTypes(response);
                }
              });
          })
          .then(() => {
            const submittals = submittalsData[submittalsData.length - 1] || {};
            if (Object.keys(submittals).length > 0) {
              const selectedJC = submittals && +submittals.typeId + 1 + "";
              setTimeout(() => {
                if (isMounted) {
                  setJobCycle(selectedJC);
                }
              }, 1000);
            } else {
              setTimeout(() => {
                if (isMounted) {
                  setJobCycle("1");
                }
              }, 1000);
            }
          });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const submitJobCycle = () => {
    if (!jobCycle || !jobStatus) {
      return;
    }

    const payload = createRequestData(
      {
        type: jobCycle,
        status: jobStatus,
        dateReceived: dateReceived || null,
        dueDate: dateDue || null,
        dateOut: dateOut || null,
        deliveredBy: deliveredBy || '',
        completionStatus: completed || false,
        fee,
        feeType,
        jobID,
        taskCode,
        billingStatus: billed,
        evaluation: jobValuation,
      },
      "POST"
    );

    fetch("/api/Sample/", payload)
      .then((response) => {
        response.json();
        setJobCycle(1);
        setJobStatus(1);
        setDateReceived("");
        setDateDue("");
        setDateOut("");
        setCompleted(false);
        setDeliveredBy("");
      })
      .then(() => fetchSampleData());
  };

  // const TableHeader = () => (
  //   <TableHead>
  //     <TableRow>
  //       <StyledTableCell align="center"></StyledTableCell>
  //       <StyledTableCell align="center">Job Cycle</StyledTableCell>
  //       <StyledTableCell align="center">Job Status</StyledTableCell>
  //       <StyledTableCell align="center">Date Received</StyledTableCell>
  //       <StyledTableCell align="center">Date Due</StyledTableCell>
  //       <StyledTableCell align="center">Date Out</StyledTableCell>
  //       <StyledTableCell align="center">Delivered By</StyledTableCell>
  //       <StyledTableCell align="center">Completed</StyledTableCell>
  //       <StyledTableCell align="center">Actions</StyledTableCell>
  //     </TableRow>
  //   </TableHead>
  // );

  return (
    // <TableContainer component={Paper}>
    //   <Table aria-label="collapsible table">
    //     {showHeader && <TableHeader />}
    //     <TableBody>
    <StyledTableRowMain key={100000000000}>
      <StyledTableCell></StyledTableCell>
      <StyledTableCell align="center">
        <Select
          name="jobCycle"
          value={jobCycle ?? "1"}
          onChange={(e) => setJobCycle(e.target.value)}
          className="w-100"
        >
          {jobCycles.map(({ id, name: value }) => (
            <MenuItem value={id}>{value}</MenuItem>
          ))}
        </Select>
      </StyledTableCell>
      <StyledTableCell align="center">
        <Select
          className="w-100"
          value={jobStatus}
          onChange={(e) => setJobStatus(e.target.value)}
        >
          {jobStatuses.map(({ id, name: value }) => (
            <MenuItem value={id}>{value}</MenuItem>
          ))}
        </Select>
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField
          className="w-100"
          type="date"
          value={dateReceived ?? ""}
          onChange={(e) => setDateReceived(e.target.value)}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField
          className="w-100"
          type="date"
          value={dateDue ?? ""}
          onChange={(e) => setDateDue(e.target.value)}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField
          type="date"
          className="w-100"
          value={dateOut ?? ""}
          onChange={(e) => setDateOut(e.target.value)}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField
          className="w-100"
          type="text"
          value={deliveredBy}
          onChange={(e) => setDeliveredBy(e.target.value)}
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
        <Button onClick={submitJobCycle}>Save</Button>
      </StyledTableCell>
    </StyledTableRowMain>
    //     </TableBody>
    //   </Table>
    // </TableContainer>
  );
};

export default JobCycleInlineCreate;
