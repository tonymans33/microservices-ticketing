import "../styles/globals.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

export default function App({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </>
  );
}

App.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);

  let currentUser = null;
  try {
    const { data } = await client.get("/api/users/currentuser");
    currentUser = data.currentUser;
  } catch (err) {
    currentUser = null;
  }

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      currentUser
    );
  }

  return { pageProps, currentUser };
};
