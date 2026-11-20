import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { LucideAngularModule, Code2, ExternalLink, ChevronDown, ChevronUp, Briefcase, User, Layers, Trophy, Lightbulb, Star, Sparkles, Terminal, ShieldCheck } from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NgClass, LucideAngularModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  readonly Code2Icon = Code2;
  readonly ExternalLinkIcon = ExternalLink;
  readonly ChevronDownIcon = ChevronDown;
  readonly ChevronUpIcon = ChevronUp;
  readonly BriefcaseIcon = Briefcase;
  readonly UserIcon = User;
  readonly LayersIcon = Layers;
  readonly TrophyIcon = Trophy;
  readonly LightbulbIcon = Lightbulb;
  readonly StarIcon = Star;
  readonly SparklesIcon = Sparkles;
  readonly TerminalIcon = Terminal;
  readonly ShieldCheckIcon = ShieldCheck;

  expandedIndex = 0;
  showPromptTemplate: { [key: number]: boolean } = {};

  constructor(public data: PortfolioDataService) {}

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }

  togglePromptTemplate(index: number) {
    this.showPromptTemplate[index] = !this.showPromptTemplate[index];
  }
}

