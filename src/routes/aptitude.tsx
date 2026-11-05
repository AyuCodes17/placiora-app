import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Code2,
  Lightbulb,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

export const Route = createFileRoute("/aptitude")({
  head: () => ({
    meta: [
      { title: "Assessment Center — Placiora" },
      {
        name: "description",
        content:
          "Placiora assessment center for skill, company readiness and situational assessments.",
      },
    ],
  }),
  component: AssessmentCenter,
});

const API = "http://localhost:8080";

type AssessmentType = "SKILL" | "COMPANY" | "SITUATIONAL";

type AssessmentQuestion = {
  id: number;
  assessmentType: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  category: string;
  difficulty: string;
  marks: number;
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

type Answers = Record<number, string>;

type Screen = "HOME" | "TEST" | "RESULT";

function AssessmentCenter() {
  const [screen, setScreen] = useState<Screen>("HOME");
  const [student, setStudent] = useState<any>(null);

  const [assessmentType, setAssessmentType] =
    useState<AssessmentType | null>(null);

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loadingType, setLoadingType] =
    useState<AssessmentType | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] =
    useState<AssessmentResult | null>(null);

  const [previousResults, setPreviousResults] =
    useState<AssessmentResult[]>([]);

  const [error, setError] = useState("");

  useEffect(() => {
    const savedStudent =
      localStorage.getItem("placioraStudent");

    if (!savedStudent) {
      setError(
        "Student session not found. Please log in again."
      );
      return;
    }

    try {
      const parsedStudent = JSON.parse(savedStudent);

      setStudent(parsedStudent);

      if (parsedStudent.id) {
        loadResults(parsedStudent.id);
      }
    } catch {
      setError("Could not read student session.");
    }
  }, []);

  async function loadResults(studentId: number) {
    try {
      const response = await axios.get(
        `${API}/api/assessments/results/${studentId}`
      );

      setPreviousResults(response.data);
    } catch (error) {
      console.error(
        "Could not load assessment results:",
        error
      );
    }
  }

  async function startAssessment(
    type: AssessmentType
  ) {
    setLoadingType(type);
    setError("");

    try {
      const response = await axios.get(
        `${API}/api/assessments/questions/${type}`
      );

      if (
        !response.data ||
        response.data.length === 0
      ) {
        setError(
          `No ${type.toLowerCase()} questions are available.`
        );
        return;
      }

      setAssessmentType(type);
      setQuestions(response.data);
      setAnswers({});
      setCurrentQuestion(0);
      setResult(null);
      setScreen("TEST");
    } catch (error) {
      console.error(error);

      setError(
        "Could not load assessment questions. Make sure the backend is running."
      );
    } finally {
      setLoadingType(null);
    }
  }

  function selectAnswer(
    questionId: number,
    answer: string
  ) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  }

  function goNext() {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  }

  function goPrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  }

  async function submitAssessment() {
    if (!student?.id || !assessmentType) {
      return;
    }

    const unanswered = questions.filter(
      (question) => !answers[question.id]
    );

    if (unanswered.length > 0) {
      const shouldSubmit = window.confirm(
        `You still have ${unanswered.length} unanswered question${
          unanswered.length > 1 ? "s" : ""
        }. Submit anyway?`
      );

      if (!shouldSubmit) {
        return;
      }
    }

    setSubmitting(true);
    setError("");

    try {
      const submissionAnswers = questions.map(
        (question) => ({
          questionId: question.id,
          answer:
            answers[question.id] || "",
        })
      );

      const response = await axios.post(
        `${API}/api/assessments/submit`,
        {
          studentId: student.id,
          assessmentType,
          answers: submissionAnswers,
        }
      );

      setResult(response.data);
      setScreen("RESULT");

      await loadResults(student.id);

      /*
       * Refresh latest student information because
       * the backend may update readinessScore.
       */
      try {
        const studentResponse =
          await axios.get(
            `${API}/api/students/${student.id}`
          );

        setStudent(studentResponse.data);

        localStorage.setItem(
          "placioraStudent",
          JSON.stringify(studentResponse.data)
        );
      } catch (studentError) {
        console.error(
          "Could not refresh student:",
          studentError
        );
      }
    } catch (error) {
      console.error(error);

      setError(
        "Assessment submission failed. Please check the backend and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function backToCenter() {
    setScreen("HOME");
    setAssessmentType(null);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setError("");
  }

  if (
    screen === "TEST" &&
    questions.length > 0
  ) {
    return (
      <TestScreen
        assessmentType={assessmentType!}
        questions={questions}
        answers={answers}
        currentQuestion={currentQuestion}
        setCurrentQuestion={
          setCurrentQuestion
        }
        selectAnswer={selectAnswer}
        goNext={goNext}
        goPrevious={goPrevious}
        submitAssessment={
          submitAssessment
        }
        submitting={submitting}
        error={error}
        backToCenter={backToCenter}
      />
    );
  }

  if (screen === "RESULT" && result) {
    return (
      <ResultScreen
        result={result}
        retake={() =>
          startAssessment(
            result.assessmentType.toUpperCase() as AssessmentType
          )
        }
        backToCenter={backToCenter}
      />
    );
  }

  return (
    <AppShell title="Assessment Center">
      <div className="mx-auto max-w-7xl space-y-7 text-slate-100">
        {/* HERO */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 p-7 shadow-2xl md:p-9">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              PLACIORA INTELLIGENCE
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Know where you stand.
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Know what to improve.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Complete all three Placiora
              assessments to measure technical
              knowledge, company readiness and
              professional decision-making.
            </p>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* ASSESSMENTS */}

        <div>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Assessment Journey
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Three layers of placement intelligence
            </h2>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <AssessmentCard
              number="01"
              icon={
                <Code2 className="h-6 w-6" />
              }
              title="Skill Assessment"
              description="Test your core technical knowledge across programming, databases, backend concepts and developer tools."
              tags={[
                "10 Questions",
                "MCQ",
                "Technical",
              ]}
              buttonText="Start Skill Assessment"
              onClick={() =>
                startAssessment("SKILL")
              }
              loading={
                loadingType === "SKILL"
              }
            />

            <AssessmentCard
              number="02"
              icon={
                <BriefcaseBusiness className="h-6 w-6" />
              }
              title="Company Readiness"
              description="Measure how well you understand job requirements, portfolios, skill gaps and preparation for developer roles."
              tags={[
                "10 Questions",
                "MCQ",
                "Career",
              ]}
              buttonText="Start Company Readiness"
              onClick={() =>
                startAssessment("COMPANY")
              }
              loading={
                loadingType === "COMPANY"
              }
            />

            <AssessmentCard
              number="03"
              icon={
                <Lightbulb className="h-6 w-6" />
              }
              title="Situational Assessment"
              description="Face realistic workplace situations where several responses may seem reasonable. Choose the most effective professional response."
              tags={[
                "10 Scenarios",
                "MCQ",
                "15 Marks",
                "Adaptive Difficulty",
              ]}
              buttonText="Start Situational Assessment"
              onClick={() =>
                startAssessment(
                  "SITUATIONAL"
                )
              }
              loading={
                loadingType ===
                "SITUATIONAL"
              }
            />
          </div>
        </div>

        {/* FEATURES */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-7">
          <div className="grid gap-6 md:grid-cols-3">
            <MiniFeature
              icon={<Target />}
              title="Measure readiness"
              text="Results help Placiora build a clearer picture of your current placement preparation."
            />

            <MiniFeature
              icon={<Brain />}
              title="Identify gaps"
              text="Discover technical, career and professional judgment areas that need improvement."
            />

            <MiniFeature
              icon={<ShieldCheck />}
              title="Private scoring"
              text="Correct answers stay on the backend and are never exposed to the browser."
            />
          </div>
        </section>

        {/* HISTORY */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Your Progress
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Recent Assessments
              </h2>
            </div>

            <Trophy className="h-6 w-6 text-cyan-400" />
          </div>

          {previousResults.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 py-10 text-center">
              <Brain className="mx-auto h-8 w-8 text-slate-500" />

              <p className="mt-3 font-medium text-slate-300">
                No assessments completed yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Complete your first assessment
                and your results will appear
                here.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {previousResults
                .slice(0, 6)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
                        {getAssessmentIcon(
                          item.assessmentType
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          {formatAssessmentName(
                            item.assessmentType
                          )}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {formatDate(
                            item.completedAt
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-500">
                          Correct
                        </p>

                        <p className="font-semibold text-slate-200">
                          {
                            item.correctAnswers
                          }
                          /
                          {
                            item.totalQuestions
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Marks
                        </p>

                        <p className="font-semibold text-slate-200">
                          {item.score}/
                          {item.totalMarks}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Score
                        </p>

                        <p className="text-lg font-bold text-cyan-300">
                          {Math.round(
                            item.percentage
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

/* =========================================================
   TEST SCREEN
   ========================================================= */

function TestScreen({
  assessmentType,
  questions,
  answers,
  currentQuestion,
  setCurrentQuestion,
  selectAnswer,
  goNext,
  goPrevious,
  submitAssessment,
  submitting,
  error,
  backToCenter,
}: {
  assessmentType: AssessmentType;
  questions: AssessmentQuestion[];
  answers: Answers;
  currentQuestion: number;
  setCurrentQuestion: (
    index: number
  ) => void;
  selectAnswer: (
    questionId: number,
    answer: string
  ) => void;
  goNext: () => void;
  goPrevious: () => void;
  submitAssessment: () => void;
  submitting: boolean;
  error: string;
  backToCenter: () => void;
}) {
  const question =
    questions[currentQuestion];

  const attempted = questions.filter(
    (item) => answers[item.id]
  ).length;

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  const selectedAnswer =
    answers[question.id];

  const options = [
    {
      letter: "A",
      text: question.optionA,
    },
    {
      letter: "B",
      text: question.optionB,
    },
    {
      letter: "C",
      text: question.optionC,
    },
    {
      letter: "D",
      text: question.optionD,
    },
  ];

  const totalPossibleMarks =
    questions.reduce(
      (total, item) =>
        total + Number(item.marks || 1),
      0
    );

  const isSituational =
    assessmentType === "SITUATIONAL";

  return (
    <AppShell title="Assessment">
      <div className="mx-auto max-w-7xl text-slate-100">
        <button
          onClick={backToCenter}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Assessment Center
        </button>

        <div className="grid gap-5 xl:grid-cols-[1fr_310px]">
          <main className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
            <div className="border-b border-white/10 p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">
                    {formatAssessmentName(
                      assessmentType
                    )}
                  </span>

                  <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                    {question.category}
                  </span>

                  <DifficultyBadge
                    difficulty={
                      question.difficulty
                    }
                  />

                  <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400">
                    {question.marks}{" "}
                    {question.marks === 1
                      ? "mark"
                      : "marks"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock3 className="h-4 w-4 text-cyan-400" />
                  {isSituational
                    ? "Choose the best response"
                    : "Take your time"}
                </div>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 md:p-8">
              <p className="text-sm font-medium text-cyan-400">
                Question{" "}
                {currentQuestion + 1} of{" "}
                {questions.length}
              </p>

              {isSituational && (
                <div className="mt-4 rounded-xl border border-blue-400/15 bg-blue-400/[0.05] px-4 py-3 text-xs leading-5 text-slate-400">
                  Several options may appear
                  reasonable. Select the response
                  that demonstrates the strongest
                  professional judgment for the
                  situation.
                </div>
              )}

              <h2
                className={`max-w-4xl font-semibold text-white ${
                  isSituational
                    ? "mt-5 text-lg leading-8 md:text-xl"
                    : "mt-3 text-xl leading-relaxed md:text-2xl"
                }`}
              >
                {question.questionText}
              </h2>

              <div
                className={`mt-8 grid gap-3 ${
                  isSituational
                    ? "grid-cols-1"
                    : "md:grid-cols-2"
                }`}
              >
                {options.map((option) => {
                  const active =
                    selectedAnswer ===
                    option.letter;

                  return (
                    <button
                      key={option.letter}
                      onClick={() =>
                        selectAnswer(
                          question.id,
                          option.letter
                        )
                      }
                      className={`group flex items-start gap-4 rounded-2xl border p-4 text-left transition md:p-5 ${
                        active
                          ? "border-cyan-400/70 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.08)]"
                          : "border-white/10 bg-black/10 hover:border-cyan-400/30 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold transition ${
                          active
                            ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950"
                            : "bg-white/[0.06] text-slate-400 group-hover:text-white"
                        }`}
                      >
                        {active ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          option.letter
                        )}
                      </span>

                      <span
                        className={`pt-0.5 text-sm leading-6 ${
                          active
                            ? "font-medium text-white"
                            : "text-slate-300"
                        }`}
                      >
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
                <button
                  onClick={goPrevious}
                  disabled={
                    currentQuestion === 0
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                {currentQuestion <
                questions.length - 1 ? (
                  <button
                    onClick={goNext}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:opacity-90"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={
                      submitAssessment
                    }
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Submit Assessment
                      </>
                    )}
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>
          </main>

          {/* NAVIGATOR */}

          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="font-semibold text-white">
              Question Navigator
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Jump between questions anytime.
            </p>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {questions.map(
                (item, index) => {
                  const active =
                    index ===
                    currentQuestion;

                  const answered = Boolean(
                    answers[item.id]
                  );

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        setCurrentQuestion(
                          index
                        )
                      }
                      className={`aspect-square rounded-xl text-xs font-semibold transition ${
                        active
                          ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950"
                          : answered
                            ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                            : "border border-white/10 bg-white/[0.03] text-slate-500 hover:text-white"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                }
              )}
            </div>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
              <OverviewRow
                label="Answered"
                value={`${attempted}/${questions.length}`}
              />

              <OverviewRow
                label="Remaining"
                value={String(
                  questions.length -
                    attempted
                )}
              />

              <OverviewRow
                label="Total Marks"
                value={String(
                  totalPossibleMarks
                )}
              />

              <OverviewRow
                label="Progress"
                value={`${Math.round(
                  (attempted /
                    questions.length) *
                    100
                )}%`}
              />
            </div>

            <button
              onClick={submitAssessment}
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400/10 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              {submitting
                ? "Submitting..."
                : "Submit Assessment"}
            </button>

            <p className="mt-3 text-center text-[11px] leading-5 text-slate-600">
              Unanswered questions receive no
              marks.
            </p>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

/* =========================================================
   RESULT
   ========================================================= */

function ResultScreen({
  result,
  retake,
  backToCenter,
}: {
  result: AssessmentResult;
  retake: () => void;
  backToCenter: () => void;
}) {
  const percentage = Math.round(
    result.percentage
  );

  const situational =
    result.assessmentType.toUpperCase() ===
    "SITUATIONAL";

  let message =
    "Keep building your fundamentals.";
  let level = "Building";

  if (percentage >= 80) {
    message = situational
      ? "Strong professional judgment across challenging workplace situations."
      : "Strong performance. Keep pushing into harder concepts.";

    level = "Strong";
  } else if (percentage >= 60) {
    message = situational
      ? "Good judgment foundation. Some complex situations still need sharper prioritization."
      : "Good foundation. Focused practice can raise your readiness.";

    level = "Developing";
  } else if (percentage >= 40) {
    message = situational
      ? "Your judgment is developing. Focus on communication, accountability and structured decision-making."
      : "You have a starting foundation. Focus on the concepts you missed.";

    level = "Growing";
  } else {
    message = situational
      ? "Focus on evaluating consequences, communicating clearly and balancing competing priorities."
      : "Keep building your fundamentals.";
  }

  return (
    <AppShell title="Assessment Result">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] text-slate-100">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 p-8 text-center md:p-12">
            <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <Trophy className="h-8 w-8" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Assessment Complete
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                {formatAssessmentName(
                  result.assessmentType
                )}
              </h1>

              <div className="mt-7 text-6xl font-black tracking-tight text-white md:text-7xl">
                {percentage}
                <span className="text-3xl text-cyan-300">
                  %
                </span>
              </div>

              <p className="mt-3 font-semibold text-cyan-300">
                {level}
              </p>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-300">
                {message}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultStat
                label="Correct Answers"
                value={`${result.correctAnswers}/${result.totalQuestions}`}
              />

              <ResultStat
                label="Marks"
                value={`${result.score}/${result.totalMarks}`}
              />

              <ResultStat
                label="Percentage"
                value={`${percentage}%`}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-5">
              <div className="flex gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                <div>
                  <h3 className="font-semibold text-white">
                    What happens now?
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Placiora saved this result
                    to your assessment history.
                    Your assessment performance
                    can now be used to build your
                    placement readiness profile.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={backToCenter}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
              >
                <ArrowLeft className="h-4 w-4" />
                Assessment Center
              </button>

              <button
                onClick={retake}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:opacity-90"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* =========================================================
   COMPONENTS
   ========================================================= */

function AssessmentCard({
  number,
  icon,
  title,
  description,
  tags,
  buttonText,
  onClick,
  loading = false,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
  tags: string[];
  buttonText: string;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          {icon}
        </div>

        <span className="text-4xl font-black text-white/[0.06]">
          {number}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={onClick}
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}

function MiniFeature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function OverviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-200">
        {value}
      </span>
    </div>
  );
}

function ResultStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-5 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function DifficultyBadge({
  difficulty,
}: {
  difficulty?: string;
}) {
  const value = (
    difficulty || "MEDIUM"
  ).toUpperCase();

  const classes =
    value === "EASY"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : value === "MEDIUM"
        ? "border-blue-400/20 bg-blue-400/10 text-blue-300"
        : value === "HARD"
          ? "border-orange-400/20 bg-orange-400/10 text-orange-300"
          : value === "EXTREME"
            ? "border-red-400/20 bg-red-400/10 text-red-300"
            : "border-white/10 bg-white/5 text-slate-400";

  return (
    <span
      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {value}
    </span>
  );
}

function getAssessmentIcon(
  type: string
) {
  const normalized =
    type.toUpperCase();

  if (normalized === "SKILL") {
    return (
      <Code2 className="h-5 w-5" />
    );
  }

  if (normalized === "COMPANY") {
    return (
      <BriefcaseBusiness className="h-5 w-5" />
    );
  }

  return (
    <Lightbulb className="h-5 w-5" />
  );
}

function formatAssessmentName(
  type: string
) {
  const normalized =
    type.toUpperCase();

  if (normalized === "SKILL") {
    return "Skill Assessment";
  }

  if (normalized === "COMPANY") {
    return "Company Readiness";
  }

  return "Situational Assessment";
}

function formatDate(date?: string) {
  if (!date) {
    return "Recently";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}