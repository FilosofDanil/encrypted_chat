import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ChatItemComponent } from '../chat-item/chat-item.component';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, ChatItemComponent],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent {
  @Input() searchTerm: string = '';
  
  chatService = inject(ChatService);

  get filteredChats() {
    return this.chatService.getFilteredChats(this.searchTerm);
  }

  onChatSelect(chatId: string): void {
    this.chatService.selectChat(chatId);
  }
}

