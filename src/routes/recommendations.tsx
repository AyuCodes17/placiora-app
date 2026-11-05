import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import {
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lightbulb,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
  X,
  Route as RouteIcon,
  Trophy,
  BookOpen,
  Code2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Career Recommendations — Placiora" },
      {
        name: "description",
        content:
          "Role-fit and company recommendations based on your Placiora profile.",
      },
      {
        property: "og:title",
        content: "Career Recommendations — Placiora",
      },
      {
        property: "og:description",
        content: "Placiora Career Intelligence.",
      },
    ],
  }),
  component: Recommendations,
});

const API_URL = "http://localhost:8080";

type RoleRecommendation = {
  roleName: string;
  fitScore: number;
  fitLevel: string;
  matchedSkills: string[];
  missingSkills: string[];
  relevantProjects: string[];
  reasons: string[];
};

type CompanyRecommendation = {
  companyId: number;
  companyName: string;
  jobRole: string;
  location: string;
  employmentType: string;
  description: string;
  careersUrl: string | null;

  eligible: boolean;
  matchScore: number;
  matchLevel: string;

  roleFitScore: number;
  readinessScore: number;

  minimumCgpa: number | null;
  minimumReadiness: number | null;

  matchedSkills: string[];
  missingSkills: string[];
  preferredSkills: string[];

  reasons: string[];
  improvements: string[];
};

type Student = {
  id: number;
  fullName?: string;
  email?: string;
  readinessScore?: number;
};

type SkillPriority = {
  skill: string;
  count: number;
  priority: "HIGH" | "MEDIUM" | "BUILD";
};

