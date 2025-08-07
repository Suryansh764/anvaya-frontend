import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LeadList.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../context/AppContext'; 
const LeadList = () => {
  const location = useLocation();
  const { state } = location;

  const { allLeads, loading, error } = useAppContext(); 
  const leads = allLeads || [];

  const [filterStatus, setFilterStatus] = useState('');
  const [filterAgent, setFilterAgent] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    if (state?.leadCreated) {
      toast.success('New lead added successfully!', {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  const getStatusClass = (status) => {
    if (!status) return 'default';
    return status.toLowerCase().replace(/\s+/g, '-');
  };

const filteredLeads = leads.filter(lead => {
  if (!lead) return false; 
  const statusMatch = filterStatus === '' || filterStatus === 'all' || lead.status === filterStatus;
  const agentMatch = filterAgent === '' || filterAgent === 'all' ||
    (lead.salesAgent?.name === filterAgent); 
  return statusMatch && agentMatch;
});


  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        const statusOrder = { 'Closed': 5, 'Proposal Sent': 4, 'Contacted': 3, 'Qualified': 2, 'New': 1 };
        return (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999);
      case 'priority':
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
      case 'timeToClose':
        return a.timeToClose - b.timeToClose;
      default:
        return 0;
    }
  });

 const uniqueAgents = [...new Set(
  (leads || [])
    .map(lead => lead?.salesAgent?.name)
    .filter(Boolean)
)];

  if (loading) {
    return (
      <div className="lead-list-page">
        <div className="lead-list__header">
          <h1 className="lead-list__title">Lead List</h1>
        </div>
        <div className="lead-list__loading">
          <p>Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lead-list-page">
        <div className="lead-list__header">
          <h1 className="lead-list__title">Lead List</h1>
        </div>
        
      <div className="lead-detail-page">
        <p className="error-message">Error loading leads: {error}</p>
      </div>
      </div>
    );
  }

  return (
    <div className="lead-list-page">
      <div className="lead-list__header">
        <h1 className="lead-list__title">Lead List</h1>
        <Link to="/leads/new" className="btn btn-primary custom-color">Add New Lead</Link>
      </div>

      <div className="lead-list__filters">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="" disabled>Select Status</option>
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

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
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="" disabled>Sort Options</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="timeToClose">Time to Close</option>
          </select>
        </div>
      </div>

      <div className="lead-list__content">
        {sortedLeads.length === 0 ? (
          <div className="lead-list__empty">
            <p>No leads found matching your filters.</p>
          </div>
        ) : (
          sortedLeads.map(lead => {
            const statusClass = getStatusClass(lead.status);
            
            return (
              <Link key={lead._id} to={`/leads/${lead._id}`} className="lead-card">
                <div className="lead-card__header">
                  <h3 className="lead-card__name">{lead.name}</h3>
                  <span className={`lead-card__status lead-card__status--${statusClass}`}>
                    {lead.status || 'Unknown'}
                  </span>
                </div>
                <div className="lead-card__details">
                  <p className="lead-card__agent">
                    Agent: {lead.salesAgent ? lead.salesAgent.name : 'Unassigned'}
                  </p>
                  <p className="lead-card__source">Source: {lead.source || 'Unknown'}</p>
                  <p className="lead-card__priority">Priority: {lead.priority || 'Medium'}</p>
                  <p className="lead-card__time">Time to Close: {lead.timeToClose || 0} days</p>

                 
                  {lead.tags && lead.tags.length > 0 && (
                    <div className="lead-card__tags">
                      {lead.tags.map(tag => (
                        <span key={tag._id} className="lead-card__tag">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default LeadList;
