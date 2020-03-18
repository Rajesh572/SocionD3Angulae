// tslint:disable: no-string-literal

import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import d3Tip from 'd3-tip';
// import * as d3Collection from 'd3-collection';


@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit, OnChanges {

  private width: number;
  private height: number;
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };

  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  private yLabel: any;
  chartId = 0;
  constructor() { }
  @Input() data: any;
  @Input() svgWidth: any = '75%';
  @Input() svgHeight = 550;
  @Input() barData: any;
  @Input() label: any;
  @Input() dimension: any;
  @Input() xAxisDataDimension: any;


  xAxisDataKey: string;
  xAxisDataValue: string;

  ngOnInit() {
  }

  ngOnChanges() {
    // console.log(' Bar Chart Data :::::::: ', this.barData);
    // console.log(' xAxisDataDimension :::::::: ', this.xAxisDataDimension);
    this.xAxisDataKey = this.xAxisDataDimension.key;
    this.xAxisDataValue = this.xAxisDataDimension.value;
    // console.log(' xAxisDataKey :::::::: ', this.xAxisDataKey);
    // console.log(' xAxisDataValue :::::::: ', this.xAxisDataValue);
    // this.myEvent.emit(this.ngOnChanges);
    const chartWidth = d3.select('.chart').style('width');
    if (typeof(this.svgWidth) === 'string' && this.svgWidth.endsWith('%') ) {
      this.svgWidth = (parseFloat(this.svgWidth) / 100.0) * parseFloat(chartWidth);
      console.log('SVG Width', this.svgWidth);
    }

    if (this.barData) {
      console.log(this.dimension);
      if (this.dimension === 'Time Period') {
        this.yLabel = this.xAxisDataValue;
      } else {
        this.yLabel = this.xAxisDataValue;
      }
      this.drawBarchart();
    }
  }

  drawBarchart() {
    this.svg = d3.select('.chart .barchart');
    this.svg.selectAll('*').remove();
    this.margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
      this.width = +this.svgWidth - this.margin.left - this.margin.right,
      this.height = +this.svgHeight - this.margin.top - this.margin.bottom,
      this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const tip = d3Tip();

    tip.attr('class', 'd3-tip')
      .offset([-20, 0])
      .style('z-index', '9999')
      .html(d => {
        let ttHtml = '<p style="color:#333; font-weight:400;">Count: ';
        ttHtml += '<span style="color:blue">';
        ttHtml += d.count + '</span>';
        return ttHtml;
      });

    this.svg.call(tip);

    this.x = d3Scale.scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1);

    this.y = d3Scale.scaleLinear()
      .rangeRound([this.height, 0]);

    this.x = this.x.domain(this.barData.map((d) => {
      return d[this.xAxisDataValue];
      // return d[this.yLabel.toLowerCase()];
    }));
    this.y = this.y.domain([0, d3Array.max(this.barData, (d) => {
      return Number(d['count']);
    })]);

    this.g.append('g').attr('class', 'baraxis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('font-size', '1.2em')
      .call(this.wrap, 60)
      .attr('transform', (d) => {
          return 'rotate(-65)';
          });
    this.g.append('g')
      .attr('class', 'baraxis')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('fill', '#000')
      .attr('y', -6)
      .attr('x', -20)
      .attr('dy', '0.71em')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'end')
      .text('');

    // for X axis Label
    this.svg.append('text')
      .attr('transform',
        'translate(' + ((this.width / 2) + (2 * this.margin.right)) + ' ,' +
        (this.height + this.margin.top + 100) + ')')
      .style('text-anchor', 'middle')
      .style('text-transform', 'capitalize')
      .text(this.yLabel);

    // For Y Axis Label
    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left + 30)
      .attr('x', 0 - (this.height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.label);

    this.g.selectAll('.bar')
      .data(this.barData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => {
        return this.x(d[this.xAxisDataValue]);
      })
      .attr('y', (d) => {
        return this.y(Number(d.count));
      })
      .attr('width', this.x.bandwidth())
      .attr('height', (d) => {
        return this.height - this.y(Number(d.count));
      });
      // .on('mouseover', tip.show)
      // .on('mouseout', tip.hide);

      // .on('mouseover', (d, i, n) => tip.show(d, n[i]))

      // .on('mouseover', (data, index, element) => tip.show(data, element[index]))

    // for bar values


    const len = (this.barData.length) * 3;
    console.log(len);

    this.svg.selectAll('text.bar')
      .data(this.barData)
      .enter().append('text')
      .attr('class', 'bar')
      .attr('text-anchor', 'middle')
      .attr('x', (d) => {
        return this.x(d[this.xAxisDataValue]) + this.margin.left + this.margin.right + (this.width / len);
        })
      .attr('y', (d) => {
        return this.y(d.count) + this.margin.top - 5;
      })
      .text((d) => {
        return d.count;
      });

  }

  wrap(text, width) {
    text.each(function() {
      let text = d3.select(this);
      let words = text.text().split(/\s+/).reverse();
      let line = [];
      let word = '';
      let lineNumber = 0;
      let lineHeight = 1.1; // ems
      let y = text.attr('y');
      let dy = parseFloat(text.attr('dy'));
      let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
      if (words.length > 1) {
        while(word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
          }
        }
      } else {
        line.push(words[0]);
        tspan.text(line.join(' '));
      }

    });
  }

}
