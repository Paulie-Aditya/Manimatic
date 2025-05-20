"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { AnimationMessage } from "./animation-message";
import type { AnimationMessage as AnimationMessageType } from "@/lib/types";

export function Chat() {
  const [messages, setMessages] = useState<AnimationMessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Get backend URL from environment variable
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: AnimationMessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Call the backend API
      const response = await fetch(`${backendUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      console.log(data.url);
      // Add assistant message with the animation URL
      const assistantMessage: AnimationMessageType = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          data.url ||
          "Sorry, I couldn't generate an animation for that prompt.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error generating animation:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to generate animation")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-[70vh] bg-white rounded-lg border shadow-sm">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">Welcome to Manimatic</h3>
              <p className="text-sm text-gray-500">
                Describe what you want to see, and I'll generate an animation
                for you:
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>"What is a Neural Network?"</li>
                <li>"Visualize Binary Search Algorithm"</li>
                <li>"Explain Integration to me"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <AnimationMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="p-2 text-sm text-red-500 bg-red-50">
          {error.message || "An error occurred. Please try again."}
        </div>
      )}

      <div className="border-t p-4">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex items-center space-x-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the animation you want..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
