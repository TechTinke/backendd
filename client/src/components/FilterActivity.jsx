import { useState } from 'react';
import { toast } from 'react-toastify';

const FilterStudents = ({ filter, setFilter }) => {
  const [foundStudent, setFoundStudent] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilter({ admissionNumber: '', grade: '', amountPaid: '', date: '' });
    setFoundStudent(null);
    setSelectedActivityId(null);
  };

  const handleSearch = async () => {
    const admissionNumber = filter.admissionNumber?.trim();
    if (!admissionNumber) {
      toast.info('Please enter an admission number.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/students/fees/${admissionNumber}`);
      if (!response.ok) throw new Error('Student not found');

      const student = await response.json();
      setFoundStudent(student);

      // Auto-select first activity if any
      if (student.activity_payments?.length > 0) {
        setSelectedActivityId(student.activity_payments[0].activity_id);
      }

      setFilter(prev => ({
        ...prev,
        grade: student.grade || '',
        amountPaid: '',
        date: '',
      }));

      toast.success('Student found!');
    } catch (err) {
      console.error(err);
      setFoundStudent(null);
      toast.warning('Student not found.');
    }
  };

  const handleFeeUpdate = async () => {
    const { admissionNumber, amountPaid, date } = filter;

    if (!admissionNumber || !amountPaid || !date || !selectedActivityId) {
      toast.warning('All fields including activity are required.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/students/activities/student/${admissionNumber}/update_payment`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activity_id: selectedActivityId,
            amount_paid: parseFloat(amountPaid),
            payment_status: 'partial', // optional, backend can recalculate
          }),
        }
      );

      if (!response.ok) throw new Error('Update failed');
      const result = await response.json();

      toast.success(result.message || 'Payment updated successfully!');
      setFilter(prev => ({ ...prev, amountPaid: '', date: '' }));
    } catch (err) {
      console.error('Payment update error:', err);
      toast.error('Failed to update payment');
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Admission Number Search */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Admission No:</label>
          <input
            type="text"
            name="admissionNumber"
            value={filter.admissionNumber}
            onChange={handleChange}
            placeholder="e.g. ADM001"
          />
        </div>
        <button onClick={handleSearch} style={{ height: '35px' }}>Search</button>
        <button onClick={clearFilters} style={{ height: '35px' }}>Clear</button>
      </div>

      {/* Student Info and Fee Update Form */}
      {foundStudent && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Name:</label>
            <input
              type="text"
              value={`${foundStudent.firstname || ''} ${foundStudent.middlename || ''} ${foundStudent.lastname || ''}`}
              readOnly
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Grade:</label>
            <input type="text" value={foundStudent.grade || ''} readOnly />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Activity:</label>
            <select
              value={selectedActivityId || ''}
              onChange={(e) => setSelectedActivityId(Number(e.target.value))}
            >
              {foundStudent.activity_payments?.map((activity, idx) => (
                <option key={idx} value={activity.activity_id}>
                  {activity.activity_name} — Paid: {activity.amount_paid} / {activity.fee}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Amount Paid:</label>
            <input
              type="number"
              name="amountPaid"
              value={filter.amountPaid}
              onChange={handleChange}
              placeholder="Enter payment amount"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={filter.date}
              onChange={handleChange}
            />
          </div>

          <button
            onClick={handleFeeUpdate}
            style={{ height: '35px', alignSelf: 'flex-end' }}
          >
            Submit Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterStudents;
