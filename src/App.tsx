import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface CheckResult {
  status: number;
  success: boolean;
  message: string;
  responseTime: number;
}

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  // Helper function to validate URL format
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  // Get status code description
  const getStatusDescription = (status: number): string => {
    const descriptions: Record<number, string> = {
      200: 'OK',
      301: 'Moved Permanently',
      302: 'Found',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout'
    };
    return descriptions[status] || 'Unknown Status';
  };

  const checkWebsite = async () => {
    if (!url) {
      setResult({
        status: 0,
        success: false,
        message: 'Please enter a URL',
        responseTime: 0
      });
      return;
    }

    if (!isValidUrl(url)) {
      setResult({
        status: 0,
        success: false,
        message: 'Invalid URL format',
        responseTime: 0
      });
      return;
    }

    setLoading(true);
    setResult(null);

    const startTime = performance.now();

    try {
      const response = await fetch(url, {
        mode: 'no-cors', // This is needed for many sites due to CORS restrictions
        method: 'HEAD', // We only need headers, not the full response
        timeout: 5000 // 5 second timeout
      });

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      setResult({
        status: response.status,
        success: response.ok,
        message: getStatusDescription(response.status),
        responseTime
      });
    } catch (error) {
      setResult({
        status: 0,
        success: false,
        message: 'Connection failed: Network error or site unreachable',
        responseTime: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Website Connectivity Checker</h1>
          <p className="text-gray-600">Enter a URL to check its availability</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              Website URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={checkWebsite}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Checking...' : 'Check Connection'}
          </button>
        </div>

        {result && (
          <div
            className={`p-4 rounded-md ${
              result.success
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="font-medium">
                {result.success ? 'Connection Successful' : 'Connection Failed'}
              </span>
            </div>
            <div className="mt-2 text-sm">
              <p>Status: {result.status} ({result.message})</p>
              {result.responseTime > 0 && (
                <p>Response Time: {result.responseTime.toFixed(2)}ms</p>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            Note: Some websites may block connection checks due to security policies
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;