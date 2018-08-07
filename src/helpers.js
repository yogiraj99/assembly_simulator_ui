const getColumns = function () {
  return [{Header: 'A', accessor: 'A'}, {Header: 'B', accessor: 'B'},
    {Header: 'C', accessor: 'C'}, {Header: 'D', accessor: 'D'},
    {Header: 'EQ', accessor: 'EQ'}, {Header: 'GT', accessor: 'GT'},
    {Header: 'LT', accessor: 'LT'}, {Header: 'NE', accessor: 'NE'},
    {Header: 'NL', accessor: 'NL'}, {Header: 'PRN', accessor: 'PRN'}
  ]
};


const compareState = function (currentState, previousState, onChange, onNotChange) {
  if (currentState !== previousState) {
    onChange();
  } else {
    onNotChange();
  }
};
export default {getColumns, compareState}
