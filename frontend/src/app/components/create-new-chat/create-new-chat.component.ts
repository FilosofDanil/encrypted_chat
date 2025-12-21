import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-new-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-chat.component.html',
  styleUrls: ['./create-new-chat.component.css']
})
export class CreateNewChatComponent {
  generatedCode: string = '';
  hashInput: string = '';
  showCopiedMessage: boolean = false;

  generateCode() {
    // Generate a random code (you can implement your own logic here)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 32; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.generatedCode = code;
  }

  async copyToClipboard() {
    if (!this.generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(this.generatedCode);
      this.showCopiedMessage = true;
      setTimeout(() => {
        this.showCopiedMessage = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  startChat() {
    if (!this.hashInput.trim()) {
      alert('Please enter a hash to start the chat');
      return;
    }
    // Implement your chat start logic here
    console.log('Starting chat with hash:', this.hashInput);
    alert('Chat started successfully!');
  }

  clearAll() {
    this.generatedCode = '';
    this.hashInput = '';
    this.showCopiedMessage = false;
  }
}

