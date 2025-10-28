import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { TrendingUp, Plus, AlertTriangle, CheckCircle } from 'lucide-react';

interface Skill {
  id: string;
  skill_name: string;
  category: string;
  proficiency_level: number;
  is_verified: boolean;
}

interface SkillGap {
  skill_name: string;
  current_level: number;
  required_level: number;
  priority: string;
}

export function Skills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    skill_name: '',
    category: '',
    proficiency_level: 3,
  });

  useEffect(() => {
    fetchSkills();
    fetchSkillGaps();
  }, [user]);

  async function fetchSkills() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id)
        .order('proficiency_level', { ascending: false });

      if (error) throw error;
      if (data) setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSkillGaps() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('skill_gaps')
        .select('*')
        .eq('user_id', user.id)
        .order('priority', { ascending: false });

      if (error) throw error;
      if (data) setSkillGaps(data);
    } catch (error) {
      console.error('Error fetching skill gaps:', error);
    }
  }

  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('user_skills').insert({
        user_id: user.id,
        ...formData,
      });

      if (error) throw error;

      setFormData({ skill_name: '', category: '', proficiency_level: 3 });
      setShowModal(false);
      fetchSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills & Competencies</h1>
          <p className="text-gray-600 mt-1">Track your skills and identify growth areas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          <Plus className="h-5 w-5" />
          <span>Add Skill</span>
        </button>
      </div>

      {skillGaps.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-yellow-900">Skill Gaps Identified</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {skillGaps.map((gap, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(gap.priority)}`}>
                <h3 className="font-semibold mb-2">{gap.skill_name}</h3>
                <div className="text-sm space-y-1">
                  <p>Current Level: {gap.current_level}/5</p>
                  <p>Required Level: {gap.required_level}/5</p>
                  <p className="capitalize">Priority: {gap.priority}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Your Skills</h2>
        </div>

        {skills.length === 0 ? (
          <div className="p-12 text-center">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No skills added yet</h3>
            <p className="text-gray-600 mb-6">Start tracking your skills to visualize your growth</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Skill</span>
            </button>
          </div>
        ) : (
          <div className="p-6 grid md:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                      <span>{skill.skill_name}</span>
                      {skill.is_verified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </h3>
                    <span className="text-sm text-gray-500">{skill.category}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {skill.proficiency_level}/5
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full ${
                        level <= skill.proficiency_level ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Skill</h2>

            <form onSubmit={handleAddSkill} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.skill_name}
                  onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Python, React, Project Management"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Technical">Technical</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Tools">Tools</option>
                  <option value="Languages">Languages</option>
                  <option value="Domain Knowledge">Domain Knowledge</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proficiency Level: {formData.proficiency_level}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.proficiency_level}
                  onChange={(e) => setFormData({ ...formData, proficiency_level: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Add Skill
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
