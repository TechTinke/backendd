import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Define allowed activity options (same as backend)
const ALLOWED_ACTIVITIES = [

    'Drama Club :1000',
    'Music Club :1200',
    'Football Club :800',
    'Chess Club :600',
    'Debate Club :700',
    'Badminton :900',
    'Swimming :1500'

];

const StudentFeeAndActivityForm = () => {
  const [formData, setFormData] = useState({
    admissionNumber: '',
    activityName: '',
    activityAmountPaid: '',
    feeAmountPaid: '',
    paymentStatus: 'pending',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    const { admissionNumber, activityName, activityAmountPaid, paymentStatus } = formData;

    if (!admissionNumber || !activityName || !activityAmountPaid) {
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
          activity_id: activityName, // If your backend expects name, ensure it maps correctly
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
    const { admissionNumber, feeAmountPaid } = formData;

    if (!admissionNumber || !feeAmountPaid) {
      toast.error("Fill admission number and fee amount");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/students/${admissionNumber}/fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(feeAmountPaid),
          date: new Date().toISOString(),
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
            value={formData.activityName}
            onChange={e => handleChange('activityName', e.target.value)}
          >
            <option value="">Select Activity</option>
            {ALLOWED_ACTIVITIES.map(name => (
              <option key={name} value={name}>{name}</option>
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
