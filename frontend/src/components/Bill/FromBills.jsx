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
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import { useAuth } from "../../services/auth.context";

import Payment from "./Payment";

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

export default function MyFromBills() {
  const { fromBills } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const mapBillState = (billState) => {
    if (billState === 0) {
      return "账单未还";
    } else {
      return "账单已还";
    }
  };

  const mapBillLock = (billLock) => {
    if (billLock === 0) {
      return "未锁定";
    } else {
      return "已锁定";
    }
  };

  const mapBillType = (billType) => {
    if (billType === 0) {
      return "普通账单";
    } else {
      return "核心企业账单";
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        作为支付方账单
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
          查看当前账户作为支付方的账单
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"> 账单 ID </TableCell>
                  <TableCell align="center"> 付款人地址 </TableCell>
                  <TableCell align="center"> 收款人地址 </TableCell>
                  <TableCell align="center"> 账单金额 </TableCell>
                  <TableCell align="center"> 备注 </TableCell>
                  <TableCell align="center"> 创建时间 </TableCell>
                  <TableCell align="center"> 结束时间 </TableCell>
                  <TableCell align="center"> 锁定 </TableCell>
                  <TableCell align="center"> 账单类型 </TableCell>
                  <TableCell align="center"> 账单状态 </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fromBills &&
                  fromBills.map((row, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center">{row.BillID}</TableCell>
                      <TableCell align="center">{row.From}</TableCell>
                      <TableCell align="center">{row.To}</TableCell>
                      <TableCell align="center">{row.Amount}</TableCell>
                      <TableCell align="center">{row.Message}</TableCell>
                      <TableCell align="center">{row.CreatedDate}</TableCell>
                      <TableCell align="center">{row.EndDate}</TableCell>
                      <TableCell align="center">
                        {mapBillLock(row.Lock)}
                      </TableCell>
                      <TableCell align="center">
                        {mapBillState(row.BillState)}
                      </TableCell>
                      <TableCell align="center">
                        {mapBillType(row.BillType)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mt: 2, ml: 2 }}
        >
          <Payment />
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              确认
            </Button>
          </DialogActions>
        </Stack>
      </BootstrapDialog>
    </div>
  );
}
