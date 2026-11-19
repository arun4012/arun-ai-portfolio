import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Briefcase, MapPin, Calendar, Building2, ChevronDown, ChevronUp, CheckCircle2, Trophy } from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent {
  readonly BriefcaseIcon = Briefcase;
  readonly MapPinIcon = MapPin;
  readonly CalendarIcon = Calendar;
  readonly Building2Icon = Building2;
  readonly ChevronDownIcon = ChevronDown;
  readonly ChevronUpIcon = ChevronUp;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly TrophyIcon = Trophy;

  expandedIndex = 0; // first expanded by default

  constructor(public data: PortfolioDataService) {}

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }
}

