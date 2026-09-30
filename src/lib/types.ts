export type RoleType = "Java Developer" | "SDE" | "Full Stack Developer";
export type ExperienceLevel = "Fresher" | "0–1 Year" | "1–3 Years";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type InterviewType = "Technical" | "DSA" | "Mixed";
export type QuestionType = "text" | "coding";

export interface User {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  experience: ExperienceLevel;
  preferredTopics: string[];
}

export interface Question {
  id: string;
  prompt: string;
  topic: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  expectedAnswer?: string;
  problemStatement?: string;
  examples?: string[];
  constraints?: string[];
}

export interface Interview {
  id: string;
  role: RoleType;
  difficulty: DifficultyLevel;
  type: InterviewType;
  experience: ExperienceLevel;
  totalQuestions: number;
  durationMinutes: number;
  currentQuestion: number;
  status: "scheduled" | "active" | "completed";
  startedAt?: string;
  completedAt?: string;
  topic: string;
  questions: Question[];
}

export interface DashboardStat {
  label: string;
  value: string;
  detail: string;
}

export interface RecentInterview {
  id: string;
  role: RoleType;
  score: number;
  difficulty: DifficultyLevel;
  date: string;
}

export interface TopicPerformance {
  topic: string;
  score: number;
}

export interface InterviewReport {
  id: string;
  role: RoleType;
  duration: string;
  completedAt: string;
  score: number;
  technicalKnowledge: number;
  problemSolving: number;
  communication: number;
  codeQuality: number;
  complexityAnalysis: number;
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: Array<{
    title: string;
    difficulty: DifficultyLevel;
    action: string;
  }>;
}

export interface PerformancePoint {
  date: string;
  score: number;
}

export interface InterviewConfig {
  role: RoleType;
  experience: ExperienceLevel;
  difficulty: DifficultyLevel;
  type: InterviewType;
  questionCount: number;
  duration: number;
}

export interface AnswerPayload {
  interviewId: string;
  questionId: string;
  answer: string;
  questionType: QuestionType;
}

export interface CodeSubmission {
  interviewId: string;
  questionId: string;
  language: "Java" | "Python" | "C++";
  code: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  performance: PerformancePoint[];
  recentInterviews: RecentInterview[];
  user: User;
}

export interface AnalyticsData {
  performance: PerformancePoint[];
  skillBreakdown: { skill: string; score: number }[];
  topicPerformance: TopicPerformance[];
}
