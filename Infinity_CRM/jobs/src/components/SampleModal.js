import "./SampleModal.css";
import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from "date-fns";
import TextField from "@mui/material/TextField";
import { Input } from "@mui/material";
function dateFormatter(d) {
  return (
    d.getFullYear() +
    "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + d.getDate()).slice(-2)
  );
}
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

const jobID = document.getElementById("jobid").value;

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

var date = new Date();

const SampleModal = ({
  isOpen,
  setIsOpen,
  data,
  setData,
  tableData,
  setTableData,
  setNeedsRefresh,
  needsRefresh,
}) => {
  const [id, setId] = useState();
  const [jobStatus, setJobStatus] = useState("");
  const [jobCycle, setJobCycle] = useState("");
  const [feeType, setFeeType] = useState("");
  const [dateReceived, setDateReceived] = useState(date);
  const [dueDate, setDueDate] = useState();
  const [dateOut, setDateOut] = useState();
  const [fee, setFee] = useState();
  const [taskCode, setTaskCode] = useState();
  const [billingStatus, setBillingStatus] = useState(false);
  const [completionStatus, setComplete] = useState(false);
  const [jobStatusList, setJobStatusList] = useState([]);
  const [jobCycleList, setJobCycleList] = useState([]);
  // const [deciplineList, setDeciplineList] = useState([]);
  const [feeTypeList, setFeeTypeList] = useState([]);
  const [jobValuation, setJobValuation] = useState(0);

  useEffect(() => {
    async function fetch_job_status_list() {
      const res = await fetch("/api/jobStatusList/").then((res) => res.json());
      setJobStatusList(res);
    }

    fetch_job_status_list();
    async function fetch_job_cycle_list() {
      const res = await fetch("/api/jobCycleList/").then((res) => res.json());
      setJobCycleList(res);
    }

    fetch_job_cycle_list();
    async function fetch_fee_type() {
      const res = await fetch("/api/feeTypeList/").then((res) => res.json());
      setFeeTypeList(res);
    }

    fetch_fee_type();
    // async function fetch_diciplien() {
    //   const res = await fetch("/api/DisciplinesList/").then((res) =>
    //     res.json()
    //   );
    //   setDeciplineList(res);
    // }

    // fetch_diciplien();
  }, []);

  useEffect(() => {
    if (data?.id) setId(data.id);
    if (data?.status) setJobStatus(data.status);
    if (data?.type) setJobCycle(data.type);
    if (data?.dateReceived) setDateReceived(parseISO(data.dateReceived));
    if (data?.dueDate) setDueDate(parseISO(data.dueDate));
    if (data?.dateOut) setDateOut(parseISO(data.dateOut));
    if (data?.fee) setFee(parseISO(data.fee));
    if (data?.feeType) setFeeType(data.feeType);
    if (data?.taskCode) setTaskCode(data.taskCode);
    if (data?.jobValuation) setJobValuation(data.jobValuation);
    if (data?.billingStatus) setBillingStatus(data.billingStatus);
    if (data?.completionStatus) setComplete(data.completionStatus);
  }, [data]);

  // useEffect(()=>{
  //     console.log("data",{id,options,dateReceived,dueDate,dateOut,feeType,billingStatus})
  // },[id,billingStatus,dateReceived,dueDate,dateOut,feeType,options])

  const handleSubmit = async () => {
    console.log("submitted data", data);

    if (data) {
      const putData = {
        id,
        billingStatus,
        // completionStatus,
        dateReceived: dateFormatter(dateReceived),
        // evaluation,
        jobID,
        status: jobStatus,
        // taskCode,
        // type,
        dueDate: dateFormatter(dueDate),
        dateOut: dateFormatter(dateOut),
        feeType,
        fee,
        taskCode,
        jobValuation,
        completionStatus,
      };
      console.log("putData", putData);
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(putData),
      };
      const res = await fetch(`/api/JobCycle/${id}`, requestOptions).then(
        (response) => response.json()
      );

      const result = tableData.map((each) => {
        if (each.id === res.id) {
          each.billingStatus = res.billingStatus;
          each.completionStatus = res.completionStatus;
          each.options = res.options;
          each.dateReceived = parseISO(res.dateReceived);
          each.dueDate = parseISO(res.dueDate);
          each.dateOut = parseISO(res.dateOut);
          each.feeType = res.feeType;
          each.fee = res.fee;
          each.taskCode = res.taskCode;
          each.jobValuation = res.jobValuation;
        }
        return each;
      });
      console.log("changed sample0", tableData);
      console.log("changed sample1", res);
      console.log("changed sample2", result);
      setTableData(result);
      setData();
      // console.log(tableData);

      setIsOpen(false);
      clearForm();
      setNeedsRefresh(needsRefresh + 1);

      return null;
    }

    console.log("jobcycle", jobCycle);
    const postData = {
      jobID,
      billingStatus,
      dateReceived: dateFormatter(dateReceived),
      dateOut: dateFormatter(dateOut),
      dueDate: dateFormatter(dueDate),
      feeType,
      fee,
      taskCode,
      jobValuation,
      completionStatus,
      type: jobCycle,
      status: jobStatus,

      planreview: [],
    };
    for (const item of Object.entries(postData)) {
      if (item[1] == "def") {
        if (item[0] != "planreview") console.log("item", item);
        alert("complete the form");
        return;
      }
    }
    console.log("Submitting", postData);
    const response = await fetch("/api/Sample/", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "X-CSRFToken": csrftoken,
      },
    }).then((res) => res.json());
    // headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //     'X-CSRFToken': csrftoken
    //   },
    console.log("response sample 190", response);
    setTableData((prevState) => [...prevState, response]);
    clearForm();
    setData();
    setNeedsRefresh(needsRefresh + 1);
    setIsOpen(false);
  };

  const clearForm = () => {
    setId();
    setJobStatus("");
    setDateReceived("");
    setJobCycle("");
    setFeeType("");
    setDueDate("");
    setDateOut("");
    setFee("");
    setTaskCode("");
    setJobValuation("");
    setBillingStatus(false);
    setComplete(false);
  };

  return (
    <div
      id="myModal"
      style={{
        display: isOpen ? "block" : "none",
        position: "fixed",
        zIndex: 10,
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "rgb(0, 0, 0)",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div className="form-box">
        <div className="modal-content">
          {/* {data ? <h2>Edit Cycle</h2> : <h2>Add A New Cycle</h2>} */}

          {/* <label>ID </label>
              <TextField
          type="number"
          defaultValue={id}
          onChange={(e) => {
            setId(e.target.value);
          }}
        /> */}

          <label>Job Cycle</label>
          <div className="selectWrapper">
            <select
              name="jobCycleList"
              id="jobCycleList"
              className="selectBox"
              onChange={(e) => {
                setJobCycle(e.target.value);
              }}
            >
              <option value=""> Please Select</option>
              {jobCycleList?.map((each) => {
                if (jobCycle == each.id) {
                  return (
                    <option key={each.id} value={each.id} selected>
                      {" "}
                      {each.name}
                    </option>
                  );
                } else {
                  return (
                    <option key={each.id} value={each.id}>
                      {" "}
                      {each.name}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <label>Job Status</label>
          <select
            value={jobStatus}
            id="jobStatusList"
            className="selectBox"
            onChange={(e) => {
              console.log(e.target.value), setJobStatus(e.target.value);
            }}
          >
            <option value="">Please Select</option>
            {jobStatusList?.map((each) => {
              if (jobStatus == each.id) {
                return (
                  <option key={each.id} value={each.id} selected>
                    {" "}
                    {each.name}
                  </option>
                );
              } else {
                return (
                  <option key={each.id} value={each.id}>
                    {" "}
                    {each.name}
                  </option>
                );
              }
            })}
          </select>
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              value={jobStatus}
              labelId="demo-simple-select-label"
              id="jobStatusList"
              className="selectBox"
              onChange={(e) => {
                console.log(e.target.value), setJobStatus(e.target.value);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {jobStatusList?.map((each) => {
                return <MenuItem key={each.id} value={each.id}> {each.name}</MenuItem>;
              })}
            </Select>
        </FormControl> */}
          <label>Date Received</label>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={dateReceived}
            onChange={(date) => {
              setDateReceived(date);
            }}
          />
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <label>Date Due</label>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={dueDate}
            onChange={(date) => {
              setDueDate(date);
            }}
          />
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <label>Date Out</label>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={dateOut}
            onChange={(date) => {
              setDateOut(date);
            }}
          />
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <label>Fee Type</label>
          {/* <Multiselect
                        options={feeTypeList} // Options to display in the dropdown
                       
                        onSelect={(e) => {
                            setFeeType(e);
                        }}
                        onRemove={(e) => {
                            setFeeType(e);
                        }}
                        displayValue="name"
                    /> */}
          <div className="selectWrapper">
            <select
              name="feeTypeList"
              id="feeTypeList"
              className="selectBox"
              onChange={(e) => {
                setFeeType(e.target.value);
              }}
            >
              <option value=""> Please Select</option>
              {feeTypeList?.map((each) => {
                if (feeType == each.id) {
                  return (
                    <option key={each.id} value={each.id} selected>
                      {" "}
                      {each.name}
                    </option>
                  );
                } else {
                  return (
                    <option key={each.id} value={each.id}>
                      {" "}
                      {each.name}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <label>BPR Fee </label>
          <Input
            type="text"
            name="fee"
            id="fee"
            onChange={(e) => {
              setFee(e.target.value);
            }}
          />
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <label>Task Code</label>
          <Input
            type="text"
            name="taskCode"
            id="taskCode"
            onChange={(e) => {
              setTaskCode(e.target.value);
            }}
          />
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <label>Job Valuation</label>
          <Input
            type="text"
            name="jobValuation"
            id="jobValuation"
            onChange={(e) => {
              setJobValuation(e.target.value);
            }}
          />
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <label>Billed</label>
          <input
            type="checkbox"
            value={billingStatus ? "Yes" : "No"}
            onChange={(e) => {
              setBillingStatus(e.target.value);
            }}
          />
          <br />
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <label>Completed</label>
          <input
            type="checkbox"
            value={completionStatus ? "Yes" : "No"}
            onChange={(e) => {
              setComplete(e.target.value);
            }}
          />
          <br />
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <div style={{ marginTop: "1rem" }}>
            <Button
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
            >
              {data ? "Save" : "Add"}
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              variant="contained"
              onClick={() => {
                clearForm();
                setData();
                setIsOpen(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleModal;
