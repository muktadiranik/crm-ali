import { useState, useEffect } from "react";
import { Input } from "@mui/material";
import Button from "@mui/material/Button";
import "./SampleModal.css";

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

const KidModal = ({
  isOpen,
  setIsOpen,
  data,
  setData,
  tableData,
  setTableData,
  setNeedsRefresh,
  needsRefresh,
  currentSampleId,
  setCurrentSampleId,
}) => {
  const [id, setId] = useState();
  // const [DisciplinesList, setDisciplinesList] = useState("def");
  const [ReviewersList, setReviewersList] = useState([]);
  const [ReviewStatusList, setReviewStatusList] = useState([]);
  const [reviewer, setReviewer] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [reviewstatus, setReviewStatus] = useState(false);
  // const [kidOptions, setKidOptions] = useState([]);

  useEffect(() => {
    async function fetchReviewerList() {
      const res = await fetch("/api/ReviewersList/").then((res) => res.json());
      setReviewersList(res);
    }

    fetchReviewerList();
    async function fetchReviewStatusList() {
      const res = await fetch("/api/jobStatusList/").then((res) => res.json());
      setReviewStatusList(res);
    }

    fetchReviewStatusList();
    // async function fetchDisciplinesList(){
    //     const res = await fetch("http://127.0.0.1:8000/api/DisciplinesList/").then(res=>res.json());
    //     setDisciplinesList(res);
    // }

    // fetchDisciplinesList();
  }, []);

  useEffect(() => {
    if (data?.id) setId(data.id);
    if (data?.discipline) setDiscipline(data.discipline);
    if (data?.status) setReviewStatus(data.status);
    if (data?.reviewer) setReviewer(data.reviewer);
    // if(data?.name3) setName3(data.name3)
    // if(data?.name4) setName4(data.name4)
    // if(data?.reviewstatus) setReviewStatus(data.status);
    // if(data?.id) console.log("This had data")
  }, [data]);

  const handleSubmit = async () => {
    if (data) {
      const putData = {
        id,
        discipline,
        status: reviewstatus,
        reviewer,
        jobcycleID: currentSampleId,
      };
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },

        body: JSON.stringify(putData),
      };
      const response = await fetch(`/api/Kid/${id}`, requestOptions).then(
        (response) => response.json()
      );
      console.log("85", response);
      const result = tableData.map((each) => {
        if (each.id === currentSampleId) {
          each.Plan_reviews = each.Plan_reviews.filter(
            (x) => x.id !== response.id
          );
          each.Plan_reviews.push(response);
        }
        return each;
      });
      console.log("93", result);
      setTableData(result);
      setData();
      setIsOpen(false);
      clearForm();
      setNeedsRefresh(needsRefresh + 1);
      return null;
    }
    const postData = {
      discipline,
      status: reviewstatus,
      reviewer,
      jobcycleID: currentSampleId,
    };
    console.log("Submitting", postData);
    const response = await fetch("/api/Kid/", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "X-CSRFToken": csrftoken,
      },
    }).then((res) => res.json());
    console.log("response kid 114", response);
    console.log("117", tableData);
    const result = tableData.map((each) => {
      if (each.id === currentSampleId) {
        each.Plan_reviews.push(response);
      }
      return each;
    });
    console.log("126", result);
    setTableData(result);
    setData(undefined);
    clearForm();
    setCurrentSampleId(0);
    setIsOpen(false);
    // console.log("needs refresh",needsRefresh);
    // setNeedsRefresh(needsRefresh + 1);
  };

  const clearForm = () => {
    setId();
    setReviewStatus("");
    setReviewer("");
    setReviewersList([]);
    setDiscipline("");
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
          {data ? <h2>Edit Plan review</h2> : <h2>Add A Plan review</h2>}
          {/* { data? <span style={{marginRight:"10px"}}>
                    <label>ID  </label>
                    <input type="number" value={id} onChange={(e)=>{setId(e.target.value)}}/>
                </span>:""} */}
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <span style={{ marginRight: "10px" }}>
            <label>Reviewer</label>
            <div className="selectWrapper">
              <select
                name="reviewersList"
                id="reviewersList"
                className="selectBox"
                onChange={(e) => {
                  setReviewer(e.target.value);
                }}
              >
                <option value=""> Select a reviewer</option>
                {ReviewersList?.map((each) => {
                  return (
                    <option key={each.id} value={each.id}>
                      {each.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </span>
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <span style={{ marginRight: "10px" }}>
            <label>Discipline </label>
            <div className="selectWrapper">
              <Input
                type="text"
                name="DisciplinesList"
                id="DisciplinesList"
                className="selectBox"
                onChange={(e) => {
                  setDiscipline(e.target.value);
                }}
              />

              {/* <select name="DisciplinesList" id="DisciplinesList" className="selectBox"
        
                        onChange = {(e)=>{
                            setDiscipline(e.target.value)
                        }}
                    >
                        <option value="def" disabled hidden> Select a Discipline</option>
                        {disciplinesList?.map(each=>{
                            return (
                                <option key={each.id} value={each.id}>{each.name}</option>
                            )
                        })}
                    </select> */}
            </div>
          </span>
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <span style={{ marginRight: "10px" }}>
            <label>Status </label>
            <div className="selectWrapper">
              <select
                name="reviewStatusList"
                id="reviewStatusList"
                className="selectBox"
                onChange={(e) => {
                  setReviewStatus(e.target.value);
                }}
              >
                <option value=""> Select a Status</option>
                {ReviewStatusList?.map((each) => {
                  return (
                    <option key={each.id} value={each.id}>
                      {each.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </span>

          {/* <span style={{marginRight:"10px"}}>
                    <label>Options  </label>
                    <select name="Options" id="options" style={{width:"10rem"}}
                        value={options}
                        onChange = {(e)=>{
                            setOptions(e.target.value)
                        }}
                    >
                        <option value="def" disabled hidden> Select a Option</option>
                        <option value="Option1">Option1</option>
                        <option value="Option2">Option2</option>
                        <option value="Option3">Option3</option>
                        <option value="Option4">Option4</option>
                    </select>
                </span> */}
          <br />
          <div style={{ marginTop: "1rem" }}>
            <Button variant="contained" onClick={handleSubmit}>
              {data ? "Edit" : "Add"}
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              variant="contained"
              onClick={() => {
                clearForm();
                setCurrentSampleId();
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

export default KidModal;
export { getCookie };
