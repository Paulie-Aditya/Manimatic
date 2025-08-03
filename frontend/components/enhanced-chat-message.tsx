"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Bot, Code, Play, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Message } from "@/lib/store";
import { useState } from "react";

interface EnhancedChatMessageProps {
  message: Message;
  index: number;
}

export function EnhancedChatMessage({
  message,
  index,
}: EnhancedChatMessageProps) {
  const isUser = message.role === "user";
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleCopyCode = async () => {
    if (message.animationData?.code) {
      await navigator.clipboard.writeText(message.animationData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Determine media type based on URL extension
  const getMediaType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (extension === "mp4" || extension === "webm" || extension === "mov") {
      return "video";
    } else if (extension === "gif") {
      return "gif";
    } else if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png" ||
      extension === "webp"
    ) {
      return "image";
    }
    return "video";
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
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      <div
        className={`flex max-w-[85%] ${
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
          {/* User message or explanation */}
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

          {/* Canvas section for assistant messages with animation data */}
          {!isUser && message.animationData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/60 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden"
            >
              {/* Canvas header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-3 text-sm text-gray-400 font-medium">
                    {showCode ? "Code" : "Animation"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {message.animationData.code && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCode(!showCode)}
                        className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 h-8"
                      >
                        {showCode ? (
                          <Play className="h-4 w-4 mr-1" />
                        ) : (
                          <Code className="h-4 w-4 mr-1" />
                        )}
                        {showCode ? "View" : "Code"}
                      </Button>
                    </motion.div>
                  )}

                  {showCode && message.animationData.code && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyCode}
                        className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 h-8"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Canvas content */}
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {showCode ? (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-950 rounded-lg p-4 border border-gray-800"
                    >
                      <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                        <code>{message.animationData.code}</code>
                      </pre>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="animation"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      {isLoading && message.animationData.url && (
                        <div className="flex items-center justify-center h-64 w-full bg-black rounded-lg border border-gray-800">
                          <motion.div
                            className="w-8 h-8 border-4 border-gray-800 border-t-gray-600 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          />
                        </div>
                      )}

                      {message.animationData.url && (
                        <>
                          {getMediaType(message.animationData.url) ===
                            "video" && (
                            <video
                              src={message.animationData.url}
                              controls
                              autoPlay
                              loop
                              className={`max-w-full rounded-lg border border-gray-800 ${
                                isLoading ? "hidden" : "block"
                              }`}
                              style={{ maxHeight: "400px" }}
                              onLoadedData={handleLoad}
                            >
                              Your browser does not support the video tag.
                            </video>
                          )}

                          {getMediaType(message.animationData.url) ===
                            "gif" && (
                            <img
                              src={
                                message.animationData.url || "/placeholder.svg"
                              }
                              alt="Generated animation"
                              className={`max-w-full rounded-lg border border-gray-800 ${
                                isLoading ? "hidden" : "block"
                              }`}
                              style={{ maxHeight: "400px" }}
                              onLoad={handleLoad}
                            />
                          )}

                          {getMediaType(message.animationData.url) ===
                            "image" && (
                            <img
                              src={
                                message.animationData.url || "/placeholder.svg"
                              }
                              alt="Generated image"
                              className={`max-w-full rounded-lg border border-gray-800 ${
                                isLoading ? "hidden" : "block"
                              }`}
                              style={{ maxHeight: "400px" }}
                              onLoad={handleLoad}
                            />
                          )}

                          <motion.a
                            href={message.animationData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-sm text-gray-500 hover:text-gray-400 underline transition-colors duration-200 mt-3"
                            whileHover={{ scale: 1.05 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            Open in new tab
                          </motion.a>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
