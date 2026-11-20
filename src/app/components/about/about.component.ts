import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { LucideAngularModule, User, MapPin, Building2, Calendar, GraduationCap, Target, Sparkles } from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgClass, LucideAngularModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  readonly UserIcon = User;
  readonly MapPinIcon = MapPin;
  readonly Building2Icon = Building2;
  readonly CalendarIcon = Calendar;
  readonly GraduationCapIcon = GraduationCap;
  readonly TargetIcon = Target;
  readonly SparklesIcon = Sparkles;

  constructor(public data: PortfolioDataService) {}

  readonly highlights = [
    { icon: Building2, label: 'Company', value: 'Tata Consultancy Services' },
    { icon: Calendar, label: 'Experience', value: '3+ Years' },
    { icon: MapPin, label: 'Location', value: 'Salem, India' },
    { icon: Target, label: 'Specialization', value: 'Angular Development' },
    { icon: Sparkles, label: 'Prompt Engineering', value: 'Claude Code & RAG Architecture', fullWidth: true },
  ];
}

