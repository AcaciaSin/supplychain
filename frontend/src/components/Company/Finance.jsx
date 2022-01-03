import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../../services/auth.context";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function Finance() {
  const { applyFinancial, error, success, clearSuccess, clearError } =
    useAuth();
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [bankAddr, setBankAddr] = useState("");
  const [amount, setAmount] = useState(0);
  const [billID, setBillID] = useState(null);

  const [errorOpen, setErrorOpen] = useState(false);

  const handleErrorClose = () => {
    if (error !== "") {
      return;
    }
    setErrorOpen(false);
    clearError();
    clearSuccess();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBillID = (event) => {
    setBillID(parseFloat(event.target.value));
  };

  const handleMsg = (event) => {
    setMessage(event.target.value);
  };

  const handleAmount = (event) => {
    setAmount(parseFloat(event.target.value));
  };

  const handleAddr = (event) => {
    setBankAddr(event.target.value);
  };

  const handleApply = async (event) => {
    event.preventDefault();
    try {
      await applyFinancial(bankAddr, amount, message, billID);
      setOpen(false);
      setAmount(0);
      setBillID(0);
      setBankAddr("");
      setMessage("");
    } catch (err) {}
  };

  return (
    <div>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={error !== "" && !errorOpen}
          autoHideDuration={2000}
          onClose={handleErrorClose}
        >
          <MuiAlert
            elevation={6}
            onClose={handleErrorClose}
            severity="error"
            sx={{ width: "100%" }}
            variant="filled"
          >
            {error}
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={success !== ""}
          autoHideDuration={2000}
          onClose={handleErrorClose}
        >
          <MuiAlert
            elevation={6}
            onClose={handleErrorClose}
            severity="success"
            sx={{ width: "100%" }}
            variant="filled"
          >
            {success}
          </MuiAlert>
        </Snackbar>
      </Stack>
      <Button variant="outlined" onClick={handleClickOpen}>
        发起融资
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle> 向银行发起融资 </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="addr"
            label="银行地址"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleAddr}
          />

          <TextField
            margin="normal"
            id="name"
            label="融资金额"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleAmount}
          />

          <TextField
            margin="normal"
            id="msg"
            label="备注信息"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleMsg}
          />

          <TextField
            margin="normal"
            id="billID"
            label="账单ID"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleBillID}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}> 取消 </Button>
          <Button onClick={handleApply}> 申请 </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
