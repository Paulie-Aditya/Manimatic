import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AnimationResponse } from "./types"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  animationData?: AnimationResponse
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

interface ChatStore {
  chats: Chat[]
  currentChatId: string | null
  sidebarWidth: number

  // Actions
  createChat: () => string
  deleteChat: (chatId: string) => void
  setCurrentChat: (chatId: string) => void
  addMessage: (chatId: string, message: Omit<Message, "id" | "timestamp">) => void
  updateChatTitle: (chatId: string, title: string) => void
  setSidebarWidth: (width: number) => void
  getCurrentChat: () => Chat | null
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      sidebarWidth: 280,

      createChat: () => {
        const newChat: Chat = {
          id: `chat-${Date.now()}`,
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }))

        return newChat.id
      },

      deleteChat: (chatId: string) => {
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== chatId)
          const newCurrentChatId =
            state.currentChatId === chatId ? (newChats.length > 0 ? newChats[0].id : null) : state.currentChatId

          return {
            chats: newChats,
            currentChatId: newCurrentChatId,
          }
        })
      },

      setCurrentChat: (chatId: string) => {
        set({ currentChatId: chatId })
      },

      addMessage: (chatId: string, message: Omit<Message, "id" | "timestamp">) => {
        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
        }

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  updatedAt: Date.now(),
                  title: chat.messages.length === 0 ? message.content.slice(0, 50) + "..." : chat.title,
                }
              : chat,
          ),
        }))
      },

      updateChatTitle: (chatId: string, title: string) => {
        set((state) => ({
          chats: state.chats.map((chat) => (chat.id === chatId ? { ...chat, title, updatedAt: Date.now() } : chat)),
        }))
      },

      setSidebarWidth: (width: number) => {
        set({ sidebarWidth: width })
      },

      getCurrentChat: () => {
        const state = get()
        return state.chats.find((chat) => chat.id === state.currentChatId) || null
      },
    }),
    {
      name: "manimatic-chat-storage",
    },
  ),
)
