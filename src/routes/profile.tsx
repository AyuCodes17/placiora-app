import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import axios from "axios";
import { AppShell } from "@/components/app/AppShell";

import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  FolderGit2,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  X,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      {
        title: "Profile — Placiora",
      },
      {
        name: "description",
        content:
          "Manage your Placiora student profile, skills, projects and certifications.",
      },
    ],
  }),

  component: Profile,
});

const API = "http://localhost:8080";

type Skill = {
  id?: number;
  studentId?: number;
  name: string;
  level: string;
};

type Project = {
  id?: number;
  studentId?: number;
  title: string;
  description: string;
  technologies: string;
  githubUrl: string;
  projectUrl: string;
};

type Certification = {
  id?: number;
  studentId?: number;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
};

function Profile() {
  const [student, setStudent] = useState<any>(null);

  const [editing, setEditing] = useState(false);

  const [showSkillModal, setShowSkillModal] =
    useState(false);

  const [showProjectModal, setShowProjectModal] =
    useState(false);

  const [
    showCertificationModal,
    setShowCertificationModal,
  ] = useState(false);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [certifications, setCertifications] =
    useState<Certification[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    department: "",
    semester: 1,
    cgpa: 0,
    location: "",
    portfolioUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    bio: "",
  });

  const [skillForm, setSkillForm] =
    useState<Skill>({
      name: "",
      level: "Beginner",
    });

  const [projectForm, setProjectForm] =
    useState<Project>({
      title: "",
      description: "",
      technologies: "",
      githubUrl: "",
      projectUrl: "",
    });

  const [
    certificationForm,
    setCertificationForm,
  ] = useState<Certification>({
    name: "",
    issuer: "",
    issueDate: "",
    credentialUrl: "",
  });

  useEffect(() => {
    const savedStudent =
      localStorage.getItem("placioraStudent");

    if (!savedStudent) return;

    const parsedStudent =
      JSON.parse(savedStudent);

    setStudent(parsedStudent);

    setFormData({
      fullName: parsedStudent.fullName || "",
      phone: parsedStudent.phone || "",
      department: parsedStudent.department || "",
      semester: parsedStudent.semester || 1,
      cgpa: parsedStudent.cgpa ?? 0,
      location: parsedStudent.location || "",
      portfolioUrl:
        parsedStudent.portfolioUrl || "",
      githubUrl: parsedStudent.githubUrl || "",
      linkedinUrl:
        parsedStudent.linkedinUrl || "",
      bio: parsedStudent.bio || "",
    });

    if (parsedStudent.id) {
      loadProfileData(parsedStudent.id);
    }
  }, []);

  async function loadProfileData(
    studentId: number
  ) {
    try {
      const [
        skillRes,
        projectRes,
        certificationRes,
      ] = await Promise.all([
        axios.get(
          `${API}/api/profile/${studentId}/skills`
        ),

        axios.get(
          `${API}/api/profile/${studentId}/projects`
        ),

        axios.get(
          `${API}/api/profile/${studentId}/certifications`
        ),
      ]);

      setSkills(skillRes.data);
      setProjects(projectRes.data);

      setCertifications(
        certificationRes.data
      );
    } catch (error) {
      console.error(
        "Failed to load profile data:",
        error
      );
    }
  }

  function handleProfileChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function saveProfile() {
    if (!student?.id) return;

    try {
      const response = await axios.put(
        `${API}/api/students/${student.id}`,
        {
          ...formData,

          semester: Number(
            formData.semester
          ),

          cgpa: Number(formData.cgpa),
        }
      );

      setStudent(response.data);

      localStorage.setItem(
        "placioraStudent",
        JSON.stringify(response.data)
      );

      setEditing(false);

      alert(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error(error);

      alert("Profile update failed!");
    }
  }

  async function addSkill() {
    if (
      !student?.id ||
      !skillForm.name.trim()
    ) {
      alert("Enter a skill name.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/profile/${student.id}/skills`,
        skillForm
      );

      setSkills((old) => [
        response.data,
        ...old,
      ]);

      setSkillForm({
        name: "",
        level: "Beginner",
      });

      setShowSkillModal(false);
    } catch (error) {
      console.error(error);

      alert("Could not add skill.");
    }
  }

  async function deleteSkill(id?: number) {
    if (!student?.id || !id) return;

    try {
      await axios.delete(
        `${API}/api/profile/${student.id}/skills/${id}`
      );

      setSkills((old) =>
        old.filter(
          (skill) => skill.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert("Could not delete skill.");
    }
  }

  async function addProject() {
    if (
      !student?.id ||
      !projectForm.title.trim()
    ) {
      alert("Enter a project title.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/profile/${student.id}/projects`,
        projectForm
      );

      setProjects((old) => [
        response.data,
        ...old,
      ]);

      setProjectForm({
        title: "",
        description: "",
        technologies: "",
        githubUrl: "",
        projectUrl: "",
      });

      setShowProjectModal(false);
    } catch (error) {
      console.error(error);

      alert("Could not add project.");
    }
  }

  async function deleteProject(
    id?: number
  ) {
    if (!student?.id || !id) return;

    try {
      await axios.delete(
        `${API}/api/profile/${student.id}/projects/${id}`
      );

      setProjects((old) =>
        old.filter(
          (project) =>
            project.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert("Could not delete project.");
    }
  }

  async function addCertification() {
    if (
      !student?.id ||
      !certificationForm.name.trim()
    ) {
      alert(
        "Enter a certification name."
      );

      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/profile/${student.id}/certifications`,
        certificationForm
      );

      setCertifications((old) => [
        response.data,
        ...old,
      ]);

      setCertificationForm({
        name: "",
        issuer: "",
        issueDate: "",
        credentialUrl: "",
      });

      setShowCertificationModal(false);
    } catch (error) {
      console.error(error);

      alert(
        "Could not add certification."
      );
    }
  }

  async function deleteCertification(
    id?: number
  ) {
    if (!student?.id || !id) return;

    try {
      await axios.delete(
        `${API}/api/profile/${student.id}/certifications/${id}`
      );

      setCertifications((old) =>
        old.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Could not delete certification."
      );
    }
  }

  function getInitials() {
    if (!student?.fullName)
      return "ST";

    return student.fullName
      .split(" ")
      .filter(Boolean)
      .map(
        (word: string) =>
          word[0]
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }

  if (!student) {
    return (
      <AppShell title="Profile">
        <div className="glass rounded-3xl p-10 text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-cyan-400/10" />

          <div className="mt-4 text-sm text-muted-foreground">
            Loading your Placiora profile...
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Profile">
      <div className="space-y-6">

        {/* ================================================= */}
        {/* PROFILE HERO                                      */}
        {/* ================================================= */}

        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/10 via-white/[0.03] to-blue-500/10 p-6 shadow-2xl shadow-black/10 sm:p-8">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">

            {/* Avatar */}

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10 text-3xl font-bold text-cyan-300 shadow-lg shadow-cyan-950/20">

              {getInitials()}

            </div>

            {/* Main information */}

            <div className="min-w-0 flex-1">

              <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">

                Student Profile

              </div>

              <h1 className="truncate text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">

                {student.fullName}

              </h1>

              <p className="mt-2 text-sm text-muted-foreground sm:text-base">

                {student.department ||
                  "Department"}{" "}
                · Semester{" "}
                {student.semester || "-"}

              </p>

              {/* Contact details */}

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">

                {student.email && (
                  <span className="flex items-center gap-2">

                    <Mail className="h-4 w-4 text-cyan-300" />

                    {student.email}

                  </span>
                )}

                {student.phone && (
                  <span className="flex items-center gap-2">

                    <Phone className="h-4 w-4 text-cyan-300" />

                    {student.phone}

                  </span>
                )}

                {student.location && (
                  <span className="flex items-center gap-2">

                    <MapPin className="h-4 w-4 text-cyan-300" />

                    {student.location}

                  </span>
                )}

              </div>

              {/* Social links */}

              <div className="mt-5 flex flex-wrap gap-2">

                {student.githubUrl && (
                  <SocialLink
                    href={
                      student.githubUrl
                    }
                  >
                    <Github size={15} />
                    GitHub
                  </SocialLink>
                )}

                {student.linkedinUrl && (
                  <SocialLink
                    href={
                      student.linkedinUrl
                    }
                  >
                    <Linkedin size={15} />
                    LinkedIn
                  </SocialLink>
                )}

                {student.portfolioUrl && (
                  <SocialLink
                    href={
                      student.portfolioUrl
                    }
                  >
                    <ExternalLink
                      size={15}
                    />
                    Portfolio
                  </SocialLink>
                )}

              </div>

            </div>

            {/* Edit button */}

            <button
              onClick={() =>
                setEditing(true)
              }
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-300"
            >

              <Pencil size={16} />

              Edit Profile

            </button>

          </div>
        </section>


        {/* ================================================= */}
        {/* PROFILE STATS                                     */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon={
              <GraduationCap
                size={21}
              />
            }
            label="CGPA"
            value={
              student.cgpa ?? "N/A"
            }
          />

          <StatCard
            icon={
              <BookOpen size={21} />
            }
            label="Semester"
            value={
              student.semester || "-"
            }
          />

          <StatCard
            icon={
              <BriefcaseBusiness
                size={21}
              />
            }
            label="Placement Status"
            value={
              student.placementStatus ||
              "Not Placed"
            }
          />

          <StatCard
            icon={
              <MapPin size={21} />
            }
            label="Location"
            value={
              student.location ||
              "Not added"
            }
          />

        </div>


        {/* ================================================= */}
        {/* ABOUT                                             */}
        {/* ================================================= */}

        <Card>

          <SectionHeader
            title="About Me"
          />

          {student.bio ? (
            <p className="max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base">

              {student.bio}

            </p>
          ) : (
            <EmptyMessage text="Tell companies a little about yourself, your interests and career goals." />
          )}

        </Card>


        {/* ================================================= */}
        {/* SKILLS                                            */}
        {/* ================================================= */}

        <Card>

          <SectionHeader
            title="Skills"
            action={
              <PrimaryButton
                text="Add Skill"
                onClick={() =>
                  setShowSkillModal(
                    true
                  )
                }
              />
            }
          />

          {skills.length === 0 ? (
            <EmptyMessage text="No skills added yet. Add the technologies and tools you know." />
          ) : (
            <div className="flex flex-wrap gap-3">

              {skills.map((skill) => (

                <div
                  key={skill.id}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-cyan-400/20 hover:bg-cyan-400/5"
                >

                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">

                    <Code2 size={17} />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-foreground">

                      {skill.name}

                    </p>

                    <p className="text-xs text-muted-foreground">

                      {skill.level}

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      deleteSkill(
                        skill.id
                      )
                    }
                    className="ml-1 rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
                    title="Delete skill"
                  >

                    <Trash2 size={15} />

                  </button>

                </div>
              ))}

            </div>
          )}

        </Card>


        {/* ================================================= */}
        {/* PROJECTS                                          */}
        {/* ================================================= */}

        <Card>

          <SectionHeader
            title="Projects"
            action={
              <PrimaryButton
                text="Add Project"
                onClick={() =>
                  setShowProjectModal(
                    true
                  )
                }
              />
            }
          />

          {projects.length === 0 ? (
            <EmptyMessage text="No projects added yet. Showcase what you've built." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">

              {projects.map(
                (project) => (

                  <article
                    key={project.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.07]"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">

                          <FolderGit2
                            size={20}
                          />

                        </div>

                        <h3 className="font-semibold text-foreground">

                          {project.title}

                        </h3>

                      </div>

                      <button
                        onClick={() =>
                          deleteProject(
                            project.id
                          )
                        }
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete project"
                      >

                        <Trash2
                          size={16}
                        />

                      </button>

                    </div>

                    {project.description && (
                      <p className="mt-4 text-sm leading-6 text-muted-foreground">

                        {
                          project.description
                        }

                      </p>
                    )}

                    {project.technologies && (
                      <div className="mt-4 flex flex-wrap gap-2">

                        {project.technologies
                          .split(",")
                          .map((tech) => (

                            <span
                              key={tech}
                              className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-200"
                            >

                              {tech.trim()}

                            </span>
                          ))}

                      </div>
                    )}

                    {(project.githubUrl ||
                      project.projectUrl) && (

                      <div className="mt-5 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-sm">

                        {project.githubUrl && (
                          <ExternalTextLink
                            href={
                              project.githubUrl
                            }
                          >

                            <Github
                              size={15}
                            />

                            GitHub

                          </ExternalTextLink>
                        )}

                        {project.projectUrl && (
                          <ExternalTextLink
                            href={
                              project.projectUrl
                            }
                          >

                            <ExternalLink
                              size={15}
                            />

                            Live Demo

                          </ExternalTextLink>
                        )}

                      </div>
                    )}

                  </article>
                )
              )}

            </div>
          )}

        </Card>


        {/* ================================================= */}
        {/* CERTIFICATIONS                                    */}
        {/* ================================================= */}

        <Card>

          <SectionHeader
            title="Certifications"
            action={
              <PrimaryButton
                text="Add Certification"
                onClick={() =>
                  setShowCertificationModal(
                    true
                  )
                }
              />
            }
          />

          {certifications.length ===
          0 ? (
            <EmptyMessage text="No certifications added yet." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">

              {certifications.map(
                (certification) => (

                  <div
                    key={
                      certification.id
                    }
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/20"
                  >

                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-300">

                      <Award size={21} />

                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="font-semibold text-foreground">

                        {
                          certification.name
                        }

                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">

                        {certification.issuer ||
                          "Issuer not added"}

                      </p>

                      {certification.issueDate && (
                        <p className="mt-1 text-xs text-muted-foreground/70">

                          Issued{" "}
                          {
                            certification.issueDate
                          }

                        </p>
                      )}

                      {certification.credentialUrl && (
                        <a
                          href={
                            certification.credentialUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                        >

                          View Credential

                          <ExternalLink
                            size={13}
                          />

                        </a>
                      )}

                    </div>

                    <button
                      onClick={() =>
                        deleteCertification(
                          certification.id
                        )
                      }
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
                      title="Delete certification"
                    >

                      <Trash2 size={16} />

                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </Card>

      </div>


      {/* =================================================== */}
      {/* EDIT PROFILE MODAL                                  */}
      {/* =================================================== */}

      {editing && (

        <Modal
          title="Edit Profile"
          subtitle="Update your personal and academic information."
          onClose={() =>
            setEditing(false)
          }
        >

          <div className="grid gap-5 md:grid-cols-2">

            <EditField
              label="Full Name"
              name="fullName"
              value={
                formData.fullName
              }
              onChange={
                handleProfileChange
              }
            />

            <EditField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={
                handleProfileChange
              }
            />

            <EditField
              label="Department"
              name="department"
              value={
                formData.department
              }
              onChange={
                handleProfileChange
              }
            />

            <EditField
              label="Semester"
              name="semester"
              type="number"
              value={
                formData.semester
              }
              onChange={
                handleProfileChange
              }
            />

            <EditField
              label="CGPA"
              name="cgpa"
              type="number"
              step="0.01"
              value={formData.cgpa}
              onChange={
                handleProfileChange
              }
            />

            <EditField
              label="Location"
              name="location"
              value={
                formData.location
              }
              onChange={
                handleProfileChange
              }
            />

            <div className="md:col-span-2">

              <EditField
                label="GitHub URL"
                name="githubUrl"
                placeholder="https://github.com/username"
                value={
                  formData.githubUrl
                }
                onChange={
                  handleProfileChange
                }
              />

            </div>

            <div className="md:col-span-2">

              <EditField
                label="LinkedIn URL"
                name="linkedinUrl"
                placeholder="https://linkedin.com/in/username"
                value={
                  formData.linkedinUrl
                }
                onChange={
                  handleProfileChange
                }
              />

            </div>

            <div className="md:col-span-2">

              <EditField
                label="Portfolio URL"
                name="portfolioUrl"
                placeholder="https://yourportfolio.com"
                value={
                  formData.portfolioUrl
                }
                onChange={
                  handleProfileChange
                }
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-foreground">

                Bio

              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={
                  handleProfileChange
                }
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
              />

            </div>

          </div>

          <ModalButtons
            cancel={() =>
              setEditing(false)
            }
            save={saveProfile}
            saveText="Save Changes"
          />

        </Modal>
      )}


      {/* =================================================== */}
      {/* SKILL MODAL                                         */}
      {/* =================================================== */}

      {showSkillModal && (

        <Modal
          title="Add Skill"
          subtitle="Add a technical or professional skill."
          onClose={() =>
            setShowSkillModal(
              false
            )
          }
        >

          <EditField
            label="Skill Name"
            placeholder="e.g. Java"
            value={
              skillForm.name
            }
            onChange={(e: any) =>
              setSkillForm({
                ...skillForm,
                name: e.target.value,
              })
            }
          />

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-foreground">

              Skill Level

            </label>

            <select
              value={
                skillForm.level
              }
              onChange={(e) =>
                setSkillForm({
                  ...skillForm,
                  level:
                    e.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-foreground outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
            >

              <option>
                Beginner
              </option>

              <option>
                Intermediate
              </option>

              <option>
                Advanced
              </option>

            </select>

          </div>

          <ModalButtons
            cancel={() =>
              setShowSkillModal(
                false
              )
            }
            save={addSkill}
            saveText="Add Skill"
          />

        </Modal>
      )}


      {/* =================================================== */}
      {/* PROJECT MODAL                                       */}
      {/* =================================================== */}

      {showProjectModal && (

        <Modal
          title="Add Project"
          subtitle="Showcase something you've built."
          onClose={() =>
            setShowProjectModal(
              false
            )
          }
        >

          <div className="space-y-5">

            <EditField
              label="Project Title"
              placeholder="e.g. Placiora"
              value={
                projectForm.title
              }
              onChange={(e: any) =>
                setProjectForm({
                  ...projectForm,
                  title:
                    e.target.value,
                })
              }
            />

            <div>

              <label className="mb-2 block text-sm font-medium text-foreground">

                Description

              </label>

              <textarea
                rows={4}
                value={
                  projectForm.description
                }
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    description:
                      e.target.value,
                  })
                }
                placeholder="What does this project do?"
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
              />

            </div>

            <EditField
              label="Technologies"
              placeholder="React, Spring Boot, MySQL"
              value={
                projectForm.technologies
              }
              onChange={(e: any) =>
                setProjectForm({
                  ...projectForm,
                  technologies:
                    e.target.value,
                })
              }
            />

            <EditField
              label="GitHub URL"
              placeholder="https://github.com/..."
              value={
                projectForm.githubUrl
              }
              onChange={(e: any) =>
                setProjectForm({
                  ...projectForm,
                  githubUrl:
                    e.target.value,
                })
              }
            />

            <EditField
              label="Live Project URL"
              placeholder="https://..."
              value={
                projectForm.projectUrl
              }
              onChange={(e: any) =>
                setProjectForm({
                  ...projectForm,
                  projectUrl:
                    e.target.value,
                })
              }
            />

          </div>

          <ModalButtons
            cancel={() =>
              setShowProjectModal(
                false
              )
            }
            save={addProject}
            saveText="Add Project"
          />

        </Modal>
      )}


      {/* =================================================== */}
      {/* CERTIFICATION MODAL                                 */}
      {/* =================================================== */}

      {showCertificationModal && (

        <Modal
          title="Add Certification"
          subtitle="Add a course or professional certification."
          onClose={() =>
            setShowCertificationModal(
              false
            )
          }
        >

          <div className="space-y-5">

            <EditField
              label="Certification Name"
              placeholder="e.g. Java Programming"
              value={
                certificationForm.name
              }
              onChange={(e: any) =>
                setCertificationForm({
                  ...certificationForm,
                  name:
                    e.target.value,
                })
              }
            />

            <EditField
              label="Issuer"
              placeholder="Coursera, Google, AWS..."
              value={
                certificationForm.issuer
              }
              onChange={(e: any) =>
                setCertificationForm({
                  ...certificationForm,
                  issuer:
                    e.target.value,
                })
              }
            />

            <EditField
              label="Issue Date"
              type="date"
              value={
                certificationForm.issueDate
              }
              onChange={(e: any) =>
                setCertificationForm({
                  ...certificationForm,
                  issueDate:
                    e.target.value,
                })
              }
            />

            <EditField
              label="Credential URL"
              placeholder="https://..."
              value={
                certificationForm.credentialUrl
              }
              onChange={(e: any) =>
                setCertificationForm({
                  ...certificationForm,
                  credentialUrl:
                    e.target.value,
                })
              }
            />

          </div>

          <ModalButtons
            cancel={() =>
              setShowCertificationModal(
                false
              )
            }
            save={
              addCertification
            }
            saveText="Add Certification"
          />

        </Modal>
      )}

    </AppShell>
  );
}


/* ========================================================= */
/* UI COMPONENTS                                             */
/* ========================================================= */

function Card({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="glass rounded-3xl border border-white/5 p-6 md:p-7">

      {children}

    </section>
  );
}


function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">

      <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">

        {title}

      </h2>

      {action}

    </div>
  );
}


function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="glass rounded-2xl border border-white/5 p-5 transition hover:border-cyan-400/10">

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">

        {icon}

      </div>

      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">

        {label}

      </p>

      <p className="mt-1 truncate text-xl font-semibold text-foreground">

        {value}

      </p>

    </div>
  );
}


function PrimaryButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
    >

      <Plus size={16} />

      {text}

    </button>
  );
}


function EmptyMessage({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-muted-foreground">

      {text}

    </div>
  );
}


function SocialLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-foreground transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-200"
    >

      {children}

    </a>
  );
}


function ExternalTextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 font-medium text-cyan-300 transition hover:text-cyan-200"
    >

      {children}

    </a>
  );
}


function Modal({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">

      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40">

        <div className="flex shrink-0 items-start justify-between border-b border-white/10 px-6 py-5 md:px-7">

          <div>

            <h2 className="text-xl font-semibold tracking-tight text-foreground">

              {title}

            </h2>

            {subtitle && (

              <p className="mt-1 text-sm text-muted-foreground">

                {subtitle}

              </p>

            )}

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
            aria-label="Close modal"
          >

            <X size={20} />

          </button>

        </div>

        <div className="overflow-y-auto px-6 py-6 md:px-7">

          {children}

        </div>

      </div>

    </div>
  );
}


function ModalButtons({
  cancel,
  save,
  saveText,
}: {
  cancel: () => void;
  save: () => void;
  saveText: string;
}) {
  return (
    <div className="sticky bottom-0 mt-7 flex justify-end gap-3 border-t border-white/10 bg-slate-950/95 pt-5">

      <button
        onClick={cancel}
        className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
      >

        Cancel

      </button>

      <button
        onClick={save}
        className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      >

        {saveText}

      </button>

    </div>
  );
}


function EditField({
  label,
  name,
  value,
  onChange,
  type = "text",
  step,
  placeholder,
}: any) {
  return (
    <div>

      {label && (

        <label className="mb-2 block text-sm font-medium text-foreground">

          {label}

        </label>

      )}

      <input
        name={name}
        type={type}
        step={step}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
      />

    </div>
  );
}