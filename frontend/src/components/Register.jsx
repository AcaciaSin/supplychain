import * as React from "react";
import { useState } from "react";
import { FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../services/auth.context";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function Register() {
  const {
    currentAddr,
    register,
    error,
    success,
    clearSuccess,
    clearError,
    // refreshState,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [companyType, setCompanyType] = useState(0);
  const [role, setRole] = useState("company");
  const [addr, setAddr] = useState("");
  const [name, setName] = useState("");
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

  const handleType = (event) => {
    setCompanyType(event.target.value);
  };

  const handleRole = (event) => {
    setRole(event.target.value);
  };

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleAddr = (event) => {
    setAddr(event.target.value);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      await register(addr, role, name, companyType);
      setOpen(false);
      setName("");
      setAddr("");
      setRole("company");
      setCompanyType(0);
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
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        disabled={currentAddr.role === "company"}
      >
        注册银行或企业
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle> 注册银行或企业 </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 4 }}>
            <InputLabel id="company-Role-select-label"> 账户角色 </InputLabel>
            <Select
              autoFocus
              labelId="company-Role-select-label"
              id="company-Role-select"
              value={role}
              label="CompanyRole"
              onChange={handleRole}
            >
              <MenuItem value={"company"}> 企业 </MenuItem>
              <MenuItem disabled={currentAddr.role === "bank"} value={"bank"}>
                银行
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 4 }} disabled={role === "bank"}>
            <InputLabel id="company-type-select-label"> 企业类型 </InputLabel>
            <Select
              labelId="company-type-select-label"
              id="company-type-select"
              value={companyType}
              label="CompanyType"
              onChange={handleType}
            >
              <MenuItem value={0}>普通企业</MenuItem>
              <MenuItem value={1}>核心企业</MenuItem>
            </Select>
          </FormControl>

          <TextField
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
            label="账户名称"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleName}
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
