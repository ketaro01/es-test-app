import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextFiled from "@material-ui/core/TextField";
import XLSX from "xlsx";
class ImportData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.ExcelToCsv = this.ExcelToCsv.bind(this);
  }

  handleChangeFile(e) {
    const file = e.target.files[0];
    this.setState({ file });
  }

  ExcelToCsv() {
    if (!this.state.file) {
      alert("파일을 선택하세요.");
      return;
    }
    const file = this.state.file;
    const fileReader = new FileReader();
    fileReader.onload = evt => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const csv = XLSX.utils.sheet_to_csv(ws, { header: 1 });

      const downloadLink = document.createElement("a");
      const blob = new Blob(["\ufeff", csv]);
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "data.csv";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    fileReader.readAsArrayBuffer(file);
  }
  render() {
    return (
      <div>
        <div style={{ padding: 10 }}>
          <input
            accept=".xlsx*"
            id="outlined-button-file"
            multiple
            type="file"
            onChange={this.handleChangeFile}
            style={{ display: "none" }}
          />
          <TextFiled
            variant="filled"
            inputProps={{ disabled: true }}
            value={this.state.file ? this.state.file.name : ""}
          />
          <label htmlFor="outlined-button-file">
            <Button variant="outlined" component="span" style={{ height: 56 }}>
              파일 선택
            </Button>
          </label>
          <Button
            variant="outlined"
            component="span"
            style={{ height: 56, marginLeft: 10 }}
            onClick={this.ExcelToCsv}
          >
            변환
          </Button>
        </div>
      </div>
    );
  }
}

export default ImportData;
