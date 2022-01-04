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
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";

export default function ConfirmFunding() {
  const {
    // refreshState,
    confirmFunding,
    error,
    success,
    clearSuccess,
    clearError,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [txID, setTXID] = useState(0);
  const [accepted, setAccepted] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePayment = (event) => {
    setTXID(event.target.value);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
    clearError();
    clearSuccess();
  };

  const handleAccpeted = (event) => {
    setAccepted(event.target.checked);
  };

  const handleProvider = async (event) => {
    event.preventDefault();
    try {
      await confirmFunding(parseFloat(txID), accepted);
      setOpen(false);
      setTXID(0);
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
      <Button onClick={handleClickOpen}> 融资 </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle> 确认融资 </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="addr"
            label="交易 ID"
            type="text"
            fullWidth
            variant="standard"
            onChange={handlePayment}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Typography component="p" variant="h10">
              是否融资
            </Typography>
            <Switch defaultChecked onChange={handleAccpeted} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}> 取消 </Button>
          <Button onClick={handleProvider}> 确认 </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
