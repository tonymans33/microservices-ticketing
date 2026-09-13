import { useRouter } from "next/router";
import ErrorList from "../../components/error-list";
import useRequest from "../../hooks/use-request";

export default function TicketShow({ currentUser, ticket }) {
  const router = useRouter();

  const { doRequest, errors, isLoading } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket ? ticket.id : null },
    onSuccess: (order) => router.push(`/orders/${order.id}`),
  });

  if (!ticket) {
    return (
      <main className="page-shell">
        <div className="empty-state">
          <h2>Ticket not found</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="detail-card">
        <p className="eyebrow">Ticket</p>
        <h1>{ticket.title}</h1>
        <p className="price-tag">${ticket.price}</p>

        <ErrorList errors={errors} />

        {currentUser ? (
          <button
            className="button primary"
            disabled={isLoading}
            onClick={() => doRequest()}
          >
            {isLoading ? "Reserving..." : "Purchase"}
          </button>
        ) : (
          <p className="muted">Sign in to purchase this ticket.</p>
        )}
      </section>
    </main>
  );
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;

  try {
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data };
  } catch (err) {
    return { ticket: null };
  }
};
