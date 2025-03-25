import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { NoteService } from '../../services/note.service';
import { BaseChartDirective } from 'ng2-charts';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { GroupChartComponent } from "./group-chart/group-chart.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective, SharedModule, RouterModule, GroupChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements AfterViewInit {

  notes = this.noteService.getAll().reverse();
  groupByDate = this.noteService.getAll().reduce<{ [key: string]: number }>((acc, item) => {
    const date = new Date(item.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  barChartData = {
    labels: Object.keys(this.groupByDate),
    datasets: [{
      label: 'Items per Day',
      data: Object.values(this.groupByDate),
      backgroundColor: '#3f51b5'
    }]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  constructor(private noteService: NoteService) { }

  ngAfterViewInit() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.groupByDate),
        datasets: [{
          label: 'Items per Day',
          data: Object.values(this.groupByDate),
          backgroundColor: '#3f51b5'
        }]
      }
    });

  }
}
