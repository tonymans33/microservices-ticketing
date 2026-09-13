import { useRouter } from "next/router";
import { useState } from "react";
import ErrorList from "../../components/error-list";
import useRequest from "../../hooks/use-request";

export default function NewTicket() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors, isLoading } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess: () => router.push("/"),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest({ title, price: parseFloat(price) });
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (!isNaN(value)) {
      setPrice(value.toFixed(2));
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">New listing</p>
        <h1>Sell a ticket</h1>
        <p className="muted">Set a title and price for your ticket.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <label>
            Price
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onBlur={onBlur}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </label>

          <ErrorList errors={errors} />

          <button className="button primary full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create ticket"}
          </button>
        </form>
      </section>
    </main>
  );
}
