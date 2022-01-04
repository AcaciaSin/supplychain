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

export default function ProvideCredit() {
  const {
    provideCredit,
    // refreshState,
    error,
    success,
    clearSuccess,
    clearError,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [addr, setAddr] = useState("");
  const [amount, setAmount] = useState(0);
  const handleErrorClose = () => {
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

  const handleAddr = (event) => {
    setAddr(event.target.value);
  };

  const handleAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleProvider = async (event) => {
    event.preventDefault();
    try {
      await provideCredit(addr, parseFloat(amount));
      setOpen(false);
      setAddr("");
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
      <Button variant="outlined" onClick={handleClickOpen}>
        发放信用点
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle> 给企业提供信用点 </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="addr"
            label="账户地址"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleAddr}
          />

          <TextField
            margin="normal"
            id="name"
            label="信用点数"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleAmount}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}> 取消 </Button>
          <Button onClick={handleProvider}> 确认 </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
