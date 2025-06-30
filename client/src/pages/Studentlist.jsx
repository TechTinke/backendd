import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StudentTable from '../components/StudentTable';
import Sidebar from '../components/Sidebar';
import FilterStudents from '../components/FilterStudents';

const StudentList = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [gradeFilter, setGradeFilter] = useState('');
  const [deleteError, setDeleteError] = useState(null);
  const [filter, setFilter] = useState({
    admissionNumber: '',
    grade: '',
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/students/fees/");
        const data = await response.json();
        console.log("Fetched students:", data);
        setAllStudents(data);
        setStudents(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (gradeFilter === '') {
      setStudents(allStudents);
    } else {
      const filtered = allStudents.filter(student => student.grade === gradeFilter);
      setStudents(filtered);
    }
  }, [gradeFilter, allStudents]);

  const handleDelete = (student) => {
    console.log("Deleting student:", student);
    setStudentToDelete({
      id: student.id,
      firstname: student.firstname,
      middlename: student.middlename,
      lastname: student.lastname,
      admission_number: student.admission_number,
    });
    setDeleteError(null);
  };

  const confirmDelete = () => {
    if (!studentToDelete?.id) {
      setDeleteError("Missing student ID.");
      return;
    }

    fetch(`http://localhost:5000/students/fees/${studentToDelete.admission_number}/fees`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentToDelete.id }), // This matches your backend expectation
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(`Failed to delete student: ${text || res.statusText}`);
          });
        }
        return res.json().catch(() => ({}));
      })
      .then(() => {
        const updated = allStudents.filter(s => s.id !== studentToDelete.id);
        setAllStudents(updated);
        setStudents(updated);
        setStudentToDelete(null);
      })
      .catch(err => {
        console.error("Error deleting student:", err);
        setDeleteError(err.message || "Failed to delete student");
      });
  };

  const cancelDelete = () => {
    setStudentToDelete(null);
    setDeleteError(null);
  };

  const updateStudentFee = (id, amountPaid) => {
    fetch(`http://localhost:5000/students/fees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountPaid }),
    })
      .then(res => res.json())
      .then(data => {
        const updated = allStudents.map(student =>
          student.id === id ? data : student
        );
        setAllStudents(updated);
        setStudents(updated);
      })
      .catch(err => console.error("Update fee error:", err));
  };

  const DeleteConfirmationModal = ({ student, confirmDelete, cancelDelete, error }) => {
    if (!student) return null;

    const fullName = `${student.firstname || ''} ${student.middlename || ''} ${student.lastname || ''}`.trim();

    return (
      <div className="delete-confirmation-overlay">
        <div className="delete-confirmation-modal">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete <strong>{fullName}</strong>'s fee record?</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="modal-buttons">
            <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
            <button className="confirm-delete-btn" onClick={confirmDelete}>Delete</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="student-list-container"
    >
      <div className="sidebar-container">
        <Sidebar handleGradeFilter={setGradeFilter} />
      </div>

      <div className="student-list-content">
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Student Records ({students.length})
        </motion.h2>

        <FilterStudents
          students={students}
          setFilter={setFilter}
          filter={filter}
          setSelectedStudent={() => {}} // placeholder
        />

        <StudentTable
          students={students}
          handleDelete={handleDelete}
          updateStudentFee={updateStudentFee}
          blurred={false}
        />
      </div>

      {studentToDelete && (
        <DeleteConfirmationModal
          student={studentToDelete}
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
          error={deleteError}
        />
      )}
    </motion.div>
  );
};

export default StudentList;
