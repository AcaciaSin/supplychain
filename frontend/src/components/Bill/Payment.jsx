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

export default function Payment() {
  const {
    repay,
    // refreshState,
    error,
    success,
    clearSuccess,
    clearError,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePayment = (event) => {
    setAmount(event.target.value);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
    clearError();
    clearSuccess();
  };

  const handleProvider = async (event) => {
    event.preventDefault();
    try {
      await repay(parseFloat(amount));
      setOpen(false);
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
      <Button onClick={handleClickOpen}> 还款 </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle> 还款 </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="addr"
            label="账单 ID"
            type="text"
            fullWidth
            variant="standard"
            onChange={handlePayment}
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
