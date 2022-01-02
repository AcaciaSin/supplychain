import * as React from "react";
import Register from "./Register";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import ApplyBills from "./Bill/ApplyBills";
import { useAuth } from "../services/auth.context";
import Stack from "@mui/material/Stack";
import Finance from "./Company/Finance";

export default function Infomation() {
  const { currentAddr } = useAuth();
  return (
    <React.Fragment>
      <Title> Infomation 我的信息 </Title>
      <Typography component="p" variant="h6" sx={{ mt: 2 }}>
        Role 角色
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {currentAddr.role}
      </Typography>
      <Typography component="p" variant="h6">
        Address 地址
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {currentAddr.addr}
      </Typography>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        sx={{ mt: 2 }}
      >
        {currentAddr.role !== "company" ? <Register /> : <Finance />}
        {currentAddr.role !== "company" ? <></> : <ApplyBills />}
      </Stack>
    </React.Fragment>
  );
}
