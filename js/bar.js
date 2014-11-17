/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

d3.csv("data/data3.csv",function(data){
    
    dataset = data;
    
    dataset.forEach(function(d) {
      d.ntotal = +d.ntotal;
      d.iyear = +d.iyear;
    });
    
    var margin = {top: 40, right: 40, bottom: 40, left: 40},
        w = 960 - margin.left - margin.right,
        h = 500 - margin.top - margin.bottom;
    
    var xScale = d3.scale.linear()
        .domain([1960, 2014])
        .range([0, w]);

    var yScale = d3.scale.linear()
        .domain([0,d3.max(dataset, function(d) { return d.ntotal; })])
        .range([h, 0]);
    
    var svg = d3.select("#bar")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("fill", "red")
        .attr("x", function(d) { return xScale(d.iyear); })
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", function(d) { return yScale(d.ntotal) });

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);
    
    //console.log(dataset);
    
    
    
});

