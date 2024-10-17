import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";

const StyledTableRowMain = styled(TableRow)(({ theme }) => ({
  "&": {
    backgroundColor: "#7393B3",
  },
  "&:last-child td, &:last-child th": {
    // border: 0,
  },
}));

export default StyledTableRowMain;
