"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getDemoStore, clearSession } from "@/lib/demoStore";
import { DEMO_STUDIO } from "@/lib/demoData";
import {
  getInstructorAvailability,
  formatAvailabilityText,
  formatDate,
  formatDateFull,
} from "@/lib/availability";

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

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {DEMO_STUDIO.name}
              </h1>
              <p className="text-sm text-gray-600">
                Manager Dashboard • {DEMO_STUDIO.timezone}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Instructor Availability
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View and download daily schedules
              </p>
            </div>

            <div className="flex gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleDownloadSnapshot}
                disabled={downloading}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {downloading ? "Generating..." : "Download PNG"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Instructor
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Specialization
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Availability
                  </th>
                </tr>
              </thead>
              <tbody>
                {availability.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.specialization}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "available"
                            ? "bg-green-100 text-green-800"
                            : item.status === "on-leave"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
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

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Mode</h3>
          <p className="text-sm text-blue-800">
            This is a capability demonstration. All data is stored locally in your
            browser. The PNG snapshot feature showcases how daily schedules can be
            exported and shared.
          </p>
        </div>
      </main>
    </div>
  );
}
