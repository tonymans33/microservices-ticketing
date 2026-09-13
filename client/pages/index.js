import Link from "next/link";

export default function Home({ currentUser, tickets }) {
  return (
    <main className="page-shell">
      <section className="list-header">
        <div>
          <p className="eyebrow">Marketplace</p>
          <h1>Tickets</h1>
        </div>
        {currentUser ? (
          <Link href="/tickets/new" className="button primary">
            Sell a ticket
          </Link>
        ) : null}
      </section>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <h2>No tickets yet</h2>
          <p className="muted">
            {currentUser
              ? "Be the first to list one."
              : "Sign in to list the first one."}
          </p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>${ticket.price}</td>
                <td className="row-action">
                  <Link href={`/tickets/${ticket.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

Home.getInitialProps = async (context, client) => {
  try {
    const { data } = await client.get("/api/tickets");
    return { tickets: Array.isArray(data) ? data : [] };
  } catch (err) {
    return { tickets: [] };
  }
};
