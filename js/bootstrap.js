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
        
        _debugKey = 0;
        _debugValues = 0;
        _debugKV = 0;
        
        drawTreeB();
        drawTree(0,0);
        drawBar(null);
        showworldmap();
        
        writeFilter();
        writeTip();

	});

function writeTip(){
    
    var tipText = "<strong>Year</strong>: ";
    tipText += _tipYear;
    tipText += "<br/><strong>Killed</strong>: ";
    tipText += _tipKill;
    tipText += ", ";
    tipText += "<strong>Wounded</strong>: ";
    tipText += _tipWounded;
    tipText += "<br/>";
    tipText += "<strong>Country</strong>: ";
    tipText += _tipCountry;
    tipText += ", ";
    tipText += "<strong>City</strong>: ";
    tipText += _tipCity;
    tipText += "<br/>";
    tipText += "<strong>Attack Type</strong>: ";
    tipText += _tipAttackType;
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
    
    $('#activeFilters').text(filterText);
    
}
