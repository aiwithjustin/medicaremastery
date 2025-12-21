import { CheckCircle, ArrowRight, Mail, BookOpen } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SuccessPage() {
  const { refreshEnrollment } = useAuth();

  useEffect(() => {
    refreshEnrollment();
  }, [refreshEnrollment]);

  const handleGoToDashboard = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-prune-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>

            <p className="text-xl text-gray-600 mb-2">
              Welcome to Medicare Mastery
            </p>

            <p className="text-gray-500">
              Your enrollment is now complete and you have full access to the program.
            </p>
          </div>

          <div className="bg-gradient-to-br from-crimson-50 to-prune-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What Happens Next?</h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-crimson-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Mail className="w-4 h-4 text-crimson-600" />
                    <h3 className="font-semibold text-gray-900">Check Your Email</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    You'll receive a confirmation email with your receipt and program access details.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-crimson-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <BookOpen className="w-4 h-4 text-crimson-600" />
                    <h3 className="font-semibold text-gray-900">Access Your Dashboard</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Head to your program dashboard to start your Medicare certification journey.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-crimson-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Begin Your Training</h3>
                  <p className="text-gray-600 text-sm">
                    Start with Phase 1 of the program and work through the comprehensive Medicare curriculum.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleGoToDashboard}
            className="w-full bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-700 hover:to-crimson-800 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Questions? Contact us at support@medicaremastery.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
