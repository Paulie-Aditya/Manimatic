"use client"

import { motion } from "framer-motion"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { ChatSidebar } from "./chat-sidebar"
import { ChatArea } from "./chat-area"
import { useChatStore } from "@/lib/store"
import { useState } from "react"

interface ChatInterfaceProps {
  onBackToLanding: () => void
}

export function ChatInterface({ onBackToLanding }: ChatInterfaceProps) {
  const { sidebarWidth, setSidebarWidth } = useChatStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <motion.div
      className="h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <PanelGroup direction="horizontal">
        {!sidebarCollapsed && (
          <>
            <Panel
              defaultSize={25}
              minSize={15}
              maxSize={45}
              onResize={(size) => setSidebarWidth((size / 100) * window.innerWidth)}
            >
              <ChatSidebar onCollapse={() => setSidebarCollapsed(true)} onBackToLanding={onBackToLanding} />
            </Panel>
            <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-gray-800 transition-colors duration-300" />
          </>
        )}

        <Panel defaultSize={sidebarCollapsed ? 100 : 75}>
          <ChatArea
            sidebarCollapsed={sidebarCollapsed}
            onExpandSidebar={() => setSidebarCollapsed(false)}
            onBackToLanding={onBackToLanding}
          />
        </Panel>
      </PanelGroup>
    </motion.div>
  )
}
