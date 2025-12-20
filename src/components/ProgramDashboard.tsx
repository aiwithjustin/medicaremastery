import { GraduationCap, BookOpen, Users, Award, Video, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProgramDashboard() {
  const { profile, enrollment, signOut } = useAuth();

  const modules = [
    {
      id: 1,
      title: 'Introduction to Medicare',
      lessons: 8,
      duration: '2 hours',
      completed: false,
      icon: BookOpen,
    },
    {
      id: 2,
      title: 'Medicare Parts A & B',
      lessons: 12,
      duration: '4 hours',
      completed: false,
      icon: Video,
    },
    {
      id: 3,
      title: 'Medicare Advantage (Part C)',
      lessons: 10,
      duration: '3.5 hours',
      completed: false,
      icon: Video,
    },
    {
      id: 4,
      title: 'Prescription Drug Plans (Part D)',
      lessons: 9,
      duration: '3 hours',
      completed: false,
      icon: Video,
    },
    {
      id: 5,
      title: 'Medigap & Supplements',
      lessons: 7,
      duration: '2.5 hours',
      completed: false,
      icon: Video,
    },
    {
      id: 6,
      title: 'Enrollment Periods & SEPs',
      lessons: 6,
      duration: '2 hours',
      completed: false,
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-crimson-600 to-prune-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">Medicare Mastery</h1>
                <p className="text-xs text-gray-500">Professional Dashboard</p>
              </div>
            </div>

            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-crimson-600 to-prune-700 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name}!</h2>
                <p className="text-crimson-100">Ready to continue your Medicare mastery journey?</p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">0%</div>
                    <div className="text-sm text-crimson-100">Complete</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Video className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">52</div>
                <div className="text-sm text-crimson-100">Total Lessons</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Users className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">2,847</div>
                <div className="text-sm text-crimson-100">Active Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Award className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">97%</div>
                <div className="text-sm text-crimson-100">Pass Rate</div>
              </div>
            </div>
          </div>
        </div>

        {enrollment?.payment_confirmed_at && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-semibold">
                Payment confirmed on {new Date(enrollment.payment_confirmed_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Modules</h3>
          <p className="text-gray-600">Complete all modules to earn your Medicare certification</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 p-6 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-crimson-100 rounded-lg flex items-center justify-center group-hover:bg-crimson-600 transition-colors">
                  <module.icon className="w-6 h-6 text-crimson-600 group-hover:text-white transition-colors" />
                </div>
                {module.completed && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>

              <h4 className="font-bold text-lg text-gray-900 mb-2">{module.title}</h4>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>{module.lessons} lessons</span>
                  <span>{module.duration}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-crimson-600 hover:bg-crimson-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors">
                  Start Module
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Learning Path</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-crimson-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-crimson-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Complete Core Modules</h4>
                <p className="text-sm text-gray-600">Master all 6 core modules covering Medicare fundamentals</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-500">Practice Exams</h4>
                <p className="text-sm text-gray-500">Take practice tests to prepare for certification</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-500">Get Certified</h4>
                <p className="text-sm text-gray-500">Pass your official Medicare certification exam</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
