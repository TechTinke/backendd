import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import FilterActivity from '../components/FilterActivity';
import ActivityTable from '../components/ActivityTable';

const StudentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [gradeFilter, setGradeFilter] = useState('');
  const [filter, setFilter] = useState({
    admissionNumber: '',
    grade: '',
    amountPaid: '',
    date: '',
  });
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:5000/students/activities/");
        const data = await response.json();
        setActivities(data);
        setFilteredActivities(data);
      } catch (err) {
        console.error("Error fetching student activity data:", err);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    if (!gradeFilter) {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter(a => a.grade === gradeFilter);
      setFilteredActivities(filtered);
    }
  }, [gradeFilter, activities]);

  const updateStudentFee = (admissionNumber, newAmount) => {
    console.log(`Update fee for ${admissionNumber} to ${newAmount}`);
  };

  const calculateDeficit = (fee, paid) => {
    return fee - (paid || 0);
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setDeleteError(null);
  };

  const confirmDelete = () => {
    if (!studentToDelete?.id) {
      setDeleteError("Missing student ID");
      return;
    }

    fetch(`http://localhost:5000/students/activities/${studentToDelete.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete activity");
        return res.json();
      })
      .then(() => {
        const updated = activities.filter(a => a.id !== studentToDelete.id);
        setActivities(updated);
        setFilteredActivities(updated);
        setStudentToDelete(null);
      })
      .catch(err => {
        console.error("Delete error:", err);
        setDeleteError("Failed to delete activity");
      });
  };

  const cancelDelete = () => {
    setStudentToDelete(null);
    setDeleteError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="student-activities-container"
    >
      <div className="sidebar-container">
        <Sidebar handleGradeFilter={setGradeFilter} />
      </div>

      <div className="student-activities-content">
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Student Activities ({filteredActivities.length})
        </motion.h2>

        <FilterActivity
          filter={filter}
          setFilter={setFilter}
        />

        <ActivityTable
          students={filteredActivities}
          handleDelete={handleDelete}
          updateStudentFee={updateStudentFee}
          calculateDeficit={calculateDeficit}
        />
      </div>

      {/* Inline Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-content"
          >
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete <strong>
              {`${studentToDelete.firstname || ''} ${studentToDelete.middlename || ''} ${studentToDelete.lastname || ''}`.trim()}
            </strong>'s activity?</p>
            {deleteError && <p className="error-message">{deleteError}</p>}

            <div className="modal-buttons">
              <button onClick={cancelDelete} className="cancel-button">Cancel</button>
              <button onClick={confirmDelete} className="confirm-button">Yes, Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentActivity;
