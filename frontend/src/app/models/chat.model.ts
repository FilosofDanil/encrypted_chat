export interface Message {
  id: string;
  chatId: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isOwn: boolean;
}

export interface Chat {
  id: string;
  title: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  avatar?: string;
  isOnline?: boolean;
  createdAt: Date;
}

export interface ChatState {
  chats: Chat[];
  selectedChatId: string | null;
  messages: { [chatId: string]: Message[] };
}

