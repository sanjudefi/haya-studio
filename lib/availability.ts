import { DemoStore, TimeSlot, Leave } from "./demoData";

export interface AvailabilityResult {
  status: "available" | "on-leave" | "not-available";
  slots?: TimeSlot[];
  leaveReason?: string;
}

export function getInstructorAvailability(
  store: DemoStore,
  instructorId: string,
  date: string
): AvailabilityResult {
  const dateObj = new Date(date + "T00:00:00");

  // 1. Check if on leave
  const leaves = store.leaves[instructorId] || [];
  const onLeave = leaves.find((leave) => {
    const startDate = new Date(leave.startDate + "T00:00:00");
    const endDate = new Date(leave.endDate + "T00:00:00");
    return dateObj >= startDate && dateObj <= endDate;
  });

  if (onLeave) {
    return {
      status: "on-leave",
      leaveReason: onLeave.reason,
    };
  }

  // 2. Check for override
  const overrides = store.overrides[instructorId] || {};
  const override = overrides[date];

  if (override) {
    if (!override.available) {
      return {
        status: "not-available",
      };
    }
    return {
      status: "available",
      slots: override.slots || [],
    };
  }

  // 3. Use weekly rules
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const weeklyRules = store.weeklyRules[instructorId] || {};
  const slots = weeklyRules[dayOfWeek] || [];

  if (slots.length > 0) {
    return {
      status: "available",
      slots,
    };
  }

  // 4. Default: not available
  return {
    status: "not-available",
  };
}

export function formatAvailabilityText(result: AvailabilityResult): string {
  if (result.status === "on-leave") {
    return `On Leave${result.leaveReason ? ` (${result.leaveReason})` : ""}`;
  }

  if (result.status === "not-available") {
    return "Not Available";
  }

  if (!result.slots || result.slots.length === 0) {
    return "Available (No slots defined)";
  }

  const slotTexts = result.slots.map((slot) => `${slot.start}-${slot.end}`);
  return slotTexts.join(", ");
}

export function getNext7DaysAvailability(
  store: DemoStore,
  instructorId: string
): Array<{ date: string; dateDisplay: string; availability: AvailabilityResult; text: string }> {
  const results = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const dateStr = formatDate(date);
    const availability = getInstructorAvailability(store, instructorId, dateStr);
    const text = formatAvailabilityText(availability);

    results.push({
      date: dateStr,
      dateDisplay: formatDateDisplay(date),
      availability,
      text,
    });
  }

  return results;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDateDisplay(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

export function formatDateFull(date: Date): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function getDayName(dayOfWeek: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayOfWeek];
}
