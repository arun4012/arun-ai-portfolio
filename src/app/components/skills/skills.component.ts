import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code2, Palette, Activity, Plug, CheckCircle, Wrench, Cloud, Sparkles, Star } from 'lucide-angular';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css',
})
export class SkillsComponent {
  readonly Code2Icon = Code2;
  readonly PaletteIcon = Palette;
  readonly ActivityIcon = Activity;
  readonly PlugIcon = Plug;
  readonly CheckCircleIcon = CheckCircle;
  readonly WrenchIcon = Wrench;
  readonly CloudIcon = Cloud;
  readonly SparklesIcon = Sparkles;
  readonly StarIcon = Star;

  // Map string icon name to actual icon object
  iconMap: Record<string, any> = {};

  constructor(public data: PortfolioDataService) {
    this.iconMap = {
      'code-2': Code2,
      'palette': Palette,
      'activity': Activity,
      'plug': Plug,
      'check-circle': CheckCircle,
      'wrench': Wrench,
      'cloud': Cloud,
      'sparkles': Sparkles,
    };
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'professional': return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
      case 'learning': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'basic': return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
      default: return 'bg-slate-700/50 border-slate-600 text-slate-400';
    }
  }

  getLevelBadgeText(level: string): string {
    switch (level) {
      case 'professional': return 'Professional';
      case 'learning': return 'Learning';
      case 'basic': return 'Basic';
      default: return '';
    }
  }
}

