import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './EditAgent.css'; 

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../../context/AppContext';

const EditAgent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSingleAgent, updateAgent } = useAppContext();

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const loadAgent = async () => {
      const { agent, error } = await fetchSingleAgent(id);
      if (error) {
        console.error("Failed to fetch agent", error);
        toast.error('❌ Failed to load agent data');
        setLoading(false);
        return;
      }
      setAgent(agent);
      setForm({
        name: agent.name || '',
        email: agent.email || ''
      });
      setLoading(false);
    };
    loadAgent();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { success, message } = await updateAgent(id, form);

    if (success) {
      toast.success('Agent updated successfully!');
      setTimeout(() => {
        navigate(`/agents/${id}`);
      }, 1500);
    } else {
      toast.error(`${message}`);
    }

    setIsSubmitting(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <button
        className="btn btn-outline-secondary"
        onClick={() => navigate(`/agents/${id}`)}
      >
        ← Back to Agent
      </button>

      <div className="edit-lead-page">
        <h1>Edit Agent</h1>

        <form onSubmit={handleSubmit} className="edit-form">
          {['name', 'email'].map(field => (
            <div key={field} className="form-group">
              <label>{field}</label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                type={field === 'email' ? 'email' : 'text'}
                disabled={isSubmitting}
              />
            </div>
          ))}

          <button type="submit" className="btn btn-primary custom-color" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={2000}
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

export default EditAgent;