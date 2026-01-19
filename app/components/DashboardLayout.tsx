"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/demoStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentPage: "instructor" | "manager";
  userRole: "INSTRUCTOR" | "MANAGER";
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  currentPage,
  userRole,
}: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const handleNavigate = (page: string) => {
    router.push(`/${page}`);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-100 border-r border-dark-200 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-dark-200">
            <h1 className="text-xl font-bold text-white">Haya Studio</h1>
            <p className="text-sm text-dark-500 mt-1">Demo Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {userRole === "INSTRUCTOR" && (
              <button
                onClick={() => handleNavigate("instructor")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === "instructor"
                    ? "bg-primary-600 text-white"
                    : "text-dark-600 hover:bg-dark-200 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">My Dashboard</span>
              </button>
            )}

            {userRole === "MANAGER" && (
              <button
                onClick={() => handleNavigate("manager")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === "manager"
                    ? "bg-primary-600 text-white"
                    : "text-dark-600 hover:bg-dark-200 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="font-medium">Manager View</span>
              </button>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-dark-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-dark-100 border-b border-dark-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-dark-600 hover:bg-dark-200 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                <div>
                  <h2 className="text-2xl font-bold text-white">{title}</h2>
                  {subtitle && (
                    <p className="text-sm text-dark-500 mt-0.5">{subtitle}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-primary-600/20 text-primary-400 rounded-lg text-sm font-medium">
                  {userRole}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
