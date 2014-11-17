	function reSortRoot(root,value_key) {
		//console.log("Calling");
		for (var key in root) {
			if (key == "key") {
                                _debugKey += 1;
				root.name = root.key;
				delete root.key;
			}
			if (key == "values") {
                                _debugValues += 1;
				root.children = [];
				for (item in root.values) {
					root.children.push(reSortRoot(root.values[item],value_key));
				}
				delete root.values;
			}
			if (key == value_key) {
                                _debugKV += 1;
				root.value = parseFloat(root[value_key]);
				delete root[value_key];
			}
		}
		return root;
	}

	function drawTree(filterStartYear,filterEndYear) {
		// You can comment out the whole csv section if you just have a JSON file.
    // loadJSONFile('data/portaldata.json');
        
        //d3 = _d3v2;
        //console.log("treemap2-d2");
        
    	d3.csv("data/data3.csv", function(csv_data){
            
        //console.log(csv_data);
        
        var treeData = csv_data;
    
        treeData.forEach(function(d) {
          d.ntotal = +d.ntotal;
          d.iyear = +d.iyear;
        });

        var terror = crossfilter(treeData),
            all = terror.groupAll(),
            year = terror.dimension(function(d) { return d.iyear; }),
            years = year.group(Math.floor);
        
        //console.log(terror.size());
        //console.log(year.top(Infinity));
        
        if (filterStartYear>0){
            year.filterRange([filterStartYear,filterEndYear]);
        }
        
        //console.log(year.top(Infinity).length);
        //console.log(year.top(Infinity));
        
        //terror.remove();
        
        //console.log(terror.size());
        //console.log(year.top(Infinity));
        
        //year.filterAll();

			// Add, remove or change the key values to change the hierarchy. 
      var nested_data = d3.nest()
       				.key(function(d)  { return d.attacktype1_txt; })
       				.key(function(d)  { return d.region_txt; })
       				.key(function(d)  { return d.country_txt; })
       				.key(function(d)  { return d.gname; })
              .key(function(d)  { return d.summary; })
				      .entries(year.top(Infinity));
			
			// Creat the root node for the treemap
			var root = {};
			
			// Add the data to the tree
			root.key = "Terrorism";
			root.values = nested_data;
		
			// Change the key names and children values from .next and add values for a chosen column to define the size of the blocks
			root = reSortRoot(root,"ntotal");
			
			// DEBUG
// 			$("#rawdata").html(JSON.stringify(root));
                        //console.log("resorted");
                        console.log("treemap2.js");
                        console.log(root);
                        console.log(_debugKey);
                        console.log(_debugValues);
                        console.log(_debugKV);
			
			loadData(root);
			
		});


	}