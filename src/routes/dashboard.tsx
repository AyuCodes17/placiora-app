import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AppShell } from "@/components/app/AppShell";

import {
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Placiora" },
      {
        name: "description",
        content:
          "Your placement command center: readiness score, assessments, opportunities and progress.",
      },
      {
        property: "og:title",
        content: "Dashboard — Placiora",
      },
      {
        property: "og:description",
        content: "Your placement command center.",
      },
    ],
  }),

  component: Dashboard,
});

type AssessmentType = "SKILL" | "COMPANY" | "SITUATIONAL";

type AssessmentResult = {
  id: number;
  studentId: number;
  assessmentType: AssessmentType | string;
  score: number;
  totalMarks: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
};

type Student = {
  id: number;
  fullName?: string;
  department?: string;
  semester?: number;
  rollNumber?: string;
  cgpa?: number;
  placementStatus?: string;
  readinessScore?: number;
  resumeCompletion?: number;
};

function Dashboard() {
  const [student, setStudent] = useState<Student | null>(null);

  const [assessmentResults, setAssessmentResults] = useState<
    AssessmentResult[]
  >([]);

  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingAssessments, setLoadingAssessments] = useState(true);

  const [assessmentError, setAssessmentError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const savedStudent = localStorage.getItem("placioraStudent");

      if (!savedStudent) {
        setLoadingStudent(false);
        setLoadingAssessments(false);
        return;
      }

      try {
        const localStudent: Student = JSON.parse(savedStudent);

        setStudent(localStudent);

        const [studentResponse, assessmentResponse] = await Promise.all([
          axios.get(
            `http://localhost:8080/api/students/${localStudent.id}`
          ),

          axios.get(
            `http://localhost:8080/api/assessments/results/${localStudent.id}`
          ),
        ]);

        const latestStudent = studentResponse.data;

        setStudent(latestStudent);

        setAssessmentResults(
          Array.isArray(assessmentResponse.data)
            ? assessmentResponse.data
            : []
        );

        localStorage.setItem(
          "placioraStudent",
          JSON.stringify(latestStudent)
        );
      } catch (error) {
        console.error("Could not load dashboard data:", error);

        setAssessmentError(
          "Could not load assessment intelligence."
        );
      } finally {
        setLoadingStudent(false);
        setLoadingAssessments(false);
      }
    };

    loadDashboard();
  }, []);

  const readinessScore = Number(
    student?.readinessScore ?? 0
  );

  const resumeCompletion = Number(
    student?.resumeCompletion ?? 0
  );

  const latestSkill = useMemo(
    () =>
      assessmentResults.find(
        (result) =>
          result.assessmentType?.toUpperCase() === "SKILL"
      ),
    [assessmentResults]
  );

  const latestCompany = useMemo(
    () =>
      assessmentResults.find(
        (result) =>
          result.assessmentType?.toUpperCase() === "COMPANY"
      ),
    [assessmentResults]
  );

  const latestSituational = useMemo(
    () =>
      assessmentResults.find(
        (result) =>
          result.assessmentType?.toUpperCase() === "SITUATIONAL"
      ),
    [assessmentResults]
  );

  const completedAssessments = [
    latestSkill,
    latestCompany,
    latestSituational,
  ].filter(Boolean).length;

  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-12 gap-4">

        {/* PROFILE */}

        <div className="col-span-12 lg:col-span-4 glass rounded-3xl p-6">
          <div className="flex items-center gap-4">

            {/* FIXED PROFILE INITIALS */}
            <div className="h-14 w-14 shrink-0 rounded-2xl border border-cyan-400/25 bg-cyan-400/15 grid place-items-center text-cyan-300 text-lg font-bold shadow-lg shadow-cyan-950/20">
              {student?.fullName
                ? student.fullName
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "ST"}
            </div>

            <div className="min-w-0">
              <div className="text-lg font-semibold truncate">
                {student?.fullName || "Student"}
              </div>

              <div className="text-xs text-muted-foreground truncate">
                {student?.department || "Department"} · Semester{" "}
                {student?.semester || "-"} ·{" "}
                {student?.rollNumber || "Roll No"}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-3 gap-2 mt-6 text-center">
            {[
              {
                k: "CGPA",
                v: student?.cgpa ?? "N/A",
              },
              {
                k: "Status",
                v:
                  student?.placementStatus ||
                  "Not Placed",
              },
              {
                k: "Semester",
                v: student?.semester ?? "-",
              },
            ].map((item) => (
              <div
                key={item.k}
                className="rounded-xl bg-white/5 py-3"
              >
                <div className="text-lg font-semibold">
                  {item.v}
                </div>

                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {item.k}
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/profile"
            className="btn-ghost mt-6 w-full rounded-xl px-4 py-2.5 text-sm inline-flex items-center justify-center gap-2"
          >
            View full profile
          </Link>
        </div>


        {/* OVERALL READINESS */}

        <div className="col-span-12 lg:col-span-4 glass rounded-3xl p-6 flex flex-col items-center text-center">

          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Placement Readiness
          </div>

          {loadingStudent ? (
            <div
              className="grid place-items-center mt-4"
              style={{
                width: 160,
                height: 160,
              }}
            >
              <div className="text-sm text-muted-foreground">
                Loading score...
              </div>
            </div>
          ) : (
            <ProgressCircle value={readinessScore} />
          )}

          <div className="mt-2 text-sm text-muted-foreground">
            Overall assessment readiness
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 w-full text-xs">
            <Pill
              icon={Target}
              label="Readiness"
              value={`${readinessScore}%`}
            />

            <Pill
              icon={CheckCircle2}
              label="Assessments"
              value={`${completedAssessments}/3`}
            />
          </div>

        </div>


        {/* QUICK ACTIONS */}

        <div className="col-span-12 lg:col-span-4 glass rounded-3xl p-6">

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              Quick actions
            </div>

            <Zap className="h-4 w-4 text-primary" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">

            <Link
              to="/aptitude"
              className="glass hover:border-primary/40 rounded-2xl p-4 text-left transition group"
            >
              <Brain className="h-4 w-4 text-primary" />

              <div className="mt-2 text-sm font-medium">
                Assessments
              </div>

              <div className="text-[11px] text-muted-foreground">
                Test readiness
              </div>
            </Link>

            <Link
              to="/recommendations"
              className="glass hover:border-primary/40 rounded-2xl p-4 text-left transition group"
            >
              <Building2 className="h-4 w-4 text-primary" />

              <div className="mt-2 text-sm font-medium">
                Companies
              </div>

              <div className="text-[11px] text-muted-foreground">
                Find matches
              </div>
            </Link>

            <Link
              to="/profile"
              className="glass hover:border-primary/40 rounded-2xl p-4 text-left transition group"
            >
              <FileText className="h-4 w-4 text-primary" />

              <div className="mt-2 text-sm font-medium">
                Profile
              </div>

              <div className="text-[11px] text-muted-foreground">
                Update details
              </div>
            </Link>

            <Link
              to="/aptitude"
              className="glass hover:border-primary/40 rounded-2xl p-4 text-left transition group"
            >
              <TrendingUp className="h-4 w-4 text-primary" />

              <div className="mt-2 text-sm font-medium">
                Progress
              </div>

              <div className="text-[11px] text-muted-foreground">
                View results
              </div>
            </Link>

          </div>
        </div>


        {/* ASSESSMENT INTELLIGENCE */}

        <div className="col-span-12 glass rounded-3xl p-6">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Brain className="h-4 w-4 text-primary" />
                Assessment Intelligence
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                Your latest performance across Placiora assessments
              </div>
            </div>

            <div className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
              {completedAssessments}/3 completed
            </div>

          </div>

          {loadingAssessments ? (
            <div className="mt-6 rounded-2xl bg-white/5 py-10 text-center text-sm text-muted-foreground">
              Loading assessment intelligence...
            </div>
          ) : assessmentError ? (
            <div className="mt-6 rounded-2xl bg-white/5 py-10 text-center">

              <div className="text-sm font-medium">
                Assessment data unavailable
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                {assessmentError}
              </div>

            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <AssessmentScoreCard
                icon={Brain}
                title="Skill Assessment"
                subtitle="Technical knowledge"
                result={latestSkill}
              />

              <AssessmentScoreCard
                icon={Building2}
                title="Company Assessment"
                subtitle="Placement awareness"
                result={latestCompany}
              />

              <AssessmentScoreCard
                icon={Users}
                title="Situational Assessment"
                subtitle="Workplace judgement"
                result={latestSituational}
              />

            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="text-xs text-muted-foreground">
              Overall readiness uses your latest completed assessment attempts.
            </div>

            <Link
              to="/aptitude"
              className="btn-ghost rounded-xl px-4 py-2 text-xs inline-flex items-center justify-center gap-2"
            >
              <Brain className="h-3.5 w-3.5" />
              Open Assessment Center
            </Link>

          </div>

        </div>


        {/* RECENT ASSESSMENT ACTIVITY */}

        <div className="col-span-12 lg:col-span-7 glass rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <div className="text-sm font-medium">
                Recent Assessment Activity
              </div>

              <div className="text-xs text-muted-foreground">
                Your latest Placiora assessment attempts
              </div>
            </div>

            <TrendingUp className="h-4 w-4 text-primary" />

          </div>

          <div className="mt-5 space-y-3">

            {loadingAssessments ? (
              <div className="rounded-2xl bg-white/5 px-4 py-8 text-center text-sm text-muted-foreground">
                Loading history...
              </div>
            ) : assessmentResults.length === 0 ? (
              <div className="rounded-2xl bg-white/5 px-4 py-8 text-center">

                <Brain className="h-7 w-7 text-primary mx-auto" />

                <div className="mt-3 text-sm font-medium">
                  No assessment attempts yet
                </div>

                <Link
                  to="/aptitude"
                  className="btn-ghost mt-4 inline-flex rounded-xl px-4 py-2 text-xs"
                >
                  Start assessment
                </Link>

              </div>
            ) : (
              assessmentResults
                .slice(0, 4)
                .map((result) => (
                  <RecentResult
                    key={result.id}
                    result={result}
                  />
                ))
            )}

          </div>

        </div>


        {/* PLACEMENT PROGRESS */}

        <div className="col-span-12 lg:col-span-5 glass rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <div className="text-sm font-medium">
                Placement Progress
              </div>

              <div className="text-xs text-muted-foreground">
                Your Placiora preparation status
              </div>
            </div>

            <Target className="h-4 w-4 text-primary" />

          </div>

          <div className="mt-6 space-y-5">

            <ProgressBar
              label="Overall Readiness"
              value={readinessScore}
            />

            <ProgressBar
              label="Assessments Completed"
              value={(completedAssessments / 3) * 100}
              displayValue={`${completedAssessments}/3`}
            />

            <ProgressBar
              label="Resume Completion"
              value={resumeCompletion}
            />

          </div>

          <div className="mt-6 rounded-2xl bg-white/5 p-4">

            <div className="text-xs text-muted-foreground">
              Assessment status
            </div>

            <div className="mt-2 text-sm font-medium">
              {completedAssessments === 3
                ? "All core assessments completed"
                : `${3 - completedAssessments} assessment${
                    3 - completedAssessments === 1
                      ? ""
                      : "s"
                  } remaining`}
            </div>

          </div>

        </div>


        {/* UPCOMING COMPANIES */}

        <div className="col-span-12 lg:col-span-6 glass rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <div className="text-sm font-medium">
                Upcoming Companies
              </div>

              <div className="text-xs text-muted-foreground">
                Placement drives and opportunities
              </div>
            </div>

            <Calendar className="h-4 w-4 text-primary" />

          </div>

          <div className="mt-6 rounded-2xl bg-white/5 px-4 py-8 text-center">

            <Building2 className="h-8 w-8 text-primary mx-auto" />

            <div className="mt-3 text-sm font-medium">
              No upcoming companies yet
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              Placement opportunities will appear here when company data is added.
            </div>

          </div>

        </div>


        {/* COMPANY RECOMMENDATIONS */}

        <div className="col-span-12 lg:col-span-6 glass rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <div className="text-sm font-medium">
                Recommended Companies
              </div>

              <div className="text-xs text-muted-foreground">
                Personalized placement matches
              </div>
            </div>

            <Sparkles className="h-4 w-4 text-primary" />

          </div>

          <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-white/5 p-5">

            <div className="flex items-start gap-4">

              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/10">
                <Rocket className="h-5 w-5 text-cyan-300" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <div className="text-sm font-semibold">
                    Your matches are ready
                  </div>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                    Personalized
                  </span>

                </div>

                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Explore companies matched using your profile, skills,
                  readiness and assessment performance.
                </div>

                <Link
                  to="/recommendations"
                  className="btn-ghost mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs"
                >
                  View Career Recommendations
                  <span aria-hidden="true">→</span>
                </Link>

              </div>

            </div>

          </div>

        </div>


        {/* CAREER INTELLIGENCE */}

        <div className="col-span-12 glass rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <div className="text-sm font-medium">
                Career Intelligence
              </div>

              <div className="text-xs text-muted-foreground">
                Personalized career guidance powered by your Placiora profile and assessment performance
              </div>
            </div>

            <GraduationCap className="h-4 w-4 text-primary" />

          </div>

          <div className="mt-5 rounded-2xl border border-cyan-400/10 bg-white/5 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <div className="text-sm font-medium">
                    {completedAssessments === 3
                      ? "Career intelligence is active"
                      : "Build stronger career intelligence"}
                  </div>

                  {completedAssessments === 3 && (
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                      Ready
                    </span>
                  )}

                </div>

                <div className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
                  {completedAssessments === 3
                    ? "Placiora is using your completed assessments, readiness, profile and skills to generate role fits, company matches, skill gaps and personalized next steps."
                    : `Complete ${
                        3 - completedAssessments
                      } more core assessment${
                        3 - completedAssessments === 1
                          ? ""
                          : "s"
                      } to strengthen your role fits, company matches and personalized recommendations.`}
                </div>

              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:items-end">

                <div className="rounded-xl bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
                  {readinessScore}% Ready
                </div>

                <Link
                  to="/recommendations"
                  className="text-xs font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                >
                  Explore career intelligence →
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}


/* ========================================================= */
/* ASSESSMENT SCORE CARD                                     */
/* ========================================================= */

function AssessmentScoreCard({
  icon: Icon,
  title,
  subtitle,
  result,
}: {
  icon: any;
  title: string;
  subtitle: string;
  result?: AssessmentResult;
}) {
  const percentage =
    result == null
      ? 0
      : Math.round(Number(result.percentage || 0));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

      <div className="flex items-start justify-between gap-3">

        <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        {result ? (
          <div className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
            Completed
          </div>
        ) : (
          <div className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-muted-foreground">
            Pending
          </div>
        )}

      </div>

      <div className="mt-4">

        <div className="text-sm font-semibold">
          {title}
        </div>

        <div className="text-xs text-muted-foreground">
          {subtitle}
        </div>

      </div>

      {result ? (
        <>
          <div className="mt-5 flex items-end justify-between">

            <div>

              <div className="text-3xl font-semibold">
                {percentage}%
              </div>

              <div className="mt-1 text-[11px] text-muted-foreground">
                {result.score}/{result.totalMarks} marks
              </div>

            </div>

            <div className="text-right">

              <div className="text-sm font-medium">
                {result.correctAnswers}/{result.totalQuestions}
              </div>

              <div className="text-[10px] text-muted-foreground">
                Correct
              </div>

            </div>

          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(100, percentage)
                )}%`,
              }}
            />

          </div>
        </>
      ) : (
        <div className="mt-5">

          <div className="text-2xl font-semibold text-muted-foreground">
            —
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            Assessment not completed
          </div>

        </div>
      )}

    </div>
  );
}


/* ========================================================= */
/* RECENT RESULT                                             */
/* ========================================================= */

function RecentResult({
  result,
}: {
  result: AssessmentResult;
}) {
  const type =
    result.assessmentType?.toUpperCase();

  const label =
    type === "SKILL"
      ? "Skill Assessment"
      : type === "COMPANY"
      ? "Company Assessment"
      : type === "SITUATIONAL"
      ? "Situational Assessment"
      : result.assessmentType;

  const Icon =
    type === "SKILL"
      ? Brain
      : type === "COMPANY"
      ? Building2
      : Users;

  const date =
    result.completedAt
      ? new Date(result.completedAt).toLocaleDateString(
          undefined,
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "Recently";

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/5 px-4 py-3">

      <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 grid place-items-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>

      <div className="min-w-0 flex-1">

        <div className="text-sm font-medium truncate">
          {label}
        </div>

        <div className="text-[11px] text-muted-foreground">
          {result.score}/{result.totalMarks} marks · {date}
        </div>

      </div>

      <div className="text-right">

        <div className="text-sm font-semibold">
          {Math.round(
            Number(result.percentage || 0)
          )}
          %
        </div>

        <div className="text-[10px] text-muted-foreground">
          Score
        </div>

      </div>

    </div>
  );
}


/* ========================================================= */
/* PROGRESS BAR                                              */
/* ========================================================= */

function ProgressBar({
  label,
  value,
  displayValue,
}: {
  label: string;
  value: number;
  displayValue?: string;
}) {
  const safeValue = Math.max(
    0,
    Math.min(
      100,
      Number(value) || 0
    )
  );

  return (
    <div>

      <div className="mb-2 flex items-center justify-between text-xs">

        <span className="text-muted-foreground">
          {label}
        </span>

        <span className="font-medium">
          {displayValue ||
            `${Math.round(safeValue)}%`}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">

        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${safeValue}%`,
          }}
        />

      </div>

    </div>
  );
}


/* ========================================================= */
/* SMALL STAT PILL                                           */
/* ========================================================= */

function Pill({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-xl px-2 py-2 flex flex-col items-center">

      <Icon className="h-3.5 w-3.5 text-primary" />

      <div className="mt-1 font-semibold">
        {value}
      </div>

      <div className="text-[10px] text-muted-foreground">
        {label}
      </div>

    </div>
  );
}


/* ========================================================= */
/* READINESS CIRCLE                                          */
/* ========================================================= */

function ProgressCircle({
  value,
}: {
  value: number;
}) {
  const safeValue = Math.max(
    0,
    Math.min(
      100,
      Number(value) || 0
    )
  );

  const size = 160;
  const radius = 68;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (safeValue / 100) *
      circumference;

  return (
    <div
      className="relative mt-4"
      style={{
        width: size,
        height: size,
      }}
    >

      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >

        <defs>

          <linearGradient
            id="dashboard-readiness-gradient"
            x1="0"
            x2="1"
          >

            <stop
              offset="0%"
              stopColor="oklch(0.82 0.14 210)"
            />

            <stop
              offset="100%"
              stopColor="oklch(0.72 0.16 235)"
            />

          </linearGradient>

        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="oklch(1 0 0 / 0.08)"
          strokeWidth="12"
          fill="none"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#dashboard-readiness-gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={
            circumference
          }
          strokeDashoffset={
            offset
          }
        />

      </svg>

      <div className="absolute inset-0 grid place-items-center">

        <div className="text-center">

          <div className="text-4xl font-semibold">
            {Math.round(safeValue)}%
          </div>

          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Ready
          </div>

        </div>

      </div>

    </div>
  );
}