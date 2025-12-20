import { CheckCircle, XCircle } from 'lucide-react';

export default function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Medicare Mastery Is <span className="text-crimson-600">Not for Everyone</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* This is for you if */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl p-8 border-2 border-green-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">This is for you if:</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-lg">You want a legitimate, regulated career</p>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-lg">You are willing to learn sales and compliance</p>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-lg">You want guidance, not shortcuts</p>
              </li>
            </ul>
          </div>

          {/* This is not for you if */}
          <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">This is not for you if:</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-lg">You want instant money</p>
              </li>
              <li className="flex items-start space-x-3">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-lg">You avoid structured learning</p>
              </li>
              <li className="flex items-start space-x-3">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-lg">You expect agencies to do everything for you</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
