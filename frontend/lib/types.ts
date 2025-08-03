export interface AnimationMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export interface AnimationResponse {
  status: "complete" | "failed" | "pending" | "running"
  url?: string
  code?: string
  explanation?: string
}

export interface EnhancedMessage {
  id: string
  role: "user" | "assistant"
  content: string
  animationData?: AnimationResponse
  timestamp: number
}
