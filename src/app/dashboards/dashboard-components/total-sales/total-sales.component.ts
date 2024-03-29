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

export type totalsalesChartOptions = {
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
  selector: 'app-total-sales',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './total-sales.component.html',
  styleUrls: ['./total-sales.component.css'],
})
export class TotalSalesComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public totalsalesChartOptions: Partial<totalsalesChartOptions>;

  constructor() {
    this.totalsalesChartOptions = {
      series: [
        {
          name: 'Sales overview A',
          data: [50, 130, 80, 70, 180, 105, 250],
        },
        {
          name: 'Sales overview  B',
          data: [80, 100, 60, 200, 150, 100, 150],
        },
      ],
      chart: {
        fontFamily: 'Montserrat,sans-serif',
        height: 450,
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
        curve: 'straight',
        width: '3',
      },
      colors: ['#06d79c', '#398bf7'],
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
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
