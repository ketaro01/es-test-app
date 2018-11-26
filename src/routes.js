import React, { Component } from "react";
import { Redirect, Switch, Route } from "react-router-dom";

const lazyLoader = importComponent =>
  class AsyncComponent extends Component {
    state = { C: null };

    async componentDidMount() {
      const { default: C } = await importComponent();
      this.setState({ C });
    }

    render() {
      const { C } = this.state;
      return C ? <C {...this.props} /> : null;
    }
  };

class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Redirect exact from="/" to="/search" />
          <Route
            name="search"
            path="/search"
            component={lazyLoader(() => import("./page/Search"))}
          />
          <Route
            exact
            name="autoComplete"
            path="/autoComplete"
            component={lazyLoader(() => import("./page/AutoComplete"))}
          />
          <Route
            title="createIndex"
            path="/createIndex"
            component={lazyLoader(() => import("./page/CreateIndex"))}
          />
          <Route
            name="mapping"
            path="/mapping/:indexName"
            component={lazyLoader(() => import("./page/Mapping"))}
          />
          <Route
            name="importData"
            path="/importData"
            component={lazyLoader(() => import("./page/ImportData"))}
          />
        </Switch>
      </div>
    );
  }
}

export default Routes;
