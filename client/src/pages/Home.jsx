import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import CreateEvent from "../components/CreateEvents";
import { toast } from "sonner";
import { FaTrash } from "react-icons/fa";

function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);

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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted successfully");

      fetchEvents();
    } catch (error) {
      console.log("Error deleting the events:", error);
      toast.error("Failed to delete the event");
    }
  };

  return (
    <div className="min-h-screen flex text-center items-center justify-center bg-slate-200 p-4">
      <div className="w-full max-w-2xl bg-pink-500 p-10 rounded-3xl shadow-2xl text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Welcome to the Event Dashboard
        </h1>

        <div className="bg-white px-5 py-8 rounded-2xl m-5">
          <h2 className="text-2xl text-yellow-400 font-extrabold mb-5">
            Upcoming Events
          </h2>

          <CreateEvent onEventCreated={fetchEvents} />

          {isLoading ? (
            <div className="flex flex-col items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-700 mb-2"></div>
              <p className="text-gray-500 font-bold">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <ul className="space-y-4">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="relative text-left p-4 font-bold border-2 border-pink-700 bg-slate-50 rounded-xl"
                >
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
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
