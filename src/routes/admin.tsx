import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { AppShell } from "@/components/app/AppShell";

import {
  Users,
  Brain,
  Target,
  FileText,
  Search,
  RefreshCw,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      {
        title: "Admin Dashboard — Placiora",
      },
      {
        name: "description",
        content:
          "Placiora administration dashboard for student readiness and assessment monitoring.",
      },
      {
        property: "og:title",
        content: "Admin Dashboard — Placiora",
      },
    ],
  }),

  component: Admin,
});

const API = "http://localhost:8080";

type Student = {
  id: number;
  fullName?: string;
  email?: string;
  department?: string;
  semester?: number;
  rollNumber?: string;
  cgpa?: number;
  placementStatus?: string;
  readinessScore?: number;
  resumeCompletion?: number;
};

type AssessmentResult = {
  id: number;
  studentId: number;
  assessmentType: string;
  score: number;
  totalMarks: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
};

function Admin() {
  const [student, setStudent] =
    useState<Student | null>(null);

  const [
    assessmentResults,
    setAssessmentResults,
  ] = useState<AssessmentResult[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadAdminData() {
    setLoading(true);
    setError("");

    const savedStudent =
      localStorage.getItem(
        "placioraStudent"
      );

    if (!savedStudent) {
      setStudent(null);

      setError(
        "No signed-in Placiora student was found."
      );

      setLoading(false);

      return;
    }

    try {
      const localStudent: Student =
        JSON.parse(savedStudent);

      const [
        studentResponse,
        assessmentResponse,
      ] = await Promise.all([
        axios.get(
          `${API}/api/students/${localStudent.id}`
        ),

        axios.get(
          `${API}/api/assessments/results/${localStudent.id}`
        ),
      ]);

      const latestStudent =
        studentResponse.data;

      setStudent(latestStudent);

      setAssessmentResults(
        Array.isArray(
          assessmentResponse.data
        )
          ? assessmentResponse.data
          : []
      );

      localStorage.setItem(
        "placioraStudent",
        JSON.stringify(latestStudent)
      );
    } catch (err) {
      console.error(
        "Admin dashboard load failed:",
        err
      );

      setError(
        "Could not load live Placiora data. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  const latestSkill =
    useMemo(
      () =>
        assessmentResults.find(
          (result) =>
            result.assessmentType
              ?.toUpperCase() ===
            "SKILL"
        ),
      [assessmentResults]
    );

  const latestCompany =
    useMemo(
      () =>
        assessmentResults.find(
          (result) =>
            result.assessmentType
              ?.toUpperCase() ===
            "COMPANY"
        ),
      [assessmentResults]
    );

  const latestSituational =
    useMemo(
      () =>
        assessmentResults.find(
          (result) =>
            result.assessmentType
              ?.toUpperCase() ===
            "SITUATIONAL"
        ),
      [assessmentResults]
    );

  const completedAssessments = [
    latestSkill,
    latestCompany,
    latestSituational,
  ].filter(Boolean).length;

  const readinessScore = Number(
    student?.readinessScore ?? 0
  );

  const resumeCompletion = Number(
    student?.resumeCompletion ?? 0
  );

  /*
   * For now Placiora's existing backend provides
   * the currently signed-in student's complete data.
   *
   * This structure can later become an array returned
   * by a dedicated admin /api/students endpoint.
   */

  const students = student
    ? [student]
    : [];

  const filteredStudents =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query)
        return students;

      return students.filter(
        (item) =>
          item.fullName
            ?.toLowerCase()
            .includes(query) ||
          item.email
            ?.toLowerCase()
            .includes(query) ||
          item.department
            ?.toLowerCase()
            .includes(query) ||
          item.rollNumber
            ?.toLowerCase()
            .includes(query) ||
          item.placementStatus
            ?.toLowerCase()
            .includes(query)
      );
    }, [students, search]);

  return (
    <AppShell title="Admin Dashboard">

      <div className="space-y-6">

        {/* =============================================== */}
        {/* ADMIN HEADER                                    */}
        {/* =============================================== */}

        <div className="glass rounded-3xl border border-cyan-400/10 p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <ShieldCheck className="h-5 w-5 text-cyan-300" />

                <h2 className="text-lg font-semibold">

                  Placiora Administration

                </h2>

              </div>

              <p className="mt-1 text-sm text-muted-foreground">

                Monitor real student readiness,
                assessments and profile progress.

              </p>

            </div>

            <button
              onClick={
                loadAdminData
              }
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-white/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh Data

            </button>

          </div>

        </div>


        {/* =============================================== */}
        {/* ERROR                                           */}
        {/* =============================================== */}

        {error && (

          <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/5 p-4">

            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

            <div>

              <div className="text-sm font-medium text-red-300">

                Admin data unavailable

              </div>

              <div className="mt-1 text-xs text-muted-foreground">

                {error}

              </div>

            </div>

          </div>

        )}


        {/* =============================================== */}
        {/* REAL ADMIN STATS                                */}
        {/* =============================================== */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <AdminStat
            icon={Users}
            label="Students Loaded"
            value={
              student ? "1" : "0"
            }
            helper="Current Placiora session"
          />

          <AdminStat
            icon={Target}
            label="Readiness"
            value={`${Math.round(
              readinessScore
            )}%`}
            helper="Current readiness score"
          />

          <AdminStat
            icon={Brain}
            label="Assessments"
            value={`${completedAssessments}/3`}
            helper="Core assessments completed"
          />

          <AdminStat
            icon={FileText}
            label="Resume"
            value={`${Math.round(
              resumeCompletion
            )}%`}
            helper="Resume completion"
          />

        </div>


        {/* =============================================== */}
        {/* MAIN ADMIN GRID                                 */}
        {/* =============================================== */}

        <div className="grid gap-4 xl:grid-cols-3">

          {/* ============================================= */}
          {/* STUDENT TABLE                                 */}
          {/* ============================================= */}

          <div className="glass rounded-3xl p-6 xl:col-span-2">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="text-sm font-medium">

                  Students

                </div>

                <div className="mt-1 text-xs text-muted-foreground">

                  Search and monitor Placiora student readiness

                </div>

              </div>

              {/* WORKING SEARCH */}

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">

                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search student..."
                  className="w-44 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />

              </div>

            </div>


            {/* TABLE */}

            <div className="mt-5 overflow-x-auto">

              <table className="w-full min-w-[720px] text-sm">

                <thead>

                  <tr className="border-b border-white/10 text-left text-xs text-muted-foreground">

                    <th className="pb-3 font-medium">
                      Student
                    </th>

                    <th className="pb-3 font-medium">
                      Branch
                    </th>

                    <th className="pb-3 font-medium">
                      Semester
                    </th>

                    <th className="pb-3 font-medium">
                      CGPA
                    </th>

                    <th className="pb-3 font-medium">
                      Readiness
                    </th>

                    <th className="pb-3 font-medium">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >

                        Loading Placiora student data...

                      </td>

                    </tr>

                  ) : filteredStudents.length ===
                    0 ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="py-12 text-center"
                      >

                        <Users className="mx-auto h-7 w-7 text-muted-foreground" />

                        <div className="mt-3 text-sm font-medium">

                          No students found

                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">

                          Try another search term.

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredStudents.map(
                      (item) => (

                        <tr
                          key={item.id}
                          className="border-b border-white/5 last:border-none"
                        >

                          <td className="py-4">

                            <div className="flex items-center gap-3">

                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-xs font-semibold text-cyan-300">

                                {getInitials(
                                  item.fullName
                                )}

                              </div>

                              <div>

                                <div className="font-medium text-foreground">

                                  {item.fullName ||
                                    "Student"}

                                </div>

                                <div className="text-[11px] text-muted-foreground">

                                  {item.email ||
                                    item.rollNumber ||
                                    "No identifier"}

                                </div>

                              </div>

                            </div>

                          </td>

                          <td className="py-4 text-muted-foreground">

                            {item.department ||
                              "—"}

                          </td>

                          <td className="py-4 text-muted-foreground">

                            {item.semester ||
                              "—"}

                          </td>

                          <td className="py-4">

                            {item.cgpa ??
                              "—"}

                          </td>

                          <td className="py-4">

                            <div className="flex items-center gap-3">

                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">

                                <div
                                  className="h-full rounded-full bg-[var(--gradient-cyan)]"
                                  style={{
                                    width: `${Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        Number(
                                          item.readinessScore ||
                                            0
                                        )
                                      )
                                    )}%`,
                                  }}
                                />

                              </div>

                              <span className="text-xs font-medium">

                                {Math.round(
                                  Number(
                                    item.readinessScore ||
                                      0
                                  )
                                )}
                                %

                              </span>

                            </div>

                          </td>

                          <td className="py-4">

                            <StatusBadge
                              status={
                                item.placementStatus ||
                                "Not Placed"
                              }
                            />

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

            <div className="mt-4 border-t border-white/5 pt-4 text-[11px] text-muted-foreground">

              Showing{" "}
              {filteredStudents.length}{" "}
              student
              {filteredStudents.length ===
              1
                ? ""
                : "s"}{" "}
              from the currently available Placiora dataset.

            </div>

          </div>


          {/* ============================================= */}
          {/* ASSESSMENT COVERAGE                           */}
          {/* ============================================= */}

          <div className="glass rounded-3xl p-6">

            <div className="flex items-center gap-2">

              <Brain className="h-4 w-4 text-cyan-300" />

              <div className="text-sm font-medium">

                Assessment Coverage

              </div>

            </div>

            <div className="mt-1 text-xs text-muted-foreground">

              Latest scores from each core Placiora assessment

            </div>

            <div className="mt-6 space-y-6">

              <AssessmentProgress
                label="Skill Assessment"
                value={
                  latestSkill
                    ? Number(
                        latestSkill.percentage
                      )
                    : 0
                }
                completed={
                  !!latestSkill
                }
              />

              <AssessmentProgress
                label="Company Assessment"
                value={
                  latestCompany
                    ? Number(
                        latestCompany.percentage
                      )
                    : 0
                }
                completed={
                  !!latestCompany
                }
              />

              <AssessmentProgress
                label="Situational Assessment"
                value={
                  latestSituational
                    ? Number(
                        latestSituational.percentage
                      )
                    : 0
                }
                completed={
                  !!latestSituational
                }
              />

            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">

              <div className="text-xs text-muted-foreground">

                Completion

              </div>

              <div className="mt-1 text-lg font-semibold">

                {completedAssessments}/3

              </div>

              <div className="mt-1 text-xs text-muted-foreground">

                {completedAssessments ===
                3
                  ? "All core assessments completed."
                  : `${
                      3 -
                      completedAssessments
                    } assessment${
                      3 -
                        completedAssessments ===
                      1
                        ? ""
                        : "s"
                    } remaining.`}

              </div>

            </div>

          </div>

        </div>


        {/* =============================================== */}
        {/* STUDENT INTELLIGENCE                            */}
        {/* =============================================== */}

        <div className="grid gap-4 lg:grid-cols-2">

          <div className="glass rounded-3xl p-6">

            <div className="flex items-center gap-2">

              <GraduationCap className="h-4 w-4 text-cyan-300" />

              <div className="text-sm font-medium">

                Student Intelligence

              </div>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">

              <InfoBox
                label="Department"
                value={
                  student?.department ||
                  "Not added"
                }
              />

              <InfoBox
                label="Semester"
                value={
                  student?.semester
                    ? `Semester ${student.semester}`
                    : "Not added"
                }
              />

              <InfoBox
                label="CGPA"
                value={
                  student?.cgpa ??
                  "Not added"
                }
              />

              <InfoBox
                label="Placement Status"
                value={
                  student?.placementStatus ||
                  "Not Placed"
                }
              />

            </div>

          </div>


          {/* ============================================= */}
          {/* ADMIN DATA STATUS                              */}
          {/* ============================================= */}

          <div className="glass rounded-3xl p-6">

            <div className="flex items-center gap-2">

              <ShieldCheck className="h-4 w-4 text-cyan-300" />

              <div className="text-sm font-medium">

                Admin Data Status

              </div>

            </div>

            <div className="mt-4 space-y-3">

              <DataStatus
                label="Student Profile"
                ready={!!student}
              />

              <DataStatus
                label="Assessment Results"
                ready={
                  assessmentResults.length >
                  0
                }
              />

              <DataStatus
                label="Readiness Intelligence"
                ready={
                  student?.readinessScore !=
                  null
                }
              />

            </div>

            <div className="mt-5 rounded-2xl bg-white/5 p-4 text-xs leading-6 text-muted-foreground">

              This Admin V2 uses real
              Placiora student and
              assessment data. A future
              administrator API can expand
              this view to every registered
              student without redesigning
              the interface.

            </div>

          </div>

        </div>

      </div>

    </AppShell>
  );
}


/* ========================================================= */
/* ADMIN STAT                                                */
/* ========================================================= */

function AdminStat({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: any;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="glass rounded-3xl p-5">

      <div className="flex items-center justify-between">

        <span className="text-xs text-muted-foreground">

          {label}

        </span>

        <div className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-400/10">

          <Icon className="h-4 w-4 text-cyan-300" />

        </div>

      </div>

      <div className="mt-3 text-2xl font-semibold sm:text-3xl">

        {value}

      </div>

      <div className="mt-1 text-[11px] text-muted-foreground">

        {helper}

      </div>

    </div>
  );
}


/* ========================================================= */
/* ASSESSMENT PROGRESS                                       */
/* ========================================================= */

function AssessmentProgress({
  label,
  value,
  completed,
}: {
  label: string;
  value: number;
  completed: boolean;
}) {
  const safeValue =
    Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0
      )
    );

  return (
    <div>

      <div className="flex items-center justify-between text-xs">

        <span className="text-muted-foreground">

          {label}

        </span>

        <span className="font-medium">

          {completed
            ? `${Math.round(
                safeValue
              )}%`
            : "Pending"}

        </span>

      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">

        <div
          className="h-full rounded-full bg-[var(--gradient-cyan)] transition-all"
          style={{
            width: `${safeValue}%`,
          }}
        />

      </div>

    </div>
  );
}


/* ========================================================= */
/* STATUS BADGE                                              */
/* ========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toLowerCase();

  let classes =
    "bg-white/10 text-muted-foreground";

  if (
    normalized.includes("placed")
  ) {
    classes =
      "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20";
  }

  if (
    normalized.includes(
      "interview"
    )
  ) {
    classes =
      "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20";
  }

  if (
    normalized.includes(
      "shortlist"
    )
  ) {
    classes =
      "bg-violet-400/10 text-violet-300 border border-violet-400/20";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${classes}`}
    >

      {status}

    </span>
  );
}


/* ========================================================= */
/* INFORMATION BOX                                           */
/* ========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">

      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">

        {label}

      </div>

      <div className="mt-1 truncate text-sm font-medium">

        {value}

      </div>

    </div>
  );
}


/* ========================================================= */
/* DATA STATUS                                               */
/* ========================================================= */

function DataStatus({
  label,
  ready,
}: {
  label: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">

      <span className="text-sm text-muted-foreground">

        {label}

      </span>

      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
          ready
            ? "bg-emerald-400/10 text-emerald-300"
            : "bg-white/10 text-muted-foreground"
        }`}
      >

        {ready
          ? "Available"
          : "Pending"}

      </span>

    </div>
  );
}


/* ========================================================= */
/* INITIALS                                                  */
/* ========================================================= */

function getInitials(
  name?: string
) {
  if (!name) return "ST";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}