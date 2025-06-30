import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import StudentList from './pages/Studentlist';
import StudentActivity from './pages/StudentActivity';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/students/fees/');
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.error('Error fetching students:', err);
        alert('Error loading student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const addStudent = (newStudent) => setStudents(prev => [...prev, newStudent]);
  const deleteStudent = (id) => setStudents(prev => prev.filter(s => s.id !== id));

  const updateStudentFee = async (studentId, newAmountPaid) => {
    const amountPaid = parseInt(newAmountPaid, 10);
    const updatedStudents = [...students];
    const studentIndex = updatedStudents.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) return alert('Student not found!');

    updatedStudents[studentIndex] = {
      ...updatedStudents[studentIndex],
      amountPaid
    };

    setStudents(updatedStudents);

    try {
      const response = await fetch(`http://localhost:5000/students/fees/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountPaid }),
      });
      if (!response.ok) throw new Error('Failed to update');
    } catch (err) {
      console.error(err);
      setStudents(students); // Revert
      alert('Error updating fee');
    }
  };

  const updateStudent = (updatedStudent) =>
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));

  if (loading) return <div>Loading students...</div>;

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  students={students}
                  addStudent={addStudent}
                  deleteStudent={deleteStudent}
                  updateStudentFee={updateStudentFee}
                  updateStudent={updateStudent}
                />
              }
            />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/studentlist"
              element={
                <StudentList
                  students={students}
                  deleteStudent={deleteStudent}
                  updateStudent={updateStudent}
                />
              }
            />
            <Route
              path="/studentactivity"
              element={
                <StudentActivity
                  students={students}
                  deleteStudent={deleteStudent}
                  updateStudent={updateStudent}
                />
              }
            />
          </Routes>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
