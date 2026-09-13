import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Signout() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/signout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        setError("Could not sign out");
        return;
      }

      router.push("/");
    } catch (err) {
      setError("Could not reach the auth service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">

      <section className="auth-card signout-card">
        <p className="eyebrow">End session</p>
        <h1>Sign out?</h1>
        <p className="muted">
          This clears your session cookie for the current browser.
        </p>

        <form onSubmit={onSubmit} className="auth-form">
          {error ? (
            <div className="error-list">
              <p>{error}</p>
            </div>
          ) : null}

          <button className="button danger full" disabled={isSubmitting}>
            {isSubmitting ? "Signing out..." : "Sign out"}
          </button>
        </form>

        <p className="switch-copy">
          Changed your mind? <Link href="/">Go home</Link>
        </p>
      </section>
    </main>
  );
}
