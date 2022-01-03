import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Title from "../Title";
import ProvideCredit from "./ProvideCredit";
import WithdrawCredit from "./WithdrawCredit";
import ProvideFunding from "./ProvideFunding";
import { useAuth } from "../../services/auth.context";

export default function Companies() {
  const {
    currentAddr,
    coreCompanies,
    normalCompanies,
    getCoreCompany,
    getNormalCompany,
  } = useAuth();

  const getCompanies = async (event) => {
    event.preventDefault();

    try {
      await getCoreCompany();
      await getNormalCompany();
    } catch (err) {}
  };

  const mapCompanyType = (companyType) => {
    if (companyType === 1) {
      return "核心企业";
    } else {
      return "普通企业";
    }
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
        <Title> 企业信息 </Title>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          {currentAddr.role === "admin" ? <ProvideFunding /> : <></>}
          {currentAddr.role !== "company" ? <ProvideCredit /> : <></>}
          {currentAddr.role !== "company" ? <WithdrawCredit /> : <></>}
        </Stack>
      </Stack>
      <Table size="small" sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center"> 企业名称 </TableCell>
            <TableCell align="center"> 企业地址 </TableCell>
            <TableCell align="right"> 企业类型 </TableCell>
            <TableCell align="right"> 企业信用 </TableCell>
            <TableCell align="right"> 企业资金 </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coreCompanies.map((coreCompanies, idx) => (
            <TableRow key={idx}>
              <TableCell align="center">{coreCompanies.Name}</TableCell>
              <TableCell align="center">{coreCompanies.Addr}</TableCell>
              <TableCell align="right">
                {mapCompanyType(coreCompanies.CompanyType)}
              </TableCell>
              <TableCell align="right">{coreCompanies.Credit}</TableCell>
              <TableCell align="right">{`$${coreCompanies.Funding}`}</TableCell>
            </TableRow>
          ))}
          {normalCompanies.map((normalCompanies, idx) => (
            <TableRow key={idx}>
              <TableCell align="center">{normalCompanies.Name}</TableCell>
              <TableCell align="center">{normalCompanies.Addr}</TableCell>
              <TableCell align="right">
                {mapCompanyType(normalCompanies.CompanyType)}
              </TableCell>
              <TableCell align="right">{normalCompanies.Credit}</TableCell>
              <TableCell align="right">{`$${normalCompanies.Funding}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link
        color="text.secondary"
        href="#"
        onClick={getCompanies}
        sx={{ mt: 4 }}
      >
        刷新信息
      </Link>
    </React.Fragment>
  );
}
