import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import Routers from "./routes";
const muiTheme = createMuiTheme({
  typography: {
    suppressWarning: true
  }
});
class App extends Component {
  render() {
    const styles = {
      root: {
        maxWidth: 1100,
        margin: "auto"
      }
    };
    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className="App" style={styles.root}>
          <Router>
            <div>
              <Header />
              <Routers />
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
