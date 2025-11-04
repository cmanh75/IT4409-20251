import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultTable from './components/ResultTable';
import LoadingIndicator from './components/LoadingIndicator';
import './index.css';

function App() {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (id) => {
    if (!id) {
      setError('Please enter a student ID.');
      return;
    }

    setStudentId(id);
    setIsLoading(true);
    setError('');
    setStudent(null);
    setResults([]);

    try {
      const studentResponse = await fetch('/sinhvien.json');
      const students = await studentResponse.json();

      const foundStudent = students.find((s) => s.sid === id);
      if (!foundStudent) {
        setError('Student not found');
        setIsLoading(false);
        return;
      }

      setStudent(foundStudent);

      const resultResponse = await fetch('/ketqua.json');
      const allResults = await resultResponse.json();
      const studentResults = allResults.filter((r) => r.sid === id);

      const courseResponse = await fetch('/hocphan.json');
      const courses = await courseResponse.json();

      const enrichedResults = studentResults.map((r) => {
        const course = courses.find((c) => c.cid === r.cid);
        return {
          ...r,
          courseName: course ? course.name : 'Unknown Course',
          credit: course ? course.credits : 'N/A',
        };
      });

      setResults(enrichedResults);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error loading data');
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Student Result Lookup</h1>
      <SearchForm onSearch={handleSearch} />

      {isLoading && <LoadingIndicator />}
      {error && <p className="error">{error}</p>}

      {student && (
        <div className="student-info">
          <h2>Student Information</h2>
          <p><strong>ID:</strong> {student.sid}</p>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Date of Birth:</strong> {student.dob}</p>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <ResultTable results={results} />
      )}
    </div>
  );
}

export default App;
