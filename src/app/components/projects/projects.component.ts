import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { LucideAngularModule, Code2, ExternalLink, ChevronDown, ChevronUp, Briefcase, User, Layers, Trophy, Lightbulb, Star } from 'lucide-angular';
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

  expandedIndex = 0;

  constructor(public data: PortfolioDataService) {}

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }
}

