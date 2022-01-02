import * as React from "react";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../Title";
import ProvideCredit from "./ProvideCredit";
import WithdrawCredit from "./WithdrawCredit";
import ProvideFunding from "./ProvideFunding";
import { useAuth } from "../../services/auth.context";

export default function Banks() {
  const { currentAddr, banks, getBanks } = useAuth();

  const getBank = async (event) => {
    event.preventDefault();
    try {
      await getBanks();
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mt: 2 }}
      >
        <Title> 银行信息 </Title>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          {currentAddr.role === "admin" ? <ProvideFunding /> : <></>}
          {currentAddr.role === "admin" ? <ProvideCredit /> : <></>}
          {currentAddr.role === "admin" ? <WithdrawCredit /> : <></>}
        </Stack>
      </Stack>
      <Table size="small" sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center"> 银行名称 </TableCell>
            <TableCell align="center"> 银行地址 </TableCell>
            <TableCell align="right"> 银行信用 </TableCell>
            <TableCell align="right"> 银行资金 </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {banks.map((banks, idx) => (
            <TableRow key={idx}>
              <TableCell align="center">{banks.Name}</TableCell>
              <TableCell align="center">{banks.Addr}</TableCell>
              <TableCell align="right">{banks.Credit}</TableCell>
              <TableCell align="right">{`$${banks.Funding}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="text.secondary" href="#" onClick={getBank} sx={{ mt: 4 }}>
        刷新信息
      </Link>
    </React.Fragment>
  );
}
