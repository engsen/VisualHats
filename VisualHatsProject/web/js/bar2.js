/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function drawBar(filterAttackType) {

    d3.csv("data/data3.csv", function(data) {

        var barData = data;

        barData.forEach(function(d) {
            d.ntotal = +d.ntotal;
            d.iyear = +d.iyear;
        });

        var terror = crossfilter(barData),
        all = terror.groupAll(),
        year = terror.dimension(function(d) {
            return d.iyear;
        }),
        years = year.group(Math.floor),
        attackType = terror.dimension(function(d) {
            return d.attacktype1_txt;
        });

        attackType.filter(filterAttackType);

        var countMeasure = year.group().reduceCount();

        var margin = {
            top: 40, 
            right: 40, 
            bottom: 40, 
            left: 40
        },
        w = 1120 - margin.left - margin.right,
        h = 250 - margin.top - margin.bottom;

        var startYear = 1970;
        var endYear = 2014;

        var xScale = d3.scale.linear()
        .domain([startYear, endYear])
        .range([0, w]);

        var barWidth = w / (endYear - startYear + 1) - 1;

        var maxKV = countMeasure.top(1);
        var maxY = maxKV[0].value;

        //console.log(maxY);

        var yScale = d3.scale.linear()
        .domain([0, maxY])
        .range([h, 0]);

        var brush = d3.svg.brush()
        .x(xScale)
        .extent([_startYear, _endYear])
        .on('brushend', brushend);

        function brushend() {
            //var brushSelect = xScale.domain(brush.empty() ? null : brush.extent());
            var brushRange = brush.extent();
            _startYear = Math.floor(brushRange[0]);
            _endYear = Math.ceil(brushRange[1]);
            
            //year.filterRange([_startYear, _endYear]).reduceCount();
            //var totalincident = year.group().reduceSum(function(d) { return d.total; })
            var totalincident = all.reduceSum(function(records) {
                return records.iyear>=_startYear && records.iyear<=_endYear;
            }).value()
            
            _tipIncidentCount = "Total incidents from year " + "<strong>"+ _startYear+"</strong>" + " to " + "<strong>"+ _endYear +"</strong>" + " is " +"<strong>"+ totalincident+"</strong>";
            //filter here
            writeFilter();
           _regionname=null;
            mapfocus();
            d3.select("#chart").select("svg").remove();
            drawTreeB();
            drawTree(_startYear, _endYear);
        }

        var svg = d3.select("#bar2")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .attr("class", "graph-background-white")
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //console.log(countMeasure.all());

        svg.selectAll(".bar")
        .data(countMeasure.all())
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return xScale(d.key)
        })
        .attr("y", function(d) {
            return yScale(d.value)
        })
        .attr("width", barWidth)
        .attr("height", function(d) {
            return h - yScale(d.value)
        });

        var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

        var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat(d3.format("04d"));
        ;

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

        svg.append('g')
        .attr('class', 'brush')
        .call(brush)
        .selectAll("rect")
        .attr('height', h);

    //console.log(barData);



    });
}