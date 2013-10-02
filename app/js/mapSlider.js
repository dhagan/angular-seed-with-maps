
var path;

var textItem = new PointText({
	content: 'Click and drag to draw a line.',
	point: new Point(500, 440),
	fillColor: 'black',
});


var track = [
[1.0, 1.1], 
[1.0, 2.1], 
[1.0, 3.1], 
[1.0, 4.1], 
[1.0, 5.1] 
];



function onMouseDown(event) {
	// If we produced a path before, deselect it:
	if (path) {
		path.selected = false;
	}

	// Create a new path and set its stroke color to black:
	path = new Path({
		segments: [event.point],
		strokeColor: 'black',
		// Select the path, so we can see its segment points:
		fullySelected: true
	});
}

// While the user drags the mouse, points are added to the path
// at the position of the mouse:
function onMouseDrag(event) {
	path.add(event.point);

	// Update the content of the text item to show how many
	// segments it has:
	textItem.content = 'Segment count: ' + path.segments.length;
}

// When the mouse is released, we simplify the path:
function onMouseUp(event) {
	var segmentCount = path.segments.length;

	// When the mouse is released, simplify it:
	path.simplify(10);

	// Select the path, so we can see its segments:
	path.fullySelected = true;

	var newSegmentCount = path.segments.length;
	var difference = segmentCount - newSegmentCount;
	var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
	textItem.content = difference + ' of the ' + segmentCount + ' segments were removed. Saving ' + percentage + '%';
}



var maxWidth = 640; //900;
var maxHeight = 480; // 700;
var maxPoint = new Point(maxWidth,maxHeight);
var randLine = new Path.Line();
randLine.strokeColor = 'black';
randLine.opacity = 0;
randLine.dashArray = [3,3];
var pointCount = 0;

var currentPoint = new Path.Star(maxPoint * Point.random(),5,10,3);
currentPoint.strokeColor = 'black';
currentPoint.strokeWidth = 2;

var destPoint = maxPoint * Point.random();

function pointToLatLng(point)
{
	var proj = map.getProjection();
	var bounds = map.getBounds();
	var ne = bounds.getNorthEast();
	var sw = bounds.getSouthWest();
	var neWorldXY = proj.fromLatLngToPoint(ne);
	var swWorldXY = proj.fromLatLngToPoint(sw);
	var curPixelX = point.x / Math.pow(2,map.getZoom());
	var curPixelY = point.y / Math.pow(2,map.getZoom());
	var curWorldX = curPixelX + swWorldXY.x;
	var curWorldY = curPixelY + neWorldXY.y;
	var curWorldPoint = new google.maps.Point(curWorldX,curWorldY);
	var curLatLng = proj.fromPointToLatLng(curWorldPoint);
	return curLatLng;
}

function latLngToPoint(latLng)
{
	var proj = map.getProjection();
	var calWorldPoint = proj.fromLatLngToPoint(latLng);
	var calPixelPointx = calWorldPoint.x * Math.pow(2,map.getZoom());
	var calPixelPointy = calWorldPoint.y * Math.pow(2,map.getZoom());
	var bounds = map.getBounds();
	var ne = bounds.getNorthEast();
	var sw = bounds.getSouthWest();
	var neWorldPoint = proj.fromLatLngToPoint(ne);
	var swWorldPoint = proj.fromLatLngToPoint(sw);
	var ePixelPoint = neWorldPoint.x * Math.pow(2,map.getZoom());
	var nPixelPoint = neWorldPoint.y * Math.pow(2,map.getZoom());
	var wPixelPoint = swWorldPoint.x * Math.pow(2,map.getZoom());
	var sPixelPoint = swWorldPoint.y * Math.pow(2,map.getZoom());
	var screenPixelX = calPixelPointx - wPixelPoint;
	var screenPixelY = calPixelPointy - nPixelPoint;
	var point = new Point(screenPixelX, screenPixelY);
	return point;
}

function calcRoute()
{
	var start = startLatLng;
	var end = endLatLng;
	var request = {
		origin:start,
		destination:end,
		travelMode: google.maps.TravelMode.DRIVING
	};
	dirService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			var dirPath = new Path();
			for (i=0;i<result.routes[0].overview_path.length;i++)
			{
				var point = latLngToPoint(result.routes[0].overview_path[i]);
				dirPath.add(point);
				
				var hitRes = gridGroup.hitTest(point, {segments: true, fill: true, stroke: true, tolerance:3});
			
				if (hitRes)
				{	
					var color = new Color('red');
					color.alpha = gridRaster.getPixel(point/(maxWidth,maxHeight)*(87,68)).alpha + 0.05;
					//alert(gridRaster.getPixel(point/(maxWidth,maxHeight)*(87,68)).gray);
					gridRaster.setPixel(point/(maxWidth,maxHeight)*(87,68), color);
				}
			}
			travelPaths.push(dirPath);
			travelPaths[0].strokeColor = 'red';
			travelPaths[0].strokeWidth = 1;
			travelPaths[0].fullySelected = true;
			if (travelPaths.length > 1)
			{
				travelPaths[0].remove();
				travelPaths.shift();
				travelPaths[0].strokeColor = 'red';
				travelPaths[0].strokeWidth = 1;
				travelPaths[0].fullySelected = true;
			}
		}
	});
}


google.maps.event.addListener(map, 'tilesloaded', function() 
{
	startLatLng = pointToLatLng(currentPoint.position);
});


function onFrame(event)
{

/*
	var vector = destPoint - currentPoint.position;	
	currentPoint.position += vector/10;
	
	randLine.lastSegment.point = currentPoint.position;
	
	if (vector.length < 5)
	{	
		destPoint = maxPoint * Point.random();
		pointCount++;
		if (pointCount % 2 == 0 && pointCount>0)
		{
			endLatLng = pointToLatLng(currentPoint.position);
			calcRoute();
			randLine.firstSegment.point = currentPoint.position;
			randLine.opacity = 0;
		}
		else
		{
			startLatLng = pointToLatLng(currentPoint.position);
			randLine.firstSegment.point = currentPoint.position;
			randLine.opacity = 1;
		}
	}
	*/	

}

function corners() {
	var radius = 5;
	var myCircle = new Path.Circle(new Point(0, 0), radius);
	 myCircle.fillColor = 'black';
	 myCircle = new Path.Circle(new Point(0, maxHeight), radius);
	  myCircle.fillColor = 'black';
	 myCircle = new Path.Circle(new Point(maxWidth, 0), radius);
	  myCircle.fillColor = 'black';
	 myCircle = new Path.Circle(new Point(maxWidth, maxHeight), radius);
	 myCircle.fillColor = 'black';
}

corners();

var y = -50;
var uiValue = 0;

$(function() {  
  $( "#sliderOpacity" ).slider({
      value:0.0,
      step: 1.0,
      min:0,
      max:100,
      slide: function( event, ui ) {
      		textItem.content = 'ui.value: ' + ui.value;
      		console.log(ui.value  , y);
      		uiValue = ui.value;
      		//currentPoint.moveTo(new Point( 100, 100 + (10*ui.value)));
      		//new Path.Star(maxPoint * Point.random(),5,10,3);
      		y = y + ui.value;
      		//path.lineTo(start + [ 100, -50 + (10*ui.value)]);
           //path.lineTo(start + [ 100, y]);
           currentPoint.position.x += ui.value * 10;
			randLine.lastSegment.point = currentPoint.position;
            },
      stop: function( event, ui ) {
            }
    }).attr("title", "Opacity Control");
 // $('.ui-slider-handle').height(50);
});