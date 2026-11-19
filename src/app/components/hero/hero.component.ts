import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Download, Github, Linkedin, Mail, ChevronDown, Sparkles, Terminal, Code2 } from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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

  constructor(public data: PortfolioDataService) {}

  scrollToAbout() {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  }
}

