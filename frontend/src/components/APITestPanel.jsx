import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader2, Download } from 'lucide-react';
import { runAllTests, runSmokeTest, exportTestResults } from '../services/apiTesting';

export default function APITestPanel({ onClose }) {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [currentTest, setCurrentTest] = useState('');

  const handleRunAllTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    setCurrentTest('Running full test suite...');

    try {
      const results = await runAllTests();
      setTestResults(results);
      setCurrentTest('');
    } catch (error) {
      console.error('Test suite error:', error);
      setCurrentTest('Test suite failed to run');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunSmokeTest = async () => {
    setIsRunning(true);
    setTestResults(null);
    setCurrentTest('Running smoke test...');

    try {
      const results = await runSmokeTest();
      setTestResults(results);
      setCurrentTest('');
    } catch (error) {
      console.error('Smoke test error:', error);
      setCurrentTest('Smoke test failed to run');
    } finally {
      setIsRunning(false);
    }
  };

  const handleExport = () => {
    if (!testResults) return;

    const json = exportTestResults(testResults);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (passed) => {
    if (passed) {
      return <CheckCircle size={20} className="text-green-500" />;
    }
    return <XCircle size={20} className="text-red-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">API Testing Panel</h2>
          <p className="text-blue-100 text-sm">Test all external API integrations</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Action Buttons */}
          {!isRunning && !testResults && (
            <div className="space-y-4">
              <button
                onClick={handleRunSmokeTest}
                className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-medium transition-colors"
              >
                <Play size={20} />
                Run Smoke Test (Quick)
              </button>

              <button
                onClick={handleRunAllTests}
                className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-medium transition-colors"
              >
                <Play size={20} />
                Run All Tests (Comprehensive)
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">What gets tested:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Recognition API health check</li>
                  <li>GurbaniNow API connectivity</li>
                  <li>Multiple Shabad data fetching</li>
                  <li>API response time measurement</li>
                  <li>Gemini AI text generation (if configured)</li>
                  <li>Gemini TTS voice synthesis (if configured)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isRunning && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
              <p className="text-slate-600 font-medium">{currentTest}</p>
              <p className="text-slate-400 text-sm mt-2">This may take a few seconds...</p>
            </div>
          )}

          {/* Results */}
          {testResults && (
            <div className="space-y-4">
              {/* Summary */}
              {testResults.summary && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="font-bold text-lg mb-3">Test Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{testResults.summary.total}</div>
                      <div className="text-xs text-slate-600">Total Tests</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{testResults.summary.passed}</div>
                      <div className="text-xs text-slate-600">Passed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{testResults.summary.failed}</div>
                      <div className="text-xs text-slate-600">Failed</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-xl font-bold text-slate-800">{testResults.summary.passRate}%</div>
                    <div className="text-xs text-slate-600">Pass Rate</div>
                  </div>
                </div>
              )}

              {/* Individual Test Results */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg">Test Results</h3>
                {testResults.results && testResults.results.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.passed)}
                        <span className="font-semibold text-sm">{result.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{result.duration}ms</span>
                    </div>

                    <p className="text-sm text-slate-700 mb-2">{result.status}</p>

                    {result.error && (
                      <div className="bg-red-100 border border-red-300 rounded p-2 text-xs text-red-800 font-mono">
                        {result.error}
                      </div>
                    )}

                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-slate-600 cursor-pointer hover:text-slate-800">
                          View Details
                        </summary>
                        <pre className="mt-2 bg-slate-100 rounded p-2 text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  <Download size={18} />
                  Export Results
                </button>
                <button
                  onClick={() => setTestResults(null)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-lg font-medium transition-colors"
                >
                  Run Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
