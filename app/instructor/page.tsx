"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getDemoStore, saveDemoStore } from "@/lib/demoStore";
import { TimeSlot, Leave, DateOverride } from "@/lib/demoData";
import { getDayName, getNext7DaysAvailability } from "@/lib/availability";
import DashboardLayout from "../components/DashboardLayout";

const DAYS = [
  { num: 1, short: "Mon", full: "Monday" },
  { num: 2, short: "Tue", full: "Tuesday" },
  { num: 3, short: "Wed", full: "Wednesday" },
  { num: 4, short: "Thu", full: "Thursday" },
  { num: 5, short: "Fri", full: "Friday" },
  { num: 6, short: "Sat", full: "Saturday" },
  { num: 0, short: "Sun", full: "Sunday" },
];

export default function InstructorPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [instructorName, setInstructorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [selectedDay, setSelectedDay] = useState(1);
  const [newSlotStart, setNewSlotStart] = useState("09:00");
  const [newSlotEnd, setNewSlotEnd] = useState("17:00");
  const [weeklySlots, setWeeklySlots] = useState<{ [day: number]: TimeSlot[] }>({});
  const [preview, setPreview] = useState<any[]>([]);

  // Holiday/Special Hours state
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayType, setHolidayType] = useState<"closed" | "custom">("closed");
  const [holidayStart, setHolidayStart] = useState("09:00");
  const [holidayEnd, setHolidayEnd] = useState("17:00");
  const [overrides, setOverrides] = useState<{ [date: string]: DateOverride }>({});
  const [leaves, setLeaves] = useState<Leave[]>([]);

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
    setOverrides(store.overrides[session.instructorId] || {});
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

  const handleAddHoliday = () => {
    const session = getSession();
    if (!session || !session.instructorId) return;

    if (!holidayDate) {
      alert("Please select a date");
      return;
    }

    const newOverrides = { ...overrides };

    if (holidayType === "closed") {
      newOverrides[holidayDate] = { available: false };
    } else {
      newOverrides[holidayDate] = {
        available: true,
        slots: [{ start: holidayStart, end: holidayEnd }],
      };
    }

    setOverrides(newOverrides);

    const store = getDemoStore();
    if (!store.overrides[session.instructorId]) {
      store.overrides[session.instructorId] = {};
    }
    store.overrides[session.instructorId] = newOverrides;
    saveDemoStore(store);

    setHolidayDate("");
    loadPreview(session.instructorId);
  };

  const handleDeleteOverride = (date: string) => {
    const session = getSession();
    if (!session || !session.instructorId) return;

    const newOverrides = { ...overrides };
    delete newOverrides[date];
    setOverrides(newOverrides);

    const store = getDemoStore();
    store.overrides[session.instructorId] = newOverrides;
    saveDemoStore(store);
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

  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout
      title={instructorName}
      subtitle={`${specialization} Instructor`}
      currentPage="instructor"
      userRole="INSTRUCTOR"
    >
      <div className="space-y-6">
        {/* Weekly Availability Section */}
        <div className="bg-dark-100 rounded-xl shadow-xl border border-dark-200 p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Weekly Availability
          </h2>

          {/* Day Selector - Horizontal */}
          <div className="mb-6">
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day) => (
                <button
                  key={day.num}
                  onClick={() => setSelectedDay(day.num)}
                  className={`py-3 px-2 rounded-lg font-medium text-sm transition-all ${
                    selectedDay === day.num
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                      : "bg-dark-200 text-dark-600 hover:bg-dark-300 hover:text-white"
                  }`}
                >
                  <div className="hidden sm:block">{day.full}</div>
                  <div className="sm:hidden">{day.short}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-dark-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-dark-600 mb-3">
              Add time slot for {DAYS.find((d) => d.num === selectedDay)?.full}
            </h3>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs text-dark-500 mb-1">Start Time</label>
                <input
                  type="time"
                  value={newSlotStart}
                  onChange={(e) => setNewSlotStart(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs text-dark-500 mb-1">End Time</label>
                <input
                  type="time"
                  value={newSlotEnd}
                  onChange={(e) => setNewSlotEnd(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddSlot}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-primary-600/30"
                >
                  Add Slot
                </button>
              </div>
            </div>
          </div>

          {/* Current Schedule Display */}
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div key={day.num}>
                {weeklySlots[day.num] && weeklySlots[day.num].length > 0 && (
                  <div className="bg-dark-200 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3">{day.full}</h3>
                    <div className="space-y-2">
                      {weeklySlots[day.num].map((slot, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-dark-300 px-4 py-2.5 rounded-lg border border-dark-400"
                        >
                          <span className="text-dark-600 font-medium">
                            {slot.start} - {slot.end}
                          </span>
                          <button
                            onClick={() => handleDeleteSlot(day.num, idx)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
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

        {/* Holiday / Special Hours Section */}
        <div className="bg-dark-100 rounded-xl shadow-xl border border-dark-200 p-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Holiday & Special Hours
          </h2>
          <p className="text-sm text-dark-500 mb-6">
            Set your availability for specific dates (holidays, special events, etc.)
          </p>

          {/* Add Holiday Form */}
          <div className="bg-dark-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">
                  Availability Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHolidayType("closed")}
                    className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                      holidayType === "closed"
                        ? "bg-red-600 text-white"
                        : "bg-dark-300 text-dark-600 hover:bg-dark-400"
                    }`}
                  >
                    Closed
                  </button>
                  <button
                    type="button"
                    onClick={() => setHolidayType("custom")}
                    className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                      holidayType === "custom"
                        ? "bg-primary-600 text-white"
                        : "bg-dark-300 text-dark-600 hover:bg-dark-400"
                    }`}
                  >
                    Custom Hours
                  </button>
                </div>
              </div>
            </div>

            {holidayType === "custom" && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-dark-500 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={holidayStart}
                    onChange={(e) => setHolidayStart(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-400 text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-500 mb-1">End Time</label>
                  <input
                    type="time"
                    value={holidayEnd}
                    onChange={(e) => setHolidayEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-400 text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleAddHoliday}
              className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-primary-600/30"
            >
              Save Special Hours
            </button>
          </div>

          {/* Special Hours List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-dark-600 mb-3">Upcoming Special Days</h3>
            {Object.entries(overrides)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, override]) => (
                <div
                  key={date}
                  className="flex justify-between items-center bg-dark-200 px-4 py-3 rounded-lg border border-dark-300"
                >
                  <div>
                    <p className="text-white font-medium">{date}</p>
                    <p className="text-sm text-dark-500">
                      {override.available
                        ? `Available: ${override.slots?.[0]?.start} - ${override.slots?.[0]?.end}`
                        : "Closed All Day"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteOverride(date)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}

            {leaves.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-dark-600 mb-3 mt-6">Leave Periods</h3>
                {leaves.map((leave, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 rounded-lg"
                  >
                    <div>
                      <p className="text-yellow-400 font-medium">{leave.reason}</p>
                      <p className="text-sm text-yellow-300/70">
                        {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteLeave(idx)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </>
            )}

            {Object.keys(overrides).length === 0 && leaves.length === 0 && (
              <p className="text-dark-500 text-sm text-center py-8">
                No special hours or leave periods set
              </p>
            )}
          </div>
        </div>

        {/* Next 7 Days Preview */}
        <div className="bg-dark-100 rounded-xl shadow-xl border border-dark-200 p-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Next 7 Days Preview
          </h2>
          <p className="text-sm text-dark-500 mb-6">
            Quick overview of your upcoming availability
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {preview.map((day, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 transition-all ${
                  day.availability.status === "available"
                    ? "bg-primary-600/10 border-primary-600/30"
                    : day.availability.status === "on-leave"
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-dark-200 border-dark-300"
                }`}
              >
                <p className="font-semibold text-white mb-1">{day.dateDisplay}</p>
                <p className={`text-sm ${
                  day.availability.status === "available"
                    ? "text-primary-400"
                    : day.availability.status === "on-leave"
                    ? "text-yellow-400"
                    : "text-dark-500"
                }`}>
                  {day.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
