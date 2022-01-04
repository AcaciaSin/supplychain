import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useAuth } from "../../services/auth.context";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function TransferBill() {
  const {
    transferBill,
    // refreshState,
    error,
    success,
    clearSuccess,
    clearError,
  } = useAuth();
  const [open, setOpen] = useState(false);

  const [toAddr, setToAddr] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [billID, setBillID] = useState(0);
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

  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleAmount = (event) => {
    setAmount(parseFloat(event.target.value));
  };

  const handleAddr = (event) => {
    setToAddr(event.target.value);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      await transferBill(toAddr, amount, message, billID);
      setOpen(false);
      setToAddr("");
      setBillID(0);
      setMessage("");
      setAmount(0);
      // await refreshState();
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
      <Button onClick={handleClickOpen}> 转让账单 </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle> 将我的账单转让给 </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="toAddr"
            label="账户地址"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleAddr}
          />

          <TextField
            margin="normal"
            id="amount"
            label="转让金额"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleAmount}
          />

          <TextField
            margin="normal"
            id="name"
            label="备注"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleMessage}
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
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleRegister}>添加</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
