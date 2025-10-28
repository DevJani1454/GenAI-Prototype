import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Award, Plus, QrCode, Download, Share2, CheckCircle, Clock } from 'lucide-react';

interface Credential {
  id: string;
  credential_type: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  verification_status: string;
  blockchain_hash: string;
}

export function Credentials() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    credential_type: '',
    title: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
  });

  useEffect(() => {
    fetchCredentials();
  }, [user]);

  async function fetchCredentials() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('user_id', user.id)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      if (data) setCredentials(data);
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCredential(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('credentials').insert({
        user_id: user.id,
        ...formData,
        blockchain_hash: `0x${Math.random().toString(16).slice(2, 66)}`,
      });

      if (error) throw error;

      setFormData({
        credential_type: '',
        title: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
      });
      setShowModal(false);
      fetchCredentials();
    } catch (error) {
      console.error('Error adding credential:', error);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="flex items-center space-x-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            <span>Verified</span>
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center space-x-1 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credential Vault</h1>
          <p className="text-gray-600 mt-1">Blockchain-secured certificates and achievements</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
        >
          <Plus className="h-5 w-5" />
          <span>Add Credential</span>
        </button>
      </div>

      {credentials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No credentials yet</h3>
          <p className="text-gray-600 mb-6">Add your certificates and achievements to build your verified portfolio</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
          >
            <Plus className="h-5 w-5" />
            <span>Add Your First Credential</span>
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {credentials.map((credential) => (
            <div key={credential.id} className="bg-white rounded-xl shadow-sm border-2 border-orange-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{credential.title}</h3>
                    <p className="text-sm text-gray-600">{credential.credential_type}</p>
                  </div>
                </div>
                {getStatusBadge(credential.verification_status)}
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Issued by:</span> {credential.issuer}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Issue Date:</span> {new Date(credential.issue_date).toLocaleDateString()}
                </p>
                {credential.expiry_date && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Expiry:</span> {new Date(credential.expiry_date).toLocaleDateString()}
                  </p>
                )}
              </div>

              {credential.blockchain_hash && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Blockchain Hash</p>
                  <p className="text-xs font-mono text-gray-700 truncate">{credential.blockchain_hash}</p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition text-sm font-medium">
                  <QrCode className="h-4 w-4" />
                  <span>QR Code</span>
                </button>
                <button className="flex items-center justify-center bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition">
                  <Download className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Credential</h2>

            <form onSubmit={handleAddCredential} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credential Type
                  </label>
                  <select
                    value={formData.credential_type}
                    onChange={(e) => setFormData({ ...formData, credential_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Degree">Degree</option>
                    <option value="License">License</option>
                    <option value="Award">Award</option>
                    <option value="Badge">Badge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
                >
                  Add Credential
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
