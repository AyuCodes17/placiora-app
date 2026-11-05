import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";
import { User, Mail, Lock, GraduationCap, Hash, ArrowRight } from "lucide-react";
import { AuthLayout, Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Student Registration — Placiora" },
      { name: "description", content: "Create your Placiora student account and start your placement journey." },
      { property: "og:title", content: "Student Registration — Placiora" },
      { property: "og:description", content: "Create your student account." },
    ],
  }),
  component: Register,
});

function Register() {

  const [student, setStudent] = useState({
    fullName: "",
    rollNumber: "",
    email: "",
    phone: "",
    department: "",
    semester: "",
    cgpa: 0,
    password: "",
    placementStatus: "Not Placed",
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:8080/api/students/register",
      student
    );

    console.log(response.data);

    alert("Registration Successful!");

  } catch (error) {
    console.error(error);

    alert("Registration Failed!");
  }
};

  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of students placing with intent">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
          icon={User}
          label="Full name"
          placeholder="Alex Johnson"
          value={student.fullName}
          onChange={(e) =>
            setStudent({
              ...student,
              fullName: e.target.value,
    })
  }
/>
          <Field
          icon={Hash}
          label="Roll number"
          placeholder="21BCE1234"
          value={student.rollNumber}
          onChange={(e) =>
            setStudent({
              ...student,
              rollNumber: e.target.value,
    })
  }
/>
        </div>
        <Field
        icon={Mail}
        type="email"
        label="Email"
        placeholder="you@college.edu"
        value={student.email}
        onChange={(e) =>
          setStudent({
            ...student,
            email: e.target.value,
    })
  }
/>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
          icon={GraduationCap}
          label="Branch"
          placeholder="Computer Science"
          value={student.department}
          onChange={(e) =>
            setStudent({
              ...student,
              department: e.target.value,
    })
  }
/>
          <Field
          icon={GraduationCap}
          label="Semester"
          placeholder="3"
          value={student.semester}
          onChange={(e) =>
            setStudent({
              ...student,
              semester: e.target.value,
    })
  }
/>
        </div>
        <Field
        icon={Lock}
        type="password"
        label="Password"
        placeholder="Create a password"
        value={student.password}
        onChange={(e) =>
          setStudent({
            ...student,
            password: e.target.value,
    })
  }
/>
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="mt-0.5 accent-[color:var(--primary)]" />
          I agree to the Terms and Privacy Policy.
        </label>
        <button className="btn-cyan w-full rounded-xl px-4 py-3 font-medium inline-flex items-center justify-center gap-2">
          Create account <ArrowRight className="h-4 w-4" />
        </button>
        <div className="text-center text-xs text-muted-foreground">
          Already registered? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
