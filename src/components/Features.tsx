import { GraduationCap, Phone, Briefcase } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: GraduationCap,
      title: 'Professional Licensing Training',
      description: 'Learn Medicare correctly, not just fast.'
    },
    {
      icon: Phone,
      title: 'Real-World Telesales Foundations',
      description: 'Understand how Medicare is actually sold — ethically and compliantly.'
    },
    {
      icon: Briefcase,
      title: 'Career & Agency Navigation',
      description: 'Know which agencies to work with, what to avoid, and how to position yourself for success.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            A Clear Path From Licensing to Your First Commission — <span className="text-crimson-600">and Beyond</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-crimson-200"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-crimson-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative">
                <div className="w-14 h-14 bg-crimson-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-crimson-600 transition-colors">
                  <feature.icon className="w-7 h-7 text-crimson-600 group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
