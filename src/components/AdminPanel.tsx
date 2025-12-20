import { Shield, CheckCircle, Clock, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface EnrollmentRecord {
  id: string;
  user_id: string;
  email: string;
  enrollment_status: string;
  program_access: string;
  payment_amount: number;
  payment_confirmed_at: string | null;
  created_at: string;
}

export default function AdminPanel() {
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (userId: string) => {
    setConfirmingId(userId);
    try {
      const { error } = await supabase.rpc('confirm_enrollment_payment', {
        enrollment_user_id: userId,
        payment_method_used: 'manual_confirmation'
      });

      if (error) throw error;

      await fetchEnrollments();
      alert('Payment confirmed successfully!');
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      alert('Error confirming payment: ' + error.message);
    } finally {
      setConfirmingId(null);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-prune-600 to-crimson-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-prune-100">Manage enrollments and payments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or enrollment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchEnrollments}
              className="bg-crimson-600 hover:bg-crimson-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Enrollments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{enrollments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Paid</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {enrollments.filter(e => e.enrollment_status === 'paid').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Payment</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {enrollments.filter(e => e.enrollment_status === 'unpaid').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Access
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading enrollments...
                    </td>
                  </tr>
                ) : filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No enrollments found
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{enrollment.email}</div>
                        <div className="text-xs text-gray-500">{enrollment.id.slice(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            enrollment.enrollment_status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {enrollment.enrollment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            enrollment.program_access === 'unlocked'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {enrollment.program_access}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${enrollment.payment_amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(enrollment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {enrollment.enrollment_status === 'unpaid' ? (
                          <button
                            onClick={() => confirmPayment(enrollment.user_id)}
                            disabled={confirmingId === enrollment.user_id}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {confirmingId === enrollment.user_id ? 'Processing...' : 'Confirm Payment'}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Confirmed {enrollment.payment_confirmed_at && new Date(enrollment.payment_confirmed_at).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Admin Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Access this panel at: <code className="bg-blue-100 px-2 py-0.5 rounded">/admin</code></li>
            <li>• Click "Confirm Payment" to manually approve enrollments for testing</li>
            <li>• This function can be replaced with a webhook handler for production payment processing</li>
            <li>• All changes are logged and enforced by Row Level Security</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
