import React, {Component} from 'react';

class Stack extends Component {

  constructor(props) {
    super(props);
    this.getStackLines = this.getStackLines.bind(this);
  }

  getStackLines() {
    return this.props.stack.map((stackLine) => {
      return (<tr>
        <td>{stackLine}</td>
      </tr>)
    })
  }

  render() {
    return (<table className="stack">
      <tbody>
      <tr>
        <th>Stack</th>
      </tr>
      {this.getStackLines()}
      </tbody>
    </table>)
  }
}

export default Stack
