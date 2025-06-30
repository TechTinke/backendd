import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Use correct IDs matching your database
const ALLOWED_ACTIVITIES = [
  { id: 4, label: 'Drama Club :1000' },
  { id: 5, label: 'Music Club :1200' },
  { id: 6, label: 'Football Club :800' },
  { id: 7, label: 'Chess Club :600' },
  { id: 8, label: 'Debate Club :700' },
  { id: 9, label: 'Badminton :900' },
  { id: 10, label: 'Swimming :1500' },
];

const StudentFeeAndActivityForm = () => {
  const [formData, setFormData] = useState({
    admissionNumber: '',
    activityId: '',
    activityAmountPaid: '',
    feeAmountPaid: '',
    feeDate: '', // ✅ Date field added
    paymentStatus: 'pending',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    const { admissionNumber, activityId, activityAmountPaid, paymentStatus } = formData;

    if (!admissionNumber || !activityId || !activityAmountPaid) {
      toast.error("Fill all activity fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/students/activities/student/${admissionNumber}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          activity_id: parseInt(activityId),
          amount_paid: parseFloat(activityAmountPaid),
          payment_status: paymentStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add activity');
      toast.success('Activity payment saved!');
    } catch (err) {
      console.error(err);
      toast.error('Error adding activity payment');
    }
  };

  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    const { admissionNumber, feeAmountPaid, feeDate } = formData;

    if (!admissionNumber || !feeAmountPaid || !feeDate) {
      toast.error("Fill admission number, amount, and date");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/students/fees/${admissionNumber}/fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(feeAmountPaid),
          date: feeDate, // ✅ Use selected date
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to record fee');
      toast.success('Fee payment recorded!');
    } catch (err) {
      console.error(err);
      toast.error('Error recording fee payment');
    }
  };

  return (
    <div className="fee-activity-form">
      <h2>Record Student Fee & Activity</h2>
      <form>
        <div className="form-group">
          <label>Admission Number:</label>
          <input
            type="text"
            value={formData.admissionNumber}
            onChange={e => handleChange('admissionNumber', e.target.value)}
            required
          />
        </div>

        <h3>Activity Payment</h3>
        <div className="form-group">
          <label>Activity:</label>
          <select
            value={formData.activityId}
            onChange={e => handleChange('activityId', e.target.value)}
          >
            <option value="">Select Activity</option>
            {ALLOWED_ACTIVITIES.map(activity => (
              <option key={activity.id} value={activity.id}>{activity.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount Paid for Activity:</label>
          <input
            type="number"
            value={formData.activityAmountPaid}
            onChange={e => handleChange('activityAmountPaid', e.target.value)}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="submit-button"
          onClick={handleActivitySubmit}
        >
          Save Activity Payment
        </motion.button>

        <hr />

        <h3>General Fee Payment</h3>
        <div className="form-group">
          <label>Amount Paid for School Fees:</label>
          <input
            type="number"
            value={formData.feeAmountPaid}
            onChange={e => handleChange('feeAmountPaid', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date of Payment:</label>
          <input
            type="date"
            value={formData.feeDate}
            onChange={e => handleChange('feeDate', e.target.value)}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="submit-button"
          onClick={handleFeeSubmit}
        >
          Save Fee Payment
        </motion.button>
      </form>
    </div>
  );
};

export default StudentFeeAndActivityForm;
