import { useState } from "react";

export default function useRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const doRequest = async (props = {}) => {
    setErrors([]);
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: method === "get" ? undefined : JSON.stringify({ ...body, ...props }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(data.errors || [{ message: "Something went wrong" }]);
        return null;
      }

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (err) {
      setErrors([{ message: "Could not reach the server" }]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { doRequest, errors, isLoading };
}
