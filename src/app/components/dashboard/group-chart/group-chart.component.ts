import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NoteService } from '../../../services/note.service';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-group-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `<canvas id="group-chart"></canvas>`,
  styleUrl: './group-chart.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupChartComponent {
  constructor(private noteService: NoteService) {
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const groupCount = this.noteService.getAll().reduce((acc: { [key: string]: number }, item) => {
      const groupTitle = item.group && typeof item.group === 'object' && item.group.title
        ? item.group.title
        : typeof item.group === 'string'
          ? item.group
          : 'Other';
      acc[groupTitle] = (acc[groupTitle] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(groupCount);
    const values = Object.values(groupCount);

    const ctx = document.getElementById('group-chart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Items per Group',
          data: values,
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#c45850'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }
}
