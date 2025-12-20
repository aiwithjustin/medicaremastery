import { Calendar, TrendingUp } from 'lucide-react';

export default function Testimonials() {
  const phases = [
    {
      phase: 'Phase 1-4',
      timeframe: 'Weeks 1-4',
      description: 'Licensing preparation, test exam'
    },
    {
      phase: 'Phase 5',
      timeframe: 'Week 5',
      description: 'Medicare telesales foundations'
    },
    {
      phase: 'Phase 6',
      timeframe: 'Week 6',
      description: 'Career guidance'
    },
    {
      phase: 'Post Graduation',
      timeframe: 'Ongoing',
      description: 'Path to first sale'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-prune-900 to-crimson-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-xl mb-4">
            <Calendar className="w-9 h-9 text-crimson-300" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            What a Realistic Medicare Transition <span className="text-crimson-300">Looks Like</span>
          </h2>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-8 text-center text-gray-200">Typical progression:</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <div className="text-crimson-300 font-bold text-lg mb-2">{item.phase}</div>
                <div className="text-gray-300 text-sm mb-3">({item.timeframe})</div>
                <p className="text-gray-200">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 lg:p-12 border border-white/20">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-green-300" />
              </div>
            </div>
            <div>
              <p className="text-xl text-gray-200 leading-relaxed">
                Many Medicare agents ultimately earn the equivalent of a <span className="font-semibold text-white">$60K–$70K annual income</span> across W2, 1099, and independent roles — depending on training, placement, and execution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
