import type {
  AnalyticsData,
  AnswerPayload,
  CodeSubmission,
  DashboardData,
  Interview,
  InterviewConfig,
  InterviewReport,
  User,
} from "@/lib/types";

const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/$/, "");
type SessionTokenProvider = () => Promise<string | null>;
let sessionTokenProvider: SessionTokenProvider = async () => null;

export function setSessionTokenProvider(provider: SessionTokenProvider): void {
  sessionTokenProvider = provider;
}

interface ApiInterview {
  id: string;
  role: string;
  difficulty: string;
  type: string;
  experience: string;
  totalQuestions: number;
  durationMinutes: number;
  currentQuestion: number;
  status: string;
  startedAt?: string;
  completedAt?: string;
  topic: string;
  questions: Array<{
    id: string;
    prompt: string;
    topic: string;
    difficulty: string;
    type: string;
    questionNumber: number;
  }>;
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  experience?: string | null;
  preferredTopics?: string[];
}

interface ApiError {
  message?: string;
}

export interface BackendHealth {
  status: "UP";
  service: string;
  timestamp: string;
}

export interface InterviewHistoryItem {
  id: string;
  role: string;
  score: number;
  difficulty: string;
  date: string;
  status: Interview["status"];
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  const token = await sessionTokenProvider();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${apiBase}${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined"
      && !["/sign-in", "/sign-up"].includes(window.location.pathname)) {
      window.dispatchEvent(new Event("interviewai:unauthorized"));
    }
    const error = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(error.message ?? `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function toUser(user: ApiUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    targetRole: user.targetRole ?? "Software Engineer",
    experience: fromExperience(user.experience ?? "FRESHER"),
    preferredTopics: user.preferredTopics ?? [],
  };
}

function fromRole(role: string): Interview["role"] {
  if (role === "JAVA_DEVELOPER") return "Java Developer";
  if (role === "FULL_STACK_DEVELOPER") return "Full Stack Developer";
  return "SDE";
}

function toRole(role: InterviewConfig["role"]): string {
  if (role === "Java Developer") return "JAVA_DEVELOPER";
  if (role === "Full Stack Developer") return "FULL_STACK_DEVELOPER";
  return "SDE";
}

function fromExperience(experience: string): User["experience"] {
  if (experience === "ZERO_TO_ONE_YEAR") return "0–1 Year";
  if (experience === "ONE_TO_THREE_YEARS") return "1–3 Years";
  return "Fresher";
}

function toExperience(experience: InterviewConfig["experience"]): string {
  if (experience === "0–1 Year") return "ZERO_TO_ONE_YEAR";
  if (experience === "1–3 Years") return "ONE_TO_THREE_YEARS";
  return "FRESHER";
}

function fromDifficulty(difficulty: string): Interview["difficulty"] {
  if (difficulty === "EASY") return "Easy";
  if (difficulty === "HARD") return "Hard";
  return "Medium";
}

function toDifficulty(difficulty: InterviewConfig["difficulty"]): string {
  return difficulty.toUpperCase();
}

function fromType(type: string): Interview["type"] {
  if (type === "DSA") return "DSA";
  if (type === "MIXED") return "Mixed";
  return "Technical";
}

function fromStatus(status: string): Interview["status"] {
  if (status === "COMPLETED") return "completed";
  if (status === "IN_PROGRESS") return "active";
  return "scheduled";
}

function fromInterview(item: ApiInterview): Interview {
  return {
    id: item.id,
    role: fromRole(item.role),
    difficulty: fromDifficulty(item.difficulty),
    type: fromType(item.type),
    experience: fromExperience(item.experience),
    totalQuestions: item.totalQuestions,
    durationMinutes: item.durationMinutes,
    currentQuestion: item.currentQuestion,
    status: fromStatus(item.status),
    startedAt: item.startedAt,
    completedAt: item.completedAt,
    topic: item.topic,
    questions: item.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      topic: question.topic,
      difficulty: fromDifficulty(question.difficulty),
      type: question.type === "DSA" ? "coding" : "text",
    })),
  };
}

export async function syncClerkUser(name: string, email: string): Promise<void> {
  await request<void>("/users/me/sync", {
    method: "POST",
    body: JSON.stringify({ name, email }),
  });
}

export async function getBackendHealth(): Promise<BackendHealth> {
  return request<BackendHealth>("/health");
}

export async function getDashboard(): Promise<DashboardData> {
  const result = await request<Omit<DashboardData, "user"> & { user: ApiUser }>("/dashboard");
  return {
    ...result,
    user: toUser(result.user),
    recentInterviews: result.recentInterviews.map((interview) => ({
      ...interview,
      role: fromRole(interview.role),
      difficulty: fromDifficulty(interview.difficulty),
    })),
  };
}

export async function getInterviews(): Promise<Interview[]> {
  const result = await request<{ content: ApiInterview[] }>("/interviews?page=0&size=50");
  return result.content.map(fromInterview);
}

export async function getInterview(id: string): Promise<Interview> {
  return fromInterview(await request<ApiInterview>(`/interviews/${id}`));
}

export async function startInterview(id: string): Promise<Interview> {
  return fromInterview(await request<ApiInterview>(`/interviews/${id}/start`, { method: "POST" }));
}

export async function createInterview(data: InterviewConfig): Promise<Interview> {
  const result = await request<ApiInterview>("/interviews", {
    method: "POST",
    body: JSON.stringify({
      role: toRole(data.role),
      experience: toExperience(data.experience),
      difficulty: toDifficulty(data.difficulty),
      interviewType: data.type.toUpperCase(),
      totalQuestions: data.questionCount,
      durationMinutes: data.duration,
    }),
  });
  return fromInterview(result);
}

export async function submitAnswer(
  data: AnswerPayload,
  durationSeconds = 0,
): Promise<{ ok: true; completed: boolean; currentQuestion: number }> {
  return request(`/interviews/${data.interviewId}/answers`, {
    method: "POST",
    body: JSON.stringify({ questionId: data.questionId, answerText: data.answer, durationSeconds }),
  });
}

export async function submitCode(data: CodeSubmission): Promise<{ ok: true; passed: number; total: number; status: string }> {
  return request(`/interviews/${data.interviewId}/code-submit`, {
    method: "POST",
    body: JSON.stringify({ questionId: data.questionId, language: data.language, code: data.code }),
  });
}

export async function getReport(id: string): Promise<InterviewReport> {
  const report = await request<InterviewReport & { role: string }>(`/interviews/${id}/report`);
  return {
    ...report,
    role: fromRole(report.role),
    recommendedTopics: report.recommendedTopics.map((topic) => ({
      ...topic,
      difficulty: fromDifficulty(topic.difficulty),
    })),
  };
}

export async function getAnalytics(): Promise<AnalyticsData> {
  return request<AnalyticsData>("/analytics");
}

export async function getUser(): Promise<User> {
  return toUser(await request<ApiUser>("/users/me"));
}

export async function updateUser(user: User): Promise<User> {
  return toUser(await request<ApiUser>("/users/me", {
    method: "PUT",
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      experience: toExperience(user.experience),
      preferredTopics: user.preferredTopics,
    }),
  }));
}

export async function getHistory(): Promise<InterviewHistoryItem[]> {
  const result = await request<{ content: ApiInterview[] }>("/interviews?page=0&size=50");
  return result.content.map((interview) => ({
    id: interview.id,
    role: fromRole(interview.role),
    score: 0,
    difficulty: fromDifficulty(interview.difficulty),
    date: new Date(interview.completedAt ?? interview.startedAt ?? Date.now()).toLocaleDateString(),
    status: fromStatus(interview.status),
  }));
}