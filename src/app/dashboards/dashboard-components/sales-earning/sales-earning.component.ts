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
  ApexPlotOptions,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type salesearningsChartOptions = {
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
  plotOptions: ApexPlotOptions | any;
};

@Component({
  selector: 'app-sales-earning',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './sales-earning.component.html',
  styleUrls: ['./sales-earning.component.css'],
})
export class SalesEarningComponent implements OnInit {
  @ViewChild('chart') chart2: ChartComponent = Object.create(null);
  public salesearningsChartOptions: Partial<salesearningsChartOptions>;

  constructor() {
    this.salesearningsChartOptions = {
      series: [
        {
          name: 'A',
          data: [400, 120, 140, 130, 200, 150, 140, 130, 300, 120, 140, 150],
        },
        {
          name: 'B',
          data: [200, 188, 242, 300, 200, 400, 230, 300, 200, 400, 180, 300],
        },
        {
          name: 'C',
          data: [100, 200, 400, 600, 100, 200, 400, 370, 240, 200, 280, 330],
        },
      ],
      chart: {
        fontFamily: 'Montserrat,sans-serif',
        height: 450,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          barHeight: '40%',
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
        width: '0',
      },
      colors: ['#398bf7', 'rgba(57, 139, 247, 0.8)', 'rgba(57, 139, 247, 0.4)'],
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
