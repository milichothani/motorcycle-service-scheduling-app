// import React, { useState, useEffect, useRef } from "react";
// import { askMotorcycleAI } from "../services/geminiService";
// import { useOnlineStatus } from "../hooks/useOnlineStatus";
// import { AiIcon } from "./icons";
// const STORAGE_KEY = "mechanic_chat_history";
// useEffect(() => {
//   const saved = localStorage.getItem(STORAGE_KEY);
//   if (saved) setMessages(JSON.parse(saved));
// }, []);

// useEffect(() => {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
// }, [messages]);

// const TechSuggestions = () => {
//   const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const isOnline = useOnlineStatus();
//   const chatEndRef = useRef<HTMLDivElement | null>(null);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage = { role: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     const thinkingMessage = { role: "assistant", text: "•••" };
//     setMessages((prev) => [...prev, thinkingMessage]);

//     const response = await askMotorcycleAI(input);

//     // Replace typing bubbles with final response
//     setMessages((prev) =>
//       prev.map((msg, i) =>
//         i === prev.length - 1 ? { role: "assistant", text: response } : msg
//       )
//     );

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4 sm:p-6 flex flex-col h-[85vh]">

//       <h2 className="text-3xl font-bold text-center text-light mb-4">
//         Motorcycle AI Assistant
//       </h2>

//       {!isOnline && (
//         <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-500 text-yellow-300 rounded-md text-center">
//           You are offline. Connect to use AI.
//         </div>
//       )}

//       {/* Chat Window */}
//       <div className="flex-1 overflow-y-auto bg-gray-900/40 p-4 rounded-lg space-y-4 border border-gray-700">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.role === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`px-4 py-2 rounded-lg max-w-[75%] whitespace-pre-wrap ${
//                 msg.role === "user"
//                   ? "bg-primary-orange text-white"
//                   : "bg-gray-700 text-white"
//               }`}
//             >
//               {msg.text}
//             </div>
//           </div>
//         ))}

//         {/* Auto-scroll anchor */}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Row */}
//       <div className="mt-4 flex gap-3">
//         <input
//           type="text"
//           className="flex-1 p-3 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
//           placeholder="Ask something… e.g., Bike overheating at traffic?"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           disabled={!isOnline}
//         />

//         <button
//           onClick={sendMessage}
//           disabled={loading || !isOnline}
//           className="bg-primary-orange text-white px-5 rounded-md font-bold hover:opacity-90 disabled:bg-gray-500 flex items-center gap-2"
//         >
//           <AiIcon className="w-5 h-5" />
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TechSuggestions;
import React, { useState, useEffect, useRef } from "react";
import { askMotorcycleAI } from "../services/geminiService";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { AiIcon } from "./icons";

const STORAGE_KEY = "mechanic_chat_history";

const TechSuggestions = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const isOnline = useOnlineStatus();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 👉 Load chat history from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // 👉 Save chat history every time it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice input
  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice input.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setInput(text);
    };

    recognition.start();
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Add thinking bubble
    setMessages((prev) => [...prev, { role: "assistant", text: "•••" }]);

    const response = await askMotorcycleAI(input);

    // Replace last AI bubble with real answer
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === prev.length - 1 ? { role: "assistant", text: response } : msg
      )
    );

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 flex flex-col h-[85vh]">
      <h2 className="text-3xl font-bold text-center text-light mb-4">
        Motorcycle AI Assistant
      </h2>

      {!isOnline && (
        <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-500 text-yellow-300 rounded-md text-center">
          You are offline. Connect to use AI.
        </div>
      )}

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto bg-gray-900/40 p-4 rounded-lg border border-gray-700 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[75%] whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary-orange text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Row */}
      <div className="mt-4 flex gap-3 items-center">
        
        {/* 🎤 Voice Input Button */}
        <button
          onClick={startVoiceInput}
          className="bg-gray-700 text-white p-3 rounded-md hover:bg-gray-600"
        >
          🎤
        </button>

        <input
          type="text"
          className="flex-1 p-3 bg-gray-800 border border-gray-600 text-white rounded-md
            focus:outline-none focus:ring-2 focus:ring-primary-orange"
          placeholder="Ask something… e.g., Bike overheating at traffic?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!isOnline}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !isOnline}
          className="bg-primary-orange text-white px-5 py-3 rounded-md font-bold
            hover:opacity-90 disabled:bg-gray-500 flex items-center gap-2"
        >
          <AiIcon className="w-5 h-5" />
          Send
        </button>
      </div>
    </div>
  );
};

export default TechSuggestions;
