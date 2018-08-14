import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2'

require('codemirror/lib/codemirror.css');

export default class EditorComp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
      <CodeMirror value={this.props.initailCode || "START\nPRN \"HELLO\"\nSTOP"}
                  options={{lineNumbers: true, lineNumberFormatter: (a) => a * 10}}
                  onChange={(editor, value) => {
                    this.props.onEdit(editor.doc.getValue())
                  }} className="editor">
      </CodeMirror>
    </div>)
  }
}
