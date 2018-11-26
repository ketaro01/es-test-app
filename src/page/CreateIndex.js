import React, { Component } from "react";
import { Link } from "react-router-dom";
import analyzer from "../api/analyzer";
import cat from "../api/cat";
import indices from "../api/indices";
import { Helmet } from "react-helmet";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteIcon from "@material-ui/icons/Delete";

class CreateIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      indexName: "",
      analyzer: null,
      analyzerList: [
        { value: "jamo", label: "자모음 분석기" },
        { value: "chosung", label: "초성 분석기" },
        { value: "seunjeon", label: "은전 분석기" }
      ],
      analyzerSetting: "",
      indexList: []
    };

    this.handleOnChangeArray = this.handleOnChangeArray.bind(this);
    this.handleOnChangeAnalyzer = this.handleOnChangeAnalyzer.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSaveIndex = this.handleOnSaveIndex.bind(this);
    this.handleDeleteIndex = this.handleDeleteIndex.bind(this);
    this.loadIndexList = this.loadIndexList.bind(this);
  }
  componentDidMount() {
    this.loadIndexList();
  }

  loadIndexList() {
    cat.getIndexList().then(result => {
      this.setState({ indexList: result });
    });
  }

  handleOnChangeArray(e) {
    const prevValue = this.state[e.target.name] || [];
    const findValue = prevValue.find(x => x === e.target.value);
    let nextValue = [];
    if (!findValue) {
      nextValue = prevValue;
      nextValue.push(e.target.value);
    } else {
      nextValue = prevValue.filter(x => x !== e.target.value);
    }
    this.setState({ [e.target.name]: nextValue });
  }
  handleOnChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleOnChangeAnalyzer(e) {
    const setting = analyzer(e.target.value);

    this.setState({
      [e.target.name]: e.target.value,
      analyzerSetting: JSON.stringify(setting, null, 4)
    });
  }

  handleOnSaveIndex = (indexName, setting) => () => {
    if (!indexName || !setting) {
      alert("셋팅하세요");
      return;
    }
    indices
      .createIndex(indexName, setting)
      .then(result => {
        alert("생성완료");
        this.loadIndexList();
      })
      .catch(err => {
        alert(`ERROR!! ${err.message}`);
      });
  };

  handleDeleteIndex = indexName => () => {
    if (
      indexName &&
      window.confirm(`${indexName} 인덱스를 삭제하시겠습니까?`)
    ) {
      indices
        .deleteIndex(indexName)
        .then(result => {
          if (result && result.acknowledged) {
            alert("삭제 완료");
            this.loadIndexList();
          }
        })
        .catch(err => {
          alert(`ERROR!! ${err.message}`);
        });
    }
  };

  render() {
    return (
      <div>
        <Helmet>
          <style>{"body { background-color: #eee; }"}</style>
        </Helmet>
        <Paper style={{ margin: 10, padding: 10, top: 0 }}>
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            Index List
          </Typography>
          <List
            style={{
              width: "100%",
              backgroundColor: "#eee",
              position: "relative",
              overflow: "auto",
              maxHeight: 300
            }}
          >
            {this.state.indexList.map((v, i) => (
              <ListItem key={v.index}>
                <div>
                  <span>
                    {v.index} (
                    <span style={{ fontWeight: "bold" }}>{v.docs_count}</span>)
                  </span>
                  <span style={{ flost: "right" }}>
                    <IconButton component={Link} to={`/mapping/${v.index}`}>
                      <SettingsIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={this.handleDeleteIndex(v.index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </div>
              </ListItem>
            ))}
          </List>
        </Paper>
        <Paper style={{ margin: "10px 10px 110px 10px", padding: 10 }}>
          <TextField
            id="outlined-name"
            label="인덱스명"
            name="indexName"
            value={this.state.indexName}
            onChange={this.handleOnChange}
            margin="normal"
            variant="outlined"
          />
          <RadioGroup
            name="analyzer"
            value={this.state.analyzer}
            onChange={this.handleOnChangeAnalyzer}
          >
            {this.state.analyzerList.map((v, i) => {
              return (
                <FormControlLabel
                  key={v.value}
                  value={v.value}
                  control={<Radio color="primary" name="analyzer" />}
                  label={v.label}
                />
              );
            })}
          </RadioGroup>
          <TextField
            style={{
              width: "100%"
            }}
            label="분석기 Setting"
            name="analyzerSetting"
            multiline
            rows={10}
            value={this.state.analyzerSetting}
            onChange={this.handleOnChange}
            margin="normal"
            variant="outlined"
          />
        </Paper>
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
          onClick={this.handleOnSaveIndex(
            this.state.indexName,
            this.state.analyzerSetting
          )}
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
      </div>
    );
  }
}

export default CreateIndex;
