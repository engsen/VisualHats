function filterScatterFromSunburst(name) {
  if(name && sc_colorMapping.indexOf(name)> -1 ) {
    d3.select("#scattered").selectAll(".circles")
          .transition()
          .duration(200)
          .style("visibility", "hidden")
          .ease("elastic");
      
    d3.select("#scattered").selectAll(".circles.type_" + sc_colorMapping.indexOf(name))
        .transition()
        .duration(200)
        .style("visibility", "visible")
        .ease("elastic");
  }
  else if (!name) {
    d3.select("#scattered").selectAll(".circles")
          .transition()
          .duration(200)
          //.style("opacity", .01)
          .style("visibility", "visible")
          .ease("elastic");
  }
}

var collection = [];

var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2.2;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var color = d3.scale.category20();


var charts = [];

var month=new Array();
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December";

// array of the attacks, used for the legend
var sc_attacks = ["Armed Assault", "Assassination", "Bombing/Explosion", "Facility/Infrastructure Attack", "Hijacking", "Unarmed Assault"];
var sc_colorMapping = new Array();
sc_colorMapping[1] = "Armed Assault";
sc_colorMapping[2] = "Assassination";
sc_colorMapping[3] = "Bombing/Explosion";
sc_colorMapping[4] = "Facility/Infrastructure Attack";
sc_colorMapping[5] = "Hijacking";
sc_colorMapping[6] = "Unarmed Assault";

// Given our array of charts, which we assume are in the same order as the
// .chart elements in the DOM, bind the charts to the DOM and render them.
// We also listen to the chart's brush events to update the display.
var chart = null;
var start = null;
var end = null;

queue()
.defer(d3.csv, "data/data2.csv")
.await(ready);

function ready(err, data1){
  collection = data1;
  var parseDate = d3.time.format("%m/%d/%Y").parse;
  collection.forEach(function(collection) { 
    collection.start = parseDate(collection.date),
    collection.region = collection.region.trim(),
    collection.country = collection.country.trim(),
    collection.attack = collection.attack.trim(),
    collection.killed = collection.killed
    
    //collection.affected = +collection.affected,
    //collection.cost = +collection.costs
    
  })
  renderSunburst(collection);
  renderLine(collection);
  renderScattered(collection);
};
  //render graphs
  //renderSunburst(collection);
  //renderLine(collection);

function filterNRender(collection){
  if(start == null || end == null){
    start=new Date();
    start.setFullYear(1970,1,1)
    end=new Date();
    end.setFullYear(2013,12,31)
  }
  
  var filteredCollection = [];
  for(i=0; i< collection.length; i++){
    if(collection[i].start >= start && collection[i].start <= end){
      filteredCollection.push(collection[i]);
    }
  }
  
  svg = d3.select("body").select("#sunburst").selectAll("svg").data([]).exit().remove()
  svg = d3.select("body").select("#scattered").selectAll("svg").data([]).exit().remove()
  renderSunburst(filteredCollection);
  renderScattered(filteredCollection);
}

