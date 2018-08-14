import React from "react";

export default class MessageBox extends React.Component {
  render() {
    console.log(this.props.message);
    return (<div className="messageBox">
      {this.props.message.toString()}
    </div>)
  }
}
