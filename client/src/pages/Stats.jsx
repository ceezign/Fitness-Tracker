import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, TrendingUp, Award, Flame } from 'lucide-react';

const StatsView = ({ sessions }) => {
  // Calculate statistics
  const totalSessions = sessions.length;
  const totalBurned = sessions.reduce((sum, s) => sum + s.burned, 0);
  const avgSession = totalSessions > 0 ? Math.round(totalBurned / totalSessions) : 0;

  // Get favorite activity
  const activityCount = {};
  sessions.forEach(s => {
    activityCount[s.activity] = (activityCount[s.activity] || 0) + 1;
  });
  const favoriteActivity = Object.keys(activityCount).length > 0
    ? Object.keys(activityCount).reduce((a, b) => activityCount[a] > activityCount[b] ? a : b)
    : 'N/A';

  // Prepare weekly trend data
  const weeklyTrend = sessions
    .slice(0, 7)
    .reverse()
    .map(s => ({
      day: new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: s.burned,
      duration: s.duration
    }));

  // Activity distribution for pie chart
  const activityData = Object.keys(activityCount).map(activity => ({
    name: activity,
    value: activityCount[activity]
  }));

  const COLORS = ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  // Intensity distribution
  const intensityCount = {
    High: sessions.filter(s => s.intensity === 'High').length,
    Medium: sessions.filter(s => s.intensity === 'Medium').length,
    Low: sessions.filter(s => s.intensity === 'Low').length
  };

  // Monthly stats (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const monthSessions = sessions.filter(s => new Date(s.date) >= thirtyDaysAgo);
  const monthlyCalories = monthSessions.reduce((sum, s) => sum + s.burned, 0);
  const monthlyHours = Math.round(monthSessions.reduce((sum, s) => sum + s.duration, 0) / 60);

  return (
    <div className="space-y-6">
      {sessions.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <Trophy size={64} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-400 text-lg">No statistics available yet</p>
          <p className="text-gray-500 mt-2">Complete workouts to see your progress</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Trophy size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Workouts</p>
                  <p className="text-2xl font-bold">{totalSessions}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">All time</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Favorite Activity</p>
                  <p className="text-xl font-bold">{favoriteActivity}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{activityCount[favoriteActivity] || 0} sessions</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Flame size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg Calories</p>
                  <p className="text-2xl font-bold">{avgSession}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Per session</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">30-Day Streak</p>
                  <p className="text-2xl font-bold">{monthSessions.length}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Workouts this month</p>
            </div>
          </div>

          {/* 7-Day Trend Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">7-Day Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="url(#lineGradient)" 
                  strokeWidth={3} 
                  dot={{ fill: '#a855f7', r: 6 }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Activity & Intensity Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Distribution */}
            {activityData.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-6">Activity Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151', 
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Intensity Breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-6">Intensity Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(intensityCount).map(([intensity, count]) => {
                  const percentage = (count / totalSessions) * 100;
                  const colors = {
                    High: 'from-red-500 to-orange-500',
                    Medium: 'from-yellow-500 to-orange-500',
                    Low: 'from-green-500 to-emerald-500'
                  };
                  
                  return (
                    <div key={intensity}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{intensity} Intensity</span>
                        <span className="text-sm text-gray-400">{count} sessions ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${colors[intensity]} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Last 30 Days Summary</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Sessions</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {monthSessions.length}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Calories Burned</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {monthlyCalories.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Training Hours</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {monthlyHours}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsView;