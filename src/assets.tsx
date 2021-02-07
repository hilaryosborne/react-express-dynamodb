import ReactDOM from "react-dom";
import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import PageRouter from "@src/Pages/PageRouter";
import "@static/main.css";

ReactDOM.render(
  <React.Fragment>
    <PageRouter />
  </React.Fragment>,
  document.getElementById("root")
);
