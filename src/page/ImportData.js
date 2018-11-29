import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import XLSX from "xlsx";
import ctoj from "csvtojson";
import bulk from "../api/bulk";

class ImportData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      json: null,
      sample: null,
      indexName: "",
      type: "",
      loading: false,
      percent: 0
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.readFile = this.readFile.bind(this);
    this.fileDownload = this.fileDownload.bind(this);
    this.bulkUpload = this.bulkUpload.bind(this);
  }

  handleOnChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  readFile(e) {
    const file = e.target.files[0];

    if (!file) return;

    const ext = file.name
      .split(".")
      .slice(-1)
      .join("");

    const fileReader = new FileReader();
    fileReader.onload = f => {
      const getCsv = new Promise((resolve, reject) => {
        try {
          let csv = null;
          const fr = f.target.result;
          if (ext === "xlsx") {
            const wb = XLSX.read(fr, { type: "buffer" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            csv = XLSX.utils.sheet_to_csv(ws, { header: 1 });
          } else {
            csv = fr;
          }
          resolve(csv);
        } catch (e) {
          reject(e);
        }
      });
      getCsv
        .then(csv => ctoj().fromString(csv))
        .then(json => {
          const sample = json.slice(0, 5).map(v => JSON.stringify(v, null, 4));
          this.setState({ json, sample });
        })
        .catch(e => {
          this.setState({ json: null, file: null, sample: null });
          alert(e);
        });
    };

    this.setState({ [e.target.name]: file, json: null, sample: null }, () => {
      if (ext === "csv") fileReader.readAsText(file);
      else if (ext === "xlsx") fileReader.readAsArrayBuffer(file);
    });
  }

  fileDownload() {
    if (!this.state.json) {
      alert("파일을 선택하세요.");
      return;
    }
    const downloadLink = document.createElement("a");
    const blob = new Blob(["\ufeff", JSON.stringify(this.state.json, null, 4)]);
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.json";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  async bulkUpload() {
    if (!this.state.json) return;

    await this.setState({ loading: true, percent: 0 });
    const sliceSize = 100;

    const jArr = this.state.json.slice();

    const len = jArr.length;

    const cnt =
      Math.floor(len / sliceSize) + (Math.floor(len % sliceSize) > 0 ? 1 : 0);

    const sliceArr = new Array(cnt)
      .fill("")
      .map((_, i) => jArr.splice(0, sliceSize));

    for (const [index, value] of sliceArr.entries()) {
      const now = index + 1;
      const per = (now / cnt) * 100;

      const r = await bulk
        .bulkStart(this.state.indexName, this.state.type, value, "newsID")
        .then(() => {
          this.setState({ percent: per });
          return true;
        })
        .catch(err => {
          console.log(err);
          return false;
        });
    }

    this.setState({ loading: false, percent: 0 });
    alert("업로드 완료");
  }

  render() {
    return (
      <div>
        {this.state.loading && (
          <LinearProgress variant="determinate" value={this.state.percent} />
        )}
        <Paper style={{ margin: 10, padding: 10, top: 0 }}>
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            CSV, XLSX File Read
          </Typography>
          <input
            accept=".csv, .xlsx"
            id="outlined-button-csv"
            name="file"
            multiple
            type="file"
            onChange={this.readFile}
            style={{ display: "none" }}
          />
          <TextField
            variant="filled"
            inputProps={{ disabled: true }}
            value={this.state.file ? this.state.file.name : ""}
          />
          <label htmlFor="outlined-button-csv">
            <Button variant="outlined" component="span" style={{ height: 56 }}>
              파일 선택
            </Button>
          </label>
          <Button
            variant="outlined"
            component="span"
            style={{ height: 56, marginLeft: 10 }}
            onClick={this.fileDownload}
            disabled={!this.state.json}
          >
            JSON Download
          </Button>
        </Paper>
        {!!this.state.json && (
          <Paper style={{ margin: 10, padding: 10, top: 0 }}>
            <Typography
              component="h1"
              variant="h3"
              color="inherit"
              gutterBottom
            >
              Upload
            </Typography>
            <TextField
              label="인덱스명"
              fullWidth
              name="indexName"
              value={this.state.indexName}
              onChange={this.handleOnChange}
              margin="normal"
              variant="outlined"
            />
            <br />
            <TextField
              label="도큐먼트 타입명"
              fullWidth
              name="type"
              value={this.state.type}
              onChange={this.handleOnChange}
              margin="normal"
              variant="outlined"
            />
            <br />
            <Button
              variant="outlined"
              component="span"
              style={{ height: 56 }}
              onClick={this.bulkUpload}
              disabled={
                !this.state.json ||
                !this.state.indexName ||
                !this.state.type ||
                this.state.loading
              }
            >
              Upload
            </Button>
          </Paper>
        )}
        {!!this.state.sample && (
          <Paper style={{ margin: 10, padding: 10, top: 0 }}>
            <Typography
              component="h1"
              variant="h3"
              color="inherit"
              gutterBottom
            >
              Sample
            </Typography>
            <div>
              {this.state.sample.map((v, i) => (
                <div key={i} style={{ whiteSpace: "pre-wrap" }}>
                  {v}
                  {this.state.sample.length - 1 !== i && ","}
                </div>
              ))}
            </div>
          </Paper>
        )}
      </div>
    );
  }
}

export default ImportData;
