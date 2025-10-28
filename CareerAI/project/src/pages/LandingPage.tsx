import { Link } from 'react-router-dom';
import { Brain, Target, TrendingUp, Users, Award, Sparkles, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CareerAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Career Planning</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Your Personal Career
            <br />
            <span className="text-blue-600">Navigator for Success</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover your ideal career path with AI-driven insights, personalized skill mapping,
            expert mentorship, and real-time job market intelligence tailored for Indian students.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg flex items-center space-x-2 shadow-lg"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition font-semibold text-lg border-2 border-blue-600"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Pathways</h3>
            <p className="text-gray-600">
              AI analyzes your unique profile, interests, and goals to recommend tailored career paths and learning roadmaps.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Skill Gap Analysis</h3>
            <p className="text-gray-600">
              Identify exactly what skills you need to acquire and get curated courses to bridge the gap efficiently.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Mentorship</h3>
            <p className="text-gray-600">
              Connect with industry professionals who understand your journey and provide guidance when you need it most.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Powerful Features to Accelerate Your Career
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <Brain className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Career Navigator</h3>
                <p className="text-gray-600">
                  Chat with an AI that understands your life events, career breaks, and personal circumstances to provide contextual advice.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <Award className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Blockchain Credentials</h3>
                <p className="text-gray-600">
                  Secure, tamper-proof digital credentials with QR verification for all your certificates and achievements.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <Target className="h-10 w-10 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Timeline to Dream Role</h3>
                <p className="text-gray-600">
                  Set your target role and timeframe, and get a month-by-month action plan with courses, projects, and milestones.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <Users className="h-10 w-10 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Peer Benchmarking</h3>
                <p className="text-gray-600">
                  Compare your progress anonymously with peers following similar career paths and stay motivated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Shape Your Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already building successful careers with CareerAI
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition font-semibold text-lg inline-flex items-center space-x-2 shadow-xl"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">CareerAI</span>
            </div>
            <p className="text-gray-400 text-sm">
              2025 CareerAI. Empowering careers with AI-driven insights.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
