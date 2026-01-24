import { useEffectOnce, useLocalStorage } from "react-use";
import { adminLogout } from "../../lib/api/AdminApi";
import { alertError } from "../../lib/alert";
import { useNavigate } from "react-router";

export default function AdminLogout() {
  const [token, setToken] = useLocalStorage("token", "");
  const navigate = useNavigate();

  async function handleLogout() {
    const response = await adminLogout(token);
    const responseBody = await response.json();
    console.log(responseBody);

    if (response.status === 200) {
      setToken("");
      await navigate({
        pathname: "/admin/login",
      });
    } else {
      await alertError(responseBody.message);
    }
  }

  useEffectOnce(() => {
    handleLogout().then(() => console.log("Admin berhasil logout"));
  });
  return <></>;
}
