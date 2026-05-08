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

  const quickPrompts = [
    "Show me SUVs",
    "Toyota vehicles",
    "Hybrid cars",
    "Cars under 10",
    "Recommend a family car",
  ];

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
        "http://localhost:5003/api/chatbot",
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
        "http://localhost:5003/api/chatbot",
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

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            data.reply ||
            "Sorry, I couldn't process your request.",
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
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-all hover:scale-105 hover:bg-blue-700 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[70vh] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl sm:bottom-28 sm:right-6 sm:h-[600px] sm:w-[360px] sm:rounded-[2rem]">

          {/* HEADER */}
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 text-white sm:px-5 sm:py-4">
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
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-3 py-4 sm:px-4 sm:py-5">

            <div className="flex flex-wrap gap-2 mb-4">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm transition hover:border-blue-200 hover:bg-blue-50 sm:px-4"
                >
                  {prompt}
                </button>
              ))}
            </div>

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
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
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
                              className="mt-3 w-full rounded-xl bg-slate-950 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
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
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
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
          <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
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
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-60"
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