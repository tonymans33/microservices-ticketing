import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Signin() {
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
      const response = await fetch("/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || [{ message: "Could not sign in" }]);
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
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
        <p className="muted">Continue with your ticketing session.</p>

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
              autoComplete="current-password"
              minLength={4}
              maxLength={20}
              required
            />
          </label>

          <ErrorList errors={errors} />

          <button className="button primary full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="switch-copy">
          New here? <Link href="/auth/signup">Create an account</Link>
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
