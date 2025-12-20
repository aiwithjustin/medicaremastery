import { CreditCard, Lock, Shield, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PaymentRequired() {
  const { enrollment } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-crimson-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Payment Required
            </h1>

            <p className="text-lg text-gray-600 mb-2">
              Your enrollment is pending payment confirmation
            </p>

            <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mt-4">
              <Clock className="w-4 h-4" />
              <span>Status: {enrollment?.enrollment_status || 'Unpaid'}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-crimson-50 to-prune-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-xl text-gray-900">Medicare Mastery Program</h3>
                <p className="text-gray-600 text-sm">Complete certification package</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-crimson-600">
                  ${enrollment?.payment_amount || 97}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-crimson-600 rounded-full"></div>
                  <span>50+ hours of expert training</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-crimson-600 rounded-full"></div>
                  <span>Personal mentor assignment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-crimson-600 rounded-full"></div>
                  <span>Exam support & extended access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-crimson-600 rounded-full"></div>
                  <span>70-day program access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-crimson-600 rounded-full"></div>
                  <span>Private community access</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Processing
            </h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              Payment integration is currently being configured. Our team will contact you shortly
              to complete your payment and activate your program access. You can also reach out
              directly to expedite the process.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-700 font-semibold mb-2">Contact Support to Complete Payment:</p>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <a href="mailto:support@medicaremastery.com" className="text-crimson-600 hover:text-crimson-700 font-medium">
                    support@medicaremastery.com
                  </a>
                </p>
                <p className="text-gray-600">
                  <a href="tel:+15551234567" className="text-crimson-600 hover:text-crimson-700 font-medium">
                    (555) 123-4567
                  </a>
                </p>
                <p className="text-sm text-gray-500">Monday - Friday, 9am - 6pm EST</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Enrollment ID: {enrollment?.id?.slice(0, 8)}...
          </p>
        </div>
      </div>
    </div>
  );
}
