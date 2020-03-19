import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import d3Tip from 'd3-tip';
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
  @Input() svgWidth: any = '70%';
  @Input() svgHeight = 550;
  @Input() dimension;
  @Input() selectedTopics;
  @Input() changeStackChart;

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

    const chartWidth = d3.select('.chart').style('width');
    if (typeof(this.svgWidth) === 'string' && this.svgWidth.endsWith('%') ) {
      this.svgWidth = (parseFloat(this.svgWidth) / 100.0) * parseFloat(chartWidth);
      console.log('SVG Width', this.svgWidth);
    }

    this.initializeTopicData();
    console.log(this.changeStackChart, "stackchange")
    // if (!this.changeStackChart) {
    //   return;
    // }
    if (this.stackedData && this.topics && this.topics.length > 0) {
      console.log(this.dimension, this.stackedData);
      if (this.dimension === "Time Period") {
        this.yLabel = this.xAxisDataValue;
        let topicArr = this.selectedTopics.length > 0 ? this.selectedTopics : this.topics;
        let months = [];
        this.xd = this.stackedData;
        this.xd.forEach(element => {
          if (months.indexOf(element[this.xAxisDataValue]) > -1) { }
          else { months.push(element[this.xAxisDataValue]) }
        });
        let newda = months.map(month => {
          const obj = {};
          obj[this.xAxisDataValue] = month;
          return obj;
        })

        newda.forEach((da) => {
          topicArr.forEach(topic => {
            da[topic] = 0;
          });
        })
        this.xd.forEach((objs) => {

          newda.forEach((da) => {

            if (da[this.xAxisDataValue] === objs[this.xAxisDataValue]) {
              da[objs['topic_name']] = objs['count']
            }
          })

        })
        this.drawStackedChart(newda);
      }
      else {
        this.yLabel = this.xAxisDataValue
        let topicArr = this.selectedTopics.length > 0 ? this.selectedTopics : this.topics;
        let locations = [];
        this.xd = this.stackedData;
        this.xd.forEach(element => {
          if (locations.indexOf(element[this.xAxisDataValue]) > -1) { }
          else { locations.push(element[this.xAxisDataValue]) }
        });
        let newda = locations.map(location => {
          const obj = {};
          obj[this.xAxisDataValue] = location;
          return obj;
        })

        newda.forEach((da) => {
          topicArr.forEach(topic => {
            da[topic] = 0;
          });
        })
        this.xd.forEach((objs) => {

          newda.forEach((da) => {

            if (da[this.xAxisDataValue] === objs[this.xAxisDataValue]) {
              da[objs['topic_name']] = objs['count']
            }
          })

        })
        console.log("newda location", newda)
        this.drawStackedChart(newda)
      }
    }
  }
  private drawStackedChart(stackedData) {
    this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    this.svg = d3.select('.chart .stackedchart');
    this.svg.selectAll("*").remove();

    const tip = d3Tip();

    tip.attr('class', 'd3-tip')
      .offset([-20, 0])
      .style('z-index', '9999')
      .html(d => {
        // console.log(d);
        let ttHtml = '<p style="color:#333; font-weight:400;">Topic: ';
        ttHtml += '<span style="color:blue">';
        ttHtml += d.key + '</span>';
        // ttHtml += '<p style="color:#333; font-weight:400;">Count: ';
        // ttHtml += '<span style="color:blue">';
        // ttHtml += d.data + '</span>';
        return ttHtml;
      });

    this.svg.call(tip);

    this.width = +this.svgWidth - this.margin.left - this.margin.right;
    this.height = +this.svgHeight - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x = d3Scale.scaleBand()
      .rangeRound([0, this.width])
      .paddingInner(0.05)
      .align(0.1);
    this.y = d3Scale.scaleLinear()
      .rangeRound([this.height, 0]);
    this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);
    let keys = Object.getOwnPropertyNames(stackedData[0]).slice(1);

    stackedData = stackedData.map(v => {
      v.total = keys.map(key => v[key]).reduce((a, b) => a + b, 0);
      return v;
    });
    //stackedData.sort((a: any, b: any) => b.total - a.total);

    this.x.domain(stackedData.map((d: any) => d[this.yLabel]));
    this.y.domain([0, d3Array.max(stackedData, (d: any) => d.total)]).nice();
    this.z.domain(keys);

    this.g.append('g')
      .selectAll('g')
      .data(d3Shape.stack().keys(keys)(stackedData))
      .enter().append('g')
      .attr('fill', d => this.z(d.key))
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => this.x(d.data[this.yLabel]))
      .attr('y', d => this.y(d[1]))
      .attr('height', d => this.y(d[0]) - this.y(d[1]))
      .attr('width', this.x.bandwidth());
      // .attr('border', 1)
      // .style('stroke', '#cdcdcd');

    this.g.append('g')
      .attr('class', 'stackaxis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .call(this.wrap, 50)
      .attr("font-size", "1.2em")
      .attr("transform", (d) => {
          return "rotate(-65)";
          });

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

    //for X axis Label
    this.svg.append("text")
      .attr("transform",
        "translate(" + (this.width / 2) + " ," +
        (this.height + this.margin.top + 100) + ")")
      .style("text-anchor", "middle")
      .style('text-transform', 'capitalize')
      .text(this.yLabel);


    //For Y Axis Label
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left + 10)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(this.label);

    const LegendTip = d3Tip();

    LegendTip.attr('class', 'd3-tip-legend')
      .offset([-20, 0])
      .style('z-index', '9999')
      .style('background-color', 'white')
      .html(d => {
        // console.log(d);
        let ttHtml = '<p style="color:#333; font-weight:400;">Topic: ';
        ttHtml += '<span style="color:blue">';
        ttHtml += d + '</span>';
        // ttHtml += '<p style="color:#333; font-weight:400;">Count: ';
        // ttHtml += '<span style="color:blue">';
        // ttHtml += d.data + '</span>';
        return ttHtml;
      });

    this.svg.call(LegendTip);

    let legend = this.g.append('g')
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
      .on('mouseover', LegendTip.show)
      .on('mouseout', LegendTip.hide)
      .attr('fill', this.z);

    legend.append('text')
      .attr('x', this.width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .style('font-size', '12px')
      .text(d => {
        if (d.length <= 15) {
          return d;
      } else {
        const words = d.split(' ');
        let display = '';
        let checkLoop = false;
        for (let i=0; i<words.length; i++) {
          const word = words[i];
          if (display.length + word.length > 20) {
            checkLoop = true;
            break;
          } else {
            display += word + ' ';
          }
        }
        if (checkLoop) {
           display += ' ...';
        }
        return display;
      }
    });
    //this.svg.attr('width', this.width + 150)
  }

  initializeTopicData() {
    const topics = [];
    this.stackedData.forEach((dataEach) => {
      if (topics.indexOf(dataEach.topic_name) < 0) {
        topics.push(dataEach.topic_name);
      }
    });
    this.topics = topics;
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
