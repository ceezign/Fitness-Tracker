import React, { useState } from 'react';
import { Target, Plus, X } from 'lucide-react';
import GoalCard from '../components/GoalCard';

const GoalsView = ({ goals, setGoals }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    goal: '',
    current: 0,
    metric: 'workouts',
    deadline: ''
  });

  const handleAddGoal = (e) => {
    e.preventDefault();
    
    const goal = {
      id: Date.now().toString(),
      ...newGoal,
      goal: parseInt(newGoal.goal),
      current: parseInt(newGoal.current)
    };

    setGoals([...goals, goal]);
    setNewGoal({
      name: '',
      goal: '',
      current: 0,
      metric: 'workouts',
      deadline: ''
    });
    setShowAddModal(false);
  };

  const handleDeleteGoal = (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    setGoals(goals.filter(g => g.id !== goalId));
  };

  // Sample goals if none exist
  const sampleGoals = [
    {
      id: '1',
      name: 'Weekly Workout Target',
      goal: 6,
      current: 4,
      metric: 'workouts',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Monthly Calorie Goal',
      goal: 10000,
      current: 6500,
      metric: 'calories',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Training Hours This Month',
      goal: 20,
      current: 12,
      metric: 'hours',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const displayGoals = goals.length > 0 ? goals : sampleGoals;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div>
          <h3 className="text-lg font-semibold">Your Fitness Goals</h3>
          <p className="text-sm text-gray-400 mt-1">Track your progress and stay motivated</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Plus size={20} />
          Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      {displayGoals.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <Target size={64} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-400 text-lg">No goals set yet</p>
          <p className="text-gray-500 mt-2">Set your first fitness goal to track progress</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Add Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayGoals.map(goal => (
            <div key={goal.id} className="relative group">
              <GoalCard goal={goal} />
              <button
                onClick={() => handleDeleteGoal(goal.id)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300"
                title="Delete goal"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Target size={20} />
                </div>
                <h3 className="text-2xl font-bold">Add New Goal</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                  placeholder="e.g., Weekly Workout Target"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Target
                  </label>
                  <input
                    type="number"
                    value={newGoal.goal}
                    onChange={(e) => setNewGoal({...newGoal, goal: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Current
                  </label>
                  <input
                    type="number"
                    value={newGoal.current}
                    onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Metric
                </label>
                <select
                  value={newGoal.metric}
                  onChange={(e) => setNewGoal({...newGoal, metric: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                >
                  <option value="workouts">Workouts</option>
                  <option value="calories">Calories</option>
                  <option value="hours">Hours</option>
                  <option value="km">Kilometers</option>
                  <option value="lbs">Pounds</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Add Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-800 border border-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tips */}
      {goals.length === 0 && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
          <h4 className="text-lg font-semibold mb-3">💡 Goal Setting Tips</h4>
          <ul className="space-y-2 text-gray-300">
            <li>• Set realistic and achievable goals</li>
            <li>• Break large goals into smaller milestones</li>
            <li>• Track your progress regularly</li>
            <li>• Celebrate when you reach your targets</li>
            <li>• Adjust goals as you progress</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoalsView;