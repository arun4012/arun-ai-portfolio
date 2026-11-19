import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MessageCircle, X, Send, Trash2, Bot, User, Sparkles, ChevronDown, Loader } from 'lucide-angular';
import { ChatService } from '../../services/chat.service';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import { ChatMessage } from '../../models/portfolio.models';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, LucideAngularModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('inputField') inputField!: ElementRef;

  readonly MessageCircleIcon = MessageCircle;
  readonly XIcon = X;
  readonly SendIcon = Send;
  readonly Trash2Icon = Trash2;
  readonly BotIcon = Bot;
  readonly UserIcon = User;
  readonly SparklesIcon = Sparkles;
  readonly ChevronDownIcon = ChevronDown;
  readonly LoaderIcon = Loader;

  isOpen = false;
  userInput = '';
  messages: ChatMessage[] = [];
  isLoading = false;
  private shouldScrollToBottom = false;

  constructor(
    public chatService: ChatService,
    public data: PortfolioDataService
  ) { }

  ngOnInit() {
    this.addWelcomeMessage();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private addWelcomeMessage() {
    this.messages.push({
      role: 'assistant',
      content: `Hi! I'm Arun's AI portfolio assistant. You can ask me about his professional background, Angular experience, technical skills, projects, certifications and career availability.`,
      timestamp: new Date(),
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.inputField?.nativeElement.focus(), 100);
      this.shouldScrollToBottom = true;
    }
  }

  closeChat() {
    this.isOpen = false;
  }

  clearConversation() {
    this.messages = [];
    this.addWelcomeMessage();
  }

  askSuggestedQuestion(question: string) {
    this.userInput = question;
    this.sendMessage();
  }

  sendMessage() {
    const question = this.userInput.trim();
    if (!question || this.isLoading) return;

    this.messages.push({
      role: 'user',
      content: question,
      timestamp: new Date(),
    });

    this.userInput = '';
    this.isLoading = true;
    this.shouldScrollToBottom = true;

    // Add loading placeholder
    const loadingMsg: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    this.messages.push(loadingMsg);

    const historyForApi = this.messages.filter(m => !m.isLoading).slice(0, -1);

    this.chatService.sendMessage(question, historyForApi).subscribe({
      next: (response) => {
        const idx = this.messages.indexOf(loadingMsg);
        if (idx !== -1) {
          this.messages[idx] = {
            role: 'assistant',
            content: response.answer,
            timestamp: new Date(),
            sources: response.sources,
          };
        }
        this.isLoading = false;
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        const idx = this.messages.indexOf(loadingMsg);
        if (idx !== -1) {
          this.messages[idx] = {
            role: 'assistant',
            content: err.message || 'Something went wrong. Please try again.',
            timestamp: new Date(),
            isError: true,
          };
        }
        this.isLoading = false;
        this.shouldScrollToBottom = true;
      },
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    try {
      const container = this.messagesContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch { }
  }

  trackByIndex(index: number) {
    return index;
  }
}
