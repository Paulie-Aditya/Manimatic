"use client";

import { motion } from "framer-motion";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ChatSidebar } from "./chat-sidebar";
import { ChatArea } from "./chat-area";
import { CanvasPanel } from "./canvas-panel";
import { useChatStore } from "@/lib/store";
import { useState } from "react";
import type { Message } from "@/lib/store";

interface ChatInterfaceProps {
  onBackToLanding: () => void;
}

export function ChatInterface({ onBackToLanding }: ChatInterfaceProps) {
  const { sidebarWidth, setSidebarWidth } = useChatStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [canvasPanelOpen, setCanvasPanelOpen] = useState(false);

  const handleMessageSelect = (message: Message) => {
    if (message.animationData) {
      setSelectedMessage(message);
      setCanvasPanelOpen(true);
    }
  };

  const handleCloseCanvas = () => {
    setCanvasPanelOpen(false);
    setSelectedMessage(null);
  };

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
              onResize={(size) =>
                setSidebarWidth((size / 100) * window.innerWidth)
              }
            >
              <ChatSidebar
                onCollapse={() => setSidebarCollapsed(true)}
                onBackToLanding={onBackToLanding}
              />
            </Panel>
            <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-gray-800 transition-colors duration-300" />
          </>
        )}

        <Panel defaultSize={canvasPanelOpen ? 50 : sidebarCollapsed ? 100 : 75}>
          <ChatArea
            sidebarCollapsed={sidebarCollapsed}
            onExpandSidebar={() => setSidebarCollapsed(false)}
            onBackToLanding={onBackToLanding}
            onMessageSelect={handleMessageSelect}
          />
        </Panel>

        {canvasPanelOpen && selectedMessage && (
          <>
            <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-gray-800 transition-colors duration-300" />
            <Panel defaultSize={50} minSize={30} maxSize={70}>
              <CanvasPanel
                message={selectedMessage}
                onClose={handleCloseCanvas}
              />
            </Panel>
          </>
        )}
      </PanelGroup>
    </motion.div>
  );
}
