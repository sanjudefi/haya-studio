"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getDemoStore } from "@/lib/demoStore";
import { DEMO_STUDIO } from "@/lib/demoData";
import {
  getInstructorAvailability,
  formatAvailabilityText,
  formatDate,
  formatDateFull,
} from "@/lib/availability";
import DashboardLayout from "../components/DashboardLayout";

export default function ManagerPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [availability, setAvailability] = useState<any[]>([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.role !== "MANAGER") {
      router.push("/login");
      return;
    }

    // Set today as default
    const today = new Date();
    const todayStr = formatDate(today);
    setSelectedDate(todayStr);
    loadAvailability(todayStr);
  }, [router]);

  const loadAvailability = (date: string) => {
    const store = getDemoStore();
    const results = store.instructors.map((instructor) => {
      const avail = getInstructorAvailability(store, instructor.id, date);
      const text = formatAvailabilityText(avail);

      return {
        name: instructor.name,
        specialization: instructor.specialization,
        avatarUrl: instructor.avatarUrl,
        status: avail.status,
        text,
      };
    });

    setAvailability(results);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    loadAvailability(date);
  };

  const handleDownloadSnapshot = async () => {
    setDownloading(true);

    try {
      const dateObj = new Date(selectedDate + "T00:00:00");

      // Send all instructors (no filtering)
      const payload = {
        studioName: DEMO_STUDIO.name,
        date: formatDateFull(dateObj),
        instructors: availability.map((a) => ({
          name: a.name,
          specialization: a.specialization,
          statusText: a.text,
        })),
      };

      const response = await fetch("/api/snapshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate snapshot");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `haya-studio-${selectedDate}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading snapshot:", error);
      alert("Failed to download snapshot. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  const totalInstructors = availability.length;
  const availableToday = availability.filter((a) => a.status === "available").length;
  const closedToday = availability.filter((a) => a.status === "not-available").length;
  const onLeaveToday = availability.filter((a) => a.status === "on-leave").length;

  return (
    <DashboardLayout
      title="Manager Dashboard"
      subtitle={`${DEMO_STUDIO.name} • ${DEMO_STUDIO.timezone}`}
      currentPage="manager"
      userRole="MANAGER"
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-dark-100 border border-dark-200 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-500 text-sm font-medium">Total Instructors</p>
                <p className="text-3xl font-bold text-white mt-2">{totalInstructors}</p>
              </div>
              <div className="p-3 bg-primary-600/20 rounded-lg">
                <svg
                  className="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-dark-100 border border-dark-200 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-500 text-sm font-medium">Available Today</p>
                <p className="text-3xl font-bold text-primary-400 mt-2">{availableToday}</p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-dark-100 border border-dark-200 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-500 text-sm font-medium">On Leave</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">{onLeaveToday}</p>
              </div>
              <div className="p-3 bg-yellow-600/20 rounded-lg">
                <svg
                  className="w-8 h-8 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-dark-100 border border-dark-200 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-500 text-sm font-medium">Not Available</p>
                <p className="text-3xl font-bold text-dark-500 mt-2">{closedToday}</p>
              </div>
              <div className="p-3 bg-red-600/20 rounded-lg">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Table */}
        <div className="bg-dark-100 rounded-xl shadow-xl border border-dark-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Instructor Availability
              </h2>
              <p className="text-sm text-dark-500 mt-1">
                View and download daily schedules
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-4 py-2 bg-dark-200 border border-dark-300 text-white rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <button
                onClick={handleDownloadSnapshot}
                disabled={downloading}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40"
              >
                {downloading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download PNG
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-300">
                  <th className="text-left py-3 px-4 font-semibold text-dark-600">
                    Instructor
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-dark-600">
                    Specialization
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-dark-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {availability.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-dark-200 hover:bg-dark-200 transition-colors ${
                      idx % 2 === 0 ? "bg-dark-100" : "bg-dark-50"
                    }`}
                  >
                    <td className="py-4 px-4 font-medium text-white">
                      {item.name}
                    </td>
                    <td className="py-4 px-4 text-dark-600">
                      {item.specialization}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                          item.status === "available"
                            ? "bg-primary-600/20 text-primary-400 border border-primary-600/30"
                            : item.status === "on-leave"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-dark-200 text-dark-500 border border-dark-300"
                        }`}
                      >
                        {item.text}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demo Info */}
        <div className="bg-primary-600/10 border border-primary-600/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-primary-400 mb-1">Demo Mode</h3>
              <p className="text-sm text-primary-300/80">
                This is a capability demonstration. All data is stored locally in your
                browser. The PNG snapshot feature showcases how daily schedules can be
                exported and shared.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
