const getColumns = function () {
  return [{header: 'CL', accessor: 'CL'}, {header: 'NL', accessor: 'NL'},
    {header: 'INST', accessor: 'INST'},
    {header: 'A', accessor: 'A'}, {header: 'B', accessor: 'B'},
    {header: 'C', accessor: 'C'}, {header: 'D', accessor: 'D'},
    {header: 'EQ', accessor: 'EQ'}, {header: 'NE', accessor: 'NE'},
    {header: 'GT', accessor: 'GT'}, {header: 'LT', accessor: 'LT'},
    {header: 'PRN', accessor: 'PRN'}
  ]
};


const compareState = function (currentState, previousState, onChange, onNotChange) {
  if (currentState !== previousState) {
    onChange();
  } else {
    onNotChange();
  }
};

const replaceInString = function (string, toBeReplaced, replaceWith) {
  return string.replace(new RegExp(toBeReplaced, "g"), replaceWith);
};
export default {getColumns, compareState, replaceInString}
