import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import StudentList from './pages/Studentlist';
import StudentActivity from './pages/StudentActivity';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const savedStudents = localStorage.getItem('students');
        let studentsData = [];

        if (savedStudents) {
          studentsData = JSON.parse(savedStudents);
        } else {
          const response = await fetch(`http://localhost:5000/students/fees/`);
          if (!response.ok) throw new Error('Failed to fetch students');
          studentsData = await response.json();
          localStorage.setItem('students', JSON.stringify(studentsData));
        }

        setStudents(studentsData);
      } catch (err) {
        console.error('Error fetching students:', err);
        alert('There was an error loading student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStudents();
  }, [token]);

  const handleTermChange = (term) => setSelectedTerm(term);
  const handlePendingFees = (term) => console.log('Handling pending fees for', term);
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
      localStorage.setItem('students', JSON.stringify(updatedStudents));
    } catch (err) {
      console.error(err);
      setStudents(students); // Revert
      alert('Error updating fee');
    }
  };

  const updateStudent = (updatedStudent) =>
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    );
  }

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
               
                 
                  handlePendingFees={handlePendingFees}
                />
              }
            />
            <Route
              path="/reports"
              element={<Reports students={students} selectedTerm={selectedTerm} />}
            />
            <Route
              path="/settings"
              element={<Settings handleTermChange={handleTermChange} settingsTerm={selectedTerm} />}
            />
            <Route
              path="/studentlist"
              element={
                <StudentList
                  students={students}
                  deleteStudent={deleteStudent}
                  updateStudent={updateStudent}
                  
                  handleTermChange={handleTermChange}
                  handlePendingFees={handlePendingFees}
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
                 
                  handleTermChange={handleTermChange}
                  handlePendingFees={handlePendingFees}
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
