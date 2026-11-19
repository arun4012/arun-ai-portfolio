import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, Phone, Linkedin, Github, Download, MapPin, Clock, Send } from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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
}

