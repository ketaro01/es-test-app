import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withRouter, NavLink } from "react-router-dom";
class Header extends Component {
  render() {
    const styles = {
      root: {
        flexGrow: 1
      },
      grow: {
        flex: 1
      },
      menuButton: {
        marginLeft: -12,
        marginRight: 20
      }
    };

    return (
      <div style={styles.root}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <IconButton
              style={styles.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" style={styles.grow}>
              ES TEST
            </Typography>
            <Button
              color="inherit"
              activeStyle={{ fontWeight: "bold", border: "solid 2px #fff" }}
              component={NavLink}
              to="/createIndex"
            >
              Create Index
            </Button>
            <Button
              color="inherit"
              activeStyle={{ fontWeight: "bold", border: "solid 2px #fff" }}
              component={NavLink}
              to="/autoComplete"
            >
              Auto Complete
            </Button>
            <Button
              color="inherit"
              activeStyle={{ fontWeight: "bold", border: "solid 2px #fff" }}
              component={NavLink}
              to="/importData"
            >
              Import Data
            </Button>
            <Button
              color="inherit"
              activeStyle={{ fontWeight: "bold", border: "solid 2px #fff" }}
              component={NavLink}
              to="/search"
            >
              Search
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(Header);
