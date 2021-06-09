var div = document.getElementById("wheel-container");
var rect = div.getBoundingClientRect();
  width = rect.width;
  height = rect.height;

var leftMargin = 100;
var topMargin = leftMargin;

var svg = d3.select("#wheel-container")
	.append("svg")
	.attr("width",width)
	.attr("height",height)
    .attr("viewBox", [0, 0, width, height])

var g = svg.append("g");

var sdata;
var figDepth = 2;
var paddingX = width/15; 
var paddingY = height/14; 
// var outerCircleRadius = height/10;

var centerEX = width/2-paddingX*2; //width/3.3;
var centerEH = height/figDepth;

var innerCircRad = width/40;
var smallMarg = innerCircRad/2;//outerCircleRadius/4;
//CHANGES HERE: CAREFUL!
var maxRad = 40;// (height/10); 
var minRad = 7.5;
var maxBar = minRad*4;



var idColors = ["#4EA8BA","#4EA8BA","#46AAB3","#7B9FE3","#9A99FF","#65A4CF"] 
var idNames = ["self-ethicist","others-ethicist","funding","years in field","education","career path"]
var themeColors = ["#CB9AC6","#FDCC9A","#B668AA","#D66B6E","#DC9AA2","#8B6BAA","#EB9C84","#CB9AC6"]
var themeNums = [0,1,2,3,12,23, 13, 123]
var strokeHighlight = .5;
var strokeNormal = .2;
var strokeMin = .2;

var colID = d3.scaleOrdinal()
	.domain(idNames)
	.range(idColors);
var colTHEME = d3.scaleOrdinal()
	.domain(themeNums)
	.range(themeColors);
var posID = [
	{
		"x":centerEX+paddingX+smallMarg*2,
		"y":centerEH-paddingY-smallMarg,
		"rot":15,
		"id":"self-ethicist"
	},
	{
		"x":centerEX+paddingX-smallMarg,
		"y":centerEH-paddingY-smallMarg*3,
		"rot":350,
		"id":"others-ethicist"
	},
	{
		"x":centerEX+paddingX+smallMarg*2,
		"y":centerEH-smallMarg,
		"rot":80,
		"id":"funding"
	},
	{
		"x":centerEX-paddingX/2,
		"y":centerEH+paddingY/2-smallMarg,
		"rot":180,
		"id":"years in field"
	},
	{ 
		"x":centerEX+paddingX*2,
		"y":centerEH+paddingY,
		"rot":80,
		"id":"education"
	},
	{
		"x":centerEX-paddingX/2,
		"y":centerEH-paddingY-smallMarg*3,
		"rot":250,
		"id":"career path"
	}
]
var posTh = [
	{
		"x":centerEX+paddingX*3,
		"y":centerEH-paddingY-smallMarg*3,
		"rot":300,
		"id":"topics"
	},
	{
		"x":centerEX+paddingX*3+smallMarg,
		"y":centerEH-paddingY-smallMarg,
		"rot":80,
		"id":"domain"
	},
	{
		"x":centerEX+paddingX*4.5,
		"y":centerEH+paddingY/2,
		"rot":65,
		"id":"outputs"
	},
	{
		"x":centerEX+paddingX*4.9,
		"y":centerEH+paddingY/2+maxBar*1.5,
		"rot":70,
		"id":"audiences"
	},
	{
		"x":centerEX+paddingX*4.6,
		"y":centerEH-paddingY-smallMarg*4,
		"rot":300,
		"id":"collab type"
	},
	{
		"x":centerEX+paddingX*5,
		"y":centerEH-paddingY-smallMarg*3,
		"rot":40,
		"id":"collab field"
	}
]

var idLine = [posID[5],posID[1],posID[0],posID[2],posID[4]]
var themeLine = [posTh[5],posTh[4],posTh[0],posTh[1],posTh[2],posTh[3]]
var cnctLine = [posID[0],posTh[0]];
var yearLine = [posID[3],posID[0]]
var originX = 0;
var originY = 0;

