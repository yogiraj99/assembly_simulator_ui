import React, {Component} from 'react';
import MessageBox from "./components/MessageBox";
import Machine from '@craftybones/assembly_simulator';
import {highlightErrorClass, highlightingClass, INITIALCODE, INITIALMESSAGE} from "./constants";
import helpers from "./helpers";
import EditorComp from "./components/EditorComp";
import Prints from "./components/Prints";
import CustomTable from "./components/CustomTable";
import Stack from "./components/Stack";
import './css/app.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      machine: new Machine(),
      editor: INITIALCODE,
      registerTable: [],
      message: INITIALMESSAGE,
      prints: [],
      stack: [],
      isExecutingStepWise: false,
      highlightLine: 0,
      highlightingClass: highlightingClass,
      isSidebarOpen: false
    };
    this.executeCode = this.executeCode.bind(this);
    this.executeStepWise = this.executeStepWise.bind(this);
    this.updateRegisterAndStack = this.updateRegisterAndStack.bind(this);
    this.executeNextLine = this.executeNextLine.bind(this);
    this.setError = this.setError.bind(this);
    this.handleCodeEdit = this.handleCodeEdit.bind(this);
    this.showStackForLine = this.showStackForLine.bind(this);
    this.setHasChangedPropertyForChangedRows = this.setHasChangedPropertyForChangedRows.bind(this);
    this.openMenu = this.openMenu.bind(this);
  }

  openMenu() {
    this.setState({isSidebarOpen: !this.state.isSidebarOpen})
  }

  render() {
    const sidebarClassName = this.state.isSidebarOpen ? 'active' : '';
    return (
        <div className="app">
          <div className="assembly-simulator-container">
            <div className="assembly-simulator-header">
              <div className="header-title-action">
                <span className={`menu ${sidebarClassName}`} onClick={this.openMenu}>...</span>
                <span className="title">Assembly Simulator</span>
              </div>
            </div>
            <div className="code-container card">
              <EditorComp initialCode={INITIALCODE} highlightLine={this.state.highlightLine}
                          highlightingClass={this.state.highlightingClass} onEdit={this.handleCodeEdit}/>
              <div className="actions card">
                <button onClick={this.executeStepWise} disabled={this.state.isExecutingStepWise}>Step Into</button>
                <button onClick={this.executeCode}>Run</button>
                <button onClick={this.executeNextLine} disabled={!this.state.isExecutingStepWise}>Next</button>
              </div>
              <MessageBox message={this.state.message}/>
            </div>
            <div className="output-container card">
              <Prints prints={this.state.prints}/>
            </div>
            <div className="trace-table">
              <CustomTable rows={this.state.registerTable} headers={helpers.getColumns()} className="registerTable"
                           onClickOfHeader={this.setHasChangedPropertyForChangedRows}
                           onClickOfRow={this.showStackForLine}/>
              <Stack stack={this.state.stack}/>
            </div>
          </div>
        </div>
    );
  }

  handleCodeEdit(editor) {
    this.setState({editor});
    this.clearState();
    this.setAsNotExecutingStepWise();
  }

  setHasChangedPropertyForChangedRows(event) {
    this.setState({highlightLine: 0});
    let columnId = event.target.id;
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
      this.setAsNotExecutingStepWise();
      this.setState({
        registerTable: machine.getTable(),
        prints: machine.getPrn(),
        stack: machine.getStack(),
        message: INITIALMESSAGE,
        highlightingClass: highlightingClass
      });
    } catch (e) {
      this.setError(e);
    }
  }

  executeStepWise() {
    let lines = this.state.editor.split(/\n/);
    let numberedCode = lines.map((l, i) => `${(i + 1) * 10} ${l.trim()}`).join("\n");
    let machine = this.state.machine;
    try {
      machine.load(numberedCode);
      machine.executeStepWise(this.updateRegisterAndStack);
      this.clearState();
      this.setAsExecutingStepWise();
    } catch (e) {
      this.setError(e);
    }
  }

  clearState() {
    this.setState({
      registerTable: [], prints: [], stack: [],
      highlightLine: 0, highlightingClass: highlightingClass,
      message: INITIALMESSAGE
    })
  }

  executeNextLine() {
    this.state.machine.nextStep();
  }

  setAsNotExecutingStepWise() {
    this.setState({isExecutingStepWise: false})
  }

  setAsExecutingStepWise() {
    this.setState({isExecutingStepWise: true})
  }

  updateRegisterAndStack(state) {
    let {A, B, C, D, EQ, NE, GT, LT, CL, NL, SL, PRN, INST, STK} = state;
    let registerTable = this.state.registerTable;
    let prints = this.state.prints;
    registerTable.push({A, B, C, D, EQ, NE, GT, LT, CL, SL, NL, STK, PRN, INST});
    prints.push(PRN);
    this.setState({registerTable, prints, stack: STK});
  }

  showStackForLine(clickedRow) {
    this.setState({stack: clickedRow.STK});
    let registerTable = this.state.registerTable;
    for (let i = 0; i < registerTable.length; i++) {
      registerTable[i].hasChanged = (registerTable[i] === clickedRow);
    }
    this.setState({registerTable, highlightLine: clickedRow.SL});
  }

  setError(error) {
    this.setState({
      //TODO:Remove * 10 when fixed the lineNumber problem
      message: `Error on lineNumber ${error.lineNumber * 10}`,
      highlightLine: error.lineNumber,
      highlightingClass: highlightErrorClass,
      registerTable: []
    })
  }
}

export default App;
