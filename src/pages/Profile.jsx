import { useParams, useNavigate } from 'react-router-dom';
import './Profile.css'; 
import { useAppContext } from '../context/AppContext'; 

const Profile = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { allAgents, allLeads, loading, error } = useAppContext(); 

  const agent = allAgents.find(agent => agent._id === id);
  const leads = allLeads.filter(lead => lead.salesAgent?._id === id);

  const handleEdit = () => navigate(`/agents/${id}/edit`);

  if (!id) {
    return (
      <div className="lead-detail-page">
        <p className="error-message">No agent ID provided in URL.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="lead-detail-page">
        <p className="loading-message">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lead-detail-page">
        <p className="error-message">Error loading profile: {error}</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="lead-detail-page">
        <p className="not-found-message">Agent profile not found.</p>
      </div>
    );
  }

  return (
    <div className="lead-detail-page">
      <div className="lead-detail-card">
        <div className="lead-detail__header">
          <h1 className="lead-detail__name">{agent.name}'s Profile</h1>
          <div className="lead-detail__header-actions">
            <button onClick={handleEdit} className="btn btn-secondary custom-color__edit">Edit</button>
          </div>
        </div>

        <div className="lead-detail__content">
          <div className="lead-detail__section lead-detail__section--info">
            <h2 className="section-title">Contact Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{agent.email}</span>
              </div>
          
              <div className="info-item">
                <span className="info-label">Role:</span>
                <span className="info-value">{agent.role || 'Sales Agent'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Joined:</span>
                <span className="info-value">{new Date(agent.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Leads Assigned:</span>
                <span className="info-value">{leads.length}</span>
              </div>
            </div>
          </div>

          <div className="lead-detail__section lead-detail__section--leads">
            <h2 className="section-title">My Leads</h2>
            {leads.length > 0 ? (
              <div className="tag-list">
                {leads.map((lead) => (
                  <span
                    key={lead._id}
                    className="tag-item"
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {lead.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="info-value">No leads assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
