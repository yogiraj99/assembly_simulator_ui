import React, {Component} from 'react';
import EditorComp from "./EditorComp";
import ErrorMessage from "./ErrorMessage";
import ReactTable from 'react-table';
import "react-table/react-table.css";
import Machine from 'assembly_simulator';

let initialMessage = "No errors found";
let machine = new Machine();
let initialRegisterTable = [];
const columns = [{
  Header: 'A',
  accessor: 'A'
}, {
  Header: 'B',
  accessor: 'B'
}, {
  Header: 'C',
  accessor: 'C'
}, {
  Header: 'D',
  accessor: 'D'
}, {
  Header: 'EQ',
  accessor: 'EQ'
}, {
  Header: 'GT',
  accessor: 'GT'
}, {
  Header: 'LT',
  accessor: 'LT'
}, {
  Header: 'NE',
  accessor: 'NE'
}, {
  Header: 'NL',
  accessor: 'NL'
}, {
  Header: 'PRN',
  accessor: 'PRN'
}
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "10 START\n20 PRN \"HELLO\"\n30 STOP",
      registerTable: initialRegisterTable,
      errorMessage: initialMessage
    };
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.executeCode = this.executeCode.bind(this);
  }

  render() {
    return (
        <div className="app">
          <div className="codeSection">
            <EditorComp code={this.state.code} onCodeChange={this.handleCodeChange}/>
            <ErrorMessage message={this.state.errorMessage}/>
            <button onClick={this.executeCode}>Execute</button>
          </div>
          <ReactTable columns={columns} data={this.state.registerTable}
                      showPaginationBottom={false}
                      className="-striped"
                      noDataText=""
                      minRows={10}
                      pageSize={this.state.registerTable.length}
                      sortable={false}
                      resizable={false}
          />
        </div>
    );
  }

  handleCodeChange(event) {
    this.setState({code: event.target.value});
  }

  executeCode() {
    try {
      machine.load(this.state.code);
      machine.execute();
      console.log(machine.getPrn().join("\n"));
      console.log(machine.getTable());
      this.setState({registerTable: machine.getTable(), errorMessage: initialMessage});
    } catch (e) {
      this.setState({errorMessage: e, registerTable: initialRegisterTable})
    }
  }
}

export default App;
