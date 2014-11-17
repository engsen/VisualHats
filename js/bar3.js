/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

d3.csv("data/data3.csv",function(data){
    
    data.forEach(function(d) {
      d.ntotal = +d.ntotal;
      d.iyear = +d.iyear;
    });
    
    var hgroup = svg.append("g")
          .attr("transform", "translate(450, 0)");
        var histogram = d3.chart.histogram();
        histogram.data(data);
        histogram(hgroup);

    
    //console.log(dataset);
    
    
    
});

