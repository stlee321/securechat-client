export type Chat = {
  id: string;
  content: string;
};

export type ChatMessageType = "text" | "image";

export type ChatMessage = {
  timestamp: number;
  sender: string;
  message: string;
  type: ChatMessageType;
};
