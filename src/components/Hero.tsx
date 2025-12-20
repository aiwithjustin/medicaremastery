import { Award } from 'lucide-react';

interface HeroProps {
  onEnrollClick: () => void;
}

export default function Hero({ onEnrollClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-crimson-900 via-crimson-800 to-prune-900 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Award className="w-4 h-4" />
              <span>Industry-Leading Medicare Certification</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Become a Medicare Agent the Right Way — <span className="text-crimson-300">Without Guesswork, Bad Agencies, or False Promises</span>
            </h1>

            <p className="text-xl text-gray-200 leading-relaxed">
              A realistic, end-to-end training and career roadmap designed to take you from zero experience to your first Medicare commission — while avoiding the mistakes that cause most new agents to fail.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onEnrollClick}
                className="bg-crimson-600 hover:bg-crimson-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-xl"
              >
                Get the Free Medicare Career Roadmap
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-crimson-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Live Expert Training</h3>
                    <p className="text-gray-300 text-sm">Weekly live sessions with Medicare specialists</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-crimson-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Real-World Scenarios</h3>
                    <p className="text-gray-300 text-sm">Practice with actual case studies and simulations</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-crimson-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Certification Support</h3>
                    <p className="text-gray-300 text-sm">Guaranteed exam preparation and career guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
