import { useState } from 'react';
import { toast } from 'react-toastify';

const FilterActivity = ({ filter, setFilter }) => {
  const [foundStudent, setFoundStudent] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState('');

  // Static activities list
  const activityOptions = [
    { id: 1, name: 'Drama Club', fee: 1000 },
    { id: 2, name: 'Music Club', fee: 1200 },
    { id: 3, name: 'Football Club', fee: 800 },
    { id: 4, name: 'Chess Club', fee: 600 },
    { id: 5, name: 'Debate Club', fee: 700 },
    { id: 6, name: 'Badminton', fee: 900 },
    { id: 7, name: 'Swimming', fee: 1500 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilter({ admissionNumber: '', grade: '', amountPaid: '' });
    setFoundStudent(null);
    setSelectedActivityId('');
  };

  const handleSearch = async () => {
    const admissionNumber = filter.admissionNumber?.trim();
    if (!admissionNumber) {
      toast.info('Please enter an admission number.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/students/activities/student/${admissionNumber}`
      );
      if (!response.ok) throw new Error('Student not found');

      const student = await response.json();
      setFoundStudent(student);

      setFilter((prev) => ({
        ...prev,
        grade: student.grade || '',
        amountPaid: '',
      }));

      toast.success('Student found!');
    } catch (err) {
      console.error(err);
      setFoundStudent(null);
      toast.warning('Student not found.');
    }
  };

  const handleFeeUpdate = async () => {
    const { admissionNumber, amountPaid } = filter;

    if (
      !admissionNumber.trim() ||
      amountPaid === '' ||
      selectedActivityId === '' ||
      isNaN(selectedActivityId)
    ) {
      toast.warning('All fields including activity are required.');
      return;
    }

    const selectedActivity = activityOptions.find(
      (activity) => activity.id === selectedActivityId
    );

    if (!selectedActivity) {
      toast.error('Selected activity not found.');
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
            activity_name: selectedActivity.name,
            amount_paid: parseFloat(amountPaid),
          }),
        }
      );

      if (!response.ok) throw new Error('Update failed');
      const result = await response.json();

      toast.success(result.message || 'Payment updated successfully!');
      setFilter((prev) => ({ ...prev, amountPaid: '' }));
    } catch (err) {
      console.error('Payment update error:', err);
      toast.error('Failed to update payment');
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Admission Number Search */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          alignItems: 'flex-end',
        }}
      >
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
        <button onClick={handleSearch} style={{ height: '35px' }}>
          Search
        </button>
        <button onClick={clearFilters} style={{ height: '35px' }}>
          Clear
        </button>
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
              value={selectedActivityId}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedActivityId(value === 'none' ? '' : Number(value));
              }}
            >
              <option value="none">-- Select Activity --</option>
              {activityOptions.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name} : {activity.fee}
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

export default FilterActivity;
