import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Downshift from "downshift";
import es_search from "../api/search.js";

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

class AutoComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: "",
      searchList: []
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {
    const inputValue = e.target.value;

    let bodyReq = {
      from: 0,
      size: 10,
      query: {
        multi_match: {
          query: inputValue,
          fields: ["organ_name_summary", "organ_name_eng", "organ_name_kor"]
        }
      }
    };
    const reqParam = {
      index: "organ_autocomplete",
      body: bodyReq
    };

    es_search.search(reqParam).then(result => {
      const organList = result.hits.hits.map(v => ({
        ...v._source,
        score: v._score
      }));
      this.setState({
        searchList: organList
      });
    });
    this.setState({ searchValue: inputValue });
  }
  render() {
    const renderInput = inputProps => {
      const { InputProps, ref, ...other } = inputProps;

      return (
        <TextField
          InputProps={{
            inputRef: ref,
            ...InputProps
          }}
          {...other}
        />
      );
    };
    return (
      <div>
        <Helmet>
          <style>{"body { background-color: #aaa; }"}</style>
        </Helmet>
        <Paper style={{ margin: 10, padding: 10 }}>
          <div style={{ margin: 10 }}>
            <Downshift id="downshift-simple">
              {({
                getInputProps,
                getItemProps,
                getMenuProps,
                highlightedIndex,
                isOpen,
                selectedItem
              }) => (
                <div style={{ position: "relative" }}>
                  {renderInput({
                    fullWidth: true,
                    InputProps: getInputProps({
                      onKeyUp: this.handleOnChange,
                      placeholder: "Search..."
                    })
                  })}
                  <div {...getMenuProps()}>
                    {isOpen ? (
                      <Paper
                        square
                        style={{
                          position: "absolute",
                          zIndex: 1,
                          left: 0,
                          right: 0
                        }}
                      >
                        {this.state.searchList.map((v, i) => {
                          const isHighlighted = highlightedIndex === i;
                          const isSelected =
                            (selectedItem || "").indexOf(v.organ_name_kor) > -1;
                          const itemProps = getItemProps({
                            item: v.organ_name_kor
                          });

                          return (
                            <MenuItem
                              {...itemProps}
                              component="div"
                              style={{
                                fontWeight: isSelected ? "bold" : "normal"
                              }}
                              selected={isHighlighted}
                              key={i}
                            >
                              {v.organ_name_kor} / {v.score}
                            </MenuItem>
                          );
                        })}
                      </Paper>
                    ) : null}
                  </div>
                </div>
              )}
            </Downshift>
          </div>
          <Table style={{ position: "relative" }}>
            <TableHead>
              <TableRow>
                <CustomTableCell>기업명</CustomTableCell>
                <CustomTableCell>기업명(영문)</CustomTableCell>
                <CustomTableCell>CEO</CustomTableCell>
                <CustomTableCell>사업내용</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow style={{ height: 48 }}>
                <TableCell colSpan={4}>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default AutoComplete;