var idVals = [];
var theVals = [];
var maxTotal = 0;
var maxTheme, maxId = 0;
var barScale = d3.scaleLinear()
	.domain([0, maxTotal]) 
	.range([1, maxBar])

var yearsMax = 52;
var yearScale = d3.scaleLinear()
	.domain([0, yearsMax]) 
	.range([0,360])

var widthScale = d3.scaleLinear()
	.domain([0, 100])
	.range([5, .5])

// var radiusScale = d3.scaleLinear()
// 	.domain([2, 52])
// 	.range([innerCircRad/2, outerCircleRadius])
var radiusScale = d3.scaleLinear()
	.domain([2, 52])
	.range([minRad, maxRad])

var barwide = 3;
var barSpaceSm = minRad+2;
var barSpace = 3;

var barSpaceEd = 3;
var barSpaceCo = 4;
var barSpaceCa = 6;
var barSpaceCd = 5;
var barSpaceTo = minRad;

var yearsRadius = maxRad/1.8;
var lengths = [];
var ft = 8;

function measureText(string, fontSize = ft) {
  const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.278125,0.278125,0.35625,0.55625,0.55625,0.890625,0.6671875,0.1921875,0.334375,0.334375,0.390625,0.584375,0.278125,0.334375,0.278125,0.303125,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.278125,0.278125,0.5859375,0.584375,0.5859375,0.55625,1.015625,0.6671875,0.6671875,0.7234375,0.7234375,0.6671875,0.6109375,0.778125,0.7234375,0.278125,0.5,0.6671875,0.55625,0.834375,0.7234375,0.778125,0.6671875,0.778125,0.7234375,0.6671875,0.6109375,0.7234375,0.6671875,0.9453125,0.6671875,0.6671875,0.6109375,0.278125,0.35625,0.278125,0.478125,0.55625,0.334375,0.55625,0.55625,0.5,0.55625,0.55625,0.278125,0.55625,0.55625,0.2234375,0.2421875,0.5,0.2234375,0.834375,0.55625,0.55625,0.55625,0.55625,0.334375,0.5,0.278125,0.55625,0.5,0.7234375,0.5,0.5,0.5,0.35625,0.2609375,0.3546875,0.590625]
  const avg = 0.5293256578947368
  return string
    .split('')
    .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
    .reduce((cur, acc) => acc + cur) * fontSize
}

