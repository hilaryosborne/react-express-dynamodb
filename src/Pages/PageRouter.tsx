import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "@src/Pages/HomePage";
import OtherPage from "@pages/OtherPage";

const PageRouter = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/other">
        <OtherPage />
      </Route>
    </Switch>
  </Router>
);

export default PageRouter;
