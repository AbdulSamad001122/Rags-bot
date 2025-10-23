import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function ChatPage({ botName }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [streamedResponse, setStreamedResponse] = useState("");
  const [currentBotMessageId, setCurrentBotMessageId] = useState(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedResponse]);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSend = async () => {
    if (!text.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: "user",
      time: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setText("");
    setLoading(true);
    setStreamedResponse("");
    setCurrentBotMessageId(Date.now() + 1);

    try {

      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      // Use streaming endpoint for better user experience
      const response = await fetch(`${backendUrl}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
          userNamespace: botName,
        }),
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                // Add new content to accumulated response
                accumulatedResponse += data.content;
                setStreamedResponse(accumulatedResponse);
              }
              if (data.done) {
                // Add final message to messages array
                const botMessage = {
                  id: currentBotMessageId,
                  text: accumulatedResponse || "No response",
                  sender: "bot",
                  time: formatTime(new Date()),
                };
                setMessages((prev) => [...prev, botMessage]);
                setStreamedResponse("");
                setCurrentBotMessageId(null);
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              console.error("Error parsing stream data:", e);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = {
        id: currentBotMessageId,
        text: "Sorry, something went wrong. Please try again.",
        sender: "bot",
        time: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamedResponse("");
      setCurrentBotMessageId(null);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">{botName}</h1>
        <p className="text-gray-400 text-sm">Ask me anything</p>
      </div>


      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && !streamedResponse && (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Start a conversation!</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700/50 text-gray-100"
                }`}
              >
                {message.sender === "user" ? (
                  <p className="text-sm leading-relaxed break-words">
                    {message.text}
                  </p>
                ) : (
                  <div className="text-sm leading-relaxed break-words prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-100 prose-strong:text-white prose-em:text-gray-200 prose-code:bg-gray-800 prose-code:text-red-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800 prose-pre:p-4 prose-li:my-1 prose-a:text-blue-400 prose-a:hover:text-blue-300">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                )}
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-200"
                      : "text-gray-400"
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}

          {/* Streaming response display */}
          {streamedResponse && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-gray-700/50 text-gray-100">
                <div className="text-sm leading-relaxed break-words prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-100 prose-strong:text-white prose-em:text-gray-200 prose-code:bg-gray-800 prose-code:text-red-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800 prose-pre:p-4 prose-li:my-1 prose-a:text-blue-400 prose-a:hover:text-blue-300">
                  <ReactMarkdown>{streamedResponse}</ReactMarkdown>
                  <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                </div>
                <p className="text-xs mt-1 text-gray-400">
                  {formatTime(new Date())}
                </p>
              </div>
            </div>
          )}

          {loading && !streamedResponse && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-gray-700/50">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="bg-gray-800/30 backdrop-blur-sm border-t border-gray-700/50 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 shadow-2xl p-2">
            <div className="flex items-end gap-3 px-4 py-2">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything"
                disabled={loading}
                className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none min-h-[24px] max-h-[200px] overflow-y-auto disabled:opacity-50"
                rows={1}
                style={{ lineHeight: "1.5" }}
              />
              <button
                onClick={handleSend}
                disabled={!text.trim() || loading}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}