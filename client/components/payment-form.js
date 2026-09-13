import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import ErrorList from "./error-list";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm({ onToken, errors, isLoading }) {
  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { token, error } = await stripe.createToken(
      elements.getElement(CardElement)
    );

    if (error) {
      onToken(null, [{ message: error.message }]);
      return;
    }

    onToken(token.id);
  };

  return (
    <form onSubmit={onSubmit} className="payment-form">
      <div className="card-element">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#172033",
                "::placeholder": { color: "#94a3b8" },
              },
            },
          }}
        />
      </div>

      <ErrorList errors={errors} />

      <button
        className="button primary full"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

export default function PaymentForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