d3.json("../data/totals_variation.json").then(function(data) {

	console.log(data);
	sdata = data.children;

	var gid = g.selectAll(".gID")
		.data(sdata[0].children)
		.join("g")
		.attr("class", function(d,i){
			return d.name;
			// posID[i].id;
		})
		.attr('transform', function(d,i){ 		
			if(posID[i].id==d.name){
				return `translate(${posID[i].x}, ${posID[i].y}), rotate(${posID[i].rot},0,0)` 
			}
		});
	var idText = gid.append('text')
		.attr("class", "idText")
		.attr('font-size', ft)
		.attr("x",0)
		.attr("y",2)
		.attr("text-anchor","middle")
		.attr('transform', function(d,i){ 
			return `rotate(${-posID[i].rot},0,0)` 
		})
		.attr("fill","white")
		.text(function(d,i){ return 1+i; })// => d.name);

	var innerCirc = gid
		.append("circle")
		.attr("class", "innerCirc")
		.attr("cx",0)
		.attr("cy",0)
		.attr("r", function(d){
			lengths.push({"name":d.name, "num":d.children.length})
			if(d.name=="years in field"){
				return yearsRadius;
			}else{
				return radiusScale(d.children.length);
			}
		}) 
		.attr("fill","none")
		.attr("stroke","lightgrey");

	var gthe = g.selectAll(".gTHE")
		.data(sdata[1].children)
		.join("g")
		.attr("class", function(d){
			return d.name;
		})
		.attr('transform', function(d,i){ 
			return `translate(${posTh[i].x}, ${posTh[i].y}), rotate(${posTh[i].rot},0,0)` 
		});
	var themeText = gthe.append('text')
		.attr("class", "themeText")
		.attr('font-size', ft)
		.attr('x', 0)
		.attr('y', 2)
		.attr("text-anchor","middle")
		.attr('transform', function(d,i){ 
			return `rotate(${-posTh[i].rot},0,0)` 
		})
		.attr("fill","white")
		.text(function(d,i){ return 7+i });
	var innerCircTheme = gthe
		.append("circle")
		.attr("class", "innerCircTheme")
		.attr("cx",originX)
		.attr("cy",originY)
		.attr("r",function(d){
			lengths.push({"name":d.name, "num":d.children.length})
			return radiusScale(d.children.length);
		})
		.attr("fill","none")
		.attr("stroke","lightgrey");



  	var rectMaxID = gid.selectAll('.rectMaxID')
		.data(d => d.children)
		.join('rect')
		.attr("class", "rectMaxID")
		.attr("width",function(d,i){
			if(d.q=="years" && yearsRadius>0){
				return widthScale(yearsMax);			
			}
			else{
				return barwide;
			}
		})
	    .attr("x", function(d){
	    	for(i=0; i<lengths.length; i++){
				if(d.parent==lengths[i].name){
					radiusHere = radiusScale(lengths[i].num)
				}
	    	}
			if(d.q=="years" && yearsRadius>0){
	    		return originX+(yearsRadius*Math.sin(0));
	    	}else{
		    	return originX+radiusHere*Math.sin(0);
			}
	    })
	    .attr("y", function(d){
	    	for(i=0; i<lengths.length; i++){
				if(d.parent==lengths[i].name){
					radiusHere = radiusScale(lengths[i].num)
				}
	    	}
			if(d.q=="years" && yearsRadius>0){
	    		return originY+(yearsRadius*Math.cos(0)); 
	    	}else{
		    	return originY+radiusHere*Math.cos(0);
			}
	    })
		.attr("transform", function(d,i){
			if(d.q=="years" && yearsRadius>0){ 
				return "rotate("+(yearScale(i))+", 0, 0)";
			}
			if(d.parent=="education"){ 
				return "rotate("+(180+(barwide*barSpaceEd)*i)+", 0, 0)";
			}
			if(d.parent=="career path"){ 
				return "rotate("+(180+(barwide*barSpaceCa)*i)+", 0, 0)";
			}
			if(d.parent=="self-ethicist"||d.parent=="others-ethicist"||d.parent=="funding"){ 
				return "rotate("+(180+(barwide*barSpaceSm)*i)+", 0, 0)";
			}
			else{
				return "rotate("+(180+(barwide*barSpace)*i)+", 0, 0)";
			}
		}) 
		.attr("fill","none")	
		.style("stroke-dasharray","1, 4")
		.attr("stroke",function(d){
			return colID(d.parent);
		})
		.attr("stroke-width",strokeMin)
		.attr("height", maxBar);


  	var rectIdentity = gid.selectAll('.rectID')
		.data(d => d.children)
		.join('rect')
		.attr("class",function(d,i){
			idVals.push(d.total);
			return "rectID";
		})
		.attr("width",function(d,i){
			if(d.q=="years" && yearsRadius>0){
				return widthScale(yearsMax);			
			}
			else{
				return barwide;
			}
		})
		.attr("fill", function(d){
			if(d.value==1){
				return colID(d.parent);
			}
			else{
				return "none"
			}
		})
		.attr("stroke", function(d){
			return colID(d.parent);
		})
		.attr("stroke-width", function(d){
			if(d.value==1){
				return strokeHighlight;
			}
			else{
				return strokeNormal;
			}
		})
	    .attr("x", function(d){
	    	for(i=0; i<lengths.length; i++){
				if(d.parent==lengths[i].name){
					radiusHere = radiusScale(lengths[i].num)
				}
	    	}
			if(d.q=="years" && yearsRadius>0){
	    		return originX+(yearsRadius*Math.sin(0)); 
	    	}
	    	else{
		    	return originX+radiusHere*Math.sin(0);
	    	}
	    })
	    .attr("y", function(d){
	    	for(i=0; i<lengths.length; i++){
				if(d.parent==lengths[i].name){
					radiusHere = radiusScale(lengths[i].num)
				}
	    	}
			if(d.q=="years" && yearsRadius>0){
	    		return originY+(yearsRadius*Math.cos(0)); 
	    	}else{
		    	return originY+radiusHere*Math.cos(0);
	    	}
	    })
		.attr("transform", function(d,i){
			if(d.q=="years" && yearsRadius>0){ 
				return "rotate("+(yearScale(i))+", 0, 0)";
			}
			if(d.parent=="education"){ 
				return "rotate("+(180+(barwide*barSpaceEd)*i)+", 0, 0)";
			}
			if(d.parent=="career path"){ 
				return "rotate("+(180+(barwide*barSpaceCa)*i)+", 0, 0)";
			}
			if(d.parent=="self-ethicist"||d.parent=="others-ethicist"||d.parent=="funding"){ 
				return "rotate("+(180+(barwide*barSpaceSm)*i)+", 0, 0)";
			}
			else{
				return "rotate("+(180+(barwide*barSpace)*i)+", 0, 0)";
			}
		}) 
		.attr("height",0);
	rectIdentity
		.append("title")
      	.text((d) => `${d.name}`)
	maxId = d3.max(idVals);


 	var rectMaxTH = gthe.selectAll('.rectMaxTH')
		.data(d => d.children)
		.join('rect')
		.attr("class", "rectMaxTH")
		.attr("width",function(d,i){
			if(d.q=="years" && yearsRadius>0){
				return widthScale(yearsMax);			
			}
			else{
				return barwide;
			}
		})
		.attr("fill","none")
	    .attr("x", function(d){
	    	for(i=0; i<lengths.length; i++){
				if(d.parent==lengths[i].name){
					radiusHere = radiusScale(lengths[i].num)
				}
	    	}
	    	return originX+radiusHere*Math.sin(0);
	    })
	    .attr("y", function(d){
	    	for(i=0; i<lengths.length; i++){
				if(d.parent==lengths[i].name){
					radiusHere = radiusScale(lengths[i].num)
				}
	    	}
	    	return originX+radiusHere*Math.cos(0);
	    })
		.attr("transform", function(d,i){
			if(d.parent=="collab field"){ 
				return "rotate("+(180+(barwide*barSpaceCo)*i)+", 0, 0)";
			}
			if(d.parent=="domain" || d.parent=="outputs" || d.parent=="audiences"){
				return "rotate("+(180+(barwide*barSpaceCd)*i)+", 0, 0)";
			}
			if(d.parent=="topics"||d.parent=="collab type"){ 
				return "rotate("+(180+(barwide*barSpaceTo)*i)+", 0, 0)";
			}
			else{
				return "rotate("+(180+(barwide*barSpace)*i)+", 0, 0)";
			}
		}) 
		.attr("fill","none")	
		.style("stroke-dasharray","1, 4")
		.attr("stroke",function(d){
			return colTHEME(d.value);
		})
		.attr("stroke-width",strokeMin)
		.attr("height", maxBar)
  	var rectTheme = gthe.selectAll('.rectTHE')
		.data(d => d.children)
		.join('rect')
		.attr("class",function(d){
			theVals.push(d.total);
			return "rectTHE"
		})
		.attr("width", barwide)
		.attr("stroke",function(d){
			return colTHEME(d.value);
		})
		.attr("fill", function(d){
			if(d.value>0){
				return colTHEME(d.value);
			}
			else{
				return "none"
			}
		})
    .attr("x", function(d){
    	for(i=0; i<lengths.length; i++){
			if(d.parent==lengths[i].name){
				radiusHere = radiusScale(lengths[i].num)
			}
    	}
    	return originX+radiusHere*Math.sin(0);
    })
    .attr("y", function(d){
    	for(i=0; i<lengths.length; i++){
			if(d.parent==lengths[i].name){
				radiusHere = radiusScale(lengths[i].num)
			}
    	}
    	return originX+radiusHere*Math.cos(0);
    })
		.attr("transform", function(d,i){
			if(d.parent=="collab field"){ 
				return "rotate("+(180+(barwide*barSpaceCo)*i)+", 0, 0)";
			}
			if(d.parent=="domain" || d.parent=="outputs" || d.parent=="audiences"){
				return "rotate("+(180+(barwide*barSpaceCd)*i)+", 0, 0)";
			}
			if(d.parent=="topics"||d.parent=="collab type"){ 
				return "rotate("+(180+(barwide*barSpaceTo)*i)+", 0, 0)";
			}
			else{
				return "rotate("+(180+(barwide*barSpace)*i)+", 0, 0)";
			}
		}) 
		.attr("height",0)
		.attr("stroke-width", function(d){
			if(d.value==1){
				return strokeHighlight;
			}
			else{
				return strokeNormal;
			}
		});
	maxTheme = d3.max(theVals);

//THIS SHOULD BE TOTAL NUM RESPONDENTS SO FAR
maxTotal = sdata[2].responses;
	// if(maxId>0 && maxTheme>0){
	// 	if(maxId>maxTheme){
	// 		maxTotal = maxId;
	// 	}else{
	// 		maxTotal = maxTheme;
	// 	}
	// }

	if(maxTotal>0){
		barScale.domain([0, maxTotal]) 
		rectIdentity.transition().duration(4000).attr("height", function(d,i){
			return barScale(d.total);
		})
		rectTheme.transition().duration(4000).attr("height", function(d,i){
			return barScale(d.total);
		})
	}


var zoom = d3.zoom()
  .extent([[0, 0], [width, height]])
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

svg
	// .call(zoom)
	.call(zoom.scaleBy, 1.7)


// svg.on("click", reset);

function zoomed({transform}) {
    g.attr("transform", transform);
}

function reset() {
	svg.transition().duration(750)
	.call(
	  zoom.transform,
	  d3.zoomIdentity,
	  d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
	)

}



var valueline =  d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })    
	.curve(d3.curveCatmullRom.alpha(0));

