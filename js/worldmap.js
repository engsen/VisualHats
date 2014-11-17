function showworldmap() {

    //_d3v3 = __d3v3v3;
    //console.log("worldmap-_d3v3");

    //WORLD MAP
    //remove the existing one and plot new map
    _d3v3.select("#worldmap").selectAll("svg").remove();
    //_d3v3.select("#worldmap").selectAll("div").remove();

    // load and display the World
    _d3v3.json("data/world-110m2.json", function(error, topology) {


        _d3v3.csv("data/data3.csv", function(error, data) {

            dataset = data;

            var worldmapwidth = 960,
                    worldmapheight = 600;

            var projection = _d3v3.geo.mercator().center([0, 5])
                    .scale(200)
                    .rotate([-180, 0]);

            var worldmapsvg = _d3v3.select("#worldmap").append("svg")
                    .attr("width", worldmapwidth)
                    .attr("height", worldmapheight)
                    .attr("class", "graph-background-white");

            var path = _d3v3.geo.path()
                    .projection(projection);

            var g = worldmapsvg.append("g");

            var tooltip = _d3v3.select("#worldmap")
                    .append("div")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden");

            g.selectAll("path")
                    .data(topojson.object(topology, topology.objects.countries)
                            .geometries)
                    .enter()
                    .append("path")
                    .attr("d", path)

            // zoom and pan
            var zoom = _d3v3.behavior.zoom()
                    .on("zoom", function() {
                        g.attr("transform", "translate(" +
                                _d3v3.event.translate.join(",") + ")scale(" + _d3v3.event.scale + ")");
                        g.selectAll("circle")
                                .attr("d", path.projection(projection));
                        g.selectAll("path")
                                .attr("d", path.projection(projection));

                    });

            worldmapsvg.call(zoom);


            var tempStart = _startYear;
            var tempEnd = _endYear;

            //console.log(_startYear);
            //console.log(tempStart);

            if (tempStart == 0) {
                tempStart = 1970;
            }
            if (tempEnd == 0) {
                tempEnd = 2014;
            }

            //console.log(_startYear);
            //console.log(tempStart);

            g.selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .filter(function(d) {
                        if (_attackType == null) {
                            return d.iyear >= tempStart && d.iyear <= tempEnd;
                        } else {
                            return d.attacktype1_txt == _attackType && d.iyear >= tempStart && d.iyear <= tempEnd;
                        }
                    })
                    .attr("cx", function(d) {
                        return projection([d.longitude, d.latitude])[0];
                    })
                    .attr("cy", function(d) {
                        return projection([d.longitude, d.latitude])[1];
                    })
                    .attr("r", function(d) {
                        var tempCircSize = (d.nkill / 10 + d.nwound / 20);
                        tempCircSize = tempCircSize/5; //divide by 50 max value, and x 10 for range
                        tempCircSize = tempCircSize + 4;
                        
                        if (tempCircSize > 15) {
                            return 15;
                        }
                        if (tempCircSize < 4) {
                            return 4;
                        }
                        return tempCircSize;
                    })
                    .style("fill", "red")
                    .on("mouseover", function(d) {

                        _tipYear = d.iyear;
                        _tipKill = d.nkill;
                        _tipWounded = d.nwound;
                        _tipCountry = d.country_txt;
                        _tipCity = d.city;
                        _tipAttackType = d.attacktype1_txt;
                        _tipSummary = d.summary;
                        writeTip();

                        return tooltip.style("visibility", "visible");
                    })
                    .on("mousemove", function() {
                        return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
                    })
                    .on("mouseout", function() {
                        return tooltip.style("visibility", "hidden");
                    });

            //_d3v3 = __d3v3v2;
            //console.log("worldmap-d2");

        }

        )



    });


}