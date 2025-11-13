import React, { useState } from 'react';
import { Dumbbell, Clock, Zap, Calendar, Trash2, Filter } from 'lucide-react';

const SessionsView = ({ sessions, onDelete }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.intensity === filter;
  });

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'calories') {
      return b.burned - a.burned;
    } else if (sortBy === 'duration') {
      return b.duration - a.duration;
    }
    return 0;
  });

  const intensityColors = {
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const intensityIconBg = {
    High: 'bg-red-500/20 text-red-400',
    Medium: 'bg-yellow-500/20 text-yellow-400',
    Low: 'bg-green-500/20 text-green-400'
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-400">Filter:</span>
        </div>
        
        <div className="flex gap-2">
          {['all', 'High', 'Medium', 'Low'].map(intensity => (
            <button
              key={intensity}
              onClick={() => setFilter(intensity)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === intensity
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {intensity === 'all' ? 'All Sessions' : `${intensity} Intensity`}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none"
          >
            <option value="date">Date (Newest)</option>
            <option value="calories">Calories (Highest)</option>
            <option value="duration">Duration (Longest)</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      {sortedSessions.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <Dumbbell size={64} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-400 text-lg">
            {filter === 'all' ? 'No training sessions yet' : `No ${filter} intensity sessions`}
          </p>
          <p className="text-gray-500 mt-2">
            {filter === 'all' 
              ? 'Click "Add Session" to log your first workout'
              : 'Try changing the filter to see more sessions'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map(session => (
            <div 
              key={session._id} 
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all group"
            >
              <div className="flex items-start justify-between">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${intensityIconBg[session.intensity]}`}>
                      <Dumbbell size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{session.activity}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${intensityColors[session.intensity]}`}>
                        {session.intensity} Intensity
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <Calendar size={16} />
                    <span>{new Date(session.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Clock size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-semibold">{session.duration} min</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Zap size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Calories</p>
                        <p className="font-semibold">{session.burned} kcal</p>
                      </div>
                    </div>
                  </div>

                  {session.notes && (
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-400">
                        <span className="font-semibold text-gray-300">Notes:</span> {session.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Right Section */}
                <div className="flex flex-col items-end gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-24 h-24 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">{session.burned}</p>
                      <p className="text-xs text-white/80">kcal</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onDelete(session._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300"
                    title="Delete session"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {sortedSessions.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Total Sessions</p>
              <p className="text-2xl font-bold">{sortedSessions.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Calories</p>
              <p className="text-2xl font-bold">{sortedSessions.reduce((sum, s) => sum + s.burned, 0).toLocaleString()} kcal</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Duration</p>
              <p className="text-2xl font-bold">{Math.round(sortedSessions.reduce((sum, s) => sum + s.duration, 0) / 60)} hrs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsView;