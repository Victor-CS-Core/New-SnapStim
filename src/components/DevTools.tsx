/**
 * Dev Tools Panel
 *
 * A floating panel for testing Phase 1 implementation:
 * - Backend API connection
 * - Firebase initialization
 * - API endpoint testing
 *
 * Remove or disable in production builds.
 */

import { useEffect, useState } from "react";
import api from "../lib/api";
import { auth, db, storage } from "../lib/firebase";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");
  const [firebaseStatus, setFirebaseStatus] = useState<
    "checking" | "ready" | "error"
  >("checking");
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Check backend on mount
  useEffect(() => {
    checkBackend();
    checkFirebase();
  }, []);

  const checkBackend = async () => {
    try {
      const result = await api.health();
      setBackendStatus(result.ok ? "connected" : "error");
    } catch (error) {
      setBackendStatus("error");
    }
  };

  const checkFirebase = () => {
    try {
      // Check if Firebase services are initialized
      if (auth && db && storage) {
        setFirebaseStatus("ready");
      } else {
        setFirebaseStatus("error");
      }
    } catch (error) {
      setFirebaseStatus("error");
    }
  };

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(true);
    setTestResult({ testName, status: "running..." });

    try {
      const result = await testFn();
      setTestResult({ testName, status: "success", data: result });
    } catch (error: any) {
      setTestResult({
        testName,
        status: "error",
        error: error.message || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: "Health Check",
      fn: () => api.health(),
    },
    {
      name: "List Clients",
      fn: () => api.listClients("device"),
    },
    {
      name: "List Sessions",
      fn: () => api.listSessions("device"),
    },
    {
      name: "Firebase Auth",
      fn: async () => ({
        currentUser: auth.currentUser,
        authReady: !!auth,
      }),
    },
    {
      name: "Firebase DB",
      fn: async () => ({
        type: db.type,
        app: db.app.name,
      }),
    },
    {
      name: "Data Source",
      fn: async () => {
        try {
          await api.health();
          return { source: "Backend API", status: "connected" };
        } catch {
          return { source: "Mock Data", status: "offline" };
        }
      },
    },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Open Dev Tools"
      >
        🛠️
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="p-4 shadow-xl bg-gray-900 border-2 border-blue-500 text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">🛠️ Dev Tools</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Status Section */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Backend API:</span>
            <StatusBadge status={backendStatus} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Firebase:</span>
            <StatusBadge status={firebaseStatus} />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-4" />

        {/* Test Buttons */}
        <div className="space-y-2 mb-4">
          <p className="text-sm font-semibold mb-2 text-gray-200">Run Tests:</p>
          {tests.map((test) => (
            <Button
              key={test.name}
              onClick={() => runTest(test.name, test.fn)}
              disabled={loading}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
            >
              🧪 {test.name}
            </Button>
          ))}
        </div>

        {/* Results Section */}
        {testResult && (
          <>
            <div className="border-t border-gray-700 my-4" />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-200">
                {testResult.testName}:
              </p>
              <div className="bg-gray-800 p-3 rounded text-xs overflow-auto max-h-48 border border-gray-700">
                {testResult.status === "running..." && (
                  <p className="text-blue-400">Running test...</p>
                )}
                {testResult.status === "success" && (
                  <pre className="text-green-400">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                )}
                {testResult.status === "error" && (
                  <p className="text-red-400">❌ {testResult.error}</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Info */}
        <div className="border-t border-gray-700 mt-4 pt-4">
          <p className="text-xs text-gray-400">
            Phase 1: Backend Connection Testing
          </p>
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "checking") {
    return <span className="text-yellow-400">⏳ Checking...</span>;
  }
  if (status === "connected" || status === "ready") {
    return <span className="text-green-400 font-medium">✅ Connected</span>;
  }
  return <span className="text-red-400 font-medium">❌ Error</span>;
}
