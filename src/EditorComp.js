import React from "react";

export default class EditorComp extends React.Component {
  render() {
    return (<div>
      <textarea value={this.props.code} className="editor" onChange={this.props.onCodeChange}/>
    </div>)
  }
}
