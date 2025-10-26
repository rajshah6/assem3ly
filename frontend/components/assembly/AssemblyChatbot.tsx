"use client";

import { useState, useRef, useEffect } from "react";
import { Card, Button } from "@components/ui/primitives";
import { Send, MessageCircle, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AssemblyChatbotProps {
  manualId: string;
  currentStep: number;
  stepData: {
    title: string;
    description: string;
    parts?: Array<{ name: string; quantity: number }>;
    tools?: string[];
  };
}

export function AssemblyChatbot({ manualId, currentStep, stepData }: AssemblyChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm here to help with your assembly manual. Ask me anything about this step!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastStepRef = useRef(currentStep);

  // Reset chat when step changes (Option A)
  useEffect(() => {
    if (lastStepRef.current !== currentStep) {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm here to help with your TOMMARYD assembly. Ask me anything about this step!",
        },
      ]);
      lastStepRef.current = currentStep;
    }
  }, [currentStep]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assembly-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          currentStep: currentStep + 1, // Display step number (1-indexed)
          stepData: stepData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Non-streaming response
      const data = await response.json();
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl border border-gray-700 hover:border-gray-500 group"
          aria-label="Open assembly assistant"
        >
          <MessageCircle className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[400px] flex-col bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 rounded-2xl shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-600 p-5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Assembly Assistant</h3>
                <p className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded-full">
                  Step {currentStep + 1}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-5 bg-gradient-to-b from-gray-900 to-gray-800">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border border-blue-500"
                      : "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 border border-gray-600"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 px-4 py-3 shadow-lg">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-600 p-5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-b-2xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about this step..."
                className="flex-1 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-blue-500"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send • Assembly help for step {currentStep + 1}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

