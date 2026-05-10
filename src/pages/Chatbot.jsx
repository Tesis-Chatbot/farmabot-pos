import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  MoreVertical,
  Phone,
  Video,
  Search,
  CheckCheck,
  Paperclip,
  Smile,
} from "lucide-react";

export default function ChatReal() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "¡Hola! Soy tu asistente virtual de Farmacia. ¿En qué puedo ayudarte hoy?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Verificar conexión con Rasa
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(
          "http://localhost:5005",
        );
        if (response.ok) {
          setIsConnected(true);
          console.log("✅ Conectado a Rasa");
        }
      } catch (error) {
        setIsConnected(false);
        console.log("❌ Rasa no disponible");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendToRasa = async (message) => {
  setIsTyping(true);
  try {
    // Usar el endpoint de mensajes de la API (no el execute)
    const response = await fetch(
      "http://127.0.0.1:5005/webhooks/rest/webhook",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "session_user_123",
          message: message,
        }),
        mode: 'cors', // Importante para CORS
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("📩 Respuesta:", data);
      
      if (Array.isArray(data)) {
        data.forEach(msg => {
          if (msg.text) {
            setMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              sender: "bot",
              text: msg.text,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }]);
          }
        });
      }
    } else {
      // Si falla el webhook, intentar con el endpoint alternativo
      throw new Error(`Error ${response.status}`);
    }
  } catch (error) {
    console.log("Intentando endpoint alternativo...");
    
    // Plan B: Usar el endpoint de conversaciones que ya funciona
    try {
      const altResponse = await fetch(
        "http://127.0.0.1:5005/conversations/session_user_123/respond",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: message,
          }),
        }
      );
      
      if (altResponse.ok) {
        const altData = await altResponse.json();
        console.log("📩 Respuesta alternativa:", altData);
        
        // Procesar respuesta
        if (altData.text) {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: "bot",
            text: altData.text,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }]);
        }
      }
    } catch (altError) {
      console.error("Error en ambos endpoints:", altError);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "bot",
        text: "Lo siento, hubo un error de comunicación. ¿Puedes intentarlo de nuevo?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }]);
    }
  } finally {
    setIsTyping(false);
  }
};

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    sendToRasa(input);
    setInput("");
  };

  return (
    <div className="h-screen bg-[#f0f2f5] p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl h-[85vh] bg-white rounded-[3rem] shadow-2xl flex overflow-hidden border border-slate-100">
        {/* SIDEBAR DE CONTACTOS */}
        <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50 hidden md:flex">
          <div className="p-6 bg-white flex justify-between items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic">
              FP
            </div>
            <div className="flex gap-4 text-slate-400">
              <Search size={20} />
              <MoreVertical size={20} />
            </div>
          </div>
          <div className="p-4">
            <div className="bg-blue-600 p-4 rounded-[2rem] text-white shadow-lg shadow-blue-200 flex items-center gap-4 cursor-pointer">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot size={24} />
              </div>
              <div>
                <p className="font-black text-sm">Asistente IA</p>
                <p className="text-[10px] text-blue-100 uppercase font-bold tracking-widest">
                  {isConnected ? "En línea" : "Desconectado"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DE CHAT */}
        <div className="flex-1 flex flex-col bg-[#fdfeff]">
          {/* Header del Chat */}
          <header className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600 border-2 border-blue-50">
                  <Bot size={28} />
                </div>
                {/* Indicador de conexión real */}
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                ></div>
              </div>
              <div>
                <h3 className="font-black text-slate-800 tracking-tight">
                  FarmaBot <span className="text-blue-600">v3.0</span>
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Protocolo de Respuesta IA
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-slate-300">
              <Phone
                size={20}
                className="hover:text-blue-600 cursor-pointer transition-colors"
              />
              <Video
                size={20}
                className="hover:text-blue-600 cursor-pointer transition-colors"
              />
              <MoreVertical size={20} />
            </div>
          </header>

          {/* CONTENEDOR DE MENSAJES */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "bot" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] p-5 rounded-[2rem] shadow-sm relative ${
                    m.sender === "bot"
                      ? "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                      : "bg-blue-600 text-white rounded-tr-none shadow-blue-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {m.text}
                  </p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-2 ${m.sender === "user" ? "text-blue-200" : "text-slate-300"}`}
                  >
                    <span className="text-[10px] font-bold uppercase">
                      {m.time}
                    </span>
                    {m.sender === "user" && <CheckCheck size={14} />}
                  </div>
                </div>
              </div>
            ))}

            {/* Indicador de carga (Escribiendo...) */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* BARRA DE ENTRADA */}
          <footer className="p-6 bg-white border-t border-slate-50">
            <div className="bg-slate-50 rounded-[2.5rem] p-2 flex items-center gap-2 border border-slate-100 focus-within:border-blue-300 focus-within:bg-white transition-all">
              <button className="p-3 text-slate-400 hover:text-blue-600">
                <Smile size={22} />
              </button>
              <button className="p-3 text-slate-400 hover:text-blue-600">
                <Paperclip size={22} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu duda sobre folios o promociones..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-600 placeholder:text-slate-300"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-blue-600 text-white p-4 rounded-3xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 disabled:bg-slate-300 disabled:shadow-none transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
