import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import FilterActivity from '../components/FilterActivity'; // ✅ Use this instead
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

  // Fetch student activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:5000/students/activities/");
        const data = await response.json();
        console.log("Fetched student activities:", data);
        setActivities(data);
        setFilteredActivities(data);
      } catch (err) {
        console.error("Error fetching student activity data:", err);
      }
    };

    fetchActivities();
  }, []);

  // Filter by grade
  useEffect(() => {
    if (!gradeFilter) {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter(a => a.grade === gradeFilter);
      setFilteredActivities(filtered);
    }
  }, [gradeFilter, activities]);

  // Placeholder handlers
  const updateStudentFee = (admissionNumber, newAmount) => {
    console.log(`Update fee for ${admissionNumber} to ${newAmount}`);
    // Optional: integrate with backend
  };

  const calculateDeficit = (fee, paid) => {
    return fee - (paid || 0);
  };

  const handleDelete = (student) => {
    console.log("Delete student activity:", student);
    // Optional: integrate DELETE API
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

        {/* 🔁 Replaces FilterStudents with FilterActivity */}
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
    </motion.div>
  );
};

export default StudentActivity;
