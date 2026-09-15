export const milestones = [
  {
    id: "first",
    title: "First mark",
    description: "Log your first clean day.",
    unlocked: ({ loggedDays }) => loggedDays >= 1,
  },
  {
    id: "three",
    title: "Three in a row",
    description: "Hold a 3-day streak.",
    unlocked: ({ bestStreak }) => bestStreak >= 3,
  },
  {
    id: "week",
    title: "Full week",
    description: "Reach 7 consecutive days.",
    unlocked: ({ bestStreak }) => bestStreak >= 7,
  },
  {
    id: "fortnight",
    title: "Fortnight",
    description: "Reach 14 consecutive days.",
    unlocked: ({ bestStreak }) => bestStreak >= 14,
  },
  {
    id: "month",
    title: "One month",
    description: "Reach 30 consecutive days.",
    unlocked: ({ bestStreak }) => bestStreak >= 30,
  },
  {
    id: "ten-logs",
    title: "Ten logged days",
    description: "Accumulate 10 days on the record.",
    unlocked: ({ loggedDays }) => loggedDays >= 10,
  },
];
