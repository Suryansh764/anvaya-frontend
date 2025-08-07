
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';


const LeadManagement = () => {
  const { leads, updateLead } = useAppContext();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState('all');

  const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'];
  const agents = [...new Set(leads.map(lead => lead.agent))];

  const filteredLeads = leads.filter(lead => {
    const statusMatch = selectedStatus === 'all' || lead.status === selectedStatus;
    const agentMatch = selectedAgent === 'all' || lead.agent === selectedAgent;
    return statusMatch && agentMatch;
  });

  const handleStatusChange = (leadId, newStatus) => {
    updateLead(leadId, { status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'status-new';
      case 'Contacted': return 'status-contacted';
      case 'Qualified': return 'status-qualified';
      case 'Proposal Sent': return 'status-proposal';
      case 'Closed': return 'status-closed';
      default: return 'status-default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-default';
    }
  };

  return (
    <div className="lead-management">
      <div className="lead-management__header">
        <h1 className="lead-management__title">Lead Management</h1>
        <p className="lead-management__subtitle">
          Manage and track all your leads in one place
        </p>
      </div>


      <div className="lead-management__filters">
        <div className="filter-section">
          <label className="filter-label">Filter by Status:</label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Filter by Agent:</label>
          <select 
            value={selectedAgent} 
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Agents</option>
            {agents.map(agent => (
              <option key={agent} value={agent}>
                {typeof agent === 'object' ? agent.name : agent}
              </option>
            ))}
          </select>
        </div>
      </div>


      <div className="lead-management__grid">
        {filteredLeads.map(lead => (
          <div key={lead._id} className="lead-card">
            <div className="lead-card__header">
              <h3 className="lead-card__name">{lead.name}</h3>
              <div className="lead-card__badges">
                <span className={`status-badge ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <span className={`priority-badge ${getPriorityColor(lead.priority)}`}>
                  {lead.priority}
                </span>
              </div>
            </div>

            <div className="lead-card__details">
              <div className="detail-row">
                <span className="detail-label">Agent:</span>
                <span className="detail-value">
                  {typeof lead.agent === 'object' ? lead.agent.name : lead.agent}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Source:</span>
                <span className="detail-value">{lead.source}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time to Close:</span>
                <span className="detail-value">{lead.timeToClose} days</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Comments:</span>
                <span className="detail-value">{lead.comments?.length || 0}</span>
              </div>
            </div>

            <div className="lead-card__actions">
              <div className="status-selector">
                <label>Update Status:</label>
                <select 
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                  className="status-select"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="action-buttons">
                <button className="btn btn--small btn--primary">View Details</button>
                <button className="btn btn--small btn--secondary">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="lead-management__summary">
        <div className="summary-card">
          <h3>Total Leads</h3>
          <p className="summary-number">{leads.length}</p>
        </div>
        <div className="summary-card">
          <h3>Active Leads</h3>
          <p className="summary-number">
            {leads.filter(lead => lead.status !== 'Closed').length}
          </p>
        </div>
        <div className="summary-card">
          <h3>High Priority</h3>
          <p className="summary-number">
            {leads.filter(lead => lead.priority === 'High').length}
          </p>
        </div>
        <div className="summary-card">
          <h3>Avg Time to Close</h3>
          <p className="summary-number">
            {leads.length > 0
              ? Math.round(leads.reduce((sum, lead) => sum + lead.timeToClose, 0) / leads.length)
              : 0} days
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadManagement;
