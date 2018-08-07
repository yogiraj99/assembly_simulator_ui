import React, {Component} from 'react';
import EditorComp from "./EditorComp";
import ErrorMessage from "./ErrorMessage";
import ReactTable from 'react-table';
import "react-table/react-table.css";
import Machine from 'assembly_simulator';
import {HIGHLIGHTINGCOLOUR, INITAILCODE, INITIALMESSAGE} from "./constants";
import helpers from "./helpers";

let machine = new Machine();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: INITAILCODE,
      registerTable: [],
      errorMessage: INITIALMESSAGE
    };
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.executeCode = this.executeCode.bind(this);
    this.setHasChangedPropertyForChangedRows = this.setHasChangedPropertyForChangedRows.bind(this);
  }

  render() {
    let app = this;
    return (
        <div className="app">
          <div className="codeSection">
            <EditorComp code={this.state.code} onCodeChange={this.handleCodeChange}/>
            <ErrorMessage message={this.state.errorMessage}/>
            <button onClick={this.executeCode}>Execute</button>
          </div>
          <ReactTable columns={helpers.getColumns} data={this.state.registerTable}
                      showPaginationBottom={false}
                      className="-striped"
                      noDataText=""
                      minRows={10}
                      getTrProps={(state, rowInfo, column) => {
                        if (!rowInfo) return {};
                        return {
                          style: {
                            background: rowInfo.original.hasChanged ? HIGHLIGHTINGCOLOUR : null
                          }

                        };
                      }}
              //Change this prop name to "getTdProps" if you want on click of any cell in given column
                      getTheadThProps={(state, rowInfo, column) => {
                        return {
                          onClick() {
                            app.setHasChangedPropertyForChangedRows(column.id);
                          }
                        };
                      }}
                      pageSize={this.state.registerTable.length}
                      sortable={false}
                      resizable={false}
          />
        </div>
    );
  }

  setHasChangedPropertyForChangedRows(columnId) {
    let registerTable = this.state.registerTable;
    let previousState = (registerTable[0]) ? registerTable[0][columnId] : undefined;
    registerTable.forEach((row, rowIndex) => {
      let onChange = this.setHasChangedAs.bind(this, rowIndex, true);
      let onNotChange = this.setHasChangedAs.bind(this, rowIndex, false);
      let currentState = row[columnId];
      //Think about name for this function : Here you are not only comparing but also executing onChange or onNotChange function
      helpers.compareState(currentState, previousState, onChange, onNotChange);
      previousState = row[columnId];
    });
  }

  setHasChangedAs(rowIndex, state) {
    let registerTable = this.state.registerTable;
    registerTable[rowIndex].hasChanged = state;
    this.setState({registerTable});
  }

  handleCodeChange(event) {
    this.setState({code: event.target.value});
  }

  executeCode() {
    try {
      machine.load(this.state.code);
      machine.execute();
      this.setState({registerTable: machine.getTable(), errorMessage: INITIALMESSAGE});
    } catch (e) {
      this.setState({errorMessage: e, registerTable: []})
    }
  }
}

export default App;
