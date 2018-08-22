import React, {Component} from 'react';
import MessageBox from "./components/MessageBox";
import Machine from '@craftybones/assembly_simulator';
import {INITIALCODE, INITIALMESSAGE} from "./constants";
import helpers from "./helpers";
import EditorComp from "./components/EditorComp";
import Prints from "./components/Prints";
import CustomTable from "./components/CustomTable";
import Stack from "./components/Stack";

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
      isExecutingStepWise: false
    };
    this.executeCode = this.executeCode.bind(this);
    this.executeStepWise = this.executeStepWise.bind(this);
    this.updateRegisterAndStack = this.updateRegisterAndStack.bind(this);
    this.executeNextLine = this.executeNextLine.bind(this);
    this.handleCodeEdit = this.handleCodeEdit.bind(this);
    this.setHasChangedPropertyForChangedRows = this.setHasChangedPropertyForChangedRows.bind(this);
  }

  render() {
    return (
        <div className="app">
          <div className="codeSection">
            <EditorComp initailCode={INITIALCODE} onEdit={this.handleCodeEdit}/>
            <MessageBox message={this.state.message}/>
            <div>
              <button onClick={this.executeStepWise} disabled={this.state.isExecutingStepWise}>Step Into</button>
              <button onClick={this.executeCode}>Run</button>
              <button onClick={this.executeNextLine} disabled={!this.state.isExecutingStepWise}>Next</button>
            </div>
          </div>
          <div className="outputSection">
            <Prints prints={this.state.prints}/>
            <CustomTable rows={this.state.registerTable} headers={helpers.getColumns()} className="registerTable"
                         onClickOfHeader={this.setHasChangedPropertyForChangedRows}/>
          </div>
          <div>
            <Stack stack={this.state.stack}/>
          </div>
        </div>
    );
  }

  handleCodeEdit(editor) {
    this.setState({editor});
    this.clearTableAndStack();
    this.setAsNotExecutingStepWise();
  }

  setHasChangedPropertyForChangedRows(event) {
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
        message: INITIALMESSAGE
      });
    } catch (e) {
      this.setState({message: e, registerTable: []})
    }
  }

  executeStepWise() {
    let lines = this.state.editor.split(/\n/);
    let numberedCode = lines.map((l, i) => `${(i + 1) * 10} ${l.trim()}`).join("\n");
    let machine = this.state.machine;
    try {
      machine.load(numberedCode);
      machine.executeStepWise(this.updateRegisterAndStack);
      this.clearTableAndStack();
      this.setAsExecutingStepWise();
    } catch (e) {
      this.setState({message: e, registerTable: []})
    }
  }

  clearTableAndStack() {
    this.setState({registerTable: [], prints: [], stack: []})
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
    registerTable.push({A, B, C, D, EQ, NE, GT, LT, CL, NL, PRN, INST});
    prints.push(PRN);
    this.setState({registerTable, prints, stack: STK});
  }
}

export default App;
