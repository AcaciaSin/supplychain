import * as React from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { useAuth } from "../services/auth.context";
import Stack from "@mui/material/Stack";

export default function MoreInfomation() {
  const { currentAddr, currentInfo } = useAuth();
  return (
    <React.Fragment>
      <Title> More Infomation 更多信息 </Title>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography component="p" variant="h6" sx={{ mt: 2 }}>
          名称
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1, pt: 1 }}>
          {currentInfo.Name}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography component="p" variant="h6" sx={{ mt: 1 }}>
          资金
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1, pt: 1 }}>
          {currentAddr.role !== "admin" ? currentInfo.Funding : ""}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography component="p" variant="h6" sx={{ mt: 1 }}>
          信用点
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1, pt: 1 }}>
          {currentAddr.role !== "admin" ? currentInfo.Credit : ""}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography component="p" variant="h6" sx={{ mt: 1 }}>
          企业类型
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1, pt: 1 }}>
          {currentAddr.role === "company"
            ? currentInfo.CompanyType === 1
              ? "核心企业"
              : "普通企业"
            : "NULL"}
        </Typography>
      </Stack>
    </React.Fragment>
  );
}
