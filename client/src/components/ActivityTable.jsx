import { motion } from 'framer-motion';

const ActivityTable = ({
  students = [],
  handleDelete = () => {},
  updateStudentFee = () => {},
  calculateDeficit = () => 'N/A',
}) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Admission No.</th>
            <th>Grade</th>
            <th>Activity</th>
            <th>Amount Paid</th>
            <th>Deficit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="student-row"
            >
              <td>{student.firstname} {student.middlename} {student.lastname}</td>
              <td>{student.admission_number}</td>
              <td>{student.grade}</td>
              <td>{student.activity_name}</td>
              <td>{student.amount_paid || 0}</td>
              <td>
                {calculateDeficit(student.activity_fee, student.amount_paid)}
              </td>
              <td>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(student)}
                  className="delete-button"
                >
                  Delete
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
