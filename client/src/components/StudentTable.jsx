import { motion } from 'framer-motion';


const StudentTable = ({
  students,
  handleDelete,
  blurred
}) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Admission No.</th>
            <th>Grade</th>
            <th>Amount Paid</th>
            <th>Deficit</th>
            <th>Overpayment</th>
            <th>Fee Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <motion.tr
              key={student.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`student-row ${blurred ? 'blurred' : ''}`}
            >
              {/* Full Name */}
              <td>{`${student.firstname} ${student.middlename || ''} ${student.lastname}`.trim()}</td>

              {/* Admission Number */}
              <td>{student.admission_number}</td>

              {/* Grade */}
              <td>{student.grade}</td>

              {/* Amount Paid (Editable) */}
                <td>{student.amount|| 0}</td>


              {/* Deficit from backend */}
              <td>KES {student.deficit}</td>

              {/* Overpayment from backend */}
              <td>KES {student.overpayment}</td>

              {/* Fee Status Component */}
              <td>
               {student.fee_status}
              </td>

              {/* Delete Button */}
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

export default StudentTable;
