import * as React from "react";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../Title";
import MyTransactions from "./MyTransactions";
import { useAuth } from "../../services/auth.context";

export default function Transactions() {
  const { txns } = useAuth();

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
    <React.Fragment>
      <Title> 交易信息 </Title>
      <Table size="small" sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <th align="center"> 交易 ID </th>
            {/* <th align="center"> 账单 ID </th> */}
            <th align="center"> 类型 </th>
            <th align="center"> 状态 </th>
            <th align="center"> 付款人地址 </th>
            <th align="center"> 收款人地址 </th>
            <th align="center"> 交易额 </th>
            <th align="center"> 备注 </th>
          </TableRow>
        </TableHead>
        <TableBody>
          {txns.map((txns, idx) => (
            <TableRow key={idx}>
              <TableCell align="center">{txns.TxID}</TableCell>
              {/* <TableCell align="center">{txns.BillID}</TableCell> */}
              <TableCell align="center">{mapTxType(txns.TxType)}</TableCell>
              <TableCell align="center">{mapTxState(txns.TxState)}</TableCell>
              <TableCell align="center">{txns.From}</TableCell>
              <TableCell align="center">{txns.To}</TableCell>
              <TableCell align="center">{txns.Amount}</TableCell>
              <TableCell align="center">{txns.Message}</TableCell>
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
        <MyTransactions sx={{ mt: 4 }} />
      </Stack>
    </React.Fragment>
  );
}
