import { useState, useCallback } from "react";

export const useHttp = () => {
  const [process, setProcess] = useState("waiting"); //FSM ожидание

  const request = useCallback(
    async (
      url,
      method = "GET",
      body = null,
      headers = { "Content-Type": "application/json" }
    ) => {
      setProcess("loading");

      try {
        const response = await fetch(url, { method, body, headers });

        if (!response.ok) {
          throw new Error(`Coult not fetch ${url}, status: ${response.status}`);
        }

        const data = await response.json();

        return data;
      } catch (e) {
        setProcess("error");
        throw e;
      }
      // eslint-disable-next-line
    },
    []
  );

  const clearError = useCallback(() => {
    setProcess("loading");
    // eslint-disable-next-line
  }, []);

  return { request, clearError, process, setProcess };
};
