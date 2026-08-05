import { useState } from "react";
import API_URL from "../config";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      email,
      message
    };

    try {
      const response = await fetch(`${API_URL}/api/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("Your message has been sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 bg-transparent">
      <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-3xl border border-purple-900/50 bg-slate-900/80 p-8 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Contact the gallery</h1>
          <p className="mt-2 text-sm text-purple-200/80">Send a message for commissions, questions, or just to say hello.</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-100 placeholder:text-slate-400 bg-slate-950"
          />

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-100 placeholder:text-slate-400 bg-slate-950"
          />

          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            required
            className="w-full px-4 py-2.5 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-100 placeholder:text-slate-400 bg-slate-950 resize-none"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-indigo-500 hover:to-purple-500"
        >
          Send message
        </button>

        {status && (
          <p className="mt-4 text-sm text-purple-200">{status}</p>
        )}
      </form>
    </div>
  );
}

export default Contact