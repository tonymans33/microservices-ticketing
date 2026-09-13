import Link from "next/link";

export default function Header({ currentUser }) {
  return (
    <nav className="top-nav compact">
      <Link href="/" className="brand">
        Ticketing
      </Link>
      <div className="nav-links">
        {currentUser ? (
          <>
            <Link href="/orders">My orders</Link>
            <Link href="/tickets/new">Sell a ticket</Link>
            <Link href="/auth/signout">Sign out</Link>
          </>
        ) : (
          <>
            <Link href="/auth/signin">Sign in</Link>
            <Link href="/auth/signup" className="nav-cta">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
