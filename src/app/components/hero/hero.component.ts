import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import {
  LucideAngularModule,
  Download,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  Sparkles,
  Terminal,
  Code2,
  Copy,
  Check,
  ExternalLink,
  X,
} from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, NgClass, LucideAngularModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  readonly DownloadIcon = Download;
  readonly GithubIcon = Github;
  readonly LinkedinIcon = Linkedin;
  readonly MailIcon = Mail;
  readonly ChevronDownIcon = ChevronDown;
  readonly SparklesIcon = Sparkles;
  readonly TerminalIcon = Terminal;
  readonly Code2Icon = Code2;
  readonly CopyIcon = Copy;
  readonly CheckIcon = Check;
  readonly ExternalLinkIcon = ExternalLink;
  readonly XIcon = X;

  isContactModalOpen = false;
  copied = false;

  constructor(public data: PortfolioDataService) {}

  openContactModal() {
    this.isContactModalOpen = true;
    this.copied = false;
  }

  closeContactModal() {
    this.isContactModalOpen = false;
  }

  copyEmail() {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(this.data.profile.email);
    }
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 2500);
  }

  openGmail() {
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.data.profile.email)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  scrollToContact() {
    this.closeContactModal();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToAbout() {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  }
}
