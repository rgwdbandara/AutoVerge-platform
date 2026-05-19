import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

export const useApi = () => {
  const { getToken } = useAuth();

  return useCallback(async (url, options = {}) => {
    const token = await getToken();

    const res = await fetch(`http://localhost:5100${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("API Error:", text);
      throw new Error("API request failed");
    }

    return res.json();
  }, [getToken]);
};