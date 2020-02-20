import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
@Component({
  selector: 'app-attestationreports',
  templateUrl: './attestationreports.component.html',
  styleUrls: ['./attestationreports.component.scss']
})
export class AttestationreportsComponent implements OnInit {

  private margin = { top: 20, right: 20, bottom: 30, left: 50 };

  private width: number;
  private height: number;

  private svg: any;     // TODO replace all `any` by the right type

  private x: any;
  private y: any;
  private z: any;
  private g: any;
  private line: d3Shape.Line<[number, number]>;
  private stackedData;
  private lineData;
  barData: any;

  constructor(private http: HttpClient) {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

  }
  xd = []
  ngOnInit() {
    this.http.get("http://localhost:3000/getData/api/getGenerateAttestationData").subscribe((data: object[]) => {

      this.xd = data['data'];
      let newda = [{ month: "October" }, { month: "November" }, { month: "December" }, { month: "January" }];

      this.xd.forEach((objs) => {

        newda.forEach((da) => {

          if (da['month'] === objs['month']) {
            da[objs['topic_name']] = objs['count']
          }
        })

      })
      this.stackedData = newda
    })
    this.http.get("http://localhost:3000/getData/api/getAttestationDataForBar").subscribe((data) => {
      this.barData = data['data']
      this.drawBarchart();
    })
  }

  public drawStackedChart() {
    d3.select('.reportchart').select("*").remove();

    this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    this.svg = d3.select('.reportchart');

    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x = d3Scale.scaleBand()
      .rangeRound([0, this.width])
      .paddingInner(0.05)
      .align(0.1);
    this.y = d3Scale.scaleLinear()
      .rangeRound([this.height, 0]);
    this.z = d3Scale.scaleOrdinal()
      .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);


    let keys = Object.getOwnPropertyNames(this.stackedData[0]).slice(1);

    this.stackedData = this.stackedData.map(v => {
      v.total = keys.map(key => v[key]).reduce((a, b) => a + b, 0);
      return v;
    });
    this.stackedData.sort((a: any, b: any) => b.total - a.total);

    this.x.domain(this.stackedData.map((d: any) => d.month));
    this.y.domain([0, d3Array.max(this.stackedData, (d: any) => d.total)]).nice();
    this.z.domain(keys);

    this.g.append('g')
      .selectAll('g')
      .data(d3Shape.stack().keys(keys)(this.stackedData))
      .enter().append('g')
      .attr('fill', d => this.z(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => this.x(d.data.month))
      .attr('y', d => this.y(d[1]))
      .attr('height', d => this.y(d[0]) - this.y(d[1]))
      .attr('width', this.x.bandwidth());

    this.g.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.g.append('g')
      .attr('class', 'axis')
      .call(d3Axis.axisLeft(this.y).ticks(null, 's'))
      .append('text')
      .attr('x', 2)
      .attr('y', this.y(this.y.ticks().pop()) + 0.5)
      .attr('dy', '0.32em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start')
      .text('Totals');

    let legend = this.g.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(keys.slice().reverse())
      .enter().append('g')
      .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')');

    legend.append('rect')
      .attr('x', this.width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', this.z);

    legend.append('text')
      .attr('x', this.width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);

  }

  drawBarchart() {
    d3.select('.reportchart').select("*").remove();
    this.svg = d3.select('.reportchart');
    this.margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
      this.width = +this.svg.attr("width") - this.margin.left - this.margin.right,
      this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom,
      this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


    this.x = d3Scale.scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1);

    this.y = d3Scale.scaleLinear()
      .rangeRound([this.height, 0]);

    this.x = this.x.domain(this.barData.map(function (d) {
      return d.month;
    }));
    this.y = this.y.domain([0, d3Array.max(this.barData, function (d) {
      return Number(d['count']);
    })]);

    this.g.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x))

    this.g.append("g")
      .call(d3Axis.axisLeft(this.y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("count");

    this.g.selectAll(".bar")
      .data(this.barData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => {
        return this.x(d.month);
      })
      .attr("y", (d) => {
        return this.y(Number(d.count));
      })
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => {
        return this.height - this.y(Number(d.count));
      });

  }

}
