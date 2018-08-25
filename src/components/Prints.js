import React from "react";

export default class Prints extends React.Component {
  constructor() {
    super();
    this.getAllPrints = this.getAllPrints.bind(this);
  }

  getAllPrints() {
    return this.props.prints.map((elem, index) => {
      return (<div key={index} className="output">{elem}</div>);
    });
  }

  render() {
    return [this.getAllPrints()];
  }
}
