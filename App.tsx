import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Routes from "./Routes";
import SideMenu from "./components/layout/SideMenu";
import AppBar from "./components/layout/AppBar";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar />
        <div style={{ display: "flex" }}>
          <SideMenu />
          <div style={{ marginLeft: 250, marginTop: 64, padding: 20, width: "100%" }}>
            <Routes />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
