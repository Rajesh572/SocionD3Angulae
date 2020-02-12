import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
export interface Imodel {
  label: string;
  datasetLabel: string;
}
export interface Ichart {
  id: number;
}
export interface Ichart {
  _model: Imodel;
  _chart: Ichart
}
@Component({
  selector: 'app-barcart',
  templateUrl: './barcart.component.html',
  styleUrls: ['./barcart.component.scss']
})
export class BarcartComponent implements OnInit {

  constructor(private router: Router) { }
  @Input() colorcode;
  @Input() chartlbl;
  @Input() chartda;
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end'
      }

    }
  };
  public barChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[];
  ngOnInit() {
    this.barChartData = [
      { data: this.chartda, label: this.chartlbl, backgroundColor: this.colorcode, hoverBackgroundColor: this.colorcode,
        hoverBorderColor: this.colorcode }
    ];
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: Ichart[] }): void {

    if (!active.length) {
        return;
    }
    const mnth = active[0]._model.label;
    const chartid = active[0]._model.datasetLabel;
    this.router.navigate(['/search'], { queryParams: {month: mnth, id: chartid}});

  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
