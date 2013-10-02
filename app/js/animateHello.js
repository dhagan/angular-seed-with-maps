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

google.maps.event.addListener(map, 'tilesloaded', function() 
{
	startLatLng = pointToLatLng(currentPoint.position);
});


function onFrame(event)
{
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
	
}