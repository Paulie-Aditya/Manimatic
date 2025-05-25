"use client"

import { motion } from "framer-motion"
import { User, Bot } from "lucide-react"
import type { Message } from "@/lib/store"
import { useState } from "react"

interface ChatMessageProps {
  message: Message
  index: number
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user"
  const [isLoading, setIsLoading] = useState(true)

  // Check if the message content is a URL (for assistant messages)
  const isUrl = !isUser && message.content.startsWith("http")

  // Determine media type based on URL extension
  const getMediaType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase()

    if (extension === "mp4" || extension === "webm" || extension === "mov") {
      return "video"
    } else if (extension === "gif") {
      return "gif"
    } else if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "webp") {
      return "image"
    }

    return "video"
  }

  const mediaType = isUrl ? getMediaType(message.content) : null

  const handleLoad = () => {
    setIsLoading(false)
  }

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
      <div className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"} items-start space-x-3`}>
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
          {isUser ? <User className="h-4 w-4 text-gray-400" /> : <Bot className="h-4 w-4 text-gray-500" />}
        </motion.div>

        {/* Message content */}
        <motion.div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 border border-gray-700"
              : "bg-gradient-to-r from-gray-900 to-black text-gray-400 border border-gray-800"
          }`}
          whileHover={{ scale: 1.01, y: -1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isUrl ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">✨ Your visualization is ready</p>

              {isLoading && (
                <div className="flex items-center justify-center h-40 w-full bg-black rounded-lg border border-gray-800">
                  <motion.div
                    className="w-8 h-8 border-4 border-gray-800 border-t-gray-600 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </div>
              )}

              {mediaType === "video" && (
                <video
                  src={message.content}
                  controls
                  autoPlay
                  loop
                  className={`max-w-full rounded-lg border border-gray-800 ${isLoading ? "hidden" : "block"}`}
                  style={{ maxHeight: "300px" }}
                  onLoadedData={handleLoad}
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {mediaType === "gif" && (
                <img
                  src={message.content || "/placeholder.svg"}
                  alt="Generated animation"
                  className={`max-w-full rounded-lg border border-gray-800 ${isLoading ? "hidden" : "block"}`}
                  style={{ maxHeight: "300px" }}
                  onLoad={handleLoad}
                />
              )}

              {mediaType === "image" && (
                <img
                  src={message.content || "/placeholder.svg"}
                  alt="Generated image"
                  className={`max-w-full rounded-lg border border-gray-800 ${isLoading ? "hidden" : "block"}`}
                  style={{ maxHeight: "300px" }}
                  onLoad={handleLoad}
                />
              )}

              <motion.a
                href={message.content}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-gray-500 hover:text-gray-400 underline transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Open in new tab
              </motion.a>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message.content}</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