g.append("path")
  .data([idLine])
  .attr("class", "lineID")
  .attr("d", valueline)
g.append("path")
  .data([yearLine])
  .attr("class", "yearID")
  .attr("d", valueline)
g.append("path")
  .data([themeLine])
  .attr("class", "lineTH")
  .attr("d", valueline)
g.append("path")
  .data([cnctLine])
  .attr("class", "lineCN")
  .attr("d", valueline)
d3.selectAll("path").attr("fill","none").attr("stroke","lightgrey")
  .style("stroke-dasharray", ("1,4"))
  .style("stroke-width", .5)
d3.selectAll("circle").attr("stroke-width",.3)
// d3.selectAll("text").attr("fill","none")


var xmargin = 80//rect.width/10;//80;
var ymargin = 20;
var gridH = 400;
var widthBox = xmargin*1.8; 
var heightBox = 50;
// var margin = 
function gridData() {
	var data = new Array();
	var xpos = heightBox/2; //starting xpos and ypos at 1 so the stroke will show when we make the grid below

	var ypos = heightBox/2;
	var index = 0;
	// iterate for rows	
	for (var row = 0; row < 4; row++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for (var column = 0; column < 4; column++) {
				data[row].push({
					x: xpos,
					y: ypos,
					width: widthBox,
					height: heightBox,
					text: index
				})		
			// increment the x position. I.e. move it over by 50 (width variable)
			xpos += xmargin*2;
			index++;
		}
		// reset the x position after a row is complete
		xpos = 1;
		index++;
		// increment the y position for the next row. Move it down 50 (height variable)
		ypos += ymargin*2.5;	
	}
	return data;
}

