import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CreateNewChatComponent } from '../../components/create-new-chat/create-new-chat.component';
import { ChatViewComponent } from '../../components/chat-view/chat-view.component';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    SidebarComponent, 
    CreateNewChatComponent,
    ChatViewComponent
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  chatService = inject(ChatService);
  searchTerm: string = '';
  showCreateNewChat: boolean = false;

  get hasSelectedChat(): boolean {
    return this.chatService.selectedChatId() !== null;
  }

  onNewChat() {
    // Deselect any chat and show create new chat component
    this.chatService.selectChat(null);
    this.showCreateNewChat = true;
  }

  onSearchChanged(term: string) {
    this.searchTerm = term;
  }

  onChatSelected() {
    // When a chat is selected, hide create new chat
    this.showCreateNewChat = false;
  }
}
