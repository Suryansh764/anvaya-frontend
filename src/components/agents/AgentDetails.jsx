import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './AgentDetails.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AgentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    allAgents,
    allLeads,
    loading,
    error,
    deleteAgent,
    refetchAllAgents
  } = useAppContext();

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Newest');

  useEffect(() => {
    refetchAllAgents();
  }, [id, refetchAllAgents]);

  const agent = allAgents.find(agent => agent._id === id);
  const leads = (allLeads || []).filter(lead => lead?.salesAgent?._id === id);

  const handleEdit = () => navigate(`/agents/${id}/edit`);

 const handleDelete = async () => {
  if (window.confirm('Are you sure you want to delete this agent? This cannot be undone.')) {
    const { success, message } = await deleteAgent(id);
    if (success) {
      toast.success(message);
      setTimeout(() => {
        navigate('/agents');
      }, 1500);
    } else {
      toast.error(message);
    }
  }
};


  const filteredAndSortedLeads = leads
    .filter((lead) => {
      const statusMatch = statusFilter === 'All' || lead.status === statusFilter;
      const priorityMatch = priorityFilter === 'All' || lead.priority === priorityFilter;
      return statusMatch && priorityMatch;
    })
    .sort((a, b) => {
      if (sortOption === 'Newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === 'Oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOption === 'TimeToClose') {
        return (a.timeToClose || Infinity) - (b.timeToClose || Infinity);
      }
      return 0;
    });

  if (loading) {
    return <div className="lead-detail-page"><p className="loading-message">Loading agent details...</p></div>;
  }

  if (error) {
    return <div className="lead-detail-page"><p className="error-message">Error loading agent details: {error}</p></div>;
  }

  if (!agent) {
    return <div className="lead-detail-page"><p className="not-found-message">Agent not found.</p></div>;
  }

  return (
    <div className="lead-detail-page">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="lead-detail-card">
        <div className="lead-detail__header">
          <h1 className="lead-detail__name">{agent.name}</h1>
          <div className="lead-detail__header-actions">
            <button onClick={handleEdit} className="btn btn-secondary custom-color__edit">Edit</button>
            <button onClick={handleDelete} className="btn btn-primary">Delete</button>
          </div>
        </div>

        <div className="lead-detail__content">
          <div className="lead-detail__section lead-detail__section--info">
            <h2 className="section-title">Agent Information</h2>
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Email:</span><span className="info-value">{agent.email}</span></div>
              <div className="info-item"><span className="info-label">Role:</span><span className="info-value">{agent.role || 'Sales Agent'}</span></div>
              <div className="info-item"><span className="info-label">Joined On:</span><span className="info-value">{new Date(agent.createdAt).toLocaleDateString()}</span></div>
              <div className="info-item"><span className="info-label">Total Leads Assigned:</span><span className="info-value">{leads.length}</span></div>
            </div>
          </div>

          <div className="lead-detail__section lead-detail__section--leads">
            <h2 className="section-title">Assigned Leads</h2>

            <div className="filter-bar">
              <label>
                Status:&nbsp;
                <select className='form-select mb-3' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </label>

              <label>
                Priority:&nbsp;
                <select className='form-select' value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>

              <label>
                Sort By:&nbsp;
                <select className='form-select' value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="Newest">Newest First</option>
                  <option value="Oldest">Oldest First</option>
                  <option value="TimeToClose">Time to Close</option>
                </select>
              </label>
            </div>

            {filteredAndSortedLeads.length > 0 ? (
              <div className="lead-cards-container">
                {filteredAndSortedLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="lead-card"
                    onClick={() => navigate(`/leads/${lead._id}`)}
                  >
                    <h3 className="lead-card__name">{lead.name}</h3>
                    <div className="lead-card__info">
                      <p><strong>Status:</strong> {lead.status}</p>
                      <p><strong>Priority:</strong> {lead.priority}</p>
                      {lead.timeToClose && (
                        <p><strong>Time to Close:</strong> {lead.timeToClose} days</p>
                      )}
                      <p><strong>Created:</strong> {new Date(lead.createdAt).toLocaleDateString()}</p>
                      {lead.tags?.length > 0 && (
                        <p>
                          <strong>Tags:</strong>{' '}
                          {lead.tags.map((tag, idx) => (
                            <span key={idx} className="lead-tag">{tag.name}</span>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="info-value">No leads match the selected filters. Please try some other filter.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
