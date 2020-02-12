import { Component, OnInit, Input, OnChanges } from '@angular/core';

import * as _ from 'lodash'
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Time from 'd3-time'
import { nest } from 'd3-collection'

@Component({
  selector: 'app-multilinechart',
  templateUrl: './multilinechart.component.html',
  styleUrls: ['./multilinechart.component.scss']
})
export class MultilinechartComponent implements OnInit, OnChanges {
  @Input() multiLineData: any;
  @Input() label: any;
  @Input() dimension: any;
  datadate2: any;
  newData: any;
  uniqLocs: any;
  LOCS: any;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.multiLineData && this.dimension != "Location") {
      let dates = this.multiLineData.map((data) => {
        return data['date']
      })
      let uniqueDates = _.uniq(dates)
      this.data = uniqueDates.map((date) => { return new Date(date); })

      this.datadate2 = uniqueDates.map((date) => { return date })
      this.drawMultiLineChart()
    }
    //////////////////////////////for Location Line chart///////////////////////////////

    if (this.multiLineData && this.multiLineData.length > 0 && this.dimension && this.dimension === "Location") {

      let Locations = [];
      let newArr = []
      this.multiLineData.forEach(element => {
        Locations.push(element['Location'])
      });
      newArr = this.multiLineData;
      let UniqueLocs = _.uniq(Locations)

      let uniqLocs = UniqueLocs.map((location, index) => {
        return { Location: location, id: index }
      })

      let groupeddata = nest()
        .key(function (d) { return d['topic_name']; })
        .entries(newArr);

      let group2 = groupeddata;
      group2.forEach((data) => {
        let locationArr = [];
        let notIncLocation = [];
        data.values.forEach((datavalues) => {
          locationArr.push(datavalues['Location'])
        });
        notIncLocation = _.difference(_.uniq(Locations), locationArr);
        notIncLocation.forEach((locations) => {
          data['values'].push({ topic_name: data['key'], count: 0, Location: locations })
        })
      })
      group2.forEach((data) => {
        data.values.forEach((value) => {
          for (var i = 0; i < uniqLocs.length; i++) {
            if (uniqLocs[i]['Location'] === value['Location']) {
              value['id'] = uniqLocs[i]['id']
            }
          }
        })
      })
      group2.forEach((data) => {
        data.values.sort((a, b) => {
          return a['id'] - b['id']
        })
      })
      this.newData = group2;
      this.uniqLocs = UniqueLocs;
      this.LOCS = uniqLocs;
      this.initChart();
      this.drawAxis();
      this.drawPath();
    }
    //////////////////////////////////////////////////
  }

  data: any;
  svg: any;
  margin = { top: 20, right: 80, bottom: 30, left: 50 };
  g: any;
  width: number;
  height: number;
  x;
  y;
  z;
  line;

  private drawMultiLineChart() {
    let groupeddata = nest()
      .key(function (d) { return d['topic_name']; })
      .entries(this.multiLineData);
    let group2 = groupeddata;

    group2.forEach((data) => {
      let dateArr = [];
      let notIncDates = [];
      data.values.forEach(datavalues => {
        dateArr.push(datavalues['date'])
      });
      notIncDates = _.difference(this.datadate2, dateArr);
      notIncDates.forEach((dates) => {
        data['values'].push({ topic_name: data['key'], count: 0, date: dates })
      })
      data['values'].sort((a, b) => {
        let d1: any = new Date(a['date'])
        let d2: any = new Date(b['date'])
        return d1 - d2;
      })
    })
    groupeddata = group2;
    this.svg = d3.select('.chart .multilinechart');
    this.svg.selectAll("*").remove();

    this.width = this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = this.svg.attr('height') - this.margin.top - this.margin.bottom;

    this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x = d3Scale.scaleTime().range([0, this.width])
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);

    this.line = d3Shape.line()
      .curve(d3Shape.curveBasis)
      .x((d: any) => this.x(new Date(d.date)))
      .y((d: any) => this.y(d.count));

    this.x.domain(d3Array.extent(this.data, (d: Date) => d));

    this.y.domain([
      d3Array.min(groupeddata, function (c) { return d3Array.min(c.values, function (d) { return d['count']; }); }),
      d3Array.max(groupeddata, function (c) { return d3Array.max(c.values, function (d) { return d['count']; }); })
    ]);

    this.z.domain(groupeddata.map(function (c) { return c.key; }));

    this.g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('fill', '#000')
      .text('');


    //for X axis Label
    this.svg.append("text")
      .attr("transform",
        "translate(" + (this.width / 2) + " ," +
        (this.height + this.margin.top + 50) + ")")
      .style("text-anchor", "middle")
      .text("Time");


    //For Y Axis Label
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left + 30)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(this.label);

    let city = this.g.selectAll('.city')
      .data(groupeddata)
      .enter().append('g')
      .attr('class', 'city');

    city.append('path')
      .attr('class', 'line')
      .attr('d', (d) => this.line(d.values))
      .style('stroke', (d) => this.z(d.key))
      .style('stroke-width', '3')
      /* .style('mix-blend-mode', 'multiply') */
      .style('stroke-linejoin', 'round')
      .style('stroke-linecap', 'round')


    city.append('text')
      .datum(function (d) { return { id: d.key, value: d.values[d.values.length - 1] }; })
      .attr('transform', (d) => 'translate(' + this.x(new Date(d.value.date)) + ',' + this.y(d.value.count) + ')')
      .attr('x', 3)
      .attr('dy', '0.35em')
      .style('font', '10px sans-serif')
      .text(function (d) { return "" });


    //legend
    let legend = this.g.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .attr('id', 'legend')
      .selectAll('g')
      .data(groupeddata.map(function (c) { return c.key; }).slice().reverse())
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

  }
  private initChart(): void {
    this.svg = d3.select('.chart .multilinechart');
    this.svg.selectAll("*").remove();

    this.width = this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = this.svg.attr('height') - this.margin.top - this.margin.bottom;

    this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);

    this.line = d3Shape.line()
      .curve(d3Shape.curveBasis)
      .x((d: any) => this.x(d.id))
      .y((d: any) => this.y(d.count));

    //this.x.domain(d3Array.extent(this.data, (d: Date) => d ));
    this.x.domain(
      [d3Array.min(this.newData, function (c) { return d3Array.min(c['values'], function (d) { return d['id']; }); }),
      d3Array.max(this.newData, function (c) { return d3Array.max(c['values'], function (d) { return d['id']; }); })])

    this.y.domain([
      d3Array.min(this.newData, function (c) { return d3Array.min(c['values'], function (d) { return d['count']; }); }),
      d3Array.max(this.newData, function (c) { return d3Array.max(c['values'], function (d) { return d['count']; }); })
    ]);

    this.z.domain(this.newData.map(function (c) { return c.key; }));
  }

  private drawAxis(): void {
    this.g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x)
        .tickFormat((d) => { return this.getLocation(d, this.LOCS) })
        .ticks(this.LOCS.length));

    console.log(this.LOCS, "this.LOCS")

    this.g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('fill', '#000');
    //.text('Temperature, ºF');
  }

  private drawPath(): void {
    let city = this.g.selectAll('.city')
      .data(this.newData)
      .enter().append('g')
      .attr('class', 'city');

    city.append('path')
      .attr('class', 'line')
      .attr('d', (d) => this.line(d.values))
      .style('stroke', (d) => this.z(d.key))
      .style('stroke-width', this.LOCS.length === 1 ? 10 : 3)
      //.style('mix-blend-mode', 'multiply')
      .style('stroke-linejoin', 'round')
      .style('stroke-linecap', 'round');

    city.append('text')
      .datum(function (d) { return { id: d.key, value: d.values[d.values.length - 1] }; })
      .attr('transform', (d) => 'translate(' + this.x(d.value.id) + ',' + this.y(d.value.count) + ')')
      .attr('x', 3)
      .attr('dy', '0.35em')
      .style('font', '10px sans-serif')
      .text(function (d) { return ""; });


    //for legend
    let legend = this.g.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .attr('id', 'legend')
      .selectAll('g')
      .data(this.newData.map(function (c) { return c.key; }).slice().reverse())
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


    //for X axis Label
    this.svg.append("text")
      .attr("transform",
        "translate(" + (this.width / 2) + " ," +
        (this.height + this.margin.top + 50) + ")")
      .style("text-anchor", "middle")
      .text("Location");


    //For Y Axis Label
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left + 30)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(this.label);
  }

  getLocation(id, data: any[]) {
    let location;
    data.forEach((data) => {
      if (data['id'] === id) {
        location = data['Location']
      }
    })
    return location;
  }

}
