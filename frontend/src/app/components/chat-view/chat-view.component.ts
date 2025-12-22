import { Component, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/chat.model';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css']
})
export class ChatViewComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  chatService = inject(ChatService);
  newMessage: string = '';
  private shouldScroll = true;

  get selectedChat() {
    return this.chatService.selectedChat();
  }

  get messages() {
    return this.chatService.currentMessages();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
    this.shouldScroll = true;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatMessageTime(message: Message): string {
    const date = new Date(message.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatMessageDate(message: Message, index: number): string | null {
    const date = new Date(message.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if we need to show date separator
    if (index === 0) {
      return this.getDateLabel(date, today, yesterday);
    }

    const prevMessage = this.messages[index - 1];
    const prevDate = new Date(prevMessage.timestamp);
    
    if (date.toDateString() !== prevDate.toDateString()) {
      return this.getDateLabel(date, today, yesterday);
    }

    return null;
  }

  private getDateLabel(date: Date, today: Date, yesterday: Date): string {
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  }

  goBack(): void {
    this.chatService.selectChat(null);
  }
}

