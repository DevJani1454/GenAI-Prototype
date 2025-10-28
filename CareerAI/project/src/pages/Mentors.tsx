import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Star, Briefcase, Calendar, Search } from 'lucide-react';

interface Mentor {
  id: string;
  full_name: string;
  title: string;
  company: string;
  expertise_areas: string[];
  years_experience: number;
  bio: string;
  rating: number;
  total_sessions: number;
  profile_picture_url: string;
}

export function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMentors();
  }, []);

  async function fetchMentors() {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      if (data) setMentors(data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredMentors = mentors.filter((mentor) =>
    mentor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise_areas?.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Expert Mentors</h1>
        <p className="text-gray-600 mt-1">Connect with industry professionals for guidance</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search mentors by name, role, or expertise..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredMentors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No mentors available</h3>
          <p className="text-gray-600">Check back soon for mentor profiles</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {mentor.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{mentor.full_name}</h3>
                  <p className="text-sm text-gray-600">{mentor.title}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{mentor.company}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{mentor.rating?.toFixed(1) || 'New'} ({mentor.total_sessions} sessions)</span>
                </div>
              </div>

              {mentor.expertise_areas && mentor.expertise_areas.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise_areas.slice(0, 3).map((area, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{mentor.bio}</p>

              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Book Session</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
