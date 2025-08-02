"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { AnimationMessage } from "./animation-message";
import type { AnimationMessage as AnimationMessageType } from "@/lib/types";
import { motion } from "framer-motion";

const LOADING_MESSAGES = [
  "Analyzing your request...",
  "Writing code...",
  "Setting up environment...",
  "Spinning up animations...",
  "Rendering visualization...",
  "Adding final touches...",
  "Almost ready...",
];

export function Chat() {
  const [messages, setMessages] = useState<AnimationMessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
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

  // Cycle through loading messages
  useEffect(() => {
    if (!isLoading) return;

    let messageIndex = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

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
      // Step 1: Call generate to get job_id
      const response = await fetch(`${backendUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      const jobId = data.job_id;

      if (!jobId) throw new Error("No job ID returned from server");

      // Step 2: Poll the status endpoint every 3 seconds
      const pollAnimationUrl = async (): Promise<string> => {
        while (true) {
          const statusRes = await fetch(`${backendUrl}/status/${jobId}`);
          if (!statusRes.ok)
            throw new Error(`Status check failed: ${statusRes.status}`);

          const statusData = await statusRes.json();

          if (statusData.status === "complete" && statusData.url) {
            return statusData.url; // done
          } else if (statusData.status === "failed") {
            throw new Error("Animation generation failed");
          }

          // else: pending or running, wait 3 seconds and retry
          await new Promise((r) => setTimeout(r, 10000));
        }
      };

      const animationUrl = await pollAnimationUrl();

      // Step 3: Add assistant message with animation URL
      const assistantMessage: AnimationMessageType = {
        id: Date.now().toString(),
        role: "assistant",
        content: animationUrl,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error generating animation:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to generate animation")
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
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
                Describe what you want to see, and I'll create an amazing
                animation for you:
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>"A butterfly flying through a magical forest"</li>
                <li>"A rocket launching into space with stars"</li>
                <li>"A character dancing in the rain"</li>
                <li>"A dragon soaring over mountains"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <AnimationMessage key={message.id} message={message} />
          ))
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-gray-100 rounded-2xl px-6 py-4 max-w-xs border">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-6 h-6 border-4 border-gray-300 border-t-gray-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div>
                  <motion.p
                    key={loadingMessage}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-gray-600 font-medium"
                  >
                    {loadingMessage}
                  </motion.p>
                  <div className="flex space-x-1 mt-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2 text-sm text-red-500 bg-red-50 border-t"
        >
          {error.message || "An error occurred. Please try again."}
        </motion.div>
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
            placeholder="Describe your animation idea..."
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
