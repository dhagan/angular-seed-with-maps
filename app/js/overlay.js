//function overlay() {

	// Create a Paper.js Path to draw a line into it:
	var path = new Path();
	// Give the stroke a color
	path.strokeColor = 'black';
	var start = new Point(100, 100);
	// Move to start and draw a line from there
	path.moveTo(start);
	// Note the plus operator on Point objects.
	// PaperScript does that for us, and much more!
	path.lineTo(start + [ 100, -50 ]);
	
var maxWidth = 900;
var maxHeight = 700;
var maxPoint = new Point(maxWidth,maxHeight);
var geocoder = new google.maps.Geocoder();
var geocodeText = new PointText();
var geocodeCentre;

var myLatlng = new google.maps.LatLng(51.05, -114.15);
var myOptions = {
  zoom: 14,
  center: myLatlng,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  disableDefaultUI: true
}
var map = new google.maps.Map(document.getElementById("map"), myOptions);

var location = new Path();
var travelPath = new Path();
travelPath.strokeColor = 'blue';
travelPath.strokeWidth = 1;
travelPath.dashArray = [4,2];

var rect = new Path.Rectangle(0,0,maxWidth, maxHeight);
rect.strokeColor = 'black';
rect.strokeWidth = 3;

var currentPoint = new Path.Circle(maxPoint * Point.random(),10);
currentPoint.strokeColor = 'black';
currentPoint.strokeWidth = 3;

var destPoint = maxPoint * Point.random();

function geocode()
{
	var proj = map.getProjection();
	var bounds = map.getBounds();
	var ne = bounds.getNorthEast();
	var sw = bounds.getSouthWest();
	var neWorldXY = proj.fromLatLngToPoint(ne);
	var swWorldXY = proj.fromLatLngToPoint(sw);
	var curPixelX = currentPoint.position.x / Math.pow(2,map.getZoom());
	var curPixelY = currentPoint.position.y / Math.pow(2,map.getZoom());
	var curWorldX = curPixelX + swWorldXY.x;
	var curWorldY = curPixelY + neWorldXY.y;
	var curWorldPoint = new google.maps.Point(curWorldX,curWorldY);
	var curLatLng = proj.fromPointToLatLng(curWorldPoint);
	geocoder.geocode({'latLng': curLatLng}, function(results, status) 
	{
		if (status == google.maps.GeocoderStatus.OK)
		{
			geocodeText.content = results[0].formatted_address;
			geocodeText.visible = true;
			geocodeText.strokeBounds.strokeColor = 'black';
			geocodeText.strokeBounds.strokeWidth = 3;
			geocodeText.characterStyle = {fontSize:200, fillColor: 'black'};
			geocodeText.position = currentPoint.position;
		}
		else
		{
			alert("Geocoder failed due to: " + status);
		}
	});
}

function onFrame(event)
{
	
	/*
	var vector = destPoint - currentPoint.position;	
	currentPoint.position += vector/50;
	if (vector.length < 5)
	{	
		destPoint = maxPoint * Point.random();
		location = new Path.Circle(currentPoint.position, 3);
		location.strokeColor = 'black';
		
		
		travelPath.add(location.position);
		
		var travelRaster = travelPath.rasterize();
		travelPath.removeSegment(0);
		
		geocodeCentre = currentPoint.position;
		geocodeText.visible = false;
		geocode();
	}
	
	geocodeText.characterStyle.fontSize = geocodeText.characterStyle.fontSize - 1;
	geocodeText.position = geocodeCentre;
	
	if (geocodeText.characterStyle.fontSize == 0)
	{
		geocodeText.visible = false;
	}
	*/

}
//}