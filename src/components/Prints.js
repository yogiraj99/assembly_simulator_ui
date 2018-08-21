import React from "react";

export default class Prints extends React.Component {

  render() {
    return (<div className="prints">{this.getAllPrints()}</div>)
  }

  getAllPrints() {
    let printLines = [];
    let prints = this.props.prints;
    for (let i = 0; i < prints.length; i++) {
      let lineToPrint = <p key={`print${i}`}>{prints[i]}</p>;
      printLines.push(lineToPrint)
    }
    return printLines;
  }
}
