"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEMO_INSTRUCTORS, DEMO_STUDIO, DEMO_PASSWORD } from "@/lib/demoData";
import { saveSession, getSession } from "@/lib/demoStore";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"MANAGER" | "INSTRUCTOR">("MANAGER");
  const [instructorId, setInstructorId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already logged in
    const session = getSession();
    if (session) {
      if (session.role === "MANAGER") {
        router.push("/manager");
      } else {
        router.push("/instructor");
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== DEMO_PASSWORD) {
      setError("Invalid password");
      return;
    }

    if (role === "INSTRUCTOR" && !instructorId) {
      setError("Please select an instructor");
      return;
    }

    const session = {
      role,
      instructorId: role === "INSTRUCTOR" ? instructorId : undefined,
      studioId: DEMO_STUDIO.id,
    };

    saveSession(session);

    if (role === "MANAGER") {
      router.push("/manager");
    } else {
      router.push("/instructor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {DEMO_STUDIO.name}
          </h1>
          <p className="text-gray-600">Scheduling Demo Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("MANAGER")}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  role === "MANAGER"
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => setRole("INSTRUCTOR")}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  role === "INSTRUCTOR"
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Instructor
              </button>
            </div>
          </div>

          {role === "INSTRUCTOR" && (
            <div>
              <label
                htmlFor="instructor"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Instructor
              </label>
              <select
                id="instructor"
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Choose an instructor...</option>
                {DEMO_INSTRUCTORS.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name} - {instructor.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter demo password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Login
          </button>

          <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg text-sm">
            <p className="font-medium text-blue-900 mb-1">Demo Credentials:</p>
            <p className="text-blue-700">Password: demo123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