var gridData = gridData();	
console.log(gridData);

var gridLMarg = 40;
var grid = d3.select("#wheel-legend-container")
	.append("svg")
	.attr("width",rect.width)
	.attr("height",gridH)
var arrow1 = grid.append('image')
    .attr('xlink:href', '../img/arrow2.svg')
    .attr('width', 40)
    .attr('height',40)
    .attr("x",heightBox/2-1)
    .attr("y",ymargin*9.5)
var arrow2 = grid.append('image')
    .attr('xlink:href', '../img/arrow2.svg')
    .attr('width', 40)
    .attr('height',40)
    .attr("x",rect.width/2)
    .attr("y",ymargin*9.5)
var descriptorID = "Identity COLOR = denotes separate question types";
var descriptorTH = "Theme COLOR = answers about your 1st work theme will show up in the light yellow of theme 1, etc.";
var text1 = grid
	.append("foreignObject")
    .attr("width", 140)
    .attr("height",80)
    .attr("y",ymargin*11)
    .attr("x",heightBox)
  .append("xhtml:body")
    .html("<tspan>"+descriptorID+"")
var text2 = grid
	.append("foreignObject")
    .attr("width", 110)
    .attr("height",120)
    .attr("x",rect.width-130)
    .attr("y",ymargin*10.5)
  .append("xhtml:body")
    .html("<tspan>"+descriptorTH+"")



