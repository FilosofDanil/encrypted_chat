import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatListComponent } from '../chat-list/chat-list.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ChatListComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() searchTerm: string = '';
}
