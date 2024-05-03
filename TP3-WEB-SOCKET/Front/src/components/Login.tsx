import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebsocketContext } from "../contexts";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const socket = useContext(WebsocketContext);

  const navigate = useNavigate();

  const handleSetUsernameSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!username) return;
    const payload = { username };
    try {
      setLoading(true);
      setUsername("");
      const response = await axios.post(
        "http://localhost:3000/users/login",
        payload
      );
      const { data } = response;
      if (data) {
        socket.emit("login", { userId: data.id });
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/chat");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Choose your username
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSetUsernameSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Enter chat
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
