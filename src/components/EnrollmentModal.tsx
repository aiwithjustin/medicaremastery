import { X, Lock, CreditCard, Shield, Check } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrollmentModal({ isOpen, onClose }: EnrollmentModalProps) {
  const { user, refreshEnrollment } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleEnroll = async () => {
    if (!user) return;

    setIsSubmitting(true);
    setError('');

    try {
      // First, create the enrollment record in the database
      const { error: dbError } = await supabase
        .from('enrollments')
        .insert([
          {
            user_id: user.id,
            email: user.email,
            enrollment_status: 'unpaid',
            program_access: 'locked',
            payment_amount: 97,
          },
        ]);

      if (dbError) {
        if (dbError.code === '23505') {
          setError('You are already enrolled in this program.');
        } else {
          throw dbError;
        }
        return;
      }

      // Call the Stripe Checkout Session edge function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            userEmail: user.email,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again or contact support.');
      console.error('Enrollment error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {success ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Enrollment Created!</h3>
              <p className="text-gray-600 text-lg">
                Redirecting you to complete your payment...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-crimson-100 text-crimson-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Lock className="w-4 h-4" />
                  <span>Secure Enrollment</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Enrollment</h2>
                <p className="text-gray-600">You're one step away from accessing the program</p>
              </div>

              <div className="bg-gradient-to-br from-crimson-50 to-prune-50 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Medicare Mastery Program</h3>
                    <p className="text-gray-600 text-sm">Complete certification package</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-crimson-600">$97</div>
                  </div>
                </div>

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
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                  {error}
                </div>
              )}

              <button
                onClick={handleEnroll}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-700 hover:to-crimson-800 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Payment - $97</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mt-6">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
