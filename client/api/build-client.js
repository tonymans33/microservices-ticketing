import axios from "axios";

export default function buildClient({ req }) {
  if (typeof window === "undefined") {
    // On the server: request through the ingress, forwarding the browser's
    // cookies and Host header so nginx routes to the right service.
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  }

  // In the browser: relative URLs go through the ingress already.
  return axios.create({ baseURL: "/" });
}
