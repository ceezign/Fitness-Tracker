import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { exportToJSON, exportToCSV } from '../services/exportService';

// Components
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AddSessionModal from '../components/AddSessionModal';

// Views
import HomeView from './HomeView';
import SessionsView from './SessionsView';
import GoalsView from './GoalsView';
import StatsView from './StatsView';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, goalsRes] = await Promise.all([
        api.get('/sessions'),
        api.get('/goals').catch(() => ({ data: { data: [] } })) // Goals endpoint might not exist yet
      ]);
      
      setSessions(sessionsRes.data.data || []);
      setGoals(goalsRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAddSession = async (sessionData) => {
    try {
      const response = await api.post('/sessions', sessionData);
      setSessions([response.data.data, ...sessions]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding session:', error);
      alert('Failed to add session. Please try again.');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    
    try {
      await api.delete(`/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s._id !== sessionId));
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session. Please try again.');
    }
  };

  const handleExport = (format) => {
    const exportData = {
      profile: {
        name: user?.name,
        email: user?.email,
        totalSessions: sessions.length,
        memberSince: user?.createdAt
      },
      sessions: sessions,
      goals: goals,
      summary: {
        totalSessions: sessions.length,
        totalCalories: sessions.reduce((sum, s) => sum + s.burned, 0),
        totalDuration: sessions.reduce((sum, s) => sum + s.duration, 0),
        exportDate: new Date().toISOString()
      }
    };
    
    const filename = `fitness-data-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'json') {
      exportToJSON(exportData, `${filename}.json`);
    } else if (format === 'csv') {
      exportToCSV(sessions, `${filename}.csv`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'home': return 'Performance Dashboard';
      case 'sessions': return 'Training Sessions';
      case 'goals': return 'Your Objectives';
      case 'stats': return 'Analytics & Insights';
      default: return 'Dashboard';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="ml-20 p-8">
        {/* Header */}
        <Header 
          title={getViewTitle()}
          user={user}
          sessions={sessions}
          onAddSession={() => setShowAddModal(true)}
          onExport={handleExport}
        />

        {/* Views */}
        {activeView === 'home' && (
          <HomeView sessions={sessions} goals={goals} />
        )}
        
        {activeView === 'sessions' && (
          <SessionsView 
            sessions={sessions} 
            onDelete={handleDeleteSession}
          />
        )}
        
        {activeView === 'goals' && (
          <GoalsView goals={goals} setGoals={setGoals} />
        )}
        
        {activeView === 'stats' && (
          <StatsView sessions={sessions} />
        )}
      </div>

      {/* Add Session Modal */}
      <AddSessionModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddSession}
      />
    </div>
  );
};

export default Dashboard;