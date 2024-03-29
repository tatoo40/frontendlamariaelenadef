import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type websitevisitChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  stroke: any;
  theme: ApexTheme | any;
  tooltip: ApexTooltip | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  markers: any;
  grid: ApexGrid | any;
};

@Component({
  selector: 'app-website-visit',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './website-visit.component.html',
  styleUrls: ['./website-visit.component.css'],
})
export class WebsiteVisitComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public websitevisitChartOptions: Partial<websitevisitChartOptions>;

  constructor() {
    this.websitevisitChartOptions = {
      series: [
        {
          name: 'Site A',
          data: [0, 300, 100, 200, 1200, 100, 500, 100],
        },
        {
          name: 'Site  B',
          data: [0, 500, 600, 800, 2800, 900, 800, 2200],
        },
      ],
      chart: {
        fontFamily: 'Montserrat,sans-serif',
        height: 300,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 3,
      },
      stroke: {
        curve: 'smooth',
        width: '2',
      },
      colors: ['#398bf7', '#06d79c'],
      legend: {
        show: false,
      },
      grid: {
        show: true,
        strokeDashArray: 0,
        borderColor: 'rgba(0,0,0,0.1)',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        type: 'category',
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        labels: {
          style: {
            colors: '#a1aab2',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#a1aab2',
          },
        },
      },
      tooltip: {
        theme: 'dark',
      },
    };
  }

  ngOnInit(): void {}
}
