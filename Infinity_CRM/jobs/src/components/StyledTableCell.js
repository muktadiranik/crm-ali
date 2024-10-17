import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1A3F71",
    color: theme.palette.common.white,
    padding: 12,
    align: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    // fontSize: 14,
    align: "center",
    padding: 1,
  },
}));

export default StyledTableCell;