function renderSunburst(collection){
  
  svg = d3.select("body").select("#sunburst").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

  partition = d3.layout.partition()
    .value(function(d) { return d.killed; });
    
  arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

  
  var colorMapping = [];
  var colorMappingNames = [];
  colorMappingNames[0]= "Armed Assault";
  colorMappingNames[1]= "Assassination";
  colorMappingNames[2]= "Bombing/Explosion";
  colorMappingNames[3]= "Facility/Infrastructure Attack";
  colorMappingNames[4]= "Hijacking";
  colorMappingNames[5]= "Unarmed Assault";
  
  colorMapping[0]= "#1f77b4";
  colorMapping[1]= "#9467bd";
  colorMapping[2]= "#2ca02c";
  colorMapping[3]= "#ff7f0e";
  colorMapping[4]= "#d62728";
  colorMapping[5]= "#8c564b";
  
  var nestedData=  _.nest(collection,["attack","region","country"]);
  
  var path = svg.selectAll("path")
  .data(partition.nodes(nestedData))
  .enter().append("path")
  .attr("d", arc)
  .style("fill", newColor)
  .on("click", click);
  
  path.on('mouseout', function (nestedData) {
           var displayText ="";
  
                d3.select('#info')
                    .html(displayText);
            });
  
  path.on('mouseover', function (nestedData) {
                /*contraFilters.book = null;
                contraFilters.chapter = getAbsoluteChapter(d.book + ' ' + d.chapter.name.split(' ')[1]);
                renderContra();*/
           var sun_depth = nestedData.depth
           var displayText;
          switch(sun_depth)
          {
            case 1:
              displayText = "<b>attack: </b>" + nestedData.name+"&nbsp&nbsp&nbsp&nbsp&nbsp <b>Killed: </b>"+ (1*nestedData.value).toLocaleString();
              break;
            case 2:
              displayText = "<b>Region: </b>" + nestedData.name+"&nbsp&nbsp&nbsp&nbsp&nbsp <b>Killed: </b>"+ (1*nestedData.value).toLocaleString();
              break;
            case 3:
              displayText = "<b>Country: </b>" + nestedData.name+"&nbsp&nbsp&nbsp&nbsp&nbsp <b>Killed: </b>"+ (1*nestedData.value).toLocaleString();
              break;
            case 4:
              displayText = "<b>Country: </b>" + nestedData.parent.name+"&nbsp&nbsp&nbsp&nbsp&nbsp <b>Killed: </b>"+ (1*nestedData.killed).toLocaleString() +"&nbsp&nbsp&nbsp&nbsp&nbsp <b>Date: </b>"+  nestedData.start.getDate() + "-" + month[(nestedData.start.getMonth())] + "-" + nestedData.start.getFullYear();
              break;
          }
        
                d3.select('#info')
                    .html(displayText);
            });
  
  path.append("title")
   .text(
   
     function(nestedData) { 
     
      var sun_depth = nestedData.depth
      switch(sun_depth)
      {
        case 1:
          return "attack: " + nestedData.name+"\nKilled: "+(1*nestedData.value).toLocaleString();
          break;
        case 2:
          return "Region: " + nestedData.name+"\nKilled: "+(1*nestedData.value).toLocaleString();
          break;
        case 3:
          return "Country: " + nestedData.name+"\nKilled: "+(1*nestedData.value).toLocaleString();
          break;
        case 4:
          return "Country: " + nestedData.parent.name+"\nKilled: "+ (1*nestedData.killed).toLocaleString() +"\nDate: "+ nestedData.start.getDate() + "-" + month[(nestedData.start.getMonth())] + "-" + nestedData.start.getFullYear();
          break;
      }
  })
  ;
  
  function newColor(nestedData){
    
    
    var name;
    
    if(nestedData.parent == null){
      return "#ffffff"
    }
    
    if(nestedData.children){
      name = nestedData.name ;
    }else{
      name = nestedData.parent.name;
    }
    
    for(i=0; i < colorMapping.length; i++){
      if(name==colorMappingNames[i]){
        return colorMapping[i];
      }
    }
    
    var rColor = color(name);
    
    if(rColor == "#ff7f0e"){
      return "#b37c71"
    }else if(rColor == "#8c564b") {
      return "#fdd0a2"
    }else if(rColor == "#d62728") {
      return "#4bce4b"
    }else if(rColor == "#2ca02c") {
      return "#e36667"
    }else if(rColor == "#9467bd") {
      return "#419ede"
    }else if(rColor == "#1f77b4") {
      return "#ba9cd4"
    }else{
      return rColor;
    }
  };

  function click(d) {
    path.transition()
      .duration(1000)
      .attrTween("d", arcTween(d));
    filterScatterFromSunburst(d.name);
  }

}

d3.select(self.frameElement).style("height", height + "px");

// Interpolate the scales!
function arcTween(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}

//Bar Chart Codes
function renderLine(collection){
  var data = crossfilter(collection);
  var testData = data.dimension(function(collection) {
    return d3.time.year(collection.start);
  });
  
  year = testData.group();
  

  // Render the initial lists.
   charts = [
    // barChart().dimension(date).group(dates).round(d3.time.month.round).x(d3.time.scale().domain([new Date(2008, 1, 1), new Date(2012, 9, 4)]).rangeRound([0, 948]))];
    barChart().dimension(testData).group(year).x(d3.time.scale().domain([new Date(1970, 1, 1), new Date(2013, 12, 31)]).rangeRound([0, 940]))];

    

  // Given our array of charts, which we assume are in the same order as the
  // .chart elements in the DOM, bind the charts to the DOM and render them.
  // We also listen to the chart's brush events to update the display.
  chart = d3.select("body").selectAll(".chart")
      .data(charts)
      .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });


  // Render the total.

  renderAll();

}


  function render(method) {
    d3.select(this).call(method);
  }

  // Whenever the brush moves, re-rendering everything.
  function renderAll() {
    chart.each(render);
  }

  
