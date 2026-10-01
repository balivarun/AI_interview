import type {
  AnalyticsData,
  DashboardData,
  Interview,
  InterviewConfig,
  InterviewReport,
  Question,
  User,
} from "@/lib/types";

export const mockUser: User = {
  id: "user-001",
  name: "Varun Bali",
  email: "user@example.com",
  targetRole: "Software Engineer",
  experience: "Fresher",
  preferredTopics: ["Java", "DSA", "Spring Boot", "React"],
};

export const roleOptions = [
  { name: "Java Developer", icon: "☕", description: "Java + Spring" },
  { name: "SDE", icon: "💻", description: "DSA + CS Core" },
  { name: "Full Stack Developer", icon: "🌐", description: "Frontend + Backend" },
] as const;

export const questionBank: Question[] = [
  {
    id: "q-1",
    prompt:
      "What is the difference between HashMap and ConcurrentHashMap in Java?",
    topic: "Java Collections",
    difficulty: "Medium",
    type: "text",
    expectedAnswer:
      "HashMap is non-thread-safe and not synchronized, while ConcurrentHashMap provides thread-safe access without locking the whole map.",
  },
  {
    id: "q-2",
    prompt:
      "Explain how HashMap works internally in Java and how collision resolution occurs.",
    topic: "Java Collections",
    difficulty: "Medium",
    type: "text",
  },
  {
    id: "q-3",
    prompt:
      "Given an array of integers and a target value, return the indices of two numbers that add up to the target.",
    topic: "Arrays",
    difficulty: "Easy",
    type: "coding",
    problemStatement: "Two Sum",
    examples: ["Input: [2,7,11,15], target: 9", "Output: [0,1]"],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
  },
  {
    id: "q-4",
    prompt:
      "Design a REST API for an interview scheduler and explain trade-offs in consistency and scalability.",
    topic: "System Design",
    difficulty: "Hard",
    type: "text",
  },
  {
    id: "q-5",
    prompt:
      "How would you optimize a React list rendering component with large datasets?",
    topic: "Frontend",
    difficulty: "Medium",
    type: "text",
  },
];

export const mockInterview: Interview = {
  id: "int-001",
  role: "Java Developer",
  difficulty: "Medium",
  type: "Technical",
  experience: "Fresher",
  totalQuestions: 10,
  durationMinutes: 30,
  currentQuestion: 4,
  status: "active",
  topic: "Java Collections",
  startedAt: "2026-09-30T10:30:00.000Z",
  questions: questionBank,
};

export const mockDashboard: DashboardData = {
  user: mockUser,
  stats: [
    { label: "Interviews", value: "12", detail: "Total attempts" },
    { label: "Average Score", value: "78%", detail: "Across all roles" },
    { label: "Best Score", value: "8.4", detail: "Last 30 days" },
    { label: "Streak", value: "4", detail: "Consecutive weeks" },
  ],
  performance: [
    { date: "Aug", score: 64 },
    { date: "Sep", score: 71 },
    { date: "Oct", score: 68 },
    { date: "Nov", score: 79 },
    { date: "Dec", score: 84 },
    { date: "Jan", score: 88 },
  ],
  recentInterviews: [
    { id: "r-1", role: "Java Developer", score: 8.2, difficulty: "Medium", date: "Sep 30" },
    { id: "r-2", role: "SDE", score: 7.6, difficulty: "Medium", date: "Sep 28" },
    { id: "r-3", role: "Full Stack Developer", score: 8.7, difficulty: "Hard", date: "Sep 25" },
  ],
};

export const interviewHistory = [
  { id: "int-001", role: "Java Developer", score: 8.2, difficulty: "Medium", date: "Sep 30" },
  { id: "int-002", role: "SDE", score: 7.6, difficulty: "Medium", date: "Sep 28" },
  { id: "int-003", role: "Full Stack Developer", score: 8.7, difficulty: "Hard", date: "Sep 25" },
  { id: "int-004", role: "Java Developer", score: 9.1, difficulty: "Hard", date: "Sep 20" },
];

export const mockReport: InterviewReport = {
  id: "int-001",
  role: "Java Developer",
  duration: "30 min",
  completedAt: "September 30, 2026",
  score: 7.8,
  evaluatedQuestions: 10,
  totalAnswers: 10,
  technicalKnowledge: 8.0,
  problemSolving: 8.2,
  communication: 7.4,
  codeQuality: 8.0,
  complexityAnalysis: 6.8,
  strengths: ["Java fundamentals", "OOP", "HashMap usage", "REST APIs"],
  weaknesses: ["HashMap internals", "Time complexity", "Multithreading"],
  recommendedTopics: [
    { title: "HashMap Internals", difficulty: "Medium", action: "Practice" },
    { title: "Big-O Complexity", difficulty: "Easy", action: "Practice" },
    { title: "Java Collections", difficulty: "Medium", action: "Practice" },
  ],
};

export const analyticsData: AnalyticsData = {
  performance: [
    { date: "Jan", score: 62 },
    { date: "Feb", score: 71 },
    { date: "Mar", score: 69 },
    { date: "Apr", score: 74 },
    { date: "May", score: 80 },
    { date: "Jun", score: 83 },
    { date: "Jul", score: 78 },
  ],
  skillBreakdown: [
    { skill: "Java", score: 82 },
    { skill: "DSA", score: 74 },
    { skill: "Problem Solving", score: 80 },
    { skill: "Communication", score: 76 },
    { skill: "System Design", score: 68 },
  ],
  topicPerformance: [
    { topic: "Arrays", score: 90 },
    { topic: "Strings", score: 85 },
    { topic: "HashMap", score: 65 },
    { topic: "Linked List", score: 78 },
    { topic: "Trees", score: 60 },
    { topic: "DP", score: 55 },
  ],
};

export const mockInterviewConfig: InterviewConfig = {
  role: "Java Developer",
  experience: "Fresher",
  difficulty: "Medium",
  type: "Technical",
  questionCount: 10,
  duration: 30,
};
