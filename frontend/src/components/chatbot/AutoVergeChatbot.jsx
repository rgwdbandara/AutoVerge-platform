/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  X,
  Loader2,
  MessageCircle,
} from "lucide-react";

function AutoVergeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi 👋 I'm AutoVerge Assistant. How can I help you today?",
      vehicles: [],
    },
  ]);

  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  const handleQuickPrompt = async (prompt) => {
    if (loading) return;

    const userMessage = {
      role: "user",
      text: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5103/api/chatbot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: prompt,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.reply,
          vehicles: data.vehicles || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5103/api/chatbot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: currentMessage,
          }),
        }
      );

      const data = await response.json();

      const fallbackHelpful = `I can help with:\n• Car recommendations\n• EMI calculations\n• Vehicle comparisons\n• Buying tips\n• EV news\n\nExamples:\n- Best SUV under 15 million\n- Aqua vs Fit\n- EMI for 12 million car`;

      const botText =
        (data && typeof data.reply === 'string' && data.reply.trim())
          ? data.reply
          : (data && data.reply && data.reply.text) || fallbackHelpful;

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: botText,
          vehicles: data.vehicles || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 flex items-center justify-center text-white transition-all bg-blue-600 rounded-full shadow-2xl bottom-4 right-4 h-14 w-14 hover:scale-105 hover:bg-blue-700 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[70vh] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl sm:bottom-28 sm:right-6 sm:h-[600px] sm:w-[360px] sm:rounded-[2rem]">

          {/* HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 text-white bg-slate-950 sm:px-5 sm:py-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
              <Bot size={20} />
            </div>

            <div>
              <h2 className="font-bold">
                AutoVerge Assistant
              </h2>
              <p className="text-xs text-slate-300">
                AI Vehicle Support
              </p>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 px-3 py-4 space-y-4 overflow-y-auto bg-slate-50 sm:px-4 sm:py-5">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-3 text-sm leading-6 shadow-sm sm:max-w-[80%] sm:px-4 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-slate-800 rounded-bl-md border border-slate-200"
                  }`}
                >
                  {msg.text}

                  {msg.vehicles && msg.vehicles.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {msg.vehicles.map((car) => (
                        <div
                          key={car._id}
                          className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200"
                        >
                          <img
                            src={car.images?.[0]?.url}
                            alt={car.title}
                            className="object-cover w-full h-32"
                          />

                          <div className="p-3">
                            <h3 className="text-sm font-bold text-slate-900">
                              {car.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {car.brand} • {car.bodyType}
                            </p>

                            <p className="mt-2 text-sm font-bold text-blue-600">
                              Rs. {Number(car.price).toLocaleString()}
                            </p>

                            <button
                              onClick={() =>
                                window.location.href = `/cars/${car._id}`
                              }
                              className="w-full py-2 mt-3 text-sm font-semibold text-white transition rounded-xl bg-slate-950 hover:bg-slate-800"
                            >
                              View Vehicle
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 px-4 py-3 text-sm bg-white border rounded-2xl border-slate-200">
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  <div className="flex items-center gap-3">

  <div className="flex gap-1">
    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>

    <span
      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
      style={{ animationDelay: "0.15s" }}
    ></span>

    <span
      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
      style={{ animationDelay: "0.3s" }}
    ></span>
  </div>

  <span className="text-sm text-slate-600">
    AutoVerge Assistant is typing...
  </span>

</div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 bg-white border-t border-slate-200 sm:p-4">
            <div className="flex items-center gap-2">

              <input
                type="text"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Ask something..."
                className="flex-1 px-4 py-3 text-sm border outline-none rounded-2xl border-slate-200 focus:border-blue-500"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="flex items-center justify-center w-12 h-12 text-white transition bg-blue-600 rounded-2xl hover:bg-blue-700 disabled:opacity-60"
              >
                <Send size={18} />
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AutoVergeChatbot;