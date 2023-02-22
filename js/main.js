//Declare constants for frame
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


//creates a scale
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

//create a new frame - scatterplot
const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// read data and create plot
d3.csv("data/scatter-data.csv").then((data) => {

  // find max X
  const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
          // Note: data read from csv is a string, so you need to
          // cast it to a number if needed 
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE1 = d3.scaleLinear() 
                    .domain([0, (MAX_X + 1)]) // add some padding  
                    .range([0, VIS_WIDTH]); 

  // Add an x axis to the visualization  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE1).ticks(10)) 
          .attr("font-size", '20px'); 

  // find max Y
  const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });

  //Define scale functions that map our data values
  const Y_SCALE1 = d3.scaleLinear()
  					 .domain([0, (MAX_Y + 1)])
  					 .range([VIS_HEIGHT, 0]);

  //Use X_SCALE1 and Y_SCALE1 to plot our points with appropriate x & y values
  FRAME1.selectAll("points")
  		.data(data) //passed from .then
  		.enter()
  		.append("circle")
  		.attr("cx", (d) => { return (X_SCALE1(d.x) + MARGINS.left); })
  		.attr("cy", (d) => { return (Y_SCALE1(d.y) + MARGINS.bottom); })
  		.attr("r", 10)
  		.attr("class", "point")
      .on("click", function() {
          // get coordinates of the selected point
          x_val = d3.select(this).attr("cx") 
          y_val = d3.select(this).attr("cy") 
          coordinates = ("(" + (X_SCALE1.invert(x_val-MARGINS.left)) + "," + (Y_SCALE1.invert(y_val - MARGINS.bottom)) + ")");

          let newText = "Last point clicked: " + coordinates;
          document.getElementById("lastPt").innerHTML = newText;

          if (d3.select(this).attr("stroke") == "transparent") {
            d3.select(this)
              .attr("stroke", "red");
          }
          else {
            d3.select(this)
              .attr("stroke", "transparent");
            }
          });

  //Add a y-axis to the visualization
  FRAME1.append("g")
  		.attr("transform", "translate(" + MARGINS.bottom + 
              "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(Y_SCALE1).ticks(10)) 
          .attr("font-size", '20px'); 

}); 


//create a new frame for the bar chart
const FRAME2 = d3.select("#vis2")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");



// read data and create plot
d3.csv("data/bar-data.csv").then((data) => {


	// create a scale for x-axis
	const X_SCALE2 = d3.scaleBand()
				.range([0, VIS_WIDTH])
  			.domain(data.map((d) => { return d.category; }))
  			.padding(0.5);


  // find the maximum y-value
  const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.amount); });


  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const Y_SCALE2 = d3.scaleLinear()
  						.domain([0, (MAX_Y2 + 1)])
  						.range([VIS_HEIGHT, 0]);

  const tooltip = d3.select('body').append('div')
                    .attr('class', 'd3-tooltip');


  // Use X_SCALE2 and Y_SCALE2 to plot our points with appropriate x & y values for the bar chart
  FRAME2.selectAll("bars")
      .data(data) //passed from .then
      .enter()
      .append("rect")
        .attr("x", (d) => { return (X_SCALE2(d.category) + MARGINS.left); })
        .attr("y", (d) => { return (Y_SCALE2(d.amount) + MARGINS.bottom); })
        .attr("width", X_SCALE2.bandwidth())
        .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE2(d.amount); })
        .attr("class", "barChart")
        .on("mouseover", function(d, i){
          tooltip.html(`<div>category: ${i.category}</div><div>amount: ${i.amount}</div>`)
                 .attr('class', 'd3-tooltip-visible');
        })
        .on('mousemove', function(d){
          tooltip
            .attr('class', 'd3-tooltip-visible')
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
        })
        .on('mouseout', function () {
          tooltip.html(``).attr('class','d3-tooltip');
      }); 


  	// Add x axis to vis
    FRAME2.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE2).ticks(7)) 
            .attr("font-size", '20px'); 

    // Add y axis to vis
    FRAME2.append("g") 
          .attr("transform", "translate(" + MARGINS.bottom + 
                "," + (MARGINS.top) + ")") 
          .call(d3.axisLeft(Y_SCALE2)) 
            .attr("font-size", '20px'); 

});










	









