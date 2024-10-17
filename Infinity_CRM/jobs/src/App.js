import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CollapsibleTable from "./components/Tables.jsx";
import "./App.css";

function App() {
  const [isAddSampleVisible, setIsAddSampleVisible] = useState(false);
  useEffect(() => {}, [isAddSampleVisible]);
  const [isOpen, setIsOpen] = useState(false);
  const [sample, SetSample] = useState();
  const [kid, setKid] = useState();
  const [data, setData] = useState([]);
  const [needsRefresh, setNeedsRefresh] = useState(0);
  const [iskidModalOpen, setIsKidModalOpen] = useState(false);
  const [currentSampleId, setCurrentSampleId] = useState(0);
  const jobID = document.getElementById("jobid").value;

  async function fetchSampleData() {
    const res = await fetch("/api/Getusersjobs/" + jobID).then((response) =>
      response.json()
    );
    setData(res);
  }

  useEffect(() => {
    fetchSampleData();
  }, [needsRefresh]);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: '15px'
        }}
      >
        <h1>Submittals</h1>
        <div style={{ marginLeft: "50px" }}>
          <Button
            variant="contained"
            style={{ textAlign: "right" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            Add plan check cycle
          </Button>
        </div>
      </div>
      <CollapsibleTable
        jobID={jobID}
        data={data}
        setData={setData}
        sample={sample}
        setSample={SetSample}
        setIsSampleModalOpen={setIsOpen}
        isSampleModalOpen={isOpen}
        needsRefresh={needsRefresh}
        setNeedsRefresh={setNeedsRefresh}
        setCurrentSampleId={setCurrentSampleId}
        currentSampleId={currentSampleId}
        setIsKidModalOpen={setIsKidModalOpen}
        iskidModalOpen={iskidModalOpen}
        kid={kid}
        setKid={setKid}
        fetchSampleData={fetchSampleData}
      />
    </div>
  );
}

export default App;
