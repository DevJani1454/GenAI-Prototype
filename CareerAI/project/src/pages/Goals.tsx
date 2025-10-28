import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Target,
  Plus,
  Calendar,
  TrendingUp,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Play,
  Pause
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  target_role: string;
  target_date: string;
  timeline_months: number;
  status: string;
  progress_percentage: number;
  created_at: string;
}

export function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_role: '',
    target_date: '',
    timeline_months: 12,
  });

  useEffect(() => {
    fetchGoals();
  }, [user]);

  async function fetchGoals() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('user_goals').insert({
        user_id: user.id,
        ...formData,
      });

      if (error) throw error;

      setFormData({
        title: '',
        description: '',
        target_role: '',
        target_date: '',
        timeline_months: 12,
      });
      setShowModal(false);
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  }

  async function handleDeleteGoal(id: string) {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const { error } = await supabase.from('user_goals').delete().eq('id', id);
      if (error) throw error;
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  }

  async function handleUpdateProgress(id: string, newProgress: number) {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({
          progress_percentage: newProgress,
          status: newProgress === 100 ? 'completed' : 'active'
        })
        .eq('id', id);

      if (error) throw error;
      fetchGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'paused':
        return <Pause className="h-5 w-5 text-yellow-600" />;
      case 'active':
        return <Play className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Career Goals</h1>
          <p className="text-gray-600 mt-1">Track and achieve your career milestones</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          <Plus className="h-5 w-5" />
          <span>New Goal</span>
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-6">Start by creating your first career goal</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus className="h-5 w-5" />
            <span>Create Your First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(goal.status)}
                    <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                  </div>
                  <p className="text-gray-600">{goal.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {goal.target_role && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Target: {goal.target_role}</span>
                  </div>
                )}
                {goal.target_date && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(goal.target_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="text-gray-600">{goal.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 rounded-full h-3 transition-all"
                    style={{ width: `${goal.progress_percentage}%` }}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress_percentage}
                    onChange={(e) => handleUpdateProgress(goal.id, parseInt(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Goal</h2>

            <form onSubmit={handleCreateGoal} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Become a Full Stack Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your goal in detail"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  value={formData.target_role}
                  onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline (Months)
                  </label>
                  <input
                    type="number"
                    value={formData.timeline_months}
                    onChange={(e) => setFormData({ ...formData, timeline_months: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="60"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
