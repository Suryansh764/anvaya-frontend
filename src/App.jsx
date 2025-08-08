import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LeadList from './pages/LeadList';
import LeadDetail from './components/leads/LeadDetail';
import AddLead from './components/leads/AddLead';
import LeadManagement from './components/leads/LeadManagement';
import Reports from './pages/Reports';
import AgentManagement from './pages/AgentManagement';
import AgentDetails from './components/agents/AgentDetails';
import EditLead from './components/leads/EditLead';
import LeadStatusDetails from './components/leads/LeadStatusDetails';
import Profile from './pages/Profile';
import EditAgent from './components/agents/EditAgent';
import AddAgent from './components/agents/AddAgent';
import './App.css';

function App() {
  return (
    <Router>
      <AppProvider>
         <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<LeadList />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/leads/new" element={<AddLead />} />
            <Route path="/lead-management" element={<LeadManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/agents" element={<AgentManagement />} />
            <Route path="/leads/:id/edit" element={<EditLead />} />
            <Route path="/agents/:id" element={<AgentDetails />} />
            <Route path="/leads/status/:status" element={<LeadStatusDetails />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/agents/:id/edit" element={<EditAgent />} />
            <Route path="/agents/new" element={<AddAgent />} />

            
          </Routes>
        </Layout>
       
      </AppProvider>
     
    </Router>
  );
}

export default App;