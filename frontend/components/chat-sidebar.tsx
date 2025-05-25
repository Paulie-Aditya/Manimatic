"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MessageSquare, Trash2, MoreHorizontal, Edit3, PanelLeftClose, Check, X } from "lucide-react"
import { useChatStore } from "@/lib/store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { useState, useRef, useEffect } from "react"

interface ChatSidebarProps {
  onCollapse: () => void
  onBackToLanding: () => void
}

export function ChatSidebar({ onCollapse, onBackToLanding }: ChatSidebarProps) {
  const { chats, currentChatId, createChat, setCurrentChat, deleteChat, updateChatTitle } = useChatStore()
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [editingChat, setEditingChat] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingChat && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingChat])

  const handleNewChat = () => {
    const newChatId = createChat()
    setCurrentChat(newChatId)
  }

  const handleChatMouseEnter = (chatId: string) => {
    setHoveredChat(chatId)
  }

  const handleChatMouseLeave = (chatId: string) => {
    if (openDropdown !== chatId && editingChat !== chatId) {
      setHoveredChat(null)
    }
  }

  const handleDropdownOpenChange = (open: boolean, chatId: string) => {
    if (open) {
      setOpenDropdown(chatId)
      setHoveredChat(chatId)
    } else {
      setOpenDropdown(null)
      setHoveredChat(null)
    }
  }

  const startEditing = (chatId: string, currentTitle: string) => {
    setEditingChat(chatId)
    setEditTitle(currentTitle)
    setOpenDropdown(null)
  }

  const saveEdit = () => {
    if (editingChat && editTitle.trim()) {
      updateChatTitle(editingChat, editTitle.trim())
    }
    setEditingChat(null)
    setEditTitle("")
    setHoveredChat(null)
  }

  const cancelEdit = () => {
    setEditingChat(null)
    setEditTitle("")
    setHoveredChat(null)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit()
    } else if (e.key === "Escape") {
      cancelEdit()
    }
  }

  return (
    <motion.div
      className="h-full bg-black/90 backdrop-blur-sm border-r border-gray-900 flex flex-col"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-900">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="text-xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={onBackToLanding}
          >
            Manimatic
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onCollapse}
              className="text-gray-500 hover:text-gray-300 hover:bg-gray-900 h-8 w-8 p-0"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-gray-300 border border-gray-800 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </motion.div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {chats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{
                delay: index * 0.03,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className={`group relative mb-1.5 p-2.5 rounded-lg cursor-pointer transition-all duration-300 ${
                currentChatId === chat.id
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 shadow-lg"
                  : "hover:bg-gray-900/50 border border-transparent hover:border-gray-800"
              }`}
              onMouseEnter={() => handleChatMouseEnter(chat.id)}
              onMouseLeave={() => handleChatMouseLeave(chat.id)}
              onClick={() => !editingChat && setCurrentChat(chat.id)}
              whileHover={{ scale: editingChat ? 1 : 1.02, x: editingChat ? 0 : 2 }}
              whileTap={{ scale: editingChat ? 1 : 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <MessageSquare className="h-3.5 w-3.5 text-gray-600 mr-2 flex-shrink-0" />
                    {editingChat === chat.id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <Input
                          ref={editInputRef}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          onBlur={saveEdit}
                          className="text-xs h-6 bg-gray-800 border-gray-700 text-gray-300 flex-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-green-400 hover:text-green-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            saveEdit()
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-red-400 hover:text-red-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            cancelEdit()
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <h3 className="text-xs font-medium text-gray-300 truncate">{chat.title}</h3>
                    )}
                  </div>
                  {editingChat !== chat.id && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600">
                        {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                      </p>
                      <p className="text-xs text-gray-700">{chat.messages.length}</p>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {(hoveredChat === chat.id || currentChatId === chat.id || openDropdown === chat.id) &&
                    !editingChat && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="flex-shrink-0 ml-2"
                      >
                        <DropdownMenu
                          onOpenChange={(open) => handleDropdownOpenChange(open, chat.id)}
                          open={openDropdown === chat.id}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 min-w-[120px]">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                startEditing(chat.id, chat.title)
                              }}
                              className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteChat(chat.id)
                                setOpenDropdown(null)
                                setHoveredChat(null)
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-gray-800 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {chats.length === 0 && (
          <motion.div
            className="text-center text-gray-600 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-gray-800" />
            <p className="text-sm text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-700 mt-1">Start your first chat to begin</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
