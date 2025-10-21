// import { useState, useRef, useEffect } from "react";
// import { Send } from "lucide-react";
// import axios from "axios";

// export default function AutoExpandInput() {
//   const [text, setText] = useState("");
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height =
//         textareaRef.current.scrollHeight + "px";
//     }
//   }, [text]);

//   const handleSend = async () => {
//     if (text.trim()) {
//       console.log("Sending message:", text);
//       setText("");
//     }

//     try {
//       const res = await axios.post("http://localhost:3000/chat", {
//         question: text,
//         userNamespace: "samad",
//       });

//       console.log("Response:", res.data);
//     } catch (error) {}
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-3xl">
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 shadow-2xl p-2">
//           <div className="flex items-end gap-3 px-4 py-2">
//             <textarea
//               ref={textareaRef}
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask anything"
//               className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none min-h-[24px] max-h-[200px] overflow-y-auto"
//               rows={1}
//               style={{ lineHeight: "1.5" }}
//             />
//             <button
//               onClick={handleSend}
//               disabled={!text.trim()}
//               className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center"
//             >
//               <Send className="w-5 h-5 text-white" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import axios from "axios";

export default function ChatPage({ botName }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    try {
      const res = await axios.post("http://localhost:3000/chat", {
        question: text,
        userNamespace: botName,
      });

      console.log(res.data);

      const botMessage = {
        id: Date.now() + 1,
        text: res.data.response || "No response",
        sender: "bot",
        time: formatTime(new Date()),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, something went wrong. Please try again.",
        sender: "bot",
        time: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
          {messages.length === 0 && (
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
                <p className="text-sm leading-relaxed break-words">
                  {message.text}
                </p>
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

          {loading && (
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
