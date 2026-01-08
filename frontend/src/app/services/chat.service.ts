import { Injectable, signal, computed } from '@angular/core';
import { Chat, Message, ReplyInfo } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // State signals
  private chatsSignal = signal<Chat[]>([]);
  private selectedChatIdSignal = signal<string | null>(null);
  private messagesSignal = signal<{ [chatId: string]: Message[] }>({});

  // Public computed signals
  chats = computed(() => 
    this.chatsSignal().sort((a, b) => {
      const dateA = a.lastMessage?.timestamp || a.createdAt;
      const dateB = b.lastMessage?.timestamp || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
  );

  selectedChatId = computed(() => this.selectedChatIdSignal());
  
  selectedChat = computed(() => 
    this.chatsSignal().find(chat => chat.id === this.selectedChatIdSignal()) || null
  );

  currentMessages = computed(() => {
    const chatId = this.selectedChatIdSignal();
    if (!chatId) return [];
    return this.messagesSignal()[chatId] || [];
  });

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Create mock messages for chat 1
    const chat1Messages: Message[] = [
      {
        id: 'msg-1-1',
        chatId: 'chat-1',
        content: 'Hey! How are you doing?',
        senderId: 'user-2',
        senderName: 'Alice Johnson',
        timestamp: new Date('2024-12-22T10:30:00'),
        isOwn: false
      },
      {
        id: 'msg-1-2',
        chatId: 'chat-1',
        content: 'I\'m doing great! Just working on some Angular components.',
        senderId: 'user-1',
        senderName: 'You',
        timestamp: new Date('2024-12-22T10:32:00'),
        isOwn: true
      },
      {
        id: 'msg-1-3',
        chatId: 'chat-1',
        content: 'That sounds awesome! What kind of components?',
        senderId: 'user-2',
        senderName: 'Alice Johnson',
        timestamp: new Date('2024-12-22T10:33:00'),
        isOwn: false
      },
      {
        id: 'msg-1-4',
        chatId: 'chat-1',
        content: 'Building a chat application with theme switching! 🎨',
        senderId: 'user-1',
        senderName: 'You',
        timestamp: new Date('2024-12-22T10:35:00'),
        isOwn: true
      },
      {
        id: 'msg-1-5',
        chatId: 'chat-1',
        content: 'That\'s really cool! Can\'t wait to see it in action 🚀',
        senderId: 'user-2',
        senderName: 'Alice Johnson',
        timestamp: new Date('2024-12-22T14:20:00'),
        isOwn: false
      }
    ];

    // Create mock messages for chat 2
    const chat2Messages: Message[] = [
      {
        id: 'msg-2-1',
        chatId: 'chat-2',
        content: 'Did you check the latest project requirements?',
        senderId: 'user-3',
        senderName: 'Bob Smith',
        timestamp: new Date('2024-12-21T09:00:00'),
        isOwn: false
      },
      {
        id: 'msg-2-2',
        chatId: 'chat-2',
        content: 'Yes, I reviewed them yesterday. Some interesting features!',
        senderId: 'user-1',
        senderName: 'You',
        timestamp: new Date('2024-12-21T09:15:00'),
        isOwn: true
      },
      {
        id: 'msg-2-3',
        chatId: 'chat-2',
        content: 'Great! Let\'s discuss them in our next meeting.',
        senderId: 'user-3',
        senderName: 'Bob Smith',
        timestamp: new Date('2024-12-21T09:20:00'),
        isOwn: false
      },
      {
        id: 'msg-2-4',
        chatId: 'chat-2',
        content: 'Sounds good. I\'ll prepare some mockups.',
        senderId: 'user-1',
        senderName: 'You',
        timestamp: new Date('2024-12-21T11:45:00'),
        isOwn: true
      }
    ];

    // Set messages
    this.messagesSignal.set({
      'chat-1': chat1Messages,
      'chat-2': chat2Messages
    });

    // Create mock chats
    const mockChats: Chat[] = [
      {
        id: 'chat-1',
        title: 'Alice Johnson',
        participants: ['user-1', 'user-2'],
        lastMessage: chat1Messages[chat1Messages.length - 1],
        unreadCount: 2,
        avatar: '👩',
        isOnline: true,
        createdAt: new Date('2024-12-20T08:00:00')
      },
      {
        id: 'chat-2',
        title: 'Bob Smith',
        participants: ['user-1', 'user-3'],
        lastMessage: chat2Messages[chat2Messages.length - 1],
        unreadCount: 0,
        avatar: '👨',
        isOnline: false,
        createdAt: new Date('2024-12-19T14:00:00')
      }
    ];

    this.chatsSignal.set(mockChats);
  }

  selectChat(chatId: string | null): void {
    this.selectedChatIdSignal.set(chatId);
    
    // Clear unread count when selecting a chat
    if (chatId) {
      const chats = this.chatsSignal();
      const updatedChats = chats.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      );
      this.chatsSignal.set(updatedChats);
    }
  }

  sendMessage(content: string, replyTo?: ReplyInfo): void {
    const chatId = this.selectedChatIdSignal();
    if (!chatId || !content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      content: content.trim(),
      senderId: 'user-1',
      senderName: 'You',
      timestamp: new Date(),
      isOwn: true,
      replyTo
    };

    // Add message to messages
    const currentMessages = this.messagesSignal();
    const chatMessages = currentMessages[chatId] || [];
    this.messagesSignal.set({
      ...currentMessages,
      [chatId]: [...chatMessages, newMessage]
    });

    // Update last message in chat
    const chats = this.chatsSignal();
    const updatedChats = chats.map(chat =>
      chat.id === chatId ? { ...chat, lastMessage: newMessage } : chat
    );
    this.chatsSignal.set(updatedChats);
  }

  getMessageById(messageId: string): Message | undefined {
    const chatId = this.selectedChatIdSignal();
    if (!chatId) return undefined;
    const chatMessages = this.messagesSignal()[chatId] || [];
    return chatMessages.find(msg => msg.id === messageId);
  }

  deleteMessage(messageId: string): void {
    const chatId = this.selectedChatIdSignal();
    if (!chatId) return;

    const currentMessages = this.messagesSignal();
    const chatMessages = currentMessages[chatId] || [];
    const updatedMessages = chatMessages.filter(msg => msg.id !== messageId);

    this.messagesSignal.set({
      ...currentMessages,
      [chatId]: updatedMessages
    });

    // Update last message in chat if we deleted the last message
    const chats = this.chatsSignal();
    const chat = chats.find(c => c.id === chatId);
    if (chat?.lastMessage?.id === messageId) {
      const newLastMessage = updatedMessages.length > 0 
        ? updatedMessages[updatedMessages.length - 1] 
        : undefined;
      const updatedChats = chats.map(c =>
        c.id === chatId ? { ...c, lastMessage: newLastMessage } : c
      );
      this.chatsSignal.set(updatedChats);
    }
  }

  getFilteredChats(searchTerm: string): Chat[] {
    if (!searchTerm.trim()) {
      return this.chats();
    }
    return this.chats().filter(chat =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  hasChats(): boolean {
    return this.chatsSignal().length > 0;
  }

  isSelected(chatId: string): boolean {
    return this.selectedChatIdSignal() === chatId;
  }
}



