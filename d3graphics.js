function drawNumGames(dataSet){
	var h = 400;
	var w = 800;
	var next5mult = d3.max(dataSet, function(d){
						return d.games;
					});
	var svg = d3.select("body").select("div").select("div")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	var xScale = d3.scale.linear()
					.domain([0, dataSet.length])
					.range([0, w]);

	var yScale = d3.scale.linear()
					.domain([0, d3.max(dataSet, function(d){
						return d[1];
					})])
					.range([h, 0]);

	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("left")
					.ticks(5);

	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("bottom")
					.ticks(5);

	var barGradient = svg.append("svg:defs").append("linearGradient")
		.attr("id", "bar-gradient")
		.attr("gradientUnits", "userSpaceOnUse")
		.attr("x1", "0%")
		.attr("y1", "0%")
		.attr("x2", "100%")
		.attr("y2", "100%");

	barGradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color", "#ff0");
	barGradient.append("stop")
				.attr("offset", "100%")
				.attr("stop-color", "#f00");

	svg.selectAll("rect")
		.data(dataSet)
		.enter()
		.append("rect")
		.attr("fill", "url(#bar-gradient)")
		.attr("x", function(d, i){
			return i * (w / dataSet.length);
		})
		.attr("y", function(d){
			return h - (h / next5mult * d.games);
		})
		.attr("width", w / dataSet.length - 10)
		.attr("height", function(d){
			return h / next5mult * d.games;
		});

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + h + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "axis")
		.call(yAxis);
}