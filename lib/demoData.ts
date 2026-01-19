export interface Instructor {
  id: string;
  name: string;
  specialization: string;
  languages: string[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface Leave {
  startDate: string;
  endDate: string;
  reason: string;
}

export interface DateOverride {
  available: boolean;
  slots?: TimeSlot[];
}

export interface DemoStore {
  instructors: Instructor[];
  weeklyRules: {
    [instructorId: string]: {
      [dayOfWeek: number]: TimeSlot[];
    };
  };
  overrides: {
    [instructorId: string]: {
      [date: string]: DateOverride;
    };
  };
  leaves: {
    [instructorId: string]: Leave[];
  };
}

export const DEMO_STUDIO = {
  id: "demo-studio",
  name: "Haya Studio – Demo",
  timezone: "Asia/Dubai",
};

export const DEMO_PASSWORD = "demo123";

export const DEMO_INSTRUCTORS: Instructor[] = [
  {
    id: "inst-1",
    name: "Sarah Al-Mansouri",
    specialization: "Yoga",
    languages: ["English"],
  },
  {
    id: "inst-2",
    name: "Ahmed Hassan",
    specialization: "Strength",
    languages: ["English"],
  },
  {
    id: "inst-3",
    name: "Fatima Khan",
    specialization: "Gym",
    languages: ["English"],
  },
  {
    id: "inst-4",
    name: "Mohamed Ali",
    specialization: "Meditation",
    languages: ["English"],
  },
  {
    id: "inst-5",
    name: "Layla Ibrahim",
    specialization: "Cardio",
    languages: ["English"],
  },
  {
    id: "inst-6",
    name: "Omar Rashid",
    specialization: "Pilates",
    languages: ["English"],
  },
  {
    id: "inst-7",
    name: "Aisha Mohammed",
    specialization: "Zumba",
    languages: ["English"],
  },
  {
    id: "inst-8",
    name: "Khalid Saeed",
    specialization: "Mobility",
    languages: ["English"],
  },
  {
    id: "inst-9",
    name: "Noor Abdullah",
    specialization: "CrossFit",
    languages: ["English"],
  },
  {
    id: "inst-10",
    name: "Yasmin Farooq",
    specialization: "Breathwork",
    languages: ["English"],
  },
];

// Generate realistic seed data
export function getDefaultDemoStore(): DemoStore {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const inTwoWeeks = new Date(today);
  inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);

  return {
    instructors: DEMO_INSTRUCTORS,
    weeklyRules: {
      // Mon-Fri morning
      "inst-1": {
        1: [{ start: "09:00", end: "13:00" }],
        2: [{ start: "09:00", end: "13:00" }],
        3: [{ start: "09:00", end: "13:00" }],
        4: [{ start: "09:00", end: "13:00" }],
        5: [{ start: "09:00", end: "13:00" }],
      },
      // Tue-Sun evening
      "inst-2": {
        2: [{ start: "16:00", end: "21:00" }],
        3: [{ start: "16:00", end: "21:00" }],
        4: [{ start: "16:00", end: "21:00" }],
        5: [{ start: "16:00", end: "21:00" }],
        6: [{ start: "16:00", end: "21:00" }],
        0: [{ start: "16:00", end: "21:00" }],
      },
      // Weekend only
      "inst-3": {
        6: [{ start: "08:00", end: "14:00" }],
        0: [{ start: "08:00", end: "14:00" }],
      },
      // Split shift Mon-Fri
      "inst-4": {
        1: [
          { start: "09:00", end: "12:00" },
          { start: "17:00", end: "20:00" },
        ],
        2: [
          { start: "09:00", end: "12:00" },
          { start: "17:00", end: "20:00" },
        ],
        3: [
          { start: "09:00", end: "12:00" },
          { start: "17:00", end: "20:00" },
        ],
        4: [
          { start: "09:00", end: "12:00" },
          { start: "17:00", end: "20:00" },
        ],
        5: [
          { start: "09:00", end: "12:00" },
          { start: "17:00", end: "20:00" },
        ],
      },
      // Full week mornings
      "inst-5": {
        0: [{ start: "07:00", end: "12:00" }],
        1: [{ start: "07:00", end: "12:00" }],
        2: [{ start: "07:00", end: "12:00" }],
        3: [{ start: "07:00", end: "12:00" }],
        4: [{ start: "07:00", end: "12:00" }],
        5: [{ start: "07:00", end: "12:00" }],
        6: [{ start: "07:00", end: "12:00" }],
      },
      // Mon-Wed-Fri
      "inst-6": {
        1: [{ start: "10:00", end: "18:00" }],
        3: [{ start: "10:00", end: "18:00" }],
        5: [{ start: "10:00", end: "18:00" }],
      },
      // Evenings all week
      "inst-7": {
        0: [{ start: "18:00", end: "22:00" }],
        1: [{ start: "18:00", end: "22:00" }],
        2: [{ start: "18:00", end: "22:00" }],
        3: [{ start: "18:00", end: "22:00" }],
        4: [{ start: "18:00", end: "22:00" }],
        5: [{ start: "18:00", end: "22:00" }],
        6: [{ start: "18:00", end: "22:00" }],
      },
      // Tue-Thu-Sat
      "inst-8": {
        2: [{ start: "08:00", end: "16:00" }],
        4: [{ start: "08:00", end: "16:00" }],
        6: [{ start: "08:00", end: "16:00" }],
      },
      // Weekend warrior
      "inst-9": {
        5: [{ start: "17:00", end: "21:00" }],
        6: [{ start: "09:00", end: "17:00" }],
        0: [{ start: "09:00", end: "17:00" }],
      },
      // Mon-Fri standard
      "inst-10": {
        1: [{ start: "09:00", end: "17:00" }],
        2: [{ start: "09:00", end: "17:00" }],
        3: [{ start: "09:00", end: "17:00" }],
        4: [{ start: "09:00", end: "17:00" }],
        5: [{ start: "09:00", end: "17:00" }],
      },
    },
    overrides: {
      "inst-1": {
        [formatDate(tomorrow)]: {
          available: false,
        },
      },
      "inst-5": {
        [formatDate(nextWeek)]: {
          available: true,
          slots: [{ start: "14:00", end: "18:00" }],
        },
      },
      "inst-8": {
        [formatDate(inTwoWeeks)]: {
          available: false,
        },
      },
    },
    leaves: {
      "inst-2": [
        {
          startDate: formatDate(nextWeek),
          endDate: formatDate(new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000)),
          reason: "Annual Leave",
        },
      ],
      "inst-6": [
        {
          startDate: formatDate(new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000)),
          reason: "Sick Leave",
        },
      ],
      "inst-9": [
        {
          startDate: formatDate(new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000)),
          reason: "Personal Leave",
        },
      ],
    },
  };
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
