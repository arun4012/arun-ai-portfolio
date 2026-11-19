import { Component, HostListener } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { LucideAngularModule, Menu, X, Download, Github, Linkedin } from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgClass, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly DownloadIcon = Download;
  readonly GithubIcon = Github;
  readonly LinkedinIcon = Linkedin;

  isScrolled = false;
  isMobileMenuOpen = false;

  readonly navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ];

  constructor(public data: PortfolioDataService) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  scrollTo(href: string) {
    this.closeMobileMenu();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}


