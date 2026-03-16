import { useAuth } from "@clerk/clerk-react";

export const useApi = () => {
  const { getToken } = useAuth();

  const request = async (url, options = {}) => {
    const token = await getToken();

    const res = await fetch(`http://localhost:5003${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    return res.json();
  };

  return request;
};