var row = grid.selectAll(".row")
	.data(gridData).join("g").attr("class","row")
	.attr('transform',`translate(${0}, ${0})`)
var column = row.selectAll(".group")
	.data(function(d) { return d; })
	.enter().append("g")
	.attr("class",function(d){
		return d.text})
	.attr('transform',function(d,i){
    	if(d.text==0 ||d.text==2){
				return `translate(${d.x}, ${d.y})` 
    	}else{
				return `translate(${d.x+22}, ${d.y-10})` 
    	}
	})
var wordArray = [
"IDENTITY","","WORK THEMES","","",
"what best describes where you are in your career?",
"are you paid for your work on AI/data ethics?",
"how would you define the broad topic?",
"who else is involved in your work on this theme?","",
"do your colleagues see you as an ethicist?",
"which fields are closest to your education or training?",
"is there a particular domain you look at?",
"what outputs is this work producing?","",
"do you see yourself as an ethicist?",
"how many years have you been in the field of AI ethics?",
"do you collaborate with others in this work?",
"who is the audience of your work?",""]

var numArray=[
"","","","","",
"1.","4.","7.","10.","",
"2.","5.","8.","11.","",
"3.","6.","9.","12.",""
]

var text = column //.selectAll(".legend")
	.append("foreignObject")
    .attr("width", function(d){
    	if(d.text==0 ||d.text==2){
    		return d.width*2; //xmargin*2;
    	}else{
    		return d.width; //xmargin*1.5;
    	}
    })
    .attr("height", function(d){
    		return d.height;
    })
    .attr("y",-20)
    .attr("x",function(d){
    	if(d.text==0 ||d.text==2){
    		return 0;
    	}
    	if(parseInt(d.text)==8 || parseInt(d.text)==13|| parseInt(d.text)==18){
    		return 25;
    	}else{
    		return 20;
    	}
    })
  .append("xhtml:body")
    .html(function(d){
    	if(d.text==0||d.text==2){
    		return "<tspan>"+wordArray[d.text]+""
    	} 
    	return "<tspan>"+wordArray[d.text]+""
    });
var text = column //.selectAll(".legend")
	.append("text")
  	.attr("x",0)
  	.attr("y",0)
  	.attr("dx",10)
    .text(function(d){
    	return numArray[d.text];
    });


var legColors=[
"","","","","",
"#4EA8BA","#7B9FE3","#CB9AC6","#CB9AC6","",
"#4EA8BA","#9A99FF","#CB9AC6","#CB9AC6","",
"#46AAB3","#65A4CF","#CB9AC6","#CB9AC6",""
]

