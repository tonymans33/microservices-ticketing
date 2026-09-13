import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || [{ message: "Could not create account" }]);
        return;
      }

      router.push("/");
    } catch (err) {
      setErrors([{ message: "Could not reach the auth service" }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Start selling smarter</p>
        <h1>Create your account</h1>
        <p className="muted">Use an email and password to start a session.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={4}
              maxLength={20}
              required
            />
          </label>

          <ErrorList errors={errors} />

          <button className="button primary full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="switch-copy">
          Already have an account? <Link href="/auth/signin">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

function ErrorList({ errors }) {
  if (!errors.length) {
    return null;
  }

  return (
    <div className="error-list">
      {errors.map((error) => (
        <p key={error.message}>{error.message}</p>
      ))}
    </div>
  );
}
