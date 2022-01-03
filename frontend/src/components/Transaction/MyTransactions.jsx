import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import ConfirmFunding from "./ConfirmFunding";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useAuth } from "../../services/auth.context";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function MyTransactions() {
  const { myTxns, currentAddr } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const mapTxState = (txState) => {
    if (txState === 0) {
      return "正在处理";
    } else if (txState === 1) {
      return "已拒绝";
    } else {
      return "已接受";
    }
  };

  const mapTxType = (txType) => {
    if (txType === 0) {
      return "正常交易";
    } else if (txType === 1) {
      return "信用点融资";
    } else {
      return "账单融资";
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        查看与我关联的交易
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={false}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          与我关联的交易
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"> 交易 ID </TableCell>
                  {/* <TableCell align="center"> 账单 ID </TableCell> */}
                  <TableCell align="center"> 交易类型 </TableCell>
                  <TableCell align="center"> 交易状态 </TableCell>
                  <TableCell align="center"> 付款人地址 </TableCell>
                  <TableCell align="center"> 收款人地址 </TableCell>
                  <TableCell align="center"> 交易额 </TableCell>
                  <TableCell align="center"> 备注 </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myTxns &&
                  myTxns.map((row, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center"> {row.TxID} </TableCell>
                      {/* <TableCell align="center"> {row.BillID} </TableCell> */}
                      <TableCell align="center">
                        {mapTxType(row.TxType)}
                      </TableCell>
                      <TableCell align="center">
                        {mapTxState(row.TxState)}
                      </TableCell>
                      <TableCell align="center"> {row.From} </TableCell>
                      <TableCell align="center"> {row.To} </TableCell>
                      <TableCell align="center"> {row.Amount} </TableCell>
                      <TableCell align="center"> {row.Message} </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          {currentAddr.role === "bank" ? (
            <ConfirmFunding sx={{ ml: 4 }} />
          ) : (
            <></>
          )}

          <Button autoFocus onClick={handleClose}>
            确认
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
