"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function ProjectLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/project-auth/login", {
      method: "POST",
      body: new FormData(event.currentTarget)
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Invalid credentials");
      return;
    }

    router.replace("/project-dashboard");
    router.refresh();
  };

  return (
    <form className="login-form" onSubmit={onSubmit}>
      {error ? <p className="error-msg">{error}</p> : null}

      <div className="form-group">
        <label htmlFor="project-login-username">USERNAME</label>
        <input id="project-login-username" type="text" name="username" required autoComplete="username" />
      </div>

      <div className="form-group">
        <label htmlFor="project-login-password">PASSWORD</label>
        <input id="project-login-password" type="password" name="password" required autoComplete="current-password" />
      </div>

      <button className="btn-login" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "LOGGING IN..." : "LOGIN"}
      </button>
    </form>
  );
}
