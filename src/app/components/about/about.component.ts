import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LucideIconData, User, MapPin, Building2, Calendar, GraduationCap, Target } from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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

  constructor(public data: PortfolioDataService) {}

  readonly highlights = [
    { icon: Building2, label: 'Company', value: 'Tata Consultancy Services' },
    { icon: Calendar, label: 'Experience', value: '3+ Years' },
    { icon: MapPin, label: 'Location', value: 'Salem, India' },
    { icon: Target, label: 'Specialization', value: 'Angular Development' },
  ];
}

