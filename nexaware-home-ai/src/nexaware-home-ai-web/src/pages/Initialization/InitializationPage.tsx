import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface SystemStatus {
  databaseConnected: boolean;
  tablesExist: boolean;
  documentsVolumeConfigured: boolean;
  isReady: boolean;
}

export const InitializationPage: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSystem = async () => {
      try {
        setLoading(true);
        // We assume the API runs on the same host or is proxied. 
        // Vite setup might be proxying /api to the backend. Let's check from location or env.
        // Usually, in a Vite+React app mapping to a .NET API, requests go to /api/SystemCheck/status
        const response = await axios.get('/api/SystemCheck/status');
        setStatus(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to get system status', err);
        setError('Could not connect to the API server.');
        setStatus({
          databaseConnected: false,
          tablesExist: false,
          documentsVolumeConfigured: false,
          isReady: false
        });
      } finally {
        setLoading(false);
      }
    };

    checkSystem();
  }, []);

  const StatusItem = ({ label, loading, ok }: { label: string; loading: boolean; ok?: boolean }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl mb-3">
      <span className="text-gray-200 font-medium">{label}</span>
      <div className="flex items-center space-x-2">
        {loading ? (
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
        ) : ok ? (
          <div className="flex items-center text-green-400">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>OK</span>
          </div>
        ) : (
          <div className="flex items-center text-red-400">
            <XCircle className="w-5 h-5 mr-2" />
            <span>Failed</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl shadow-black/50 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">System Initialization</h1>
          <p className="text-gray-400 text-sm">Verifying core components...</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <StatusItem 
            label="Database Connection" 
            loading={loading} 
            ok={status?.databaseConnected} 
          />
          <StatusItem 
            label="Database Tables & Migrations" 
            loading={loading} 
            ok={status?.tablesExist} 
          />
          <StatusItem 
            label="Documents Volume Mount" 
            loading={loading} 
            ok={status?.documentsVolumeConfigured} 
          />
        </div>

        {!loading && status?.isReady && (
          <div className="mt-8">
            <a 
              href="/" 
              className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-center rounded-xl font-semibold transition-colors duration-200"
            >
              Continue to Application
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
