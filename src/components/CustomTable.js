import React from "react"
import {highlightingClass} from "../constants";

function getClassName(row) {
  return (row.hasChanged) ? highlightingClass : null;
}

const createRow = (row, headers, onClickOfRow) => {
  let cols = headers.map((header) => <td className={header.header + "Class"}>{row[header.accessor]}</td>);
  return (<tr className={getClassName(row)} onClick={onClickOfRow.bind(null, row)}>{cols}</tr>);
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
  let {rows, headers, onClickOfHeader, className, onClickOfRow} = props;
  const tableRows = rows.map((row) => createRow(row, headers, onClickOfRow));
  const tableHeaders = createHeader(headers, onClickOfHeader);

  return (
      <div className="result-table">
        <table className={className}>{tableHeaders}
          <tbody>{tableRows}</tbody>
        </table>
      </div>
  );
}
