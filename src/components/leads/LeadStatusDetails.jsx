import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './LeadDetail.css';
import { useAppContext } from '../../context/AppContext'; 

const LeadStatusDetails = () => {
  const { status } = useParams();
  const navigate = useNavigate();

  const [filterAgent, setFilterAgent] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('');

  const isActivePage = status === 'Active';
  const isAllPage = status === 'All';

  const { allLeads, loading, error } = useAppContext(); 
let leads = Array.isArray(allLeads) ? allLeads : [];


  if (!isAllPage && !isActivePage) {
  leads = leads.filter((lead) => lead?.status === 'Closed');
}

if (isActivePage) {
  leads = leads.filter((lead) => lead?.status !== 'Closed');
}

  const uniqueAgents = [...new Set(
  leads
    .filter(lead => lead?.salesAgent?.name)
    .map(lead => lead.salesAgent.name)
)];


  const priorities = ['High', 'Medium', 'Low'];

  const filteredLeads = leads.filter((lead) => {
    const agentMatch = filterAgent === '' || filterAgent === 'all' || (lead.salesAgent && lead.salesAgent.name === filterAgent);
    const priorityMatch = filterPriority === '' || filterPriority === 'all' || lead.priority === filterPriority;
    return agentMatch && priorityMatch;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status': {
        const statusOrder = { 'Closed': 5, 'Proposal Sent': 4, 'Contacted': 3, 'Qualified': 2, 'New': 1 };
        return (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999);
      }
      case 'latest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'timeToClose':
        return a.timeToClose - b.timeToClose;
      default:
        return 0;
    }
  });

  const formatStatus = (status) => {
    if (!status) return 'default';
    return status.toLowerCase().replace(/\s+/g, '-');
  };

  if (loading) {
    return <div className="lead-detail-page"><p className="loading-message">Loading leads...</p></div>;
  }

  if (error) {
    return <div className="lead-detail-page"><p className="error-message">Error loading leads: {error}</p></div>;
  }

  return (
    <div className="lead-detail-page">
      <h1 className="lead-detail__name mb-5">
        {isAllPage && 'All Leads'}
        {isActivePage && 'Active Leads'}
        {!isActivePage && !isAllPage && 'Closed Leads'}
      </h1>

      <div className="lead-list__filters mb-4">

        <div className="filter-group">
          <label>Agent:</label>
          <select 
            value={filterAgent} 
            onChange={(e) => setFilterAgent(e.target.value)}
            className="filter-select"
          >
            <option value="" disabled>Select Agent</option>
            <option value="all">All Agents</option>
            {uniqueAgents.map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
        </div>


        <div className="filter-group">
          <label>Priority:</label>
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="" disabled>Select Priority</option>
            <option value="all">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>


        <div className="filter-group">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="" disabled>Sort Options</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="latest">Latest</option>
            <option value="timeToClose">Time to Close</option>
          </select>
        </div>
      </div>

      {sortedLeads.length === 0 ? (
        <p className="info-value">No leads found under this filter.</p>
      ) : (
        <div className="lead-detail__content">
          {sortedLeads.map((lead) => (
            lead && (  <div key={lead._id} className="lead-detail-card">
              <div className="lead-detail__header">
                <h2 className="lead-detail__name">{lead.name}</h2>
                <button
                  className="btn btn-primary custom-color"
                  onClick={() => navigate(`/leads/${lead._id}`)}
                >
                  View Details
                </button>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className={`lead-detail__status lead-detail__status--${formatStatus(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sales Agent:</span>
                  <span className="info-value">{lead.salesAgent?.name || 'Unassigned'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Priority:</span>
                  <span className="info-value">{lead.priority}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Time to Close:</span>
                  <span className="info-value">{lead.timeToClose} days</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tags:</span>
                  <span className="info-value">
                    {lead.tags && lead.tags.length > 0
                      ? lead.tags.map(tag => tag.name).join(', ')
                      : 'No Tags'}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Created At:</span>
                  <span className="info-value">{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>)
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadStatusDetails;
