import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Alert } from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useAuth } from "../services/auth.context";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Copyright from "../components/Copyright";

export default function Login() {
  const {
    login,
    clearSuccess,
    clearError,
    error,
    getMyinfo,
    getNormalCompany,
    getCoreCompany,
    getBanks,
    getBills,
    getTransactions,
    getMyTransactions,
    getMyFromBills,
    getMyToBills,
  } = useAuth();
  const navigate = useNavigate();

  const [errorOpen, setErrorOpen] = useState(false);
  const handleErrorClose = () => {
    setErrorOpen(false);
    clearError();
    clearSuccess();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      await login(data.get("addr"));
      await getMyinfo();
      await getNormalCompany();
      await getCoreCompany();
      await getBanks();
      await getTransactions();
      await getMyTransactions();
      await getMyFromBills();
      await getMyToBills();
      await getBills();
      navigate("/dashboard");
    } catch (err) {}
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[200]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              mx: 4,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h4">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2, width: "60%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="addr"
                label="Account Address"
                name="addr"
                autoFocus
              />

              {error && !errorOpen ? (
                <Alert
                  variant="filled"
                  severity="error"
                  sx={{ mt: 2 }}
                  onClose={handleErrorClose}
                >
                  {error}
                </Alert>
              ) : (
                <></>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>

              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});
