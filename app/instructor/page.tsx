"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getDemoStore, saveDemoStore, clearSession } from "@/lib/demoStore";
import { TimeSlot, Leave } from "@/lib/demoData";
import { getDayName, getNext7DaysAvailability } from "@/lib/availability";

export default function InstructorPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [instructorName, setInstructorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [selectedDay, setSelectedDay] = useState(1);
  const [newSlotStart, setNewSlotStart] = useState("09:00");
  const [newSlotEnd, setNewSlotEnd] = useState("17:00");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [weeklySlots, setWeeklySlots] = useState<{ [day: number]: TimeSlot[] }>({});
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [preview, setPreview] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const session = getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.role !== "INSTRUCTOR" || !session.instructorId) {
      router.push("/login");
      return;
    }

    const store = getDemoStore();
    const instructor = store.instructors.find((i) => i.id === session.instructorId);

    if (!instructor) {
      router.push("/login");
      return;
    }

    setInstructorName(instructor.name);
    setSpecialization(instructor.specialization);
    setWeeklySlots(store.weeklyRules[session.instructorId] || {});
    setLeaves(store.leaves[session.instructorId] || []);

    loadPreview(session.instructorId);
  }, [router]);

  const loadPreview = (instructorId: string) => {
    const store = getDemoStore();
    const previewData = getNext7DaysAvailability(store, instructorId);
    setPreview(previewData);
  };

  const handleAddSlot = () => {
    const session = getSession();
    if (!session || !session.instructorId) return;

    const newSlots = { ...weeklySlots };
    if (!newSlots[selectedDay]) {
      newSlots[selectedDay] = [];
    }
    newSlots[selectedDay] = [
      ...newSlots[selectedDay],
      { start: newSlotStart, end: newSlotEnd },
    ];

    setWeeklySlots(newSlots);

    const store = getDemoStore();
    store.weeklyRules[session.instructorId] = newSlots;
    saveDemoStore(store);
    loadPreview(session.instructorId);
  };

  const handleDeleteSlot = (day: number, index: number) => {
    const session = getSession();
    if (!session || !session.instructorId) return;

    const newSlots = { ...weeklySlots };
    newSlots[day] = newSlots[day].filter((_, i) => i !== index);
    if (newSlots[day].length === 0) {
      delete newSlots[day];
    }

    setWeeklySlots(newSlots);

    const store = getDemoStore();
    store.weeklyRules[session.instructorId] = newSlots;
    saveDemoStore(store);
    loadPreview(session.instructorId);
  };

  const handleAddLeave = () => {
    const session = getSession();
    if (!session || !session.instructorId) return;

    if (!leaveStart || !leaveEnd || !leaveReason) {
      alert("Please fill all leave fields");
      return;
    }

    const newLeave = {
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: leaveReason,
    };

    const newLeaves = [...leaves, newLeave];
    setLeaves(newLeaves);

    const store = getDemoStore();
    if (!store.leaves[session.instructorId]) {
      store.leaves[session.instructorId] = [];
    }
    store.leaves[session.instructorId] = newLeaves;
    saveDemoStore(store);

    setLeaveStart("");
    setLeaveEnd("");
    setLeaveReason("");
    loadPreview(session.instructorId);
  };

  const handleDeleteLeave = (index: number) => {
    const session = getSession();
    if (!session || !session.instructorId) return;

    const newLeaves = leaves.filter((_, i) => i !== index);
    setLeaves(newLeaves);

    const store = getDemoStore();
    store.leaves[session.instructorId] = newLeaves;
    saveDemoStore(store);
    loadPreview(session.instructorId);
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
              <h1 className="text-2xl font-bold text-gray-900">{instructorName}</h1>
              <p className="text-sm text-gray-600">{specialization} Instructor</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Availability */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Weekly Availability
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                    <option key={day} value={day}>
                      {getDayName(day)}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={newSlotStart}
                  onChange={(e) => setNewSlotStart(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="time"
                  value={newSlotEnd}
                  onChange={(e) => setNewSlotEnd(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleAddSlot}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <div key={day}>
                    {weeklySlots[day] && weeklySlots[day].length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {getDayName(day)}
                        </h3>
                        <div className="space-y-2">
                          {weeklySlots[day].map((slot, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-white px-3 py-2 rounded border"
                            >
                              <span className="text-sm text-gray-700">
                                {slot.start} - {slot.end}
                              </span>
                              <button
                                onClick={() => handleDeleteSlot(day, idx)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leave Management */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Leave Management
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="e.g., Annual Leave, Sick Leave"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                onClick={handleAddLeave}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add Leave
              </button>

              <div className="space-y-2">
                {leaves.map((leave, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {leave.reason}
                      </p>
                      <p className="text-xs text-gray-600">
                        {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteLeave(idx)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next 7 Days Preview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Next 7 Days Preview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {preview.map((day, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  day.availability.status === "available"
                    ? "bg-green-50 border-green-200"
                    : day.availability.status === "on-leave"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p className="font-medium text-gray-900 mb-1">{day.dateDisplay}</p>
                <p className="text-sm text-gray-700">{day.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
