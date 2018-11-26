import React, { Component } from "react";
import indices from "../api/indices";
import Helmet from "react-helmet";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import BackSpaceIcon from "@material-ui/icons/KeyboardBackspace";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

class Mapping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      indexName: this.props.match.params.indexName,
      mappings: [],
      analyzers: [],
      tableRowCnt: 1,
      name: {},
      type: {},
      analyzer: {},
      search_analyzer: {},
      boost: {}
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSave = this.handleOnSave.bind(this);
    this.loadMapping = this.loadMapping.bind(this);
    this.loadSetting = this.loadSetting.bind(this);
  }
  componentDidMount() {
    this.loadMapping();
    this.loadSetting();
  }

  loadMapping() {
    indices.getMapping(this.state.indexName).then(result => {
      if (result[this.state.indexName].mappings.info) {
        const mappings = Object.keys(
          result[this.state.indexName].mappings.info.properties
        ).map(v => {
          return {
            name: v,
            ...result[this.state.indexName].mappings.info.properties[v]
          };
        });

        this.setState({ mappings });
      }
    });
  }

  loadSetting() {
    indices.getSettings(this.state.indexName).then(result => {
      if (result[this.state.indexName].settings.index) {
        this.setState({
          analyzers: Object.keys(
            result[this.state.indexName].settings.index.analysis.analyzer
          ).map(v => ({
            name: v,
            ...result[this.state.indexName].settings.index.analysis.analyzer[v]
          }))
        });
      }
    });
  }

  handleOnChange = key => e => {
    this.setState({
      [key]: { ...this.state[key], [e.target.name]: e.target.value }
    });
  };

  handleOnSave() {
    const loopRange = new Array(this.state.tableRowCnt).fill("");
    const settingNames = ["type", "analyzer", "search_analyzer", "boost"];

    const values = {};

    const result = loopRange.every((_, i) => {
      const name = this.state.name[`name_${i}`];
      if (!name) return false;

      const obj = {};
      const setValues = settingNames.every(key => {
        if (!this.state[key] || !this.state[key][`${key}_${i}`]) {
          // analyzer, search_analyzer, boost 는 필수항목이 아님.
          if (key.match(/^(name|type)$/)) return false;
        } else {
          const value =
            key === "boost"
              ? parseInt(this.state[key][`${key}_${i}`], 10)
              : this.state[key][`${key}_${i}`];
          obj[key] = value;
        }

        return true;
      });

      if (!setValues) return false;

      values[name] = obj;

      return true;
    });

    if (!result) {
      alert("필수항목을 입력하세요.");
      return;
    }
    console.log(this.state.indexName, "indexName");
    indices
      .putMapping(this.state.indexName, "info", values)
      .then(result => {
        if (
          typeof result !== "undefined" &&
          result !== null &&
          result.acknowledged === true
        ) {
          alert("저장완료");
          this.loadMapping();
        } else {
          alert("에러발생");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <div>
        <Helmet>
          <style>{"body { background-color: #ccc; }"}</style>
        </Helmet>
        <Paper style={{ margin: 10, padding: 10, top: 0 }}>
          <Grid container spacing={24}>
            <Grid
              item
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <IconButton onClick={this.props.history.goBack}>
                <BackSpaceIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <h3>({this.props.match.params.indexName}) 맵핑 등록</h3>
            </Grid>
          </Grid>
        </Paper>
        <Paper style={{ margin: 10, padding: 10 }}>
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            Mapping List
          </Typography>
          {this.state.mappings.length > 0 ? (
            <List
              style={{
                width: "100%",
                backgroundColor: "#eee",
                position: "relative",
                overflow: "auto",
                maxHeight: 300
              }}
              dense
            >
              {this.state.mappings.map((v, i) => (
                <ListItem key={v.name}>
                  <span style={{ width: 20 }}>{i + 1}</span>
                  <ListItemText
                    primary={v.name}
                    secondary={`Type: ${v.type}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="h5" color="inherit" gutterBottom>
              맵핑 정보 없음
            </Typography>
          )}
        </Paper>
        {this.state.mappings.length === 0 ? (
          <Paper style={{ margin: "10px 10px 110px 10px", padding: 10 }}>
            <Table>
              <colgroup>
                <col width="20%" />
                <col width="20%" />
                <col width="25%" />
                <col width="25%" />
                <col width="10%" />
              </colgroup>
              <TableHead>
                <TableRow>
                  <CustomTableCell>name</CustomTableCell>
                  <CustomTableCell>type</CustomTableCell>
                  <CustomTableCell>analyzer</CustomTableCell>
                  <CustomTableCell>search_analyzer</CustomTableCell>
                  <CustomTableCell>boost</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {new Array(this.state.tableRowCnt).fill("").map((_, i) => (
                  <TableRow style={{ height: 48 }} key={i}>
                    <TableCell>
                      <TextField
                        fullWidth
                        placeholder="Name"
                        name={`name_${i}`}
                        onBlur={this.handleOnChange("name")}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        placeholder="Type"
                        name={`type_${i}`}
                        onBlur={this.handleOnChange("type")}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl style={{ width: "100%" }}>
                        <InputLabel htmlFor={`analyzer_${i}`}>
                          Analyzer
                        </InputLabel>
                        <Select
                          inputProps={{
                            name: `analyzer_${i}`,
                            id: `analyzer_${i}`
                          }}
                          onChange={this.handleOnChange("analyzer")}
                          value={this.state.analyzer[`analyzer_${i}`] || ""}
                        >
                          <MenuItem value="">None</MenuItem>
                          {this.state.analyzers.map((v, j) => (
                            <MenuItem key={j} value={v.name}>
                              {v.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <FormControl style={{ width: "100%" }}>
                        <InputLabel htmlFor={`search_analyzer_${i}`}>
                          Search Analyzer
                        </InputLabel>
                        <Select
                          inputProps={{
                            name: `search_analyzer_${i}`,
                            id: `search_analyzer_${i}`
                          }}
                          onChange={this.handleOnChange("search_analyzer")}
                          value={
                            this.state.search_analyzer[
                              `search_analyzer_${i}`
                            ] || ""
                          }
                        >
                          <MenuItem value="">None</MenuItem>
                          {this.state.analyzers.map((v, j) => (
                            <MenuItem key={j} value={v.name}>
                              {v.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        inputProps={{ min: "1" }}
                        fullWidth
                        placeholder="Boost"
                        name={`boost_${i}`}
                        type="number"
                        value={this.state.boost[`boost_${i}`] || ""}
                        onChange={this.handleOnChange("boost")}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: "center" }}>
                    <IconButton
                      onClick={() =>
                        this.setState({
                          tableRowCnt: this.state.tableRowCnt + 1
                        })
                      }
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        if (this.state.tableRowCnt > 1) {
                          this.setState({
                            tableRowCnt: this.state.tableRowCnt - 1
                          });
                        }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        ) : null}
        {this.state.mappings.length === 0 && (
          <Paper
            style={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              maxWidth: 1100 - 20,
              height: 100,
              backgroundColor: "#777",
              color: "#fff",
              cursor: "pointer"
            }}
            onClick={this.handleOnSave}
          >
            <div
              style={{
                position: "relative",
                top: "50%",
                transform: "translateY(-50%)",
                textAlign: "center"
              }}
            >
              저장
            </div>
          </Paper>
        )}
      </div>
    );
  }
}

export default Mapping;
