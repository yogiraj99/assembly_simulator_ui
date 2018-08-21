import React from "react"
import {classNameOfRowsChanged} from "../constants";

function getClassName(row) {
  return (row.hasChanged) ? classNameOfRowsChanged : null;
}

const createRow = (row, headers) => {
  let cols = headers.map((header) => <td className={header.header + "Class"}>{row[header.accessor]}</td>);
  return (<tr className={getClassName(row)}>{cols}</tr>);
};

const createHeader = (headers, onClickOfHeader) => {
  let cols = headers.map((header) => {
    return <th onClick={onClickOfHeader}
               id={header.header}>{header.header}</th>;
  });
  return (<thead>
  <tr>{cols}</tr>
  </thead>)
};

export default (props) => {
  let {rows, headers, onClickOfHeader, className} = props;
  const tableRows = rows.map((row) => createRow(row, headers));
  const tableHeaders = createHeader(headers, onClickOfHeader);

  return (<table className={className}>{tableHeaders}
    <tbody>{tableRows}</tbody>
  </table>)
}
