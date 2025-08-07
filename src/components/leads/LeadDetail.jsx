import { useParams, useNavigate } from 'react-router-dom';
import './LeadDetail.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [leadLoading, setLeadLoading] = useState(true);
  const [leadError, setLeadError] = useState(null);

  const [localComments, setLocalComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [isDeleted, setIsDeleted] = useState(false); 

  const {
    allAgents,
    loading,
    error,
    deleteLead,
    fetchLeadComments,
    submitComment,
    fetchSingleLead
  } = useAppContext();

  const agents = allAgents || [];

  useEffect(() => {
    if (isDeleted) return; 

    const loadLead = async () => {
      setLeadLoading(true);
      const { lead, error } = await fetchSingleLead(id);
      if (error) {
        setLeadError(error);
      } else {
        setLead(lead);
      }
      setLeadLoading(false);
    };

    loadLead();
  }, [id, fetchSingleLead, isDeleted]);

  useEffect(() => {
    if (isDeleted) return; 

    const getComments = async () => {
      const { comments, error } = await fetchLeadComments(id);
      if (error) {
        setCommentsError(error);
      } else {
        setLocalComments(comments);
      }
      setCommentsLoading(false);
    };

    getComments();
  }, [id, fetchLeadComments, isDeleted]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id);
        toast.success("Lead deleted successfully");
        setIsDeleted(true); 
        setTimeout(() => navigate('/leads'), 1500); 
      } catch (err) {
        console.error('Delete error:', err);
        toast.error("Failed to delete the lead");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/leads/${id}/edit`);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return toast.error("Comment cannot be empty");
    if (!selectedAuthor) return toast.error("Please select an author");

    setIsSubmitting(true);

    const { newComment: addedComment, error } = await submitComment(id, newComment, selectedAuthor);

    if (error) {
      toast.error(error);
    } else {
      setLocalComments(prev => [addedComment, ...prev]);
      setNewComment('');
      setSelectedAuthor('');
      toast.success('Comment posted successfully');
    }

    setIsSubmitting(false);
  };

  const getStatusClass = (status) => {
    if (!status) return 'default';
    return status.toLowerCase().replace(/\s+/g, '-');
  };

  
  if (isDeleted) {
    return (
      <div className="lead-detail-page">
        <ToastContainer />
        <p className="success-message">Lead deleted successfully. Redirecting...</p>
      </div>
    );
  }

  if (loading || leadLoading || commentsLoading) {
    return <div className="lead-detail-page"><p className="loading-message">Loading lead details...</p></div>;
  }

  if (error || leadError || commentsError) {
    return <div className="lead-detail-page"><p className="error-message">Error loading lead details: {error || leadError || commentsError}</p></div>;
  }

  if (!lead) {
    return <div className="lead-detail-page"><p className="not-found-message">Lead not found.</p></div>;
  }

  const statusClass = getStatusClass(lead.status);

  return (
    <div className="lead-detail-page">
      <ToastContainer />
      <div className="lead-detail-card">
        <div className="lead-detail__header">
          <h1 className="lead-detail__name">{lead.name}</h1>
          <div className="lead-detail__header-actions">
            <button onClick={handleEdit} className="btn btn-secondary custom-color__edit">Edit</button>
            <button onClick={handleDelete} className="btn btn-primary">Delete</button>
          </div>
        </div>

        <div className="lead-detail__content">
          <div className="lead-detail__section lead-detail__section--info">
            <h2 className="section-title">Lead Information</h2>
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Status:</span><span className={`lead-detail__status lead-detail__status--${statusClass}`}>{lead.status || 'Unknown'}</span></div>
              <div className="info-item"><span className="info-label">Sales Agent:</span><span className="info-value">{lead.salesAgent ? lead.salesAgent.name : 'Unassigned'}</span></div>
              <div className="info-item"><span className="info-label">Source:</span><span className="info-value">{lead.source || 'Unknown'}</span></div>
              <div className="info-item"><span className="info-label">Priority:</span><span className="info-value">{lead.priority || 'Medium'}</span></div>
              <div className="info-item"><span className="info-label">Time to Close:</span><span className="info-value">{lead.timeToClose || 0} days</span></div>
              <div className="info-item"><span className="info-label">Created At:</span><span className="info-value">{new Date(lead.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>

          <div className="lead-detail__section lead-detail__section--contact">
            <h2 className="section-title">Agent Details</h2>
            <p><span className="info-label">Email:</span> <span className="info-value">{lead?.salesAgent?.email || 'N/A'}</span></p>
          </div>

          <div className="lead-detail__section lead-detail__section--tags">
            <h2 className="section-title">Tags</h2>
            {lead.tags && lead.tags.length > 0 ? (
              <div className="tag-list">
                {lead.tags.map(tag => (
                  <span key={tag._id} className="tag-item">{tag.name}</span>
                ))}
              </div>
            ) : (
              <p className="info-value">No tags assigned.</p>
            )}
          </div>

          <div className="lead-detail__section lead-detail__section--comments">
            <h2 className="section-title">Comments</h2>
            <form className="comment-form" onSubmit={(e) => {
              e.preventDefault();
              handleSubmitComment();
            }}>
              <select value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)} required>
                <option value="">Who's the Author?</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>{agent.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
                required
              />
              <button type="submit" className="btn-primary custom-color" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </form>

            <div className="comments-list">
              {localComments.length > 0 ? (
                localComments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <p className="comment-text">"{comment.commentText}"</p>
                    <hr />
                    <p className="comment-meta">
                      {comment.author?.name || 'Unknown'} • {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="info-value">No comments available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
