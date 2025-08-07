import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './AgentManagement.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../context/AppContext';

const AgentManagement = () => {
  const { allAgents, loading, error, fetchSingleAgent } = useAppContext(); 
  const [agents, setAgents] = useState(allAgents || []);
  const [agentsLoading, setAgentsLoading] = useState(loading);
  const [agentsError, setAgentsError] = useState(error);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAgents = async () => {
      setAgentsLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/agents');
        if (!res.ok) throw new Error('Failed to fetch agents');
        const data = await res.json();
        setAgents(data.data?.agents || []);
      } catch (err) {
        console.error(err);
        setAgentsError(err.message || 'Error fetching agents');
      } finally {
        setAgentsLoading(false);
      }
    };

    refreshAgents();
  }, []);

  return (
    <div className="agent-management">
      <ToastContainer />
      <div className="agent-management__header">
        <h1 className="agent-management__title">Sales Agent Management</h1>
        <button className="btn btn-primary custom-color" onClick={() => navigate('/agents/new')}>
          Add New Agent
        </button>
      </div>

      <div className="agent-management__content">
        <div className="agent-list">
          {agentsLoading ? (
            <p>Loading agents...</p>
          ) : agentsError ? (
             
      <div className="lead-detail-page">
        <p className="error-message">Error loading dashboard: {agentsError}</p>
      </div>
          ) : agents.length === 0 ? (
            <p>No agents found.</p>
          ) : (
            agents.map(agent => (
              <div key={agent._id} className="agent-card">
                <div className="agent-card__avatar">
                  {agent.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>

                <Link
                  to={`/agents/${agent._id}`}
                  className="agent-card__info-link"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="agent-card__info">
                    <h3 className="agent-card__name">{agent.name}</h3>
                    <p className="agent-card__email">{agent.email}</p>
                  </div>
                </Link>

                <div className="agent-card__actions">
                  <Link
                    to={`/agents/${agent._id}/edit`}
                    className="btn btn--small btn-secondary custom-color__edit"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentManagement;
