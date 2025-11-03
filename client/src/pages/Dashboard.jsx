import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Dumbbell,
  TrendingUp,
  Download,
  Calendar,
  Clock,
  Zap,
  Target,
  Trophy,
  ChevronRight,
  X,
  Plus,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { exportToJSON, exportToCSV } from "../services/exportService";
import api from "../services/api";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("home");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split("T")[0],
    activity: "Strength Training",
    duration: "",
    intensity: "Medium",
    burned: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/sessions");
      setSessions(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleAddSession = async () => {
    if (newSession.duration && newSession.burned) {
      try {
        const response = await api.post("/sessions", {
          ...newSession,
          duration: parseInt(newSession.duration),
          burned: parseInt(newSession.burned),
        });

        setSessions([response.data.data, ...sessions]);
        setNewSession({
          date: new Date().toISOString().split("T")[0],
          activity: "Strength Training",
          duration: "",
          intensity: "Medium",
          burned: "",
        });
        setShowAddModal(false);
      } catch (error) {
        console.error("Error adding session:", error);
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
        exportDate: new Date().toISOString(),
      },
    };

    exportToJSON(
      exportData,
      `fitness-progress-${new Date().toISOString().split("T")[0]}.json`
    );
  };

  const handleExportCSV = () => {
    exportToCSV(
      sessions,
      `fitness-data-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalBurned = sessions.reduce((sum, s) => sum + s.burned, 0);
  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const avgSession =
    sessions.length > 0 ? Math.round(totalBurned / sessions.length) : 0;

  const weeklyStats = sessions
    .slice(0, 7)
    .reverse()
    .map((s) => ({
      day: new Date(s.date).toLocaleDateString("en-US", { weekday: "short" }),
      calories: s.burned,
      time: s.duration,
    }));

  const performanceMetrics = [
    { metric: "Strength", score: 85 },
    { metric: "Endurance", score: 75 },
    { metric: "Flexibility", score: 65 },
    { metric: "Speed", score: 70 },
    { metric: "Recovery", score: 80 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-20 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-6 space-y-8 z-50">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Dumbbell size={24} />
        </div>

        <nav className="flex-1 flex flex-col space-y-4">
          {[
            { icon: BarChart3, view: "home", label: "Dashboard" },
            { icon: Calendar, view: "sessions", label: "Sessions" },
            { icon: Target, view: "goals", label: "Goals" },
            { icon: Trophy, view: "stats", label: "Stats" },
          ].map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                activeView === item.view
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              title={item.label}
            >
              <item.icon size={20} />
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-12 h-12 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-20 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {activeView === "home" && "Performance Dashboard"}
              {activeView === "sessions" && "Training Sessions"}
              {activeView === "goals" && "Your Objectives"}
              {activeView === "stats" && "Analytics & Insights"}
            </h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name}!</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-900 px-6 py-3 rounded-xl border border-gray-800">
              <Zap className="text-yellow-400" size={20} />
              <div>
                <p className="text-xs text-gray-400">Total Sessions</p>
                <p className="text-xl font-bold">{sessions.length}</p>
              </div>
            </div>

            <div className="relative group">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all">
                <Download size={20} />
                Export Data
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={handleExportJSON}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800 rounded-t-xl flex items-center gap-2"
                >
                  <Download size={16} />
                  JSON Format
                </button>
                <button
                  onClick={handleExportCSV}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800 rounded-b-xl flex items-center gap-2"
                >
                  <Download size={16} />
                  CSV Format
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-800 transition-all"
            >
              <Plus size={20} />
              Add Session
            </button>
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === "home" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              {[
                {
                  label: "Total Sessions",
                  value: sessions.length,
                  icon: Calendar,
                  color: "from-blue-500 to-cyan-500",
                  suffix: "",
                },
                {
                  label: "Calories Burned",
                  value: totalBurned.toLocaleString(),
                  icon: Zap,
                  color: "from-orange-500 to-red-500",
                  suffix: "kcal",
                },
                {
                  label: "Training Time",
                  value: Math.round(totalTime / 60),
                  icon: Clock,
                  color: "from-green-500 to-emerald-500",
                  suffix: "hrs",
                },
                {
                  label: "Avg per Session",
                  value: avgSession,
                  icon: TrendingUp,
                  color: "from-purple-500 to-pink-500",
                  suffix: "kcal",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <stat.icon size={24} />
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">
                    {stat.value}{" "}
                    <span className="text-lg text-gray-500">{stat.suffix}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Charts */}
            {sessions.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-6">
                    Weekly Activity
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={weeklyStats}>
                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar
                        dataKey="calories"
                        fill="url(#barGradient)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-6">
                    Performance Radar
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={performanceMetrics}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                      <PolarRadiusAxis stroke="#9ca3af" />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#a855f7"
                        fill="#a855f7"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Recent Sessions */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
              {sessions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No sessions yet. Add your first workout!
                </p>
              ) : (
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session) => (
                    <div
                      key={session._id}
                      className="flex items-center justify-between bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            session.intensity === "High"
                              ? "bg-red-500/20 text-red-400"
                              : session.intensity === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          <Dumbbell size={20} />
                        </div>
                        <div>
                          <p className="font-semibold">{session.activity}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p className="text-gray-400 text-xs">Duration</p>
                          <p className="font-semibold">
                            {session.duration} min
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Burned</p>
                          <p className="font-semibold">{session.burned} kcal</p>
                        </div>
                        <ChevronRight className="text-gray-600" size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sessions View */}
        {activeView === "sessions" && (
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <Dumbbell size={64} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-400 text-lg">
                  No training sessions yet
                </p>
                <p className="text-gray-500 mt-2">
                  Click "Add Session" to log your first workout
                </p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session._id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold">
                          {session.activity}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            session.intensity === "High"
                              ? "bg-red-500/20 text-red-400"
                              : session.intensity === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {session.intensity}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock size={16} className="text-gray-500" />
                          <span>{session.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Zap size={16} className="text-gray-500" />
                          <span>{session.burned} kcal</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{session.burned}</p>
                          <p className="text-xs opacity-80">kcal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Goals View */}
        {activeView === "goals" && (
          <div className="space-y-6">
            {objectives.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <Target size={64} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-400 text-lg">No goals set yet</p>
                <p className="text-gray-500 mt-2">
                  Set your fitness goals to track progress
                </p>
              </div>
            ) : (
              objectives.map((goal) => {
                const progress = (goal.current / goal.goal) * 100;
                const daysLeft = Math.ceil(
                  (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={goal.id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{goal.name}</h3>
                        <p className="text-gray-400">
                          Target: {goal.goal} {goal.metric}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {progress.toFixed(0)}%
                        </p>
                        <p className="text-sm text-gray-400">
                          {daysLeft} days left
                        </p>
                      </div>
                    </div>

                    <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-gray-400">
                        Progress: {goal.current} / {goal.goal} {goal.metric}
                      </p>
                      <p className="text-sm font-semibold text-purple-400">
                        {goal.goal - goal.current} {goal.metric} to go
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Stats View */}
        {activeView === "stats" && (
          <div className="space-y-6">
            {sessions.length > 0 && (
              <>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-6">7-Day Trend</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={weeklyStats}>
                      <defs>
                        <linearGradient
                          id="lineGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#a855f7"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#ec4899"
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="calories"
                        stroke="url(#lineGradient)"
                        strokeWidth={3}
                        dot={{ fill: "#a855f7", r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h4 className="text-gray-400 mb-2">Total Workouts</h4>
                    <p className="text-2xl font-bold">{sessions.length}</p>
                    <p className="text-sm text-gray-500 mt-1">All time</p>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h4 className="text-gray-400 mb-2">Favorite Activity</h4>
                    <p className="text-2xl font-bold">
                      {sessions[0]?.activity || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Most logged</p>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h4 className="text-gray-400 mb-2">Avg Calories</h4>
                    <p className="text-2xl font-bold">{avgSession}</p>
                    <p className="text-sm text-gray-500 mt-1">Per session</p>
                  </div>
                </div>
              </>
            )}

            {sessions.length === 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <Trophy size={64} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-400 text-lg">
                  No statistics available yet
                </p>
                <p className="text-gray-500 mt-2">
                  Complete workouts to see your progress
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Log New Session</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newSession.date}
                  onChange={(e) =>
                    setNewSession({ ...newSession, date: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Activity Type
                </label>
                <select
                  value={newSession.activity}
                  onChange={(e) =>
                    setNewSession({ ...newSession, activity: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                >
                  <option>Strength Training</option>
                  <option>Cardio Run</option>
                  <option>Yoga Flow</option>
                  <option>HIIT Circuit</option>
                  <option>Swimming</option>
                  <option>Cycling</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={newSession.duration}
                    onChange={(e) =>
                      setNewSession({ ...newSession, duration: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                    placeholder="45"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Intensity
                  </label>
                  <select
                    value={newSession.intensity}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        intensity: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Calories Burned
                </label>
                <input
                  type="number"
                  value={newSession.burned}
                  onChange={(e) =>
                    setNewSession({ ...newSession, burned: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                  placeholder="350"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddSession}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Save Session
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-800 border border-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
