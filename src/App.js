import React, {Component} from 'react';
import Message from "./Message";
import ReactTable from 'react-table';
import "react-table/react-table.css";
import Machine from '@craftybones/assembly_simulator';
import {HIGHLIGHTINGCOLOUR, INITIALCODE, INITIALMESSAGE} from "./constants";
import helpers from "./helpers";
import './code_editor.css';
import EditorComp from "./EditorComp";

require('codemirror/lib/codemirror.css');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      machine: new Machine(),
      editor: INITIALCODE,
      registerTable: [],
      message: INITIALMESSAGE
    };
    this.executeCode = this.executeCode.bind(this);
    this.handleCodeEdit = this.handleCodeEdit.bind(this);
    this.setHasChangedPropertyForChangedRows = this.setHasChangedPropertyForChangedRows.bind(this);
  }

  handleCodeEdit(editor) {
    this.setState({editor})
  }

  render() {
    let app = this;
    return (
        <div className="app">
          <div className="codeSection">
            <EditorComp initailCode={INITIALCODE} onEdit={this.handleCodeEdit}/>
            <Message message={this.state.message}/>
            <button onClick={this.executeCode}>Execute</button>
          </div>
          <ReactTable columns={helpers.getColumns()} data={this.state.registerTable}
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

  executeCode() {
    let lines = this.state.editor.split(/\n/);
    let numberedCode = lines.map((l, i) => `${(i + 1) * 10} ${l.trim()}`).join("\n");
    let machine = this.state.machine;
    try {
      machine.load(numberedCode);
      machine.execute();
      this.setState({registerTable: machine.getTable(), message: INITIALMESSAGE});
    } catch (e) {
      this.setState({message: e, registerTable: []})
    }
  }
}

export default App;
