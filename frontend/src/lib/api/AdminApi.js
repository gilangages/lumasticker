export const adminLogin = async ({ email, password }) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const adminLogout = async (token) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/admin/logout`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
