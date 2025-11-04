import React from 'react';

function ResultTable({ results }) {
  return (
    <table className="result-table">
      <thead>
        <tr>
          <th>Course ID</th>
          <th>Course Name</th>
          <th>Term</th>
          <th>Credit</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r, index) => (
          <tr key={index}>
            <td>{r.cid}</td>
            <td>{r.courseName}</td>
            <td>{r.term}</td>
            <td>{r.credit}</td>
            <td>{r.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ResultTable;
