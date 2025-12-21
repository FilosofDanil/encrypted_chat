import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() chats: Chat[] = [];
  @Input() searchTerm: string = '';

  get filteredChats(): Chat[] {
    if (!this.searchTerm) {
      return this.chats;
    }
    return this.chats.filter(chat => 
      chat.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

