"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Brain, PanelLeftOpen } from "lucide-react"
import { useChatStore } from "@/lib/store"
import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "./chat-message"

const SUGGESTED_QUESTIONS = [
  "What is a Neural Network?",
  "Visualize Binary Search Algorithm",
  "Explain Integration to me",
  "How does Photosynthesis work?",
  "Show me Bubble Sort Algorithm",
  "What is Quantum Entanglement?",
]

interface ChatAreaProps {
  sidebarCollapsed: boolean
  onExpandSidebar: () => void
  onBackToLanding: () => void
}

export function ChatArea({ sidebarCollapsed, onExpandSidebar, onBackToLanding }: ChatAreaProps) {
  const { getCurrentChat, addMessage, currentChatId, createChat, setCurrentChat } = useChatStore()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentChat = getCurrentChat()
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ""

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentChat?.messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentChatId])

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return

    let chatId = currentChatId
    if (!chatId) {
      chatId = createChat()
      setCurrentChat(chatId)
    }

    // Add user message
    addMessage(chatId, {
      role: "user",
      content: message,
    })

    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(`${backendUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      addMessage(chatId, {
        role: "assistant",
        content: data.url || "Sorry, I couldn't generate an animation for that prompt.",
      })
    } catch (err) {
      console.error("Error generating animation:", err)
      addMessage(chatId, {
        role: "assistant",
        content: "Sorry, there was an error generating your animation. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSubmit(question)
  }

  // Show suggested questions if no chat or empty chat
  const showSuggestedQuestions = !currentChat || currentChat.messages.length === 0

  if (showSuggestedQuestions) {
    return (
      <motion.div
        className="h-full flex flex-col bg-gradient-to-br from-black via-gray-950 to-gray-900"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div
          className="border-b border-gray-900 p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            {sidebarCollapsed && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="mr-3"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExpandSidebar}
                  className="text-gray-500 hover:text-gray-300 hover:bg-gray-900 h-8 w-8 p-0"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
            {sidebarCollapsed && (
              <motion.div
                className="text-lg font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent cursor-pointer mr-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={onBackToLanding}
              >
                Manimatic
              </motion.div>
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-300">{currentChat ? currentChat.title : "New Chat"}</h1>
              <p className="text-sm text-gray-600">Choose a topic to get started</p>
            </div>
          </div>
        </motion.div>

        {/* Suggested Questions */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <motion.div
            className="text-center max-w-2xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Brain className="h-16 w-16 text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-300 mb-4">What would you like to explore?</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Ask me about any concept and I'll create an intelligent visualization to help you understand it better.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <motion.div
                  key={question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-left justify-start bg-gray-900/50 border-gray-800 text-gray-400 hover:bg-gray-800 hover:border-gray-700 hover:text-gray-300 p-4 h-auto"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      <span className="text-sm">{question}</span>
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Input area */}
        <motion.div
          className="border-t border-gray-900 p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(input)
            }}
            className="flex space-x-3"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about concepts or algorithms..."
              className="flex-1 bg-gray-900 border-gray-800 text-gray-300 placeholder-gray-600 focus:border-gray-700 focus:ring-gray-700"
              disabled={isLoading}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-black via-gray-950 to-gray-900">
      {/* Chat header */}
      <motion.div
        className="border-b border-gray-900 p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center">
          {sidebarCollapsed && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="mr-3"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onExpandSidebar}
                className="text-gray-500 hover:text-gray-300 hover:bg-gray-900 h-8 w-8 p-0"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
          {sidebarCollapsed && (
            <motion.div
              className="text-lg font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent cursor-pointer mr-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={onBackToLanding}
            >
              Manimatic
            </motion.div>
          )}
          <div>
            <h1 className="text-lg font-semibold text-gray-300 truncate">{currentChat.title}</h1>
            <p className="text-sm text-gray-600">{currentChat.messages.length} messages</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {currentChat.messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} index={index} />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-start"
          >
            <div className="bg-gray-900 rounded-2xl px-4 py-3 max-w-xs border border-gray-800">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gray-600 rounded-full"
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
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <motion.div
        className="border-t border-gray-900 p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(input)
          }}
          className="flex space-x-3"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about concepts or algorithms..."
            className="flex-1 bg-gray-900 border-gray-800 text-gray-300 placeholder-gray-600 focus:border-gray-700 focus:ring-gray-700"
            disabled={isLoading}
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 shadow-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}
