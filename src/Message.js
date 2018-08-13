import React from "react";

export default class Message extends React.Component {
  render() {
    console.log(this.props.message);
    return (<div className="errorMessage">
      {this.props.message.toString()}
    </div>)
  }
}
