import { Component, OnInit, Input, OnChanges } from '@angular/core';

import * as _ from 'lodash'
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Time from 'd3-time';
import d3Tip from 'd3-tip';
import { nest } from 'd3-collection';

@Component({
  selector: 'app-multilinechart',
  templateUrl: './multilinechart.component.html',
  styleUrls: ['./multilinechart.component.scss']
})
export class MultilinechartComponent implements OnInit, OnChanges {
  @Input() multiLineData: any;
  @Input() label: any;
  @Input() dimension: any;
  @Input() svgWidth: any = '75%';
  @Input() svgHeight = 550;
  datadate2: any;
  chartId = 2;
  data2: any;
  newData: any;
  uniqLocs: any;
  LOCS: any;
    @Input() xAxisDataDimension: any;


  xAxisDataKey: string;
  xAxisDataValue: string;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    const chartWidth = d3.select('.chart').style('width');
    if (typeof(this.svgWidth) === 'string' && this.svgWidth.endsWith('%') ) {
      this.svgWidth = (parseFloat(this.svgWidth) / 100.0) * parseFloat(chartWidth);
      console.log('SVG Width', this.svgWidth);
    }
    // window.scrollTo(500, 0);
    this.xAxisDataKey = this.xAxisDataDimension.key;
    this.xAxisDataValue = this.xAxisDataDimension.value;

    if (this.multiLineData && this.dimension != "Location") {
      console.log('multiLineData ::::::::  ', this.multiLineData);
      let dates = [];
      this.multiLineData.forEach((data) => {
        if(dates.indexOf(data['date']) < 0) {
          const newDate = new Date(data['date']);
          dates.push(newDate.toUTCString());
        }
      });
      this.multiLineData.map((data) => {
         data['date'] = new Date(data['date']);
      });
      // console.log('Dates ::::  ', dates);
      let xKeyValues = this.multiLineData.map((data) => {
        return data[this.xAxisDataValue];
      });
      let uniqueXKeyValues = _.uniq(xKeyValues);
      let uniqueDates = _.uniq(dates);
      console.log('uniqueDates ::::  ', uniqueDates);
      this.data = uniqueDates.map((date) => { return new Date(date); })
      if (this.data.length === 1) {
        const newDate = this.data[0].getTime() - 1000;
        // new Date(Date.now() - 20000);
        // this.data.push(new Date('2000-03-17T07:04:45.984Z'));
        this.data.push(new Date(newDate));
      }
      console.log('Data ::::  ', this.data);
      this.data2 = uniqueXKeyValues;
      // if (this.data2.length === 1) {
      //   this.data2.push('Jan');
      // }
      console.log('Data2 ::::  ', this.data2);

      // this.data2 = uniqueXKeyValues.map((value) => {
      //   const obj = {};
      //   obj[this.xAxisDataValue] = value;
      //   return obj;
      // });
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
        // const obj = {};
        // obj[this.xAxisDataValue] = datavalues[this.xAxisDataValue];
        dateArr.push(datavalues[this.xAxisDataValue]);
      });
      notIncDates = _.difference(this.data2, dateArr);
      if (this.data2.length === 1) {
        notIncDates.push('XX');
      }
      notIncDates.forEach((dates) => {
        const obj = {};
        obj['topic_name'] = data['key'];
        obj['count'] = 0;
        obj['date'] = (this.data2.indexOf(dates) > -1) ?
        new Date(this.data[this.data2.indexOf(dates)]) :
        new Date(this.data[0].getTime() - 1000);
        obj[this.xAxisDataValue] = dates;
        data['values'].push(obj);
        // data['values'].push({ topic_name: data['key'], count: 0, date: dates })
      })
      data['values'].sort((a, b) => {
        let d1: any = new Date(a['date']);
        let d2: any = new Date(b['date']);
        return d1 - d2;
      });
    });
    groupeddata = group2;
    console.log('groupeddata ::::::::::  ', groupeddata);
    this.svg = d3.select('.chart .multilinechart');
    this.svg.selectAll("*").remove();

    this.width = this.svgWidth - this.margin.left - this.margin.right;
    this.height = this.svgHeight - this.margin.top - this.margin.bottom;

    this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

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

    let xForLine = d3Scale.scaleLinear().range([0, this.width]);
    xForLine.domain(d3Array.extent(this.data, (d: Date) => d ));

    this.x = d3Scale.scaleBand().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);

    this.line = d3Shape.line()
      .curve(d3Shape.curveBasis)
      .x((d: any) => {
        console.log('xForLine(d[date] ;;;;;;; ', xForLine(d['date']));
        return xForLine(d['date']);
      })
      .y((d: any) => this.y(d.count));

      // console.log('DAta :::::::::  ', this.data);
      // this.x.domain(stackedData.map((d: any) => d[this.yLabel]));
    this.x.domain(this.data2, (d: any) => (d));
    this.y.domain([
      d3Array.min(groupeddata, function (c) { return d3Array.min(c.values, function (d) { return d['count']; }); }),
      d3Array.max(groupeddata, function (c) { return d3Array.max(c.values, function (d) { return d['count']; }); })
    ]);

    this.z.domain(groupeddata.map(function (c) { return c.key; }));

    this.g.append('g')
      .attr('class', 'axis axis--x')
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
      // .text((d) => {
        // console.log('Check d :::::::::   ', d);
        // return d;
        // console.log('Check xAxisDataValue :::::::::   ', this.xAxisDataValue);
      //   if (this.xAxisDataValue === 'month') {
      //   return d.toLocaleString('default', { month: 'short' });
      // } else if (this.xAxisDataValue === 'week') {
      //   return ('Week ' + this.getWeekNoISO(d));
      // } else if (this.xAxisDataValue === 'day') {
      //   return (d.getDate() + ' ' + d.toLocaleDateString('en-US',{'month': 'short'}));
      // } else {
      //   return '123456';
      // }
      // });

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
        (this.height + this.margin.top + 100) + ")")
      .style("text-anchor", "middle")
      .text(this.xAxisDataValue[0].toUpperCase() + this.xAxisDataValue.slice(1));


    //For Y Axis Label
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left + 30)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(this.label);

      // console.log('Grouped Data ::::::::::  ', groupeddata);
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
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);


    city.append('text')
      .datum(function (d) { return { id: d.key, value: d.values[d.values.length - 1] }; })
      .attr('transform', (d) => 'translate(' + (this.x(d.value[this.xAxisDataValue])) + ',' + this.y(d.value.count) + ')')
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
      .text(d => {
        if (d.length > 15) {
          return d.substr(0, 15) + ' ...';
      } else {
        return d;
      }
      });
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

  getWeekNoISO(dt) {
    const tdt: any = new Date(dt.valueOf());
    const dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
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
