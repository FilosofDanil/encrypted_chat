import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() newChatClicked = new EventEmitter<void>();
  @Output() searchChanged = new EventEmitter<string>();

  searchTerm: string = '';

  onNewChat() {
    this.newChatClicked.emit();
  }

  onSearchChange() {
    this.searchChanged.emit(this.searchTerm);
  }
}

