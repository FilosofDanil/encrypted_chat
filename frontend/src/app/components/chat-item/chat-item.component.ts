import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '../../models/chat.model';

@Component({
  selector: 'app-chat-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.css']
})
export class ChatItemComponent {
  @Input({ required: true }) chat!: Chat;
  @Input() isSelected: boolean = false;

  get formattedTime(): string {
    if (!this.chat.lastMessage) return '';
    
    const date = new Date(this.chat.lastMessage.timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  get lastMessagePreview(): string {
    if (!this.chat.lastMessage) return 'No messages yet';
    
    const content = this.chat.lastMessage.content;
    const maxLength = 35;
    
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}

