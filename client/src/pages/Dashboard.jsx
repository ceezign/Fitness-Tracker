import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { exportToCSV, exportToCSV, exportToJSON } from '../services/exportService';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const [activeView, setActiveView] = useState('home');
    const [showAddModal, setShowAddModal] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [newSession, setNewSession] = useState({
        date: new Date().toISOString().split('T')[0],
        activity: 'Strength Training',
        duration: '',
        intensity: 'Medium',
        burned: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/sessions');
            setSessions(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleAddSession = async () => {
        if (newSession.duration && newSession.burned) {
            try {
                const response = await api.post('/sessions', {
                    ...newSession,
                    duration: parseInt(newSession.duration),
                    burned: parseInt(newSession.burned)
                });

                setSessions([response.data.data, ...sessions]);
                setNewSession({
                    date: new Date().toISOString().split('T')[0],
                    activity: 'Strength Training',
                    duration: '',
                    intensity: 'Medium',
                    burned: ''
                });
                setShowAddModal(false);
            } catch (error) {
                console.error('Error adding session:', error)
            }
        }
    };

    const handleExportJSON = () => {
        const exportData = {
            profile: user,
            sessions: sessions,
            objectives: objectives,
            summary: {
                totalSessions: sessions.length,
                totalCalories: sessions.reduce((sum, s) => sum + s.burned, 0),
                totalDuration: sessions.reduce((sum, s) => sum + s.duration, 0),
                exportDate: new Date().toISOString()
            }
        };

        exportToJSON(exportData, `fitness-progress-${new Date().toISOString().split('T')[0]}.json`);
    };

    const handleExportCSV = () => {
        exportToCSV(sessions, `fitness-data-${new Date().toISOString().split('T')[0]}.csv`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const totalBurned = sessions.reduce((sum, s) => sum + s.burned, 0);
    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    const avgSession = sessions.length > 0 ? Math.round(totalBurned / sessions.length) : 0;

    const weeklyStats = sessions.slice(0, 7).reverse().map(s => ({
        day: new Date(s.date).toLocaleDateString('en-US', { weekday: 'short'}),
        calories: s.burned,
        time: s.duration
    }));

    const performanceMetrics = [
        { metric: 'Strength', score: 85},
        { metric: 'Endurance', score: 75},
        { metric: 'Flexibility', score: 65},
        { metric: 'Speed', score: 70},
        { metric: 'Recovery', score: 80}
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        pass
    )
}