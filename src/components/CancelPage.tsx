import { XCircle, ArrowLeft, HelpCircle, Mail } from 'lucide-react';

export default function CancelPage() {
  const handleGoBack = () => {
    window.location.href = '/';
  };

  const handleRetry = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-prune-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <XCircle className="w-12 h-12 text-gray-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Canceled
            </h1>

            <p className="text-xl text-gray-600 mb-2">
              No charges were made to your account
            </p>

            <p className="text-gray-500">
              Your enrollment process was interrupted, but you can complete it anytime.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-crimson-600" />
              <span>What Now?</span>
            </h2>

            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Don't worry!</strong> Your enrollment information is saved, and you can complete your payment whenever you're ready.
              </p>

              <p>
                If you experienced any issues during checkout or have questions about the program, we're here to help.
              </p>

              <div className="bg-crimson-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Need assistance?</strong>
                </p>
                <div className="flex items-center space-x-2 text-crimson-700">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-semibold">support@medicaremastery.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-700 hover:to-crimson-800 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Try Again
            </button>

            <button
              onClick={handleGoBack}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 py-4 rounded-lg font-semibold text-lg transition-all border-2 border-gray-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Home</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Your enrollment will remain pending until payment is completed.
            </p>
            <p className="text-sm text-gray-500">
              Questions? We're available to help anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
