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
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg transition-all hover:bg-gray-700 hover:shadow-xl border border-gray-600"
          aria-label="Open assembly assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col bg-gray-900 border border-gray-700 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-700 p-4 bg-gray-800">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-gray-300" />
              <div>
                <h3 className="font-semibold text-white">Assembly Assistant</h3>
                <p className="text-xs text-gray-400">
                  Step {currentStep + 1}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-gray-900">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-gray-700 text-white border border-gray-600"
                      : "bg-gray-800 text-gray-100 border border-gray-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 animation-delay-200"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 animation-delay-400"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-700 p-4 bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about this step..."
                className="flex-1 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="h-10 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

