import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [allLeads, setAllLeads] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsRes, agentsRes, tagsRes] = await Promise.all([
          fetch('https://anvaya-backend-sigma.vercel.app/api/leads'),
          fetch('https://anvaya-backend-sigma.vercel.app/api/agents'),
          fetch('https://anvaya-backend-sigma.vercel.app/api/tags'),
        ]);

        const leadsData = await leadsRes.json();
        const agentsData = await agentsRes.json();
        const tagsData = await tagsRes.json();

        setAllLeads(leadsData.data?.leads || []);
        setAllAgents(agentsData.data?.agents || []);
        setAllTags(tagsData.data?.tags || []);
      } catch (err) {
        console.error('Error loading app data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetchReportData = useCallback(async () => {
    setReportLoading(true);
    try {
      const response = await fetch('https://anvaya-backend-sigma.vercel.app/api/reports');
      const json = await response.json();
      setReportData(json.data);
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setReportLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchReportData();
  }, [refetchReportData]);

  const updateLead = async (id, updatedData) => {
    try {
      const res = await fetch(`https://anvaya-backend-sigma.vercel.app/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Failed to update lead');
      const updatedLead = await res.json();

      setAllLeads((prevLeads) =>
        prevLeads.map((lead) => (lead._id === id ? updatedLead : lead))
      );

      await refetchAllLeads();
      await refetchReportData(); 

      return { success: true, lead: updatedLead.data.lead };
    } catch (error) {
      console.error('Error updating lead:', error);
      return { success: false, message: error.message };
    }
  };

  const refetchAllAgents = useCallback(async () => {
    try {
      const response = await fetch('https://anvaya-backend-sigma.vercel.app/api/agents');
      const data = await response.json();
      setAllAgents(data.data?.agents || []);
      await refetchReportData(); 
    } catch (err) {
      console.error('Error refetching agents:', err);
    }
  }, [refetchReportData]);

  const deleteLead = async (id) => {
    try {
      const res = await fetch(`https://anvaya-backend-sigma.vercel.app/api/leads/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete lead');

      setAllLeads(prev => prev.filter(lead => lead._id !== id));
      await refetchReportData();
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const deleteAgent = async (id) => {
  try {
    const res = await fetch(`https://anvaya-backend-sigma.vercel.app/api/agents/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete agent');
    }

    setAllAgents(prev => prev.filter(agent => agent._id !== id));
    await refetchReportData(); 

    return { success: true, message: 'Agent deleted successfully' };
  } catch (err) {
    console.error('Error deleting agent:', err);
    return { success: false, message: err.message };
  }
};


  const fetchLeadComments = async (leadId) => {
    try {
      const res = await fetch(`https://anvaya-backend-sigma.vercel.app/api/leads/${leadId}/comments`);
      const data = await res.json();
      return { comments: data.comments || [], error: null };
    } catch (err) {
      console.error('Error loading comments:', err);
      return { comments: [], error: 'Failed to load comments' };
    }
  };

  const submitComment = async (leadId, commentText, authorId) => {
    try {
      const response = await fetch(`https://anvaya-backend-sigma.vercel.app/api/leads/${leadId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: commentText,
          author: authorId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add comment');
      }

      const data = await response.json();

      await refetchReportData(); 

      return { newComment: data.data, error: null };
    } catch (error) {
      console.error('Error submitting comment:', error);
      return { newComment: null, error: error.message || 'Error posting comment' };
    }
  };

  const fetchSingleLead = async (id) => {
    try {
      const res = await fetch(`https://anvaya-backend-sigma.vercel.app/api/leads/${id}`);
      if (res.status === 404) {
        return { lead: null, error: null };
      }
      if (!res.ok) {
        return { lead: null, error: null };
      }
      const data = await res.json();
      return { lead: data.data.lead, error: null };
    } catch {
      return { lead: null, error: null };
    }
  };

  const refetchAllLeads = useCallback(async () => {
    try {
      const response = await fetch('https://anvaya-backend-sigma.vercel.app/api/leads');
      const data = await response.json();
      setAllLeads(data.data?.leads || []);
      await refetchReportData(); 
    } catch (err) {
      console.error('Error refetching leads:', err);
    }
  }, [refetchReportData]);

  const fetchSingleAgent = async (id) => {
    try {
      const res = await fetch(`https://anvaya-backend-sigma.vercel.app/api/agents/${id}`);
      if (!res.ok) throw new Error('Failed to fetch agent');
      const data = await res.json();
      return { agent: data.data.agent, error: null };
    } catch (err) {
      console.error('Error fetching agent:', err);
      return { agent: null, error: err.message };
    }
  };

  const updateAgent = async (id, updatedFields) => {
    try {
      const res = await fetch(`https://anvaya-backend-sigma.vercel.app/api/agents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update agent');
      }

      const updatedAgent = await res.json();

      setAllAgents(prev =>
        prev.map(agent =>
          agent._id === id ? updatedAgent.data.agent : agent
        )
      );

      await refetchReportData(); 

      return { success: true, agent: updatedAgent.data.agent };
    } catch (error) {
      console.error('Error updating agent:', error);
      return { success: false, message: error.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        allLeads,
        allAgents,
        allTags,
        loading,
        error,
        updateLead,
        refetchAllAgents,
        deleteLead,
        deleteAgent,
        reportData,
        reportLoading,
        fetchLeadComments,
        submitComment,
        fetchSingleLead,
        refetchReportData, 
        refetchAllLeads,
        fetchSingleAgent,
        updateAgent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
