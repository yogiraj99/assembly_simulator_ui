import React from "react";

export default class MessageBox extends React.Component {
  render() {
    return (<div className={`messageBox ${this.props.className}`}>
      {this.props.message.toString()}
    </div>)
  }
}
