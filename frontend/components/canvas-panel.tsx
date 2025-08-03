"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Code, Play, Copy, Check, Maximize2 } from "lucide-react";
import { FormattedText } from "@/lib/text-formatter";
import type { Message } from "@/lib/store";
import { useState, useEffect } from "react";

interface CanvasPanelProps {
  message: Message;
  onClose: () => void;
}

export function CanvasPanel({ message, onClose }: CanvasPanelProps) {
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Reset loading state when message changes
  useEffect(() => {
    setIsLoading(true);
    setShowCode(false);
  }, [message.id]);

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

  const handleDownload = () => {
    if (message.animationData?.url) {
      const link = document.createElement("a");
      link.href = message.animationData.url;
      link.download = "animation";
      link.click();
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

  if (!message.animationData) return null;

  return (
    <div className="h-full bg-black/90 backdrop-blur-sm border-l border-gray-900 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/60"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-400 font-medium">
            {showCode ? "Generated Code" : "Animation Canvas"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {message.animationData.code && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

          {!showCode && message.animationData.url && (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 h-8"
                >
                  <Download className="h-4 w-4" />
                </Button> */}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    window.open(message.animationData?.url, "_blank")
                  }
                  className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 h-8"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 p-4 overflow-auto"
      >
        <AnimatePresence mode="wait">
          {showCode ? (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 h-full overflow-auto">
                {/* Check if code contains markdown formatting */}
                {message.animationData.code?.includes("```") ||
                message.animationData.code?.includes("**") ||
                message.animationData.code?.includes("*") ? (
                  <FormattedText
                    text={message.animationData.code}
                    className="text-sm text-gray-300 font-mono leading-relaxed"
                  />
                ) : (
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                    <code>{message.animationData.code}</code>
                  </pre>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="animation"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col items-center justify-center"
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
                <div className="w-full h-full flex items-center justify-center">
                  {getMediaType(message.animationData.url) === "video" && (
                    <video
                      src={message.animationData.url}
                      controls
                      autoPlay
                      loop
                      className={`max-w-full max-h-full rounded-lg border border-gray-800 ${
                        isLoading ? "hidden" : "block"
                      }`}
                      onLoadedData={handleLoad}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {getMediaType(message.animationData.url) === "gif" && (
                    <img
                      src={message.animationData.url || "/placeholder.svg"}
                      alt="Generated animation"
                      className={`max-w-full max-h-full rounded-lg border border-gray-800 ${
                        isLoading ? "hidden" : "block"
                      }`}
                      onLoad={handleLoad}
                    />
                  )}

                  {getMediaType(message.animationData.url) === "image" && (
                    <img
                      src={message.animationData.url || "/placeholder.svg"}
                      alt="Generated image"
                      className={`max-w-full max-h-full rounded-lg border border-gray-800 ${
                        isLoading ? "hidden" : "block"
                      }`}
                      onLoad={handleLoad}
                    />
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
