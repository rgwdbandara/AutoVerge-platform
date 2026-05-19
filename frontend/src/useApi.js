import { useAuth } from "@clerk/clerk-react";

const useApi = () => {
  const { getToken } = useAuth();

  const fetchWithAuth = async (url, options = {}) => {
    const token = await getToken();

    return fetch(`http://localhost:5100${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return fetchWithAuth;
};

export default useApi;