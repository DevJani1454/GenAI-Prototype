import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  GraduationCap,
  Briefcase,
  Target,
  Upload,
  Mic,
  CheckCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    currentEducation: '',
    fieldOfStudy: '',
    graduationYear: new Date().getFullYear(),
    jobTitle: '',
    workExperience: [] as any[],
    careerGoals: [] as string[],
    preferredIndustries: [] as string[],
    locationCity: '',
    locationCountry: 'India',
  });

  const [goalInput, setGoalInput] = useState('');
  const [industryInput, setIndustryInput] = useState('');

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAddGoal = () => {
    if (goalInput.trim()) {
      setFormData({ ...formData, careerGoals: [...formData.careerGoals, goalInput.trim()] });
      setGoalInput('');
    }
  };

  const handleAddIndustry = () => {
    if (industryInput.trim()) {
      setFormData({ ...formData, preferredIndustries: [...formData.preferredIndustries, industryInput.trim()] });
      setIndustryInput('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          current_education: formData.currentEducation,
          field_of_study: formData.fieldOfStudy,
          graduation_year: formData.graduationYear,
          job_title: formData.jobTitle,
          work_experience: formData.workExperience,
          career_goals: formData.careerGoals,
          preferred_industries: formData.preferredIndustries,
          location_city: formData.locationCity,
          location_country: formData.locationCountry,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Let's Get Started</h1>
          <p className="text-gray-600">Tell us about yourself to personalize your experience</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s < step ? <CheckCircle className="h-6 w-6" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Education</span>
            <span>Experience</span>
            <span>Goals</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
            {step === 1 && (
              <>
                <div className="flex items-center space-x-2 text-blue-600 mb-4">
                  <GraduationCap className="h-6 w-6" />
                  <h2 className="text-2xl font-bold text-gray-900">Education Background</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Education Level
                  </label>
                  <select
                    value={formData.currentEducation}
                    onChange={(e) => setFormData({ ...formData, currentEducation: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your education level</option>
                    <option value="High School">High School</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Doctorate">Doctorate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Computer Science, Business Administration"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Graduation Year
                  </label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="2020"
                    max="2035"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.locationCity}
                      onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Mumbai, Delhi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.locationCountry}
                      onChange={(e) => setFormData({ ...formData, locationCountry: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="India"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex items-center space-x-2 text-blue-600 mb-4">
                  <Briefcase className="h-6 w-6" />
                  <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Software Developer, Marketing Intern"
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave blank if you're a student with no work experience</p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Resume</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload your resume to auto-fill your experience and skills
                  </p>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Choose File
                  </button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Voice Introduction</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Tell us about yourself in your own words
                  </p>
                  <button
                    type="button"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Start Recording
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex items-center space-x-2 text-blue-600 mb-4">
                  <Target className="h-6 w-6" />
                  <h2 className="text-2xl font-bold text-gray-900">Career Goals</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Career Goals
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGoal())}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Become a Data Scientist"
                    />
                    <button
                      type="button"
                      onClick={handleAddGoal}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                  </div>
                  {formData.careerGoals.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.careerGoals.map((goal, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{goal}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                careerGoals: formData.careerGoals.filter((_, i) => i !== index),
                              });
                            }}
                            className="text-blue-700 hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Industries
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={industryInput}
                      onChange={(e) => setIndustryInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIndustry())}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Technology, Finance, Healthcare"
                    />
                    <button
                      type="button"
                      onClick={handleAddIndustry}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                      Add
                    </button>
                  </div>
                  {formData.preferredIndustries.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.preferredIndustries.map((industry, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{industry}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                preferredIndustries: formData.preferredIndustries.filter((_, i) => i !== index),
                              });
                            }}
                            className="text-green-700 hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
            )}
            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Completing...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
