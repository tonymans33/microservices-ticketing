import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PaymentForm from "../../components/payment-form";
import useRequest from "../../hooks/use-request";

function formatTimeLeft(totalSeconds) {
  if (totalSeconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function OrderShow({ order, currentUser }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(null);
  const [cardErrors, setCardErrors] = useState([]);

  const { doRequest, errors, isLoading } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order ? order.id : null },
    onSuccess: () => router.push("/orders"),
  });

  useEffect(() => {
    if (!order) {
      return;
    }

    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.max(0, Math.round(msLeft / 1000)));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [order]);

  if (!order) {
    return (
      <main className="page-shell">
        <div className="empty-state">
          <h2>Order not found</h2>
        </div>
      </main>
    );
  }

  const isExpired = timeLeft !== null && timeLeft <= 0;
  const isComplete = order.status === "complete";
  const isPayable = !isComplete && !isExpired && Boolean(currentUser);

  const onToken = (token, tokenErrors) => {
    if (tokenErrors) {
      setCardErrors(tokenErrors);
      return;
    }
    setCardErrors([]);
    doRequest({ token });
  };

  return (
    <main className="page-shell">
      <section className="detail-card">
        <p className="eyebrow">Order</p>
        <h1>{order.ticket.title}</h1>
        <p className="price-tag">${order.ticket.price}</p>

        <p className="muted">
          Status: <strong>{order.status}</strong>
        </p>

        {isComplete ? (
          <p className="muted">This order has been paid.</p>
        ) : isExpired ? (
          <p className="muted">This order has expired.</p>
        ) : (
          <p className="timer">
            Time left to pay: <strong>{formatTimeLeft(timeLeft)}</strong>
          </p>
        )}

        {isPayable ? (
          <PaymentForm
            onToken={onToken}
            errors={[...cardErrors, ...errors]}
            isLoading={isLoading}
          />
        ) : null}
      </section>
    </main>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  try {
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
  } catch (err) {
    return { order: null };
  }
};
