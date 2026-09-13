import Link from "next/link";

export default function OrderIndex({ orders }) {
  return (
    <main className="page-shell">
      <section className="list-header">
        <div>
          <p className="eyebrow">Your account</p>
          <h1>My orders</h1>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p className="muted">Purchase a ticket to see it here.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Price</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.ticket.title}</td>
                <td>${order.ticket.price}</td>
                <td>{order.status}</td>
                <td className="row-action">
                  <Link href={`/orders/${order.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

OrderIndex.getInitialProps = async (context, client) => {
  try {
    const { data } = await client.get("/api/orders");
    return { orders: Array.isArray(data) ? data : [] };
  } catch (err) {
    return { orders: [] };
  }
};
