import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './EditLead.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../../context/AppContext'; 

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { updateLead, allAgents, allTags } = useAppContext();

const availableTags = allTags || [];

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    status: '',
    source: '',
    priority: '',
    timeToClose: '',
    salesAgent: '',
    tags: []  
  });

  useEffect(() => {
    fetch(`https://anvaya-backend-sigma.vercel.app/api/leads/${id}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('deleted');
          } else {
            throw new Error('network');
          }
        }
        return res.json();
      })
      .then(data => {
        const leadData = data.data.lead;
        setLead(leadData);
        setForm({
          name: leadData.name || '',
          status: leadData.status || '',
          source: leadData.source || '',
          priority: leadData.priority || '',
          timeToClose: leadData.timeToClose || '',
          salesAgent: leadData.salesAgent?._id || '',
          tags: leadData.tags ? leadData.tags.map(tag => tag._id) : []
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching lead:', err.message);
        setLoading(false);
        if (err.message === 'deleted') {
          setLead(null);
          toast.error("This lead has been deleted or doesn't exist.");
          setTimeout(() => {
            navigate('/leads');
          }, 2000);
        } else {
          toast.error('Failed to fetch lead data');
        }
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
     setIsSubmitting(true);
     const { success, message } = await updateLead(id, form);
     if (success) {
      toast.success('Lead updated successfully!');
      setTimeout(() => {
        navigate(`/leads/${id}`);
      }, 1500);
    } else {
      toast.error(`${message}`);
    }
    
  };

  const handleTagToggle = (tagId) => {
  setForm(prev => ({
    ...prev,
    tags: prev.tags.includes(tagId)
      ? prev.tags.filter(id => id !== tagId)
      : [...prev.tags, tagId]
  }));
};

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/leads/${id}`)}
          >
            ← Back to Lead
          </button>

          <div className="edit-lead-page">
            <h1>Edit Lead</h1>

            <form onSubmit={handleSubmit} className="edit-form">

              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  required
                />
              </div>

              <div className="form-group">
                <label>Sales Agent</label>
                <select
                  name="salesAgent"
                  value={form.salesAgent}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select agent</option>
                  {allAgents.map(agent => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange} required>
                  <option value="">Select status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Source</label>
                <select name="source" value={form.source} onChange={handleChange} required>
                  <option value="">Select source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange} required>
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Time to Close (days)</label>
                <input
                  name="timeToClose"
                  value={form.timeToClose}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
  <label>Tags</label>
  <div className="tag-checkboxes">
    {availableTags.map(tag => (
      <label key={tag._id} className="checkbox-label">
        <input
          type="checkbox"
          className='me-2'
          value={tag._id}
          checked={form.tags.includes(tag._id)}
          onChange={() => handleTagToggle(tag._id)}
          disabled={isSubmitting}
        />
        {tag.name}
      </label>
    ))}
  </div>
</div>

            
          <button type="submit" className="btn btn-primary custom-color" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default EditLead;
