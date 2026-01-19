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
    <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
      <div className="bg-dark-100 rounded-2xl shadow-2xl border border-dark-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-primary-600/20 rounded-xl mb-4">
            <svg
              className="w-12 h-12 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {DEMO_STUDIO.name}
          </h1>
          <p className="text-dark-500">Scheduling Demo Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              Login As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("MANAGER")}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  role === "MANAGER"
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : "bg-dark-200 text-dark-600 hover:bg-dark-300 hover:text-white"
                }`}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => setRole("INSTRUCTOR")}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  role === "INSTRUCTOR"
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : "bg-dark-200 text-dark-600 hover:bg-dark-300 hover:text-white"
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
                className="block text-sm font-medium text-dark-600 mb-2"
              >
                Select Instructor
              </label>
              <select
                id="instructor"
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="w-full px-4 py-3 bg-dark-200 border border-dark-300 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="" className="bg-dark-200">
                  Choose an instructor...
                </option>
                {DEMO_INSTRUCTORS.map((instructor) => (
                  <option
                    key={instructor.id}
                    value={instructor.id}
                    className="bg-dark-200"
                  >
                    {instructor.name} - {instructor.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-dark-600 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter demo password"
              className="w-full px-4 py-3 bg-dark-200 border border-dark-300 text-white placeholder-dark-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40"
          >
            Login
          </button>

          <div className="bg-primary-600/10 border border-primary-600/30 px-4 py-3 rounded-lg text-sm">
            <p className="font-medium text-primary-400 mb-1">Demo Credentials:</p>
            <p className="text-primary-300">Password: demo123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
