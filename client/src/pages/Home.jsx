import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import CreateEvent from "../components/CreateEvents";

function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Redirect unauthenticated users to the login page immediately
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

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data.data || []);
    } catch (error) {
      console.log("Error while retrieving data:", error);
      // Clear local state on error to prevent displaying incorrect data
      setEvents([]);

      // Logout if the server returns a 401
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen flex text-center items-center justify-center bg-slate-200 p-4">
      <div className="w-full max-w-2xl bg-pink-500 p-10 rounded-3xl shadow-2xl text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Welcome to the Event Dashboard
        </h1>

        <CreateEvent onEventCreated={fetchEvents} />

        <div className="bg-white px-5 py-8 rounded-2xl m-5">
          <h2 className="text-2xl text-yellow-400 font-extrabold mb-5">
            Upcoming Events
          </h2>
          {events.length > 0 ? (
            <ul className="space-y-4">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="text-left p-4 font-bold border-2 border-pink-700 bg-slate-50 rounded-xl"
                >
                  <div>{event.title}</div>
                  <p>{event.description}</p>
                  <div>
                    {event.event_date
                      ? new Date(event.event_date).toLocaleDateString()
                      : "Date not provided"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No events found</p>
          )}
        </div>

        <button
          className="px-10 py-4 bg-white hover:bg-red-600 text-pink-600 font-bold rounded-2xl shadow-md w-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
