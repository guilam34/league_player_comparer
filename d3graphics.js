function drawNumGames(dataSet){
	//initialize base variables		
	var h = 500;
	var w = 800;
	var svg = d3.select("body").select("div").select("div")				
				.append("svg")
				.attr("width", w)
				.attr("height", h);	

	var normalized_dataSet = new Array();
	for(var i = 0; i < dataSet.length; i++){
		normalized_dataSet.push({
			"key" : dataSet[i].name,
			"val" : dataSet[i].games
		});
	}

	drawBarGraph(svg, normalized_dataSet, h, w, "purple");

	linearGradient(svg, "purple", "#2E0854", "#72587F");

	var tip = d3.tip()
	  .offset([-10, 0])
	  .attr("class", "d3-tip")
	  .html(function(d) {
	    return "Games: <span style='color:#cc66ff;font-size:15px'>" + d.val + "</span>";
	  });

	svg.selectAll("rect")
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	svg.call(tip);
}

function drawNumRoles(dataSet){
	var h = 500;
	var w = 800;
	var svg = d3.select("body").select("div").select("div")				
				.append("svg")
				.attr("width", w)
				.attr("height", h);	

	var normalized_dataSet = new Array();
	for(var i = 0; i < dataSet.length; i++){
		normalized_dataSet.push({
			"key" : dataSet[i].name,
			"val" : dataSet[i].val,
			"pct" : dataSet[i].pct
		});
	}			

	drawBarGraph(svg, normalized_dataSet, h, w, "blue");

	linearGradient(svg, "blue", "#00688B", "#6996AD");

	var tip = d3.tip()
	  .offset([-10, 0])
	  .attr("class", "d3-tip")
	  .html(function(d) {
	    return "Number of Games: <span style='color:#2ab7ff;font-size:15px'>" + d.val + "</span><br>" +
	    	   "Percent of Games: <span style='color:#2ab7ff;font-size:15px'>" + Math.round(d.pct * 100) + "%";
	  });

	svg.selectAll("rect")
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	svg.call(tip);	
}

function linearGradient(svg, name, color1, color2){
	//Graph gradient
	var barGradient = svg.append("svg:defs").append("svg:linearGradient")
		.attr("id", name)		
		.attr("x1", "0%")
		.attr("y1", "0%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");
		// .attr("gradientUnits", "userSpaceOnUse") this is for gradient across whole graph

	barGradient.append("svg:stop")
				.attr("offset", "0%")
				.attr("stop-color", color1)
				.attr("stop-opacity", 0.95);

	barGradient.append("svg:stop")
				.attr("offset", "100%")
				.attr("stop-color", color2);	
}

function drawBarGraph(svg, dataSet, height, width, color){
	var svg_h = height;
	var svg_w = width;
	var graph_h = svg_h - 100;
	var graph_margin_side = 10;
	var graph_bar_padding = 0.25;	

	//Use ordinal x scale to have a string domain, no interpolation for ordinal scale
	//i.e. if domain is Alice and Bob, scale can't interpret Barbara
	var xScale = d3.scale.ordinal()
					.domain(dataSet.map(function(d){
						return d.key;
					}))
					.rangeRoundBands([0, svg_w], graph_bar_padding); //Note to self: padding is proportion of band width

	//Linear scales have a continuous domain, interpolation of intermediate values
	//i.e. domain is [0,10] then 5 will be interpolated as halfway point of scale
	var yScale = d3.scale.linear()
					.domain([0, d3.max(dataSet, function(d){
						return Math.ceil(d.val * 1.0 / 5) * 5;
					})])
					.range([graph_h, 0]);

	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom");

	var yAxis = d3.svg.axis()
					.scale(yScale)
				    .orient("left")
				    .innerTickSize(-svg_w)
				    .outerTickSize(0)
				    .tickPadding(50);

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0, " + graph_h + ")")
		.call(xAxis);		

	svg.append("g")
		.attr("class", "axis")		
		.call(yAxis);

	//Draw bars
	svg.selectAll("rect")
		.data(dataSet)
		.enter()
		.append("rect")
		.attr("fill", "url(#" + color + ")")
		.attr("x", function(d){
			return xScale(d.key);
		})
		.attr("y", function(d){
			return yScale(0);
		})
		.attr("height", 0)
		.attr("width", xScale.rangeBand())
		.attr("rx", 2.5)
		.attr("ry", 5)		
		.transition().delay(function(d, i){ return i * 50; })
		.duration(750)
		.attr("height", function(d){
			return graph_h - yScale(d.val);
		})
		.attr("y", function(d){
			return yScale(d.val);
		});		
}