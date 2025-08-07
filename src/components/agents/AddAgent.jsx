import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddAgent.css'; // Reusing the same styles
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAgent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message || 'Failed to create agent'}`);
        throw new Error(errorData.message || 'Failed to create agent');
      }

      toast.success('Agent added successfully!');
      setTimeout(() => navigate('/agents', { state: { agentCreated: true } }), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-lead">
      <div className="add-lead__header">
        <h1 className="add-lead__title">Add New Agent</h1>
      </div>

      {error && (
        <div className="add-lead__error">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-lead__form">
        <div className="form-group">
          <label htmlFor="name">Agent Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter agent name"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Agent Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter agent email"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary custom-color"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Agent'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/agents')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AddAgent;