function barChart() {
    if (!barChart.id) barChart.id = 0;

    var margin = {top: 0, right: 50, bottom: 20, left: 50},
        x, y = d3.scale.linear().range([140, 0]),
        id = barChart.id++,
        axis = d3.svg.axis().orient("bottom"),
        brush = d3.svg.brush(),
        brushDirty,
        dimension,
        group,
        round;
    

    function chart(div) {
      var width = x.range()[1],
          height = y.range()[0];

      y.domain([0, group.top(1)[0].value]);

      div.each(function() {
        var div = d3.select(this),
            g = div.select("g");

        // Create the skeletal chart.
        if (g.empty()) {
          div.select(".title").append("a")
              .attr("href", "javascript:reset(" + id + ")")
              .attr("class", "reset")
              .text("reset")
              .style("display", "none");

          g = div.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("clipPath")
              .attr("id", "clip-" + id)
            .append("rect")
              .attr("width", width)
              .attr("height", height);

          g.selectAll(".bar")
              .data(["background", "foreground"])
            .enter().append("path")
              .attr("class", function(d) { return d + " bar"; })
              .datum(group.all());

          g.selectAll(".foreground.bar")
              .attr("clip-path", "url(#clip-" + id + ")");

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(axis);

          // Initialize the brush component with pretty resize handles.
          var gBrush = g.append("g").attr("class", "brush").call(brush);
          gBrush.selectAll("rect").attr("height", height);
          gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        }

        // Only redraw the brush if set externally.
        if (brushDirty) {
          brushDirty = false;
          g.selectAll(".brush").call(brush);
          div.select(".title a").style("display", brush.empty() ? "none" : null);
          if (brush.empty()) {
            g.selectAll("#clip-" + id + " rect")
                .attr("x", 0)
                .attr("width", width);
        start= null;
        end = null;
        filterNRender(collection);
        
          } else {
            var extent = brush.extent();
            g.selectAll("#clip-" + id + " rect")
                .attr("x", x(extent[0]))
                .attr("width", x(extent[1]) - x(extent[0]));
          }
      
        }

        g.selectAll(".bar").attr("d", barPath);
    
    
      });

      function barPath(groups) {
        var path = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
          path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
        }
        return path.join("");
      }

      function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
    }

    brush.on("brushstart.chart", function() {
      var div = d3.select(this.parentNode.parentNode.parentNode);
      div.select(".title a").style("display", null);

    });

    brush.on("brush.chart", function() {
      var g = d3.select(this.parentNode),
          extent = brush.extent();
      if (round) g.select(".brush")
          .call(brush.extent(extent = extent.map(round)))
        .selectAll(".resize")
          .style("display", null);
      g.select("#clip-" + id + " rect")
          .attr("x", x(extent[0]))
          .attr("width", x(extent[1]) - x(extent[0]));
      dimension.filterRange(extent);
    start=new Date();
    start.setFullYear(extent[0].getFullYear(),0,1)
    end=new Date();
    end.setFullYear(extent[1].getFullYear(),0,1)
    filterNRender(collection);
    });

    brush.on("brushend.chart", function() {
      if (brush.empty()) {
        var div = d3.select(this.parentNode.parentNode.parentNode);
        div.select(".title a").style("display", "none");
        div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
        dimension.filterAll();
    start= null;
    end = null;
    filterNRender(collection);
      }
    });

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      axis.scale(x);
      brush.x(x);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = function(_) {
      if (_) {
        brush.extent(_);
        dimension.filterRange(_);
      } else {
        brush.clear();
        dimension.filterAll();
    start= null;
    end = null;
    filterNRender(collection);
      }
      brushDirty = true;
      return chart;
    };

    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function(_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    return d3.rebind(chart, brush, "on");
  }
  
//scatterplot chart
// set the stage
// bring in the data, and do everything that is data-driven
// set the stage


