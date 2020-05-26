import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./components/home";
import Client from "./components/client/client";
import ClientForm from "./components/client/form";
import ViewRequest from "./components/client/view-request";
import Firm from "./components/firm/firm";

export default () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/client/:id/view-request">
        <ViewRequest />
      </Route>
      <Route exact path="/client/:id">
        <ClientForm />
      </Route>
      <Route exact path="/client">
        <Client />
      </Route>
      <Route exact path="/firm">
        <Firm />
      </Route>
    </Switch>
  </Router>
);
