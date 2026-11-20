import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import {
  LucideAngularModule,
  Mail,
  Phone,
  Linkedin,
  Github,
  Download,
  MapPin,
  Clock,
  Send,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, NgClass, LucideAngularModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  readonly MailIcon = Mail;
  readonly PhoneIcon = Phone;
  readonly LinkedinIcon = Linkedin;
  readonly GithubIcon = Github;
  readonly DownloadIcon = Download;
  readonly MapPinIcon = MapPin;
  readonly ClockIcon = Clock;
  readonly SendIcon = Send;
  readonly CopyIcon = Copy;
  readonly CheckIcon = Check;
  readonly ExternalLinkIcon = ExternalLink;

  copied = false;

  constructor(public data: PortfolioDataService) {}

  readonly contactLinks = [
    {
      icon: 'mail',
      label: 'Email',
      value: 'arunariraja@gmail.com',
      href: 'mailto:arunariraja@gmail.com',
      description: 'Send me an email',
    },
    {
      icon: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/arunarivalagan',
      href: 'https://linkedin.com/in/arunarivalagan',
      description: 'Connect professionally',
    },
    {
      icon: 'github',
      label: 'GitHub',
      value: 'github.com/arunarivalagan',
      href: 'https://github.com/arunarivalagan',
      description: 'View my code',
    },
  ];

  copyEmail(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(this.data.profile.email);
    }
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 2500);
  }

  openGmail(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.data.profile.email)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
