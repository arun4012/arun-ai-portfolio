import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Award, CheckCircle2, Clock, ExternalLink } from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.css',
})
export class CertificationsComponent {
  readonly AwardIcon = Award;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly ClockIcon = Clock;
  readonly ExternalLinkIcon = ExternalLink;

  constructor(public data: PortfolioDataService) {}
}

