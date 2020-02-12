import { Component, OnInit, Input, OnChanges } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import * as d3Collection from 'd3-collection';


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
  constructor() { }
  @Input() data: any;
  @Input() barData: any;
  @Input() label: any;
  @Input() dimension: any;

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.barData) {
      console.log(this.dimension);
      if (this.dimension === "Time Period") {
        this.yLabel = "month"
      }
      else {
        this.yLabel = "Location"
      }
      this.drawBarchart()
    }
  }

  drawBarchart() {
    this.svg = d3.select('.chart .barchart');
    this.svg.selectAll("*").remove();
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

    this.x = this.x.domain(this.barData.map((d) => {
      return d[this.yLabel];
    }));
    this.y = this.y.domain([0, d3Array.max(this.barData, function (d) {
      return Number(d['count']);
    })]);

    this.g.append("g").attr("class", "baraxis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x))

    this.g.append("g")
      .attr("class", "baraxis")
      .call(d3Axis.axisLeft(this.y))
      .append("text")
      .attr("fill", "#000")
      .attr("y", -6)
      .attr("x", -20)
      .attr("dy", "0.71em")
      .attr('font-weight', 'bold')
      .attr("text-anchor", "end")
      .text("");

    //for X axis Label
    this.svg.append("text")
      .attr("transform",
        "translate(" + ((this.width / 2) + (2 * this.margin.right)) + " ," +
        (this.height + this.margin.top + 50) + ")")
      .style("text-anchor", "middle")
      .style("text-transform", "capitalize")
      .text(this.yLabel);

    //For Y Axis Label
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left + 30)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(this.label);

    this.g.selectAll(".bar")
      .data(this.barData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => {
        return this.x(d[this.yLabel]);
      })
      .attr("y", (d) => {
        return this.y(Number(d.count));
      })
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => {
        return this.height - this.y(Number(d.count));
      });

    //for bar vaues


    let len = (this.barData.length) * 3
    console.log(len)

    this.svg.selectAll("text.bar")
      .data(this.barData)
      .enter().append("text")
      .attr("class", "bar")
      .attr("text-anchor", "middle")
      .attr("x", (d) => { return this.x(d[this.yLabel]) + this.margin.left + this.margin.right + (this.width / len); })
      .attr("y", (d) => { return this.y(d.count) + this.margin.top - 5; })
      .text((d) => { return d.count; });

  }

}
