import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;
      console.log("User login details:", response.data.email);

      if (token) {
        localStorage.setItem("token", token);
        console.log("Login successfull, token saved");
        navigate("/");
      }
    } catch (error) {
      let message = "Login fail";
      if (error.response) {
        message = error.response.data.message;
      }
      alert(message);
    }
  }

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-pink-500 p-4 shadow-md rounded-lg max-w-md"
        >
          <div>
            <label>Email</label>
            <input
              className="p-2 mb-4 w-full border border-gray-300 text-center"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              className="p-2 mb-4 w-full border border-gray-300 text-center"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button className="bg-blue-500  p-2 px-8 rounded-xl w-full">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