var bars = column 
	.append("rect")
  	.attr("x",10)
  	.attr("y",5)
  	.attr("width",barwide*4)
  	.attr("height",barwide*2)
    .attr("fill",function(d){
    	if(d.text<=4 || parseInt(d.text)==8 || parseInt(d.text)==13|| parseInt(d.text)==18 || parseInt(d.text)==7 || parseInt(d.text)==12 || parseInt(d.text)==17){
  			return "none"
  		}
    	return legColors[d.text];
    })
    .attr("stroke", function(d){
  		if(parseInt(d.text)==8 || parseInt(d.text)==13|| parseInt(d.text)==18 || parseInt(d.text)==7 || parseInt(d.text)==12 || parseInt(d.text)==17){
	    	return legColors[d.text];
			}else{
				return "none";
			}
    })







function tinyGrid() {
	var xmargin = 20;
	var ymargin = 20;
	var widthBox = xmargin*4; 
	var heightBox = xmargin*2;
	var index = 0;
	var data = new Array();
	var xpos = 0; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
	var ypos = 0;
	// iterate for rows	
	for (var row = 0; row < 4; row++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for (var column = 0; column < 2; column++) {
				data[row].push({
					x: xpos,
					y: ypos,
					width: widthBox,
					height: heightBox,
					text: index
				})		
			// increment the x position. I.e. move it over by 50 (width variable)
			xpos += widthBox;
			index++;
		}
		// reset the x position after a row is complete
		xpos = 1;
		index++;
		// increment the y position for the next row. Move it down 50 (height variable)
		ypos += ymargin;	
	}
	return data;
}

var tinyGrid = tinyGrid();	
console.log(tinyGrid);

var trow = grid.selectAll(".trow")
	.data(tinyGrid).join("g").attr("class","trow")
	.attr('transform',`translate(${rect.width/2}, ${220})`)
var tcolumn = trow.selectAll(".tgroup")
	.data(function(d) { return d; })
	.enter().append("g")
	.attr("class",function(d){
		return d.text
	})
	.attr('transform',function(d,i){
		return `translate(${d.x+30}, ${d.y})`
	})
var twordArray = [
"theme 1","theme 1+2","",
"theme 2","theme 2+3","",
"theme 3","theme 1+3","",
"theme 1,2,3"
,""]

var thmText = tcolumn 
	.append("foreignObject")
    .attr("width", function(d){
    	if(d.text==9){
    		return d.width*2; 
    	}else{
    		return d.width;
    	}
    })
    .attr("height", function(d){
    		return d.height;
    })
    .attr("y",-10)
  	.attr("x",function(d){
  		if(d.text==9){
  			return 50;
  		}else{
  			return 20;
  		}
  	})
  .append("xhtml:body")
    .html(function(d){
    	return "<tspan>"+twordArray[d.text]+""
    });

var tlegColors=[
"#FDCC9A","#DC9AA2","",
"#B668AA","#8B6BAA","",
"#D66B6E","#EB9C84","",
"#CB9AC6","",""
]

var tbars = tcolumn 
	.append("rect")
  	.attr("x",function(d){
  		if(d.text==9){
  			return 40;
  		}else{
  			return 9;
  		}
  	})
  	.attr("y",5)
  	.attr("width",barwide*4)
  	.attr("height",barwide*2)
    .attr("fill",function(d){
    	if(d.text==10){
    		return "none";
    	}else{
    		return tlegColors[d.text];
    	}
    })

})


  	// var idNames = ["self-ethicist","others-ethicist","funding","years in field","education","career path"]
// var themeColors = ["#CB9AC6","#FDCC9A","#B668AA","#D66B6E","#DC9AA2","#8B6BAA","#EB9C84","#CB9AC6"]
// var themeNums = [0,1,2,3,12,23, 13, 123]