function showworldmap() {

    //WORLD MAP
    //remove the existing one and plot new map
    _d3v3.select("#worldmap").selectAll("circle").remove();

    // load and display the World

    _d3v3.csv("data/data3.csv", function(error, data) {

        dataset = data;


        var tooltip = _d3v3.select("#worldmap")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");


        var tempStart = _startYear;
        var tempEnd = _endYear;

        if (tempStart == 0) {
            tempStart = 1970;
        }
        if (tempEnd == 0) {
            tempEnd = 2014;
        }


        _g.selectAll("circle")
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
            return _projection([d.longitude, d.latitude])[0];
        })
        .attr("cy", function(d) {
            return _projection([d.longitude, d.latitude])[1];
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
        .on("mouseout", function() {
            return tooltip.style("visibility", "hidden");
        });

    }

    )
};

function mapfocus(){
    if(_regionname==null){
        _d3v3.select("#worldmap").selectAll("svg").remove();
        
        _d3v3.json("data/world-110m2.json", function(error, topology) {
            var worldmapwidth = 1600,
            worldmapheight = 500;
        
            _projection = _d3v3.geo.mercator().center([0, 5])
            .scale(200)
            .rotate([0, 0]);
        
            var worldmapsvg = _d3v3.select("#worldmap").append("svg")
            .attr("width", worldmapwidth)
            .attr("height", worldmapheight)
            .attr("class", "graph-background-white");
        
            var path = _d3v3.geo.path()
            .projection(_projection);
        
            _g = worldmapsvg.append("g");

            _g.selectAll("path")
            .data(topojson.object(topology, topology.objects.countries)
                .geometries)
            .enter()
            .append("path")
            .attr("d", path)

        });
        
    }
    else{
        _d3v3.select("#worldmap").selectAll("svg").remove();
        
        _d3v3.json("data/world-110m2.json", function(error, topology) {
            var worldmapwidth = 1600,
            worldmapheight = 500;
            
            var lat=_regionmap[_regionname][0];
                lon=_regionmap[_regionname][1];
                scale=_regionmap[_regionname][2];
            
            _projection = _d3v3.geo.mercator().center([lat, lon])
            .scale(scale)
            .rotate([0, 0]);
        
            var worldmapsvg = _d3v3.select("#worldmap").append("svg")
            .attr("width", worldmapwidth)
            .attr("height", worldmapheight)
            .attr("class", "graph-background-white");
        
            var path = _d3v3.geo.path()
            .projection(_projection);
        
            _g = worldmapsvg.append("g");

            _g.selectAll("path")
            .data(topojson.object(topology, topology.objects.countries)
                .geometries)
            .enter()
            .append("path")
            .attr("d", path)

        });
        
        
    }
    showworldmap()
};