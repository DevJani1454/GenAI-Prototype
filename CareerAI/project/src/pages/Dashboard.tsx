import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Target,
  TrendingUp,
  BookOpen,
  Award,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock
} from 'lucide-react';

interface UserProfile {
  full_name: string;
  current_education: string;
  field_of_study: string;
  career_goals: string[];
}

interface Goal {
  id: string;
  title: string;
  progress_percentage: number;
  target_date: string;
  status: string;
}

interface Skill {
  skill_name: string;
  proficiency_level: number;
  category: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        const [profileRes, goalsRes, skillsRes] = await Promise.all([
          supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('user_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
          supabase.from('user_skills').select('*').eq('user_id', user.id).order('proficiency_level', { ascending: false }).limit(5)
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (goalsRes.data) setGoals(goalsRes.data);
        if (skillsRes.data) setSkills(skillsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.full_name || 'there'}!
            </h1>
            <p className="text-blue-100 text-lg">
              {profile?.current_education && profile?.field_of_study
                ? `${profile.current_education} in ${profile.field_of_study}`
                : 'Complete your profile to get started'}
            </p>
          </div>
          <Sparkles className="h-16 w-16 text-blue-200" />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{goals.length}</div>
          <div className="text-sm text-gray-600 mt-1">Active Goals</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{skills.length}</div>
          <div className="text-sm text-gray-600 mt-1">Skills Tracked</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600 mt-1">Courses Enrolled</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600 mt-1">Credentials</div>
        </div>
      </div>

      {!profile?.current_education && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start space-x-4">
          <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-1">Complete Your Profile</h3>
            <p className="text-yellow-700 mb-3">
              Help us personalize your experience by completing your profile information.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition font-medium"
            >
              <span>Complete Profile</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Active Goals</h2>
            <Link
              to="/goals"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No goals yet</p>
              <Link
                to="/goals"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <span>Create Your First Goal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                      {goal.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-blue-600" />
                      )}
                      <span>{goal.status}</span>
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{goal.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2 transition-all"
                        style={{ width: `${goal.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                  {goal.target_date && (
                    <p className="text-sm text-gray-500">
                      Target: {new Date(goal.target_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Skills</h2>
            <Link
              to="/skills"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {skills.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No skills tracked yet</p>
              <Link
                to="/skills"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                <span>Add Skills</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{skill.skill_name}</h3>
                    <span className="text-sm text-gray-500">{skill.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
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
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Ready to Plan Your Dream Career?</h2>
            <p className="text-purple-100 mb-4">
              Create a timeline to your dream role with AI-powered guidance
            </p>
            <Link
              to="/goals"
              className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition font-semibold"
            >
              <span>Create Timeline</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <Sparkles className="h-24 w-24 text-purple-200 hidden md:block" />
        </div>
      </div>
    </div>
  );
}
