"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import type { AnimationMessage as AnimationMessageType } from "@/lib/types"

export function AnimationMessage({ message }: { message: AnimationMessageType }) {
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

    // Default to video if we can't determine
    return "video"
  }

  const mediaType = isUrl ? getMediaType(message.content) : null

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={cn("mb-4 flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn("max-w-[80%] rounded-lg px-4 py-2", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}
      >
        {isUrl ? (
          <div className="flex flex-col items-center">
            <p className="mb-2">✨ Your animation is ready!</p>

            {isLoading && (
              <div className="flex items-center justify-center h-40 w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}

            {mediaType === "video" && (
              <video
                src={message.content}
                controls
                autoPlay
                loop
                className={cn("max-w-full rounded-md", isLoading ? "hidden" : "block")}
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
                className={cn("max-w-full rounded-md", isLoading ? "hidden" : "block")}
                style={{ maxHeight: "300px" }}
                onLoad={handleLoad}
              />
            )}

            {mediaType === "image" && (
              <img
                src={message.content || "/placeholder.svg"}
                alt="Generated image"
                className={cn("max-w-full rounded-md", isLoading ? "hidden" : "block")}
                style={{ maxHeight: "300px" }}
                onLoad={handleLoad}
              />
            )}

            <a
              href={message.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 text-sm"
            >
              Open in new tab
            </a>
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  )
}