// bring in the data, and do everything that is data-driven
function renderScattered(data)  {
    //data.sort(function(a, b) { return d3.ascending(b.attack, a.attack); })
    var sc_margin = {sc_t: 30, sc_r: 20, sc_b: 20, sc_l: 60},
        sc_w = 500 - sc_margin.sc_l - sc_margin.sc_r,
        sc_h = 460 - sc_margin.sc_t - sc_margin.sc_b,
        sc_x = d3.time.scale().nice(d3.time.year).range([20, sc_w]),
        sc_y = d3.scale.log().range([sc_h - 60, 0]).nice(),
        //y = d3.scale.linear().range([h - 60, 0]),
        sc_color = d3.scale.category10();

var sc_svg = d3.select("#scattered").append("svg")
        .attr("width", sc_w + sc_margin.sc_l + sc_margin.sc_r)
        .attr("height", sc_h + sc_margin.sc_t + sc_margin.sc_b);

// set axes, as well as details on their ticks
var sc_xAxis = d3.svg.axis()
        .scale(sc_x)
        .ticks(4)
//        .tickSubdivide("4")
    .tickFormat(d3.time.format("%b-%Y"))
    .tickSize(6, 3, 0)
        .orient("bottom");

var sc_yAxis = d3.svg.axis()
        .scale(sc_y)
        .tickFormat(function (d) { return sc_y.tickFormat(10,d3.format(",d"))(d)})
        .tickSubdivide("true")
        .tickSize(6, 3, 0)
        .orient("left");

// group that will contain all of the plots
var sc_groups = sc_svg.append("g").attr("transform", "translate(" + sc_margin.sc_l + "," + sc_margin.sc_t + ")");


  
    //sc_x.domain([1950, 2015]);
  sc_x.domain([
       d3.min(data, function(d) {return d.start ;} )
        , 
        d3.max(data, function(d) {return d.start ;}) ]);
    sc_y.domain([1,4200000]);
        //d3.max(data, function(d) {return d.killed;})]).nice();

    // style the circles, set their locations based on data
    var sc_circles =
            sc_groups.selectAll("circle")
            .data(data)
            .enter().append("circle")
             .attr("class", function(d) { return "circles type_" + sc_colorMapping.indexOf(d.attack); })
            //.filter(function(d){ return d.attack==="Wildfire";} )
            //.filter(function(d){ return d.country==="Thailand";} )
            //.filter(function(d){ return d.region==="Western Europe";} )
            .attr({
        cx: function(d) {
          return sc_x(d.start);
        },
        cy: function(d) {
          return sc_y(d.killed);
        },
        r: 7,
        id: function(d) {
          return d.country;
        }
      })
            .style("fill", function(d) {
      //return color(d.attack);
      sc_colIndex = sc_colorMapping.indexOf(d.attack);
      switch(sc_colIndex)
      {
        case 1:
          return "#1f77b4";
          break;
        case 4:
          return "#ff7f0e";
          break;
        case 3:
          return "#2ca02c";
          break;
        case 5:
          return "#d62728";
          break;
        case 2:
          return "#9467bd";
          break;
        case 6:
          return "#8c564b";
          break;
      }
    });

    // what to do when we mouse over a bubble
    var sc_mouseOn = function(d) {
        var sc_circle = d3.select(this);
    
    msg = "<b>Country:</b> " + d.country 
      + "&nbsp&nbsp&nbsp&nbsp&nbsp <b>attack:</b> " 
      + d.attack + "&nbsp&nbsp&nbsp&nbsp&nbsp <b>Killed:</b> " 
      + (1*d.killed).toLocaleString() + "&nbsp&nbsp&nbsp&nbsp&nbsp <b>Date:</b> " + d.start.getDate() + "-" + month[(d.start.getMonth())] + "-" + d.start.getFullYear();
    d3.select('#info').html(msg);
    
        // transition to increase size/opacity of bubble
        sc_circle.transition()
                .duration(800)
        //.style("opacity", 1)
                .attr("r", 12).ease("elastic");

        // append lines to bubbles that will be used to show the precise data points.
        // translate their location based on margins
        sc_svg.append("g")
                .attr("class", "guide")
                .append("line")
                .attr("x1", sc_circle.attr("cx"))
                .attr("x2", sc_circle.attr("cx"))
                .attr("y1", +sc_circle.attr("cy") + 8)
                .attr("y2", sc_h - sc_margin.sc_t - sc_margin.sc_b)
                .attr("transform", "translate(60,22)")
                .style("stroke", sc_circle.style("fill"))
                .transition().delay(200).duration(400).styleTween("opacity",
                function() {
                    return d3.interpolate(0, .5);
                })

        sc_svg.append("g")
                .attr("class", "guide")
                .append("line")
                .attr("x1", +sc_circle.attr("cx") + 20)
                .attr("x2", 20)
                .attr("y1", sc_circle.attr("cy"))
                .attr("y2", sc_circle.attr("cy") + 10)
                .attr("transform", "translate(40,30)")
                .style("stroke", sc_circle.style("fill"))
                .transition().delay(200).duration(400).styleTween("opacity",
                function() {
                    return d3.interpolate(0, .5);
                });

        // function to move mouseover item to front of SVG stage, in case
        // another bubble overlaps it
        d3.selection.prototype.moveToFront = function() {
            return this.each(function() {
                this.parentNode.appendChild(this);
            });
        };

        // skip this functionality for IE9, which doesn't like it
        if (!$.browser.msie) {
            sc_circle.moveToFront();
        }
    };
    // what happens when we leave a bubble?
    var sc_mouseOff = function() {
        var sc_circle = d3.select(this);
    
        // go back to original size and opacity
    d3.select('#info').html("");
        sc_circle.transition()
                .duration(800)
        //.style("opacity", .5)
                .attr("r", 7).ease("elastic");

        // fade out guide lines, then remove them
        d3.selectAll(".guide").transition().duration(100).styleTween("opacity",
                function() {
                    return d3.interpolate(.5, 0);
                })
                .remove()
    };
  
   var sc_circleClick = function(d) {
        sc_groups.selectAll(".circles")
                .transition()
                .duration(200)
        //.style("opacity", 0)
        .style("visibility", "hidden")
        .ease("elastic");
        
        sc_groups.selectAll(".circles" + "." + this.getAttribute("class").split(" ")[1])
                .transition()
                .duration(200).style("opacity", .65)
                .ease("elastic");
    updateHash({type: d.attack});
    }

    // run the mouseon/out functions
    sc_circles.on("mouseover", sc_mouseOn);
    sc_circles.on("mouseout", sc_mouseOff);
    sc_circles.on("click", sc_circleClick);
    sc_svg.on("dblclick", function() {
       sc_groups.selectAll(".circles")
                .transition()
                .duration(200)
        //.style("opacity", .5)
        .style("visibility", "visible")
                .ease("elastic");
    });

    // tooltips (using jQuery plugin tipsy)
    sc_circles.append("title")
            .text(function(d) {
        return "Country: " + d.country + "\n" + "attack: " + d.attack + " \nKilled: " + (1*d.killed).toLocaleString() + "\nDate: " + d.start.getDate() + "-" + month[(d.start.getMonth())] + "-" + d.start.getFullYear();
    })

    $(".circles").tipsy({gravity: 's', });

    // the legend color guide
    var sc_legend = sc_svg.selectAll("rect")
            .data(sc_attacks)
            .enter().append("rect")
            .attr({
         class: function(i) {
            return "rect type_" + sc_colorMapping.indexOf(i);
        },
        x: function(d, i) {
            return (60 + i * 70);
        },
        y: sc_h,
        width: 25,
        height: 12
    })
            .style("fill", function(d, i) {
        //return color(d);
        //colIndex = colorMapping.indexOf(attacks);
        switch(i+1)
        {
            case 1:
                return "#1f77b4";
                break;
            case 4:
                return "#ff7f0e";
                break;
            case 3:
                return "#2ca02c";
                break;
            case 5:
                return "#d62728";
                break;
            case 2:
                return "#9467bd";
                break;
            case 6:
                return "#8c564b";
                break;
        }
    })
  .on("click", sc_rectClick);
  
  var sc_rectClick = function(d) {
        sc_groups.selectAll(".circles")
                .transition()
                .duration(200)
        //.style("opacity", .01)
        .style("visibility", "hidden")
                .ease("elastic");
        
        sc_groups.selectAll(".circles" + "." + this.getAttribute("class").split(" ")[1])
                .transition()
                .duration(200)
        //.style("opacity", .85)
        .style("visibility", "visible")
                .ease("elastic");
    }
  sc_legend.on("click", sc_rectClick)

    // legend labels  
    sc_svg.selectAll("text")
            .data(sc_attacks)
            .enter().append("text")
            .attr({
        x: function(d, i) {
            return (60 + i * 70);
        },
        y: sc_h + 24,
    })
            .text(function(d) {
        return d;
    });

    // draw axes and axis labels
    sc_svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + sc_margin.sc_l + "," + (sc_h - 60 + sc_margin.sc_t) + ")")
            .call(sc_xAxis);

    sc_svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + sc_margin.sc_l + "," + sc_margin.sc_t + ")")
            .call(sc_yAxis);

    sc_svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", sc_w + 60)
            .attr("y", sc_h - sc_margin.sc_t - 5)
            .text("Year");

    sc_svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("x", -30)
            .attr("y", 65)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Number of Casualty");
};