import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Database, ShieldCheck } from 'lucide-react';
import axios from 'axios';

interface SystemStatus {
    databaseName?: string;
    databaseConnected: boolean;
    dbError?: string;
    tablesExist: boolean;
    tableError?: string;
    documentsVolumeConfigured: boolean;
    mountError?: string;
    isReady: boolean;
}

export const SettingsPage: React.FC = () => {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasRun, setHasRun] = useState(false);

    const runDiagnosis = async () => {
        try {
            setLoading(true);
            setError(null);
            setHasRun(true);
            const response = await axios.get('/api/SystemCheck/status');
            setStatus(response.data);
        } catch (err: any) {
            console.error('Failed to run diagnostics', err);
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

    // Optionally run once on load
    useEffect(() => {
        runDiagnosis();
    }, []);

    const StatusItem = ({ label, isLoading, ok, errorStr }: { label: string; isLoading: boolean; ok?: boolean; errorStr?: string }) => (
        <div className="flex flex-col p-4 bg-surfaceHighlight/30 border border-surfaceHighlight rounded-xl">
            <div className="flex items-center justify-between">
                <span className="text-text font-medium">{label}</span>
                <div className="flex items-center space-x-2">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : ok ? (
                        <div className="flex items-center text-green-500">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span>OK</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-red-500">
                            <XCircle className="w-5 h-5 mr-2" />
                            <span>Failed</span>
                        </div>
                    )}
                </div>
            </div>
            {!ok && !isLoading && errorStr && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm font-mono break-words">
                    {errorStr}
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-text to-text-muted bg-clip-text">Settings & System Diagnosis</h1>
                    <p className="text-text-muted mt-2">Manage your app configuration and verify system health.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Database Info Card */}
                <div className="bg-surface/50 border border-surfaceHighlight rounded-2xl p-6 backdrop-blur-md">
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl mr-4">
                            <Database size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-text">Database Connection</h2>
                            <p className="text-text-muted text-sm">PostgreSQL Backend</p>
                        </div>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl font-mono text-sm break-all">
                        <span className="text-gray-400">Database Name: </span>
                        <span className="text-green-400 font-bold">{status?.databaseName || 'Loading...'}</span>
                    </div>
                </div>

                {/* Diagnosis Action Card */}
                <div className="bg-surface/50 border border-surfaceHighlight rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-text mb-2">System Diagnostics</h2>
                        <p className="text-text-muted text-sm mb-4">Run a full health check on the API, Database, and Volume Mounts.</p>
                    </div>
                    <button
                        onClick={runDiagnosis}
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3 px-4 bg-primary hover:bg-primary-hover active:bg-primary/80 transition-colors text-white font-semibold rounded-xl disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                        {loading ? 'Diagnosing...' : 'Run Diagnostics'}
                    </button>
                </div>
            </div>

            {hasRun && (
                <div className="bg-surface/50 border border-surfaceHighlight rounded-2xl p-6 backdrop-blur-md">
                    <h3 className="text-lg font-semibold text-text mb-4">Diagnostic Results</h3>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <StatusItem
                            label="Database Accessibility"
                            isLoading={loading}
                            ok={status?.databaseConnected}
                            errorStr={status?.dbError}
                        />
                        <StatusItem
                            label="Entity Framework Migrations (Tables Exist)"
                            isLoading={loading}
                            ok={status?.tablesExist}
                            errorStr={status?.tableError}
                        />
                        <StatusItem
                            label="Document Storage Volume Mount"
                            isLoading={loading}
                            ok={status?.documentsVolumeConfigured}
                            errorStr={status?.mountError}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
