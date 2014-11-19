/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( document ).ready(function() {
   	
    _startYear = 0;
    _endYear = 0;
    _attackType = null;
        
    _tipYear = 0;
    _tipKill = 0;
    _tipWounded = 0;
    _tipCountry = null;
    _tipCity = null;
    _tipAttackType = null;
    _tipSummary = null;
    
    _tipIncidentCount = "Terrorism Incident Count";
        
    _debugKey = 0;
    _debugValues = 0;
    _debugKV = 0;
       
    _g = null;   
    _projection=null;
    
    drawTreeB();
    drawTree(0,0);
    drawBar(null);
    showworldmap();
        
    writeFilter();
    writeTip();

    _centralamericacaribbean=[-120,25,750];
    _northamerica=[-130,55,350];
    _westereurope=[-20,50,850];
    _middleeastnorthafrica=[-15,35,750];
    _australasiaoceania=[155,0,350];
    _centralasia=[25,50,750];
    _eastasia=[90,35,550];
    _easterneurope=[-5,50,1400];
    _russianic=[70,70,350];
    _southamerica=[-85,-20,450];
    _southasia=[55,25,900];
    _southeastasia=[85,10,900];
    _subsaharaafrica=[-15,-5,600];
    
    _regionmap={};
    _regionmap["Central America & Caribbean"]=_centralamericacaribbean;
    _regionmap["North America"]=_northamerica;
    _regionmap["Western Europe"]=_westereurope;
    _regionmap["Middle East & North Africa"]=_middleeastnorthafrica;
    _regionmap["Australasia & Oceania"]=_australasiaoceania;
    _regionmap["Central Asia"]=_centralasia;
    _regionmap["East Asia"]=_eastasia;
    _regionmap["Eastern Europe"]=_easterneurope;
    _regionmap["Russia & the Newly Independent States (NIS)"]=_russianic;
    _regionmap["South America"]=_southamerica;
    _regionmap["South Asia"]=_southasia;
    _regionmap["Southeast Asia"]=_southeastasia;
    _regionmap["Sub-Saharan Africa"]=_subsaharaafrica;
    _regionname=null;

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
    
    //add calendar
    
});

function writeTip(){
    
    var tipText = "<strong>Year</strong>: ";
    tipText += _tipYear;
    tipText += ", ";
    tipText += "<strong>Attack Type</strong>: ";
    tipText += _tipAttackType;
    tipText += ", &emsp;";
    tipText += "<strong>Killed</strong>: ";
    tipText += _tipKill;
    tipText += ", ";
    tipText += "<strong>Wounded</strong>: ";
    tipText += _tipWounded;
    tipText += ", &emsp;";
    tipText += "<strong>Country</strong>: ";
    tipText += _tipCountry;
    tipText += ", ";
    tipText += "<strong>City</strong>: ";
    tipText += _tipCity;
    tipText += "<br/>";
    tipText += "<strong>Summary</strong>: ";
    tipText += _tipSummary;
    
    $('#incidentText').html(tipText);
}

function writeFilter(){
    
    var filterText = "Year: ";
    filterText += _startYear;
    filterText += "~";
    filterText += _endYear;
    filterText += "   ";
    filterText += "Attack Type: ";
    filterText += _attackType;
    
    $('#activeFilters').text(null);
    console.log(filterText);
    $('#b-title').html(_tipIncidentCount);
    
}
