import { AlertCircle, Target } from 'lucide-react';

export default function Comparison() {
  return (
    <section className="py-20 bg-gradient-to-br from-prune-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Problem Amplification Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl mb-4">
              <AlertCircle className="w-9 h-9 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Most New Medicare Agents Don't Fail Because They're Lazy. <span className="text-crimson-600">They Fail Because They're Misinformed.</span>
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-200">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Most agencies:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-crimson-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg text-gray-700">Rush agents through licensing with little real-world preparation</p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-crimson-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg text-gray-700">Confuse compliance knowledge with sales competence</p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-crimson-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg text-gray-700">Offer minimal onboarding, then expect immediate performance</p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-crimson-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg text-gray-700">Fail to explain the income ramp-up and survival period</p>
              </li>
            </ul>
            <p className="text-xl text-gray-900 font-semibold">
              The result: capable people quit before they ever earn their first commission.
            </p>
          </div>
        </div>

        {/* Authority Bridge Section */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-crimson-100 rounded-xl mb-4">
              <Target className="w-9 h-9 text-crimson-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Medicare Mastery Exists Because <span className="text-crimson-600">the System Is Broken</span>
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-200">
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Passing the exam does not prepare you to sell.
              </p>
              <p>
                Selling does not guarantee income.
              </p>
              <p>
                And choosing the wrong agency can cost you months — or your entire Medicare career.
              </p>
              <p className="text-xl text-gray-900 font-semibold mt-8">
                Medicare Mastery fills the gap between licensing and real-world success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
