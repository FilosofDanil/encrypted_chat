import { Component, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Message, ReplyInfo } from '../../models/chat.model';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css']
})
export class ChatViewComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('messageTextarea') private messageTextarea!: ElementRef<HTMLTextAreaElement>;
  
  chatService = inject(ChatService);
  newMessage: string = '';
  selectedFile: File | null = null;
  replyingTo: Message | null = null;
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
    this.adjustTextareaHeight();
  }

  adjustTextareaHeight(): void {
    if (this.messageTextarea) {
      const textarea = this.messageTextarea.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
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
    if (!this.newMessage.trim() && !this.selectedFile) return;
    
    let messageContent = this.newMessage.trim();
    
    // If there's a file, add file info to message
    if (this.selectedFile) {
      const fileInfo = `📎 ${this.selectedFile.name} (${this.formatFileSize(this.selectedFile.size)})`;
      messageContent = messageContent ? `${messageContent}\n${fileInfo}` : fileInfo;
    }
    
    // Build reply info if replying to a message
    const replyInfo: ReplyInfo | undefined = this.replyingTo ? {
      messageId: this.replyingTo.id,
      content: this.replyingTo.content,
      senderName: this.replyingTo.senderName
    } : undefined;
    
    this.chatService.sendMessage(messageContent, replyInfo);
    this.newMessage = '';
    this.selectedFile = null;
    this.replyingTo = null;
    this.shouldScroll = true;
    
    // Scroll to bottom after message is sent
    setTimeout(() => this.scrollToBottom(), 50);
  }

  replyToMessage(message: Message, event: Event): void {
    event.stopPropagation();
    this.replyingTo = message;
    // Focus the textarea
    setTimeout(() => {
      if (this.messageTextarea) {
        this.messageTextarea.nativeElement.focus();
      }
    }, 50);
  }

  cancelReply(): void {
    this.replyingTo = null;
  }

  scrollToMessage(messageId: string): void {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add highlight animation
      messageElement.classList.add('highlight');
      setTimeout(() => messageElement.classList.remove('highlight'), 1500);
    }
  }

  truncateReplyContent(content: string, maxLength: number = 50): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  removeFile(): void {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onInput(): void {
    this.adjustTextareaHeight();
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

  deleteMessage(messageId: string, event: Event): void {
    event.stopPropagation();
    this.chatService.deleteMessage(messageId);
  }
}

