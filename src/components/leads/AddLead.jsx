import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddLead.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../../context/AppContext';

const AddLead = () => {
  const navigate = useNavigate();

  const { allAgents, allTags, refetchAllLeads } = useAppContext();
  const agents = allAgents || [];
  const availableTags = allTags || [];

  const [formData, setFormData] = useState({
    name: '',
    source: 'Referral',
    salesAgent: '',
    status: 'New',
    priority: 'Medium',
    timeToClose: 30,
    tags: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const selectedAgent = agents.find(agent => agent.name === formData.salesAgent);
      if (!selectedAgent) {
        toast.error('⚠️ Please select a valid sales agent');
        throw new Error('Please select a valid sales agent');
      }

      const leadData = {
        name: formData.name,
        source: formData.source,
        salesAgent: selectedAgent._id,
        status: formData.status,
        priority: formData.priority,
        timeToClose: formData.timeToClose,
        tags: formData.tags
      };

      const response = await fetch('https://anvaya-backend-sigma.vercel.app/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(` ${errorData.message || 'Failed to create lead'}`);
        throw new Error(errorData.message || 'Failed to create lead');
      }

      const result = await response.json();
      toast.success(' Lead created successfully!');
      await refetchAllLeads();
      setTimeout(() => {
        navigate('/leads', { state: { leadCreated: true } });
      }, 1800);
    } catch (err) {
      console.error('Error creating lead:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (e) => {
    const options = Array.from(e.target.options);
    const selectedIds = options
      .filter(option => option.selected)
      .map(option => option.value);

    setFormData(prev => ({
      ...prev,
      tags: selectedIds
    }));
  };

  return (
    <div className="add-lead">
      <div className="add-lead__header">
        <h1 className="add-lead__title">Add New Lead</h1>
      </div>

      {error && (
        <div className="add-lead__error">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-lead__form">
        <div className="form-group">
          <label htmlFor="name">Lead Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter lead name"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="source">Lead Source:</label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Email">Email</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="salesAgent">Sales Agent:</label>
            <select
              id="salesAgent"
              name="salesAgent"
              value={formData.salesAgent}
              onChange={handleChange}
              required
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="">Select an agent</option>
              {agents.map(agent => (
                <option key={agent._id} value={agent.name}>{agent.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Lead Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="timeToClose">Time to Close (days):</label>
          <input
            type="number"
            id="timeToClose"
            name="timeToClose"
            value={formData.timeToClose}
            onChange={handleChange}
            min="1"
            className="form-input"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Tags:</label>
          <div className="tag-checkboxes">
            {availableTags.map(tag => (
              <label key={tag._id} className="checkbox-label">
                <input
                  type="checkbox"
                  className='mx-1 form-label'
                  value={tag._id}
                  checked={formData.tags.includes(tag._id)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const tagId = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      tags: isChecked
                        ? [...prev.tags, tagId]
                        : prev.tags.filter(id => id !== tagId)
                    }));
                  }}
                  disabled={isSubmitting}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary custom-color"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Lead'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="btn btn-secondary cancel-custom-color"
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

export default AddLead;
