import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen flex text-center items-center justify-center bg-slate-200 p-4">
        <div className="w-full max-w-2xl bg-pink-500 p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Welcome to the Event Dashboard!!!!!!!!!!!!
          </h1>

          <button
            className="px-10 py-4 bg-white hover:bg-red-600 text-pink-600 font-bold rounded-2xl shadow-md w-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
