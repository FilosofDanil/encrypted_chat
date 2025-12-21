import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent, Chat } from '../../components/sidebar/sidebar.component';
import { CreateNewChatComponent } from '../../components/create-new-chat/create-new-chat.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, CreateNewChatComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  chats: Chat[] = [];
  searchTerm: string = '';
  sidebarVisible: boolean = true;

  onNewChat() {
    console.log('New chat clicked');
    // You can implement navigation or modal logic here
  }

  onSearchChanged(term: string) {
    this.searchTerm = term;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}