function Recommendations() {
  const [roles, setRoles] = useState<RoleRecommendation[]>([]);
  const [companies, setCompanies] = useState<CompanyRecommendation[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "ALL" | "ELIGIBLE" | "STRONG" | "IMPROVE"
  >("ALL");

  const [expandedCompany, setExpandedCompany] =
    useState<number | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  async function loadRecommendations() {
    try {
      setLoading(true);
      setError("");

      const storedStudent =
        localStorage.getItem("placioraStudent");

      if (!storedStudent) {
        setError(
          "Please sign in to view your career recommendations."
        );
        return;
      }

      const student: Student =
        JSON.parse(storedStudent);

      if (!student.id) {
        setError(
          "Student information could not be found."
        );
        return;
      }

      const [roleResponse, companyResponse] =
        await Promise.all([
          axios.get<RoleRecommendation[]>(
            `${API_URL}/api/roles/recommendations/${student.id}`
          ),

          axios.get<CompanyRecommendation[]>(
            `${API_URL}/api/company-recommendations/${student.id}`
          ),
        ]);

      setRoles(roleResponse.data ?? []);
      setCompanies(companyResponse.data ?? []);
    } catch (err) {
      console.error(
        "Recommendation loading error:",
        err
      );

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Placiora could not load your recommendations. Make sure the backend is running."
        );
      } else {
        setError(
          "Something went wrong while loading recommendations."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const filteredCompanies = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesSearch =
        !query ||
        company.companyName
          .toLowerCase()
          .includes(query) ||
        company.jobRole
          .toLowerCase()
          .includes(query) ||
        company.location
          .toLowerCase()
          .includes(query) ||
        company.employmentType
          .toLowerCase()
          .includes(query);

      let matchesFilter = true;

      if (filter === "ELIGIBLE") {
        matchesFilter = company.eligible;
      }

      if (filter === "STRONG") {
        matchesFilter =
          company.eligible &&
          company.matchScore >= 55;
      }

      if (filter === "IMPROVE") {
        matchesFilter =
          !company.eligible ||
          company.missingSkills.length > 0 ||
          company.matchScore < 55;
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    companies,
    search,
    filter,
  ]);

  const topRoles =
    roles.slice(0, 3);

  const readiness =
    companies.length > 0
      ? companies[0].readinessScore
      : 0;

  const eligibleCompanies =
    companies.filter(
      (company) => company.eligible
    ).length;

  const bestCompany =
    companies.length > 0
      ? companies.reduce(
          (best, current) =>
            current.matchScore >
            best.matchScore
              ? current
              : best
        )
      : null;

  /*
   * ----------------------------------
   * ACTION PLAN ENGINE
   * ----------------------------------
   *
   * Missing skills from companies
   * matching the student's strongest
   * roles receive more importance.
   */

  const actionPlanSkills =
    useMemo<SkillPriority[]>(() => {
      if (companies.length === 0) {
        return [];
      }

      const counts =
        new Map<string, number>();

      const topRoleNames =
        new Set(
          topRoles.map((role) =>
            role.roleName.toLowerCase()
          )
        );

      companies.forEach((company) => {
        company.missingSkills.forEach(
          (skill) => {
            const key = skill.trim();

            let weight = 1;

            if (
              topRoleNames.has(
                company.jobRole.toLowerCase()
              )
            ) {
              weight += 2;
            }

            counts.set(
              key,
              (counts.get(key) ?? 0) +
                weight
            );
          }
        );
      });

      /*
       * Also consider gaps directly
       * from the strongest role.
       */

      if (topRoles.length > 0) {
        topRoles[0].missingSkills.forEach(
          (skill) => {
            counts.set(
              skill,
              (counts.get(skill) ?? 0) +
                3
            );
          }
        );
      }

      return Array.from(
        counts.entries()
      )
        .sort(
          (a, b) =>
            b[1] - a[1]
        )
        .slice(0, 5)
        .map(
          ([skill, count], index) => ({
            skill,
            count,
            priority:
              index <= 1
                ? "HIGH"
                : index <= 3
                  ? "MEDIUM"
                  : "BUILD",
          })
        );
    }, [companies, topRoles]);

  const topRole =
    topRoles.length > 0
      ? topRoles[0]
      : null;

  if (loading) {
    return (
      <AppShell title="Career Recommendations">
        <div className="min-h-[65vh] grid place-items-center">
          <div className="text-center">
            <Loader2 className="h-9 w-9 animate-spin mx-auto text-primary" />

            <div className="mt-4 font-semibold">
              Placiora is analyzing your
              profile
            </div>

            <div className="mt-1 text-sm text-muted-foreground">
              Calculating role fit,
              opportunity alignment and
              career priorities...
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Career Recommendations">
        <div className="glass rounded-3xl p-8 max-w-2xl mx-auto text-center">
          <TriangleAlert className="h-10 w-10 mx-auto text-amber-400" />

          <h2 className="mt-4 text-xl font-semibold">
            Recommendations unavailable
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            onClick={
              loadRecommendations
            }
            className="btn-cyan rounded-xl px-5 py-2.5 text-sm font-medium mt-5"
          >
            Try Again
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Career Recommendations">
      <div className="space-y-7">

        {/* HERO */}

        <section className="glass rounded-3xl p-6 sm:p-7 overflow-hidden relative">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Placiora Career Intelligence
              </div>

              <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
                Your career matches are
                ready.
              </h1>

              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Placiora compares your
                skills, projects,
                certifications and
                assessment performance
                with role profiles and
                opportunity requirements.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 min-w-full lg:min-w-[390px]">
              <StatCard
                label="Readiness"
                value={`${readiness}%`}
                icon={
                  <TrendingUp className="h-4 w-4" />
                }
              />

              <StatCard
                label="Eligible"
                value={`${eligibleCompanies}`}
                icon={
                  <ShieldCheck className="h-4 w-4" />
                }
              />

              <StatCard
                label="Best Match"
                value={
                  bestCompany
                    ? `${bestCompany.matchScore}%`
                    : "—"
                }
                icon={
                  <Target className="h-4 w-4" />
                }
              />
            </div>
          </div>
        </section>

        {/* ROLE FIT */}

        <section>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />

              <h2 className="text-xl font-semibold">
                Your Top Role Fits
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              Roles your current profile
              most closely aligns with.
            </p>
          </div>

          {topRoles.length === 0 ? (
            <div className="glass rounded-3xl p-6 text-sm text-muted-foreground">
              Add skills and projects to
              your profile to generate
              role-fit recommendations.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {topRoles.map(
                (role, index) => (
                  <RoleCard
                    key={role.roleName}
                    role={role}
                    rank={index + 1}
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* ACTION PLAN */}

        {topRole &&
          actionPlanSkills.length > 0 && (
            <section>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <RouteIcon className="h-5 w-5 text-primary" />

                  <h2 className="text-xl font-semibold">
                    Your Personalized
                    Action Plan
                  </h2>
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                  Placiora prioritizes
                  the skill gaps affecting
                  your strongest role and
                  opportunity matches.
                </p>
              </div>

              <div className="grid xl:grid-cols-[1.35fr_.65fr] gap-4">

                {/* SKILL PRIORITIES */}

                <div className="glass rounded-3xl p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Current career
                        target
                      </div>

                      <h3 className="text-lg font-semibold mt-1">
                        {topRole.roleName}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        Current fit
                      </div>

                      <div className="text-2xl font-bold mt-1">
                        {topRole.fitScore}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    {actionPlanSkills.map(
                      (item, index) => (
                        <ActionSkill
                          key={item.skill}
                          index={index + 1}
                          item={item}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* NEXT MILESTONE */}

                <div className="glass rounded-3xl p-5 sm:p-6">
                  <div className="h-11 w-11 rounded-2xl bg-primary/15 text-primary grid place-items-center">
                    <Trophy className="h-5 w-5" />
                  </div>

                  <div className="mt-4 text-xs uppercase tracking-wider text-primary font-medium">
                    Next Milestone
                  </div>

                  <h3 className="mt-2 text-lg font-semibold">
                    Strengthen your{" "}
                    {topRole.roleName} profile
                  </h3>

                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Focus on the highest
                    priority skills, prove
                    them through a project,
                    then update your
                    Placiora profile.
                  </p>

                  <div className="mt-5 space-y-3">

                    <MilestoneStep
                      icon={
                        <BookOpen className="h-4 w-4" />
                      }
                      number="01"
                      title={`Learn ${actionPlanSkills
                        .slice(0, 2)
                        .map(
                          (item) =>
                            item.skill
                        )
                        .join(" + ")}`}
                    />

                    <MilestoneStep
                      icon={
                        <Code2 className="h-4 w-4" />
                      }
                      number="02"
                      title="Build or upgrade one role-relevant project"
                    />

                    <MilestoneStep
                      icon={
                        <CheckCircle2 className="h-4 w-4" />
                      }
                      number="03"
                      title="Add verified skills and project evidence to Profile"
                    />

                    <MilestoneStep
                      icon={
                        <RefreshCw className="h-4 w-4" />
                      }
                      number="04"
                      title="Retake your Skill Assessment and review new matches"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

        {/* COMPANY OPPORTUNITIES */}

        <section>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />

              <h2 className="text-xl font-semibold">
                Company Opportunity Matches
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              Explore real companies using
              Placiora's career-readiness
              matching profiles.
            </p>
          </div>

          <div className="glass rounded-3xl p-4 flex flex-col xl:flex-row gap-3 xl:items-center">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 flex-1">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search company, role or location..."
                className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground/70 min-w-0"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <FilterButton
                active={
                  filter === "ALL"
                }
                onClick={() =>
                  setFilter("ALL")
                }
              >
                All
              </FilterButton>

              <FilterButton
                active={
                  filter === "ELIGIBLE"
                }
                onClick={() =>
                  setFilter("ELIGIBLE")
                }
              >
                Eligible
              </FilterButton>

              <FilterButton
                active={
                  filter === "STRONG"
                }
                onClick={() =>
                  setFilter("STRONG")
                }
              >
                Strong Matches
              </FilterButton>

              <FilterButton
                active={
                  filter === "IMPROVE"
                }
                onClick={() =>
                  setFilter("IMPROVE")
                }
              >
                Needs Improvement
              </FilterButton>
            </div>
          </div>

          {filteredCompanies.length ===
          0 ? (
            <div className="glass rounded-3xl p-8 mt-4 text-center">
              <Search className="h-8 w-8 mx-auto text-muted-foreground" />

              <div className="font-medium mt-3">
                No opportunities found
              </div>

              <div className="text-sm text-muted-foreground mt-1">
                Try another company,
                role or filter.
              </div>
            </div>
          ) : (
            <div className="mt-4 grid xl:grid-cols-2 gap-4">
              {filteredCompanies.map(
                (company) => {
                  const expanded =
                    expandedCompany ===
                    company.companyId;

                  return (
                    <CompanyCard
                      key={
                        company.companyId
                      }
                      company={company}
                      expanded={expanded}
                      onToggle={() =>
                        setExpandedCompany(
                          expanded
                            ? null
                            : company.companyId
                        )
                      }
                    />
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* DISCLAIMER */}

        <section className="glass rounded-2xl p-4 border border-primary/10">
          <div className="flex gap-3">
            <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />

            <div>
              <div className="text-sm font-medium">
                About Placiora Match
                Profiles
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                Match scores are
                career-readiness estimates
                generated from your
                Placiora profile and
                stored opportunity
                profiles. They do not
                guarantee selection or
                represent every company's
                current hiring
                requirements. Always
                verify current openings
                and eligibility on the
                company's official careers
                page.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ActionSkill({
  index,
  item,
}: {
  index: number;
  item: SkillPriority;
}) {
  const priorityStyle =
    item.priority === "HIGH"
      ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
      : item.priority === "MEDIUM"
        ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
        : "bg-primary/10 text-primary border-primary/20";

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-4">
      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center text-xs font-bold shrink-0">
        {String(index).padStart(
          2,
          "0"
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm">
          {item.skill}
        </div>

        <div className="text-xs text-muted-foreground mt-1">
          Repeated across your
          role/company skill-gap analysis
        </div>
      </div>

      <span
        className={`text-[10px] rounded-full px-2.5 py-1 border ${priorityStyle}`}
      >
        {item.priority}
      </span>
    </div>
  );
}

function MilestoneStep({
  icon,
  number,
  title,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-primary shrink-0">
        {icon}
      </div>

      <div>
        <div className="text-[10px] text-primary">
          STEP {number}
        </div>

        <div className="text-sm mt-0.5">
          {title}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}

        <span className="text-[10px] sm:text-xs">
          {label}
        </span>
      </div>

      <div className="mt-2 text-xl sm:text-2xl font-bold">
        {value}
      </div>
    </div>
  );
}

function RoleCard({
  role,
  rank,
}: {
  role: RoleRecommendation;
  rank: number;
}) {
  return (
    <div className="glass rounded-3xl p-5 relative overflow-hidden">
      <div className="absolute right-4 top-4 text-[10px] text-muted-foreground">
        #{rank}
      </div>

      <div className="h-11 w-11 rounded-2xl bg-primary/15 text-primary grid place-items-center">
        <BriefcaseBusiness className="h-5 w-5" />
      </div>

      <h3 className="font-semibold mt-4 pr-8">
        {role.roleName}
      </h3>

      <div className="text-xs text-primary mt-1">
        {role.fitLevel}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            Current fit
          </span>

          <span className="font-semibold">
            {role.fitScore}%
          </span>
        </div>

        <Progress
          value={role.fitScore}
        />
      </div>

      <div className="mt-4">
        <div className="text-xs text-muted-foreground mb-2">
          Matched skills
        </div>

        <div className="flex flex-wrap gap-1.5">
          {role.matchedSkills.length >
          0 ? (
            role.matchedSkills
              .slice(0, 5)
              .map((skill) => (
                <SkillBadge
                  key={skill}
                  text={skill}
                  matched
                />
              ))
          ) : (
            <span className="text-xs text-muted-foreground">
              No core skills matched yet
            </span>
          )}
        </div>
      </div>

      {role.missingSkills.length >
        0 && (
        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-2">
            Focus next
          </div>

          <div className="flex flex-wrap gap-1.5">
            {role.missingSkills
              .slice(0, 3)
              .map((skill) => (
                <SkillBadge
                  key={skill}
                  text={skill}
                  matched={false}
                />
              ))}
          </div>
        </div>
      )}

      {role.relevantProjects.length >
        0 && (
        <div className="mt-4 text-xs text-muted-foreground">
          Project evidence:{" "}
          <span className="text-foreground">
            {role.relevantProjects.join(
              ", "
            )}
          </span>
        </div>
      )}
    </div>
  );
}

function CompanyCard({
  company,
  expanded,
  onToggle,
}: {
  company: CompanyRecommendation;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="glass rounded-3xl p-5 sm:p-6 hover:border-primary/30 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-2xl bg-[var(--gradient-cyan)] grid place-items-center text-[color:var(--primary-foreground)] font-bold shrink-0">
            {company.companyName
              .replace(/\s+/g, "")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold truncate">
              {company.companyName}
            </h3>

            <div className="text-xs text-muted-foreground mt-0.5 truncate">
              {company.jobRole}
            </div>
          </div>
        </div>

        <span
          className={`text-[10px] sm:text-xs rounded-full px-2.5 py-1 whitespace-nowrap ${
            company.eligible
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          {company.eligible
            ? "Eligible"
            : "Not Eligible"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {company.location}
        </span>

        <span className="inline-flex items-center gap-1">
          <Building2 className="h-3.5 w-3.5" />
          {company.employmentType}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-muted-foreground">
              Placiora Match
            </div>

            <div className="text-xs text-primary mt-0.5">
              {company.matchLevel}
            </div>
          </div>

          <div className="text-2xl font-bold">
            {company.matchScore}%
          </div>
        </div>

        <Progress
          value={company.matchScore}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <MiniMetric
          label="Role Fit"
          value={`${company.roleFitScore}%`}
        />

        <MiniMetric
          label="Readiness"
          value={`${company.readinessScore}%`}
        />
      </div>

      <div className="mt-5">
        <div className="text-xs text-muted-foreground mb-2">
          Skill alignment
        </div>

        <div className="flex flex-wrap gap-1.5">
          {company.matchedSkills.map(
            (skill) => (
              <SkillBadge
                key={`matched-${skill}`}
                text={skill}
                matched
              />
            )
          )}

          {company.missingSkills
            .slice(0, 3)
            .map((skill) => (
              <SkillBadge
                key={`missing-${skill}`}
                text={skill}
                matched={false}
              />
            ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="mt-5 w-full btn-ghost rounded-xl px-4 py-2.5 text-sm inline-flex items-center justify-center gap-2"
      >
        {expanded ? (
          <>
            Hide Details
            <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            View Match Details
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-5 pt-5 border-t border-white/10 space-y-5">

          <div>
            <h4 className="text-sm font-medium">
              Why this opportunity
              matches
            </h4>

            <div className="mt-3 space-y-2">
              {company.reasons.map(
                (reason, index) => (
                  <div
                    key={`${reason}-${index}`}
                    className="flex gap-2 text-xs sm:text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />

                    <span>
                      {reason}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {company.improvements
            .length > 0 && (
            <div>
              <h4 className="text-sm font-medium">
                How to improve your
                match
              </h4>

              <div className="mt-3 space-y-2">
                {company.improvements.map(
                  (
                    improvement,
                    index
                  ) => (
                    <div
                      key={`${improvement}-${index}`}
                      className="flex gap-2 text-xs sm:text-sm text-muted-foreground"
                    >
                      <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" />

                      <span>
                        {improvement}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {company.preferredSkills
            .length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2">
                Preferred skills
              </div>

              <div className="flex flex-wrap gap-1.5">
                {company.preferredSkills.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-muted-foreground"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <MiniMetric
              label="Profile CGPA Requirement"
              value={
                company.minimumCgpa !=
                null
                  ? `${company.minimumCgpa}+`
                  : "Not set"
              }
            />

            <MiniMetric
              label="Suggested Readiness"
              value={
                company.minimumReadiness !=
                null
                  ? `${company.minimumReadiness}%`
                  : "Not set"
              }
            />
          </div>

          {company.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {company.description}
            </p>
          )}

          {company.careersUrl && (
            <a
              href={
                company.careersUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyan rounded-xl px-4 py-2.5 text-sm font-medium w-full inline-flex justify-center items-center gap-2"
            >
              Visit Official Careers
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      <div className="text-[10px] sm:text-xs text-muted-foreground">
        {label}
      </div>

      <div className="text-sm font-semibold mt-1">
        {value}
      </div>
    </div>
  );
}

function SkillBadge({
  text,
  matched,
}: {
  text: string;
  matched: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs border ${
        matched
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-rose-500/10 text-rose-300 border-rose-500/20"
      }`}
    >
      {matched ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3" />
      )}

      {text}
    </span>
  );
}

function Progress({
  value,
}: {
  value: number;
}) {
  const safeValue =
    Math.max(
      0,
      Math.min(
        100,
        value || 0
      )
    );

  return (
    <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full bg-[var(--gradient-cyan)] rounded-full transition-all duration-500"
        style={{
          width: `${safeValue}%`,
        }}
      />
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-xs transition ${
        active
          ? "bg-[var(--gradient-cyan)] text-[color:var(--primary-foreground)] font-medium"
          : "btn-ghost"
      }`}
    >
      {children}
    </button>
  );
}