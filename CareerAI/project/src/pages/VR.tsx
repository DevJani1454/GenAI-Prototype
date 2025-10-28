import { Gamepad2, Play, Info } from 'lucide-react';

const simulations = [
  {
    id: 1,
    title: 'Day in the Life: Software Developer',
    description: 'Experience a typical day as a software developer at a tech company',
    duration: '15 min',
    difficulty: 'Beginner',
    category: 'Technology',
  },
  {
    id: 2,
    title: 'Job Shadow: Data Scientist',
    description: 'Shadow a data scientist and learn about data analysis and machine learning',
    duration: '20 min',
    difficulty: 'Intermediate',
    category: 'Data Science',
  },
  {
    id: 3,
    title: 'Interview Preparation: Technical Round',
    description: 'Practice technical interviews with realistic scenarios and feedback',
    duration: '30 min',
    difficulty: 'Advanced',
    category: 'Interview Prep',
  },
  {
    id: 4,
    title: 'Day in the Life: Product Manager',
    description: 'Understand the role of a product manager in a fast-paced startup',
    duration: '15 min',
    difficulty: 'Beginner',
    category: 'Product Management',
  },
  {
    id: 5,
    title: 'Job Shadow: UI/UX Designer',
    description: 'Learn the design process from ideation to final product',
    duration: '18 min',
    difficulty: 'Beginner',
    category: 'Design',
  },
  {
    id: 6,
    title: 'Team Collaboration Simulation',
    description: 'Practice working in cross-functional teams on real projects',
    duration: '25 min',
    difficulty: 'Intermediate',
    category: 'Soft Skills',
  },
];

export function VR() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <Gamepad2 className="h-12 w-12" />
          <div>
            <h1 className="text-3xl font-bold">VR Career Simulations</h1>
            <p className="text-pink-100 mt-1">Immersive experiences to explore different career paths</p>
          </div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 mt-6">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              These simulations provide realistic previews of various career roles. Experience a day in the life,
              shadow professionals, and practice key skills in a risk-free environment.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulations.map((sim) => (
          <div key={sim.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div className="h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
              <Gamepad2 className="h-16 w-16 text-white" />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-2">
                  {sim.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{sim.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{sim.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{sim.duration}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(sim.difficulty)}`}>
                  {sim.difficulty}
                </span>
              </div>

              <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold flex items-center justify-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Launch Simulation</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-3">Coming Soon</h2>
        <p className="text-blue-700 mb-4">
          We're constantly adding new simulations. Request specific career paths or scenarios you'd like to experience.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
          Request Simulation
        </button>
      </div>
    </div>
  );
}
