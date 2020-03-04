import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { HttpClient } from '@angular/common/http';
export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
@Component({
  selector: 'app-stackedchart',
  templateUrl: './stackedchart.component.html',
  styleUrls: ['./stackedchart.component.scss']
})
export class StackedchartComponent implements OnInit, OnChanges {

  private margin: Margin;

  private width: number;
  private height: number;

  private svg: any;     // TODO replace all `any` by the right type

  private x: any;
  private y: any;
  private z: any;
  private g: any;

  private yLabel: any;
  private xd;

  constructor(private http: HttpClient) { }

  @Input() data: any;
  @Input() stackedData: any;
  @Input() topics: any[];
  @Input() label: any;
  @Input() dimension;
  @Input() selectedTopics;
  @Input() changeStackChart;
  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.changeStackChart, 'stackchange');
    if (!this.changeStackChart) {
      return;
    }
    if (this.stackedData && this.topics && this.topics.length > 0) {
      console.log(this.dimension, this.stackedData);
      if (this.dimension === 'Time Period') {
        this.yLabel = 'month';
        const topicArr = this.selectedTopics.length > 0 ? this.selectedTopics : this.topics;
        const months = [];
        this.xd = this.stackedData;
        this.xd.forEach(element => {
          // tslint:disable-next-line:no-string-literal
          if (months.indexOf(element['month']) > -1) { } else { months.push(element['month']); }
        });
        const newda = months.map(month => ({ month }));

        newda.forEach((da) => {
          topicArr.forEach(topic => {
            da[topic] = 0;
          });
        });
        this.xd.forEach((objs) => {

          newda.forEach((da) => {

            // tslint:disable-next-line:no-string-literal
            if (da['month'] === objs['month']) {
              // tslint:disable-next-line:no-string-literal
              da[objs['topic_name']] = objs['count'];
            }
          });

        });
        this.drawStackedChart(newda);
      } else {
        this.yLabel = 'Location';
        const topicArr = this.selectedTopics.length > 0 ? this.selectedTopics : this.topics;
        const locations = [];
        this.xd = this.stackedData;
        this.xd.forEach(element => {
          // tslint:disable-next-line:no-string-literal
          if (locations.indexOf(element['Location']) > -1) { } else { locations.push(element['Location']); }
        });
        const newda = locations.map(location => ({ Location: location }));

        newda.forEach((da) => {
          topicArr.forEach(topic => {
            da[topic] = 0;
          });
        });
        this.xd.forEach((objs) => {

          newda.forEach((da) => {

            // tslint:disable-next-line:no-string-literal
            if (da['Location'] === objs['Location']) {
              // tslint:disable-next-line:no-string-literal
              da[objs['topic_name']] = objs['count'];
            }
          });

        });
        console.log('newda location', newda);
        this.drawStackedChart(newda);
      }
    }
  }
  private drawStackedChart(stackedData) {
    this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    this.svg = d3.select('.chart .stackedchart');
    this.svg.selectAll('*').remove();

    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x = d3Scale.scaleBand()
      .rangeRound([0, this.width])
      .paddingInner(0.05)
      .align(0.1);
    this.y = d3Scale.scaleLinear()
      .rangeRound([this.height, 0]);
    this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);
    const keys = Object.getOwnPropertyNames(stackedData[0]).slice(1);

    stackedData = stackedData.map(v => {
      v.total = keys.map(key => v[key]).reduce((a, b) => a + b, 0);
      return v;
    });

    // stackedData.sort((a: any, b: any) => b.total - a.total);

    this.x.domain(stackedData.map((d: any) => d[this.yLabel]));
    this.y.domain([0, d3Array.max(stackedData, (d: any) => d.total)]).nice();
    this.z.domain(keys);

    this.g.append('g')
      .selectAll('g')
      .data(d3Shape.stack().keys(keys)(stackedData))
      .enter().append('g')
      .attr('fill', d => this.z(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => this.x(d.data[this.yLabel]))
      .attr('y', d => this.y(d[1]))
      .attr('height', d => this.y(d[0]) - this.y(d[1]))
      .attr('width', this.x.bandwidth());

    this.g.append('g')
      .attr('class', 'stackaxis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.g.append('g')
      .attr('class', 'stackaxis')
      .call(d3Axis.axisLeft(this.y).ticks(null, 's'))
      .append('text')
      .attr('x', 2)
      .attr('y', this.y(this.y.ticks().pop()) + 0.5)
      .attr('dy', '0.32em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start')
      .text('');

    // for X axis Label
    this.svg.append('text')
      .attr('transform',
        'translate(' + (this.width / 2) + ' ,' +
        (this.height + this.margin.top + 50) + ')')
      .style('text-anchor', 'middle')
      .style('text-transform', 'capitalize')
      .text(this.yLabel);


    // For Y Axis Label
    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left + 10)
      .attr('x', 0 - (this.height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.label);

    const legend = this.g.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .attr('id', 'legend')
      .selectAll('g')
      .data(keys.slice().reverse())
      .enter().append('g')
      .attr('transform', (d, i) => 'translate(200,' + i * 20 + ')');

    legend.append('rect')
      .attr('x', this.width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', this.z);

    legend.append('text')
      .attr('x', this.width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .style('font-size', '12px')
      .text(d => d);
    // this.svg.attr('width', this.width + 150)
  }

}
