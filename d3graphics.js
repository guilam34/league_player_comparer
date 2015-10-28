function drawNumGames(dataSet){
	//initialize base variables
	var h = 500;
	var w = 800;
	var graph_h = h - 100;
	var datalen = dataSet.length;
	var maxY = d3.max(dataSet, function(d){
						return (d.games + 5) / 5 * 5;
					});	

	var svg = d3.select("body").select("div").select("div")
				.append("svg")
				.attr("width", w)
				.attr("height", h);				

	drawGrid(svg, graph_h, w, datalen, maxY);	

	linearGradient(svg, "champ-gradient", "#2E0854", "#72587F");

	//Draw bars
	svg.selectAll("rect")
		.data(dataSet)
		.enter()
		.append("rect")
		.attr("fill", "url(#champ-gradient)")
		.attr("x", function(d, i){
			return i * ((w - 60) / datalen) + 30;
		})
		.attr("y", function(d){
			return graph_h - (graph_h / maxY * d.games);
		})
		.attr("width", (w - 60) / datalen - 15)
		.attr("height", function(d){
			return graph_h / maxY * d.games;
		})
		.attr("rx", 2.5)
		.attr("ry", 5);
}

function drawNumRoles(dataSet){
	var h = 500;
	var w = 800;
	var graph_h = h - 100;
	var datalen = dataSet.length;
	var maxY = d3.max(dataSet, function(d){
						return (d.val + 5) / 5 * 5;
					});	

	var svg = d3.select("body").select("div").select("div")
				.append("svg")
				.attr("width", w)
				.attr("height", h);				

	drawGrid(svg, graph_h, w, datalen, maxY);

	linearGradient(svg, "role-gradient", "#00688B", "#6996AD");

	svg.selectAll("rect")
		.data(dataSet)
		.enter()
		.append("rect")
		.attr("fill", "url(#role-gradient)")
		.attr("x", function(d, i){
			return i * ((w - 60) / datalen) + 30;
		})
		.attr("y", function(d){
			return graph_h - (graph_h / maxY * d.val);
		})
		.attr("width", (w - 60) / datalen - 15)
		.attr("height", function(d){
			return graph_h / maxY * d.val;
		})
		.attr("rx", 2.5)
		.attr("ry", 5);	
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

function drawGrid(svg, height, width, datalen, maxY){
	//draw grid
	var xScale = d3.scale.linear()
					.domain([0, datalen])
					.range([0, width]);

	var yScale = d3.scale.linear()
					.domain([0, maxY])
					.range([height, 0]);

	var yAxis = d3.svg.axis()
					.scale(yScale)
				    .orient("left")
				    .innerTickSize(-width)
				    .outerTickSize(0)
				    .tickPadding(10);

	svg.append("g")
		.attr("class", "axis")
		.call(yAxis);

	svg.select("path.domain").remove();	
}