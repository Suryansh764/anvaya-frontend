import './Dashboard.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext'; 

const Dashboard = () => {
  const { allLeads, loading, error } = useAppContext();
  const leads = allLeads || [];

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredLeads = filterStatus === 'all'
    ? leads
    : leads.filter(lead => lead.status === filterStatus);

  const getLeadsByStatus = (status) => {
    return leads.filter(lead => lead.status === status).length;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard__title">Dashboard</h1>
        <div className="dashboard__loading">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard__title">Dashboard</h1>
      
      <div className="lead-detail-page">
        <p className="error-message">Error loading dashboard: {error}</p>
      </div>
    
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h2 className='dashboard__title'>Dashboard</h2>
        <Link to="/leads/new" className="btn btn-primary custom-color">Add New Lead</Link>
      </div>

      <div className="dashboard__stats">
        <div className="stat-card">
          <h3 className="stat-card__title">New Leads</h3>
          <p className="stat-card__value stat-card__value--blue">{getLeadsByStatus('New')}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-card__title">Contacted</h3>
          <p className="stat-card__value stat-card__value--yellow">{getLeadsByStatus('Contacted')}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-card__title">Qualified</h3>
          <p className="stat-card__value stat-card__value--green">{getLeadsByStatus('Qualified')}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-card__title">Proposal Sent</h3>
          <p className="stat-card__value stat-card__value--green">{getLeadsByStatus('Proposal Sent')}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-card__title">Closed</h3>
          <p className="stat-card__value stat-card__value--green">{getLeadsByStatus('Closed')}</p>
        </div>
      </div>

      <div className="dashboard__recent">
        <div className="dashboard__filters">
          <div className="filter-group">
            <label htmlFor="statusFilter" className='fs-5'>Filter by Status:</label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select mb-4"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <h2 className="dashboard__section-title">Recent Leads</h2>
        <div className="lead-list">
          {filteredLeads.length > 0 ? (
             [...filteredLeads]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(lead => (
              <Link
                key={lead._id}
                to={`/leads/${lead._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="lead-item">
                  <div className="lead-item__info">
                    <h3 className="lead-item__name">{lead.name}</h3>
                    <p className="lead-item__agent">
                      {lead.salesAgent ? `Assigned to ${lead.salesAgent.name}` : 'Unassigned'}
                    </p>

                    <div className="lead-item__tags">
                      {lead.tags && lead.tags.length > 0 ? (
                        lead.tags.map((tag, index) => (
                          <span key={index} className="tag-badge">
                            {typeof tag === 'string' ? tag : tag.name || 'Tag'}
                          </span>
                        ))
                      ) : (
                        <span className="tag-badge tag-badge--light">No Tags</span>
                      )}
                    </div>
                  </div>

                  <span className={`lead-item__status lead-item__status--${lead.status?.toLowerCase() || 'default'}`}>
                    {lead.status || 'Unknown'}
                  </span>
                </div>
              </Link>
            ))
          ):(
            <p className="info-value">No leads match the selected filters. Please try some other filter.</p>
          )}
         
              
            
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
