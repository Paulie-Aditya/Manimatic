"use client";

import { motion } from "framer-motion";
import { User, Bot, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Message } from "@/lib/store";

interface ChatMessageProps {
  message: Message;
  index: number;
  onSelect?: (message: Message) => void;
}

export function ChatMessage({ message, index, onSelect }: ChatMessageProps) {
  const isUser = message.role === "user";

  const handleViewCanvas = () => {
    if (onSelect && message.animationData) {
      onSelect(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start space-x-3`}
      >
        {/* Avatar */}
        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 ml-3"
              : "bg-gradient-to-r from-gray-900 to-black border border-gray-800 mr-3"
          }`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {isUser ? (
            <User className="h-4 w-4 text-gray-400" />
          ) : (
            <Bot className="h-4 w-4 text-gray-500" />
          )}
        </motion.div>

        {/* Message content */}
        <div className="flex-1 space-y-3">
          {/* Main message bubble */}
          <motion.div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 border border-gray-700"
                : "bg-gradient-to-r from-gray-900 to-black text-gray-400 border border-gray-800"
            }`}
            whileHover={{ scale: 1.01, y: -1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-sm leading-relaxed">
              {isUser
                ? message.content
                : message.animationData?.explanation || message.content}
            </p>
          </motion.div>

          {/* Canvas preview button for assistant messages with animation data */}
          {!isUser && message.animationData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewCanvas}
                  className="bg-gray-900/50 border-gray-800 text-gray-400 hover:bg-gray-800 hover:border-gray-700 hover:text-gray-300"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Animation & Code
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
