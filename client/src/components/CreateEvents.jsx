import { useState } from "react";
import api from "../api/axios";

function CreateEvent({ onEventCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketsAvailable, setTicketsAvailable] = useState(100);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const eventData = {
      title: title,
      description: description,
      event_date: date,
      location: location,
      ticket_price: ticketPrice,
      tickets_total: ticketsAvailable,
    };

    try {
      const response = await api.post("/events", eventData);

      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setTicketPrice(0);
      setTicketsAvailable(100);

      if (onEventCreated) {
        onEventCreated();
      }
      console.log("Event created successfully");
    } catch (error) {
      console.log("Error while creating event");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl">
      <h3 className="text-yellow-400">Add New Event</h3>
      <form
        className="flex flex-col space-y-4 m-4 border-2 border-pink-400"
        onSubmit={handleSubmit}
      >
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border-2 p-2 rounded-lg"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="number"
          placeholder="Price"
          value={ticketPrice}
          onChange={(e) => setTicketPrice(e.target.value)}
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="number"
          placeholder="Total Tickets"
          value={ticketsAvailable}
          onChange={(e) => setTicketsAvailable(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg p-3 "
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
