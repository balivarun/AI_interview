import {
  analyticsData,
  interviewHistory,
  mockDashboard,
  mockInterview,
  mockReport,
} from "@/lib/mock-data";
import type {
  AnswerPayload,
  CodeSubmission,
  DashboardData,
  Interview,
  InterviewConfig,
  InterviewReport,
  User,
} from "@/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboard(): Promise<DashboardData> {
  await delay(350);
  return mockDashboard;
}

export async function getInterviews(): Promise<Interview[]> {
  await delay(400);
  return [
    { ...mockInterview, id: "int-001", role: "Java Developer" },
    { ...mockInterview, id: "int-002", role: "SDE", topic: "Data Structures", difficulty: "Hard" },
    { ...mockInterview, id: "int-003", role: "Full Stack Developer", topic: "System Design", difficulty: "Hard" },
  ];
}

export async function getInterview(id: string): Promise<Interview> {
  await delay(300);
  return { ...mockInterview, id, role: "Java Developer" };
}

export async function createInterview(data: InterviewConfig): Promise<Interview> {
  await delay(450);
  return {
    ...mockInterview,
    id: `int-${Date.now()}`,
    role: data.role,
    difficulty: data.difficulty,
    type: data.type,
    experience: data.experience,
    totalQuestions: data.questionCount,
    durationMinutes: data.duration,
    currentQuestion: 1,
    status: "active",
  };
}

export async function submitAnswer(data: AnswerPayload): Promise<{ ok: true }> {
  await delay(250);
  return { ok: true };
}

export async function submitCode(data: CodeSubmission): Promise<{ ok: true; passed: number; total: number }> {
  await delay(300);
  return {
    ok: true,
    passed: 3,
    total: 4,
  };
}

export async function getReport(id: string): Promise<InterviewReport> {
  await delay(350);
  return { ...mockReport, id };
}

export async function getAnalytics(): Promise<typeof analyticsData> {
  await delay(300);
  return analyticsData;
}

export async function getUser(): Promise<User> {
  await delay(250);
  return mockDashboard.user;
}

export async function getHistory(): Promise<typeof interviewHistory> {
  await delay(250);
  return interviewHistory;
}
