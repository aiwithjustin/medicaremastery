import { X, Download, CheckCircle } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoadmapModal({ isOpen, onClose }: RoadmapModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interestReason: '',
    discoverySource: '',
    honeypot: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const isFormValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.interestReason !== '' &&
    formData.discoverySource !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.honeypot !== '') {
      return;
    }

    if (!isFormValid) {
      setError('Please fill out all required fields with valid information.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const userAgent = navigator.userAgent;

      const { data: existingLead } = await supabase
        .from('roadmap_leads')
        .select('id')
        .eq('email', formData.email.toLowerCase())
        .maybeSingle();

      if (existingLead) {
        const { error: updateError } = await supabase
          .from('roadmap_leads')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            interest_reason: formData.interestReason,
            discovery_source: formData.discoverySource,
            user_agent: userAgent,
          })
          .eq('id', existingLead.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('roadmap_leads')
          .insert([{
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email.toLowerCase(),
            interest_reason: formData.interestReason,
            discovery_source: formData.discoverySource,
            user_agent: userAgent,
          }]);

        if (insertError) throw insertError;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const emailUrl = `${supabaseUrl}/functions/v1/send-roadmap-email`;

      const emailResponse = await fetch(emailUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          email: formData.email.toLowerCase(),
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      setIsSuccess(true);

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          interestReason: '',
          discoverySource: '',
          honeypot: ''
        });
      }, 4000);

    } catch (err: any) {
      console.error('Error submitting roadmap request:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setError('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        interestReason: '',
        discoverySource: '',
        honeypot: ''
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        ></div>

        <div
          className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="roadmap-modal-title"
        >
          {!isSubmitting && !isSuccess && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          )}

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 id="roadmap-modal-title" className="text-2xl font-bold text-gray-900 mb-4">
                Check your email!
              </h3>
              <p className="text-gray-600 text-lg">
                Your Medicare Career Roadmap has been sent to <strong>{formData.email}</strong>
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 bg-crimson-100 text-crimson-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Download className="w-4 h-4" />
                  <span>Free Resource</span>
                </div>
                <h2 id="roadmap-modal-title" className="text-2xl font-bold text-gray-900 mb-2">
                  Get the Free Medicare Career Roadmap
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter your information below and we'll email you the roadmap instantly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-600 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-600 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-600 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="interestReason" className="block text-sm font-medium text-gray-700 mb-1">
                    Why are you looking into Medicare Mastery? <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="interestReason"
                    required
                    value={formData.interestReason}
                    onChange={(e) => setFormData({ ...formData, interestReason: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-600 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="">Select an option</option>
                    <option value="Career change">Career change</option>
                    <option value="I want to work remotely">I want to work remotely</option>
                    <option value="More income">More income</option>
                    <option value="Something else">Something else</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="discoverySource" className="block text-sm font-medium text-gray-700 mb-1">
                    How did you hear about Medicare Mastery? <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="discoverySource"
                    required
                    value={formData.discoverySource}
                    onChange={(e) => setFormData({ ...formData, discoverySource: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-600 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="">Select an option</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Friend / Family Member">Friend / Family Member</option>
                    <option value="Co-worker">Co-worker</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <input
                  type="text"
                  name="website"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ position: 'absolute', left: '-9999px' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-700 hover:to-crimson-800 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Get the Free Medicare Career Roadmap Now</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
