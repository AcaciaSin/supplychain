import * as React from "react";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../Title";
import ToBills from "./ToBills";
import FromBills from "./FromBills";
import { useAuth } from "../../services/auth.context";

export default function Bills() {
  const { bills } = useAuth();

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

  const mapTimeStamp = (timeStamp) => {
    const d = new Date(timeStamp * 1000);
    return (
      d.getFullYear() +
      "/" +
      (d.getMonth() + 1) +
      "/" +
      d.getDate() +
      " " +
      d.getHours() +
      ":" +
      d.getMinutes()
    );
  };

  return (
    <React.Fragment>
      <Title> 账单信息 </Title>
      <Table size="small" sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <th align="center"> 账单 ID </th>
            <th align="center"> 付款人地址 </th>
            <th align="center"> 收款人地址 </th>
            <th align="center"> 交易额 </th>
            <th align="center"> 创建时间 </th>
            <th align="center"> 结束时间 </th>
            <th align="center"> 备注 </th>
            <th align="center"> 锁定 </th>
            <th align="center"> 状态 </th>
            <th align="center"> 类型 </th>
          </TableRow>
        </TableHead>
        <TableBody>
          {bills.length > 0 &&
            bills.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell align="center"> {row.BillID} </TableCell>
                <TableCell align="center"> {row.From} </TableCell>
                <TableCell align="center"> {row.To} </TableCell>
                <TableCell align="center"> {row.Amount} </TableCell>
                <TableCell align="center"> {mapTimeStamp(row.CreatedDate)} </TableCell>
                <TableCell align="center"> {mapTimeStamp(row.EndDate)} </TableCell>
                <TableCell align="center"> {row.Message} </TableCell>
                <TableCell align="center"> {mapBillLock(row.Lock)} </TableCell>
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
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        sx={{ mt: 2 }}
      >
        <FromBills sx={{ ml: 4 }} />
        <ToBills sx={{ ml: 4 }} />
      </Stack>
    </React.Fragment>
  );
}
