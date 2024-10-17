import Collapse from "@material-ui/core/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button } from "@material-ui/core";
import StyledTableCell from "./StyledTableCell";
import StyledTableRow from "./StyledTableRow";
import {
  ViewEditWidget,
  WidgetEnum,
  SelectEndpointsEnum,
  PlanReviewInlineCreate,
} from "./ViewEditWidget";

const PlanReviewTable = ({
  row,
  handleKidDelete,
  fetchSampleData,
  open,
  createReviewPlan,
  currentSampleId,
}) => {
  const apiURL = (id) => `/api/Kid/${id}`;

  return (
    <>
      <TableRow>
        <StyledTableCell
          align="center"
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          colSpan={7}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    align="center"
                    colSpan={6}
                    style={{ borderBottom: 0, fontSize: 20, paddingBottom: 0 }}
                  >
                    Plan Reviews
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Reviewer</StyledTableCell>
                  <StyledTableCell align="center">Discipline</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Hours</StyledTableCell>
                  <StyledTableCell align="center">Completed</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row?.Plan_reviews?.map((historyRow) => (
                  <StyledTableRow key={historyRow.id}>
                    <StyledTableCell align="center">
                      <ViewEditWidget
                        widget={WidgetEnum.select}
                        fieldName={"reviewer"}
                        value={historyRow.reviewer}
                        apiURL={apiURL(historyRow.id)}
                        optionsURL={SelectEndpointsEnum.reviewers}
                        fetchSampleData={fetchSampleData}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <ViewEditWidget
                        widget={WidgetEnum.select}
                        fieldName={"discipline"}
                        value={historyRow.discipline}
                        apiURL={apiURL(historyRow.id)}
                        optionsURL={SelectEndpointsEnum.diciplines}
                        fetchSampleData={fetchSampleData}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <ViewEditWidget
                        widget={WidgetEnum.select}
                        fieldName={"status"}
                        value={historyRow.status}
                        apiURL={apiURL(historyRow.id)}
                        optionsURL={SelectEndpointsEnum.jobCycleStatus}
                        fetchSampleData={fetchSampleData}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <ViewEditWidget
                        widget={WidgetEnum.number}
                        fieldName={"hours"}
                        value={historyRow.hours}
                        apiURL={apiURL(historyRow.id)}
                        fetchSampleData={fetchSampleData}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <ViewEditWidget
                        widget={WidgetEnum.checkbox}
                        fieldName={"completionStatus"}
                        value={historyRow.completionStatus}
                        labelValue={
                          historyRow.completionStatus ? "Done" : "Pending"
                        }
                        apiURL={apiURL(historyRow.id)}
                        fetchSampleData={fetchSampleData}
                        editMode={true}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button>
                        <DeleteIcon
                          onClick={() => {
                            handleKidDelete(historyRow.id);
                          }}
                        />
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {createReviewPlan && (
                  <PlanReviewInlineCreate
                    showHeader={row.Plan_reviews.length <= 0}
                    fetchSampleData={fetchSampleData}
                    sampleID={currentSampleId}
                  />
                )}
              </TableBody>
            </Table>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};

export default PlanReviewTable;
