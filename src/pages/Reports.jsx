import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { useAppContext } from '../context/AppContext'; 
import './Reports.css';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Reports = () => {
  const { reportData, reportLoading } = useAppContext();
  const navigate = useNavigate();

  if (reportLoading) return <div className="reports-container">Loading reports...</div>;
  if (!reportData) return( <div className="reports-container">Failed to load reports.</div>);

  const {
    totalLeads,
    closedLeads,
    activeLeads,
    averageTimeToClose,
    leadsByStatus,
    leadsByPriority,
    leadsByAgent,
    recentActivity,
  } = reportData;

  const pieColors = [
    '#df4949', '#f5acac', '#fce4e4', '#facece',
    '#8e2626', '#400f0f', '#fdf3f3', '#ff9da7',
  ];

  const createPieData = (dataObj) => ({
    labels: Object.keys(dataObj),
    datasets: [
      {
        data: Object.values(dataObj),
        backgroundColor: pieColors,
        borderWidth: 1,
      },
    ],
  });

  const agentData = {
    labels: leadsByAgent.map((a) => a.name),
    datasets: [
      {
        data: leadsByAgent.map((a) => a.count),
        backgroundColor: pieColors,
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: leadsByAgent.map((a) => a.name),
    datasets: [
      {
        label: 'Closed Leads',
        data: leadsByAgent.map((a) => a.closed),
        backgroundColor: '#8e2626',
        borderRadius: 12,
        hoverBackgroundColor: '#f5acac',
        barThickness: 30,
      },
    ],
  };

  const enhancedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Closed: ${tooltipItem.raw}`,
        },
        backgroundColor: '#2d3748',
        titleColor: '#fff',
        bodyColor: '#f7fafc',
        borderColor: '#cbd5e0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
      },
    },
    layout: {
      padding: { top: 10, bottom: 10 },
    },
    scales: {
      x: {
        ticks: {
          color: '#2d3748',
          font: { size: 14, weight: '600' },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#718096',
          font: { size: 12 },
          stepSize: 1,
        },
        grid: {
          color: '#e2e8f0',
          borderDash: [4],
        },
      },
    },
  };

  const handleStatusClick = (status) => {
    navigate(`/leads/status/${encodeURIComponent(status)}`);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2 className="reports-title">Reports & Analytics Overview</h2>
      </div>


      <div className="report-grid">
        <div className="report-card clickable" onClick={() => handleStatusClick('All')}>
          <div className="report-title">Total Leads</div>
          <div className="report-value">{totalLeads}</div>
        </div>

        <div className="report-card clickable" onClick={() => handleStatusClick('Active')}>
          <div className="report-title">Active Leads</div>
          <div className="report-value">{activeLeads}</div>
        </div>

        <div className="report-card clickable" onClick={() => handleStatusClick('Closed')}>
          <div className="report-title">Closed Leads</div>
          <div className="report-value">{closedLeads}</div>
        </div>
      </div>


      <div className="charts-section">
        <div className="chart-block">
          <h4>Lead Status Distribution</h4>
          <Pie data={createPieData(leadsByStatus)} />
        </div>

        <div className="chart-block">
          <h4>Lead Priority Distribution</h4>
          <Pie data={createPieData(leadsByPriority)} />
        </div>

        <div className="chart-block">
          <h4>Leads by Agent</h4>
          <Pie data={agentData} />
        </div>

        <div className="chart-block wide-bar tall">
          <h4>Leads Closed by Sales Agent</h4>
          <div className="bar-chart-container">
            <Bar data={barData} options={enhancedBarOptions} />
          </div>
        </div>
      </div>

    
      <div className="recent-activity">
        <h5 className="mb-3 fw-semibold">Recent Activity</h5>
        {recentActivity.map((lead, index) => (
          <div
            className="activity-item"
            key={index}
            onClick={() => navigate(`/leads/${lead._id}`)}
            style={{ cursor: 'pointer' }}
          >
            <span className='mb-3'>
              <strong>{lead.name}</strong> → {lead.status} • {lead.agent}
            </span>
            <span className="activity-time">
              {new Date(lead.updatedAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
